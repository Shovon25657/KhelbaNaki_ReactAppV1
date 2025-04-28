import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { responsiveWidth, responsiveHeight, responsiveFont } from './responsiveDimensions';

const PlanSection = ({ title, plan }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.planCard}>
        <View style={styles.planHeader}>
          <MaterialCommunityIcons 
            name="crown" 
            size={responsiveFont(24)} 
            color="#FFD700" 
          />
          <Text style={styles.planName}>{plan.name}</Text>
        </View>
        <View style={styles.planFeatures}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
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
  planCard: {
    backgroundColor: 'rgba(22, 179, 211, 0.04)',
    borderRadius: responsiveWidth(15),
    padding: responsiveWidth(15),
    borderWidth: 1,
    borderColor: 'rgba(22, 179, 211, 0.42)',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(10),
  },
  planName: {
    fontSize: responsiveFont(18),
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: responsiveWidth(10),
  },
  planFeatures: {
    paddingLeft: responsiveWidth(5),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: responsiveHeight(8),
  },
  bulletPoint: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    borderRadius: responsiveWidth(10),
    backgroundColor: 'rgb(252, 252, 252)',
    marginTop: responsiveHeight(5),
    marginRight: responsiveWidth(8),
  },
  featureText: {
    fontSize: responsiveFont(14),
    color: '#fff',
    flex: 1,
  },
});

export default PlanSection;