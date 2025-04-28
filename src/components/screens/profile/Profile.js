import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
  SafeAreaView,
  Alert,
  RefreshControl
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
import { getProfile } from '../../../Backend/services/api';
import { useAuth } from '../../context/authContext';

const Profile = ({ navigation, route }) => {

  
  const [authState] = useAuth();
  const currentUser = authState?.user || {};
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Default data for fallback
  const defaultUser = {
    name: 'KMS',
    age: 28,
    bio: 'Professional gamer and streamer. Love playing FPS and strategy games. Looking for teammates who communicate well!',
    about: [],
    lookingFor: [],
    bestAt: [],
    plan: {
      name: 'Elite Gamer Package',
      features: []
    },
    profileImage: profilePhoto,
    coverImage: coverPhoto,
    status: 'Online'
  };

  // Fetch profile data
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentUser?._id) {
        throw new Error('User not authenticated');
      }

      const profileData = await getProfile(currentUser._id);
      setUser({
        ...defaultUser,
        ...profileData,
        about: profileData?.about || [],
        lookingFor: profileData?.lookingFor || [],
        bestAt: profileData?.bestAt || [],
        plan: {
          ...defaultUser.plan,
          ...profileData?.plan,
          features: profileData?.plan?.features || []
        }
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      
      let errorMsg = err.message;
      if (err.message === 'Network Error') {
        errorMsg = 'Network error - please check your connection';
      }
      
      setError(errorMsg);
      setUser(defaultUser);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [currentUser?._id]);

  // Handle updated data from EditProfile
  useEffect(() => {
    if (route.params?.updatedUser) {
      setUser(prev => ({
        ...defaultUser,
        ...prev,
        ...route.params.updatedUser,
        about: route.params.updatedUser?.about || [],
        lookingFor: route.params.updatedUser?.lookingFor || [],
        bestAt: route.params.updatedUser?.bestAt || [],
        plan: {
          ...defaultUser.plan,
          ...route.params.updatedUser?.plan,
          features: route.params.updatedUser?.plan?.features || []
        }
      }));
      
      if (route.params?.showSuccess) {
        Alert.alert('Success', 'Profile updated successfully');
        navigation.setParams({ showSuccess: undefined });
      }
    }
  }, [route.params?.updatedUser]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfileData();
  };

  const handleEditProfile = () => {
    if (!user || !currentUser?._id) {
      Alert.alert('Error', 'Cannot edit profile: User not authenticated');
      return;
    }
    navigation.navigate('EditProfile', { 
      user, 
      userId: currentUser._id 
    });
  };

  if (loading && !user) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#00ff88" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchProfileData}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Safe array accessors
  const safeAbout = user?.about || [];
  const safeLookingFor = user?.lookingFor || [];
  const safeBestAt = user?.bestAt || [];
  const safePlanFeatures = user?.plan?.features || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gamer Profile</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00ff88"
          />
        }
      >
        <View style={styles.coverContainer}>
          <Image 
            source={user?.coverImage || coverPhoto} 
            style={styles.coverPhoto} 
            defaultSource={coverPhoto}
          />
          <View style={styles.profilePhotoContainer}>
            <Image 
              source={user?.profileImage || profilePhoto} 
              style={styles.profilePhoto} 
              defaultSource={profilePhoto}
            />
          </View>
        </View>

        <View style={styles.nameContainer}>
          <View>
            <Text style={styles.name}>{user?.name || 'No name'}, {user?.age || 'NA'}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.onlineDot, { 
                backgroundColor: user?.status === 'Online' ? '#32ff7e' : 
                                user?.status === 'Away' ? '#ffaf40' : '#ff4d4d'
              }]} />
              <Text style={styles.status}>
                {user?.status || 'Offline'} {user?.status === 'Online' ? 'Now' : ''}
              </Text>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Player Bio</Text>
          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>
              {user?.bio || 'No bio added yet. Tap Edit to add one!'}
            </Text>
          </View>
        </View>

        <ProfileCard 
          title="About" 
          data={safeAbout}
          emptyMessage="No about information added yet"
        />

        <ProfileCard 
          title="Looking For" 
          data={safeLookingFor}
          emptyMessage="No preferences added yet"
        />

        <GamesSection 
          title="Games Played" 
          games={safeBestAt}
          emptyMessage="No games added yet"
        />

        <PlanSection 
          title="Gamer Subscription" 
          plan={{
            ...user?.plan,
            features: safePlanFeatures
          }}
        />
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(1, 12, 20)',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 16,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#00a8ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    marginRight: responsiveWidth(5),
  },
  status: {
    fontSize: responsiveFont(14),
    color: '#32ff7e',
    fontStyle: 'italic',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(15),
    paddingVertical: responsiveHeight(8),
    borderRadius: responsiveWidth(20),
    shadowColor: '#e94560',
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
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
    backgroundColor: 'rgba(15, 51, 96, 0.3)',
  },
  bioText: {
    fontSize: responsiveFont(16),
    lineHeight: responsiveFont(24),
    color: '#fff',
    textAlign: 'center',
  },
});

export default Profile;