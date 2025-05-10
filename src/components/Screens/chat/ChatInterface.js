import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  ImageBackground,
  Dimensions,
  Alert,
  Animated,
  Easing,
  Keyboard
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';


const { width, height } = Dimensions.get('window');

const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '🙁', '☹️', '😣'
];

const quickMessages = [
  { text: "Let's play!", color: "#FF6B6B", icon: "game-controller" },
  { text: "Good game!", color: "#4ECDC4", icon: "trophy" },
  { text: "Rematch?", color: "#FFD166", icon: "refresh" },
  { text: "I'm ready", color: "#06D6A0", icon: "checkmark" },
  { text: "Nice move!", color: "#118AB2", icon: "thumbs-up" },
  { text: "Oops!", color: "#EF476F", icon: "alert" },
  { text: "Well played", color: "#073B4C", icon: "happy" },
  { text: "Too easy!", color: "#7209B7", icon: "flash" },
];

const confirmationColors = [
  { cancel: "#4ECDC4", action: "#FF6B6B" },
  { cancel: "#118AB2", action: "#EF476F" },
  { cancel: "#06D6A0", action: "#7209B7" },
  { cancel: "#FFD166", action: "#FF6B6B" },
];

const ChatInterface = ({ route, navigation }) => {
  const { userName, userAvatar, online, userId } = route.params;
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'Hey there!', 
      sent: false, 
      time: '10:30 AM', 
      type: 'text',
      senderId: 123
    },
    { 
      id: 2, 
      text: 'Hi! How are you?', 
      sent: true, 
      time: '10:32 AM', 
      type: 'text',
      senderId: 456
    },
    { 
      id: 3, 
      text: 'Check out this strategy!', 
      sent: false, 
      time: '10:33 AM', 
      type: 'image', 
      uri: 'https://via.placeholder.com/300',
      senderId: 123
    },
    { 
      id: 4, 
      text: 'Sounds great!', 
      sent: true, 
      time: '10:35 AM', 
      type: 'text',
      senderId: 456
    },
    { 
      id: 5, 
      text: 'Tournament_Details.pdf', 
      sent: false, 
      time: '10:36 AM', 
      type: 'file', 
      fileName: 'Tournament_Details.pdf',
      senderId: 123
    },
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showQuickMessages, setShowQuickMessages] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState('');
  const scrollViewRef = useRef();
  
  // Animation values
  const mediaOptionsSlide = useRef(new Animated.Value(0)).current;
  const mediaOptionsOpacity = useRef(new Animated.Value(0)).current;
  const menuSlide = useRef(new Animated.Value(0)).current;
  const menuOpacity = useRef(new Animated.Value(0)).current;
  const quickMessagesSlide = useRef(new Animated.Value(0)).current;
  const quickMessagesOpacity = useRef(new Animated.Value(0)).current;
  const quickMessagesScale = useRef(new Animated.Value(0.5)).current;
  const confirmationSlide = useRef(new Animated.Value(0)).current;
  const confirmationOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setShowMenu(false);
        setShowMediaOptions(false);
        setShowQuickMessages(false);
        setShowConfirmation(false);
        scrollToBottom();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (showMediaOptions) {
      Animated.parallel([
        Animated.timing(mediaOptionsSlide, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.back(1)),
          useNativeDriver: true
        }),
        Animated.timing(mediaOptionsOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(mediaOptionsSlide, {
          toValue: 0,
          duration: 250,
          easing: Easing.in(Easing.back(1)),
          useNativeDriver: true
        }),
        Animated.timing(mediaOptionsOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [showMediaOptions]);

  useEffect(() => {
    if (showMenu) {
      Animated.parallel([
        Animated.timing(menuSlide, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.back(1)),
          useNativeDriver: true
        }),
        Animated.timing(menuOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(menuSlide, {
          toValue: 0,
          duration: 250,
          easing: Easing.in(Easing.back(1)),
          useNativeDriver: true
        }),
        Animated.timing(menuOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [showMenu]);

  useEffect(() => {
    if (showQuickMessages) {
      Animated.parallel([
        Animated.spring(quickMessagesScale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true
        }),
        Animated.timing(quickMessagesOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(quickMessagesScale, {
          toValue: 0.5,
          friction: 4,
          useNativeDriver: true
        }),
        Animated.timing(quickMessagesOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [showQuickMessages]);

  useEffect(() => {
    if (showConfirmation) {
      Animated.parallel([
        Animated.timing(confirmationSlide, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.back(1)),
          useNativeDriver: true
        }),
        Animated.timing(confirmationOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(confirmationSlide, {
          toValue: 0,
          duration: 250,
          easing: Easing.in(Easing.back(1)),
          useNativeDriver: true
        }),
        Animated.timing(confirmationOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [showConfirmation]);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const newMsg = {
      id: messages.length + 1,
      text: newMessage,
      sent: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      senderId: userId
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    setShowEmojiPicker(false);
    setShowQuickMessages(false);
    
    setTimeout(() => {
      const replyMsg = {
        id: messages.length + 2,
        text: 'Thanks for your message!',
        sent: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        senderId: 123
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1000);
  };

  const sendQuickMessage = (message) => {
    const newMsg = {
      id: messages.length + 1,
      text: message,
      sent: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      senderId: userId
    };
    
    setMessages([...messages, newMsg]);
    setShowQuickMessages(false);
    
    setTimeout(() => {
      const replyMsg = {
        id: messages.length + 2,
        text: 'Got it!',
        sent: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        senderId: 123
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1000);
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji);
  };

  const toggleMediaOptions = () => {
    setShowMediaOptions(!showMediaOptions);
    setShowEmojiPicker(false);
    setShowMenu(false);
    setShowQuickMessages(false);
    setShowConfirmation(false);
    Keyboard.dismiss();
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    setShowMediaOptions(false);
    setShowEmojiPicker(false);
    setShowQuickMessages(false);
    setShowConfirmation(false);
    Keyboard.dismiss();
  };

  const toggleQuickMessages = () => {
    setShowQuickMessages(!showQuickMessages);
    setShowMediaOptions(false);
    setShowEmojiPicker(false);
    setShowMenu(false);
    setShowConfirmation(false);
    Keyboard.dismiss();
  };

  const handleOutsidePress = () => {
    setShowMenu(false);
    setShowMediaOptions(false);
    setShowEmojiPicker(false);
    setShowQuickMessages(false);
  };

  const pickImage = async () => {
    setShowMediaOptions(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newMsg = {
        id: messages.length + 1,
        text: '',
        sent: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'image',
        uri: result.assets[0].uri,
        senderId: userId
      };
      setMessages([...messages, newMsg]);
    }
  };

  const takePhoto = async () => {
    setShowMediaOptions(false);
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newMsg = {
        id: messages.length + 1,
        text: '',
        sent: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'image',
        uri: result.assets[0].uri,
        senderId: userId
      };
      setMessages([...messages, newMsg]);
    }
  };

  const sendFile = async () => {
    setShowMediaOptions(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });
      
      if (result.type === 'success') {
        const newMsg = {
          id: messages.length + 1,
          text: result.name,
          sent: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'file',
          fileName: result.name,
          senderId: userId
        };
        setMessages([...messages, newMsg]);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const makeCall = () => {
    Alert.alert('Call', `Calling ${userName}...`);
  };

  const makeVideoCall = () => {
    Alert.alert('Video Call', `Starting video call with ${userName}...`);
  };

  const navigateToProfile = (senderId) => {
    navigation.navigate('Profile', { 
      userId: senderId,
      isCurrentUser: senderId === userId
    });
  };

  const handleUnmatch = () => {
    setShowMenu(false);
    setConfirmationType('unmatch');
    setShowConfirmation(true);
  };

  const handleDeleteConversation = () => {
    setShowMenu(false);
    setConfirmationType('delete');
    setShowConfirmation(true);
  };

  const confirmAction = () => {
    setShowConfirmation(false);
    if (confirmationType === 'unmatch' || confirmationType === 'delete') {
      navigation.goBack();
    }
  };

  const cancelAction = () => {
    setShowConfirmation(false);
  };

  const renderMessage = (message) => {
    const isCurrentUser = message.senderId === userId;
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.myMessageContainer : styles.theirMessageContainer
      ]}>
        {!isCurrentUser && (
          <TouchableOpacity onPress={() => navigateToProfile(message.senderId)}>
            <Image 
              source={userAvatar } 
              style={styles.messageAvatar}
            />
          </TouchableOpacity>
        )}
        <View style={[
          styles.messageContent,
          isCurrentUser ? styles.myMessageContent : styles.theirMessageContent
        ]}>
          {message.type === 'image' ? (
            <TouchableOpacity onPress={() => {
              setPreviewImage(message.uri);
              setShowImagePreview(true);
            }}>
              <Image 
                source={ message.uri } 
                style={styles.messageImage}
              />
              <Text style={styles.messageTime}>{message.time}</Text>
            </TouchableOpacity>
          ) : message.type === 'file' ? (
            <View style={styles.fileContainer}>
              <MaterialIcons name="insert-drive-file" size={32} color="#fff" />
              <Text style={styles.fileName}>{message.fileName}</Text>
              <Text style={styles.messageTime}>{message.time}</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.messageText}>{message.text}</Text>
              <Text style={styles.messageTime}>{message.time}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Animation styles
  const mediaOptionsAnimatedStyle = {
    transform: [{
      translateY: mediaOptionsSlide.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 0]
      })
    }],
    opacity: mediaOptionsOpacity
  };

  const menuAnimatedStyle = {
    transform: [{
      translateY: menuSlide.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 0]
      })
    }],
    opacity: menuOpacity
  };

  const quickMessagesAnimatedStyle = {
    transform: [{
      scale: quickMessagesScale
    }],
    opacity: quickMessagesOpacity
  };

  const confirmationAnimatedStyle = {
    transform: [{
      scale: confirmationSlide.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1]
      })
    }],
    opacity: confirmationOpacity
  };

  // Random color selection for confirmation dialog
  const colorSet = confirmationColors[Math.floor(Math.random() * confirmationColors.length)];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerProfile}
              onPress={() => navigateToProfile(userId)}
            >
              <Image source={userAvatar } style={styles.headerAvatar} />
              <View style={styles.headerUserInfo}>
                <Text style={styles.headerUserName}>{userName}</Text>
                <Text style={[styles.headerUserStatus, { color: online ? '#4CAF50' : '#888' }]}>
                  {online ? 'Online' : 'Offline'}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.actionButton} onPress={makeCall}>
                <Ionicons name="call-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={makeVideoCall}>
                <Ionicons name="videocam-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={toggleMenu}>
                <FontAwesome name="ellipsis-v" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Menu Options */}
          {showMenu && (
            <Animated.View 
              style={[
                styles.menuOptionsContainer,
                menuAnimatedStyle,
              ]}
            >
              <TouchableOpacity 
                style={styles.menuOption}
                onPress={handleUnmatch}
              >
                <Ionicons name="person-remove" size={20} color="#ff4444" style={styles.menuOptionIcon} />
                <Text style={styles.menuOptionText}>Unmatch this Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.menuOption}
                onPress={handleDeleteConversation}
              >
                <Ionicons name="trash" size={20} color="#ff4444" style={styles.menuOptionIcon} />
                <Text style={styles.menuOptionText}>Delete Conversation</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Confirmation Dialog Modal */}
          {showConfirmation && (
            <Modal transparent={true} visible={showConfirmation} animationType="fade">
              <TouchableWithoutFeedback onPress={cancelAction}>
                <View style={styles.confirmationOverlay}>
                  <TouchableWithoutFeedback>
                    <Animated.View style={[styles.confirmationContainer, confirmationAnimatedStyle]}>
                      <Text style={styles.confirmationTitle}>
                        {confirmationType === 'unmatch' 
                          ? `Unmatch with ${userName}?` 
                          : `Delete conversation with ${userName}?`
                        }
                      </Text>
                      <Text style={styles.confirmationText}>
                        {confirmationType === 'unmatch'
                          ? "This action can't be undone and you won't be able to match with this user again."
                          : "This will permanently delete your conversation history with this user."
                        }
                      </Text>
                      <View style={styles.confirmationButtonsGrid}>
                        <TouchableOpacity 
                          style={[styles.confirmationButton, { backgroundColor: colorSet.cancel }]}
                          onPress={cancelAction}
                        >
                          <Text style={styles.confirmationButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.confirmationButton, { backgroundColor: colorSet.action }]}
                          onPress={confirmAction}
                        >
                          <Text style={styles.confirmationButtonText}>
                            {confirmationType === 'unmatch' ? 'Unmatch' : 'Delete'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}

          {/* Messages */}
          <KeyboardAvoidingView
            behavior={'height'}
            style={styles.keyboardAvoidingView}
            keyboardVerticalOffset={0}
          >
            <ScrollView 
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              onContentSizeChange={scrollToBottom}
              keyboardDismissMode="interactive"
            >
              {messages.map((message) => (
                <View key={message.id}>
                  {renderMessage(message)}
                </View>
              ))}
            </ScrollView>

            {/* Message Input */}
            <View style={[styles.inputContainer, { paddingBottom: keyboardHeight }]}>
              <View style={styles.inputLeftButtons}>
                <TouchableOpacity 
                  style={styles.attachmentButton}
                  onPress={toggleMediaOptions}
                >
                  <Ionicons 
                    name="add" 
                    size={28} 
                    color={showMediaOptions ? '#4a80f0' : '#888'} 
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickMessageButton}
                  onPress={toggleQuickMessages}
                >
                  <Ionicons 
                    name="flash" 
                    size={24} 
                    color={showQuickMessages ? '#4a80f0' : '#888'} 
                  />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.messageInput}
                placeholder="Type a message..."
                placeholderTextColor="#888"
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
              />
              <TouchableOpacity 
                style={styles.emojiButton}
                onPress={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                  setShowMediaOptions(false);
                  setShowMenu(false);
                  setShowQuickMessages(false);
                  setShowConfirmation(false);
                }}
              >
                <Ionicons 
                  name="happy-outline" 
                  size={24} 
                  color={showEmojiPicker ? '#4a80f0' : '#888'} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleSendMessage}
                disabled={newMessage.trim() === ''}
              >
                <Ionicons 
                  name="send" 
                  size={24} 
                  color={newMessage.trim() === '' ? '#888' : '#4a80f0'} 
                />
              </TouchableOpacity>
            </View>

            {/* Media Options */}
            {showMediaOptions && (
  <Animated.View 
    style={[
      styles.mediaOptionsContainer,
      mediaOptionsAnimatedStyle,
      { bottom: keyboardHeight }
    ]}
  >
    <View style={styles.mediaOptionsContent}>
      <TouchableOpacity style={styles.mediaOption} onPress={pickImage}>
        <View style={styles.mediaOptionIcon}>
          <Ionicons name="image" size={28} color="#4a80f0" />
        </View>
        <Text style={styles.mediaOptionText}>Photo Library</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.mediaOption} onPress={takePhoto}>
        <View style={styles.mediaOptionIcon}>
          <Ionicons name="camera" size={28} color="#4a80f0" />
        </View>
        <Text style={styles.mediaOptionText}>Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.mediaOption} onPress={sendFile}>
        <View style={styles.mediaOptionIcon}>
          <MaterialIcons name="insert-drive-file" size={28} color="#4a80f0" />
        </View>
        <Text style={styles.mediaOptionText}>Document</Text>
      </TouchableOpacity>
    </View>
  </Animated.View>
)}

            {/* Quick Messages */}
            {showQuickMessages && (
              <Animated.View 
                style={[
                  styles.quickMessagesContainer,
                  quickMessagesAnimatedStyle,
                  { bottom: keyboardHeight+60 }
                ]}
              >
                <View style={styles.quickMessagesGrid}>
                  {quickMessages.map((msg, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={[styles.quickMessageButton, { backgroundColor: msg.color }]}
                      onPress={() => sendQuickMessage(msg.text)}
                    >
                      <Ionicons name={msg.icon} size={20} color="#fff" style={styles.quickMessageIcon} />
                      <Text style={styles.quickMessageText}>{msg.text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>
            )}

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <View style={[styles.emojiPickerContainer, { bottom: keyboardHeight + 60 }]}>
                <ScrollView 
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.emojiPickerContent}
                >
                  {emojis.map((emoji, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.emojiButton}
                      onPress={() => {
                        handleEmojiSelect(emoji);
                        setShowEmojiPicker(false);
                      }}
                    >
                      <Text style={styles.emoji}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Image Preview Modal */}
            <Modal
              transparent={true}
              visible={showImagePreview}
              onRequestClose={() => setShowImagePreview(false)}
            >
              <TouchableWithoutFeedback onPress={() => setShowImagePreview(false)}>
                <ImageBackground 
                  source={ previewImage } 
                  style={styles.imagePreviewContainer}
                  resizeMode="contain"
                >
                  <View style={styles.imagePreviewClose}>
                    <Ionicons name="close" size={30} color="#fff" />
                  </View>
                </ImageBackground>
              </TouchableWithoutFeedback>
            </Modal>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#252538',
    backgroundColor: '#0f0f1a',
  },
  backButton: {
    marginRight: 10,
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerUserInfo: {
    flex: 1,
  },
  headerUserName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  headerUserStatus: {
    fontSize: 12,
    color: '#888',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 10,
  },
  menuOptionsContainer: {
    position: 'absolute',
    top: 70,
    right: 15,
    backgroundColor: '#252538',
    borderRadius: 10,
    paddingVertical: 5,
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuOptionIcon: {
    marginRight: 10,
  },
  menuOptionText: {
    color: '#fff',
    fontSize: 16,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messagesContent: {
    paddingBottom: '2%',
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  theirMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageContent: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  myMessageContent: {
    backgroundColor: '#4a80f0',
    borderBottomRightRadius: 0,
  },
  theirMessageContent: {
    backgroundColor: '#252538',
    borderBottomLeftRadius: 2,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  messageTime: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
  fileContainer: {
    alignItems: 'center',
  },
  fileName: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
  mediaOptionsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#252538',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  mediaOptionsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  mediaOption: {
    alignItems: 'center',
    width: 80,
  },
  mediaOptionIcon: {
    backgroundColor: '#1a1a2e',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  mediaOptionText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  quickMessagesContainer: {
    position: 'absolute',
    left: 15,
    right: 15,
    backgroundColor: '#252538',
    borderRadius: 20,
    padding: 15,
    zIndex: 10,
  },
  quickMessagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickMessageButton: {
    width: '48%',
    padding: 12,
    borderRadius: 50,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickMessageIcon: {
    marginRight: 8,
  },
  quickMessageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  confirmationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationContainer: {
    backgroundColor: '#252538',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    alignItems: 'center',
  },
  confirmationTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  confirmationText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  confirmationButtonsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmationButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 10,
  },
  emojiPickerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#252538',
    borderTopWidth: 1,
    borderTopColor: '#1a1a2e',
  },
  emojiPickerContent: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  emojiButton: {
    padding: 8,
  },
  emoji: {
    fontSize: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#252538',
    borderTopWidth: 1,
    borderTopColor: '#1a1a2e',
  },
  inputLeftButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentButton: {
    padding: 8,
    marginRight: 5,
  },
  quickMessageButton: {
    padding: 8,
  },
  messageInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 5,
  },
  emojiButton: {
    padding: 6,
  },
  sendButton: {
    padding: 8,
    marginLeft: 5,
  },
});

export default ChatInterface;