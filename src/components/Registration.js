import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

const Registration = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);  // For loading state

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSignUp = async () => {
        const { name, email, password } = formData;

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

        try {
            // Send sign-up request to the backend (replace the URL with your backend)
            const response = await axios.post('http://192.168.0.118:5000/register', { username, password });
            const { token, user } = response.data;

            Alert.alert('Success', 'You have signed up successfully!');
            
            // Optionally navigate to the login page or home page after successful registration
             navigation.navigate('profile', { user }); // Pass user data to the Profile screen
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Registration failed. Please try again later.');
        } finally {
            setIsLoading(false);  // Set loading to false after API call
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
            />
            
            <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
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
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Registration;
