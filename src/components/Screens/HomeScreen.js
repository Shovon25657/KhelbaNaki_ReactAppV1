import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { AuthContext } from '../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FooterMenu from '../Menus/FooterMenu';
import { ProfileDataContext } from '../context/profileDataContext';

const HomeScreen = () => {
  const [state, setState] = useContext(AuthContext);
  const [profileData, setProfileData, getProfileData] = useContext(ProfileDataContext);

  // Refresh profile data when the component mounts
  useEffect(() => {
    getProfileData();
  }, []);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Remove token from AsyncStorage
      await AsyncStorage.removeItem('@auth');

      // Clear the user data and token in the global state
      setState({ ...state, user: null, token: '' });
     
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Display profile data in a more readable format
  const renderProfileData = () => {
    if (!profileData || profileData.length === 0) {
      return <Text style={styles.noData}>No profile data available</Text>;
    }

    return profileData.map((profile, index) => (
      <View key={index} style={styles.profileCard}>
        <Text style={styles.profileField}>Gaming Name: {profile.gamingName}</Text>
        <Text style={styles.profileField}>Bio: {profile.bio}</Text>
        <Text style={styles.profileField}>Age: {profile.age}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen</Text>
      
      <ScrollView style={styles.profileContainer}>
        {renderProfileData()}
      </ScrollView>
      
      <Button title="Refresh Profile" onPress={getProfileData} />
      <Button title="Logout" onPress={handleLogout} />
      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    justifyContent: "space-between",
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileContainer: {
    flex: 1,
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  profileField: {
    fontSize: 16,
    marginBottom: 5,
  },
  noData: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  }
});

export default HomeScreen;