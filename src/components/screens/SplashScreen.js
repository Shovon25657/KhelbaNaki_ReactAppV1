import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/authContext';

const SplashScreen = () => {
  const navigation = useNavigation();
  const [state, setState] = useContext(AuthContext);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const authData = await AsyncStorage.getItem('@auth');
        if (authData) {
          const { user, token } = JSON.parse(authData);
          // Update state and navigate after a slight delay
          setState(prevState => ({ ...prevState, user, token }));
          setTimeout(() => {
            navigation.replace('Home');
            setIsChecking(false);
          }, 100);
        } else {
          // Clear state and navigate
          setState(prevState => ({ ...prevState, user: null, token: '' }));
          setTimeout(() => {
            navigation.replace('Welcome');
            setIsChecking(false);
          }, 100);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        // Clear state and navigate on error
        setState(prevState => ({ ...prevState, user: null, token: '' }));
        setTimeout(() => {
          navigation.replace('Welcome');
          setIsChecking(false);
        }, 100);
      }
    };

    // Delay to show splash screen
    const timer = setTimeout(() => {
      checkLoginStatus();
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, setState]);

  // Render only the UI, no navigation logic
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/logo.png')} // Replace with your logo path
        style={styles.logoImage}
        resizeMode="contain"
      />
      <Text style={styles.logoText}>KhelbaNaki</Text>
      <ActivityIndicator size="large" color="#01e1ff" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(21, 4, 53)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;