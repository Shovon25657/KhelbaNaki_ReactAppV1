import React from 'react';
import {StyleSheet } from 'react-native';
import { Text } from 'react-native';

const Logo= ({
}) => {
    return (
      <Text style={styles.LogoText} >
        KhelbaNaki
      </Text>
    );
};

const styles = StyleSheet.create({
    LogoText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        fontWeight: 90,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
    },
});

export default Logo