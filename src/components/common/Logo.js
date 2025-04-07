import React from 'react';
import {StyleSheet } from 'react-native';

const Logo= ({
}) => {
    return (
      <Text>
        KhelbaNaki
        style={styles.LogoText}
      </Text>
    );
};

const styles = StyleSheet.create({
    LogoText
: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    }
});

export default Logo