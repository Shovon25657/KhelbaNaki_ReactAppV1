import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, TouchableOpacity, Platform } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import FormCard from '../../common/FromCard';

const Registration = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    gamingname: '',
    dob: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const formSteps = [
    {
      inputs: [
        { name: 'username', placeholder: 'Full name' }
      ]
    },
    {
      inputs: [
        { name: 'gamingname', placeholder: 'Gaming name' }
      ]
    },
    {
      inputs: [
        { name: 'dob', placeholder: 'Date of birth', keyboardType: 'numeric' }
      ]
    },
    {
      inputs: [
        { name: 'email', placeholder: 'Email', keyboardType: 'email-address' }
      ]
    },
    {
      inputs: [
        { name: 'password', placeholder: 'Password', secureTextEntry: true },
        { name: 'confirmPassword', placeholder: 'Confirm password', secureTextEntry: true }
      ]
    }
  ];

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    const currentFields = formSteps[currentStep].inputs.map(input => input.name);
    
    for (const field of currentFields) {
      if (!formData[field]) {
        Alert.alert('Error', 'Please fill in all fields');
        return false;
      }
    }

    // Add specific validations for each step
    if (currentStep === 3 && !/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email!');
      return false;
    }

    if (currentStep === 4) {
      if (formData.password.length < 6) {
        Alert.alert('Error', 'Password should be at least 6 characters long!');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match!');
        return false;
      }
    }

    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (currentStep < formSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      try {
        setIsLoading(true);
         const { data } = await axios.post('/auth/register', formData);
        
        if (data?.message) {
          Alert.alert('Success', data.message);
          navigation.navigate('Login');
        }
      } catch (error) {
        Alert.alert('Error', 'Registration failed. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* <Text style={styles.title}>Sign Up</Text> */}
        
        <FormCard
          currentStep={currentStep}
          fields={formSteps}
          formData={formData}
          handleChange={handleChange}
          handleNext={handleNext}
          handlePrev={handlePrev}
          isLastStep={currentStep === formSteps.length - 1}
          isLoading={isLoading}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signInText}>Already have an Account?</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Keep your existing styles, add any new ones if needed
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(11, 2, 31)',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  signInText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Registration;