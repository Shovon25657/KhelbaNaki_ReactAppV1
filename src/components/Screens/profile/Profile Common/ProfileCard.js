import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { responsiveWidth, responsiveHeight, responsiveFont } from './responsiveDimensions';

const ProfileCard = ({ title, data }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.gridContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.smallGridItem}>
            <FontAwesome5 
              name={item.icon} 
              size={responsiveFont(16)} 
              style={styles.icons}
            />
            <Text style={styles.smallGridLabel}>{item.label}</Text>
            <Text style={styles.smallGridValue}>{item.value}</Text>
          </View>
        ))}
      </View>
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
  sectionTitle: {
    fontSize: responsiveFont(18),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(15),
    color: 'rgb(1, 225, 255)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  smallGridItem: {
    width: responsiveWidth(90),
    alignItems: 'center',
    padding: responsiveWidth(8),
    backgroundColor: 'rgba(14, 113, 226, 0.03)',
    borderRadius: responsiveWidth(10),
    marginBottom: responsiveHeight(10),
    borderWidth: 0.5,
    borderColor: 'rgba(14, 113, 226, 0.42)',
  },
  icons: {
    color: 'rgba(169, 209, 244, 0.82)',
  },
  smallGridLabel: {
    fontSize: responsiveFont(10),
    color: 'rgba(206, 201, 201, 0.7)',
    marginTop: responsiveHeight(4),
    textAlign: 'center',
  },
  smallGridValue: {
    fontSize: responsiveFont(12),
    fontWeight: 'bold',
    color: '#fff',
    marginTop: responsiveHeight(2),
    textAlign: 'center',
  },
});

export default ProfileCard;