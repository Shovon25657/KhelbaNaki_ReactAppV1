import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  Image,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CreateGroup = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error'); // 'error' or 'success'
  
  // Sample friends data
  const [friends, setFriends] = useState([
    { id: 1, name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', selected: false },
    { id: 2, name: 'Sarah Miller', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', selected: false },
    { id: 3, name: 'David Wilson', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', selected: false },
    { id: 4, name: 'Emma Thompson', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', selected: false },
    { id: 5, name: 'Michael Brown', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', selected: false },
    { id: 6, name: 'Jessica Davis', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', selected: false },
  ]);

  // Filter friends based on search query
  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFriendSelection = (friendId) => {
    const updatedFriends = friends.map(friend => 
      friend.id === friendId ? { ...friend, selected: !friend.selected } : friend
    );
    setFriends(updatedFriends);
    
    const selected = updatedFriends.filter(friend => friend.selected);
    setSelectedFriends(selected);
  };

  const showAlertMessage = (message, type = 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const createGroup = () => {
    if (groupName.trim() === '') {
      showAlertMessage('Please enter a group name');
      return;
    }
    
    if (selectedFriends.length === 0) {
      showAlertMessage('Please select at least one friend');
      return;
    }
    
    if (selectedFriends.length < 2) {
      showAlertMessage('Group must have at least 2 members', 'error');
      return;
    }
    
    // In a real app, save the group to your database/state here
    console.log('Creating group:', {
      name: groupName,
      members: selectedFriends
    });
    
    // Show success message
    showAlertMessage('Group created successfully!', 'success');
    
    // Navigate back after a delay
    setTimeout(() => {
      navigation.goBack();
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Group</Text>
        <TouchableOpacity onPress={createGroup}>
          <Text style={styles.createButton}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* Group Name Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Group Name"
          placeholderTextColor="#888"
          value={groupName}
          onChangeText={setGroupName}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Selected Friends Preview */}
      {selectedFriends.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={styles.sectionTitle}>Selected Members ({selectedFriends.length})</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectedFriendsScroll}
          >
            {selectedFriends.map(friend => (
              <View key={friend.id} style={styles.selectedFriend}>
                <Image source={{ uri: friend.avatar }} style={styles.selectedAvatar} />
                <Text style={styles.selectedName} numberOfLines={1}>{friend.name}</Text>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => toggleFriendSelection(friend.id)}
                >
                  <Ionicons name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Friends List */}
      <Text style={styles.sectionTitle}>Select Friends</Text>
      <ScrollView style={styles.friendsList}>
        {filteredFriends.map(friend => (
          <TouchableOpacity 
            key={friend.id} 
            style={styles.friendItem}
            onPress={() => toggleFriendSelection(friend.id)}
          >
            <Image source={{ uri: friend.avatar }} style={styles.avatar} />
            <Text style={styles.friendName}>{friend.name}</Text>
            <View style={[
              styles.checkbox,
              friend.selected && styles.checkboxSelected
            ]}>
              {friend.selected && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Custom Alert Modal */}
      <Modal
        transparent={true}
        visible={showAlert}
        animationType="fade"
        onRequestClose={() => setShowAlert(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowAlert(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={[
          styles.alertContainer,
          alertType === 'error' ? styles.errorAlert : styles.successAlert
        ]}>
          <View style={styles.alertIcon}>
            <Ionicons 
              name={alertType === 'error' ? "warning" : "checkmark-circle"} 
              size={28} 
              color="#fff" 
            />
          </View>
          <Text style={styles.alertText}>{alertMessage}</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#252538',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  createButton: {
    color: '#4a80f0',
    fontSize: 16,
    fontWeight: '500',
  },
  inputContainer: {
    padding: 15,
  },
  input: {
    backgroundColor: '#252538',
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252538',
    borderRadius: 20,
    marginHorizontal: 15,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: '600',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  selectedContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#252538',
    paddingBottom: 10,
  },
  selectedFriendsScroll: {
    paddingHorizontal: 15,
  },
  selectedFriend: {
    alignItems: 'center',
    marginRight: 15,
    width: 70,
    position: 'relative',
  },
  selectedAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  selectedName: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: 5,
    backgroundColor: '#f05a5a',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendsList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#252538',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  friendName: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#4a80f0',
    borderColor: '#4a80f0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  alertContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorAlert: {
    backgroundColor: '#f05a5a',
  },
  successAlert: {
    backgroundColor: '#4CAF50',
  },
  alertIcon: {
    marginRight: 10,
  },
  alertText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
});

export default CreateGroup;