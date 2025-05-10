import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';

const Post = ({ post, onLike, onComment, onShare, onFollow, currentUserId, navigation }) => {
  const isLiked = post.likes.includes(currentUserId);
  const isFollowing = post.user.followers.includes(currentUserId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile', { user: post.user })}>
          <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.user.username}</Text>
          <Text style={styles.timeAgo}>{new Date(post.timestamp).toLocaleString()}</Text>
        </View>
        {post.user.id !== currentUserId && (
          <TouchableOpacity
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={() => onFollow(post.user.id)}
          >
            <Text style={[styles.followText, isFollowing && styles.followingText]}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.content}>{post.content}</Text>

      {post.media && (
        <Image source={{ uri: post.media }} style={styles.media} />
      )}

      <View style={styles.stats}>
        <Text style={styles.stat}>{post.likes.length} likes</Text>
        <Text style={styles.stat}>{post.comments.length} comments</Text>
        <Text style={styles.stat}>{post.shares} shares</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.action} onPress={() => onLike(post.id)}>
          <AntDesign name={isLiked ? "heart" : "hearto"} size={20} color={isLiked ? "#FF3B30" : "#666"} />
          <Text style={[styles.actionText, isLiked && styles.likedText]}>Like</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.action} onPress={() => onComment(post)}>
          <Feather name="message-circle" size={20} color="#666" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.action} onPress={() => onShare(post)}>
          <Feather name="share-2" size={20} color="#666" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e',
    marginVertical: 8,
    borderRadius: 10,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: '#FFF',
    fontWeight: '600',
  },
  timeAgo: {
    color: '#888',
    fontSize: 12,
  },
  followButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
  },
  followingButton: {
    backgroundColor: '#FFD700',
  },
  followText: {
    color: '#FFF',
    fontSize: 14,
  },
  followingText: {
    color: '#000',
  },
  content: {
    color: '#FFF',
    marginBottom: 12,
    lineHeight: 20,
  },
  media: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  stat: {
    color: '#888',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: 12,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: '#888',
    marginLeft: 6,
  },
  likedText: {
    color: '#FF3B30',
  },
});

export default Post;