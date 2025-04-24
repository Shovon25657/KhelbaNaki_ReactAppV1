import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView,
  TextInput,
  Alert,
  Modal,
  FlatList
} from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

// Responsive sizing functions
const responsiveWidth = (size) => (width / 375) * size;
const responsiveHeight = (size) => (height / 812) * size;
const responsiveFont = (size) => (width / 375) * size;

// Status options data
const statusOptions = [
  { id: '1', name: 'Online', icon: 'circle', color: '#00ff88' },
  { id: '2', name: 'Offline', icon: 'circle', color: '#aaa' },
  { id: '3', name: 'Invisible', icon: 'eye-off', color: '#aaa' },
  { id: '4', name: 'Do Not Disturb', icon: 'minus-circle', color: '#e94560' },
  { id: '5', name: 'Ready to Play', icon: 'gamepad', color: '#00bfff' },
];

const EditProfile = ({ navigation, route }) => {
  // Default images
  const defaultProfile = require('../../../../../assets/profile1.jpg');
  const defaultCover = require('../../../../../assets/profile3.jpg');

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

  // Render status option item
  const renderStatusItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.statusOption} 
      onPress={() => selectStatus(item.name)}
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

  // Get status color based on current status
  const getStatusColor = () => {
    const status = statusOptions.find(option => option.name === currentStatus);
    return status ? status.color : '#00ff88';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={responsiveFont(22)} color="#00ff88" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSaveProfile}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Photo Section */}
        <View style={styles.coverContainer}>
          <Image 
            source={coverImage} 
            style={styles.coverPhoto} 
            defaultSource={defaultCover}
          />
          <TouchableOpacity 
            style={styles.changeCoverButton}
            onPress={pickCoverImage}
          >
            <Feather name="camera" size={responsiveFont(18)} color="#fff" />
            <Text style={styles.changeButtonText}>Change Cover</Text>
          </TouchableOpacity>
          
          {/* Profile Photo Section */}
          <View style={styles.profilePhotoContainer}>
            <Image 
              source={profileImage} 
              style={styles.profilePhoto} 
              defaultSource={defaultProfile}
            />
            <TouchableOpacity 
              style={styles.changeProfileButton}
              onPress={pickProfileImage}
            >
              <Feather name="camera" size={responsiveFont(16)} color="#fff" />
            </TouchableOpacity>
          </View>
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
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Player Bio</Text>
            <View style={styles.wordCountContainer}>
              <Text style={styles.wordCountText}>{wordCount}/150 words</Text>
              <TouchableOpacity 
                onPress={() => setIsEditing({...isEditing, bio: !isEditing.bio})}
                style={styles.editButton}
              >
                <Feather 
                  name={isEditing.bio ? "check" : "edit-2"} 
                  size={responsiveFont(18)} 
                  style={styles.icons}
                />
              </TouchableOpacity>
            </View>
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
                maxLength={1000} // Approximate limit for 150 words
              />
            ) : (
              <Text style={styles.bioText}>{bio || 'No bio added yet'}</Text>
            )}
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>About</Text>
            <TouchableOpacity onPress={navigateToEditAbout}>
              <Feather name="edit-2"
              size={responsiveFont(18)} 
              style={styles.icons} />
            </TouchableOpacity>
          </View>
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
        </View>

        {/* Looking For Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Looking For</Text>
            <TouchableOpacity onPress={navigateToEditLookingFor}>
              <Feather name="edit-2" 
               size={responsiveFont(18)} 
               style={styles.icons} />
            </TouchableOpacity>
          </View>
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
        </View>

        {/* Games Played Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Games Played</Text>
            <TouchableOpacity onPress={navigateToEditGames}>
              <Feather name="edit-2" 
              size={responsiveFont(18)} 
                  style={styles.icons}/>
            </TouchableOpacity>
          </View>
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
        </View>

        {/* Subscription Plan Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Gamer Subscription</Text>
            <TouchableOpacity onPress={navigateToEditPackage}>
              <Feather name="edit-2" 
               size={responsiveFont(18)} 
               style={styles.icons} />
            </TouchableOpacity>
          </View>
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
        </View>
      </ScrollView>

      {/* Status Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showStatusModal}
        onRequestClose={() => setShowStatusModal(false)}
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
              onPress={() => setShowStatusModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(1, 12, 20)',
  },
  scrollViewContent: {
    paddingBottom: 70, // Add padding at the bottom to prevent content from being hidden behind the BottomNavBar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveHeight(15),
    paddingVertical: responsiveHeight(15),
    backgroundColor: 'rgb(14, 3, 52)',
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  headerTitle: {
      fontSize: responsiveFont(20),
      fontWeight: 'bold',
     color: '#fff',
     fontFami: 'Roboto',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },


  backButton: {
    padding: responsiveWidth(5),
  },

  saveButton: {
    backgroundColor: 'rgb(6, 185, 234)',
    paddingHorizontal: responsiveWidth(16),
    paddingVertical: responsiveHeight(8),
    borderRadius: responsiveWidth(20),
  },
  saveButtonText: {
    color: '#16213e',
    fontWeight: 'bold',
    fontSize: responsiveFont(14),
  },
  scrollView: {
    flex: 1,
  },
  coverContainer: {
    position: 'relative',
    height: responsiveHeight(200),
    backgroundColor: '#0f3460',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  changeCoverButton: {
    position: 'absolute',
    top: responsiveHeight(10),
    right: responsiveWidth(10),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: responsiveWidth(10),
    paddingVertical: responsiveHeight(5),
    borderRadius: responsiveWidth(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeButtonText: {
    fontSize: responsiveFont(12),
    color: '#fff',
    marginLeft: responsiveWidth(5),
  },
   profilePhotoContainer: {
      position: 'absolute',
      bottom: -responsiveHeight(50),
      left: responsiveWidth(20),
      width: responsiveWidth(100),
      height: responsiveWidth(100),
      borderRadius: responsiveWidth(50),
      borderWidth: 4,
      borderColor: '#062452',
      overflow: 'hidden',
      backgroundColor: 'rgb(164, 167, 170)',
      shadowColor: '#062452',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 10,
    },
    profilePhoto: {
      width: '100%',
      height: '100%',
    },
  changeProfileButton: {
    position: 'absolute',
    bottom: responsiveHeight(5),
    right: responsiveWidth(5),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: responsiveWidth(30),
    height: responsiveWidth(30),
    borderRadius: responsiveWidth(15),
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#00ff88',
    marginRight: responsiveWidth(5),
  },
  status: {
    fontSize: responsiveFont(14),
    color: '#00ff88',
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: 'rgba(47, 7, 226, 0.05)',
    paddingHorizontal: responsiveWidth(20),
    paddingVertical: responsiveHeight(15),
    marginBottom: responsiveHeight(10),
    borderRadius: responsiveWidth(10),
    marginHorizontal: responsiveWidth(10),
    borderWidth: 1,
    borderColor: '#0f3460',
  },

  sectionTitle: {
    fontSize: responsiveFont(18),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(15),
    color: 'rgb(1, 225, 255)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(15),
  },
  wordCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordCountText: {
    fontSize: responsiveFont(12),
    color: 'rgba(1, 225, 255, 0.49)',
    marginRight: responsiveWidth(10),
  },
  editButton: {
    padding: responsiveWidth(5),
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
    borderWidth: .5,
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
    size:responsiveFont(16) ,
    color:'rgba(169, 209, 244, 0.82)' 
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
    borderWidth: .5,
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
    borderRadius: responsiveWidth(10),
    backgroundColor: 'rgb(252, 252, 252)',
    marginTop: responsiveHeight(5),
    marginRight: responsiveWidth(8),
  },
  featureText: {
    fontSize: responsiveFont(14),
   color: '#fff',
    flex: 1,
  },
  // Modal styles
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

export default EditProfile;