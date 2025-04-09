import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import profilePhoto from '../../../assets/profile1.jpg';
import coverPhoto from '../../../assets/profile3.jpg';
import game1 from '../../../assets/game1.png';
import game2 from '../../../assets/game2.png';
import game3 from '../../../assets/game3.png';

const { width, height } = Dimensions.get('window');

// Responsive sizing functions
const responsiveWidth = (size) => (width / 375) * size;
const responsiveHeight = (size) => (height / 812) * size;
const responsiveFont = (size) => (width / 375) * size;

const Profile = ({ navigation }) => {
  const gamesScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const [user, setUser] = useState({
    name: 'Jessica',
    age: 28,
    bio: 'Professional gamer and streamer. Love playing FPS and strategy games. Looking for teammates who communicate well!',
    about: [
      { icon: 'graduation-cap', label: 'Education', value: 'Undergrad Degree' },
      { icon: 'map-marker-alt', label: 'Location', value: 'New York, NY' },
      { icon: 'briefcase', label: 'Occupation', value: 'Streamer' },
      { icon: 'smoking', label: 'Smoking', value: 'Yes' },
      { icon: 'glass-whiskey', label: 'Drinking', value: 'Socially' },
      { icon: 'pray', label: 'Religion', value: 'Islam' },
      { icon: 'genderless', label: 'Gender', value: 'Male' }
    ],
    lookingFor: [
      { icon: 'moon', label: 'Availability', value: 'Night' },
      { icon: 'gamepad', label: 'Play Style', value: 'Competitive' },
      { icon: 'users', label: 'Play Mode', value: 'Team Based' },
    ],
    bestAt: [
      { 
        image: game1, 
        name: 'Valorant', 
        level: 'Gold',
        frequency: 'Most Played',
        isFavorite: true
      },
      { 
        image: game2, 
        name: 'Call of Duty Mobile', 
        level: 'Platinum',
        frequency: 'Recently Played',
        isFavorite: false
      },
      { 
        image: game3, 
        name: 'EA FC 24', 
        level: 'Gold',
        frequency: 'Once Played',
        isFavorite: false
      },
    ],

    bestBadge: {
      position: 'absolute',
      top: responsiveHeight(5),
      left: responsiveWidth(5),
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: responsiveWidth(8),
      paddingVertical: responsiveHeight(3),
      borderRadius: responsiveWidth(10),
      zIndex: 1,
    },
   
    plan: {
      name: 'Elite Gamer Package',
      features: [
        'Unlimited likes',
        'Send direct requests',
        'Premium avatars',
        'Priority visibility',
        'Custom gaming themes'
      ]
    }
  });

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { user });
  };

  // Function to scroll right
  const scrollGamesRight = () => {
    if (gamesScrollRef.current) {
      gamesScrollRef.current.scrollTo({
        x: responsiveWidth(150), // Scroll by approximately one card width
        y: 0,
        animated: true
      });
    }
  };

  // Function to scroll left
  const scrollGamesLeft = () => {
    if (gamesScrollRef.current) {
      gamesScrollRef.current.scrollTo({
        x: 0,
        y: 0,
        animated: true
      });
    }
  };

  // Handle scroll events to show/hide left arrow
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    setCanScrollLeft(scrollPosition > 10); // Show left arrow if scrolled right
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with title only */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gamer Profile</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Photo with Profile Photo overlapping */}
        <View style={styles.coverContainer}>
          <Image source={coverPhoto} style={styles.coverPhoto} />
          <View style={styles.profilePhotoContainer}>
            <Image source={profilePhoto} style={styles.profilePhoto} />
          </View>
        </View>

        {/* Name, Age and Edit Profile Button */}
        <View style={styles.nameContainer}>
          <View>
            <Text style={styles.name}>{user.name}, {user.age}</Text>
            <View style={styles.statusContainer}>
              <View style={styles.onlineDot} />
              <Text style={styles.status}>Online Now</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={handleEditProfile}
            activeOpacity={0.7}
          >
            <Feather name="edit-3" size={responsiveFont(16)} color="#fff" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Bio Section - Updated version */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Player Bio</Text>
          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>{user.bio}</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.gridContainer}>
            {user.about.map((item, index) => (
              <View key={index} style={styles.smallGridItem}>
                <FontAwesome5 
                  name={item.icon} 
                  size={responsiveFont(16)} 
                  color="#00ff88" 
                />
                <Text style={styles.smallGridLabel}>{item.label}</Text>
                <Text style={styles.smallGridValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Looking For Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Looking For</Text>
          <View style={styles.gridContainer}>
            {user.lookingFor.map((item, index) => (
              <View key={index} style={styles.smallGridItem}>
                <FontAwesome5 
                  name={item.icon} 
                  size={responsiveFont(16)} 
                  color="#00ff88" 
                />
                <Text style={styles.smallGridLabel}>{item.label}</Text>
                <Text style={styles.smallGridValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Games Played Section - Updated with scrollable indicators */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Games Played</Text>
          <View style={{ position: 'relative' }}>
            <ScrollView 
              ref={gamesScrollRef}
              horizontal={true} 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.gamesScrollContainer}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {user.bestAt.map((game, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.smallGameCard}
                  activeOpacity={0.7}
                >
                  {game.isFavorite && (
                    <View style={styles.favoriteBadge}>
                      <MaterialCommunityIcons 
                        name="heart" 
                        size={responsiveFont(14)} 
                        color="#e94560" 
                      />
                    </View>
                  )}
                  <Image source={game.image} style={styles.smallGameImage} />
                  <Text style={styles.frequencyTag}>{game.frequency}</Text>
                  <View style={styles.gameInfo}>
                    <Text style={styles.gameName}>{game.name}</Text>
                    <View style={styles.gameLevel}>
                      <MaterialCommunityIcons 
                        name="medal" 
                        size={responsiveFont(14)} 
                        color="#FFD700" 
                      />
                      <Text style={styles.levelText}>{game.level}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {/* Left scroll arrow - only visible when scrolled right */}
            {canScrollLeft && (
              <TouchableOpacity 
                style={[styles.scrollIndicator, styles.scrollIndicatorLeft]}
                onPress={scrollGamesLeft}
                activeOpacity={0.7}
              >
                <Feather 
                  name="chevron-left" 
                  size={responsiveFont(20)} 
                  color="#00ff88" 
                />
              </TouchableOpacity>
            )}

            {/* Right scroll arrow */}
            <TouchableOpacity 
              style={styles.scrollIndicator}
              onPress={scrollGamesRight}
              activeOpacity={0.7}
            >
              <Feather 
                name="chevron-right" 
                size={responsiveFont(20)} 
                color="#00ff88" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* My Plan Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gamer Subscription</Text>
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <MaterialCommunityIcons 
                name="crown" 
                size={responsiveFont(24)} 
                color="#FFD700" 
              />
              <Text style={styles.planName}>{user.plan.name}</Text>
            </View>
            <View style={styles.planFeatures}>
              {user.plan.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveHeight(15),
    backgroundColor: '#16213e',
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerTitle: {
    fontSize: responsiveFont(20),
    fontWeight: 'bold',
    color: '#00ff88',
    fontFamily: 'Roboto',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  coverContainer: {
    position: 'relative',
    height: responsiveHeight(200),
    backgroundColor: '#0f3460',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  profilePhotoContainer: {
    position: 'absolute',
    bottom: -responsiveHeight(50),
    left: responsiveWidth(20),
    width: responsiveWidth(100),
    height: responsiveWidth(100),
    borderRadius: responsiveWidth(50),
    borderWidth: 4,
    borderColor: '#00ff88',
    overflow: 'hidden',
    backgroundColor: '#16213e',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: responsiveWidth(20),
    marginTop: responsiveHeight(60),
    marginBottom: responsiveHeight(20),
  },
  name: {
    fontSize: responsiveFont(26),
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 255, 136, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(5),
  },
  onlineDot: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    backgroundColor: '#00ff88',
    marginRight: responsiveWidth(5),
  },
  status: {
    fontSize: responsiveFont(14),
    color: '#00ff88',
    fontStyle: 'italic',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e94560',
    paddingHorizontal: responsiveWidth(15),
    paddingVertical: responsiveHeight(8),
    borderRadius: responsiveWidth(20),
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  editButtonText: {
    fontSize: responsiveFont(14),
    color: '#fff',
    marginLeft: responsiveWidth(5),
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#16213e',
    paddingHorizontal: responsiveWidth(20),
    paddingVertical: responsiveHeight(15),
    marginBottom: responsiveHeight(10),
    borderRadius: responsiveWidth(10),
    marginHorizontal: responsiveWidth(10),
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  sectionTitle: {
    fontSize: responsiveFont(18),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(15),
    color: '#00ff88',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bioContainer: {
    backgroundColor: 'rgba(15, 52, 96, 0.5)', // Reduced opacity
    padding: responsiveWidth(15),
    borderRadius: responsiveWidth(10),
    // Removed border
  },
  bioText: {
    fontSize: responsiveFont(16),
    lineHeight: responsiveFont(24),
    color: '#fff',
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  smallGridItem: {
    width: responsiveWidth(90),
    alignItems: 'center',
    padding: responsiveWidth(8),
    backgroundColor: '#0f3460',
    borderRadius: responsiveWidth(10),
    marginBottom: responsiveHeight(10),
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  smallGridLabel: {
    fontSize: responsiveFont(10),
    color: '#00ff88',
    marginTop: responsiveHeight(4),
    textAlign: 'center',
  },
  smallGridValue: {
    fontSize: responsiveFont(12),
    fontWeight: 'bold',
    color: '#fff',
    marginTop: responsiveHeight(2),
    textAlign: 'center',
  },
  // Updated Games Section styles
  gamesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gamesScrollContainer: {
    paddingRight: responsiveWidth(20), // Extra padding at the end for better UX
    paddingLeft: responsiveWidth(5),
  },
  smallGameCard: {
    width: responsiveWidth(120), // Adjusted size
    height: responsiveHeight(170),
    marginRight: responsiveWidth(12),
    marginBottom: responsiveHeight(10),
    backgroundColor: '#0f3460',
    borderRadius: responsiveWidth(10),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  smallGameImage: {
    width: '100%',
    height: responsiveHeight(110),
    resizeMode: 'cover',
  },
  scrollIndicator: {
    position: 'absolute',
    right: responsiveWidth(10),
    top: '50%',
    transform: [{ translateY: -responsiveHeight(15) }],
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    borderRadius: responsiveWidth(15),
    width: responsiveWidth(30),
    height: responsiveWidth(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00ff88',
    zIndex: 2,
  },
  scrollIndicatorLeft: {
    right: 'auto',
    left: responsiveWidth(10),
  },
  favoriteBadge: {
    position: 'absolute',
    top: responsiveHeight(5),
    left: responsiveWidth(5),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: responsiveWidth(10),
    width: responsiveWidth(24),
    height: responsiveWidth(24),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  frequencyTag: {
    position: 'absolute',
    top: responsiveHeight(5),
    right: responsiveWidth(5),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#00ff88',
    fontSize: responsiveFont(10),
    fontWeight: 'bold',
    paddingHorizontal: responsiveWidth(8),
    paddingVertical: responsiveHeight(3),
    borderRadius: responsiveWidth(10),
  },
  gameInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: responsiveWidth(8),
  },
  gameLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(5),
  },
  gameTag: {
    fontSize: responsiveFont(10),
    color: '#00ff88',
    fontStyle: 'italic',
    marginBottom: responsiveHeight(2),
  },
  gameName: {
    fontSize: responsiveFont(12),
    fontWeight: 'bold',
    color: '#fff',
  },
  levelText: {
    fontSize: responsiveFont(10),
    color: '#00ff88',
    marginLeft: responsiveWidth(3),
  },
  planCard: {
    backgroundColor: '#0f3460',
    borderRadius: responsiveWidth(15),
    padding: responsiveWidth(15),
    borderWidth: 2,
    borderColor: '#00ff88',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(10),
  },
  planName: {
    fontSize: responsiveFont(18),
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: responsiveWidth(10),
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  planFeatures: {
    paddingLeft: responsiveWidth(5),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: responsiveHeight(8),
  },
  bulletPoint: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    borderRadius: responsiveWidth(3),
    backgroundColor: '#00ff88',
    marginTop: responsiveHeight(5),
    marginRight: responsiveWidth(8),
  },
  featureText: {
    fontSize: responsiveFont(14),
    color: '#fff',
    flex: 1,
  },
});

export default Profile;