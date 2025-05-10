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
      <StatusBar backgroundColor="rgb(14, 3, 52)" barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={28} color="rgb(1, 225, 255)" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SETTINGS</Text>
          <View style={{ width: 28 }} />
        </View>
        
        <View style={styles.content}>
          <View style={styles.settingsItem}>
            <Icon name="notifications" size={24} color="rgb(1, 225, 255)" />
            <Text style={styles.settingsItemText}>Notifications</Text>
            <Switch
              trackColor={{ false: "#767577", true: "rgb(1, 225, 255)" }}
              thumbColor={notificationsEnabled ? "#FFF" : "#f4f3f4"}
              onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
              value={notificationsEnabled}
            />
          </View>
          
          <View style={styles.settingsItem}>
            <Icon name="dark-mode" size={24} color="rgb(1, 225, 255)" />
            <Text style={styles.settingsItemText}>Dark Mode</Text>
            <Switch
              trackColor={{ false: "#767577", true: "rgb(1, 225, 255)" }}
              thumbColor={darkModeEnabled ? "#FFF" : "#f4f3f4"}
              onValueChange={() => setDarkModeEnabled(!darkModeEnabled)}
              value={darkModeEnabled}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => navigation.navigate('HelpSupport')}
          >
            <Icon name="help" size={24} color="rgb(1, 225, 255)" />
            <Text style={styles.settingsItemText}>Help & Support</Text>
            <Icon name="chevron-right" size={24} color="rgb(1, 225, 255)" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => navigation.navigate('About')}
          >
            <Icon name="info" size={24} color="rgb(1, 225, 255)" />
            <Text style={styles.settingsItemText}>About</Text>
            <Icon name="chevron-right" size={24} color="rgb(1, 225, 255)" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <Icon name="privacy-tip" size={24} color="rgb(1, 225, 255)" />
            <Text style={styles.settingsItemText}>Legal Documents</Text>
            <Icon name="chevron-right" size={24} color="rgb(1, 225, 255)" />
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
    backgroundColor: 'rgb(14, 3, 52)',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    flex: 1,
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
    borderBottomColor: 'rgba(1, 225, 255, 0.2)',
  },
  settingsItemText: {
    color: '#FFF',
    fontSize: 18,
    marginLeft: 20,
    flex: 1,
  },
});

export default SettingsScreen;