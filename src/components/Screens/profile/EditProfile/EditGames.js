import React, { useState, useEffect } from 'react';
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
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const responsiveWidth = (size) => (width / 375) * size;
const responsiveHeight = (size) => (height / 812) * size;
const responsiveFont = (size) => (width / 375) * size;

const EditGames = ({ navigation, route }) => {
  const initialGames = route.params?.games || [];
  const [games, setGames] = useState(initialGames);
  const [newGame, setNewGame] = useState({ 
    name: '', 
    level: '', 
    frequency: '' 
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);
  const [unsavedChangesVisible, setUnsavedChangesVisible] = useState(false);
  const savePulseAnim = new Animated.Value(1);
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

  // Popular game suggestions
  const gameSuggestions = [
    'League of Legends',
    'Valorant',
    'Fortnite',
    'Call of Duty: Warzone',
    'Apex Legends',
    'Dota 2',
    'Counter-Strike 2',
    'Overwatch 2',
    'Minecraft',
    'Genshin Impact',
    'Roblox',
    'PUBG Mobile',
    'Free Fire',
    'Rocket League',
    'Rainbow Six Siege',
    'World of Warcraft',
    'Destiny 2',
    'GTA V',
    'Valheim',
    'Elden Ring'
  ];

  // Frequency options
  const frequencyOptions = [
    'Daily',
    'Weekly',
    'Monthly',
    'Regular',
    'Occasional',
    'Weekends',
    'Seasonal',
    'Custom'
  ];

  // Level options
  const levelOptions = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert',
    'Pro',
    'Casual',
    'Competitive',
    'Custom'
  ];

  // Compare current state with initial state
  useEffect(() => {
    const changesExist = JSON.stringify(games) !== JSON.stringify(initialGames);
    setHasChanges(changesExist);
  }, [games, initialGames]);

  // Pulsing animations for buttons
  useEffect(() => {
    const pulseAnimation = (anim) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    pulseAnimation(savePulseAnim);
    pulseAnimation(backPulseAnim);
  }, []);

  const showError = (message) => {
    setErrorMessage(message);
    setErrorVisible(true);
    setTimeout(() => setErrorVisible(false), 3000);
  };

  const showDeleteConfirmation = (index) => {
    setGameToDelete(index);
    setDeleteConfirmVisible(true);
  };

  const handleGameNameChange = (text) => {
    setNewGame({ ...newGame, name: text });
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

  const selectGame = (game) => {
    setNewGame({ ...newGame, name: game });
    setShowSuggestions(false);
  };

  const addGame = () => {
    if (!newGame.name) {
      showError('Please enter a game name');
      return;
    }
    if (!newGame.level) {
      showError('Please select your skill level');
      return;
    }
    if (!newGame.frequency) {
      showError('Please select play frequency');
      return;
    }

    setGames([...games, newGame]);
    setNewGame({ name: '', level: '', frequency: '' });
    setShowSuggestions(false);
  };

  const confirmDeleteGame = () => {
    const updatedGames = [...games];
    updatedGames.splice(gameToDelete, 1);
    setGames(updatedGames);
    setDeleteConfirmVisible(false);
    setGameToDelete(null);
  };

  const handleSave = () => {
    navigation.navigate('EditProfile', { updatedGamesPlayed: games });
  };

  const handleBack = () => {
    if (!hasChanges) {
      navigation.goBack();
      return;
    }
    setUnsavedChangesVisible(true);
  };

  const openModal = (field) => {
    setCurrentField(field);
    setModalVisible(true);
    setCustomInput('');
  };

  const handleOptionSelect = (option) => {
    if (option === 'Custom') {
      setIsTyping(true);
      return;
    }
    
    setNewGame({ ...newGame, [currentField]: option });
    setModalVisible(false);
    setIsTyping(false);
  };

  const saveCustomInput = () => {
    if (customInput.trim()) {
      setNewGame({ ...newGame, [currentField]: customInput });
      setModalVisible(false);
      setIsTyping(false);
      setCustomInput('');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons name="game-controller" size={28} color={colors.accent} style={styles.gameIcon} />
            <Text style={styles.title}>Games Played</Text>
          </View>
          
          <TouchableOpacity 
            onPress={() => {
              Alert.alert(
                "Games Played Guide",
                "Add the games you play regularly:\n\n• Search for games by name\n• Select your skill level\n• Choose how often you play",
                [
                  { text: "GOT IT", style: "default" }
                ]
              );
            }}
            style={styles.helpButton}
          >
            <Ionicons name="information-circle-outline" size={28} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        {/* Current Games List */}
        <FlatList
          data={games}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.gameCard}>
              <View style={styles.gameInfo}>
                <Text style={styles.gameName}>{item.name}</Text>
                <Text style={styles.gameDetail}>Level: {item.level}</Text>
                <Text style={styles.gameDetail}>Frequency: {item.frequency}</Text>
              </View>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => showDeleteConfirmation(index)}
              >
                <Ionicons name="trash" size={20} color={colors.danger} />
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
          {/* Game Name Input with Suggestions */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Game Name"
              placeholderTextColor={colors.placeholder}
              value={newGame.name}
              onChangeText={handleGameNameChange}
              style={styles.input}
              onFocus={() => newGame.name.length > 1 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <ScrollView 
                  style={styles.suggestionsList}
                  keyboardShouldPersistTaps="always"
                >
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

          {/* Level and Frequency Selection */}
          <TouchableOpacity 
            style={styles.selectorInput}
            onPress={() => openModal('level')}
          >
            <Text style={newGame.level ? styles.selectedText : styles.placeholderText}>
              {newGame.level || 'Select your level'}
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
          >
            <Text style={styles.addButtonText}>Add Game</Text>
          </TouchableOpacity>
        </View>

        {/* Button Row */}
        <View style={styles.buttonRow}>
          <Animated.View style={[styles.buttonContainer, { transform: [{ scale: backPulseAnim }] }]}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.backButtonStyle]} 
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>BACK</Text>
              <Ionicons name="arrow-back" size={20} color="#fff" style={styles.actionButtonIcon} />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.buttonContainer, { transform: [{ scale: savePulseAnim }] }]}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.saveButtonStyle]} 
              onPress={handleSave}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>SAVE</Text>
              <Ionicons name="save" size={20} color="#fff" style={styles.actionButtonIcon} />
            </TouchableOpacity>
          </Animated.View>
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
                <Text style={styles.errorTitle}>Missing Information</Text>
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
                  onPress={() => setDeleteConfirmVisible(false)}
                >
                  <Text style={styles.confirmButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.confirmButton, styles.deleteButton]}
                  onPress={confirmDeleteGame}
                >
                  <Text style={styles.confirmButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Unsaved Changes Popup */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={unsavedChangesVisible}
          onRequestClose={() => setUnsavedChangesVisible(false)}
        >
          <View style={styles.errorOverlay}>
            <View style={styles.unsavedContainer}>
              <View style={styles.unsavedHeader}>
                <Ionicons name="alert-circle" size={32} color={colors.warning} />
                <Text style={styles.unsavedTitle}>Unsaved Changes</Text>
              </View>
              <Text style={styles.unsavedText}>You have unsaved changes. What would you like to do?</Text>
              
              <View style={styles.unsavedGrid}>
                {/* Discard Button */}
                <TouchableOpacity 
                  style={[styles.unsavedButton, styles.discardButton]}
                  onPress={() => {
                    setUnsavedChangesVisible(false);
                    navigation.goBack();
                  }}
                >
                  <Ionicons name="trash-outline" size={28} color="#fff" style={styles.unsavedButtonIcon} />
                  <Text style={styles.unsavedButtonText}>Discard Changes</Text>
                </TouchableOpacity>
                
                {/* Save Button */}
                <TouchableOpacity 
                  style={[styles.unsavedButton, styles.saveChangesButton]}
                  onPress={() => {
                    setUnsavedChangesVisible(false);
                    handleSave();
                  }}
                >
                  <Ionicons name="save-outline" size={28} color="#fff" style={styles.unsavedButtonIcon} />
                  <Text style={styles.unsavedButtonText}>Save Changes</Text>
                </TouchableOpacity>
                
                {/* Continue Editing Button */}
                <TouchableOpacity 
                  style={[styles.unsavedButton, styles.continueButton]}
                  onPress={() => setUnsavedChangesVisible(false)}
                >
                  <Ionicons name="pencil-outline" size={28} color="#fff" style={styles.unsavedButtonIcon} />
                  <Text style={styles.unsavedButtonText}>Continue Editing</Text>
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
          onRequestClose={() => {
            setModalVisible(false);
            setIsTyping(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <Pressable 
              style={styles.modalOutside}
              onPress={() => {
                setModalVisible(false);
                setIsTyping(false);
              }}
            />
            
            <View style={styles.modalContainer}>
              {isTyping ? (
                <View style={styles.customInputContainer}>
                  <Text style={styles.modalTitle}>ENTER YOUR {currentField.toUpperCase()}</Text>
                  
                  <View style={styles.typingContainer}>
                    <TextInput
                      style={styles.customInput}
                      placeholder={`Type your ${currentField}...`}
                      placeholderTextColor={colors.placeholder}
                      value={customInput}
                      onChangeText={setCustomInput}
                      autoFocus={true}
                      multiline={true}
                      maxLength={50}
                      selectionColor={colors.accent}
                      keyboardAppearance="dark"
                    />
                    <View style={styles.characterCount}>
                      <Text style={styles.countText}>{customInput.length}/50</Text>
                    </View>
                  </View>
                  
                  <View style={styles.modalButtonRow}>
                    <TouchableOpacity 
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={() => {
                        setIsTyping(false);
                        setCustomInput('');
                      }}
                    >
                      <Text style={styles.modalButtonText}>CANCEL</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.modalButton, styles.confirmButton]}
                      onPress={saveCustomInput}
                      disabled={!customInput.trim()}
                    >
                      <Text style={styles.modalButtonText}>CONFIRM</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.optionsContainer}>
                  <Text style={styles.modalTitle}>SELECT {currentField.toUpperCase()}</Text>
                  
                  <ScrollView 
                    style={styles.optionsScroll}
                    showsVerticalScrollIndicator={false}
                  >
                    {(currentField === 'level' ? levelOptions : frequencyOptions).map((option, index) => (
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
              )}
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
    marginTop: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e6e6e6',
    textShadowColor: 'rgba(0, 255, 136, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  helpButton: {
    padding: 5,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '48%',
  },
  actionButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  backButtonStyle: {
      backgroundColor: 'rgb(200, 10, 67)',
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
  },
  saveButtonStyle: {
    backgroundColor: '#6e44ff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  actionButtonIcon: {
    marginLeft: 10,
  },
  // Error Popup Styles
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
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  errorTitle: {
    color: '#e74c3c',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
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
  // Delete Confirmation Styles
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
 // Unsaved Changes Popup Styles
 errorOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
},
unsavedContainer: {
  width: width * 0.9,
  backgroundColor: '#16213e',
  borderRadius: 16,
  padding: 20,
  borderWidth: 1,
  borderColor: '#0f3460',
},
unsavedHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 15,
},
unsavedTitle: {
  color: '#f39c12',
  fontSize: 20,
  fontWeight: 'bold',
  marginLeft: 10,
},
unsavedText: {
  color: '#fff',
  fontSize: 16,
  marginBottom: 20,
  textAlign: 'center',
  lineHeight: 24,
},
unsavedGrid: {
  flexDirection: 'column',
},
unsavedButton: {
  width: '100%',
  borderRadius: 12,
  padding: 8,
  marginBottom: 10,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
},
discardButton: {
  backgroundColor: '#e74c3c',
},
saveChangesButton: {
  backgroundColor: '#6e44ff',

},
continueButton: {

  borderWidth: 1,
  borderColor: '#6e44ff',
},
unsavedButtonIcon: {
  marginRight: 10,
},
unsavedButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
}, 
 // Modal styles
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

  modalOutside: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  customInputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  typingContainer: {
    position: 'relative',
  },
  customInput: {
    borderWidth: 2,
    borderColor: '#6e44ff',
    padding: 16,
    borderRadius: 12,
    color: '#e6e6e6',
    backgroundColor: 'rgba(30, 30, 60, 0.7)',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    color: '#b892ff',
    fontSize: 12,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
  },
  cancelButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.5)',
  },
  confirmButton: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.5)',
  },
  modalButtonText: {
    color: '#e6e6e6',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default EditGames;