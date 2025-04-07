import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const EditProfile = ({ route }) => {
  const navigation = useNavigation();
  const { profile: initialProfile } = route.params || {};

  const [profile, setProfile] = useState(initialProfile || {
    name: 'John Doe',
    age: 25,
    about: [
      { icon: 'graduation-cap', text: 'Undergrad Degree' },
      { icon: 'gamepad', text: 'Gamer & Dev' },
    ],
    lookingFor: [
      { icon: 'users', text: 'Gaming Partners' },
      { icon: 'code', text: 'Developers' },
    ],
    bestAt: [
      { icon: 'laptop', text: 'Coding' },
      { icon: 'puzzle-piece', text: 'Problem Solving' },
      { icon: 'trophy', text: 'Multiplayer Games' },
    ],
    plan: [
      { icon: 'rocket', text: 'Game Project' },
      { icon: 'lightbulb-o', text: 'New Ideas' },
    ],
  });

  const [editingSection, setEditingSection] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');

  const handleEdit = (section, index) => {
    setEditingSection(section);
    setEditingIndex(index);
    setEditText(profile[section][index].text);
  };

  const handleSaveEdit = () => {
    if (editingSection && editingIndex !== null) {
      const updatedSection = [...profile[editingSection]];
      updatedSection[editingIndex] = {
        ...updatedSection[editingIndex],
        text: editText
      };
      
      setProfile({
        ...profile,
        [editingSection]: updatedSection
      });
    }
    setEditingSection(null);
    setEditingIndex(null);
  };

  const handleAddItem = (section) => {
    const newItem = { icon: 'plus', text: 'New Item' };
    setProfile({
      ...profile,
      [section]: [...profile[section], newItem]
    });
    // Automatically open edit mode for the new item
    handleEdit(section, profile[section].length);
  };

  const handleRemoveItem = (section, index) => {
    const updatedSection = [...profile[section]];
    updatedSection.splice(index, 1);
    setProfile({
      ...profile,
      [section]: updatedSection
    });
  };

  const saveProfile = () => {
    // Here you would typically save to your backend or state management
    navigation.goBack();
  };

  const renderEditableSection = (title, sectionName) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => handleAddItem(sectionName)}
        >
          <Ionicons name="add" size={24} color="#00bcd4" />
        </TouchableOpacity>
      </View>
      
      {profile[sectionName].map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          {editingSection === sectionName && editingIndex === index ? (
            <View style={styles.editInputContainer}>
              <TextInput
                style={styles.editInput}
                value={editText}
                onChangeText={setEditText}
                autoFocus
              />
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSaveEdit}
              >
                <Ionicons name="checkmark" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.itemContent}>
              <View style={styles.itemTextContainer}>
                <Ionicons name={item.icon} size={20} color="#666" style={styles.itemIcon} />
                <Text style={styles.itemText}>{item.text}</Text>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity 
                  style={styles.editButton} 
                  onPress={() => handleEdit(sectionName, index)}
                >
                  <Ionicons name="pencil" size={18} color="#00bcd4" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => handleRemoveItem(sectionName, index)}
                >
                  <Ionicons name="trash" size={18} color="#f44336" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#00bcd4" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={saveProfile} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mainInfoContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.textInput}
            value={profile.name}
            onChangeText={(text) => setProfile({...profile, name: text})}
          />

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.textInput}
            value={profile.age.toString()}
            onChangeText={(text) => setProfile({...profile, age: parseInt(text) || 0})}
            keyboardType="numeric"
          />
        </View>

        {renderEditableSection("About Me", "about")}
        {renderEditableSection("Looking For", "lookingFor")}
        {renderEditableSection("Best At", "bestAt")}
        {renderEditableSection("My Plan", "plan")}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    padding: 5,
  },
  saveButtonText: {
    color: '#00bcd4',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mainInfoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    margin: 10,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    margin: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: 5,
  },
  itemContainer: {
    marginBottom: 10,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  itemTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  itemActions: {
    flexDirection: 'row',
  },
  editButton: {
    marginLeft: 10,
    padding: 5,
  },
  deleteButton: {
    marginLeft: 5,
    padding: 5,
  },
  editInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    backgroundColor: '#fff',
  },
  saveButton: {
    marginLeft: 10,
    padding: 5,
  },
});

export default EditProfile;