import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  Pressable, 
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  Alert,
  BackHandler,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDataContext } from '../../../context/UserDataContext';

const { width, height } = Dimensions.get('window');

const responsiveWidth = (size) => (width / 375) * size;
const responsiveHeight = (size) => (height / 812) * size;
const responsiveFont = (size) => (width / 375) * size;

const EditLookingFor = ({ navigation }) => {
  const { userLookingForData, setUserLookingForData, refreshData } = useContext(UserDataContext);
  const [lookingFor, setLookingFor] = useState(userLookingForData || {});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [unsavedChangesVisible, setUnsavedChangesVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const pulseAnim = new Animated.Value(1);
  const backAnim = new Animated.Value(1);

  // Color scheme
  const colors = {
    primary: '#6e44ff',
    secondary: '#b892ff',
    accent: '#ff44b4',
    background: '#1a1a2e',
    card: '#16213e',
    text: '#e6e6e6',
    placeholder: '#888',
    success: '#2ecc71',
    danger: '#e74c3c',
    warning: '#f39c12',
  };

  // Field options
  const fieldOptions = {
    availability: ['Morning', 'Afternoon', 'Evening', 'Night', 'Weekends', 'Other'],
    playStyle: ['Casual', 'Competitive', 'Hardcore', 'Speedrunner', 'Completionist', 'Roleplayer', 'Other'],
    playMode: ['Solo', 'Co-op', 'PvP', 'PvE', 'Multiplayer', 'Singleplayer', 'Other']
  };

  // Sync with context data
  useEffect(() => {
    if (userLookingForData) setLookingFor(userLookingForData);
  }, [userLookingForData]);

  // Track changes
  useEffect(() => {
    const changesDetected = JSON.stringify(lookingFor) !== JSON.stringify(userLookingForData);
    setHasChanges(changesDetected);
  }, [lookingFor, userLookingForData]);

  // Back button handler
  useEffect(() => {
    const backAction = () => {
      if (hasChanges) {
        setUnsavedChangesVisible(true);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [hasChanges]);

  // Save to backend
  const handleSave = async () => {
    setSaving(true);
    try {
      const authData = await AsyncStorage.getItem('@auth');
      if (!authData) throw new Error('Authentication required');
      
      const { token } = JSON.parse(authData);
      const response = await axios.put(
        '/userabout/update-looking-for-data',
        {
          availability: lookingFor.availability,
          playStyle: lookingFor.playStyle,
          playMode: lookingFor.playMode,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        setUserLookingForData(response.data.updatedUserLookingForData);
        await refreshData();
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save data');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  // Field selection handlers
  const openModal = (field) => {
    setCurrentField(field);
    setModalVisible(true);
    setCustomInput('');
  };

  const handleOptionSelect = (option) => {
    if (option === 'Other') {
      setIsTyping(true);
      return;
    }
    setLookingFor({ ...lookingFor, [currentField]: option });
    setModalVisible(false);
    setIsTyping(false);
  };

  const saveCustomInput = () => {
    if (customInput.trim()) {
      setLookingFor({ ...lookingFor, [currentField]: customInput });
      setModalVisible(false);
      setIsTyping(false);
      setCustomInput('');
    }
  };

  // Field render helper
  const renderField = (fieldName, label) => (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={styles.input} 
        onPress={() => openModal(fieldName)}
        activeOpacity={0.7}
      >
        <Text style={lookingFor[fieldName] ? styles.selectedText : styles.placeholderText}>
          {lookingFor[fieldName] || `Select ${label.toLowerCase()}`}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.secondary} />
      </TouchableOpacity>
    </View>
  );

  // Animation setup
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(backAnim, {
          toValue: 1.02,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(backAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons name="search" size={28} color={colors.accent} style={styles.gameIcon} />
            <Text style={styles.title}> Looking For </Text>
          </View>
          <TouchableOpacity
            onPress={() => Alert.alert('Guide', 'Let other gamers know what you\'re looking for')}
            style={styles.helpButton}
          >
            <Ionicons name="information-circle-outline" size={28} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        {/* Fields */}
        {renderField('availability', 'Availability')}
        {renderField('playStyle', 'Play Style')}
        {renderField('playMode', 'Play Mode')}

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <Animated.View style={[styles.backButtonContainer, { transform: [{ scale: backAnim }] }]}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => hasChanges ? setUnsavedChangesVisible(true) : navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>BACK</Text>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.saveButtonContainer, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity 
              style={[styles.saveButton, saving && styles.disabledButton]} 
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.7}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.saveButtonText}>SAVE</Text>
                  <Ionicons name="save" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Unsaved Changes Modal */}
        <Modal
          transparent
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
                <TouchableOpacity 
                  style={[styles.unsavedButton, styles.discardButton]}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="trash-outline" size={24} color="#fff" />
                  <Text style={styles.unsavedButtonText}>Discard</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.unsavedButton, styles.saveChangesButton]}
                  onPress={handleSave}
                >
                  <Ionicons name="save-outline" size={24} color="#fff" />
                  <Text style={styles.unsavedButtonText}>Save</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.unsavedButton, styles.continueButton]}
                  onPress={() => setUnsavedChangesVisible(false)}
                >
                  <Ionicons name="pencil-outline" size={24} color="#fff" />
                  <Text style={styles.unsavedButtonText}>Continue Editing</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Selection Modal */}
        <Modal
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <Pressable 
              style={styles.modalOutside}
              onPress={() => setModalVisible(false)}
            />
            
            <View style={styles.modalContainer}>
              {isTyping ? (
                <View style={styles.customInputContainer}>
                  <Text style={styles.modalTitle}>ENTER {currentField.toUpperCase()}</Text>
                  <TextInput
                    style={styles.customInput}
                    placeholder={`Type your ${currentField}...`}
                    placeholderTextColor={colors.placeholder}
                    value={customInput}
                    onChangeText={setCustomInput}
                    autoFocus
                    maxLength={50}
                  />
                  <View style={styles.modalButtonRow}>
                    <TouchableOpacity 
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={() => setIsTyping(false)}
                    >
                      <Text style={styles.modalButtonText}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.modalButton, styles.confirmButton]}
                      onPress={saveCustomInput}
                    >
                      <Text style={styles.modalButtonText}>SAVE</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.optionsContainer}>
                  <Text style={styles.modalTitle}>SELECT {currentField.toUpperCase()}</Text>
                  <ScrollView>
                    {fieldOptions[currentField]?.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.optionButton,
                          lookingFor[currentField] === option && styles.selectedOption
                        ]}
                        onPress={() => handleOptionSelect(option)}
                      >
                        <Text style={styles.optionText}>{option}</Text>
                        {lookingFor[currentField] === option && (
                          <Ionicons name="checkmark" size={20} color={colors.accent} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(1, 12, 20)',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#e6e6e6',
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
    color: 'rgb(1, 225, 255)',
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 30, 60, 0.7)',
  },
  selectedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeholderText: {
    color: '#8e8e8e',
    fontSize: 16,
    fontWeight: '400',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  saveButtonContainer: {
  },
  backButtonContainer: {
  },
  saveButton: {
    backgroundColor: '#6e44ff',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  errorOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  unsavedContainer: {
    width: '90%',
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
  },
  unsavedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  unsavedTitle: {
    color: '#f39c12',
    fontSize: 20,
    marginLeft: 10,
  },
  unsavedText: {
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  unsavedGrid: {
    gap: 10,
  },
  unsavedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },
  discardButton: {
    backgroundColor: '#e74c3c',
  },
  saveChangesButton: {
    backgroundColor: '#6e44ff',
  },
  continueButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6e44ff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  optionButton: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: 'rgba(56, 14, 206, 0.2)',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedOption: {
    backgroundColor: 'rgba(110, 68, 255, 0.5)',
  },
  optionText: {
    width: '80%',
    color: '#fff',
    fontSize: 16,
  },
  customInputContainer: {
    gap: 15,
  },
  customInput: {
    backgroundColor: 'rgba(30, 30, 60, 0.7)',
    color: '#fff',
    padding: 15,
    borderRadius: 12,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  confirmButton: {
    backgroundColor: '#6e44ff',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditLookingFor;