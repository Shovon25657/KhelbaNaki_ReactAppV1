import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from '../../common/BottomNavBar';
import person1 from '../../../../assets/Alex.jpg';
import person2 from '../../../../assets/Angry_Avater.jpg';
import person3 from '../../../../assets/group_photo.jpg';
import person4 from '../../../../assets/cartoon-character-with-handbag-sunglasses.jpg';

const Chat = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState([
    {
      id: 1,
      name: 'Ryan',
      lastMessage: 'Hey, Khelba Naki??',
      time: '2h ago',
      unread: true,
      avatar: person1,
      online: true
    },
    {
      id: 2,
      name: 'FHT',
      lastMessage: 'Koi re!! Tuio ki helicopter niye palai geli?',
      time: '5h ago',
      unread: false,
      avatar: person2,
      online: false
    },
    {
      id: 3,
      name: 'Pagla Gamers',
      lastMessage: 'MODI: IND vs PAK War!!',
      time: '1d ago',
      unread: true,
      avatar: person3,
      online: true
    },
    {
      id: 4,
      name: 'KMS007',
      lastMessage: 'Khela dhula e Jibon!',
      time: '2d ago',
      unread: false,
      avatar: person4,
      online: false
    },
  ]);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (chat) => {
    navigation.navigate('ChatInterface', { 
      chatId: chat.id,
      userName: chat.name,
      userAvatar: chat.avatar,
      online: chat.online,
      userId: 456 // Current user ID
    });
  };

  const handleCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity 
          style={styles.newGroupButton}
          onPress={handleCreateGroup}
        >
          <Ionicons name="people-outline" size={24} color="rgb(1, 225, 255)" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for friends..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Chat List */}
      <ScrollView style={styles.chatList}>
        {filteredChats.map((chat) => (
          <TouchableOpacity 
            key={chat.id} 
            style={styles.chatItem}
            onPress={() => handleChatPress(chat)}
          >
            <View style={styles.avatarContainer}>
              <Image source={chat.avatar} style={styles.avatar} />
              {chat.online && <View style={styles.onlineIndicator} />}
            </View>
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatName}>{chat.name}</Text>
                <Text style={styles.chatTime}>{chat.time}</Text>
              </View>
              <Text 
                style={[
                  styles.chatMessage,
                  chat.unread && styles.unreadMessage
                ]}
                numberOfLines={1}
              >
                {chat.lastMessage}
              </Text>
            </View>
            {chat.unread && <View style={styles.unreadBadge} />}
          </TouchableOpacity>
        ))}
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
});

export default Chat;