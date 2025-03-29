import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import styles from '../styles/styles';  // Importing the styles


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === '' || password === '') {
      Alert.alert('Error', 'Please fill in both fields');
    } else {
      Alert.alert('Login Successful', `Welcome ${username}`);
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
      <Text style={styles.text}>Don't have an account? Sign Up</Text>
      <Text style={styles.text}>Forgot Password?</Text>
      
    </View>
    </View>
  );
};

export default LoginPage;
