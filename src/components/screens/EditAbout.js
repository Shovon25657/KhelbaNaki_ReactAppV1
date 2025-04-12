import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Modal, 
  Pressable, 
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const EditAbout = ({ navigation, route }) => {
  const initialAbout = route.params?.about || {};
  const [about, setAbout] = useState(initialAbout);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const pulseAnim = new Animated.Value(1);

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
  };

  // Options for each field
  const fieldOptions = {
    education: ['High School', 'Bachelor Degree', 'Master Degree', 'PhD', 'Other'],
    smoking: ['Yes', 'No', 'Custom'],
    drinks: ['Yes', 'No', 'Occasionally', 'Custom'],
    gender: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
    religion: ['Christianity', 'Islam', 'Hinduism', 'Buddhism', 'Judaism', 'Atheism', 'Other'],
    occupation: ['Student', 'Engineer', 'Doctor', 'Teacher', 'Artist', 'Streamer', 'Gamer', 'Developer', 'Other']
  };

  // Pulsing animation for save button
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleSave = () => {
    navigation.navigate('EditProfile', { updatedAbout: about });
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
    
    setAbout({ ...about, [currentField]: option });
    setModalVisible(false);
    setIsTyping(false);
  };

  const saveCustomInput = () => {
    if (customInput.trim()) {
      setAbout({ ...about, [currentField]: customInput });
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
        <Text style={about[fieldName] ? styles.selectedText : styles.placeholderText}>
          {about[fieldName] || `Select your ${fieldName.toLowerCase()}`}
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
        {/* Header with adjusted spacing */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons name="game-controller" size={28} color={colors.accent} style={styles.gameIcon} />
            <Text style={styles.title}>About Me</Text>
          </View>
          <TouchableOpacity 
            onPress={() => {
              Alert.alert(
                "Profile Information Guide",
                "Please fill out your profile information accurately and truthfully. This helps create a better experience for everyone. Remember:\n\n• Use real details about yourself\n• Select options that genuinely represent you\n• Custom fields are for special cases only",
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
        {renderField('education', 'Education Qualification')}
        {renderField('smoking', 'Smoking')}
        {renderField('drinks', 'Drinks')}
        {renderField('gender', 'Gender')}
        {renderField('religion', 'Religion')}
        {renderField('occupation', 'Occupation')}

        {/* Animated Save Button */}
        <Animated.View style={[styles.saveButtonContainer, { transform: [{ scale: pulseAnim }] }]}>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            activeOpacity={0.7}
          >
            <Text style={styles.saveButtonText}>SAVE PROFILE</Text>
            <Ionicons name="save" size={20} color="#fff" style={styles.saveIcon} />
          </TouchableOpacity>
        </Animated.View>

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
                          about[currentField] === option && styles.selectedOption
                        ]}
                        onPress={() => handleOptionSelect(option)}
                        activeOpacity={0.6}
                      >
                        <Text style={styles.optionText}>{option}</Text>
                        {about[currentField] === option && (
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
    backgroundColor: '#1a1a2e',
  },
// Just modify the scrollContainer style:
scrollContainer: {
  padding: 20,
  paddingBottom: 40,
  paddingTop: 40, // Increase this value to push content down more
},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 15,
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
    textShadowColor: 'rgba(110, 68, 255, 0.5)',
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
    color: '#b892ff',
    letterSpacing: 0.5,
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6e44ff',
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 30, 60, 0.7)',
  },
  selectedText: {
    color: '#e6e6e6',
    fontSize: 16,
    fontWeight: '500',
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  saveButtonContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#6e44ff',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6e44ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
    width: width * 0.8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  saveIcon: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalOutside: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: width * 0.85,
    maxHeight: height * 0.7,
    backgroundColor: '#16213e',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#6e44ff',
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e6e6e6',
    textAlign: 'center',
    marginBottom: 20,
    paddingTop: 20,
    letterSpacing: 0.5,
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

export default EditAbout;