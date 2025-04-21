import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  FlatList, 
  TextInput 
} from 'react-native';
import { Ionicons, FontAwesome, Feather, AntDesign } from '@expo/vector-icons';

const FeedProfile = ({ route, navigation }) => {
  // Default user data
  const defaultUser = {
    id: '1',
    username: 'ProGamer99',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Professional gamer | Streamer | PC enthusiast',
    followers: 1245,
    following: 342,
    posts: 56,
    isFollowing: false
  };

  // Use passed user or default
  const user = route.params?.user || defaultUser;

  // State management
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [activeTab, setActiveTab] = useState('posts');
  const [newComment, setNewComment] = useState('');

  // Sample posts data
  const [posts] = useState([
    {
      id: '1',
      content: 'Just built my dream gaming PC! RTX 4090, i9-13900K, 32GB DDR5. Can\'t wait to test it on Cyberpunk!',
      image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1478&q=80',
      likes: 245,
      comments: [
        { id: '1', username: 'GamerGirl42', text: 'Awesome setup! What case is that?', time: '1h ago' },
        { id: '2', username: 'PCBuilderPro', text: 'Nice specs! How are the temps?', time: '30m ago' }
      ],
      shares: 12,
      time: '2h ago',
      isLiked: false
    },
    {
      id: '2',
      content: 'Finally got my hands on the new Zelda game! Who else is playing?',
      image: 'https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      likes: 189,
      comments: [
        { id: '1', username: 'LinkFan', text: 'I just started too! The graphics are amazing', time: '4h ago' }
      ],
      shares: 8,
      time: '5h ago',
      isLiked: true
    },
  ]);

  // Sample following data
  const [following] = useState([
    { id: '1', username: 'ConsoleQueen', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: '2', username: 'EsportsPro', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
    { id: '3', username: 'GamerGirl42', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
    { id: '4', username: 'PCBuilderPro', avatar: 'https://randomuser.me/api/portraits/men/68.jpg' },
  ]);

  // Handle follow toggle
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  // Handle post like
  const handleLike = (postId) => {
    // In a real app, you would update the state here
    console.log(`Liked post ${postId}`);
  };

  // Add comment to post
  const addComment = (postId) => {
    if (newComment.trim() === '') return;
    console.log(`Added comment to post ${postId}: ${newComment}`);
    setNewComment('');
  };

  // Render individual post
  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postContent}>{item.content}</Text>
      
      {item.image && (
        <View style={styles.mediaContainer}>
          <Image source={{ uri: item.image }} style={styles.postImage} />
        </View>
      )}
      
      <View style={styles.postStats}>
        <Text style={styles.statText}>{item.likes} likes</Text>
        <Text style={styles.statText}>{item.comments.length} comments</Text>
        <Text style={styles.statText}>{item.shares} shares</Text>
        <Text style={styles.postTime}>{item.time}</Text>
      </View>
      
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleLike(item.id)}
        >
          <AntDesign 
            name={item.isLiked ? "heart" : "hearto"} 
            size={20} 
            color={item.isLiked ? "#FF3B30" : "#666"} 
          />
          <Text style={[styles.actionText, item.isLiked && styles.likedAction]}>Like</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="message-circle" size={20} color="#666" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="share-2" size={20} color="#666" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
      
      {/* Comments section */}
      <View style={styles.commentsSection}>
        {item.comments.slice(0, 2).map(comment => (
          <View key={comment.id} style={styles.commentItem}>
            <Text style={styles.commentUsername}>{comment.username}</Text>
            <Text style={styles.commentText}>{comment.text}</Text>
          </View>
        ))}
        
        {item.comments.length > 2 && (
          <TouchableOpacity>
            <Text style={styles.viewMoreComments}>View more comments</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            placeholderTextColor="#888"
            value={newComment}
            onChangeText={setNewComment}
            onSubmitEditing={() => addComment(item.id)}
          />
          <TouchableOpacity onPress={() => addComment(item.id)}>
            <Ionicons name="send" size={20} color="#FFD700" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Render following item
  const renderFollowingItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.followingItem}
      onPress={() => navigation.navigate('FeedProfile', { user: item })}
    >
      <Image source={{ uri: item.avatar }} style={styles.followingAvatar} />
      <Text style={styles.followingUsername}>{item.username}</Text>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Following</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.username}</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <ScrollView>
        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <Image source={{ uri: user.avatar }} style={styles.profileAvatar} />
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{posts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>{user.username}</Text>
          <Text style={styles.profileBio}>{user.bio}</Text>
          
          <TouchableOpacity 
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={handleFollow}
          >
            <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <Ionicons 
              name="grid" 
              size={24} 
              color={activeTab === 'posts' ? "#FFD700" : "#888"} 
            />
            <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>Posts</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'following' && styles.activeTab]}
            onPress={() => setActiveTab('following')}
          >
            <FontAwesome 
              name="users" 
              size={22} 
              color={activeTab === 'following' ? "#FFD700" : "#888"} 
            />
            <Text style={[styles.tabText, activeTab === 'following' && styles.activeTabText]}>Following</Text>
          </TouchableOpacity>
        </View>
        
        {/* Content based on active tab */}
        {activeTab === 'posts' ? (
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.postsContainer}
          />
        ) : (
          <FlatList
            data={following}
            renderItem={renderFollowingItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.followingContainer}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    backgroundColor: '#1a1a2e',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  statLabel: {
    color: '#888',
    fontSize: 14,
  },
  profileDetails: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileName: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  profileBio: {
    color: '#FFF',
    marginBottom: 15,
  },
  followButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: '#FFD700',
  },
  followButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  followingButtonText: {
    color: '#000',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#222',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  tabText: {
    color: '#888',
    fontSize: 14,
  },
  activeTabText: {
    color: '#FFD700',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
  },
  postsContainer: {
    paddingBottom: 20,
  },
  postContainer: {
    backgroundColor: '#1a1a2e',
    marginBottom: 15,
    padding: 15,
  },
  postContent: {
    color: '#FFF',
    marginBottom: 10,
    lineHeight: 20,
  },
  mediaContainer: {
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statText: {
    color: '#888',
    fontSize: 12,
  },
  postTime: {
    color: '#888',
    fontSize: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#222',
    paddingVertical: 10,
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  actionText: {
    color: '#888',
    marginLeft: 5,
    fontSize: 14,
  },
  likedAction: {
    color: '#FF3B30',
  },
  commentsSection: {
    paddingTop: 10,
  },
  commentItem: {
    marginBottom: 10,
  },
  commentUsername: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  commentText: {
    color: '#FFF',
  },
  viewMoreComments: {
    color: '#888',
    marginBottom: 10,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222235',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  commentInput: {
    flex: 1,
    color: '#FFF',
  },
  followingContainer: {
    paddingBottom: 20,
  },
  followingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1a1a2e',
    marginBottom: 10,
  },
  followingAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  followingUsername: {
    flex: 1,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default FeedProfile;