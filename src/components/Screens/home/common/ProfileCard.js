import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ProfileCard = ({ 
  profile, 
  onPress, 
  showBadges = true,
  swipeX = new Animated.Value(0) 
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(profile);
    }
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={handlePress}
      style={styles.touchableArea}
    >
      <Image 
        source={profile.image} 
        style={styles.profileImage}
        resizeMode="cover"
      />
      
      <View style={styles.profileInfo}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.age}>{profile.age} years</Text>
        
        <View style={styles.gamesContainer}>
          <Text style={styles.gamesTitle}>MAIN GAMES:</Text>
          <View style={styles.gamesList}>
            {profile.games.map((game, index) => (
              <View key={`game-${profile.id}-${index}`} style={styles.gameBadge}>
                <Text style={styles.gameText}>{game}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableArea: {
    flex: 1,
  },
  profileImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 6, 0.33)',
    padding: 15,
    borderTopWidth: 1,
    borderColor: 'rgba(86, 57, 246, 0.15)',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Arial',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  age: {
    color: '#AAA',
    fontSize: 16,
    marginBottom: 10,
  },
  gamesContainer: {
    marginTop: 10,
  },
  gamesTitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  gamesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gameBadge: {
    backgroundColor: 'rgba(203, 202, 195, 0.2)',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(203, 202, 195, 0.68)',
  },
  gameText: {
    color: 'rgb(255, 255, 255)',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ProfileCard;