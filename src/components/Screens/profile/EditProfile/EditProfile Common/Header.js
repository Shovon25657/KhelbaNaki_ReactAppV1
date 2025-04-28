import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { responsiveFont, responsiveWidth, responsiveHeight } from '../EditProfile Common/Metrics';

const Header = ({ title, onBack, onSave, saveText = 'Save', backIconColor = '#00ff88', saveButtonColor = 'rgb(6, 185, 234)' }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Feather name="arrow-left" size={responsiveFont(22)} color={backIconColor} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity 
        style={[styles.saveButton, { backgroundColor: saveButtonColor }]} 
        onPress={onSave}
      >
        <Text style={styles.saveButtonText}>{saveText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveHeight(15),
    backgroundColor: 'rgb(14, 3, 52)',
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  headerTitle: {
    fontSize: responsiveFont(20),
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Roboto',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  backButton: {
    padding: responsiveWidth(5),
  },
  saveButton: {
    paddingHorizontal: responsiveWidth(16),
    paddingVertical: responsiveHeight(8),
    borderRadius: responsiveWidth(20),
  },
  saveButtonText: {
    color: '#16213e',
    fontWeight: 'bold',
    fontSize: responsiveFont(14),
  },
});

export default Header;