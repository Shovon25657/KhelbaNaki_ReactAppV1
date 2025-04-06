import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const EmptyField = ({ placeholder, value, onChangeText, secureTextEntry = false, keyboardType = 'default' }) => {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.33)',
        color: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 15,
      }
});

export default EmptyField;
