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
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserDataContext } from '../../context/UserDataContext';
import BottomNavBar from '../../common/BottomNavBar';

const Chat = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { matches, refreshMatches, unseenMatches } = useContext(UserDataContext);
  const [localChats, setLocalChats] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch matches on component mount
  useEffect(() => {
    const fetchInitialMatches = async () => {
      setIsRefreshing(true);
      try {
        await refreshMatches();
      } catch (error) {
        console.error('Initial matches fetch error:', error);
      } finally {
        setIsRefreshing(false);
      }
    };
    fetchInitialMatches();
  }, []);

  // Format timestamp from backend
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // Difference in seconds
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return `${date.toLocaleDateString()}`;
  };

  // Refresh chat list
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshMatches();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Update local chats when matches change
  useEffect(() => {
    if (matches && matches.length > 0) {
      const formattedChats = matches.map((match, index) => ({
        id: match._id || `temp-${index}`, // Fallback for missing _id
        userId: match.userId,
        name: match.gamingName || `User ${index}`,
        lastMessage: match.lastMessage || 'Start the conversation!',
        time: formatTime(match.lastMessageAt || match.matchedAt),
        avatar: match.avatar ? { uri: match.avatar } : require('../../../../assets/default-avatar.png'),
        unread: unseenMatches > 0
      }));
      setLocalChats(formattedChats);
    } else {
      setLocalChats([]);
    }
  }, [matches, unseenMatches]);

  const filteredChats = localChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (chat) => {
    navigation.navigate('ChatInterface', { 
      matchId: chat.id,
      userId: chat.userId,
      userName: chat.name,
      userAvatar: chat.avatar,
    });
  };

  if (!matches) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4a80f0" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerRight}>
          {unseenMatches > 0 && (
            <View style={styles.unseenBadge}>
              <Text style={styles.unseenText}>{unseenMatches}</Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.newGroupButton}
            onPress={() => navigation.navigate('CreateGroup')}
          >
            <Ionicons name="people-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search matches..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Chat List */}
      <ScrollView 
        style={styles.chatList}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#fff"
          />
        }
      >
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <TouchableOpacity 
              key={`chat-${chat.id}`}
              style={styles.chatItem}
              onPress={() => handleChatPress(chat)}
            >
              <View style={styles.avatarContainer}>
                <Image 
                  source={chat.avatar} 
                  style={styles.avatar}
                  defaultSource={require('../../../../assets/default-avatar.png')}
                />
              </View>
              <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>{chat.name}</Text>
                  <Text style={styles.chatTime}>{chat.time}</Text>
                </View>
                <Text 
                  style={[styles.chatMessage, chat.unread && styles.unreadMessage]}
                  numberOfLines={1}
                >
                  {chat.lastMessage}
                </Text>
              </View>
              {chat.unread && <View style={styles.unreadBadge} />}
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={60} color="#444" />
            <Text style={styles.emptyText}>No matches yet</Text>
            <Text style={styles.emptySubText}>Connect with other gamers to start chatting!</Text>
          </View>
        )}
      </ScrollView>

      <BottomNavBar />
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
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(14, 3, 52)',
    backgroundColor: 'rgb(14, 3, 52)',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unseenBadge: {
    backgroundColor: '#4a80f0',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 10,
  },
  unseenText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  newGroupButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(14, 3, 52)',
    borderRadius: 20,
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgb(1, 12, 20)',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: 'rgb(1, 12, 20)',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(14, 3, 52)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgb(1, 225, 255)',
    borderWidth: 2,
    borderColor: 'rgb(1, 12, 20)',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  chatTime: {
    width: 80,
    textAlign: 'right',
    fontSize: 12,
    color: '#888',
  },
  chatMessage: {
    fontSize: 14,
    color: '#aaa',
  },
  unreadMessage: {
    color: 'rgb(1, 225, 255)',
    fontWeight: '500',
  },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgb(1, 225, 255)',
    marginLeft: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1a',
  },
});

export default Chat;