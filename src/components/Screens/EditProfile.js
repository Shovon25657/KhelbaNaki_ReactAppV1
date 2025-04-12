import React, { useState, useEffect } from 'react';
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
  Alert
} from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import profilePhoto from '../../../assets/profile1.jpg';
import coverPhoto from '../../../assets/profile3.jpg';
import game1 from '../../../assets/game1.png';
import game2 from '../../../assets/game2.png';
import game3 from '../../../assets/game3.png';

const { width, height } = Dimensions.get('window');

// Responsive sizing functions
const responsiveWidth = (size) => (width / 375) * size;
const responsiveHeight = (size) => (height / 812) * size;
const responsiveFont = (size) => (width / 375) * size;

const EditProfile = ({ navigation, route }) => {
  // Add a default empty object if route.params or route.params.user is undefined
  const initialUser = route.params?.user || {
    name: '',
    age: '',
    bio: '',
    about: [],
    lookingFor: [],
    bestAt: [],
    plan: { name: '', features: [] }
  };
  
  const [user, setUser] = useState(initialUser);
  const [name, setName] = useState(initialUser.name);
  const [age, setAge] = useState(initialUser.age?.toString() || '');
  const [bio, setBio] = useState(initialUser.bio);
  const [isEditing, setIsEditing] = useState({
    bio: false
  });

  const handleSaveProfile = () => {
    const updatedUser = {
      ...user,
      name: name,
      age: parseInt(age) || 0,
      bio: bio
    };
    
    // Navigate directly to Profile with the updated data
    navigation.navigate('Profile', { updatedUser });
  };

  const navigateToEditAbout = () => {
    navigation.navigate('EditAbout', { about: user.about });
  };

  const navigateToEditLookingFor = () => {
    navigation.navigate('EditLookingFor', { lookingFor: user.lookingFor });
  };

  const navigateToEditGames = () => {
    navigation.navigate('EditGames', { games: user.bestAt });
  };

  const navigateToEditPackage = () => {
    navigation.navigate('EditPackage', { plan: user.plan });
  };

  const handleChangeProfilePhoto = () => {
    // In a real app, this would open image picker
    Alert.alert("Change Profile Photo", "This would open your image gallery");
  };

  const handleChangeCoverPhoto = () => {
    // In a real app, this would open image picker
    Alert.alert("Change Cover Photo", "This would open your image gallery");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with title and Save button */}
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
        {/* Cover Photo with change option */}
        <View style={styles.coverContainer}>
          <Image source={coverPhoto} style={styles.coverPhoto} />
          <TouchableOpacity 
            style={styles.changeCoverButton}
            onPress={handleChangeCoverPhoto}
          >
            <Feather name="camera" size={responsiveFont(18)} color="#fff" />
            <Text style={styles.changeButtonText}>Change Cover</Text>
          </TouchableOpacity>
          
          {/* Profile Photo with change option */}
          <View style={styles.profilePhotoContainer}>
            <Image source={profilePhoto} style={styles.profilePhoto} />
            <TouchableOpacity 
              style={styles.changeProfileButton}
              onPress={handleChangeProfilePhoto}
            >
              <Feather name="camera" size={responsiveFont(16)} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Name, Age Editing */}
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
            <View style={styles.onlineDot} />
            <TouchableOpacity>
              <Text style={styles.status}>Online Now (Tap to change)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bio Section - Editable */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Player Bio</Text>
            <TouchableOpacity 
              onPress={() => setIsEditing({...isEditing, bio: !isEditing.bio})}
            >
              <Feather 
                name={isEditing.bio ? "check" : "edit-2"} 
                size={responsiveFont(18)} 
                color="#00ff88" 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.bioContainer}>
            {isEditing.bio ? (
              <TextInput
                style={styles.bioInput}
                value={bio}
                onChangeText={setBio}
                multiline={true}
                placeholder="Tell others about yourself as a gamer..."
                placeholderTextColor="#aaa"
              />
            ) : (
              <Text style={styles.bioText}>{bio}</Text>
            )}
          </View>
        </View>

        {/* About Section - with edit option */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>About</Text>
            <TouchableOpacity onPress={navigateToEditAbout}>
              <Feather name="edit-2" size={responsiveFont(18)} color="#00ff88" />
            </TouchableOpacity>
          </View>
          <View style={styles.gridContainer}>
            {user.about.map((item, index) => (
              <View key={index} style={styles.smallGridItem}>
                <FontAwesome5 
                  name={item.icon} 
                  size={responsiveFont(16)} 
                  color="#00ff88" 
                />
                <Text style={styles.smallGridLabel}>{item.label}</Text>
                <Text style={styles.smallGridValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Looking For Section - with edit option */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Looking For</Text>
            <TouchableOpacity onPress={navigateToEditLookingFor}>
              <Feather name="edit-2" size={responsiveFont(18)} color="#00ff88" />
            </TouchableOpacity>
          </View>
          <View style={styles.gridContainer}>
            {user.lookingFor.map((item, index) => (
              <View key={index} style={styles.smallGridItem}>
                <FontAwesome5 
                  name={item.icon} 
                  size={responsiveFont(16)} 
                  color="#00ff88" 
                />
                <Text style={styles.smallGridLabel}>{item.label}</Text>
                <Text style={styles.smallGridValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Games Played Section - with edit option */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Games Played</Text>
            <TouchableOpacity onPress={navigateToEditGames}>
              <Feather name="edit-2" size={responsiveFont(18)} color="#00ff88" />
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

        {/* My Plan Section - with edit option */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Gamer Subscription</Text>
            <TouchableOpacity onPress={navigateToEditPackage}>
              <Feather name="edit-2" size={responsiveFont(18)} color="#00ff88" />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveHeight(15),
    paddingHorizontal: responsiveWidth(10),
    backgroundColor: '#16213e',
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backButton: {
    padding: responsiveWidth(5),
  },
  headerTitle: {
    fontSize: responsiveFont(20),
    fontWeight: 'bold',
    color: '#00ff88',
    fontFamily: 'Roboto',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  saveButton: {
    backgroundColor: '#00ff88',
    paddingHorizontal: responsiveWidth(15),
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
    borderColor: '#00ff88',
    overflow: 'hidden',
    backgroundColor: '#16213e',
    shadowColor: '#00ff88',
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
    borderBottomColor: '#00ff88',
    marginRight: responsiveWidth(10),
  },
  ageContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#00ff88',
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
    backgroundColor: '#16213e',
    paddingHorizontal: responsiveWidth(20),
    paddingVertical: responsiveHeight(15),
    marginBottom: responsiveHeight(10),
    borderRadius: responsiveWidth(10),
    marginHorizontal: responsiveWidth(10),
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(15),
  },
  sectionTitle: {
    fontSize: responsiveFont(18),
    fontWeight: 'bold',
    color: '#00ff88',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bioContainer: {
    backgroundColor: 'rgba(15, 52, 96, 0.5)',
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
    backgroundColor: '#0f3460',
    borderRadius: responsiveWidth(10),
    marginBottom: responsiveHeight(10),
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  smallGridLabel: {
    fontSize: responsiveFont(10),
    color: '#00ff88',
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
  gamesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  smallGameCard: {
    width: responsiveWidth(120),
    height: responsiveHeight(170),
    marginBottom: responsiveHeight(10),
    backgroundColor: '#0f3460',
    borderRadius: responsiveWidth(10),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#00ff88',
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
    color: '#00ff88',
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
    color: '#00ff88',
    marginLeft: responsiveWidth(3),
  },
  planCard: {
    backgroundColor: '#0f3460',
    borderRadius: responsiveWidth(15),
    padding: responsiveWidth(15),
    borderWidth: 2,
    borderColor: '#00ff88',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(10),
  },
  planName: {
    fontSize: responsiveFont(18),
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: responsiveWidth(10),
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
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
    backgroundColor: '#00ff88',
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