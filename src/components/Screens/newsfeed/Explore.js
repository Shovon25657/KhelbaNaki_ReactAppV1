import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput, FlatList, Modal, Animated, Easing } from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons, Feather, AntDesign, Entypo } from '@expo/vector-icons';
import BottomNavBar from '../../common/BottomNavBar';
import * as ImagePicker from 'expo-image-picker';

const Explore = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('trending');
  const [newPostText, setNewPostText] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [currentPostComments, setCurrentPostComments] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCaption, setShareCaption] = useState('');
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [unfollowUser, setUnfollowUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Sample data for posts with state management
  const [trendingPosts, setTrendingPosts] = useState([
    {
      id: '1',
      username: 'ProGamer99',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      time: '2h ago',
      content: 'Just built my dream gaming PC! RTX 4090, i9-13900K, 32GB DDR5. Can\'t wait to test it on Cyberpunk!',
      image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1478&q=80',
      likes: 245,
      comments: [
        { id: '1', username: 'GamerGirl42', text: 'Awesome setup! What case is that?', time: '1h ago' },
        { id: '2', username: 'PCBuilderPro', text: 'Nice specs! How are the temps?', time: '30m ago' }
      ],
      shares: 12,
      isLiked: false,
      isFollowing: false
    },
    {
      id: '2',
      username: 'ConsoleQueen',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      time: '5h ago',
      content: 'Finally got my hands on the new Zelda game! Who else is playing?',
      image: 'https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      likes: 189,
      comments: [
        { id: '1', username: 'LinkFan', text: 'I just started too! The graphics are amazing', time: '4h ago' },
        { id: '2', username: 'ZeldaMaster', text: 'Already 20 hours in. Best game ever!', time: '3h ago' }
      ],
      shares: 8,
      isLiked: true,
      isFollowing: false
    }
  ]);

  const [recentPosts, setRecentPosts] = useState([
    {
      id: '3',
      username: 'EsportsPro',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      time: '30m ago',
      content: 'Just finished streaming Valorant tournament qualifiers! GG to all participants!',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      likes: 87,
      comments: [],
      shares: 5,
      isLiked: false,
      isFollowing: false
    },
    {
      id: '4',
      username: 'IndieDev',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      time: '1h ago',
      content: 'Check out my new indie game demo! Would love your feedback #gamedev #indiedev',
      image: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      likes: 142,
      comments: [
        { id: '1', username: 'GameReviewer', text: 'Looks promising! When is the full release?', time: '45m ago' }
      ],
      shares: 23,
      isLiked: false,
      isFollowing: false
    }
  ]);

  const [followingPosts, setFollowingPosts] = useState([
    {
      id: '5',
      username: 'GamerFriend1',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      time: '2h ago',
      content: 'Finally reached Diamond rank in League of Legends! So pumped!',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      likes: 56,
      comments: [
        { id: '1', username: 'You', text: 'Congrats! Well deserved!', time: '1h ago' }
      ],
      shares: 3,
      isLiked: true,
      isFollowing: true
    },
    {
      id: '6',
      username: 'StreamerPro',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      time: '4h ago',
      content: 'Going live in 30 minutes for some Apex Legends ranked games! Come hang out!',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      likes: 98,
      comments: [],
      shares: 12,
      isLiked: false,
      isFollowing: true
    }
  ]);

  // Sample notifications data
  const notifications = [
    { id: '1', type: 'like', username: 'GamerGirl42', postId: '1', time: '10m ago' },
    { id: '2', type: 'comment', username: 'PCBuilderPro', postId: '1', text: 'Nice setup!', time: '30m ago' },
    { id: '3', type: 'follow', username: 'NewGamer123', time: '1h ago' },
    { id: '4', type: 'share', username: 'ShareMaster', postId: '2', time: '2h ago' },
  ];

  // Show notification with animation
  const showNotification = (message) => {
    setNotificationMessage(message);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setNotificationMessage(null));
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleLike = (postId) => {
    const updatePosts = (posts, setPosts) => {
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      });
      setPosts(updatedPosts);
    };

    updatePosts(trendingPosts, setTrendingPosts);
    updatePosts(recentPosts, setRecentPosts);
    updatePosts(followingPosts, setFollowingPosts);
  };

  const handleFollow = (postId) => {
    const updatePosts = (posts, setPosts) => {
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          const isFollowing = post.isFollowing || false;
          if (isFollowing) {
            setUnfollowUser(post.username);
            setShowUnfollowModal(true);
            return post; // Return unchanged post as we'll handle the unfollow in confirmUnfollow
          } else {
            showNotification(`You followed ${post.username}`);
            return { ...post, isFollowing: true };
          }
        }
        return post;
      });
      setPosts(updatedPosts);
    };

    updatePosts(trendingPosts, setTrendingPosts);
    updatePosts(recentPosts, setRecentPosts);
    updatePosts(followingPosts, setFollowingPosts);
  };

  const confirmUnfollow = () => {
    const updatePosts = (posts, setPosts) => {
      const updatedPosts = posts.map(post => {
        if (post.username === unfollowUser) {
          return { ...post, isFollowing: false };
        }
        return post;
      });
      setPosts(updatedPosts);
    };

    updatePosts(trendingPosts, setTrendingPosts);
    updatePosts(recentPosts, setRecentPosts);
    updatePosts(followingPosts, setFollowingPosts);
    
    setShowUnfollowModal(false);
    showNotification(`You unfollowed ${unfollowUser}`);
  };

  const handleComment = (postId) => {
    const findPost = (posts) => posts.find(p => p.id === postId);
    const post = findPost(trendingPosts) || findPost(recentPosts) || findPost(followingPosts);
    setCurrentPostComments(post.comments);
    setShowComments(true);
  };

  const addComment = () => {
    if (newComment.trim() === '') return;
    
    const updatedComments = [
      ...currentPostComments,
      { id: Date.now().toString(), username: 'You', text: newComment, time: 'Just now' }
    ];
    
    setCurrentPostComments(updatedComments);
    setNewComment('');
    
    // Update the post's comments in all posts arrays
    const updatePosts = (posts, setPosts) => {
      const updatedPosts = posts.map(post => {
        if (post.comments === currentPostComments) {
          return { ...post, comments: updatedComments };
        }
        return post;
      });
      setPosts(updatedPosts);
    };

    updatePosts(trendingPosts, setTrendingPosts);
    updatePosts(recentPosts, setRecentPosts);
    updatePosts(followingPosts, setFollowingPosts);
  };

  const handleShare = (postId) => {
    setShowShareModal(true);
  };

  const confirmShare = () => {
    setShowShareModal(false);
    showNotification("Your post has been shared to your profile");
    setShareCaption('');
  };

  const createPost = () => {
    if (newPostText.trim() === '' && !selectedImage) return;
    
    const newPost = {
      id: Date.now().toString(),
      username: 'You',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      time: 'Just now',
      content: newPostText,
      image: selectedImage,
      likes: 0,
      comments: [],
      shares: 0,
      isLiked: false,
      isFollowing: false
    };
    
    // Add to all feeds
    setTrendingPosts([newPost, ...trendingPosts]);
    setRecentPosts([newPost, ...recentPosts]);
    setFollowingPosts([newPost, ...followingPosts]);
    
    setNewPostText('');
    setSelectedImage(null);
    setShowNewPost(false);
    showNotification("Your post has been published");
  };

  const getCurrentPosts = () => {
    switch (activeTab) {
      case 'trending': return trendingPosts;
      case 'recent': return recentPosts;
      case 'following': return followingPosts;
      default: return trendingPosts;
    }
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('FeedProfile', { user: item })}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        </TouchableOpacity>
        <View style={styles.postUserInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.postTime}>{item.time}</Text>
        </View>
        {activeTab !== 'following' && (
          <TouchableOpacity 
            style={[styles.followButton, item.isFollowing && styles.followingButton]}
            onPress={() => handleFollow(item.id)}
          >
            <Text style={[styles.followButtonText, item.isFollowing && styles.followingButtonText]}>
              {item.isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.postContent}>{item.content}</Text>
      
      {item.image && (
        <View style={styles.mediaContainer}>
          <Image source={{ uri: item.image }} style={styles.postImage} />
          {item.video && (
            <View style={styles.playButton}>
              <Ionicons name="play" size={30} color="white" />
            </View>
          )}
        </View>
      )}
      
      <View style={styles.postStats}>
        <Text style={styles.statText}>{item.likes} likes</Text>
        <Text style={styles.statText}>{item.comments.length} comments</Text>
        <Text style={styles.statText}>{item.shares} shares</Text>
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
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleComment(item.id)}
        >
          <Feather name="message-circle" size={20} color="#666" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleShare(item.id)}
        >
          <Feather name="share-2" size={20} color="#666" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationIcon}>
        {item.type === 'like' && <AntDesign name="heart" size={20} color="#FF3B30" />}
        {item.type === 'comment' && <Feather name="message-circle" size={20} color="#FFD700" />}
        {item.type === 'follow' && <FontAwesome name="user-plus" size={18} color="#4CAF50" />}
        {item.type === 'share' && <Feather name="share-2" size={20} color="#2196F3" />}
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>
          <Text style={styles.notificationUsername}>{item.username}</Text>
          {item.type === 'like' && ' liked your post'}
          {item.type === 'comment' && ` commented: "${item.text}"`}
          {item.type === 'follow' && ' started following you'}
          {item.type === 'share' && ' shared your post'}
        </Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('FeedProfile')}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} 
            style={styles.profileIcon} 
          />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Explore</Text>
        
        <TouchableOpacity onPress={() => setShowNotifications(true)}>
          <Ionicons name="notifications" size={24} color="#FFF" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'trending' && styles.activeTab]}
          onPress={() => setActiveTab('trending')}
        >
          <Text style={[styles.tabText, activeTab === 'trending' && styles.activeTabText]}>Trending</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
          onPress={() => setActiveTab('recent')}
        >
          <Text style={[styles.tabText, activeTab === 'recent' && styles.activeTabText]}>Recent</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'following' && styles.activeTab]}
          onPress={() => setActiveTab('following')}
        >
          <Text style={[styles.tabText, activeTab === 'following' && styles.activeTabText]}>Following</Text>
        </TouchableOpacity>
      </View>
      
      {/* Posts Feed */}
      <FlatList
        data={getCurrentPosts()}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.feedContainer}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Create Post Button */}
      <Animated.View style={[styles.createPostButton, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity 
          onPress={() => {
            animateButton();
            setShowNewPost(true);
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={28} color="#FFF" style={styles.plusIcon} />
        </TouchableOpacity>
      </Animated.View>
      
      {/* Notification Toast */}
      {notificationMessage && (
        <Animated.View style={[styles.notificationToast, { opacity: fadeAnim }]}>
          <Text style={styles.notificationToastText}>{notificationMessage}</Text>
        </Animated.View>
      )}
      
      {/* New Post Modal */}
      <Modal
        visible={showNewPost}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNewPost(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.newPostModal}>
            <View style={styles.newPostHeader}>
              <Text style={styles.newPostTitle}>Create Post</Text>
              <TouchableOpacity onPress={() => {
                setShowNewPost(false);
                setSelectedImage(null);
                setNewPostText('');
              }}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.postInput}
              placeholder="What's on your mind?"
              placeholderTextColor="#888"
              multiline
              value={newPostText}
              onChangeText={setNewPostText}
            />
            
            {selectedImage && (
              <View style={styles.selectedImageContainer}>
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <Ionicons name="close" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.postOptions}>
              <TouchableOpacity style={styles.postOption} onPress={pickImage}>
                <Ionicons name="image" size={24} color="#FFD700" />
                <Text style={styles.postOptionText}>Photo/Video</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.postOption}>
                <Ionicons name="happy" size={24} color="#FFD700" />
                <Text style={styles.postOptionText}>Feeling</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.postButton, (!newPostText && !selectedImage) && styles.disabledButton]}
              onPress={createPost}
              disabled={!newPostText && !selectedImage}
            >
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Comments Modal */}
      <Modal
        visible={showComments}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowComments(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.commentsModal}>
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>Comments</Text>
              <TouchableOpacity onPress={() => setShowComments(false)}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.commentsList}>
              {currentPostComments?.map(comment => (
                <View key={comment.id} style={styles.commentItem}>
                  <Image 
                    source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} 
                    style={styles.commentAvatar} 
                  />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentUsername}>{comment.username}</Text>
                    <Text style={styles.commentText}>{comment.text}</Text>
                    <Text style={styles.commentTime}>{comment.time}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                placeholderTextColor="#888"
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity 
                style={styles.commentButton}
                onPress={addComment}
              >
                <Ionicons name="send" size={20} color="#FFD700" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.shareModal}>
            <Text style={styles.shareTitle}>Share Post</Text>
            <TextInput
              style={styles.shareInput}
              placeholder="Add a caption (optional)"
              placeholderTextColor="#888"
              multiline
              value={shareCaption}
              onChangeText={setShareCaption}
            />
            <View style={styles.shareButtons}>
              <TouchableOpacity 
                style={styles.shareCancelButton}
                onPress={() => setShowShareModal(false)}
              >
                <Text style={styles.shareCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.shareConfirmButton}
                onPress={confirmShare}
              >
                <Text style={styles.shareConfirmButtonText}>Share Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Unfollow Modal */}
      <Modal
        visible={showUnfollowModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowUnfollowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.unfollowModal}>
            <Text style={styles.unfollowTitle}>Unfollow {unfollowUser}?</Text>
            <Text style={styles.unfollowText}>Their posts will no longer show up in your feed. You can still view their profile.</Text>
            <View style={styles.unfollowButtons}>
              <TouchableOpacity 
                style={styles.unfollowCancelButton}
                onPress={() => setShowUnfollowModal(false)}
              >
                <Text style={styles.unfollowCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.unfollowConfirmButton}
                onPress={confirmUnfollow}
              >
                <Text style={styles.unfollowConfirmButtonText}>Unfollow</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Notifications Modal */}
      <Modal
        visible={showNotifications}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.notificationsModal}>
            <View style={styles.notificationsHeader}>
              <Text style={styles.notificationsTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={notifications}
              renderItem={renderNotification}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.notificationsList}
            />
          </View>
        </View>
      </Modal>
      
      {/* Bottom Navigation */}
      <BottomNavBar />
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
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  notificationBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#FF3B30',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    backgroundColor: '#1a1a2e',
  },
  tab: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
  },
  tabText: {
    color: '#888',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFD700',
  },
  createPostButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  plusIcon: {
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  notificationToast: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  notificationToastText: {
    color: '#FFF',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  newPostModal: {
    width: '90%',
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 15,
  },
  newPostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  newPostTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  postInput: {
    backgroundColor: '#222235',
    borderRadius: 8,
    padding: 15,
    color: '#FFF',
    minHeight: 100,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  postOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  postOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postOptionText: {
    color: '#FFF',
    marginLeft: 5,
  },
  postButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  postButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  selectedImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedContainer: {
    paddingBottom: 70,
  },
  postContainer: {
    backgroundColor: '#1a1a2e',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postUserInfo: {
    flex: 1,
  },
  username: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  postTime: {
    color: '#888',
    fontSize: 12,
  },
  followButton: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  followingButton: {
    backgroundColor: '#FFD700',
  },
  followButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  followingButtonText: {
    color: '#000',
  },
  postContent: {
    color: '#FFF',
    marginBottom: 10,
    lineHeight: 20,
  },
  mediaContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  statText: {
    color: '#888',
    fontSize: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: 10,
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
  commentsModal: {
    width: '90%',
    height: '70%',
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 15,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  commentsTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentsList: {
    flex: 1,
    marginBottom: 15,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
    backgroundColor: '#222235',
    borderRadius: 10,
    padding: 10,
  },
  commentUsername: {
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentText: {
    color: '#FFF',
    marginBottom: 5,
  },
  commentTime: {
    color: '#888',
    fontSize: 12,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#222235',
    borderRadius: 20,
    padding: 10,
    color: '#FFF',
    paddingLeft: 15,
  },
  commentButton: {
    marginLeft: 10,
  },
  shareModal: {
    width: '80%',
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 20,
  },
  shareTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  shareInput: {
    backgroundColor: '#222235',
    borderRadius: 8,
    padding: 15,
    color: '#FFF',
    minHeight: 100,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  shareButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareCancelButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  shareCancelButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  shareConfirmButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    alignItems: 'center',
  },
  shareConfirmButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  unfollowModal: {
    width: '80%',
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 20,
  },
  unfollowTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  unfollowText: {
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  unfollowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  unfollowCancelButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  unfollowCancelButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  unfollowConfirmButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    alignItems: 'center',
  },
  unfollowConfirmButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  notificationsModal: {
    width: '90%',
    height: '80%',
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 15,
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  notificationsTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationsList: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222235',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    color: '#FFF',
    marginBottom: 5,
  },
  notificationUsername: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  notificationTime: {
    color: '#888',
    fontSize: 12,
  },
});

export default Explore;