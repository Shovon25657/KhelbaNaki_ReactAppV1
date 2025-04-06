import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, DatePickerIOS } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

// Custom icons for social media
const GoogleIcon = () => (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
        <Path fill="#fff" d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/>
    </Svg>
);

const FacebookIcon = () => (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
        <Path fill="#fff" d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
    </Svg>
);

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

            // Email format validation (basic check)
            const emailRegex = /\S+@\S+\.\S+/;
            if (!emailRegex.test(email)) {
                Alert.alert('Error', 'Please enter a valid email!');
                return;
            }

            // Password validation
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
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="Full name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Gaming name"
                value={gamingName}
                onChangeText={setGamingName}
            />
            <TextInput
                style={styles.input}
                placeholder="Date of birth"
                value={dob}
                onChangeText={setDob}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
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
                    <GoogleIcon />
                </TouchableOpacity>
                <TouchableOpacity>
                    <FacebookIcon />
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signInText}>Already have an Account?</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#f4f4f4',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#007BFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    socialText: {
        marginTop: 15,
        fontSize: 16,
        color: '#333',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    signInText: {
        color: '#007BFF',
        marginTop: 15,
    },
});

export default Registration;
