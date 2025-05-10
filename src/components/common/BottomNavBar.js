import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const BottomNavBar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const windowWidth = Dimensions.get('window').width;
  
  const navItems = [
    { name: 'Profile', icon: 'person-outline', activeIcon: 'person', screen: 'Profile' },
    { name: 'Explore', icon: 'explore', activeIcon: 'explore', screen: 'Explore' },
    { name: 'Home', icon: 'home', activeIcon: 'home', screen: 'Home' }, // Fixed home icon
    { name: 'Market', icon: 'shopping-bag', activeIcon: 'shopping-bag', screen: 'Marketplace' },
    { name: 'Chat', icon: 'chat-bubble-outline', activeIcon: 'chat-bubble', screen: 'Chat' },
  ];

  // Animation values for each tab
  const animatedValues = useRef(navItems.map(() => new Animated.Value(0))).current;
  
  useEffect(() => {
    // Find the active tab index
    const activeIndex = navItems.findIndex(item => route.name === item.screen);
    
    // Animate all tabs
    navItems.forEach((_, index) => {
      Animated.spring(animatedValues[index], {
        toValue: index === activeIndex ? 1 : 0,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    });
  }, [route.name]);

  const isActive = (screen) => route.name === screen;

  // Calculate appropriate icon size based on screen width
  const iconSize = Math.min(Math.max(windowWidth / 25, 20), 26);
  
  return (
    <View style={styles.container}>
      <View style={styles.background} />
      
      {navItems.map((item, index) => {
        const active = isActive(item.screen);
        
        // Animated styles for each tab
        const scale = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2]
        });
        
        const translateY = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8]
        });
        
        return (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <Animated.View 
              style={[
                styles.iconContainer,
                active && styles.activeIconContainer,
                { transform: [{ scale }, { translateY }] }
              ]}
            >
              <Icon 
                name={active ? item.activeIcon : item.icon} 
                size={iconSize} 
                color={active ? '#FFFFFF' : '#6B7280'} 
              />
            </Animated.View>
            
            <Text 
              style={[
                styles.navText,
                active ? styles.activeNavText : styles.inactiveNavText,
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 75,
    backgroundColor: 'transparent',
    paddingBottom: 10,
    paddingTop: 10,
    paddingHorizontal: 10,
    position: 'relative',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 75,
     backgroundColor: 'rgba(14, 3, 52, 0.01)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 5,
    zIndex: 10,
    height: 55,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  activeIconContainer: {
    backgroundColor: '#5E72E4',
    shadowColor: '#5E72E4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  navText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  activeNavText: {
    color: '#5E72E4',
    fontWeight: '600',
  },
  inactiveNavText: {
    color: 'rgba(161, 161, 161, 0)',
  }
});

export default BottomNavBar;