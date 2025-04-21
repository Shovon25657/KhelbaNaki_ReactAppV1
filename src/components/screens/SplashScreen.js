import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  


  return null; // This will never be reached due to the navigation trigger
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#16213e',
  },
  loadingText: {
    marginTop: 20,
    color: '#fff',
    fontSize: 18,
  },
});

export default SplashScreen;
