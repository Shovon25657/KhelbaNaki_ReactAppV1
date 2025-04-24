import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Feather';

const Header = ({ 
  title, 
  onMenuPress, 
  onActionPress, 
  actionIcon = 'bolt',
  actionIconColor = '#FFD700'
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={onMenuPress} 
        style={styles.menuButton}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <Icon2 name="menu" size={28} color="#FFF" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>{title}</Text>
      
      <TouchableOpacity 
        onPress={onActionPress} 
        style={styles.actionButton}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <Icon name={actionIcon} size={28} color={actionIconColor} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgb(14, 3, 52)',
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Roboto',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuButton: {
    padding: 5,
  },
  actionButton: {
    padding: 5,
  },
});



export default Header;