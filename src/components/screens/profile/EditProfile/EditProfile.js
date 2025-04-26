import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
  Image
} from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Reusable Components
import Header from '../EditProfile/EditProfileupdated/Header';
import ProfileImagePicker from '../EditProfile/EditProfileupdated/ProfileImagePicker';
import CoverImagePicker from '../EditProfile/EditProfileupdated/CoverImagePicker';
//import StatusModal from '../EditProfile/EditProfileupdated/StatusModal';
import EditableSection from '../EditProfile/EditProfileupdated/EditableSection';
import { responsiveFont, responsiveWidth, responsiveHeight } from '../EditProfile/EditProfileupdated/Metrics';
import StatusModal, { statusOptions } from '../EditProfile/EditProfileupdated/StatusModal';

// Default images
const defaultProfile = require('../../../../../assets/profile1.jpg');
const defaultCover = require('../../../../../assets/profile3.jpg');

const EditProfile = ({ navigation, route }) => {
  const initialUser = route.params?.user || {
    name: '',
    age: '',
    bio: '',
    about: [],
    lookingFor: [],
    bestAt: [],
    plan: { name: '', features: [] },
    profileImage: defaultProfile,
    coverImage: defaultCover,
    status: 'Online'
  };

  const [user, setUser] = useState(initialUser);
  const [name, setName] = useState(initialUser.name);
  const [age, setAge] = useState(initialUser.age?.toString() || '');
  const [bio, setBio] = useState(initialUser.bio);
  const [profileImage, setProfileImage] = useState(initialUser.profileImage);
  const [coverImage, setCoverImage] = useState(initialUser.coverImage);
  const [isEditing, setIsEditing] = useState({ bio: false });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(initialUser.status || 'Online');
  const [wordCount, setWordCount] = useState(initialUser.bio ? initialUser.bio.split(/\s+/).length : 0);

  // Image Picker Functions
  const pickProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your photos to change your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
    }
  };

  const pickCoverImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your photos to change your cover photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCoverImage({ uri: result.assets[0].uri });
    }
  };

  // Handle bio text change with word limit
  const handleBioChange = (text) => {
    const words = text.split(/\s+/);
    if (words.length <= 150 || text.length < bio.length) {
      setBio(text);
      setWordCount(words.length);
    }
  };

  // Save Profile Function
  const handleSaveProfile = () => {
    const updatedUser = {
      ...user,
      name: name,
      age: parseInt(age) || 0,
      bio: bio,
      profileImage: profileImage,
      coverImage: coverImage,
      status: currentStatus
    };

    navigation.navigate('Profile', { updatedUser });
  };

  // Select status function
  const selectStatus = (status) => {
    setCurrentStatus(status);
    setShowStatusModal(false);
  };

  // Navigation Functions
  const navigateToEditAbout = () => navigation.navigate('EditAbout', { about: user.about });
  const navigateToEditLookingFor = () => navigation.navigate('EditLookingFor', { lookingFor: user.lookingFor });
  const navigateToEditGames = () => navigation.navigate('EditGames', { games: user.bestAt });
  const navigateToEditPackage = () => navigation.navigate('EditPackage', { plan: user.plan });

  // Get status color based on current status
  const getStatusColor = () => {
    const status = statusOptions.find(option => option.name === currentStatus);
    return status ? status.color : '#00ff88';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Edit Profile"
        onBack={() => navigation.goBack()}
        onSave={handleSaveProfile}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cover Photo Section */}
        <View style={styles.coverSection}>
          <CoverImagePicker 
            image={coverImage} 
            onPress={pickCoverImage} 
          />
          <ProfileImagePicker 
            image={profileImage} 
            onPress={pickProfileImage}
            style={styles.profileImagePosition}
          />
        </View>

        {/* Name and Age Section */}
        <View style={styles.nameContainer}>
          <View style={styles.nameInputsContainer}>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor="#aaa"
            />
            <View style={styles.ageContainer}>
              <TextInput
                style={styles.ageInput}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                maxLength={2}
                placeholder="Age"
                placeholderTextColor="#aaa"
              />
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={[styles.onlineDot, { backgroundColor: getStatusColor() }]} />
            <TouchableOpacity onPress={() => setShowStatusModal(true)}>
              <Text style={styles.status}>{currentStatus} (Tap to change)</Text>
            </TouchableOpacity>
          </View>
        </View>

            {/* Bio Section */}
      <EditableSection 
        title="Player Bio" 
        onEdit={() => setIsEditing({...isEditing, bio: !isEditing.bio})}
        editIcon={isEditing.bio ? "check" : "edit-2"} // Add this prop
      >
        <View style={styles.wordCountContainer}>
          <Text style={styles.wordCountText}>{wordCount}/150 words</Text>
        </View>
        <View style={styles.bioContainer}>
          {isEditing.bio ? (
            <TextInput
              style={styles.bioInput}
              value={bio}
              onChangeText={handleBioChange}
              multiline={true}
              placeholder="Tell others about yourself as a gamer (max 150 words)..."
              placeholderTextColor="#aaa"
              maxLength={1000}
            />
          ) : (
            <Text style={styles.bioText}>{bio || 'No bio added yet'}</Text>
          )}
        </View>
      </EditableSection>

        {/* About Section */}
        <EditableSection 
          title="About" 
          onEdit={navigateToEditAbout}
        >
          <View style={styles.gridContainer}>
            {user.about.map((item, index) => (
              <View key={index} style={styles.smallGridItem}>
                <FontAwesome5 
                  name={item.icon} 
                  size={responsiveFont(18)} 
                  style={styles.icons}
                />
                <Text style={styles.smallGridLabel}>{item.label}</Text>
                <Text style={styles.smallGridValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </EditableSection>

        {/* Looking For Section */}
        <EditableSection 
          title="Looking For" 
          onEdit={navigateToEditLookingFor}
        >
          <View style={styles.gridContainer}>
            {user.lookingFor.map((item, index) => (
              <View key={index} style={styles.smallGridItem}>
                <FontAwesome5 
                  name={item.icon} 
                  size={responsiveFont(18)} 
                  style={styles.icons} 
                />
                <Text style={styles.smallGridLabel}>{item.label}</Text>
                <Text style={styles.smallGridValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </EditableSection>

        {/* Games Played Section */}
        <EditableSection 
          title="Games Played" 
          onEdit={navigateToEditGames}
        >
          <View style={styles.gamesContainer}>
            {user.bestAt.map((game, index) => (
              <View key={index} style={styles.smallGameCard}>
                {game.isFavorite && (
                  <View style={styles.favoriteBadge}>
                    <MaterialCommunityIcons 
                      name="heart" 
                      size={responsiveFont(14)} 
                      color="#e94560" 
                    />
                  </View>
                )}
                <Image source={game.image} style={styles.smallGameImage} />
                <Text style={styles.frequencyTag}>{game.frequency}</Text>
                <View style={styles.gameInfo}>
                  <Text style={styles.gameName}>{game.name}</Text>
                  <View style={styles.gameLevel}>
                    <MaterialCommunityIcons 
                      name="medal" 
                      size={responsiveFont(14)} 
                      color="#FFD700" 
                    />
                    <Text style={styles.levelText}>{game.level}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </EditableSection>

        {/* Subscription Plan Section */}
        <EditableSection 
          title="Gamer Subscription" 
          onEdit={navigateToEditPackage}
        >
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <MaterialCommunityIcons 
                name="crown" 
                size={responsiveFont(24)} 
                color="#FFD700" 
              />
              <Text style={styles.planName}>{user.plan.name}</Text>
            </View>
            <View style={styles.planFeatures}>
              {user.plan.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        </EditableSection>
      </ScrollView>

      <StatusModal 
        visible={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        currentStatus={currentStatus}
        onSelectStatus={selectStatus}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(1, 12, 20)',
  },
  scrollView: {
    flex: 1,
  },
  coverSection: {
    position: 'relative',
    marginBottom: responsiveHeight(60),
  },
  profileImagePosition: {
    bottom: -responsiveHeight(50),
    left: responsiveWidth(20),
  },
  nameContainer: {
    paddingHorizontal: responsiveWidth(20),
    marginTop: responsiveHeight(60),
    marginBottom: responsiveHeight(20),
  },
  nameInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameInput: {
    fontSize: responsiveFont(24),
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    paddingVertical: responsiveHeight(5),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.65)',
    marginRight: responsiveWidth(10),
  },
  ageContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.65)',
    width: responsiveWidth(60),
  },
  ageInput: {
    fontSize: responsiveFont(24),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: responsiveHeight(5),
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(10),
  },
  onlineDot: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    marginRight: responsiveWidth(5),
  },
  status: {
    fontSize: responsiveFont(14),
    color: '#00ff88',
    fontStyle: 'italic',
  },
  wordCountContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: responsiveHeight(10),
  },
  wordCountText: {
    fontSize: responsiveFont(12),
    color: 'rgba(1, 225, 255, 0.49)',
  },
  bioContainer: {
    backgroundColor: 'rgba(15, 51, 96, 0.5)',
    padding: responsiveWidth(15),
    borderRadius: responsiveWidth(10),
  },
  bioText: {
    fontSize: responsiveFont(16),
    lineHeight: responsiveFont(24),
    color: '#fff',
    textAlign: 'center',
  },
  bioInput: {
    fontSize: responsiveFont(16),
    lineHeight: responsiveFont(24),
    color: '#fff',
    padding: 0,
    textAlign: 'center',
    textAlignVertical: 'top',
    minHeight: responsiveHeight(100),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  smallGridItem: {
    width: responsiveWidth(90),
    alignItems: 'center',
    padding: responsiveWidth(8),
    backgroundColor: 'rgba(14, 113, 226, 0.03)',
    borderRadius: responsiveWidth(10),
    marginBottom: responsiveHeight(10),
    borderWidth: 0.5,
    borderColor: 'rgba(14, 113, 226, 0.42)',
  },
  smallGridLabel: {
    fontSize: responsiveFont(10),
    color: 'rgba(206, 201, 201, 0.7)',
    marginTop: responsiveHeight(4),
    textAlign: 'center',
  },
  smallGridValue: {
    fontSize: responsiveFont(12),
    fontWeight: 'bold',
    color: '#fff',
    marginTop: responsiveHeight(2),
    textAlign: 'center',
  },
  icons: {
    color: 'rgba(169, 209, 244, 0.82)',
  },
  gamesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  smallGameCard: {
    width: responsiveWidth(140),
    height: responsiveHeight(170),
    marginRight: responsiveWidth(12),
    marginBottom: responsiveHeight(10),
    backgroundColor: 'rgba(42, 16, 216, 0.42)',
    borderRadius: responsiveWidth(10),
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(14, 113, 226, 0.42)',
  },
  smallGameImage: {
    width: '100%',
    height: responsiveHeight(110),
    resizeMode: 'cover',
  },
  favoriteBadge: {
    position: 'absolute',
    top: responsiveHeight(5),
    left: responsiveWidth(5),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: responsiveWidth(10),
    width: responsiveWidth(24),
    height: responsiveWidth(24),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  frequencyTag: {
    position: 'absolute',
    top: responsiveHeight(5),
    right: responsiveWidth(5),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    fontSize: responsiveFont(10),
    fontWeight: 'bold',
    paddingHorizontal: responsiveWidth(8),
    paddingVertical: responsiveHeight(3),
    borderRadius: responsiveWidth(10),
  },
  gameInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: responsiveWidth(8),
  },
  gameLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(5),
  },
  gameName: {
    fontSize: responsiveFont(12),
    fontWeight: 'bold',
    color: '#fff',
  },
  levelText: {
    fontSize: responsiveFont(10),
    color: '#fff',
    marginLeft: responsiveWidth(3),
  },
  planCard: {
    backgroundColor: 'rgba(22, 179, 211, 0.04)',
    borderRadius: responsiveWidth(15),
    padding: responsiveWidth(15),
    borderWidth: 1,
    borderColor: 'rgba(22, 179, 211, 0.42)',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(10),
  },
  planName: {
    fontSize: responsiveFont(18),
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: responsiveWidth(10),
  },
  planFeatures: {
    paddingLeft: responsiveWidth(5),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: responsiveHeight(8),
  },
  bulletPoint: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    borderRadius: responsiveWidth(3),
    backgroundColor: 'rgb(252, 252, 252)',
    marginTop: responsiveHeight(5),
    marginRight: responsiveWidth(8),
  },
  featureText: {
    fontSize: responsiveFont(14),
    color: '#fff',
    flex: 1,
  },
});

export default EditProfile;