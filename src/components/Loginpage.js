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
       fill="#fff" // Change this to your preferred color
      d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/>

    </Svg>
  );

  const FacebookIcon = () => (

    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
  <Path 
   fill="#fff" // Change this to your preferred color
  d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
</Svg>
    
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
    justifyContent: 'center',
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
    justifyContent: 'space-evenly', // or 'space-evenly' or 'center' based on your preference
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
