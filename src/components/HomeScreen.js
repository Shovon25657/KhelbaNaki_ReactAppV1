import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = ({ route }) => {
  const { username } = route.params; // Get the username passed from LoginPage

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {username}!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
