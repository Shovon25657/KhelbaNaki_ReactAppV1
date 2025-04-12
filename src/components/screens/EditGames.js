import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';

const EditGames = ({ navigation, route }) => {
  const initialGames = route.params?.games || [];
  const [games, setGames] = useState(initialGames);
  const [newGame, setNewGame] = useState({ name: '', level: '', frequency: '' });

  const addGame = () => {
    if (newGame.name && newGame.level && newGame.frequency) {
      setGames([...games, newGame]);
      setNewGame({ name: '', level: '', frequency: '' });
    }
  };

  const handleSave = () => {
    navigation.navigate('EditProfile', { updatedGamesPlayed: games });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Games Played</Text>
      
      <FlatList
        data={games}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.gameCard}>
            <Text style={styles.gameName}>{item.name}</Text>
            <Text style={styles.gameDetail}>Level: {item.level}</Text>
            <Text style={styles.gameDetail}>Frequency: {item.frequency}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Add New Game Section */}
      <View style={styles.addGameContainer}>
        <TextInput
          placeholder="Game Name"
          placeholderTextColor="#aaa"
          value={newGame.name}
          onChangeText={(text) => setNewGame({ ...newGame, name: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Level"
          placeholderTextColor="#aaa"
          value={newGame.level}
          onChangeText={(text) => setNewGame({ ...newGame, level: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Frequency (e.g., Regular)"
          placeholderTextColor="#aaa"
          value={newGame.frequency}
          onChangeText={(text) => setNewGame({ ...newGame, frequency: text })}
          style={styles.input}
        />
        <TouchableOpacity style={styles.addButton} onPress={addGame}>
          <Text style={styles.addButtonText}>Add Game</Text>
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save All Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff88',
    marginVertical: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  gameCard: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  gameName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  gameDetail: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 3,
  },
  addGameContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  addButton: {
    backgroundColor: '#00ff88',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#16213e',
    fontWeight: 'bold',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#00ff88',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#16213e',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditGames;
