import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Switch
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BG_IMAGE = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.backgroundImage} blurRadius={2}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="transparent" translucent barStyle="light-content" />
        {/* Added paddingTop to move the header down */}
        <View style={[styles.settingsContainer, {paddingTop: StatusBar.currentHeight || 20}]}>
          <View style={styles.settingsHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={28} color="#FFD700" />
            </TouchableOpacity>
            <Text style={styles.settingsHeaderTitle}>SETTINGS</Text>
            <View style={{ width: 28 }} />
          </View>
          
          <View style={styles.settingsContent}>
            <View style={styles.settingsItem}>
              <Icon name="notifications" size={24} color="#FFD700" />
              <Text style={styles.settingsItemText}>Notifications</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#4CAF50" }}
                thumbColor={notificationsEnabled ? "#FFF" : "#f4f3f4"}
                onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
                value={notificationsEnabled}
              />
            </View>
            
            <View style={styles.settingsItem}>
              <Icon name="dark-mode" size={24} color="#FFD700" />
              <Text style={styles.settingsItemText}>Dark Mode</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#4CAF50" }}
                thumbColor={darkModeEnabled ? "#FFF" : "#f4f3f4"}
                onValueChange={() => setDarkModeEnabled(!darkModeEnabled)}
                value={darkModeEnabled}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.settingsItem}
              onPress={() => navigation.navigate('HelpSupport')}
            >
              <Icon name="help" size={24} color="#FFD700" />
              <Text style={styles.settingsItemText}>Help & Support</Text>
              <Icon name="chevron-right" size={24} color="#FFD700" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingsItem}
              onPress={() => navigation.navigate('About')}
            >
              <Icon name="info" size={24} color="#FFD700" />
              <Text style={styles.settingsItemText}>About</Text>
              <Icon name="chevron-right" size={24} color="#FFD700" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  settingsContainer: {
    flex: 1,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
  },
  settingsHeaderTitle: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: 'bold',
  },
  settingsContent: {
    padding: 20,
    marginTop: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  settingsItemText: {
    color: '#FFF',
    fontSize: 18,
    marginLeft: 20,
    flex: 1,
  },
});

export default SettingsScreen;