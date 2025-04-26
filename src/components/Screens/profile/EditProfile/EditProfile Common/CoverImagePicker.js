import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { responsiveFont, responsiveWidth, responsiveHeight } from '../EditProfileupdated/Metrics';

const CoverImagePicker = ({ image, onPress, height = 200 }) => {
  return (
    <View style={[styles.coverContainer, { height: responsiveHeight(height) }]}>
      <Image 
        source={image} 
        style={styles.coverPhoto} 
      />
      <TouchableOpacity 
        style={styles.changeCoverButton}
        onPress={onPress}
      >
        <Feather name="camera" size={responsiveFont(18)} color="#fff" />
        <Text style={styles.changeButtonText}>Change Cover</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  coverContainer: {
    position: 'relative',
    backgroundColor: '#0f3460',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  changeCoverButton: {
    position: 'absolute',
    top: responsiveHeight(10),
    right: responsiveWidth(10),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: responsiveWidth(10),
    paddingVertical: responsiveHeight(5),
    borderRadius: responsiveWidth(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeButtonText: {
    fontSize: responsiveFont(12),
    color: '#fff',
    marginLeft: responsiveWidth(5),
  },
});

export default CoverImagePicker;