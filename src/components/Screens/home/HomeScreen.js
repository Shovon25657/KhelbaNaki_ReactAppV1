import React, { useContext, useState, useRef, useCallback, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  TouchableOpacity,
  Text,
  Vibration,
  Platform,
  Image,
  Alert
} from 'react-native';
import { AuthContext } from '../../context/authContext';
import { UserDataContext } from '../../context/UserDataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Feather';
import BottomNavBar from '../../common/BottomNavBar';
import person1 from '../../../../assets/Alex.jpg';
import person2 from '../../../../assets/Angry_Avater.jpg';
import person3 from '../../../../assets/cartoon-character-with-handbag-sunglasses.jpg';
import CardSwiper from '../../Screens/home/common/CardSwiper';
import ActionButtons from '../../Screens/home/common/ActionButtons';
import SlideInMenu from '../../Screens/home/common/SlideInMenu';
import ConfirmationModal from '../../Screens/home/common/ConfirmationModal';
import Header from '../../Screens/home/common/Header';

const { width, height } = Dimensions.get('window');

const defaultImages = [person1, person2, person3];

const HomeScreen = () => {
  const [state, setState] = useContext(AuthContext);
  const { 
    allUsers,
    allUsersLoading,
    allUsersError,
    refreshAllUsers,
    userProfile,
    likeUser,
    dislikeUser,
    matches,
    unseenMatches,
    refreshMatches
  } = useContext(UserDataContext);
  
  const navigation = useNavigation();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextCardScale = useRef(new Animated.Value(0.9)).current;
  const [isTransitioning, setIsTransitioning] = useState(false);
  const swipeRef = useRef(null);
  const [profileQueue, setProfileQueue] = useState([]);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isQueueExhausted, setIsQueueExhausted] = useState(false);
  const processedUserIds = useRef(new Set());
  const dislikedProfiles = useRef([]);
  const queueUpdateTimeout = useRef(null);

  const transformUserData = useCallback((user) => {
    if (!user) return null;
    
    let games = [];
    if (user.games && Array.isArray(user.games)) {
      games = user.games.filter(g => g).map(g => g || 'Unknown Game');
    } else if (user.gamesPlayed?.gamesPlayed && Array.isArray(user.gamesPlayed.gamesPlayed)) {
      games = user.gamesPlayed.gamesPlayed
        .filter(g => g)
        .map(g => g.playedGameName || 'Unknown Game');
    }

    const randomDefaultImage = defaultImages[Math.floor(Math.random() * defaultImages.length)];

    return {
      id: user.id || user._id,
      gamingName: user.gamingName || user.username || 'Anonymous',
      age: user.age || 'Not specified',
      games: games,
      image: user.avatar ? { uri: user.avatar } : randomDefaultImage
    };
  }, []);

  const updateProfileQueue = useCallback(() => {
    if (allUsersLoading || !allUsers || isFetchingNext || isTransitioning || isQueueExhausted) return;
    
    setIsFetchingNext(true);
    
    try {
      const currentUserId = userProfile?.id || userProfile?._id;
      const availableUsers = allUsers.filter(user => {
        const userId = user.id || user._id;
        return userId !== currentUserId && !processedUserIds.current.has(userId);
      });
      
      const currentQueueSize = profileQueue.length;
      const neededProfiles = Math.max(0, 3 - currentQueueSize);
      
      if (neededProfiles > 0 && availableUsers.length > 0) {
        const newUsers = availableUsers.slice(0, neededProfiles);
        
        const newProfiles = newUsers.map(user => {
          const userId = user.id || user._id;
          processedUserIds.current.add(userId);
          return transformUserData(user);
        }).filter(profile => profile !== null);
        
        setProfileQueue(prev => [...prev, ...newProfiles]);
        setIsQueueExhausted(false);
      } else if (neededProfiles > 0 && availableUsers.length === 0 && dislikedProfiles.current.length > 0) {
        setProfileQueue(prev => [...prev, ...dislikedProfiles.current]);
        dislikedProfiles.current = [];
        setIsQueueExhausted(false);
      } else if (neededProfiles > 0 && availableUsers.length === 0 && dislikedProfiles.current.length === 0) {
        setIsQueueExhausted(true);
      }
    } catch (error) {
      console.error('Error updating profile queue:', error);
    } finally {
      setIsFetchingNext(false);
    }
  }, [allUsers, allUsersLoading, isFetchingNext, profileQueue.length, transformUserData, userProfile, isTransitioning, isQueueExhausted]);

  useEffect(() => {
    if (!hasInitialized && !allUsersLoading && allUsers?.length >= 0) {
      setProfileQueue([]);
      processedUserIds.current.clear();
      dislikedProfiles.current = [];
      setHasInitialized(true);
      setIsQueueExhausted(allUsers.length === 0);
      if (!allUsersLoading && allUsers.length > 0) {
        updateProfileQueue();
      }
    }
  }, [allUsers, allUsersLoading, hasInitialized, updateProfileQueue]);

  useEffect(() => {
    if (hasInitialized && profileQueue.length < 2 && !isFetchingNext && !allUsersLoading && !isTransitioning && !isQueueExhausted) {
      if (queueUpdateTimeout.current) clearTimeout(queueUpdateTimeout.current);
      queueUpdateTimeout.current = setTimeout(() => {
        updateProfileQueue();
      }, 500);
    }
    return () => {
      if (queueUpdateTimeout.current) clearTimeout(queueUpdateTimeout.current);
    };
  }, [hasInitialized, profileQueue.length, updateProfileQueue, isFetchingNext, allUsersLoading, isTransitioning, isQueueExhausted]);

  useFocusEffect(
    useCallback(() => {
      if (!allUsersLoading && !hasInitialized) {
        refreshAllUsers();
      }
      nextCardScale.setValue(0.9);
      return () => {};
    }, [refreshAllUsers, nextCardScale, allUsersLoading, hasInitialized])
  );

  const handleLike = useCallback(async () => {
    if (profileQueue[0] && !isTransitioning) {
      setIsTransitioning(true);
      try {
        const result = await likeUser(profileQueue[0].id);
        
        if (result?.isMatch) {
          Alert.alert(
            '🎉 Match!',
            `You matched with ${profileQueue[0].gamingName}!`,
            [{ text: 'OK', onPress: () => refreshMatches() }]
          );
        }
        
        console.log('Liked:', profileQueue[0]?.gamingName);
        handleSwipeComplete();
      } catch (error) {
        console.error('Like error:', error);
        Alert.alert('Error', error.response?.data?.message || 'Failed to like user');
        setIsTransitioning(false);
      }
    }
  }, [profileQueue, isTransitioning, handleSwipeComplete, likeUser, refreshMatches]);

  const handleDislike = useCallback(async () => {
    if (profileQueue[0] && !isTransitioning) {
      setIsTransitioning(true);
      try {
        await dislikeUser(profileQueue[0].id);
        console.log('Disliked:', profileQueue[0]?.gamingName);
        dislikedProfiles.current.push(profileQueue[0]);
        handleSwipeComplete();
      } catch (error) {
        console.error('Dislike error:', error);
        Alert.alert('Error', error.response?.data?.message || 'Failed to dislike user');
        setIsTransitioning(false);
      }
    }
  }, [profileQueue, isTransitioning, handleSwipeComplete, dislikeUser]);

  const handleSwipeComplete = useCallback(() => {
    setProfileQueue(prev => prev.slice(1));
    setCurrentIndex(prev => prev + 1);
    setTimeout(() => setIsTransitioning(false), 300);
  }, []);

  const handleButtonSwipe = useCallback((direction) => {
    if (isTransitioning || !profileQueue[0]) return;
    
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Vibration.vibrate(50);
    }
    
    if (swipeRef.current) {
      swipeRef.current.triggerSwipe(direction);
    }
  }, [isTransitioning, profileQueue]);

  const handleRefresh = useCallback(() => {
    setProfileQueue([]);
    processedUserIds.current.clear();
    dislikedProfiles.current = [];
    setHasInitialized(false);
    setCurrentIndex(0);
    setIsTransitioning(false);
    setIsQueueExhausted(false);
    refreshAllUsers();
  }, [refreshAllUsers]);

  const ProfileCard = ({ profile }) => {
    if (!profile || !profile.image) {
      return null;
    }

    return (
      <View style={styles.profileCardContainer}>
        <Image 
          source={profile.image} 
          style={styles.profileImage} 
          resizeMode="cover"
          defaultSource={person1}
        />
        <View style={styles.profileInfoContainer}>
          <Text style={styles.profileName}>
            {profile.gamingName}, {profile.age}
          </Text>
          {profile.games && profile.games.length > 0 ? (
            <View style={styles.gamesContainer}>
              <Text style={styles.gamesTitle}>TOP GAMES:</Text>
              {profile.games.slice(0, 3).map((game, index) => (
                <Text key={`${profile.id}-${index}`} style={styles.gameText}>
                  • {game}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.noGamesText}>No games listed</Text>
          )}
        </View>
      </View>
    );
  };

  const renderProfileCard = () => {
    const currentProfile = profileQueue[0];
    
    if (allUsersLoading && profileQueue.length === 0) {
      return (
        <View style={[styles.card, styles.centerContent]}>
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      );
    }

    if (allUsersError) {
      return (
        <View style={[styles.card, styles.centerContent]}>
          <Icon name="error-outline" size={40} color="#ff3b30" />
          <Text style={styles.errorText}>Failed to load users</Text>
          <Text style={styles.errorSubText}>
            {allUsersError.toString()}
          </Text>
          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={handleRefresh}
          >
            <Text style={styles.resetButtonText}>TRY AGAIN</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!currentProfile && isQueueExhausted) {
      return (
        <View style={[styles.card, styles.centerContent]}>
          <Icon2 name="user-x" size={50} color="#01e1ff" />
          <Text style={styles.noProfilesText}>Looking for new users</Text>
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={handleRefresh}
          >
            <Icon name="refresh" size={20} color="white" />
            <Text style={styles.refreshButtonText}>REFRESH</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return currentProfile ? <ProfileCard profile={currentProfile}or /> : null;
  };

  const renderNextCard = () => {
    const nextProfile = profileQueue[1];
    
    if (!nextProfile || !nextProfile.image) {
      return null;
    }

    return (
      <Animated.View style={[styles.card, styles.nextCard, { transform: [{ scale: nextCardScale }] }]}>
        <ProfileCard profile={nextProfile} />
      </Animated.View>
    );
  };

  const menuItems = [
    { icon: 'account-circle', label: 'ACCOUNT', onPress: () => navigation.navigate('Profile') },
    { icon: 'settings', label: 'SETTINGS', onPress: () => navigation.navigate('Settings') }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#1a1a2e" barStyle="light-content" />
      <View style={styles.mainContainer}>
        <Header 
          title="HOME"
          onMenuPress={() => setShowSideMenu(true)}
          onActionPress={() => navigation.navigate('EditPackage')}
          badgeCount={unseenMatches}
        />
        
        <View style={styles.cardContainer}>
          {renderNextCard()}
          <CardSwiper
            ref={swipeRef}
            onSwipeLeft={handleDislike}
            onSwipeRight={handleLike}
            onSwipeComplete={handleSwipeComplete}
            currentIndex={currentIndex}
            nextCardScale={nextCardScale}
            onAnimationComplete={() => setIsTransitioning(false)}
          >
            <View style={styles.card}>
              {renderProfileCard()}
            </View>
          </CardSwiper>
        </View>
        
        <ActionButtons 
          onLike={() => handleButtonSwipe(1)}
          onDislike={() => handleButtonSwipe(-1)}
          isTransitioning={isTransitioning}
          disabled={!profileQueue[0] || allUsersLoading || allUsersError}
        />
      </View>

      <SlideInMenu
        visible={showSideMenu}
        onClose={() => setShowSideMenu(false)}
        menuItems={menuItems}
        onLogout={() => setShowLogoutModal(true)}
        onPrivacyPolicy={() => navigation.navigate('Privacy')}
        onLuminaries={() => navigation.navigate('Luminaries')}
      />

      <ConfirmationModal
        visible={showLogoutModal}
        title="CONFIRM LOGOUT"
        message="Are you sure you want to logout?"
        onConfirm={async () => {
          await AsyncStorage.removeItem('@auth');
          setState({ ...state, user: null, token: '' });
          navigation.navigate('Welcome');
          setShowLogoutModal(false);
        }}
        onCancel={() => setShowLogoutModal(false)}
      />
      
      <BottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgb(1, 12, 20)',
  },
  mainContainer: {
    flex: 1,
    marginBottom: 0,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: '2%',
  },
  card: {
    width: width * 0.85,
    height: height * 0.6,
    borderRadius: 15,
    backgroundColor: 'rgb(4, 1, 21)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(86, 57, 246, 0.28)',
  },
  profileCardContainer: {
    width: '100%',
    height: '100%',
  },
  profileImage: {
    width: '100%',
    height: '70%',
  },
  profileInfoContainer: {
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    height: '30%',
    justifyContent: 'center',
  },
  profileName: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  gamesContainer: {
    marginTop: 5,
  },
  gamesTitle: {
    color: '#01e1ff',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 5,
  },
  gameText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
  },
  noGamesText: {
    color: 'rgba(255,255,255,0.5)',
    fontStyle: 'italic',
  },
  nextCard: {
    position: 'absolute',
    opacity: 0.85,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#01e1ff',
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  errorSubText: {
    color: 'rgba(255, 59, 48, 0.7)',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  noProfilesText: {
    color: '#01e1ff',
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    padding: 12,
    borderRadius: 25,
    width: 150,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff3b30',
    marginTop: 10,
  },
  resetButtonText: {
    color: '#ff3b30',
    fontWeight: 'bold',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(1, 225, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgb(1, 225, 255)',
  },
  refreshButtonText: {
    color: 'rgb(1, 225, 255)',
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

export default HomeScreen;