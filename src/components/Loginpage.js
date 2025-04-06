import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/styles'; // Assuming this contains your custom styles
import { useNavigation } from '@react-navigation/native';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  // Handle Login Logic
  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in both fields');
    } else {
      try {
        const { data } = await axios.post('http://192.168.0.118:8080/api/v1/auth/login', {
          email,
          password,
        });

        // Store the token and user data in AsyncStorage after stringifying
        if (data && data.token) {
         // await AsyncStorage.setItem('@auth_token', data.token); // Store the token
          await AsyncStorage.setItem('@auth', JSON.stringify(data)); // Store the user data
          Alert.alert('Success', 'Login successful!');
        }

        console.log("Login Data==> ", data); // Parse the user data
        
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Invalid email or password');
      }
    }
  };
  // Fetch Local Storage Data (Token and User Data)
  const getLocalStorage = async () => {
    try {
      //let token = await AsyncStorage.getItem('@auth_token');
      let data = await AsyncStorage.getItem('@auth');
      
      if (data) {
        console.log("Local storage user data:", data); // Parse the user data
      }
    } catch (error) {
      console.error('Error fetching data from local storage:', error);
    }
  };

  // Use useEffect to fetch local storage when the component mounts
  useEffect(() => {
    getLocalStorage();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text
          style={styles.text}
          onPress={() => navigation.navigate('Registration')}
        >
          Don't have an account? Sign Up
        </Text>

        <Text style={styles.text}>Forgot Password?</Text>
      </View>
    </View>
  );
};

export default LoginPage;
