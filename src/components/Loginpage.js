import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, Animated, Easing, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSocial, setShowSocial] = useState(false);
  const [loading, setLoading] = useState(false);
  const animation = useState(new Animated.Value(0))[0];
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in both fields');
    } else {
      setLoading(true);
      try {
        const { data } = await axios.post('http://192.168.0.106:8080/api/v1/auth/login', {
          email,
          password,
        });

        if (data?.token) {
          await AsyncStorage.setItem('@auth', JSON.stringify(data));
          Alert.alert('Success', 'Login successful!');
        }
      } catch (error) {
        Alert.alert('Error', 'Invalid email or password');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleSocialLogin = () => {
    Animated.timing(animation, {
      toValue: showSocial ? 0 : 1,
      duration: 400,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start(() => setShowSocial(!showSocial));
  };

  const socialHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100], // Adjust height based on content
  });

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign In</Text>

        <TextInput
          style={styles.input}
          placeholder="Username/Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Let's Play</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={toggleSocialLogin}>
          <Text style={styles.socialButtonText}>Sign in with</Text>
        </TouchableOpacity>

        <Animated.View style={[styles.socialContainer, { height: socialHeight }]}>
          {showSocial && (
            <>
              <TouchableOpacity onPress={() => console.log('Google Login')}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google.png' }} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log('Facebook Login')}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg' }} style={styles.icon} />
              </TouchableOpacity>
            </>
          )}
        </Animated.View>

        <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
          <Text style={styles.signUpText}>Don't have an Account?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '85%',
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
  },
  forgotText: {
    color: '#999',
    textAlign: 'right',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#e50914',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  socialButton: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  socialButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    overflow: 'hidden',
    marginTop: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
  },
  signUpText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LoginPage;
