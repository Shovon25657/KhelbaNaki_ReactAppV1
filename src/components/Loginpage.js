import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Animated, Easing, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
//import GoogleIcon from '../../assets/google.svg'; 

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

  // Replace with SVG component
  const GoogleIcon = () => (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
      <Path
        fill="#00bcd4" // Change this to your preferred color
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
      />
    </Svg>
  );

  const FacebookIcon = () => (
    <svg width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
  </svg>
  );

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
                <GoogleIcon/>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => console.log('Facebook Login')}>
                <FacebookIcon /> 
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
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  socialButtonText: {
    color: '#00bcd4',
    fontWeight: 'bold',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // or 'space-evenly' or 'center' based on your preference
    overflow: 'hidden',
    marginTop: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginHorizontal: 3, // Adjust this value to change the distance between icons
  },
  
  signUpText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LoginPage;
