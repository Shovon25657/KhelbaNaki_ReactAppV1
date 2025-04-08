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
  SafeAreaView
} from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import profilePhoto from '../../../assets/profile1.jpg';
import coverPhoto from '../../../assets/profile2.jpg';
import game1 from '../../../assets/game1.png';
import game2 from '../../../assets/game2.png';
import game3 from '../../../assets/game3.png';

const { width, height } = Dimensions.get('window');

// Responsive sizing functions
const responsiveWidth = (size) => (width / 375) * size;
const responsiveHeight = (size) => (height / 812) * size;
const responsiveFont = (size) => (width / 375) * size;

const Profile = ({ navigation }) => {
  const [user, setUser] = useState({
    name: 'Jessica',
    age: 28,
    bio: 'Professional gamer and streamer. Love playing FPS and strategy games. Looking for teammates who communicate well!',
    about: [
      { icon: 'graduation-cap', label: 'Education', value: 'Undergrad Degree' },
      { icon: 'map-marker-alt', label: 'Location', value: 'New York, NY' },
      { icon: 'briefcase', label: 'Occupation', value: 'Streamer' },
    ],
    lookingFor: [
      { icon: 'moon', label: 'Availability', value: 'Night' },
      { icon: 'gamepad', label: 'Play Style', value: 'Competitive' },
      { icon: 'users', label: 'Team Size', value: 'Squad (4)' },
    ],
    bestAt: [
      { image: game1, name: 'Valorant', level: 'Diamond' },
      { image: game2, name: 'Apex Legends', level: 'Platinum' },
      { image: game3, name: 'League of Legends', level: 'Gold' },
    ],
    plan: {
      name: 'Gold Package',
      features: [
        'Unlimited likes',
        'Send direct requests',
        'Premium avatars',
        'Priority visibility',
        'Custom cover photos'
      ]
    }
  });

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { user });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with title only */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Photo with Profile Photo overlapping */}
        <View style={styles.coverContainer}>
          <Image source={coverPhoto} style={styles.coverPhoto} />
          <View style={styles.profilePhotoContainer}>
            <Image source={profilePhoto} style={styles.profilePhoto} />
          </View>
        </View>

        {/* Name, Age and Edit Profile Button */}
        <View style={styles.nameContainer}>
          <View>
            <Text style={styles.name}>{user.name}, {user.age}</Text>
            <Text style={styles.status}>Online</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Feather name="edit" size={responsiveFont(16)} color="#fff" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.gridContainer}>
            {user.about.map((item, index) => (
              <View key={index} style={styles.gridItem}>
                <FontAwesome5 name={item.icon} size={responsiveFont(20)} color="#FF5864" />
                <Text style={styles.gridLabel}>{item.label}</Text>
                <Text style={styles.gridValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Looking For Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Looking For</Text>
          <View style={styles.gridContainer}>
            {user.lookingFor.map((item, index) => (
              <View key={index} style={styles.gridItem}>
                <FontAwesome5 name={item.icon} size={responsiveFont(20)} color="#FF5864" />
                <Text style={styles.gridLabel}>{item.label}</Text>
                <Text style={styles.gridValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Best At Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Best At</Text>
          <View style={styles.gamesContainer}>
            {user.bestAt.map((game, index) => (
              <View key={index} style={styles.gameCard}>
                <Image source={game.image} style={styles.gameImage} />
                <View style={styles.gameInfo}>
                  <Text style={styles.gameName}>{game.name}</Text>
                  <View style={styles.gameLevel}>
                    <MaterialCommunityIcons name="medal" size={responsiveFont(16)} color="#FFD700" />
                    <Text style={styles.levelText}>{game.level}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* My Plan Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Plan</Text>
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <MaterialCommunityIcons name="crown" size={responsiveFont(24)} color="#FFD700" />
              <Text style={styles.planName}>{user.plan.name}</Text>
            </View>
            <View style={styles.planFeatures}>
              {user.plan.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Feather name="check-circle" size={responsiveFont(16)} color="#4CAF50" />
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
    backgroundColor: '#f8f8f8',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveHeight(15),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerTitle: {
    fontSize: responsiveFont(20),
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  coverContainer: {
    position: 'relative',
    height: responsiveHeight(180),
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  profilePhotoContainer: {
    position: 'absolute',
    bottom: -responsiveHeight(50),
    left: responsiveWidth(20),
    width: responsiveWidth(100),
    height: responsiveWidth(100),
    borderRadius: responsiveWidth(50),
    borderWidth: 4,
    borderColor: '#fff',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: responsiveWidth(20),
    marginTop: responsiveHeight(60),
    marginBottom: responsiveHeight(20),
  },
  name: {
    fontSize: responsiveFont(24),
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: responsiveFont(14),
    color: '#4CAF50',
    marginTop: responsiveHeight(2),
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5864',
    paddingHorizontal: responsiveWidth(15),
    paddingVertical: responsiveHeight(8),
    borderRadius: responsiveWidth(20),
  },
  editButtonText: {
    fontSize: responsiveFont(14),
    color: '#fff',
    marginLeft: responsiveWidth(5),
    fontWeight: 'bold',
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
  bioText: {
    fontSize: responsiveFont(16),
    lineHeight: responsiveFont(24),
    color: '#333',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: responsiveWidth(105),
    alignItems: 'center',
    padding: responsiveWidth(10),
    backgroundColor: '#f9f9f9',
    borderRadius: responsiveWidth(15),
    marginBottom: responsiveHeight(10),
  },
  gridLabel: {
    fontSize: responsiveFont(12),
    color: '#666',
    marginTop: responsiveHeight(5),
    textAlign: 'center',
  },
  gridValue: {
    fontSize: responsiveFont(14),
    fontWeight: 'bold',
    color: '#333',
    marginTop: responsiveHeight(2),
    textAlign: 'center',
  },
  gamesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameCard: {
    width: responsiveWidth(110),
    marginBottom: responsiveHeight(15),
  },
  gameImage: {
    width: '100%',
    height: responsiveWidth(110),
    borderRadius: responsiveWidth(10),
  },
  gameInfo: {
    marginTop: responsiveHeight(5),
  },
  gameName: {
    fontSize: responsiveFont(14),
    fontWeight: 'bold',
    color: '#333',
  },
  gameLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(2),
  },
  levelText: {
    fontSize: responsiveFont(12),
    color: '#666',
    marginLeft: responsiveWidth(5),
  },
  planCard: {
    backgroundColor: '#fff8e1',
    borderRadius: responsiveWidth(15),
    padding: responsiveWidth(15),
    borderWidth: 1,
    borderColor: '#ffe0b2',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(10),
  },
  planName: {
    fontSize: responsiveFont(18),
    fontWeight: 'bold',
    color: '#FF9800',
    marginLeft: responsiveWidth(10),
  },
  planFeatures: {
    paddingLeft: responsiveWidth(5),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(8),
  },
  featureText: {
    fontSize: responsiveFont(14),
    color: '#333',
    marginLeft: responsiveWidth(10),
  },
});

export default Profile;