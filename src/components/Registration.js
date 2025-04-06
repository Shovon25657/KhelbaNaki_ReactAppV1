import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

const Registration = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const handleSignUp = async () => {

        try {
        // Basic validation
        if (!name || !email || !password) {
            Alert.alert('Error', 'All fields are required!');
            return;
        }

        // Email format validation (basic check)
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email!');
            return;
        }

        // Password strength validation (at least 6 characters)
        if (password.length < 6) {
            Alert.alert('Error', 'Password should be at least 6 characters long!');
            return;
        }

        // Set loading state to true
        setIsLoading(true);

            const { data } = await axios.post('http://192.168.0.106:8080/api/v1/auth/register', {
                name,
                email,
                password,
            });

            console.log('Registration successful:', data);

            // If there is a message in the response, alert it
            if (data && data.message) {
                Alert.alert('Success', data.message);
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Registration failed. Please try again later.');
        } finally {
            setIsLoading(false); // Set loading to false after API call
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={(value) => setName(value)}  // Directly setting state for each field
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={(value) => setEmail(value)}  // Directly setting state for each field
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={(value) => setPassword(value)}  // Directly setting state for each field
                secureTextEntry
            />
            
            <TouchableOpacity 
                style={[styles.button, isLoading && styles.buttonDisabled]} 
                onPress={handleSignUp} 
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />  // Show loading spinner
                ) : (
                    <Text style={styles.buttonText}>Sign Up</Text>
                )}
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#007BFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonDisabled: {
        backgroundColor: '#cccccc', // Disabled button color
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Registration;
