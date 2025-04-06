import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // FontAwesome for the edit icon

const EditProfile = () => {
  const navigation = useNavigation();

  // Dummy data for the profile (initial values)
  const [profile, setProfile] = useState({
    name: 'John Doe',
    age: 25,
    about: 'I am a passionate gamer and developer.',
    education: 'Undergrad degree in Computer Science',
    lookingFor: 'Looking for gaming partners and developers.',
    bestAt: 'Best at coding, problem-solving, and multiplayer games.',
    plan: 'Working on my own game development project.',
  });

  // Handler for updating profile info
  const handleUpdate = (field, value) => {
    setProfile((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.coverImage} />
        <View style={styles.profileInfo}>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.profileImage} />
          <Text style={styles.displayName}>{profile.name}, {profile.age}</Text>
        </View>
      </View>

      {/* Editable Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display Name:</Text>
        <View style={styles.sectionContent}>
          <TextInput
            style={styles.inputField}
            value={profile.name}
            onChangeText={(text) => handleUpdate('name', text)}
          />
          <TouchableOpacity style={styles.editButton}>
            <FontAwesome name="edit" size={20} color="#00bcd4" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Age:</Text>
        <View style={styles.sectionContent}>
          <TextInput
            style={styles.inputField}
            value={String(profile.age)}
            keyboardType="numeric"
            onChangeText={(text) => handleUpdate('age', text)}
          />
          <TouchableOpacity style={styles.editButton}>
            <FontAwesome name="edit" size={20} color="#00bcd4" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Me:</Text>
        <View style={styles.sectionContent}>
          <TextInput
            style={styles.inputField}
            value={profile.about}
            onChangeText={(text) => handleUpdate('about', text)}
          />
          <TouchableOpacity style={styles.editButton}>
            <FontAwesome name="edit" size={20} color="#00bcd4" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education:</Text>
        <View style={styles.sectionContent}>
          <TextInput
            style={styles.inputField}
            value={profile.education}
            onChangeText={(text) => handleUpdate('education', text)}
          />
          <TouchableOpacity style={styles.editButton}>
            <FontAwesome name="edit" size={20} color="#00bcd4" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Looking For:</Text>
        <View style={styles.sectionContent}>
          <TextInput
            style={styles.inputField}
            value={profile.lookingFor}
            onChangeText={(text) => handleUpdate('lookingFor', text)}
          />
          <TouchableOpacity style={styles.editButton}>
            <FontAwesome name="edit" size={20} color="#00bcd4" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Best At:</Text>
        <View style={styles.sectionContent}>
          <TextInput
            style={styles.inputField}
            value={profile.bestAt}
            onChangeText={(text) => handleUpdate('bestAt', text)}
          />
          <TouchableOpacity style={styles.editButton}>
            <FontAwesome name="edit" size={20} color="#00bcd4" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Plan:</Text>
        <View style={styles.sectionContent}>
          <TextInput
            style={styles.inputField}
            value={profile.plan}
            onChangeText={(text) => handleUpdate('plan', text)}
          />
          <TouchableOpacity style={styles.editButton}>
            <FontAwesome name="edit" size={20} color="#00bcd4" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={() => alert('Profile updated!')}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 20,
  },
  profileHeader: {
    position: 'relative',
    marginBottom: 20,
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  profileInfo: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  displayName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputField: {
    width: '80%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 5,
    fontSize: 16,
  },
  editButton: {
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#00bcd4',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EditProfile;
