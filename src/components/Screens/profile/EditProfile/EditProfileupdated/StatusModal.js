import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { responsiveFont, responsiveWidth, responsiveHeight } from '../EditProfileupdated/Metrics';

export const statusOptions = [
  { id: '1', name: 'Online', icon: 'circle', color: '#00ff88' },
  { id: '2', name: 'Offline', icon: 'circle', color: '#aaa' },
  { id: '3', name: 'Invisible', icon: 'eye-off', color: '#aaa' },
  { id: '4', name: 'Do Not Disturb', icon: 'minus-circle', color: '#e94560' },
  { id: '5', name: 'Ready to Play', icon: 'gamepad', color: '#00bfff' },
];

const StatusModal = ({ visible, onClose, currentStatus, onSelectStatus }) => {
  const renderStatusItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.statusOption} 
      onPress={() => onSelectStatus(item.name)}
    >
      <Feather 
        name={item.icon} 
        size={responsiveFont(20)} 
        color={item.color} 
      />
      <Text style={styles.statusOptionText}>{item.name}</Text>
      {currentStatus === item.name && (
        <Feather 
          name="check" 
          size={responsiveFont(20)} 
          color="#00ff88" 
          style={styles.statusCheck}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Status</Text>
          <FlatList
            data={statusOptions}
            renderItem={renderStatusItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.statusList}
          />
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: responsiveWidth(300),
    backgroundColor: 'rgb(1, 2, 23)',
    borderRadius: responsiveWidth(15),
    padding: responsiveWidth(20),
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  modalTitle: {
    fontSize: responsiveFont(20),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: responsiveHeight(20),
    textAlign: 'center',
  },
  statusList: {
    paddingBottom: responsiveHeight(10),
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(12),
    paddingHorizontal: responsiveWidth(15),
    marginBottom: responsiveHeight(5),
    backgroundColor: '#0f3460',
    borderRadius: responsiveWidth(10),
  },
  statusOptionText: {
    fontSize: responsiveFont(16),
    color: '#fff',
    marginLeft: responsiveWidth(10),
    flex: 1,
  },
  statusCheck: {
    marginLeft: 'auto',
  },
  closeButton: {
    backgroundColor: 'rgb(77, 20, 232)',
    padding: responsiveWidth(12),
    borderRadius: responsiveWidth(10),
    marginTop: responsiveHeight(10),
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFont(16),
  },
});

export default StatusModal;