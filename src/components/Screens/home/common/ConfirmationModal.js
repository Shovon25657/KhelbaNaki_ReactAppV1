import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const ConfirmationModal = ({
  visible,
  title,
  message,
  confirmText = 'CONFIRM',
  cancelText = 'CANCEL',
  onConfirm,
  onCancel,
  iconName = 'warning',
  iconColor = 'rgb(1, 225, 255)'
}) => {
  if (!visible) return null;

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Icon name={iconName} size={40} color={iconColor} />
          <Text style={styles.modalTitle}>{title}</Text>
        </View>
        
        <Text style={styles.modalText}>
          {message}
        </Text>
        
        <View style={styles.modalButtons}>
          <TouchableOpacity 
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.modalButtonText}>{cancelText}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modalButton, styles.confirmButton]}
            onPress={onConfirm}
          >
            <Text style={styles.modalButtonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: 'rgb(14, 3, 52)',
    borderRadius: 20,
    padding: 25,
    borderWidth: 2,
    borderColor: 'rgb(1, 225, 255)',
    shadowColor: 'rgb(1, 225, 255)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'rgb(1, 225, 255)',
    marginLeft: 10,
    textShadowColor: 'rgba(1, 225, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  modalText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
  },
  cancelButton: {
    backgroundColor: 'rgb(1, 12, 20)',
    borderColor: 'rgb(1, 225, 255)',
  },
  confirmButton: {
    backgroundColor: 'rgb(120, 1, 255)',
    borderColor: 'rgb(120, 1, 255)',
  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ConfirmationModal;