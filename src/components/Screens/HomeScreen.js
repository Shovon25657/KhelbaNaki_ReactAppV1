import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { AuthContext } from '../context/authContext'; // Import the AuthContext
import AsyncStorage from '@react-native-async-storage/async-storage';
import FooterMenu from '../Menus/FooterMenu'
import { ProfileDataContext } from '../context/profileDataContext';

const HomeScreen = () => {
  const [state, setState] = useContext(AuthContext); // Access global state from context
  const[profileData] = useContext(ProfileDataContext)

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Remove token from AsyncStorage
      await AsyncStorage.removeItem('@auth'); 

      // Clear the user data and token in the global state
      setState({ ...state, user: null, token: '' });
     
      // Navigate to Login screen after logout
      console.log('Logged out successfully');
      if(state.token)
        {
          console.log('Token', state.token);
        }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen</Text>

      <Text>{JSON.stringify( profileData )}</Text>
      <Button title="Logout" onPress={handleLogout} />
      <FooterMenu/>
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
});

export default HomeScreen;
