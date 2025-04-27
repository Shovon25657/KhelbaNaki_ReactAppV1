import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { responsiveFont, responsiveWidth, responsiveHeight } from '../EditProfile Common/Metrics';

const EditableSection = ({ 
  title, 
  onEdit, 
  children, 
  showEditButton = true, 
  editIcon = "edit-2", // Default to edit icon
  editIconColor = 'rgba(169, 209, 244, 0.82)',
  titleColor = 'rgb(1, 225, 255)'
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleContainer}>
        <Text style={[styles.sectionTitle, { color: titleColor }]}>{title}</Text>
        {showEditButton && (
          <TouchableOpacity onPress={onEdit}>
            <Feather 
              name={editIcon} // Use the editIcon prop here
              size={responsiveFont(18)} 
              color={editIconColor} 
            />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'rgba(47, 7, 226, 0.05)',
    paddingHorizontal: responsiveWidth(20),
    paddingVertical: responsiveHeight(15),
    marginBottom: responsiveHeight(10),
    borderRadius: responsiveWidth(10),
    marginHorizontal: responsiveWidth(10),
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(15),
  },
  sectionTitle: {
    fontSize: responsiveFont(18),
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default EditableSection;