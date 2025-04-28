import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  TouchableOpacity,
  Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ProfileDataContext } from "../../../context/profileDataContext";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';


// Default images
const defaultProfile = require('../../../../../assets/profile1.jpg');
const defaultCover = require('../../../../../assets/profile3.jpg');

const EditProfile = ({ navigation }) => {
  // Global state from context
  const [state, setState] = useContext(ProfileDataContext);
  const { profileData, getProfileData } = state;

  // Get auth token from AsyncStorage
  const getToken = async () => {
    const authData = await AsyncStorage.getItem('@auth');
    return authData ? JSON.parse(authData).token : null;
  };

  // Local state
  const [gamingName, setGamingName] = useState(profileData?.gamingName || '');
  const [age, setAge] = useState(profileData?.age?.toString() || '');
  const [bio, setBio] = useState(profileData?.bio || '');
  const [profileImage, setProfileImage] = useState(profileData?.profileImage || defaultProfile);
  const [coverImage, setCoverImage] = useState(profileData?.coverImage || defaultCover);
  const [currentStatus, setCurrentStatus] = useState(profileData?.status || 'Online');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState({ bio: false });
  const [wordCount, setWordCount] = useState(profileData?.bio ? profileData.bio.split(/\s+/).length : 0);

  // Image Picker Functions
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

  // Handle bio text change with word limit
  const handleBioChange = (text) => {
    const words = text.split(/\s+/);
    if (words.length <= 150 || text.length < bio.length) {
      setBio(text);
      setWordCount(words.length);
    }
  };

  // Save Profile Function - Integrated with your backend
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
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
          profileImage,
          coverImage,
          status: currentStatus
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update context and local storage
      setState(prev => ({
        ...prev,
        profileData: data?.updatedProfile
      }));
      
      // Refresh profile data
      await getProfileData();
      
      setLoading(false);
      navigation.goBack();
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Error", 
        error.response?.data?.message || error.message || "Failed to update profile"
      );
      console.log("Update error:", error);
    }
  };

  // Get status color based on current status
  const getStatusColor = () => {
    const statusOptions = [
      { name: 'Online', color: '#00ff88' },
      { name: 'Offline', color: '#ff0000' },
      { name: 'Away', color: '#ffaa00' }
    ];
    const status = statusOptions.find(option => option.name === currentStatus);
    return status ? status.color : '#00ff88';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSaveProfile} disabled={loading}>
            <Text style={styles.saveButton}>
              {loading ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cover Photo Section */}
        <View style={styles.coverSection}>
          <TouchableOpacity onPress={pickCoverImage}>
            <Image 
              source={coverImage} 
              style={styles.coverImage}
            />
            <View style={styles.editCoverIcon}>
              <Feather name="edit" size={20} color="white" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={pickProfileImage} style={styles.profileImageContainer}>
            <Image 
              source={profileImage} 
              style={styles.profileImage}
            />
            <View style={styles.editProfileIcon}>
              <Feather name="edit" size={16} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Name and Age Section */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gaming Name</Text>
          <TextInput
            style={styles.input}
            value={gamingName}
            onChangeText={setGamingName}
            placeholder="Enter your gaming name"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            placeholder="Enter your age"
            placeholderTextColor="#aaa"
            maxLength={2}
          />
        </View>

        {/* Status */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
            <Text style={styles.statusText}>{currentStatus}</Text>
            <TouchableOpacity 
              style={styles.changeStatusButton}
              onPress={() => {
                setCurrentStatus(prev => 
                  prev === 'Online' ? 'Away' : 
                  prev === 'Away' ? 'Offline' : 'Online'
                );
              }}
            >
              <Text style={styles.changeStatusText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.inputContainer}>
          <View style={styles.bioHeader}>
            <Text style={styles.label}>Player Bio</Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Feather name={isEditing ? "check" : "edit-2"} size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.wordCount}>{wordCount}/150 words</Text>
          
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={handleBioChange}
              multiline
              numberOfLines={4}
              placeholder="Tell others about yourself as a gamer..."
              placeholderTextColor="#aaa"
            />
          ) : (
            <Text style={styles.bioText}>
              {bio || 'No bio added yet. Tap edit to add one.'}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(1, 12, 20)',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgb(1, 12, 20)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  saveButton: {
    color: '#00ff88',
    fontSize: 16,
    fontWeight: 'bold',
  },
  coverSection: {
    position: 'relative',
    marginBottom: 70,
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
  editCoverIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 15,
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -50,
    left: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  editProfileIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 15,
  },
  inputContainer: {
    backgroundColor: 'rgba(15, 51, 96, 0.5)',
    padding: 15,
    margin: 10,
    borderRadius: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: 'white',
  },
  bioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordCount: {
    textAlign: 'right',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 5,
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  bioText: {
    padding: 10,
    color: 'white',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  statusText: {
    flex: 1,
    color: 'white',
  },
  changeStatusButton: {
    padding: 5,
  },
  changeStatusText: {
    color: '#00ff88',
  },
});

export default EditProfile;