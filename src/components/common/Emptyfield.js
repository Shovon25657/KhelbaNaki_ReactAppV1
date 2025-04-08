import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const EmptyField = ({ 
    placeholder, 
    value, 
    onChangeText, 
    secureTextEntry = false, 
    keyboardType = 'default',
    placeholderTextColor = '#999' // Default placeholder color
}) => {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor} // Set here
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: 'rgba(88, 88, 88, 0.28)',
        color: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 15,
        borderColor: 'rgba(47, 91, 214, 0.49)',
        borderStyle: 'solid',
        borderWidth: .5,
    }
});

export default EmptyField;