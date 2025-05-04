import React, { useState, useEffect } from 'react';
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
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDataContext } from '../../../context/UserDataContext';

const { width, height } = Dimensions.get('window');


const responsiveWidth = (size) => (width / 375) * size;
const responsiveHeight = (size) => (height / 812) * size;
const responsiveFont = (size) => (width / 375) * size;

const EditLookingFor = ({ navigation, route }) => {
 const { userLookingForData, setUserLookingForData, refreshData } = useContext(UserDataContext);
  const [lookingFor, setLookingFor] = useState(userLookingForData || {});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [unsavedChangesVisible, setUnsavedChangesVisible] = useState(false);
  const savePulseAnim = new Animated.Value(1);
  const backPulseAnim = new Animated.Value(1);

  // Gaming theme colors
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

  // Options for each field
  const fieldOptions = {
    availability: ['Morning', 'Afternoon', 'Evening', 'Night', 'Weekends', 'Custom'],
    playerStyle: ['Casual', 'Competitive', 'Hardcore', 'Speedrunner', 'Completionist', 'Roleplayer', 'Custom'],
    playMode: ['Solo', 'Co-op', 'PvP', 'PvE', 'Multiplayer', 'Singleplayer', 'Custom']
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
          '/userabout/update-about-data',
          {
            educationQualification: about.educationQualification,
            occupation: about.occupation,
           // location: about.location,
            religion: about.religion,
            smoking: about.smoking,
            drinks: about.drinks,
            gender: about.gender,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (response.data?.success) {
          setAboutData(response.data.updatedAbout);
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

  const renderField = (fieldName, label) => (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={styles.input} 
        onPress={() => openModal(fieldName)}
        activeOpacity={0.7}
      >
        <Text style={lookingFor[fieldName] ? styles.selectedText : styles.placeholderText}>
          {lookingFor[fieldName] || `Select your ${fieldName.toLowerCase()}`}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.secondary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
   {/* Header - Modified to place title on the left */}
<View style={styles.header}>
  <View style={styles.titleContainer}>
    <Ionicons name="search" size={28} color={colors.accent} style={styles.gameIcon} />
    <Text style={styles.title}>Looking For</Text>
  </View>
  
  <TouchableOpacity 
    onPress={() => {
      Alert.alert(
        "Looking For Guide",
        "Let other gamers know what you're looking for:\n\n• When you're typically available to play\n• Your preferred gaming style\n• The game modes you enjoy most",
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

        {/* All fields */}
        {renderField('availability', 'Availability')}
        {renderField('playerStyle', 'Player Style')}
        {renderField('playMode', 'Play Mode')}

        {/* Button Row */}
        <View style={styles.buttonRow}>
          <Animated.View style={[styles.buttonContainer, { transform: [{ scale: backPulseAnim }] }]}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.backButton]} 
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>BACK</Text>
              <Ionicons name="arrow-back" size={20} color="#fff" style={styles.actionButtonIcon} />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.buttonContainer, { transform: [{ scale: savePulseAnim }] }]}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.saveButton]} 
              onPress={handleSave}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>SAVE</Text>
              <Ionicons name="save" size={20} color="#fff" style={styles.actionButtonIcon} />
            </TouchableOpacity>
          </Animated.View>
        </View>

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
                    {fieldOptions[currentField]?.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.optionButton,
                          lookingFor[currentField] === option && styles.selectedOption
                        ]}
                        onPress={() => handleOptionSelect(option)}
                        activeOpacity={0.6}
                      >
                        <Text style={styles.optionText}>{option}</Text>
                        {lookingFor[currentField] === option && (
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
    paddingTop: 40,
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
    textShadowColor: 'rgba(44, 18, 138, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  helpButton: {
    padding: 5,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
    color: 'rgb(1, 225, 255)',
    letterSpacing: 0.5,
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
    padding: 15,
    borderRadius: 12,
   // backgroundColor: 'rgba(30, 30, 60, 0.7)',
  },
  selectedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  placeholderText: {
    color: 'rgba(142, 142, 142, 0.7)',
    fontSize: 16,
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    backgroundColor: 'rgb(200, 10, 67)',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

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
 
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  actionButtonIcon: {
    marginLeft: 10,
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



export default EditLookingFor;