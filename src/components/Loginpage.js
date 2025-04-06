import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/styles'; // Assuming this contains your custom styles

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

        // Store the token and user data in AsyncStorage
        if (data && data.token) {
          await AsyncStorage.setItem('@auth', JSON.stringify(data)); // Store user data
          Alert.alert('Success', 'Login successful!');
        }

        console.log("Login Data==> ", data);
        
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Invalid email or password');
      }
    }
  };

  // Fetch Local Storage Data (Token and User Data)
  const getLocalStorage = async () => {
    try {
      let data = await AsyncStorage.getItem('@auth');
      if (data) {
        console.log("Local storage user data:", data);
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
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign In</Text>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Username/Email"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Forgot Password Link */}
        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Let's Play</Text>
        </TouchableOpacity>

        {/* Social Media Login Buttons */}
        <View style={styles.socialContainer}>
          <TouchableOpacity onPress={() => console.log('Sign in with Google')}>
            <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google.png' }} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Sign in with Facebook')}>
            <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg' }} style={styles.icon} />
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
          <Text style={styles.signUpText}>Don't have an Account?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginPage;
