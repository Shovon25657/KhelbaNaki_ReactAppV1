import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { responsiveFont, responsiveWidth, responsiveHeight } from '../EditProfile Common/Metrics';

const ProfileImagePicker = ({ image, onPress, size = 100, position = 'absolute', style }) => {
  return (
    <View style={[styles.profilePhotoContainer, { 
      width: responsiveWidth(size), 
      height: responsiveWidth(size), 
      borderRadius: responsiveWidth(size / 2),
      position,
      ...style 
    }]}>
      <Image 
        source={image} 
        style={[styles.profilePhoto, { 
          width: '100%', 
          height: '100%' 
        }]} 
      />
      <TouchableOpacity 
        style={[styles.changeProfileButton, {
          width: responsiveWidth(size / 3.3),
          height: responsiveWidth(size / 3.3),
          borderRadius: responsiveWidth(size / 6.6),
        }]}
        onPress={onPress}
      >
        <Feather name="camera" size={responsiveFont(size / 6)} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profilePhotoContainer: {
    borderWidth: 4,
    borderColor: '#062452',
    overflow: 'hidden',
    backgroundColor: 'rgb(164, 167, 170)',
    shadowColor: '#062452',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  profilePhoto: {
    resizeMode: 'cover',
  },
  changeProfileButton: {
    position: 'absolute',
    bottom: responsiveHeight(5),
    right: responsiveWidth(5),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileImagePicker;