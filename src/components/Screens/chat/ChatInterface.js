import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserDataContext } from '../../context/UserDataContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatInterface = ({ route, navigation }) => {
  // Destructure params with fallbacks
  const {
    matchId = '',
    userId = '',
    userName = 'Unknown',
    userAvatar = null,
    currentUserId = ''
  } = route.params || {};

  // Debug log to inspect params
  useEffect(() => {
    console.log('ChatInterface route.params:', route.params);
  }, []);

  const [newMessage, setNewMessage] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { 
    messages, 
    fetchMessages, 
    markMessagesAsRead, 
    refreshMatches 
  } = useContext(UserDataContext);
  const scrollViewRef = useRef();

  const getAuthHeaders = async () => {
    const authData = await AsyncStorage.getItem('@auth');
    if (!authData) return null;
    const { token } = JSON.parse(authData);
    return { Authorization: `Bearer ${token}` };
  };

  const formatMessage = (message) => {
    return {
      _id: message._id,
      text: message.content,
      createdAt: new Date(message.timestamp),
      user: {
        _id: message.sender._id || message.sender,
        name: message.sender._id === currentUserId ? 'You' : userName,
        avatar: message.sender._id === currentUserId ? null : userAvatar,
      },
      read: message.read || false
    };
  };

  const loadMessages = async (isInitial = false) => {
    if (!matchId) {
      Alert.alert('Error', 'Invalid match ID');
      return;
    }

    try {
      if (isInitial) {
        setIsInitialLoading(true);
      }
      await fetchMessages(matchId);
      
      const currentMessages = messages[matchId] || [];
      if (currentMessages.some(msg => !msg.read && msg.sender._id !== currentUserId)) {
        await markMessagesAsRead(matchId);
      }

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      if (isInitial) {
        setIsInitialLoading(false);
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      const headers = await getAuthHeaders();
      if (!headers) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const messageData = {
        content: newMessage,
        matchId,
        receiverId: userId,
      };

      const response = await axios.post('/userabout/send-message', messageData, { headers });

      if (response.data?.success) {
        setNewMessage('');
        await refreshMatches();
        await loadMessages();

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } else {
        Alert.alert('Error', 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    loadMessages(true);
    
    const interval = setInterval(() => loadMessages(false), 5000);
    
    return () => clearInterval(interval);
  }, [matchId]);

  useEffect(() => {
    navigation.setOptions({
      title: userName,
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId })}>
          <Image 
            source={userAvatar || require('../../../../assets/default-avatar.png')} 
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, userName, userAvatar]);

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.user._id === currentUserId;
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        {!isCurrentUser && (
          <Image
            source={item.user.avatar || require('../../../../assets/default-avatar.png')}
            style={styles.avatar}
          />
        )}
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
        ]}>
          <Text style={styles.messageText}>{item.text}</Text>
          <View style={styles.messageFooter}>
            <Text style={styles.messageTime}>
              {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {isCurrentUser && (
              <Ionicons 
                name={item.read ? "checkmark-done" : "checkmark"} 
                size={16} 
                color={item.read ? "#4a80f0" : "#aaa"} 
                style={styles.readIcon}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  const chatMessages = (messages[matchId] || []).map(formatMessage);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          contentContainerStyle={styles.messagesContainer}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {isInitialLoading && (
            <View style={styles.subtleLoadingContainer}>
              <ActivityIndicator size="small" color="#4a80f0" />
            </View>
          )}
          {chatMessages.length > 0 ? (
            chatMessages.map((message, index) => (
              <View key={`message-${message._id || index}`}>
                {renderMessage({ item: message })}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubText}>Start the conversation!</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            editable={!isSending}
          />
          <TouchableOpacity 
            style={styles.sendButton} 
            onPress={sendMessage}
            disabled={isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(1, 12, 20)',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  currentUserMessage: {
    justifyContent: 'flex-end',
  },
  otherUserMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 5,
  },
  currentUserBubble: {
    backgroundColor: 'rgb(14, 3, 52)',
    borderBottomRightRadius: 2,
  },
  otherUserBubble: {
    backgroundColor: 'rgb(30, 30, 60)',
    borderBottomLeftRadius: 2,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 5,
  },
  messageTime: {
    color: '#aaa',
    fontSize: 12,
    marginRight: 5,
  },
  readIcon: {
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgb(14, 3, 52)',
    backgroundColor: 'rgb(1, 12, 20)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgb(14, 3, 52)',
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: 'rgb(14, 3, 52)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
  },
  emptySubText: {
    color: '#888',
    fontSize: 14,
    marginTop: 10,
  },
  subtleLoadingContainer: {
    padding: 10,
    alignItems: 'center',
  },
});

export default ChatInterface;