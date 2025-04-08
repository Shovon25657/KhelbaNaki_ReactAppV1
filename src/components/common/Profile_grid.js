import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const GridItem = ({ title, description, titleRightComponent }) => {
  return (
    <View style={styles.gridItem}>
      <View style={styles.headerContainer}>
        <Text style={styles.gridItemTitle}>{title}</Text>
        {titleRightComponent}
      </View>

      <View style={styles.descriptionContainer}>
        {Array.isArray(description) ? 
          description.map((item, index) => (
            <View key={index} style={styles.tagBox}>
              <FontAwesome name={item.icon} size={14} color="#00bcd4" />
              <Text style={styles.tagText}>{item.text}</Text>
            </View>
          )) : description}
      </View>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  gridItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00bcd4',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    marginLeft: 5,
    color: '#333',
  },
});

export default GridItem;