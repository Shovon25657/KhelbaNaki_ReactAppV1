import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ActionButtons = ({ 
  onLike, 
  onDislike, 
  isTransitioning,
  likeButtonColor = '#4CAF50',
  dislikeButtonColor = '#F44336'
}) => {
  return (
    <View style={styles.actions}>
      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: dislikeButtonColor }]}
        onPress={onDislike}
        disabled={isTransitioning}
        activeOpacity={0.7}
      >
        <Icon name="close" size={30} color="#FFF" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: likeButtonColor }]}
        onPress={onLike}
        disabled={isTransitioning}
        activeOpacity={0.7}
      >
        <Icon name="done" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    paddingBottom: 15,
    marginBottom: 20,
    gap: 15,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 32.5,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal: 5,
  },
});

export default ActionButtons;