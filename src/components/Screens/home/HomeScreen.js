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
  ActivityIndicator
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

const HomeScreen = () => {
  const [state, setState] = useContext(AuthContext);
  const { 
    allUsers,
    allUsersLoading,
    allUsersError,
    refreshAllUsers,
    loading,
    error
  } = useContext(UserDataContext);
  
  const navigation = useNavigation();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextCardScale = useRef(new Animated.Value(0.9)).current;
  const [isTransitioning, setIsTransitioning] = useState(false);
  const swipeRef = useRef(null);
  const [profileQueue, setProfileQueue] = useState([null, null, 'loading']);
  const [isFetching, setIsFetching] = useState(false);

  // Transform user data for display
  const transformUserData = useCallback((user) => {
    if (!user) return null;
    
    let games = [];
    // FIRST check the "games" field from the API response
    if (user.games) {
      games = user.games.map(g => g || 'Unknown Game');
    } 
    // Fallback to nested data (if backend changes)
    else if (user.gamesPlayed?.gamesPlayed) {
      games = user.gamesPlayed.gamesPlayed.map(g => g.playedGameName || 'Unknown Game');
    }

    return {
      id: user.id || user._id,
      gamingName: user.gamingName || user.username || 'Anonymous',
      age: user.age || 'Not specified',
      games: games,
      image: user.avatar ? { uri: user.avatar } : [person1][Math.floor(Math.random() * 3)]
    };
  }, []);

  // Fetch next profile for the queue
  const fetchNextProfile = useCallback(async () => {
    if (isFetching || !allUsers || profileQueue[2] !== 'loading') return;
    
    setIsFetching(true);
    try {
      // Find next user not already in queue
      const nextUser = allUsers.find(user => 
        !profileQueue.some(item => item && item.id === (user.id || user._id))
      );

      if (nextUser) {
        const transformed = transformUserData(nextUser);
        setProfileQueue(prev => [prev[0], prev[1], transformed]);
      } else {
        // No more users available
        setProfileQueue(prev => [prev[0], prev[1], null]);
      }
    } finally {
      setIsFetching(false);
    }
  }, [allUsers, isFetching, profileQueue, transformUserData]);

  // Initialize queue when data loads
  useEffect(() => {
    if (!allUsersLoading && allUsers?.length > 0) {
      const firstUser = transformUserData(allUsers[0]);
      const secondUser = allUsers.length > 1 ? transformUserData(allUsers[1]) : null;
      setProfileQueue([firstUser, secondUser, 'loading']);
    }
  }, [allUsers, allUsersLoading, transformUserData]);

  // Fetch next profile when needed
  useEffect(() => {
    if (profileQueue[2] === 'loading' && !isFetching) {
      fetchNextProfile();
    }
  }, [profileQueue, isFetching, fetchNextProfile]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      nextCardScale.setValue(0.9);
      refreshAllUsers();
      return () => {};
    }, [refreshAllUsers, nextCardScale])
  );

  const handleLike = () => {
    console.log('Liked:', profileQueue[0]?.gamingName);
    handleSwipeComplete();
  };

  const handleDislike = () => {
    console.log('Disliked:', profileQueue[0]?.gamingName);
    handleSwipeComplete();
  };

  const handleSwipeComplete = () => {
    setProfileQueue(prev => {
      // Shift queue forward and set last slot to loading
      const newQueue = [prev[1], prev[2], 'loading'];
      return newQueue;
    });
  };

  const handleButtonSwipe = (direction) => {
    if (isTransitioning || !profileQueue[0]) return;
    setIsTransitioning(true);
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Vibration.vibrate(50);
    }
    if (swipeRef.current) {
      swipeRef.current.triggerSwipe(direction);
    }
  };

  const ProfileCard = ({ profile }) => (
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

  const renderProfileCard = () => {
    const currentProfile = profileQueue[0];
    
    if (allUsersLoading) {
      return (
        <View style={[styles.card, styles.centerContent]}>
          <ActivityIndicator size="large" color="#01e1ff" />
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
            {allUsersError.message || allUsersError.toString()}
          </Text>
          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={refreshAllUsers}
          >
            <Text style={styles.resetButtonText}>TRY AGAIN</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!currentProfile) {
      return (
        <View style={[styles.card, styles.centerContent]}>
          <Icon2 name="user-x" size={50} color="#01e1ff" />
          <Text style={styles.noProfilesText}>No users available</Text>
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={refreshAllUsers}
          >
            <Icon name="refresh" size={20} color="white" />
            <Text style={styles.refreshButtonText}>REFRESH</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return <ProfileCard profile={currentProfile} />;
  };

  const renderNextCard = () => {
    const nextProfile = profileQueue[1];
    
    if (!nextProfile) return null;

    return (
      <Animated.View style={[styles.card, styles.nextCard, { transform: [{ scale: nextCardScale }] }]}>
        <ProfileCard profile={nextProfile} />
      </Animated.View>
    );
  };

  const renderLoadingCard = () => {
    if (profileQueue[2] === 'loading') {
      return (
        <View style={[styles.card, styles.loadingCard]}>
          <ActivityIndicator size="large" color="#01e1ff" />
          <Text style={styles.loadingText}>Finding more users...</Text>
        </View>
      );
    }
    return null;
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
        />
        
        <View style={styles.cardContainer}>
          {renderNextCard()}
          {renderLoadingCard()}
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
  loadingCard: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    opacity: 0.7,
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