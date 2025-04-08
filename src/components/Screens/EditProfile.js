import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Responsive sizing functions
const responsiveWidth = (size) => (width / 375) * size;
const responsiveHeight = (size) => (height / 812) * size;
const responsiveFont = (size) => (width / 375) * size;

const EditProfile = ({ navigation, route }) => {
  // Initialize with proper default values
  const [userData, setUserData] = useState({
    name: '',
    photos: [],
    interests: [],
    about: '',
    jobTitle: '',
    company: '',
    school: '',
    birthday: '',
    gender: '',
    lookingFor: '',
    ...route.params?.user
  });

  const [about, setAbout] = useState(userData.about || '');
  const [jobTitle, setJobTitle] = useState(userData.jobTitle || '');
  const [company, setCompany] = useState(userData.company || '');
  const [school, setSchool] = useState(userData.school || '');
  const [selectedInterests, setSelectedInterests] = useState(userData.interests || []);

  const allInterests = [
    'Travel', 'Hiking', 'Photography', 'Dogs', 'Coffee', 'Reading',
    'Movies', 'Music', 'Dancing', 'Cooking', 'Yoga', 'Fitness',
    'Art', 'Gaming', 'Wine', 'Technology', 'Politics', 'Fashion'
  ];

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    const updatedUser = {
      ...userData,
      about,
      jobTitle,
      company,
      school,
      interests: selectedInterests,
    };
    
    Alert.alert('Profile Updated', 'Your profile has been updated successfully');
    navigation.navigate('Profile', { updatedUser });
  };

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      if (selectedInterests.length < 6) {
        setSelectedInterests([...selectedInterests, interest]);
      } else {
        Alert.alert('Maximum Interests', 'You can select up to 6 interests');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Edit Profile</Text>
        
        <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Photos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <View style={styles.photoGrid}>
            {/* Safely handle photos array */}
            {userData.photos?.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image 
                  source={typeof photo === 'string' ? { uri: photo } : photo} 
                  style={styles.photo} 
                />
                <TouchableOpacity style={styles.removePhotoButton}>
                  <Feather name="x" size={responsiveFont(14)} color="#fff" />
                </TouchableOpacity>
                {index === 0 && (
                  <View style={styles.mainPhotoBadge}>
                    <Text style={styles.mainPhotoText}>Main</Text>
                  </View>
                )}
              </View>
            ))}
            <TouchableOpacity style={styles.addPhotoButton}>
              <Feather name="plus" size={responsiveFont(24)} color="#ccc" />
            </TouchableOpacity>
          </View>
          <Text style={styles.photoTip}>
            Tip: Add at least 4 photos to get more matches
          </Text>
        </View>

        {/* Basic Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Info</Text>
          <View style={styles.infoField}>
            <Text style={styles.fieldLabel}>Name</Text>
            <View style={styles.fieldValue}>
              <Text style={styles.fieldText}>{userData.name || 'Not specified'}</Text>
              <Feather name="chevron-right" size={responsiveFont(16)} color="#ccc" />
            </View>
          </View>
          <View style={styles.infoField}>
            <Text style={styles.fieldLabel}>Birthday</Text>
            <View style={styles.fieldValue}>
              <Text style={styles.fieldText}>{userData.birthday || 'Not specified'}</Text>
              <Feather name="chevron-right" size={responsiveFont(16)} color="#ccc" />
            </View>
          </View>
          <View style={styles.infoField}>
            <Text style={styles.fieldLabel}>Gender</Text>
            <View style={styles.fieldValue}>
              <Text style={styles.fieldText}>{userData.gender || 'Not specified'}</Text>
              <Feather name="chevron-right" size={responsiveFont(16)} color="#ccc" />
            </View>
          </View>
          <View style={styles.infoField}>
            <Text style={styles.fieldLabel}>Looking for</Text>
            <View style={styles.fieldValue}>
              <Text style={styles.fieldText}>{userData.lookingFor || 'Not specified'}</Text>
              <Feather name="chevron-right" size={responsiveFont(16)} color="#ccc" />
            </View>
          </View>
        </View>

        {/* About Me Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <TextInput
            style={styles.aboutInput}
            multiline
            placeholder="Share something about yourself..."
            placeholderTextColor="#999"
            value={about}
            onChangeText={setAbout}
            maxLength={300}
          />
          <Text style={styles.charCount}>{about.length}/300</Text>
        </View>

        {/* Work Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work</Text>
          <TextInput
            style={styles.input}
            placeholder="Job Title"
            placeholderTextColor="#999"
            value={jobTitle}
            onChangeText={setJobTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Company"
            placeholderTextColor="#999"
            value={company}
            onChangeText={setCompany}
          />
        </View>

        {/* Education Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          <TextInput
            style={styles.input}
            placeholder="School"
            placeholderTextColor="#999"
            value={school}
            onChangeText={setSchool}
          />
        </View>

        {/* Interests Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <Text style={styles.interestSubtitle}>Select up to 6 interests</Text>
          <View style={styles.interestsContainer}>
            {allInterests.map((interest, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.interestButton,
                  selectedInterests.includes(interest) && styles.selectedInterestButton,
                ]}
                onPress={() => toggleInterest(interest)}
              >
                <Text
                  style={[
                    styles.interestText,
                    selectedInterests.includes(interest) && styles.selectedInterestText,
                  ]}
                >
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.selectedCount}>
            {selectedInterests.length} of 6 selected
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(15),
    paddingVertical: responsiveHeight(10),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerButton: {
    minWidth: responsiveWidth(60),
  },
  headerTitle: {
    fontSize: responsiveFont(18),
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: responsiveWidth(10),
  },
  cancelButton: {
    fontSize: responsiveFont(16),
    color: '#666',
  },
  saveButton: {
    fontSize: responsiveFont(16),
    fontWeight: 'bold',
    color: '#FF5864',
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: responsiveHeight(20),
  },
  section: {
    backgroundColor: '#fff',
    paddingHorizontal: responsiveWidth(20),
    paddingVertical: responsiveHeight(15),
    marginBottom: responsiveHeight(10),
  },
  sectionTitle: {
    fontSize: responsiveFont(18),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(15),
    color: '#333',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoContainer: {
    width: responsiveWidth(110),
    height: responsiveWidth(110),
    marginBottom: responsiveHeight(10),
    borderRadius: responsiveWidth(8),
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: responsiveHeight(5),
    right: responsiveWidth(5),
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: responsiveWidth(12),
    width: responsiveWidth(24),
    height: responsiveWidth(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainPhotoBadge: {
    position: 'absolute',
    bottom: responsiveHeight(5),
    left: responsiveWidth(5),
    backgroundColor: '#FF5864',
    borderRadius: responsiveWidth(10),
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(8),
  },
  mainPhotoText: {
    fontSize: responsiveFont(10),
    fontWeight: 'bold',
    color: '#fff',
  },
  addPhotoButton: {
    width: responsiveWidth(110),
    height: responsiveWidth(110),
    borderRadius: responsiveWidth(8),
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  photoTip: {
    fontSize: responsiveFont(12),
    color: '#666',
    marginTop: responsiveHeight(5),
    textAlign: 'center',
  },
  infoField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveHeight(12),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  fieldLabel: {
    fontSize: responsiveFont(16),
    color: '#333',
  },
  fieldValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldText: {
    fontSize: responsiveFont(16),
    color: '#666',
    marginRight: responsiveWidth(5),
  },
  aboutInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: responsiveWidth(8),
    padding: responsiveWidth(15),
    fontSize: responsiveFont(16),
    minHeight: responsiveHeight(120),
    textAlignVertical: 'top',
    color: '#333',
  },
  charCount: {
    fontSize: responsiveFont(12),
    color: '#666',
    textAlign: 'right',
    marginTop: responsiveHeight(5),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: responsiveWidth(8),
    padding: responsiveWidth(15),
    fontSize: responsiveFont(16),
    marginBottom: responsiveHeight(15),
    color: '#333',
  },
  interestSubtitle: {
    fontSize: responsiveFont(14),
    color: '#666',
    marginBottom: responsiveHeight(15),
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: responsiveHeight(5),
  },
  interestButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: responsiveWidth(20),
    paddingVertical: responsiveHeight(8),
    paddingHorizontal: responsiveWidth(16),
    marginRight: responsiveWidth(10),
    marginBottom: responsiveHeight(10),
  },
  selectedInterestButton: {
    backgroundColor: '#FF5864',
  },
  interestText: {
    fontSize: responsiveFont(14),
    color: '#333',
  },
  selectedInterestText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedCount: {
    fontSize: responsiveFont(14),
    color: '#666',
    textAlign: 'right',
  },
});

export default EditProfile;