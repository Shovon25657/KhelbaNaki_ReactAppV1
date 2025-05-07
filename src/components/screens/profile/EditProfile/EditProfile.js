import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { UserDataContext } from "../../../context/UserDataContext";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './EditProfile Common/Header';
import ProfileImagePicker from './EditProfile Common/ProfileImagePicker';
import CoverImagePicker from './EditProfile Common/CoverImagePicker';
import EditableSection from './EditProfile Common/EditableSection';
import EditableSectionforplayedgame from './EditProfile Common/EditableSectionforplayedgame';
import { responsiveFont, responsiveWidth, responsiveHeight } from './EditProfile Common/Metrics';
import StatusModal from './EditProfile Common/StatusModal';
import ProfileCard from '../Profile Common/ProfileCard';
import { FontAwesome5 } from '@expo/vector-icons';

const defaultProfile = require('../../../../../assets/profile1.jpg');
const defaultCover = require('../../../../../assets/profile3.jpg');

const EditProfile = ({ navigation }) => {
  const { userProfileData, aboutData, setUserProfileData, userLookingForData, userGamesPlayedData, refreshData } = useContext(UserDataContext);

  const [gamingName, setGamingName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(defaultProfile);
  const [coverImage, setCoverImage] = useState(defaultCover);
  const [currentStatus, setCurrentStatus] = useState('Online');
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isEditing, setIsEditing] = useState({ bio: false });
  const [wordCount, setWordCount] = useState(0);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    if (!userProfileData) return;

    setGamingName(userProfileData.gamingName || '');
    setAge(userProfileData.age ? userProfileData.age.toString() : '');
    setBio(userProfileData.bio || '');
    setProfileImage(
      userProfileData.profileImage ? { uri: userProfileData.profileImage } : defaultProfile
    );
    setCoverImage(
      userProfileData.coverImage ? { uri: userProfileData.coverImage } : defaultCover
    );
    setCurrentStatus(userProfileData.status || 'Online');
    setWordCount(
      userProfileData.bio
        ? userProfileData.bio.split(/\s+/).filter(word => word.length > 0).length
        : 0
    );
  }, [userProfileData]);

  useEffect(() => {
    setWordCount(bio.split(/\s+/).filter(word => word.length > 0).length);
  }, [bio]);

  const validateInputs = () => {
    if (age && isNaN(age)) {
      Alert.alert("Invalid Age", "Please enter a valid number for age");
      return false;
    }
    if (wordCount > 150) {
      Alert.alert("Bio Too Long", "Please keep bio under 150 words");
      return false;
    }
    return true;
  };

  const uploadImage = async (uri, type) => {
    const formData = new FormData();
    formData.append('image', {
      uri,
      type: 'image/jpeg',
      name: `${type}_${Date.now()}.jpg`
    });

    try {
      const { data } = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${await getToken()}`
        }
      });
      return data.imageUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  };

  const getToken = async () => {
    const authData = await AsyncStorage.getItem('@auth');
    return authData ? JSON.parse(authData).token : null;
  };

  const handleSaveProfile = async () => {
    try {
      if (!validateInputs()) return;

      setSaving(true);
      const token = await getToken();

      if (!token) {
        throw new Error('Authentication token not found');
      }

      setUploadingImages(true);
      const profileImageUrl = profileImage.uri !== defaultProfile.uri
        ? await uploadImage(profileImage.uri, 'profile')
        : userProfileData?.profileImage;

      const coverImageUrl = coverImage.uri !== defaultCover.uri
        ? await uploadImage(coverImage.uri, 'cover')
        : userProfileData?.coverImage;

      const { data } = await axios.put(
        "/userabout/update-profile-data",
        {
          gamingName,
          age: age ? parseInt(age) : null,
          bio,
          profileImage: profileImageUrl,
          coverImage: coverImageUrl,
          status: currentStatus
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (data?.success) {
        setUserProfileData(data.updatedProfile);
        await refreshData();
        navigation.goBack();  // Removed the Alert line
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || error.message || "Failed to update profile"
      );
      console.error("Update profile error:", error);
    } finally {
      setSaving(false);
      setUploadingImages(false);
    }
  };

  const pickProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your photos to change your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
    }
  };

  const pickCoverImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your photos to change your cover photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCoverImage({ uri: result.assets[0].uri });
    }
  };

  const handleBioChange = (text) => {
    const words = text.split(/\s+/);
    if (words.length <= 150 || text.length < bio.length) {
      setBio(text);
    }
  };

  const getStatusColor = () => {
    const statusOptions = [
      { name: 'Online', color: '#00ff88' },
      { name: 'Offline', color: '#ff0000' },
      { name: 'Away', color: '#ffaa00' }
    ];
    const status = statusOptions.find(option => option.name === currentStatus);
    return status ? status.color : '#00ff88';
  };

  const selectStatus = (status) => {
    setCurrentStatus(status);
    setShowStatusModal(false);
  };

  // Navigation Functions
  const navigateToEditAbout = () => navigation.navigate('EditAbout', {
    about: {
      educationQualification: aboutData?.educationQualification,
      occupation: aboutData?.occupation,
      location: aboutData?.location,
      religion: aboutData?.religion
    }
  });
  const navigateToEditLookingFor = () => navigation.navigate('EditLookingFor', {
    lookingfor: {
      availability: userLookingForData?.availability,
      playStyle: userLookingForData?.playStyle,
      playMode: userLookingForData?.playMode,
    }
  });


  const navigateToEditGames = () => navigation.navigate('EditGames', {
    gamesPlayed: {
      games: userGamesPlayedData?.games,
      frequency: userGamesPlayedData?.frequency,
      level: userGamesPlayedData?.level,
    }
  });






  // const navigateToEditGames = () => navigation.navigate('EditGames', { games: user.bestAt });
  const navigateToEditPackage = () => navigation.navigate('EditPackage', { plan: user.plan });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Edit Profile"
        onBack={() => navigation.goBack()}
        onSave={async () => {
          await new Promise(resolve => setTimeout(resolve, 500)); // Add 0.5 second delay
          handleSaveProfile();
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.coverSection}>
          <CoverImagePicker
            image={coverImage}
            onPress={async () => {
              await new Promise(resolve => setTimeout(resolve, 500)); // Add 0.5 second delay
              pickCoverImage();
            }}
          />
          <ProfileImagePicker
            image={profileImage}
            onPress={async () => {
              await new Promise(resolve => setTimeout(resolve, 500)); // Add 0.5 second delay
              pickProfileImage();
            }}
            style={styles.profileImagePosition}
          />
        </View>

        <View style={styles.nameContainer}>
          <View style={styles.nameInputsContainer}>
            <TextInput
              style={styles.nameInput}
              value={gamingName}
              onChangeText={setGamingName}
              placeholder="Gaming Name"
              placeholderTextColor="#aaa"
            />
            <View style={styles.ageContainer}>
              <TextInput
                style={styles.ageInput}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                maxLength={2}
                placeholder="Age"
                placeholderTextColor="#aaa"
              />
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={[styles.onlineDot, { backgroundColor: getStatusColor() }]} />
            <TouchableOpacity onPress={async () => {
              await new Promise(resolve => setTimeout(resolve, 500)); // Add 0.5 second delay
              setShowStatusModal(true);
            }}>
              <Text style={styles.status}>{currentStatus} (Tap to change)</Text>
            </TouchableOpacity>
          </View>
        </View>

        <EditableSection
          title="Player Bio"
          onEdit={async () => {
            await new Promise(resolve => setTimeout(resolve, 500)); // Add 0.5 second delay
            setIsEditing({ ...isEditing, bio: !isEditing.bio });
          }}
          editIcon={isEditing.bio ? "check" : "edit-2"}
        >
          <View style={styles.wordCountContainer}>
            <Text style={styles.wordCountText}>{wordCount}/150 words</Text>
          </View>
          <View style={styles.bioContainer}>
            {isEditing.bio ? (
              <TextInput
                style={styles.bioInput}
                value={bio}
                onChangeText={handleBioChange}
                multiline={true}
                placeholder="Tell others about yourself as a gamer (max 150 words)..."
                placeholderTextColor="#aaa"
                maxLength={1000}
              />
            ) : (
              <Text style={styles.bioText}>{bio || 'No bio added yet'}</Text>
            )}
          </View>
        </EditableSection>


        {/* About Section */}
        <EditableSection
          title="About"
          onEdit={async () => {
            await new Promise(resolve => setTimeout(resolve, 500)); // Add 0.5 second delay
            navigateToEditAbout();
          }}
          data={[
            { icon: 'graduation-cap', label: 'Education', value: aboutData?.educationQualification || 'Not specified' },
            { icon: 'briefcase', label: 'Occupation', value: aboutData?.occupation || 'Not specified' },
            // { icon: 'map-marker-alt', label: 'Location', value: aboutData?.location || 'Not specified' },
            { icon: 'praying-hands', label: 'Religion', value: aboutData?.religion || 'Not specified' },
            { icon: 'smoking', label: 'Smoking', value: aboutData?.smoking || 'Not specified' },
            { icon: 'glass-cheers', label: 'Drinks', value: aboutData?.drinks || 'Not specified' },
            { icon: 'venus-mars', label: 'gender', value: aboutData?.gender || 'Not specified' },
          ]}
          iconComponent={FontAwesome5}
        />

        {/* Looking For Section */}
        <EditableSection
          title="Looking For"
          onEdit={async () => {
            await new Promise(resolve => setTimeout(resolve, 500)); // Add 0.5 second delay
            navigateToEditLookingFor();
          }}
          data={[
            { icon: 'moon', label: 'Avilablity', value: userLookingForData?.availability || 'Not specified' },
            { icon: 'gamepad', label: 'Play Style', value: userLookingForData?.playStyle || 'Not specified' },
            { icon: 'headset', label: 'Play Mode', value: userLookingForData?.playMode || 'Not specified' },

          ]}
          iconComponent={FontAwesome5}
        />


        <EditableSectionforplayedgame
          title="Games Played"
          onEdit={async () => {
            await new Promise(resolve => setTimeout(resolve, 500)); // Smooth delay
            navigateToEditGames();
            console.log("User Games Played Data:", userGamesPlayedData);
          }}
          data={userGamesPlayedData}
          
        />

        


        {(saving || uploadingImages) && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#00ff88" />
            <Text style={styles.loadingText}>
              {uploadingImages ? 'Uploading images...' : 'Saving changes...'}
            </Text>
          </View>
        )}
      </ScrollView>

      <StatusModal
        visible={showStatusModal}
        onClose={async () => {
          await new Promise(resolve => setTimeout(resolve, 500)); // Add 0.5 second delay
          setShowStatusModal(false);
        }}
        currentStatus={currentStatus}
        onSelectStatus={async (status) => {
          await new Promise(resolve => setTimeout(resolve, 500)); // Add 0.5 second delay
          selectStatus(status);
        }}
      />
    </SafeAreaView>
  );
};

// Keep all your existing styles from the original EditProfile.js
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(1, 12, 20)',
  },
  scrollView: {
    flex: 1,
  },
  coverSection: {
    position: 'relative',
    marginBottom: responsiveHeight(60),
  },
  profileImagePosition: {
    bottom: -responsiveHeight(50),
    left: responsiveWidth(20),
  },
  nameContainer: {
    paddingHorizontal: responsiveWidth(20),
    marginTop: responsiveHeight(60),
    marginBottom: responsiveHeight(20),
  },
  nameInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameInput: {
    fontSize: responsiveFont(24),
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    paddingVertical: responsiveHeight(5),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.65)',
    marginRight: responsiveWidth(10),
  },
  ageContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.65)',
    width: responsiveWidth(60),
  },
  ageInput: {
    fontSize: responsiveFont(24),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: responsiveHeight(5),
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(10),
  },
  onlineDot: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    marginRight: responsiveWidth(5),
  },
  status: {
    fontSize: responsiveFont(16),
    color: '#00ff88',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  wordCountContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: responsiveHeight(10),
  },
  wordCountText: {
    fontSize: responsiveFont(12),
    color: 'rgba(1, 225, 255, 0.49)',
  },
  bioContainer: {
    backgroundColor: 'rgba(15, 51, 96, 0.5)',
    padding: responsiveWidth(15),
    borderRadius: responsiveWidth(10),
  },
  bioText: {
    fontSize: responsiveFont(16),
    lineHeight: responsiveFont(24),
    color: '#fff',
    textAlign: 'center',
  },
  bioInput: {
    fontSize: responsiveFont(16),
    lineHeight: responsiveFont(24),
    color: '#fff',
    padding: 0,
    textAlign: 'center',
    textAlignVertical: 'top',
    minHeight: responsiveHeight(100),
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
});

export default EditProfile;