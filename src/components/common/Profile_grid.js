// GridItem.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Or any other icon library you prefer

const GridItem = ({ title, icon, description }) => {
  return (
    <View style={styles.gridItem}>
      <View style={styles.gridItemHeader}>
        {icon && <FontAwesome name={icon} size={24} color="#00bcd4" />}
        <Text style={styles.gridItemTitle}>{title}</Text>
      </View>
      <Text style={styles.gridItemDescription}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    elevation: 2,
  },
  gridItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  gridItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  gridItemDescription: {
    fontSize: 14,
    color: '#555',
  },
});

export default GridItem;
