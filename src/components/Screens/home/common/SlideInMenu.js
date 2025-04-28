import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const SlideInMenu = ({ 
  visible, 
  onClose, 
  menuItems,
  onLogout,
  onPrivacyPolicy,
  onLuminaries,
  headerText = 'MENU'
}) => {
  if (!visible) return null;

  return (
    <View style={styles.slideInMenuContainer}>
      <View style={styles.slideInMenu}>
        <TouchableOpacity 
          style={styles.slideInMenuCloseButton}
          onPress={onClose}
        >
          <Icon name="close" size={30} color="#FFF" />
        </TouchableOpacity>
        
        <View style={styles.slideInMenuHeader}>
          <Text style={styles.slideInMenuHeaderText}>{headerText}</Text>
        </View>
        
        <View style={styles.slideInMenuItems}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.slideInMenuItem}
              onPress={item.onPress}
            >
              <Icon name={item.icon} size={24} color="#FFD700" />
              <Text style={styles.slideInMenuItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          
          {/* Add Luminaries menu item */}
          <TouchableOpacity 
            style={styles.slideInMenuItem}
            onPress={onLuminaries}
          >
            <Icon name="people" size={24} color="#FFD700" />
            <Text style={styles.slideInMenuItemText}>LUMINARIES</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.slideInMenuItem}
            onPress={onLogout}
          >
            <Icon name="logout" size={24} color="#FFD700" />
            <Text style={styles.slideInMenuItemText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.slideInMenuFooter}>
          <TouchableOpacity 
            style={styles.slideInPrivacyButton}
            onPress={onPrivacyPolicy}
          >
            <Icon name="privacy-tip" size={20} color="#FFD700" />
            <Text style={styles.slideInPrivacyText}>PRIVACY POLICY</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.slideInMenuOverlay}
        activeOpacity={1}
        onPress={onClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  slideInMenuContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  slideInMenu: {
    width: width * 0.65,
    height: '100%',
    backgroundColor: 'rgba(1, 1, 27, 0.9)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(53, 16, 172, 0.5)',
  },
  slideInMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  slideInMenuCloseButton: {
    alignSelf: 'flex-end',
    padding: 20,
  },
  slideInMenuHeader: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  slideInMenuHeaderText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  slideInMenuItems: {
    paddingHorizontal: 20,
  },
  slideInMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(143, 142, 140, 0.2)',
  },
  slideInMenuItemText: {
    color: '#FFF',
    fontSize: 18,
    marginLeft: 20,
    fontWeight: 'bold',
  },
  slideInMenuFooter: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(108, 107, 101, 0.2)',
    paddingTop: 20,
  },
  slideInPrivacyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideInPrivacyText: {
    color: '#FFD700',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default SlideInMenu;