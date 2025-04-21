import React, { useContext, useState, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Animated, 
  PanResponder, 
  Modal, 
  SafeAreaView,
  StatusBar,
  Dimensions,
  Vibration,
  Platform
} from 'react-native';
import { AuthContext } from '../../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Feather';
import BottomNavBar from '../../common/BottomNavBar';

const { width, height } = Dimensions.get('window');

const SWIPE_THRESHOLD = width * 0.25;
const SWIPE_OUT_DURATION = 250;

const HomeScreen = () => {
  const [state, setState] = useContext(AuthContext);
  const navigation = useNavigation();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const [profiles, setProfiles] = useState([
    {
      id: 1,
      name: 'xXProGamerXx',
      age: 28,
      games: ['Fortnite', 'Valorant', 'Apex Legends'],
      image: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: 2,
      name: 'PixelQueen',
      age: 24,
      games: ['League of Legends', 'Overwatch', 'Dota 2'],
      image: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      id: 3,
      name: 'HeadshotHunter',
      age: 26,
      games: ['Call of Duty', 'PUBG', 'CS:GO'],
      image: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      id: 4,
      name: 'NoobSlayer',
      age: 25,
      games: ['Rocket League', 'FIFA', 'NBA 2K'],
      image: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const swipe = useRef(new Animated.ValueXY()).current;
  const tilt = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const nextCardScale = useRef(new Animated.Value(0.9)).current;
  const [isTransitioning, setIsTransitioning] = useState(false);
  const tapTimestamp = useRef(0);

  // Reset animations when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      resetCardAnimations();
      return () => {};
    }, [])
  );

  const resetCardAnimations = () => {
    swipe.setValue({ x: 0, y: 0 });
    tilt.setValue(0);
    cardOpacity.setValue(1);
    cardScale.setValue(1);
    nextCardScale.setValue(0.9);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gestureState) => {
        // Store tap timestamp to differentiate between taps and swipes
        tapTimestamp.current = Date.now();
        return true;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only handle as swipe if there's significant horizontal movement
        const hasMovedEnough = Math.abs(gestureState.dx) > 10;
        const isDraggingHorizontally = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        const isQuickTap = Date.now() - tapTimestamp.current < 150;
        return hasMovedEnough && isDraggingHorizontally && !isQuickTap;
      },
      onPanResponderMove: (_, { dx, dy }) => {
        // Update position and rotation based on drag
        swipe.setValue({ x: dx, y: dy / 3 }); // Reduce vertical movement for better control
        tilt.setValue(dx / 10); // More subtle rotation
        
        // Scale and fade animations based on swipe distance
        const swipeDistance = Math.abs(dx);
        const maxDistance = width * 0.5;
        const progressRatio = Math.min(swipeDistance / maxDistance, 1);
        
        // Scale down current card slightly as it moves away
        cardScale.setValue(1 - 0.05 * progressRatio);
        
        // Scale up next card as current card moves away
        nextCardScale.setValue(0.9 + 0.1 * progressRatio);
      },
      onPanResponderRelease: (_, { dx, dy, vx, vy }) => {
        const direction = Math.sign(dx);
        const speed = Math.abs(vx);
        const isActionActive = Math.abs(dx) > SWIPE_THRESHOLD || speed > 0.5;
        
        if (isActionActive) {
          setIsTransitioning(true);
          
          // Vibrate for haptic feedback
          if (Platform.OS === 'ios' || Platform.OS === 'android') {
            Vibration.vibrate(50);
          }

          // Animate card exit
          Animated.parallel([
            Animated.timing(swipe, {
              toValue: { 
                x: direction * (width + 100), 
                y: dy 
              },
              duration: SWIPE_OUT_DURATION,
              useNativeDriver: true
            }),
            Animated.timing(cardOpacity, {
              toValue: 0,
              duration: SWIPE_OUT_DURATION,
              useNativeDriver: true
            }),
            Animated.spring(nextCardScale, {
              toValue: 1,
              friction: 6,
              tension: 40,
              useNativeDriver: true
            })
          ]).start(() => {
            if (direction > 0) {
              handleLike();
            } else {
              handleDislike();
            }
            handleSwipeComplete();
          });
        } else {
          // Return card to center with spring physics for natural bounce
          Animated.parallel([
            Animated.spring(swipe, {
              toValue: { x: 0, y: 0 },
              friction: 7,
              tension: 40,
              useNativeDriver: true
            }),
            Animated.spring(tilt, {
              toValue: 0,
              friction: 7,
              tension: 40,
              useNativeDriver: true
            }),
            Animated.spring(cardScale, {
              toValue: 1,
              friction: 7,
              tension: 40,
              useNativeDriver: true
            }),
            Animated.spring(nextCardScale, {
              toValue: 0.9,
              friction: 7,
              tension: 40,
              useNativeDriver: true
            })
          ]).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.parallel([
          Animated.spring(swipe, {
            toValue: { x: 0, y: 0 },
            friction: 7,
            tension: 40,
            useNativeDriver: true
          }),
          Animated.spring(cardScale, {
            toValue: 1,
            friction: 7,
            tension: 40,
            useNativeDriver: true
          }),
          Animated.spring(nextCardScale, {
            toValue: 0.9,
            friction: 7,
            tension: 40,
            useNativeDriver: true
          })
        ]).start();
      }
    })
  ).current;

  const handleSwipeComplete = () => {
    const nextIndex = currentIndex < profiles.length - 1 ? currentIndex + 1 : 0;
    
    // Reset animation values
    swipe.setValue({ x: 0, y: 0 });
    tilt.setValue(0);
    cardOpacity.setValue(1);
    cardScale.setValue(1);
    nextCardScale.setValue(0.9);
    
    // Slight delay for smoother transition
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setIsTransitioning(false);
    }, 100);
  };

  const rotateCard = tilt.interpolate({
    inputRange: [-width/2, 0, width/2],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp'
  });

  const animatedCardStyles = {
    transform: [
      { translateX: swipe.x },
      { translateY: swipe.y },
      { rotate: rotateCard },
      { scale: cardScale }
    ],
    opacity: cardOpacity
  };

  const nextCardAnimatedStyles = {
    transform: [
      { scale: nextCardScale }
    ]
  };

  const likeOpacity = swipe.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const dislikeOpacity = swipe.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  // Dynamic colors for like/dislike badges
  const likeBgOpacity = swipe.x.interpolate({
    inputRange: [0, width/4, width/2],
    outputRange: [0.5, 0.8, 0.9],
    extrapolate: 'clamp'
  });

  const dislikeBgOpacity = swipe.x.interpolate({
    inputRange: [-width/2, -width/4, 0],
    outputRange: [0.9, 0.8, 0.5],
    extrapolate: 'clamp'
  });

  const likeScale = swipe.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD, width/2],
    outputRange: [0.8, 1, 1.2],
    extrapolate: 'clamp'
  });

  const dislikeScale = swipe.x.interpolate({
    inputRange: [-width/2, -SWIPE_THRESHOLD, 0],
    outputRange: [1.2, 1, 0.8],
    extrapolate: 'clamp'
  });

  const handleLike = () => {
    console.log('Liked:', profiles[currentIndex].name);
  };

  const handleDislike = () => {
    console.log('Disliked:', profiles[currentIndex].name);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
    setShowSideMenu(false);
  };

  const confirmLogout = async () => {
    try {
      await AsyncStorage.removeItem('@auth');
      setState({ ...state, user: null, token: '' });
      navigation.navigate('Welcome');
      setShowLogoutModal(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile', { profile: profiles[currentIndex] });
  };

  const navigateToPrivacyPolicy = () => {
    setShowSideMenu(false);
    navigation.navigate('Privacy');
  };

  const renderNextProfile = () => {
    if (currentIndex >= profiles.length - 1) return null;
    
    const nextProfile = profiles[currentIndex + 1];
    
    return (
      <Animated.View style={[styles.card, styles.nextCard, nextCardAnimatedStyles]}>
        <Image 
          source={{ uri: nextProfile.image }} 
          style={styles.profileImage}
          resizeMode="cover"
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{nextProfile.name}</Text>
        </View>
      </Animated.View>
    );
  };

  const renderCurrentProfile = () => {
    const profile = profiles[currentIndex];
    
    return (
      <Animated.View 
        style={[styles.card, animatedCardStyles]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={navigateToProfile}
          style={styles.touchableArea}
        >
          <Image 
            source={{ uri: profile.image }} 
            style={styles.profileImage}
            resizeMode="cover"
          />
          
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.age}>{profile.age} years</Text>
            
            <View style={styles.gamesContainer}>
              <Text style={styles.gamesTitle}>MAIN GAMES:</Text>
              <View style={styles.gamesList}>
                {profile.games.map((game, index) => (
                  <View key={index} style={styles.gameBadge}>
                    <Text style={styles.gameText}>{game}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </TouchableOpacity>
        
        <Animated.View 
          style={[
            styles.likeBadge, 
            { 
              opacity: likeOpacity,
              transform: [{ scale: likeScale }],
              backgroundColor: `rgba(76, 175, 80, ${likeBgOpacity})` 
            }
          ]}
        >
          <Icon name="done" size={50} color="#FFF" />
          <Text style={styles.likeText}>LIKE</Text>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.dislikeBadge, 
            { 
              opacity: dislikeOpacity,
              transform: [{ scale: dislikeScale }],
              backgroundColor: `rgba(244, 67, 54, ${dislikeBgOpacity})`
            }
          ]}
        >
          <Icon name="close" size={50} color="#FFF" />
          <Text style={styles.dislikeText}>REJECT</Text>
        </Animated.View>
      </Animated.View>
    );
  };

  const handleButtonSwipe = (direction) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    
    // Vibrate for haptic feedback
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Vibration.vibrate(50);
    }
    
    Animated.parallel([
      Animated.timing(swipe, {
        toValue: { x: direction * (width + 100), y: 0 },
        duration: SWIPE_OUT_DURATION,
        useNativeDriver: true
      }),
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: SWIPE_OUT_DURATION,
        useNativeDriver: true
      }),
      Animated.spring(nextCardScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true
      })
    ]).start(() => {
      if (direction > 0) {
        handleLike();
      } else {
        handleDislike();
      }
      handleSwipeComplete();
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#1a1a2e" barStyle="light-content" />
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => setShowSideMenu(true)} 
              style={styles.menuButton}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Icon2 name="menu" size={28} color="#FFF" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>HOME</Text>
            
            <TouchableOpacity 
              onPress={() => navigation.navigate('EditPackage')} 
              style={styles.thunderButton}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Icon name="bolt" size={28} color="#FFD700" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.cardContainer}>
            {profiles.length > 0 && currentIndex < profiles.length ? (
              <>
                {/* Render next card underneath for stack effect */}
                {renderNextProfile()}
                {renderCurrentProfile()}
              </>
            ) : (
              <View style={styles.noProfiles}>
                <Text style={styles.noProfilesText}>No more profiles to show</Text>
                <TouchableOpacity 
                  style={styles.resetButton}
                  onPress={() => setCurrentIndex(0)}
                >
                  <Text style={styles.resetButtonText}>RESET</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.dislikeButton]}
              onPress={() => handleButtonSwipe(-1)}
              disabled={isTransitioning}
              activeOpacity={0.7}
            >
              <Icon name="close" size={30} color="#FFF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.viewButton]}
              onPress={navigateToProfile}
              disabled={isTransitioning}
              activeOpacity={0.7}
            >
              <Icon name="visibility" size={30} color="#FFF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.likeButton]}
              onPress={() => handleButtonSwipe(1)}
              disabled={isTransitioning}
              activeOpacity={0.7}
            >
              <Icon name="done" size={30} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Side Menu Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showSideMenu}
          onRequestClose={() => setShowSideMenu(false)}
        >
          <View style={styles.slideInMenuContainer}>
            <View style={styles.slideInMenu}>
              <TouchableOpacity 
                style={styles.slideInMenuCloseButton}
                onPress={() => setShowSideMenu(false)}
              >
                <Icon name="close" size={30} color="#FFF" />
              </TouchableOpacity>
              
              <View style={styles.slideInMenuHeader}>
                <Text style={styles.slideInMenuHeaderText}>MENU</Text>
              </View>
              
              <View style={styles.slideInMenuItems}>
                <TouchableOpacity 
                  style={styles.slideInMenuItem}
                  onPress={() => {
                    setShowSideMenu(false);
                    navigation.navigate('Profile');
                  }}
                >
                  <Icon name="account-circle" size={24} color="#FFD700" />
                  <Text style={styles.slideInMenuItemText}>ACCOUNT</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.slideInMenuItem}
                  onPress={() => {
                    setShowSideMenu(false);
                    navigation.navigate('Settings');
                  }}
                >
                  <Icon name="settings" size={24} color="#FFD700" />
                  <Text style={styles.slideInMenuItemText}>SETTINGS</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.slideInMenuItem}
                  onPress={handleLogout}
                >
                  <Icon name="logout" size={24} color="#FFD700" />
                  <Text style={styles.slideInMenuItemText}>LOGOUT</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.slideInMenuFooter}>
                <TouchableOpacity 
                  style={styles.slideInPrivacyButton}
                  onPress={navigateToPrivacyPolicy}
                >
                  <Icon name="privacy-tip" size={20} color="#FFD700" />
                  <Text style={styles.slideInPrivacyText}>PRIVACY POLICY</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.slideInMenuOverlay}
              activeOpacity={1}
              onPress={() => setShowSideMenu(false)}
            />
          </View>
        </Modal>

        {/* Logout Confirmation Modal */}
        <Modal
          transparent={true}
          visible={showLogoutModal}
          animationType="fade"
          onRequestClose={cancelLogout}
        >
          <View style={styles.logoutModalContainer}>
            <View style={styles.logoutModalContent}>
              <View style={styles.logoutModalHeader}>
                <Icon name="warning" size={40} color="#FFD700" />
                <Text style={styles.logoutModalTitle}>CONFIRM LOGOUT</Text>
              </View>
              
              <Text style={styles.logoutModalText}>
                Are you sure you want to logout?
              </Text>
              
              <View style={styles.logoutModalButtons}>
                <TouchableOpacity 
                  style={[styles.logoutModalButton, styles.cancelButton]}
                  onPress={cancelLogout}
                >
                  <Text style={styles.logoutModalButtonText}>CANCEL</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.logoutModalButton, styles.confirmButton]}
                  onPress={confirmLogout}
                >
                  <Text style={styles.logoutModalButtonText}>LOGOUT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <BottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  mainContainer: {
    flex: 1,
    marginBottom: 60, // Add margin to prevent content from being hidden behind the BottomNavBar
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#16213e',
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
  },
  menuButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Arial',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
    letterSpacing: 1,
  },
  thunderButton: {
    padding: 5,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 5,
  },
  card: {
    position: 'absolute',
    width: width * 0.85,
    height: height * 0.6,
    borderRadius: 15,
    backgroundColor: '#0f3460',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  nextCard: {
    opacity: 0.85,
    borderColor: 'rgba(255, 215, 0, 0.7)',
  },
  touchableArea: {
    flex: 1,
  },
  profileImage: {
    width: '100%',
    height: '65%',
  },
  profileInfo: {
    padding: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Arial',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  age: {
    color: '#AAA',
    fontSize: 16,
    marginBottom: 10,
  },
  gamesContainer: {
    marginTop: 10,
  },
  gamesTitle: {
    color: '#FFD700',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  gamesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gameBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  gameText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  likeBadge: {
    position: 'absolute',
    top: '25%',
    left: 20,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  likeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  dislikeBadge: {
    position: 'absolute',
    top: '25%',
    right: 20,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  dislikeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    paddingBottom: 15,
    marginBottom: 20,
    gap: 15,
  },
  actionButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#FFF',
    marginHorizontal: 5,
  },
  dislikeButton: {
    backgroundColor: '#F44336',
  },
  viewButton: {
    backgroundColor: '#2196F3',
  },
  likeButton: {
    backgroundColor: '#4CAF50',
  },
  noProfiles: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0f3460',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  noProfilesText: {
    color: '#FFD700',
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    padding: 12,
    borderRadius: 25,
    width: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  resetButtonText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16,
  },
  slideInMenuContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  slideInMenu: {
    width: width * 0.65,
    height: '100%',
    backgroundColor: '#16213e',
    borderRightWidth: 2,
    borderRightColor: '#FFD700',
  },
  slideInMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  slideInMenuCloseButton: {
    alignSelf: 'flex-end',
    padding: 20,
  },
  slideInMenuHeader: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  slideInMenuHeaderText: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  slideInMenuItems: {
    paddingHorizontal: 20,
  },
  slideInMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  slideInMenuItemText: {
    color: '#FFF',
    fontSize: 18,
    marginLeft: 20,
    fontWeight: 'bold',
  },
  slideInMenuFooter: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
    paddingTop: 20,
  },
  slideInPrivacyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideInPrivacyText: {
    color: '#FFD700',
    fontSize: 16,
    marginLeft: 10,
  },
  logoutModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  logoutModalContent: {
    width: width * 0.8,
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 25,
    borderWidth: 3,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  logoutModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoutModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 10,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  logoutModalText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
  },
  logoutModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoutModalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
  },
  cancelButton: {
    backgroundColor: '#0f3460',
    borderColor: '#2196F3',
  },
  confirmButton: {
    backgroundColor: '#0f3460',
    borderColor: '#F44336',
  },
  logoutModalButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;