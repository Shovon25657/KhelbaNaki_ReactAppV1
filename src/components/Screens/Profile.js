import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GridItem from '../common/Profile_grid';

const ProfilePage = () => {
  const navigation = useNavigation();

  const [profile, setProfile] = useState({
    name: 'John Doe',
    age: 25,
    about: 'I am a passionate gamer and developer.',
    education: 'Undergrad degree in Computer Science',
    lookingFor: 'Looking for gaming partners and developers.',
    bestAt: 'Best at coding, problem-solving, and multiplayer games.',
    plan: 'Working on my own game development project.',
  });

  const [coverImage, setCoverImage] = useState('https://via.placeholder.com/400x200');
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/100');

  const pickImage = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'cover' ? [4, 2] : [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      type === 'cover'
        ? setCoverImage(result.assets[0].uri)
        : setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Cover Section */}
      <View style={styles.coverContainer}>
        <Image source={{ uri: coverImage }} style={styles.coverImage} />

        <TouchableOpacity style={styles.coverCameraIcon} onPress={() => pickImage('cover')}>
          <Ionicons name="camera" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />

          <TouchableOpacity style={styles.profileCameraIcon} onPress={() => pickImage('profile')}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Name, Age, Edit Section */}
      <View style={styles.nameGrid}>
        <View style={styles.nameAgeContainer}>
          <Text style={styles.displayName}>{profile.name}, {profile.age}</Text>

          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="settings-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionSpacing} />
      <GridItem title="About Me" icon="user" description={profile.about} />
      <GridItem title="Looking For" icon="search" description={profile.lookingFor} />
      <GridItem title="Best At" icon="trophy" description={profile.bestAt} />
      <GridItem title="My Plan" icon="clipboard" description={profile.plan} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1f1f1',
  },
  coverContainer: {
    position: 'relative',
    marginBottom: 60,
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderColor: '#000',
  },
  coverCameraIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 20,
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -50,
    left: 20,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#000',
    padding: 2,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileCameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 4,
    borderRadius: 20,
  },
  nameGrid: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    marginTop: 10,
  },
  nameAgeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00bcd4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  sectionSpacing: {
    height: 20,
  },
});

export default ProfilePage;
