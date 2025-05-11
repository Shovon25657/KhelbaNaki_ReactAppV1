import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Modal,
  Pressable,
  Animated,
  Easing,
  Alert,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDataContext } from '../../../context/UserDataContext';

const { width, height } = Dimensions.get('window');
const responsiveWidth = (size) => (width / 375) * size;
const responsiveHeight = (size) => (height / 812) * size;
const responsiveFont = (size) => (width / 375) * size;

const EditGames = ({ navigation }) => {
  const { userGamesPlayedData, setUserGamesPlayedData, refreshData } = useContext(UserDataContext);
  const [games, setGames] = useState(userGamesPlayedData?.gamesPlayed || []);
  const [newGame, setNewGame] = useState({ 
    playedGameName: '', 
    levelofGaming: '', 
    frequency: '' 
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const backPulseAnim = new Animated.Value(1);

  // Gaming theme colors
  const colors = {
    primary: '#6e44ff',
    secondary: '#b892ff',
    accent: '#00ff88',
    background: '#1a1a2e',
    card: '#16213e',
    text: '#e6e6e6',
    placeholder: '#888',
    success: '#2ecc71',
    danger: '#e74c3c',
    warning: '#f39c12',
  };

  // Game suggestions and options
  const gameSuggestions = [
    'League of Legends', 'Valorant', 'Fortnite', 'Call of Duty: Warzone',
    'Apex Legends', 'Dota 2', 'Counter-Strike 2', 'Overwatch 2', 'Minecraft',
    'Genshin Impact', 'Roblox', 'PUBG Mobile', 'Free Fire', 'Rocket League',
    'Rainbow Six Siege', 'World of Warcraft', 'Destiny 2', 'GTA V', 'Valheim', 'Elden Ring'
  ];
  
  const levelOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const frequencyOptions = ['Rarely', 'Occasionally', 'Frequently', 'Daily'];

  // Animation for back button
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(backPulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(backPulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, []);

  // Check for duplicate games (case-insensitive)
  const isGameDuplicate = (gameName) => {
    return games.some(game => 
      game.playedGameName.toLowerCase().trim() === gameName.toLowerCase().trim()
    );
  };

  // Show error message
  const showError = (message) => {
    setErrorMessage(message);
    setErrorVisible(true);
    setTimeout(() => setErrorVisible(false), 3000);
  };

  // Save games to backend
  const saveGamesToBackend = async (gamesList) => {
    setLoading(true);
    try {
      const authData = await AsyncStorage.getItem('@auth');
      if (!authData) throw new Error('Authentication required');
      
      const { token } = JSON.parse(authData);
      const response = await axios.post(
        '/userabout/create-usergamesplayed',
        { gamesPlayed: gamesList },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        setUserGamesPlayedData(response.data.gamesPlayed);
        await refreshData();
        return true;
      }
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        showError('This game has already been added');
      } else {
        Alert.alert('Error', error.response?.data?.message || 'Failed to save games');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete game from backend
  const deleteGame = async (gameId) => {
    setDeleteLoading(true);
    try {
      const authData = await AsyncStorage.getItem('@auth');
      if (!authData) throw new Error('Authentication required');
      
      const { token } = JSON.parse(authData);
      const response = await axios.delete(
        `/userabout/delete-game/${gameId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        // Update local state by filtering out the deleted game
        setGames(prevGames => prevGames.filter(game => game._id !== gameId));
        setUserGamesPlayedData(response.data.updatedGames);
        await refreshData();
        Alert.alert('Success', 'Game deleted successfully');
        return true;
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to delete game');
      return false;
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle game name input changes
  const handleGameNameChange = (text) => {
    setNewGame({ ...newGame, playedGameName: text });
    if (text.length > 1) {
      const filtered = gameSuggestions.filter(game =>
        game.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Select a game from suggestions
  const selectGame = (game) => {
    if (isGameDuplicate(game)) {
      showError('This game has already been added');
      return;
    }
    setNewGame({ ...newGame, playedGameName: game });
    setShowSuggestions(false);
  };

  // Add a new game
  const addGame = async () => {
    const trimmedGameName = newGame.playedGameName.trim();
    
    if (!trimmedGameName) {
      showError('Please enter a game name');
      return;
    }
    if (!newGame.levelofGaming) {
      showError('Please select your skill level');
      return;
    }
    if (!newGame.frequency) {
      showError('Please select play frequency');
      return;
    }

    if (isGameDuplicate(trimmedGameName)) {
      showError('This game has already been added');
      return;
    }

    const gameToAdd = {
      playedGameName: trimmedGameName,
      levelofGaming: newGame.levelofGaming,
      frequency: newGame.frequency
    };

    const success = await saveGamesToBackend([gameToAdd]);
    
    if (success) {
      setGames([...games, gameToAdd]);
      setNewGame({ playedGameName: '', levelofGaming: '', frequency: '' });
      setShowSuggestions(false);
    }
  };

  // Show delete confirmation
  const showDeleteConfirmation = (gameId) => {
    setGameToDelete(gameId);
    setDeleteConfirmVisible(true);
  };

  // Confirm game deletion
  const confirmDeleteGame = async () => {
    await deleteGame(gameToDelete);
    setDeleteConfirmVisible(false);
    setGameToDelete(null);
  };

  // Cancel game deletion
  const cancelDeleteGame = () => {
    setDeleteConfirmVisible(false);
    setGameToDelete(null);
  };

  // Open modal for level/frequency selection
  const openModal = (field) => {
    setCurrentField(field);
    setModalVisible(true);
  };

  // Handle option selection in modal
  const handleOptionSelect = (option) => {
    setNewGame({ ...newGame, [currentField]: option });
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with back button */}
        <View style={styles.header}>
          <Animated.View style={{ transform: [{ scale: backPulseAnim }] }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color={colors.accent} />
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.title}>Games Played</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Current Games List */}
        <FlatList
          data={games}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.gameCard}>
              <View style={styles.gameInfo}>
                <Text style={styles.gameName}>{item.playedGameName}</Text>
                <Text style={styles.gameDetail}>Level: {item.levelofGaming}</Text>
                <Text style={styles.gameDetail}>Frequency: {item.frequency}</Text>
              </View>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => showDeleteConfirmation(item._id)}
                disabled={deleteLoading}
              >
                {deleteLoading && gameToDelete === item._id ? (
                  <ActivityIndicator size="small" color={colors.danger} />
                ) : (
                  <Ionicons name="trash" size={20} color={colors.danger} />
                )}
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No games added yet</Text>
          }
        />

        {/* Add New Game Section */}
        <View style={styles.addGameContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Game Name"
              placeholderTextColor={colors.placeholder}
              value={newGame.playedGameName}
              onChangeText={handleGameNameChange}
              style={styles.input}
              onFocus={() => newGame.playedGameName.length > 1 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <ScrollView style={styles.suggestionsList} keyboardShouldPersistTaps="always">
                  {suggestions.map((game, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionItem}
                      onPress={() => selectGame(game)}
                    >
                      <Text style={styles.suggestionText}>{game}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={styles.selectorInput}
            onPress={() => openModal('levelofGaming')}
          >
            <Text style={newGame.levelofGaming ? styles.selectedText : styles.placeholderText}>
              {newGame.levelofGaming || 'Select your level'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.secondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.selectorInput}
            onPress={() => openModal('frequency')}
          >
            <Text style={newGame.frequency ? styles.selectedText : styles.placeholderText}>
              {newGame.frequency || 'Select play frequency'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.secondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.addButton} 
            onPress={addGame}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#16213e" />
            ) : (
              <Text style={styles.addButtonText}>Add Game</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Error Popup */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={errorVisible}
          onRequestClose={() => setErrorVisible(false)}
        >
          <View style={styles.errorOverlay}>
            <View style={styles.errorContainer}>
              <View style={styles.errorHeader}>
                <Ionicons name="warning" size={28} color={colors.danger} />
                <Text style={styles.errorTitle}>Duplicate Game</Text>
              </View>
              <Text style={styles.errorText}>{errorMessage}</Text>
              <TouchableOpacity 
                style={styles.errorButton}
                onPress={() => setErrorVisible(false)}
              >
                <Text style={styles.errorButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Delete Confirmation Popup */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={deleteConfirmVisible}
          onRequestClose={() => setDeleteConfirmVisible(false)}
        >
          <View style={styles.errorOverlay}>
            <View style={styles.errorContainer}>
              <View style={styles.errorHeader}>
                <Ionicons name="alert-circle" size={28} color={colors.warning} />
                <Text style={styles.warningTitle}>Delete Game</Text>
              </View>
              <Text style={styles.errorText}>Are you sure you want to delete this game?</Text>
              <View style={styles.confirmButtonRow}>
                <TouchableOpacity 
                  style={[styles.confirmButton, styles.cancelDeleteButton]}
                  onPress={cancelDeleteGame}
                >
                  <Text style={styles.confirmButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.confirmButton, styles.deleteButton]}
                  onPress={confirmDeleteGame}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.confirmButtonText}>Delete</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Selection Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <Pressable 
              style={styles.modalOutside}
              onPress={() => setModalVisible(false)}
            />
            
            <View style={styles.modalContainer}>
              <View style={styles.optionsContainer}>
                <Text style={styles.modalTitle}>
                  {currentField === 'levelofGaming' ? 'SELECT SKILL LEVEL' : 'SELECT PLAY FREQUENCY'}
                </Text>
                
                <ScrollView 
                  style={styles.optionsScroll}
                  showsVerticalScrollIndicator={false}
                >
                  {(currentField === 'levelofGaming' ? levelOptions : frequencyOptions).map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionButton,
                        newGame[currentField] === option && styles.selectedOption
                      ]}
                      onPress={() => handleOptionSelect(option)}
                      activeOpacity={0.6}
                    >
                      <Text style={styles.optionText}>{option}</Text>
                      {newGame[currentField] === option && (
                        <Ionicons name="checkmark" size={20} color={colors.accent} />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                
                <TouchableOpacity 
                  style={styles.closeModalButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeModalText}>CLOSE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgb(1, 12, 20)',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e6e6e6',
    textShadowColor: 'rgba(0, 255, 136, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  gameCard: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#0f3460',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameInfo: {
    flex: 1,
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
  removeButton: {
    padding: 8,
    marginLeft: 10,
  },
  addGameContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  selectorInput: {
    backgroundColor: '#16213e',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#0f3460',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: '#16213e',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0f3460',
    zIndex: 100,
    marginTop: 2,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  suggestionText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedText: {
    color: '#e6e6e6',
    fontSize: 14,
  },
  placeholderText: {
    color: '#888',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: 'rgb(17, 240, 169)',
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
  errorOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  errorContainer: {
    width: width * 0.8,
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(242, 0, 0, 0.45)',
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  errorTitle: {
    color: '#ff5555',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    textShadowColor: 'rgba(255, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  warningTitle: {
    color: '#f39c12',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  errorText: {
    color: '#e6e6e6',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: 'rgba(238, 5, 5, 0.7)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  confirmButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cancelDeleteButton: {
    backgroundColor: '#6e44ff',
    borderWidth: 2,
    borderColor: '#6e44ff',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.86)',
  },
  modalContainer: {
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
  optionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  optionsScroll: {
    maxHeight: height * 0.5,
  },
  optionButton: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(110, 68, 255, 0.2)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: 'rgba(110, 68, 255, 0.5)',
    borderWidth: 1,
    borderColor: '#6e44ff',
  },
  optionText: {
    color: '#e6e6e6',
    fontSize: 16,
  },
  closeModalButton: {
    marginTop: 15,
    padding: 14,
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.5)',
  },
  closeModalText: {
    color: '#e6e6e6',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  modalOutside: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default EditGames;