import React, { useState } from 'react';
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
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import profilePhoto from '../../../../assets/Alex.jpg';
import coverPhoto from '../../../../assets/sova_image.jpg';
import game1 from '../../../../assets/game1.png';
import game2 from '../../../../assets/game2.png';
import game3 from '../../../../assets/game3.png';
import BottomNavBar from '../../common/BottomNavBar';
import ProfileCard from './Profile Common/ProfileCard';
import GamesSection from './Profile Common/GamesSection';
import PlanSection from './Profile Common/PlanSection';
import { responsiveWidth, responsiveHeight, responsiveFont } from './Profile Common/responsiveDimensions';

const Profile = ({ navigation }) => {
  const [user, setUser] = useState({
    name: 'KMS',
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with title only */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gamer Profile</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
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

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Player Bio</Text>
          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>{user.bio}</Text>
          </View>
        </View>

        {/* About Section */}
        <ProfileCard 
          title="About" 
          data={user.about}
        />

        {/* Looking For Section */}
        <ProfileCard 
          title="Looking For" 
          data={user.lookingFor}
        />

        {/* Games Played Section */}
        <GamesSection 
          title="Games Played" 
          games={user.bestAt}
        />

        {/* My Plan Section */}
        <PlanSection 
          title="Gamer Subscription" 
          plan={user.plan}
        />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(1, 12, 20)',
  },
  scrollViewContent: {
    paddingBottom: 70,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveHeight(15),
    backgroundColor: 'rgb(14, 3, 52)',
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerTitle: {
    fontSize: responsiveFont(20),
    fontWeight: 'bold',
    color: '#fff',
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
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    opacity: 1,
  },
  profilePhotoContainer: {
    position: 'absolute',
    bottom: -responsiveHeight(50),
    left: responsiveWidth(20),
    width: responsiveWidth(100),
    height: responsiveWidth(100),
    borderRadius: responsiveWidth(50),
    borderWidth: 4,
    borderColor: '#062452',
    overflow: 'hidden',
    shadowColor: '#062452',
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
    backgroundColor: 'rgb(32, 151, 58)',
    marginRight: responsiveWidth(5),
  },
  status: {
    fontSize: responsiveFont(14),
    color: 'rgb(32, 151, 58)',
    fontStyle: 'italic',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(15),
    paddingVertical: responsiveHeight(8),
    borderRadius: responsiveWidth(20),
    shadowColor: '#e94560',
  },
  editButtonText: {
    fontSize: responsiveFont(14),
    color: '#fff',
    marginLeft: responsiveWidth(5),
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'rgba(47, 7, 226, 0.05)',
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
    color: 'rgb(1, 225, 255)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bioContainer: {
    padding: responsiveWidth(15),
    borderRadius: responsiveWidth(10),
  },
  bioText: {
    fontSize: responsiveFont(16),
    lineHeight: responsiveFont(24),
    color: '#fff',
    textAlign: 'center',
  },
});

export default Profile;``