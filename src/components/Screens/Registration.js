import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import EmptyField from '../common/Emptyfield'; // Import the EmptyField component


const Registration = () => {
    const [name, setName] = useState('');
    const [gamingName, setGamingName] = useState('');
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const navigation = useNavigation();

    const handleSignUp = async () => {
        try {
            if (!name || !gamingName || !dob || !email || !password || !confirmPassword) {
                Alert.alert('Error', 'All fields are required!');
                return;
            }

            const emailRegex = /\S+@\S+\.\S+/;
            if (!emailRegex.test(email)) {
                Alert.alert('Error', 'Please enter a valid email!');
                return;
            }

            if (password.length < 6) {
                Alert.alert('Error', 'Password should be at least 6 characters long!');
                return;
            }

            if (password !== confirmPassword) {
                Alert.alert('Error', 'Passwords do not match!');
                return;
            }

            setIsLoading(true);

            const { data } = await axios.post('http://192.168.0.106:8080/api/v1/auth/register', {
                name,
                gamingName,
                dob,
                email,
                password,
            });

            if (data && data.message) {
                Alert.alert('Success', data.message);
                setName('');
                setGamingName('');
                setDob('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Registration failed. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.formContainer}>
                <Text style={styles.title}>Sign Up</Text>

                <EmptyField
                    placeholder="Full name"
                    value={name}
                    onChangeText={setName}
                />
                <EmptyField
                    placeholder="Gaming name"
                    value={gamingName}
                    onChangeText={setGamingName}
                />
                <EmptyField
                    placeholder="Date of birth"
                    value={dob}
                    onChangeText={setDob}
                    keyboardType="numeric"
                />
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
                <EmptyField
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                <TouchableOpacity 
                    style={[styles.button, isLoading && styles.buttonDisabled]} 
                    onPress={handleSignUp} 
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Let's Roll</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.socialText}>Or sign up with</Text>

                <View style={styles.socialContainer}>
                    <TouchableOpacity>
                        {/* Add Social Icons here */}
                    </TouchableOpacity>
                    <TouchableOpacity>
                        {/* Add Social Icons here */}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.signInText}>Already have an Account?</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(5, 18, 59, 1)',
      justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        flexGrow: 1,
      width: '100%',
      backgroundColor: 'rgba(184, 184, 184, 0.06)',
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
    socialText: {
      color: '#999',
      textAlign: 'center',
      marginTop: 20,
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
    
    signInText: {
      color: '#999',
      textAlign: 'center',
      marginTop: 20,
    },
  });
  

export default Registration;
