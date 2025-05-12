import React, { useState, useEffect, useContext } from 'react';
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
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/authContext';
import { UserDataContext } from '../../context/UserDataContext';

const ChatInterface = ({ route, navigation }) => {
  const { matchId, userId, userName, userAvatar, currentUserId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [authState] = useContext(AuthContext);
  const { refreshMatches } = useContext(UserDataContext);

  const formatMessage = (message) => {
    return {
      _id: message._id,
      text: message.content,
      createdAt: new Date(message.createdAt),
      user: {
        _id: message.sender,
        name: message.sender === currentUserId ? 'You' : userName,
        avatar: message.sender === currentUserId ? null : userAvatar,
      },
    };
  };

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const authData = await AsyncStorage.getItem('@auth');
      const { token } = JSON.parse(authData);
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`/userabout/messages/${matchId}`, { headers });
      
      if (response.data?.success) {
        const formattedMessages = response.data.messages.map(message => formatMessage(message));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const authData = await AsyncStorage.getItem('@auth');
      const { token } = JSON.parse(authData);
      const headers = { Authorization: `Bearer ${token}` };

      const messageData = {
        content: newMessage,
        matchId,
        receiver: userId,
      };

      const response = await axios.post('/userabout/send-message', messageData, { headers });

      if (response.data?.success) {
        const newMsg = formatMessage(response.data.message);
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
        refreshMatches(); // Refresh matches to update last message
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Set up polling for new messages
    const interval = setInterval(fetchMessages, 5000);
    
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
          <Text style={styles.messageTime}>
            {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a80f0" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          contentContainerStyle={styles.messagesContainer}
          ref={ref => this.scrollView = ref}
          onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}
        >
          {messages.map((message, index) => (
            <View key={`message-${index}`}>
              {renderMessage({ item: message })}
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={24} color="#fff" />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  messageTime: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'right',
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
});

export default ChatInterface;