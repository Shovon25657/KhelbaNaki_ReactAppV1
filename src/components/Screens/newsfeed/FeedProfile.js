import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  FlatList, 
  TextInput,
  Modal,
  Animated,
  Alert
} from 'react-native';
import { Ionicons, FontAwesome, Feather, AntDesign } from '@expo/vector-icons';

const FeedProfile = ({ route, navigation }) => {
  // Default user data
  const defaultUser = {
    id: '1',
    username: 'ProGamer99',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    followers: 1245,
    following: 342,
    posts: 56,
    isFollowing: false,
    isPrivate: false
  };

  // Use passed user or default
  const user = route.params?.user || defaultUser;

  // State management
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [isPrivate, setIsPrivate] = useState(user.isPrivate || false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [confirmDeactivateVisible, setConfirmDeactivateVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [followersModalVisible, setFollowersModalVisible] = useState(false);
  const [followingModalVisible, setFollowingModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showCommentsForPost, setShowCommentsForPost] = useState(null);
  const [replyToComment, setReplyToComment] = useState(null);
  const [selectedFollower, setSelectedFollower] = useState(null);
  const [selectedFollowing, setSelectedFollowing] = useState(null);

  // Animations
  const menuSlideAnimation = useRef(new Animated.Value(-300)).current;
  const followerSlideAnimation = useRef(new Animated.Value(500)).current;
  const followingSlideAnimation = useRef(new Animated.Value(500)).current;

  // Sample posts data
  const [posts, setPosts] = useState([
    {
      id: '1',
      content: 'Just built my dream gaming PC! RTX 4090, i9-13900K, 32GB DDR5. Can\'t wait to test it on Cyberpunk!',
      image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1478&q=80',
      likes: 245,
      comments: [
        { id: '1', username: 'GamerGirl42', text: 'Awesome setup! What case is that?', time: '1h ago', replies: [] },
        { id: '2', username: 'PCBuilderPro', text: 'Nice specs! How are the temps?', time: '30m ago', replies: [] }
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
        { id: '1', username: 'LinkFan', text: 'I just started too! The graphics are amazing', time: '4h ago', replies: [] }
      ],
      shares: 8,
      time: '5h ago',
      isLiked: true
    },
  ]);

  // Sample followers data
  const [followers] = useState([
    { id: '1', username: 'GameFanatic', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
    { id: '2', username: 'ConsoleQueen', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: '3', username: 'RetroGamer', avatar: 'https://randomuser.me/api/portraits/men/23.jpg' },
    { id: '4', username: 'GamerGirl42', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
    { id: '5', username: 'PCBuilderPro', avatar: 'https://randomuser.me/api/portraits/men/68.jpg' },
  ]);

  // Sample following data
  const [following] = useState([
    { id: '1', username: 'ConsoleQueen', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: '2', username: 'EsportsPro', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
    { id: '3', username: 'GamerGirl42', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
    { id: '4', username: 'PCBuilderPro', avatar: 'https://randomuser.me/api/portraits/men/68.jpg' },
  ]);

  // Handle menu opening
  const showMenu = () => {
    setMenuVisible(true);
    Animated.timing(menuSlideAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Handle menu closing
  const hideMenu = () => {
    Animated.timing(menuSlideAnimation, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
    });
  };

  // Show followers modal with animation
  const showFollowersModal = () => {
    setFollowersModalVisible(true);
    Animated.timing(followerSlideAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Hide followers modal with animation
  const hideFollowersModal = () => {
    Animated.timing(followerSlideAnimation, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setFollowersModalVisible(false);
    });
  };

  // Show following modal with animation
  const showFollowingModal = () => {
    setFollowingModalVisible(true);
    Animated.timing(followingSlideAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Hide following modal with animation
  const hideFollowingModal = () => {
    Animated.timing(followingSlideAnimation, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setFollowingModalVisible(false);
    });
  };

  // Handle post like
  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newIsLiked = !post.isLiked;
        return {
          ...post,
          isLiked: newIsLiked,
          likes: newIsLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  // Toggle comment visibility
  const toggleComments = (postId) => {
    setShowCommentsForPost(showCommentsForPost === postId ? null : postId);
    setReplyToComment(null);
  };

  // Set up to reply to a comment
  const handleReplySetup = (postId, commentId) => {
    setShowCommentsForPost(postId);
    setReplyToComment(commentId);
  };

  // Add comment to post
  const addComment = (postId) => {
    if (newComment.trim() === '') return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        if (replyToComment) {
          // Add reply to a specific comment
          const updatedComments = post.comments.map(comment => {
            if (comment.id === replyToComment) {
              return {
                ...comment,
                replies: [
                  ...comment.replies,
                  {
                    id: Date.now().toString(),
                    username: 'ProGamer99', // Current user
                    text: newComment,
                    time: 'Just now'
                  }
                ]
              };
            }
            return comment;
          });

          return { ...post, comments: updatedComments };
        } else {
          // Add new comment to the post
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: Date.now().toString(),
                username: 'ProGamer99', // Current user
                text: newComment,
                time: 'Just now',
                replies: []
              }
            ]
          };
        }
      }
      return post;
    }));

    setNewComment('');
    setReplyToComment(null);
  };

  // Handle removing a follower
  const handleRemoveFollower = (follower) => {
    setSelectedFollower(follower);
  };

  const confirmRemoveFollower = () => {
    console.log(`Removed follower ${selectedFollower.id}`);
    setSelectedFollower(null);
  };

  // Handle unfollowing a user
  const handleUnfollowUser = (user) => {
    setSelectedFollowing(user);
  };

  const confirmUnfollowUser = () => {
    console.log(`Unfollowed user ${selectedFollowing.id}`);
    setSelectedFollowing(null);
  };

  // Toggle private/public profile
  const togglePrivacy = (isPrivateMode) => {
    setIsPrivate(isPrivateMode);
    setPrivacyModalVisible(false);
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
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => toggleComments(item.id)}
        >
          <Feather name="message-circle" size={20} color="#666" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="share-2" size={20} color="#666" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
      
      {/* Comments section - only shown when toggled */}
      {showCommentsForPost === item.id && (
        <View style={styles.commentsSection}>
          {item.comments.map(comment => (
            <View key={comment.id} style={styles.commentItem}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentUsername}>{comment.username}</Text>
                <Text style={styles.commentTime}>{comment.time}</Text>
              </View>
              <Text style={styles.commentText}>{comment.text}</Text>
              
              <TouchableOpacity 
                style={styles.replyButton}
                onPress={() => handleReplySetup(item.id, comment.id)}
              >
                <Text style={styles.replyButtonText}>Reply</Text>
              </TouchableOpacity>

              {/* Display replies if any */}
              {comment.replies.length > 0 && (
                <View style={styles.repliesContainer}>
                  {comment.replies.map(reply => (
                    <View key={reply.id} style={styles.replyItem}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentUsername}>{reply.username}</Text>
                        <Text style={styles.commentTime}>{reply.time}</Text>
                      </View>
                      <Text style={styles.commentText}>{reply.text}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
          
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder={replyToComment ? "Write a reply..." : "Write a comment..."}
              placeholderTextColor="#888"
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity onPress={() => addComment(item.id)}>
              <Ionicons name="send" size={20} color="#FFD700" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  // Render follower item
  const renderFollowerItem = ({ item }) => (
    <View style={styles.followItem}>
      <Image source={{ uri: item.avatar }} style={styles.followAvatar} />
      <Text style={styles.followUsername}>{item.username}</Text>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemoveFollower(item)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  // Render following item
  const renderFollowingItem = ({ item }) => (
    <View style={styles.followItem}>
      <Image source={{ uri: item.avatar }} style={styles.followAvatar} />
      <Text style={styles.followUsername}>{item.username}</Text>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleUnfollowUser(item)}
      >
        <Text style={styles.removeButtonText}>Unfollow</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.username}</Text>
        <TouchableOpacity onPress={showMenu}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <ScrollView>
        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <Image source={{ uri: user.avatar }} style={styles.profileAvatar} />
          
          <View style={styles.statsContainer}>
            {/* <View style={styles.statItem}>
              <Text style={styles.statNumber}>{posts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View> */}
            <TouchableOpacity style={styles.statItem} onPress={showFollowersModal}>
              <Text style={styles.statNumber}>{user.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={showFollowingModal}>
              <Text style={styles.statNumber}>{user.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>{user.username}</Text>
          {isPrivate && (
            <View style={styles.privacyBadge}>
              <Ionicons name="lock-closed" size={12} color="#FFF" />
              <Text style={styles.privacyBadgeText}>Private</Text>
            </View>
          )}
        </View>
        
        {/* Posts Content */}
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.postsContainer}
        />
      </ScrollView>

      {/* Three-Dot Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideMenu}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={hideMenu}
        >
          <Animated.View 
            style={[
              styles.menuContainer, 
              { transform: [{ translateX: menuSlideAnimation }] }
            ]}
          >
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                hideMenu();
                setConfirmDeactivateVisible(true);
              }}
            >
              <Ionicons name="pause-circle-outline" size={24} color="#FF9500" />
              <Text style={styles.menuItemText}>Deactivate Account</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                hideMenu();
                setConfirmDeleteVisible(true);
              }}
            >
              <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              <Text style={styles.menuItemText}>Delete Account</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                hideMenu();
                setPrivacyModalVisible(true);
              }}
            >
              <Ionicons name={isPrivate ? "lock-closed-outline" : "lock-open-outline"} size={24} color="#5AC8FA" />
              <Text style={styles.menuItemText}>Profile Mode</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Deactivate Account Confirmation Modal */}
      <Modal
        visible={confirmDeactivateVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmDeactivateVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmContainer}>
            <View style={[styles.confirmHeader, { backgroundColor: '#FF9500' }]}>
              <Text style={styles.confirmTitle}>Deactivate Account</Text>
            </View>
            
            <View style={styles.confirmGrid}>
              <View style={[styles.gridItem, { backgroundColor: '#1a1a2e' }]}>
                <Text style={styles.gridText}>Your profile will be hidden</Text>
              </View>
              <View style={[styles.gridItem, { backgroundColor: '#222' }]}>
                <Text style={styles.gridText}>You can reactivate anytime</Text>
              </View>
            </View>
            
            <View style={styles.confirmActions}>
              <TouchableOpacity 
                style={[styles.confirmButton, styles.cancelButton]}
                onPress={() => setConfirmDeactivateVisible(false)}
              >
                <Text style={styles.confirmButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.confirmButton, styles.dangerButton]}
                onPress={() => {
                  setConfirmDeactivateVisible(false);
                  console.log("Account deactivated");
                }}
              >
                <Text style={styles.confirmButtonText}>Deactivate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={confirmDeleteVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmDeleteVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmContainer}>
            <View style={[styles.confirmHeader, { backgroundColor: '#FF3B30' }]}>
              <Text style={styles.confirmTitle}>Delete Account</Text>
            </View>
            
            <View style={styles.confirmGrid}>
              <View style={[styles.gridItem, { backgroundColor: '#1a1a2e' }]}>
                <Text style={styles.gridText}>All data will be deleted</Text>
              </View>
              <View style={[styles.gridItem, { backgroundColor: '#222' }]}>
                <Text style={styles.gridText}>This action cannot be undone</Text>
              </View>
            </View>
            
            <View style={styles.confirmActions}>
              <TouchableOpacity 
                style={[styles.confirmButton, styles.cancelButton]}
                onPress={() => setConfirmDeleteVisible(false)}
              >
                <Text style={styles.confirmButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.confirmButton, styles.dangerButton]}
                onPress={() => {
                  setConfirmDeleteVisible(false);
                  console.log("Account deleted");
                }}
              >
                <Text style={styles.confirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Privacy Choice Modal */}
      <Modal
        visible={privacyModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.privacyContainer}>
            <Text style={styles.privacyTitle}>Choose Profile Mode</Text>
            
            <TouchableOpacity 
              style={[styles.privacyOption, !isPrivate && styles.selectedPrivacyOption]}
              onPress={() => togglePrivacy(false)}
            >
              <Ionicons name="globe-outline" size={32} color={!isPrivate ? "#FFD700" : "#888"} />
              <View style={styles.privacyTextContainer}>
                <Text style={[styles.privacyOptionTitle, !isPrivate && styles.selectedPrivacyText]}>Public</Text>
                <Text style={styles.privacyOptionDesc}>Anyone can see your profile and posts</Text>
              </View>
              {!isPrivate && <Ionicons name="checkmark-circle" size={24} color="#FFD700" />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.privacyOption, isPrivate && styles.selectedPrivacyOption]}
              onPress={() => togglePrivacy(true)}
            >
              <Ionicons name="lock-closed-outline" size={32} color={isPrivate ? "#FFD700" : "#888"} />
              <View style={styles.privacyTextContainer}>
                <Text style={[styles.privacyOptionTitle, isPrivate && styles.selectedPrivacyText]}>Private</Text>
                <Text style={styles.privacyOptionDesc}>Only approved followers can see your content</Text>
              </View>
              {isPrivate && <Ionicons name="checkmark-circle" size={24} color="#FFD700" />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setPrivacyModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Followers Modal */}
      <Modal
        visible={followersModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideFollowersModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.followersContainer,
              { transform: [{ translateY: followerSlideAnimation }] }
            ]}
          >
            <View style={styles.followersHeader}>
              <Text style={styles.followersTitle}>Followers</Text>
              <TouchableOpacity onPress={hideFollowersModal}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={followers}
              renderItem={renderFollowerItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.followersContent}
            />
          </Animated.View>
        </View>
      </Modal>

      {/* Remove Follower Confirmation Modal */}
      <Modal
        visible={!!selectedFollower}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedFollower(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmContainer}>
            <View style={[styles.confirmHeader, { backgroundColor: '#FF3B30' }]}>
              <Text style={styles.confirmTitle}>Remove Follower</Text>
            </View>
            
            <View style={styles.confirmGrid}>
              <View style={[styles.gridItem, { backgroundColor: '#1a1a2e' }]}>
                <Text style={styles.gridText}>Remove {selectedFollower?.username}?</Text>
              </View>
              <View style={[styles.gridItem, { backgroundColor: '#222' }]}>
                <Text style={styles.gridText}>They won't be able to see your posts</Text>
              </View>
            </View>
            
            <View style={styles.confirmActions}>
              <TouchableOpacity 
                style={[styles.confirmButton, styles.cancelButton]}
                onPress={() => setSelectedFollower(null)}
              >
                <Text style={styles.confirmButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.confirmButton, styles.dangerButton]}
                onPress={confirmRemoveFollower}
              >
                <Text style={styles.confirmButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Following Modal */}
      <Modal
        visible={followingModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideFollowingModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.followersContainer,
              { transform: [{ translateY: followingSlideAnimation }] }
            ]}
          >
            <View style={styles.followersHeader}>
              <Text style={styles.followersTitle}>Following</Text>
              <TouchableOpacity onPress={hideFollowingModal}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={following}
              renderItem={renderFollowingItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.followersContent}
            />
          </Animated.View>
        </View>
      </Modal>

      {/* Unfollow User Confirmation Modal */}
      <Modal
        visible={!!selectedFollowing}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedFollowing(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmContainer}>
            <View style={[styles.confirmHeader, { backgroundColor: '#FF3B30' }]}>
              <Text style={styles.confirmTitle}>Unfollow User</Text>
            </View>
            
            <View style={styles.confirmGrid}>
              <View style={[styles.gridItem, { backgroundColor: '#1a1a2e' }]}>
                <Text style={styles.gridText}>Unfollow {selectedFollowing?.username}?</Text>
              </View>
              <View style={[styles.gridItem, { backgroundColor: '#222' }]}>
                <Text style={styles.gridText}>You won't see their posts anymore</Text>
              </View>
            </View>
            
            <View style={styles.confirmActions}>
              <TouchableOpacity 
                style={[styles.confirmButton, styles.cancelButton]}
                onPress={() => setSelectedFollowing(null)}
              >
                <Text style={styles.confirmButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.confirmButton, styles.dangerButton]}
                onPress={confirmUnfollowUser}
              >
                <Text style={styles.confirmButtonText}>Unfollow</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
    backgroundColor: 'rgb(14, 3, 52)',
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
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgb(1, 225, 255)',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    color: 'rgb(1, 225, 255)',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  privacyBadgeText: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 3,
  },
  postsContainer: {
    paddingBottom: 20,
  },
  postContainer: {
    backgroundColor: 'rgb(1, 2, 23)',
    borderWidth: 1,
    borderColor: '#0f3460',
      marginHorizontal: 5,
      marginVertical: 10,
      borderRadius: 10,
      padding: 15,
  },
  postContent: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 10,
  },
  mediaContainer: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statText: {
    color: '#888',
    fontSize: 14,
  },
  postTime: {
    color: '#555',
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
  },
  actionText: {
    color: '#666',
    marginLeft: 5,
  },
  likedAction: {
    color: '#FF3B30',
  },
  commentsSection: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: 10,
  },
  commentItem: {
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  commentUsername: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  commentTime: {
    color: '#555',
    fontSize: 12,
  },
  commentText: {
    color: '#FFF',
    fontSize: 14,
  },
  replyButton: {
    marginTop: 5,
  },
  replyButtonText: {
    color: '#888',
    fontSize: 12,
  },
  repliesContainer: {
    marginLeft: 15,
    marginTop: 5,
    borderLeftWidth: 2,
    borderLeftColor: '#333',
    paddingLeft: 10,
  },
  replyItem: {
    marginBottom: 5,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#222',
    color: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: '#1a1a2e',
    padding: 20,
    paddingTop: 50,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  menuItemText: {
    color: '#FFF',
    marginLeft: 15,
    fontSize: 16,
  },
  confirmContainer: {
    backgroundColor: '#1a1a2e',
    margin: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  confirmHeader: {
    padding: 15,
  },
  confirmTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '50%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  gridText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 14,
  },
  confirmText: {
    color: '#FFF',
    padding: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  confirmActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  confirmButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  confirmButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  privacyContainer: {
    backgroundColor: '#1a1a2e',
    margin: 20,
    borderRadius: 10,
    padding: 20,
  },
  privacyTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#222',
  },
  selectedPrivacyOption: {
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  privacyTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  privacyOptionTitle: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectedPrivacyText: {
    color: '#FFD700',
  },
  privacyOptionDesc: {
    color: '#555',
    fontSize: 12,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  closeButtonText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  followersContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    maxHeight: '80%',
  },
  followersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  followersTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  followersContent: {
    padding: 15,
  },
  followItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  followAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  followUsername: {
    color: '#FFF',
    flex: 1,
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
});

export default FeedProfile;