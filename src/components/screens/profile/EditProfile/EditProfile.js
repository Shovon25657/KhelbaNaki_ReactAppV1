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
import { ProfileDataContext } from "../../../context/profileDataContext";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Reusable Components
import Header from './EditProfile Common/Header';
import ProfileImagePicker from './EditProfile Common/ProfileImagePicker';
import CoverImagePicker from './EditProfile Common/CoverImagePicker';
import EditableSection from './EditProfile Common/EditableSection';
import { responsiveFont, responsiveWidth, responsiveHeight } from './EditProfile Common/Metrics';

// Default images
const defaultProfile = require('../../../../../assets/profile1.jpg');
const defaultCover = require('../../../../../assets/profile3.jpg');

const EditProfile = ({ navigation }) => {
  const { profileData, setProfileData, getProfileData, loading: contextLoading } = useContext(ProfileDataContext);
  
  // Local state
  const [gamingName, setGamingName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(defaultProfile);
  const [coverImage, setCoverImage] = useState(defaultCover);
  const [currentStatus, setCurrentStatus] = useState('Online');
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState({ bio: false });
  const [wordCount, setWordCount] = useState(0);

  // Initialize form with profile data
  useEffect(() => {
    if (profileData) {
      setGamingName(profileData.gamingName || '');
      setAge(profileData.age ? profileData.age.toString() : '');
      setBio(profileData.bio || '');
      setProfileImage(
        profileData.profileImage ? { uri: profileData.profileImage } : defaultProfile
      );
      setCoverImage(
        profileData.coverImage ? { uri: profileData.coverImage } : defaultCover
      );
      setCurrentStatus(profileData.status || 'Online');
      setWordCount(profileData.bio ? profileData.bio.split(/\s+/).filter(word => word.length > 0).length : 0);
    }
  }, [profileData]);

  // Update word count when bio changes
  useEffect(() => {
    setWordCount(bio.split(/\s+/).filter(word => word.length > 0).length);
  }, [bio]);

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

  const getToken = async () => {
    const authData = await AsyncStorage.getItem('@auth');
    return authData ? JSON.parse(authData).token : null;
  };

  const handleCreateProfile = async () => {
    try {
      setSaving(true);
      const token = await getToken();
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const { data } = await axios.put(
        "/userabout/update-profile",
        {
          gamingName,
          age: parseInt(age) || 0,
          bio,
          profileImage: profileImage.uri || profileImage,
          coverImage: coverImage.uri || coverImage,
          status: currentStatus
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProfileData(data?.profile);
      await getProfileData();
      setSaving(false);
      navigation.goBack();
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      setSaving(false);
      Alert.alert(
        "Error", 
        error.response?.data?.message || error.message || "Failed to update profile"
      );
      console.log("Update profile error:", error);
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

  const toggleStatus = () => {
    setCurrentStatus(prev => 
      prev === 'Online' ? 'Away' : 
      prev === 'Away' ? 'Offline' : 'Online'
    );
  };

  if (contextLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ff88" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Edit Profile"
        onBack={() => navigation.goBack()}
        onSave={handleCreateProfile}
        saveText={saving ? "Saving..." : "Save"}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cover Photo Section */}
        <View style={styles.coverSection}>
          <CoverImagePicker 
            image={coverImage} 
            onPress={pickCoverImage} 
          />
          <ProfileImagePicker 
            image={profileImage} 
            onPress={pickProfileImage}
            style={styles.profileImagePosition}
          />
        </View>


        <Text style={{fontFamily: 'monospace', color: '#fff'}}>
  {JSON.stringify(profileData, null, 4)}
</Text>

        {/* Name and Age Section */}
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
            <TouchableOpacity onPress={toggleStatus}>
              <Text style={styles.status}>{currentStatus} (Tap to change)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bio Section */}
        <EditableSection 
          title="Player Bio" 
          onEdit={() => setIsEditing({...isEditing, bio: !isEditing.bio})}
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(1, 12, 20)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: responsiveFont(14),
    color: '#00ff88',
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
});

export default EditProfile;