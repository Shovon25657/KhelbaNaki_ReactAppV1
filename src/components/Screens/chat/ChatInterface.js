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
  const { matchId, userId, userName, userAvatar, currentUserId } = route.params;
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    try {
      if (isInitial) {
        setIsLoading(true);
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
        setIsLoading(false);
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

  const handleCallPress = () => {
    Alert.alert('Coming Soon', 'Voice call feature will be added soon!');
  };

  const handleVideoPress = () => {
    Alert.alert('Coming Soon', 'Video call feature will be added soon!');
  };

  useEffect(() => {
    loadMessages(true);
    const interval = setInterval(() => loadMessages(false), 5000);
    return () => clearInterval(interval);
  }, [matchId]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.user._id === currentUserId;

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        {!isCurrentUser && (
          <Image
            source={item.user.avatar || require('../../../../assets/default-avatar.png')}
            style={styles.avatar}
          />
        )}
        <View
          style={[
            styles.messageBubble,
            isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
          <View style={styles.messageFooter}>
            <Text style={styles.messageTime}>
              {item.createdAt.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            {isCurrentUser && (
              <Ionicons
                name={item.read ? 'checkmark-done' : 'checkmark'}
                size={16}
                color={item.read ? '#4a80f0' : '#aaa'}
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Image 
            source={userAvatar || require('../../../../assets/default-avatar.png')} 
            style={styles.headerAvatar}
          />
          <Text style={styles.headerTitle}>{userName}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={handleCallPress}>
            <Ionicons name="call" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleVideoPress}>
            <Ionicons name="videocam" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

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
          {isLoading && (
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(14, 3, 52)',
    backgroundColor: 'rgb(1, 12, 20)',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
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
    paddingHorizontal: 10,
  },
  currentUserMessage: {
    justifyContent: 'flex-end',
  },
  otherUserMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 18,
    backgroundColor: '#fff',
  },
  currentUserBubble: {
    backgroundColor: '#4a80f0',
    borderBottomRightRadius: 6,
    marginLeft: 10,
  },
  otherUserBubble: {
    backgroundColor: '#333',
    borderBottomLeftRadius: 6,
    marginRight: 10,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    color: '#ccc',
    fontSize: 11,
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
    backgroundColor: '#4a80f0',
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
    color: '#aaa',
    fontSize: 14,
    marginTop: 10,
  },
  subtleLoadingContainer: {
    padding: 10,
    alignItems: 'center',
  },
});

export default ChatInterface;