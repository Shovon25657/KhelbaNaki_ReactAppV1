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
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import profile1 from '../../../assets/profile1.jpg';
import profile2 from '../../../assets/profile2.jpg';
import profile3 from '../../../assets/profile3.jpg';
import profile4 from '../../../assets/profile4.jpg';
import profile5 from '../../../assets/profile5.jpg';
import profile6 from '../../../assets/profile6.jpg';

const { width, height } = Dimensions.get('window');

// Responsive sizing functions
const responsiveWidth = (size) => (width / 375) * size;
const responsiveHeight = (size) => (height / 812) * size;
const responsiveFont = (size) => (width / 375) * size;

const Profile = ({ navigation }) => {
  const [user, setUser] = useState({
    name: 'Jessica',
    age: 28,
    location: 'New York, NY',
    about: 'Coffee enthusiast. Dog lover. Adventure seeker. Looking for someone who enjoys weekend hikes and trying new restaurants.',
    jobTitle: 'Marketing Manager',
    company: 'Creative Solutions',
    school: 'University of California',
    photos: [
      profile1,
      profile2,
      profile3,
      profile4,
      profile5,
      profile6,
    ],
    interests: ['Travel', 'Hiking', 'Photography', 'Dogs', 'Coffee', 'Reading'],
  });

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { user });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with settings and edit button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Feather name="settings" size={responsiveFont(24)} color="#999" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleEditProfile} style={styles.headerButton}>
          <Feather name="edit-2" size={responsiveFont(24)} color="#FFD25B" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Profile Photo */}
        <View style={styles.mainPhotoContainer}>
          <Image source={user.photos[0]} style={styles.mainPhoto} />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user.name}, {user.age}</Text>
            <View style={styles.locationContainer}>
              <Feather name="map-pin" size={responsiveFont(16)} color="#fff" />
              <Text style={styles.location}>{user.location}</Text>
            </View>
          </View>
        </View>

        {/* Profile Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="bee" size={responsiveFont(24)} color="#FFD25B" />
            <Text style={styles.statValue}>20,542</Text>
            <Text style={styles.statLabel}>Bumble Coins</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Ionicons name="ios-heart" size={responsiveFont(24)} color="#FFD25B" />
            <Text style={styles.statValue}>243</Text>
            <Text style={styles.statLabel}>Admirers</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Feather name="eye" size={responsiveFont(24)} color="#FFD25B" />
            <Text style={styles.statValue}>1,532</Text>
            <Text style={styles.statLabel}>Profile views</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{user.about}</Text>
        </View>

        {/* Work & Education Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work & Education</Text>
          <View style={styles.infoRow}>
            <Feather name="briefcase" size={responsiveFont(20)} color="#666" />
            <Text style={styles.infoText}>
              {user.jobTitle} at {user.company}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="book" size={responsiveFont(20)} color="#666" />
            <Text style={styles.infoText}>{user.school}</Text>
          </View>
        </View>

        {/* Photo Gallery */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <View style={styles.photoGrid}>
            {user.photos.map((photo, index) => (
              <Image key={index} source={photo} style={styles.gridPhoto} />
            ))}
          </View>
        </View>

        {/* Interests Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestsContainer}>
            {user.interests.map((interest, index) => (
              <View key={index} style={styles.interestBadge}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Verification Section */}
        <View style={[styles.section, styles.verificationSection]}>
          <MaterialCommunityIcons name="shield-check" size={responsiveFont(24)} color="#1E88E5" />
          <View style={styles.verificationTextContainer}>
            <Text style={styles.verificationTitle}>Profile Verified</Text>
            <Text style={styles.verificationSubtitle}>
              Your profile has been verified with photo and phone verification
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(15),
    paddingVertical: responsiveHeight(10),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerButton: {
    width: responsiveWidth(40),
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: responsiveFont(18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  mainPhotoContainer: {
    position: 'relative',
  },
  mainPhoto: {
    width: '100%',
    height: responsiveHeight(400),
  },
  nameContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: responsiveWidth(20),
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  name: {
    fontSize: responsiveFont(24),
    fontWeight: 'bold',
    color: '#fff',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(5),
  },
  location: {
    fontSize: responsiveFont(16),
    color: '#fff',
    marginLeft: responsiveWidth(5),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: responsiveWidth(15),
    marginBottom: responsiveHeight(10),
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: responsiveFont(16),
    fontWeight: 'bold',
    marginTop: responsiveHeight(5),
    color: '#333',
  },
  statLabel: {
    fontSize: responsiveFont(12),
    color: '#666',
    marginTop: responsiveHeight(2),
  },
  divider: {
    width: 1,
    backgroundColor: '#eee',
    marginVertical: responsiveHeight(5),
  },
  section: {
    backgroundColor: '#fff',
    paddingHorizontal: responsiveWidth(20),
    paddingVertical: responsiveHeight(15),
    marginBottom: responsiveHeight(10),
  },
  sectionTitle: {
    fontSize: responsiveFont(18),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(15),
    color: '#333',
  },
  aboutText: {
    fontSize: responsiveFont(16),
    lineHeight: responsiveFont(24),
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(10),
  },
  infoText: {
    fontSize: responsiveFont(16),
    marginLeft: responsiveWidth(10),
    color: '#333',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridPhoto: {
    width: responsiveWidth(110),
    height: responsiveWidth(110),
    borderRadius: responsiveWidth(8),
    marginBottom: responsiveHeight(10),
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestBadge: {
    backgroundColor: '#f0f0f0',
    borderRadius: responsiveWidth(20),
    paddingVertical: responsiveHeight(8),
    paddingHorizontal: responsiveWidth(16),
    marginRight: responsiveWidth(10),
    marginBottom: responsiveHeight(10),
  },
  interestText: {
    color: '#333',
    fontSize: responsiveFont(14),
  },
  verificationSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationTextContainer: {
    marginLeft: responsiveWidth(15),
    flex: 1,
  },
  verificationTitle: {
    fontSize: responsiveFont(16),
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  verificationSubtitle: {
    fontSize: responsiveFont(14),
    color: '#666',
    marginTop: responsiveHeight(2),
  },
});

export default Profile;