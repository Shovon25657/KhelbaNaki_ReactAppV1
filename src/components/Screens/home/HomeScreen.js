import React, { useContext, useState, useRef, useCallback } from 'react';
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
  Platform
} from 'react-native';
import { AuthContext } from '../../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Feather';
import BottomNavBar from '../../common/BottomNavBar';
import person1 from '../../../../assets/Alex.jpg';
import person2 from '../../../../assets/Angry_Avater.jpg';
import person3 from '../../../../assets/cartoon-character-with-handbag-sunglasses.jpg';

import CardSwiper from '../../Screens/home/common/CardSwiper';
import ProfileCard from '../../Screens/home/common/ProfileCard';
import ActionButtons from '../../Screens/home/common/ActionButtons';
import SlideInMenu from '../../Screens/home/common/SlideInMenu';
import ConfirmationModal from '../../Screens/home/common/ConfirmationModal';
import Header from '../../Screens/home/common/Header';
import Luminaries from '../../Screens/home/Luminaries';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const [state, setState] = useContext(AuthContext);
  const navigation = useNavigation();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const [profiles] = useState([
    {
      id: 1,
      name: 'xXProGamerXx',
      age: 28,
      games: ['Fortnite', 'Valorant', 'Apex Legends'],
      image: person1
    },
    {
      id: 2,
      name: 'PixelQueen',
      age: 24,
      games: ['League of Legends', 'Overwatch', 'Dota 2'],
      image: person2
    },
    {
      id: 3,
      name: 'HeadshotHunter',
      age: 26,
      games: ['Call of Duty', 'PUBG', 'CS:GO'],
      image: person3
    },
    {
      id: 4,
      name: 'NoobSlayer',
      age: 25,
      games: ['Rocket League', 'FIFA', 'NBA 2K'],
      image: person1
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const nextCardScale = useRef(new Animated.Value(0.9)).current;
  const [isTransitioning, setIsTransitioning] = useState(false);
  const swipeRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      nextCardScale.setValue(0.9);
      return () => {};
    }, [])
  );

  const handleLike = () => {
    console.log('Liked:', profiles[currentIndex].name);
  };

  const handleDislike = () => {
    console.log('Disliked:', profiles[currentIndex].name);
  };

  const handleSwipeComplete = () => {
    setCurrentIndex(prev => (prev < profiles.length - 1 ? prev + 1 : 0));
  };

  const handleButtonSwipe = (direction) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Vibration.vibrate(50);
    }
    
    // Trigger swipe animation programmatically
    if (swipeRef.current) {
      swipeRef.current.triggerSwipe(direction);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
    setShowSideMenu(false);
  };

  const navigateToLuminaries = () => {
    setShowSideMenu(false);
    navigation.navigate('Luminaries');
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

  const navigateToProfile = (profile) => {
    navigation.navigate('Profile', { profile: profile || profiles[currentIndex] });
  };

  const navigateToPrivacyPolicy = () => {
    setShowSideMenu(false);
    navigation.navigate('Privacy');
  };

  const renderNextProfile = () => {
    const nextIndex = currentIndex < profiles.length - 1 ? currentIndex + 1 : 0;
    const nextProfile = profiles[nextIndex];
    
    return (
      <Animated.View style={[styles.card, styles.nextCard, { transform: [{ scale: nextCardScale }] }]}>
        <ProfileCard 
          profile={nextProfile} 
          onPress={navigateToProfile} 
          showBadges={false}
        />
      </Animated.View>
    );
  };

  const renderProfileCard = () => {
    return (
      <View style={styles.card}>
        <ProfileCard 
          profile={profiles[currentIndex]} 
          onPress={navigateToProfile}
        />
      </View>
    );
  };

  const menuItems = [
    {
      icon: 'account-circle',
      label: 'ACCOUNT',
      onPress: () => {
        setShowSideMenu(false);
        navigation.navigate('Profile');
      }
    },
    {
      icon: 'settings',
      label: 'SETTINGS',
      onPress: () => {
        setShowSideMenu(false);
        navigation.navigate('Settings');
      }
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#1a1a2e" barStyle="light-content" />
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <Header 
            title="HOME"
            onMenuPress={() => setShowSideMenu(true)}
            onActionPress={() => navigation.navigate('EditPackage')}
          />
          
          <View style={styles.cardContainer}>
            {profiles.length > 0 ? (
              <>
                {renderNextProfile()}
                <CardSwiper
                  ref={swipeRef}
                  onSwipeLeft={handleDislike}
                  onSwipeRight={handleLike}
                  onSwipeComplete={handleSwipeComplete}
                  currentIndex={currentIndex}
                  nextCardScale={nextCardScale}
                  onAnimationComplete={() => setIsTransitioning(false)}
                >
                  {renderProfileCard()}
                </CardSwiper>
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
          
          <ActionButtons 
            onLike={() => handleButtonSwipe(1)}
            onDislike={() => handleButtonSwipe(-1)}
            isTransitioning={isTransitioning}
          />
        </View>
        
        <SlideInMenu
          visible={showSideMenu}
          onClose={() => setShowSideMenu(false)}
          menuItems={menuItems}
          onLogout={handleLogout}
          onPrivacyPolicy={navigateToPrivacyPolicy}
          onLuminaries={navigateToLuminaries} 
        />

        <ConfirmationModal
          visible={showLogoutModal}
          title="CONFIRM LOGOUT"
          message="Are you sure you want to logout?"
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      </View>
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
  container: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '2%',
    marginTop: '2%',
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
  nextCard: {
    position: 'absolute',
    opacity: 0.85,
    borderColor: 'rgba(86, 57, 246, 0.28)',
  },
  noProfiles: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0f3460',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgb(1, 225, 255)',
  },
  noProfilesText: {
    color: 'rgb(1, 225, 255)',
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: 'rgba(1, 225, 255, 0.2)',
    padding: 12,
    borderRadius: 25,
    width: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgb(1, 225, 255)',
  },
  resetButtonText: {
    color: 'rgb(1, 225, 255)',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;
