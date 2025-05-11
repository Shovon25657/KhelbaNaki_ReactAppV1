import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CommentsModal = ({
  visible,
  comments,
  newComment,
  onCommentChange,
  onSubmitComment,
  onClose,
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent
    onRequestClose={onClose}
  >
    <View style={styles.container}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>Comments</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={comments}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.comment}>
              <Text style={styles.commentUser}>{item.user.username}</Text>
              <Text style={styles.commentText}>{item.text}</Text>
            </View>
          )}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor="#888"
            value={newComment}
            onChangeText={onCommentChange}
          />
          <TouchableOpacity onPress={onSubmitComment}>
            <Ionicons name="send" size={24} color="#FFD700" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#1a1a2e',
    marginHorizontal: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  comment: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  commentUser: {
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentText: {
    color: '#FFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#222235',
    borderRadius: 20,
    padding: 12,
    color: '#FFF',
    marginRight: 12,
  },
});

export default CommentsModal;