import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GridItem from '../common/Profile_grid'; // Import the GridItem component

const ProfilePage = () => {
  const navigation = useNavigation();

  // Dummy data for the profile
  const [profile] = useState({
    name: 'John Doe',
    age: 25,
    about: 'I am a passionate gamer and developer.',
    education: 'Undergrad degree in Computer Science',
    lookingFor: 'Looking for gaming partners and developers.',
    bestAt: 'Best at coding, problem-solving, and multiplayer games.',
    plan: 'Working on my own game development project.',
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.coverImage} />
        <View style={styles.profileInfo}>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.profileImage} />
          <Text style={styles.displayName}>{profile.name}, {profile.age}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* About Me Section */}
      <GridItem title="About Me" icon="user" description={profile.about} />

      {/* Looking For Section */}
      <GridItem title="Looking For" icon="search" description={profile.lookingFor} />

      {/* Best At Section */}
      <GridItem title="Best At" icon="trophy" description={profile.bestAt} />

      {/* My Plan Section */}
      <GridItem title="My Plan" icon="clipboard" description={profile.plan} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  profileHeader: {
    position: 'relative',
    marginBottom: 20,
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  profileInfo: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  displayName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    marginTop: 10,
    backgroundColor: '#00bcd4',
    padding: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfilePage;
