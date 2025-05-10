import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import EmptyField from './Emptyfield';

const FormCard = ({ 
  currentStep,
  fields,
  formData,
  handleChange,
  handleNext,
  handlePrev,
  isLastStep,
  isLoading
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.stepIndicator}>
        Step {currentStep + 1} of {fields.length}
      </Text>

      {fields[currentStep].inputs.map((input, index) => (
        <EmptyField
          key={index}
          placeholder={input.placeholder}
          value={formData[input.name]}
          onChangeText={(text) => handleChange(input.name, text)}
          keyboardType={input.keyboardType}
          secureTextEntry={input.secureTextEntry}
        />
      ))}

      <View style={styles.buttonContainer}>
        {currentStep > 0 && (
          <TouchableOpacity 
            style={[styles.button, styles.prevButton]} 
            onPress={handlePrev}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[
            styles.button, 
            styles.nextButton,
            isLoading && styles.disabledButton
          ]} 
          onPress={handleNext}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Processing...' : (isLastStep ? 'Register' : 'Next')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(184, 184, 184, 0.06)',
    padding: 20,
    borderRadius: 10,
    borderColor: 'rgba(47, 91, 214, 0.49)',
    borderWidth: 0.5,
    width: '100%',
    marginVertical: 10,
  },
  stepIndicator: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  prevButton: {
    backgroundColor: '#4a4a4a',
  },
  nextButton: {
    backgroundColor: 'rgb(111, 77, 236)',
  },
  disabledButton: {
    backgroundColor: '#6e6e6e',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FormCard;