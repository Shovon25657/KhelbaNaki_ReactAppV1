import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const FillButton = ({ onPress, title = 'Press Me' }) => {
  const fillAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    // Animate fill
    Animated.timing(fillAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      // Execute press action
      onPress();
      
      // Reset animation
      Animated.timing(fillAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  };

  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={styles.buttonContainer}
    >
      <View style={styles.buttonBackground}>
        <Animated.View style={[styles.fillBackground, { width: fillWidth }]} />
      </View>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '70%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6200ee',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  buttonBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  fillBackground: {
    height: '100%',
    backgroundColor: '#6200ee',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
    position: 'absolute',
  },
});

export default FillButton;