import React, { useContext, useState, useRef } from 'react';
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
  ImageBackground,
  Alert
} from 'react-native';
import { AuthContext } from '../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');

const BG_IMAGE = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

const HomeScreen = () => {
  const [state, setState] = useContext(AuthContext);
  const navigation = useNavigation();
  const [showSideMenu, setShowSideMenu] = useState(false);
  
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

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx, dy }) => {
      swipe.setValue({ x: dx, y: dy });
      tilt.setValue(dx / 5);
    },
    onPanResponderRelease: (_, { dx, dy }) => {
      const direction = Math.sign(dx);
      const isActionActive = Math.abs(dx) > 120;

      if (isActionActive) {
        Animated.timing(swipe, {
          toValue: { 
            x: direction * 500, 
            y: dy 
          },
          duration: 200,
          useNativeDriver: true
        }).start(handleSwipeComplete);
        
        if (direction > 0) {
          handleLike();
        } else {
          handleDislike();
        }
      } else {
        Animated.spring(swipe, {
          toValue: { x: 0, y: 0 },
          friction: 4,
          useNativeDriver: true
        }).start();
      }
    }
  });

  const handleSwipeComplete = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      swipe.setValue({ x: 0, y: 0 });
      tilt.setValue(0);
    } else {
      setCurrentIndex(0);
    }
  };

  const rotateCard = tilt.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  const animatedCardStyles = {
    transform: [
      { translateX: swipe.x },
      { translateY: swipe.y },
      { rotate: rotateCard }
    ]
  };

  const likeOpacity = swipe.x.interpolate({
    inputRange: [0, 120],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const dislikeOpacity = swipe.x.interpolate({
    inputRange: [-120, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const handleLike = () => {
    console.log('Liked:', profiles[currentIndex].name);
  };

  const handleDislike = () => {
    console.log('Disliked:', profiles[currentIndex].name);
  };

  const handleLogout = () => {
    Alert.alert(
      "",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setShowSideMenu(false)
        },
        { 
          text: "Logout", 
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@auth');
              setState({ ...state, user: null, token: '' });
              navigation.navigate('Welcome');
              setShowSideMenu(false); // Close menu after logout
            } catch (error) {
              console.error('Error logging out:', error);
            }
          }
        }
      ],
      {
        cancelable: true,
        onDismiss: () => setShowSideMenu(false)
      }
    );
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile', { profile: profiles[currentIndex] });
  };

  const renderCurrentProfile = () => {
    const profile = profiles[currentIndex];
    
    return (
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={navigateToProfile}
      >
        <Animated.View 
          style={[styles.card, animatedCardStyles]}
          {...panResponder.panHandlers}
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
          
          <Animated.View style={[styles.likeBadge, { opacity: likeOpacity }]}>
            <View style={styles.likeContainer}>
              <Icon name="done" size={50} color="#4CAF50" />
              <Text style={styles.likeText}>LIKE</Text>
            </View>
          </Animated.View>
          
          <Animated.View style={[styles.dislikeBadge, { opacity: dislikeOpacity }]}>
            <View style={styles.dislikeContainer}>
              <Icon name="close" size={50} color="#F44336" />
              <Text style={styles.dislikeText}>REJECT</Text>
            </View>
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.backgroundImage} blurRadius={2}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="transparent" translucent barStyle="light-content" />
        <View style={styles.container}>
          {/* Header */}
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
          
          {/* Card Container */}
          <View style={styles.cardContainer}>
            {profiles.length > 0 && currentIndex < profiles.length ? (
              renderCurrentProfile()
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
          
          {/* Action Buttons - Now closer together */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.dislikeButton]}
              onPress={() => {
                swipe.setValue({ x: -500, y: 0 });
                Animated.spring(swipe, {
                  toValue: { x: -500, y: 0 },
                  friction: 4,
                  useNativeDriver: true
                }).start(() => {
                  handleDislike();
                  handleSwipeComplete();
                });
              }}
            >
              <Icon name="close" size={30} color="#FFF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.viewButton]}
              onPress={navigateToProfile}
            >
              <Icon name="visibility" size={30} color="#FFF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.likeButton]}
              onPress={() => {
                swipe.setValue({ x: 500, y: 0 });
                Animated.spring(swipe, {
                  toValue: { x: 500, y: 0 },
                  friction: 4,
                  useNativeDriver: true
                }).start(() => {
                  handleLike();
                  handleSwipeComplete();
                });
              }}
            >
              <Icon name="done" size={30} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          {/* Space for future nav bar */}
          <View style={styles.navBarPlaceholder} />
        </View>
        
        {/* Slide-in Side Menu Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showSideMenu}
          onRequestClose={() => setShowSideMenu(false)}
        >
          <View style={styles.slideInMenuContainer}>
            <View style={styles.slideInMenu}>
              {/* Close Button at top right */}
              <TouchableOpacity 
                style={styles.slideInMenuCloseButton}
                onPress={() => setShowSideMenu(false)}
              >
                <Icon name="close" size={30} color="#FFF" />
              </TouchableOpacity>
              
              {/* Menu Header */}
              <View style={styles.slideInMenuHeader}>
                <Text style={styles.slideInMenuHeaderText}>MENU</Text>
              </View>
              
              {/* Main Menu Items */}
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
              
              {/* Privacy Policy at Bottom */}
              <View style={styles.slideInMenuFooter}>
                <TouchableOpacity style={styles.slideInPrivacyButton}>
                  <Icon name="privacy-tip" size={20} color="#FFD700" />
                  <Text style={styles.slideInPrivacyText}>PRIVACY POLICY</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Transparent area to close menu when tapped */}
            <TouchableOpacity 
              style={styles.slideInMenuOverlay}
              activeOpacity={1}
              onPress={() => setShowSideMenu(false)}
            />
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
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
    marginBottom: 20,
    marginTop: 10,
  },
  card: {
    width: width * 0.8,
    height: height * 0.6,
    borderRadius: 15,
    backgroundColor: 'rgba(45, 45, 45, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFD700',
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
    top: '30%',
    left: 20,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.7)',
    borderRadius: 20,
    padding: 10,
  },
  likeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  dislikeBadge: {
    position: 'absolute',
    top: '30%',
    right: 20,
  },
  dislikeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.7)',
    borderRadius: 20,
    padding: 10,
  },
  dislikeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center', // Changed from 'space-around' to 'center'
    padding: 10, // Reduced padding
    paddingBottom: 20,
    marginBottom: 60,
    gap: 10, // Added gap between buttons
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#FFF',
    marginHorizontal: 5, // Added horizontal margin
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
    backgroundColor: 'rgba(45, 45, 45, 0.9)',
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
  navBarPlaceholder: {
    height: 60,
  },
  slideInMenuContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  slideInMenu: {
    width: width * 0.65,
    height: '100%',
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
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
});

export default HomeScreen;