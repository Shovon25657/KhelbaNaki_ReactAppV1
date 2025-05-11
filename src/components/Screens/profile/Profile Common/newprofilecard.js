import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const NewProfileCard = ({profileData}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>
        Gaming Name: {profileData?.gamingName || 'Not set'}
      </Text>
      <Text style={styles.label}>
        Age: {profileData?.age || 'Not provided'}
      </Text>
      <Text style={styles.label}>
        Bio: {profileData?.bio || 'No bio available'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'rgba(47, 7, 226, 0.05)',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#0f3460',
  },
});

export default NewProfileCard;