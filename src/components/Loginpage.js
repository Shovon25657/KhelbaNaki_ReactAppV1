import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import axios from 'axios';
import styles from '../styles/styles';
import { useNavigation } from '@react-navigation/native';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (username === '' || password === '') {
      Alert.alert('Error', 'Please fill in both fields');
    } else {
      try {
        const response = await axios.post('http://192.168.0.118:5000/login', { username, password });

        const { token, user } = response.data;

        // Store the token if needed (using AsyncStorage or Context API)
        console.log('Login Successful:', user.fullName);

        // Navigate to Home on successful login
        navigation.navigate('Home');
      } catch (error) {
        Alert.alert('Error', 'Invalid username or password');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button style={styles.buttontext} title="Login" onPress={handleLogin} />

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
