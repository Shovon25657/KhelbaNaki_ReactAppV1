import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileCard = ({ title, data, type }) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{title}</Text>

      {/* If the section is "About" or similar */}
      {type === 'about' && (
        <View style={styles.gridContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.smallGridItem}>
              <FontAwesome5 name={item.icon} size={16} color="#00ff88" />
              <Text style={styles.smallGridLabel}>{item.label}</Text>
              <Text style={styles.smallGridValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      )}

      {/* If the section is "Games Played" */}
      {type === 'games' && (
        <View style={styles.gamesContainer}>
          {data.map((game, index) => (
            <View key={index} style={styles.smallGameCard}>
              {game.isFavorite && (
                <View style={styles.favoriteBadge}>
                  <MaterialCommunityIcons name="heart" size={14} color="#e94560" />
                </View>
              )}
              <Image source={{ uri: game.image }} style={styles.smallGameImage} />
              <Text style={styles.frequencyTag}>{game.frequency}</Text>
              <View style={styles.gameInfo}>
                <Text style={styles.gameName}>{game.name}</Text>
                <View style={styles.gameLevel}>
                  <MaterialCommunityIcons name="medal" size={14} color="#FFD700" />
                  <Text style={styles.levelText}>{game.level}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#16213e',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  smallGridItem: {
    width: 90,
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#0f3460',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  smallGridLabel: {
    fontSize: 10,
    color: '#00ff88',
    marginTop: 4,
    textAlign: 'center',
  },
  smallGridValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
    textAlign: 'center',
  },
  gamesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  smallGameCard: {
    width: 120,
    height: 170,
    marginRight: 12,
    marginBottom: 10,
    backgroundColor: '#0f3460',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  smallGameImage: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frequencyTag: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#00ff88',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  gameInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
  },
  gameLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  gameName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  levelText: {
    fontSize: 10,
    color: '#00ff88',
    marginLeft: 3,
  },
});

export default ProfileCard;
