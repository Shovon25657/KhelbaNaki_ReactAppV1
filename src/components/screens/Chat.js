import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import BottomNavBar from '../common/BottomNavBar';

const Chat = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Chat</Text>
        <Text style={styles.text}>Connect with other gamers!</Text>
      </View>
      <BottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#FFF',
  },
});

export default Chat;