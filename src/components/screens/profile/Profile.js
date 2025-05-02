import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import profilePhoto from '../../../../assets/Alex.jpg';
import coverPhoto from '../../../../assets/sova_image.jpg';
import BottomNavBar from '../../common/BottomNavBar';
import ProfileCard from './Profile Common/ProfileCard';
import GamesSection from './Profile Common/GamesSection';
import PlanSection from './Profile Common/PlanSection';
import { responsiveWidth, responsiveHeight, responsiveFont } from './Profile Common/responsiveDimensions';
import { UserDataContext } from '../../context/UserDataContext';

const Profile = ({ navigation }) => {
  const {
    profileData,
    aboutData,
    loading,
    error,
    refreshData
  } = useContext(UserDataContext);

  useEffect(() => {
    refreshData();
  }, []);

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ff88" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading profile: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gamer Profile</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.coverContainer}>
          <Image
            source={profileData?.coverImage ? { uri: profileData.coverImage } : coverPhoto}
            style={styles.coverPhoto}
          />
          <View style={styles.profilePhotoContainer}>
            <Image
              source={profileData?.profileImage ? { uri: profileData.profileImage } : profilePhoto}
              style={styles.profilePhoto}
            />
          </View>
        </View>

        <View style={styles.nameContainer}>
          <View>
            <Text style={styles.name}>
              {profileData?.gamingName || 'Unknown Player'}
              {profileData?.age ? `, ${profileData.age}` : ''}
            </Text>
            <View style={styles.statusContainer}>
              <View style={styles.onlineDot} />
              <Text style={styles.status}>{profileData?.status || 'Offline'}</Text>
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

        {profileData?.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Player Bio</Text>
            <View style={styles.bioContainer}>
              <Text style={styles.bioText}>{profileData.bio}</Text>
            </View>
          </View>
        )}

        {aboutData && (
          <ProfileCard
            title="About"
            data={[
              { icon: 'graduation-cap', label: 'Education', value: aboutData?.educationQualification || '' },
              { icon: 'briefcase', label: 'Occupation', value: aboutData?.occupation || '' },
              // { icon: 'map-marker-alt', label: 'Location', value: aboutData?.location || '' },
              { icon: 'praying-hands', label: 'Religion', value: aboutData?.religion || '' },
              { icon: 'smoking', label: 'Smoking', value: aboutData?.smoking || '' },
              { icon: 'glass-cheers', label: 'Drinks', value: aboutData?.drinks || '' },
              { icon: 'venus-mars', label: 'gender', value: aboutData?.gender || '' },

            ]}
          />
        )}

        {profileData?.gamesPlayed?.length > 0 && (
          <GamesSection
            title="Games Played"
            games={profileData.gamesPlayed}
          />
        )}

        {profileData?.plan?.name && (
          <PlanSection
            title="Gamer Subscription"
            plan={profileData.plan}
          />
        )}
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
};

// Keep all your existing styles from the original Profile.js
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
    width: responsiveWidth(100),
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(1, 12, 20)',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});

export default Profile;