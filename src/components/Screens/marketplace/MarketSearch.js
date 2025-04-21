import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MarketSearch = () => {
  return (
    <View style={styles.container}>
      <Text>This component is now integrated into Marketplace.js</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
});

export default MarketSearch;