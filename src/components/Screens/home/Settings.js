import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#1a1a2e" barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={28} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SETTINGS</Text>
          <View style={{ width: 28 }} />
        </View>
        
        <View style={styles.content}>
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
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgb(1, 12, 20)',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#16213e',
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
  },
  headerTitle: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Arial',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgb(1, 12, 20)',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
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