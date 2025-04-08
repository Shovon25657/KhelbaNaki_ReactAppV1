import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GridItem from '../common/Profile_grid';

const ProfilePage = () => {
  const navigation = useNavigation();

  const [profile, setProfile] = useState({
    name: 'John Doe',
    age: 25,
    about: [
      { icon: 'graduation-cap', text: 'Undergrad Degree' },
      { icon: 'gamepad', text: 'Gamer & Dev' },
    ],
    lookingFor: [
      { icon: 'users', text: 'Gaming Partners' },
      { icon: 'code', text: 'Developers' },
    ],
    bestAt: [
      { icon: 'laptop', text: 'Coding' },
      { icon: 'puzzle-piece', text: 'Problem Solving' },
      { icon: 'trophy', text: 'Multiplayer Games' },
    ],
    plan: [
      { icon: 'rocket', text: 'Game Project' },
      { icon: 'lightbulb-o', text: 'New Ideas' },
    ],
  });

  const [coverImage] = useState('https://via.placeholder.com/400x200');
  const [profileImage] = useState('https://via.placeholder.com/100');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cover Image */}
      <View style={styles.coverContainer}>
        <View style={styles.coverImageWrapper}>
          <Image source={{ uri: coverImage }} style={styles.coverImage} />
        </View>
      </View>

      {/* Profile Image overlapping on the left side of the cover image */}
      <View style={styles.profileImageContainer}>
        <View style={styles.profileImageWrapper}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        </View>
      </View>

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

      <GridItem title="About Me" description={profile.about} />
      <GridItem title="Looking For" description={profile.lookingFor} />
      <GridItem title="Best At" description={profile.bestAt} />
      <GridItem title="My Plan" description={profile.plan} />
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
  coverImageWrapper: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    borderColor: '#000',
    borderWidth: 2,
  },
  profileImageContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    borderRadius: 55,
    padding: 2,
    backgroundColor: '#fff',
  },
  profileImageWrapper: {
    borderRadius: 55,
    padding: 2,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#000',
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
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionSpacing: {
    height: 20,
  },
});

export default ProfilePage;
