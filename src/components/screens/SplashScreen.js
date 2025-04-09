import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Animated } from 'react-native';

const SplashScreen = () => {
  const navigation = useNavigation();
// Add these to the component
const fadeAnim = React.useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: true,
  }).start();
}, []);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome'); // Or 'Home' if using auth check here
    }, 2000); // 2 seconds splash duration

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Animated.View style={styles.container}>
      <Image 
        source={require('../../../assets/ryan.png')} // Replace with your logo path
        style={styles.logo}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(43, 7, 100)',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default SplashScreen;