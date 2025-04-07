import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Gradient Background Simulation */}
      <View style={styles.gradientTop} />
      <View style={styles.gradientBottom} />
      
      {/* Content Container */}
      <View style={styles.content}>
        {/* Logo Placeholder */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Logo</Text>
        </View>
        
        {/* Gaming Motto */}
        <View style={styles.mottoContainer}>
          <Text style={styles.mottoLine1}>"Gaming is not just a hobby..."</Text>
          <Text style={styles.mottoLine2}>It's a lifestyle. Let's connect & play.</Text>
        </View>
        
        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.signUpButton]}
            onPress={() => navigation.navigate('Registration')}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#222433', // Fallback color
  },
  gradientTop: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#5500FF',
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#222433',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mottoContainer: {
    marginBottom: 50,
    alignItems: 'center',
  },
  mottoLine1: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(85, 0, 255, 0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  mottoLine2: {
    fontSize: 18,
    fontWeight: '500',
    color: '#DDDDDD',
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: 'rgba(85, 0, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#5500FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  signUpButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  buttonText: {
    color: '#5500FF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;