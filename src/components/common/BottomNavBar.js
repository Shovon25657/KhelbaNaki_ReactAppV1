import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const BottomNavBar = () => {
  const navigation = useNavigation();

  const navItems = [
    { name: 'Profile', icon: 'person', screen: 'Profile' },
    { name: 'Explore', icon: 'explore', screen: 'Explore' },
    { name: 'Home', icon: 'home', screen: 'Home' },
    { name: 'Marketplace', icon: 'store', screen: 'Marketplace' },
    { name: 'Chat', icon: 'chat', screen: 'Chat' },
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.navItem}
          onPress={() => navigation.navigate(item.screen)}
        >
          <Icon name={item.icon} size={24} color="#FFD700" />
          <Text style={styles.navText}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#16213e',
    borderTopWidth: 1,
    borderTopColor: '#FFD700',
    paddingHorizontal: 5,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    flex: 1,
  },
  navText: {
    color: '#FFD700',
    fontSize: 12,
    marginTop: 4,
  },
});

export default BottomNavBar;