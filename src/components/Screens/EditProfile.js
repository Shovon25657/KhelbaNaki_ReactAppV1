import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const EditProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
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
    coverImage: 'https://via.placeholder.com/400x200',
    profileImage: 'https://via.placeholder.com/100',
  });

  const [editingSection, setEditingSection] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [editingAge, setEditingAge] = useState(false);

  const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile({...profile, profileImage: result.assets[0].uri});
    }
  };

  const pickCoverImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 2],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile({...profile, coverImage: result.assets[0].uri});
    }
  };

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

  const handleRemoveItem = (section, index) => {
    const updatedSection = [...profile[section]];
    updatedSection.splice(index, 1);
    setProfile({
      ...profile,
      [section]: updatedSection
    });
  };

  const handleEditName = () => {
    setEditingName(true);
  };

  const handleEditAge = () => {
    setEditingAge(true);
  };

  const saveName = () => {
    setEditingName(false);
  };

  const saveAge = () => {
    setEditingAge(false);
  };

  const saveProfile = () => {
    navigation.navigate('Profile', { profile });
  };

  const renderEditableSection = (title, sectionName) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
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
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <TouchableOpacity onPress={pickCoverImage} style={styles.coverImageWrapper}>
            <Image 
              source={{ uri: profile.coverImage }} 
              style={styles.coverImage} 
              resizeMode="cover"
            />
            <View style={styles.cameraIconCover}>
              <Ionicons name="camera" size={28} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={pickProfileImage} style={styles.profileImageWrapper}>
            <Image 
              source={{ uri: profile.profileImage }} 
              style={styles.profileImage}
              resizeMode="cover"
            />
            <View style={styles.cameraIconProfile}>
              <Ionicons name="camera" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Editable Name and Age Section */}
        <View style={styles.nameGrid}>
          <View style={styles.nameAgeContainer}>
            {editingName ? (
              <View style={styles.editFieldContainer}>
                <TextInput
                  style={styles.editFieldInput}
                  value={profile.name}
                  onChangeText={(text) => setProfile({...profile, name: text})}
                  autoFocus
                />
                <TouchableOpacity onPress={saveName} style={styles.editFieldSave}>
                  <Ionicons name="checkmark" size={20} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.editableTextContainer}
                onPress={handleEditName}
              >
                <Text style={styles.displayName}>{profile.name}</Text>
                <Ionicons name="pencil" size={16} color="#00bcd4" style={styles.editIcon} />
              </TouchableOpacity>
            )}
            
            {editingAge ? (
              <View style={[styles.editFieldContainer, { marginLeft: 10 }]}>
                <Text>, </Text>
                <TextInput
                  style={styles.editFieldInput}
                  value={profile.age.toString()}
                  onChangeText={(text) => setProfile({...profile, age: parseInt(text) || 0})}
                  keyboardType="numeric"
                  autoFocus
                />
                <TouchableOpacity onPress={saveAge} style={styles.editFieldSave}>
                  <Ionicons name="checkmark" size={20} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.editableTextContainer}
                onPress={handleEditAge}
              >
                <Text style={styles.displayAge}>, {profile.age}</Text>
                <Ionicons name="pencil" size={16} color="#00bcd4" style={styles.editIcon} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.sectionSpacing} />

        {/* Profile Sections */}
        {renderEditableSection("About Me", "about")}
        {renderEditableSection("Looking For", "lookingFor")}
        {renderEditableSection("Best At", "bestAt")}
        {renderEditableSection("My Plan", "plan")}

        {/* Save Button */}
        <TouchableOpacity onPress={saveProfile} style={styles.bottomSaveButton}>
          <Text style={styles.bottomSaveButtonText}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1f1f1',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  coverContainer: {
    position: 'relative',
    marginBottom: 60,
  },
  coverImageWrapper: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    borderColor: '#000',
    borderWidth: 2,
  },
  cameraIconCover: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 6,
  },
  profileImageContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    borderRadius: 55,
    padding: 2,
    backgroundColor: '#fff',
  },
  profileImageWrapper: {
    borderRadius: 55,
    padding: 2,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#000',
  },
  cameraIconProfile: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 5,
  },
  nameGrid: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    marginTop: 10,
  },
  nameAgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editableTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  displayAge: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  editIcon: {
    marginLeft: 8,
  },
  editFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editFieldInput: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#00bcd4',
    paddingVertical: 2,
    minWidth: 50,
  },
  editFieldSave: {
    marginLeft: 8,
  },
  sectionSpacing: {
    height: 20,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 20,
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
  bottomSaveButton: {
    backgroundColor: '#00bcd4',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  bottomSaveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditProfile;