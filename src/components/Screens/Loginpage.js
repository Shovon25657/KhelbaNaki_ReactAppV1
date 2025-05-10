import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  Animated, 
  Easing, 
  StyleSheet 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { AuthContext } from '../context/authContext';
import EmptyField from '../common/Emptyfield';
import Logo from '../common/Logo';
import FormCard from '../common/FromCard';

const LoginPage = () => {
  const [state, setState] = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSocial, setShowSocial] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const animation = useState(new Animated.Value(0))[0];
  const navigation = useNavigation();

  // Forgot Password State
  const [forgotPasswordData, setForgotPasswordData] = useState({ email: '' });

  const forgotPasswordSteps = [
    {
      inputs: [
        { 
          name: 'email', 
          placeholder: 'Enter your registered email', 
          keyboardType: 'email-address' 
        }
      ]
    }
  ];

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in both fields');
    } else {
      setLoading(true);
      try {
        const { data } = await axios.post('/auth/login', { email, password });

        if (data?.token) {
          setState({ ...state, user: data?.user, token: data?.token });
          await AsyncStorage.setItem('@auth', JSON.stringify(data));
          Alert.alert('Success', 'Login successful!');
          navigation.navigate('Home');
        }
      } catch (error) {
        Alert.alert('Error', 'Invalid email or password');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordData.email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(forgotPasswordData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/auth/forgot-password', { email: forgotPasswordData.email });
      Alert.alert('Success', 'Password reset instructions sent to your email');
      setShowForgotPassword(false);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send reset instructions');
    } finally {
      setLoading(false);
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
    outputRange: [0, 50],
  });

  const GoogleIcon = () => (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
      <Path 
        fill="#fff"
        d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"
      />
    </Svg>
  );

  const FacebookIcon = () => (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
      <Path 
        fill="#fff"
        d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"
      />
    </Svg>
  );

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo />
      </View>

      <View style={styles.formContainer}>
        {showForgotPassword ? (
          <FormCard
            currentStep={0}
            fields={forgotPasswordSteps}
            formData={forgotPasswordData}
            handleChange={(name, value) => setForgotPasswordData(prev => ({ ...prev, [name]: value }))}
            handleNext={handleForgotPassword}
            handlePrev={() => setShowForgotPassword(false)}
            isLastStep={true}
            isLoading={loading}
          />
        ) : (
          <>
            <EmptyField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <EmptyField
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity onPress={() => setShowForgotPassword(true)}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
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
                    <GoogleIcon />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => console.log('Facebook Login')}>
                    <FacebookIcon />
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>
          </>
        )}

        <TouchableOpacity onPress={() => {
          if (showForgotPassword) {
            setShowForgotPassword(false);
          } else {
            navigation.navigate('Register');
          }
        }}>
          <Text style={styles.signUpText}>
            {showForgotPassword ? 'Back to Login' : "Don't have an Account?"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Keep all your existing styles from the original code
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(11, 2, 31)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '95%',
    backgroundColor: 'rgba(184, 184, 184, 0.06)',
    padding: 20,
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: 'rgba(47, 91, 214, 0.49)',
    borderWidth: 0.5,
  },
  forgotText: {
    color: '#999',
    textAlign: 'right',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'rgba(88, 235, 240, 0.87)',
    padding: 10,
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
    justifyContent: 'space-evenly',
    overflow: 'hidden',
    marginTop: 10,
  },
  signUpText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LoginPage;