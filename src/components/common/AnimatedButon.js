import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const AnimatedButton = ({
  onPress,
  title,
  style,
  textStyle,
  borderWidth = 1,
  fillColor = '#6200ee',
  emptyColor = 'transparent',
  borderColor = '#6200ee',
  animationDuration = 300
}) => {
  const fillAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    // Animate fill
    Animated.timing(fillAnim, {
      toValue: 1,
      duration: animationDuration,
      useNativeDriver: false,
    }).start(() => {
      // Execute press action
      onPress();
      
      // Reset animation
      Animated.timing(fillAnim, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: false,
      }).start();
    });
  };

  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const textColor = fillAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [textStyle?.color || '#fff', textStyle?.color || '#fff', '#fff'],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={[styles.buttonContainer, style, { borderColor }]}
    >
      <View style={[styles.buttonBackground, { backgroundColor: emptyColor }, { borderWidth }]}>
        <Animated.View style={[
          styles.fillBackground, 
          { 
            width: fillWidth, 
            backgroundColor: fillColor ,
            borderRadius: 25,
          }
        ]} />
      </View>
      <Animated.Text style={[styles.buttonText, textStyle, { color: textColor }, ]}>
        {title}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '80%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    
    position: 'relative',
  },
  buttonBackground: {
    backgroundColor: 'rgb(197, 15, 15)',
    borderRadius: 25,
    ...StyleSheet.absoluteFillObject,
  },
  fillBackground: {
    height: '100%',
    position: 'absolute',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute',
  },
});

export default AnimatedButton;