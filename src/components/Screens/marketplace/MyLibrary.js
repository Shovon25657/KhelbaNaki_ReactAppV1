import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Linking,
  Modal,
  TextInput,
} from 'react-native';
import { Feather, FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

// Mock purchased courses data
const purchasedCourses = [
  {
    id: '1',
    title: 'Valorant Radiant Level Coaching',
    instructor: 'ValorantPro',
    price: '$25',
    image: require('../../../../assets/game1.png'),
    purchaseDate: 'Purchased on May 15, 2023',
    status: 'Completed',
    videos: [
      { id: '1', title: 'Introduction to Valorant', youtubeId: 'e_E9W2vsRbQ' },
      { id: '2', title: 'Aim Training Fundamentals', youtubeId: 'h7MYJghRWt0' },
      { id: '3', title: 'Advanced Movement Techniques', youtubeId: 'WIXN-0u7W7I' },
    ],
    description: 'Master Valorant with this comprehensive coaching program designed to take you from beginner to Radiant level. Learn advanced strategies, aim techniques, and game sense from a professional player.',
    instructorContact: '@ValorantProCoach',
  },
  {
    id: '2',
    title: 'Advanced Aim Training Program',
    instructor: 'AimMaster',
    price: '$18',
    image: require('../../../../assets/game2.png'),
    purchaseDate: 'Purchased on April 28, 2023',
    status: 'In Progress',
    videos: [
      { id: '1', title: 'Crosshair Placement', youtubeId: 'TZqMiQN5Tqk' },
      { id: '2', title: 'Flick Shot Techniques', youtubeId: 'WIXN-0u7W7I' },
    ],
    description: 'Transform your aim with scientifically proven techniques used by professional esports players. This program will help you develop muscle memory and precision.',
    instructorContact: '@AimMasterOfficial',
  },
  {
    id: '3',
    title: 'Team Strategy & Communication',
    instructor: 'TeamCaptain',
    price: '$30',
    image: require('../../../../assets/game3.png'),
    purchaseDate: 'Purchased on March 10, 2023',
    status: 'Not Started',
    videos: [
      { id: '1', title: 'Effective Callouts', youtubeId: 'e_E9W2vsRbQ' },
      { id: '2', title: 'Team Composition', youtubeId: 'h7MYJghRWt0' },
      { id: '3', title: 'Post-Round Analysis', youtubeId: 'TZqMiQN5Tqk' },
    ],
    description: 'Learn how to lead your team to victory with advanced communication strategies and game sense. Perfect for IGLs and competitive players.',
    instructorContact: '@TeamCaptainCoach',
  },
];

const MyLibrary = () => {
  const navigation = useNavigation();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [message, setMessage] = useState('');
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const scrollViewRef = useRef();

  const handleBackPress = () => {
    if (selectedCourse) {
      setSelectedCourse(null);
      setSelectedVideo(null);
    } else {
      navigation.goBack();
    }
  };

  const handleCoursePress = (course) => {
    setSelectedCourse(course);
    setSelectedVideo(course.videos[0]);
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, { text: message, sent: true }]);
      setMessage('');
      // Simulate reply after 1 second
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          text: `Thanks for your message! I'll get back to you soon. - ${selectedCourse.instructor}`,
          sent: false 
        }]);
      }, 1000);
    }
  };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.courseItem}
      onPress={() => handleCoursePress(item)}
    >
      <Image source={item.image} style={styles.courseImage} />
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.courseInstructor}>by {item.instructor}</Text>
        <Text style={styles.coursePrice}>{item.price}</Text>
        <View style={styles.courseMeta}>
          <Text style={styles.courseDate}>{item.purchaseDate}</Text>
          <View style={[
            styles.statusBadge,
            item.status === 'Completed' && styles.completedBadge,
            item.status === 'In Progress' && styles.inProgressBadge,
            item.status === 'Not Started' && styles.notStartedBadge,
          ]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.videoItem,
        selectedVideo?.id === item.id && styles.selectedVideoItem
      ]}
      onPress={() => handleVideoSelect(item)}
    >
      <MaterialIcons name="play-circle-outline" size={24} color="rgb(1, 225, 255)" />
      <Text style={styles.videoTitle} numberOfLines={1}>{item.title}</Text>
    </TouchableOpacity>
  );

  if (selectedCourse) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="rgb(1, 225, 255)" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{selectedCourse.title}</Text>
          <TouchableOpacity 
            onPress={() => setIsChatModalVisible(true)}
            style={styles.chatButton}
          >
            <Ionicons name="chatbubble-ellipses" size={24} color="rgb(1, 225, 255)" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.courseViewContainer}>
            {/* Video Player */}
            <View style={styles.videoContainer}>
              <WebView
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{ uri: `https://www.youtube.com/embed/${selectedVideo?.youtubeId}?rel=0&autoplay=0&showinfo=0&controls=1` }}
                allowsFullscreenVideo={false}
              />
            </View>

            {/* Video Info */}
            <View style={styles.videoInfoContainer}>
              <Text style={styles.currentVideoTitle}>{selectedVideo?.title}</Text>
              <Text style={styles.courseDescription}>{selectedCourse.description}</Text>
            </View>

            {/* Video List */}
            <View style={styles.videoListContainer}>
              <Text style={styles.sectionTitle}>Course Videos</Text>
              <FlatList
                data={selectedCourse.videos}
                renderItem={renderVideoItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.videoList}
              />
            </View>

            {/* Course Progress */}
            <View style={styles.progressContainer}>
              <Text style={styles.sectionTitle}>Your Progress</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: selectedCourse.status === 'Completed' ? '100%' : 
                            selectedCourse.status === 'In Progress' ? '50%' : '0%' 
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {selectedCourse.status === 'Completed' ? 'Course Completed!' : 
                 selectedCourse.status === 'In Progress' ? 'Halfway There!' : 'Get Started!'}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Chat Modal */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={isChatModalVisible}
          onRequestClose={() => setIsChatModalVisible(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={() => setIsChatModalVisible(false)}
                style={styles.modalBackButton}
              >
                <Feather name="arrow-left" size={24} color="rgb(1, 225, 255)" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Chat with {selectedCourse.instructor}</Text>
            </View>

            <ScrollView 
              style={styles.chatContainer}
              contentContainerStyle={styles.chatContent}
              ref={scrollViewRef}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {chatMessages.map((msg, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.messageBubble,
                    msg.sent ? styles.sentMessage : styles.receivedMessage
                  ]}
                >
                  <Text style={styles.messageText}>{msg.text}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.messageInputContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="Type your message..."
                placeholderTextColor="#888"
                value={message}
                onChangeText={setMessage}
                multiline
              />
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleSendMessage}
              >
                <Feather name="send" size={24} color="rgb(1, 225, 255)" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="rgb(1, 225, 255)" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Library</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Purchased Courses</Text>
          
          {purchasedCourses.length > 0 ? (
            <FlatList
              data={purchasedCourses}
              renderItem={renderCourseItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.courseList}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Feather name="book" size={48} color="rgb(1, 225, 255)" />
              <Text style={styles.emptyText}>You haven't purchased any courses yet</Text>
              <TouchableOpacity 
                style={styles.browseButton}
                onPress={() => navigation.navigate('MarketPlace')}
              >
                <Text style={styles.browseButtonText}>Browse Courses</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
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
  backButton: {
    padding: 5,
  },
  chatButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  placeholderButton: {
    width: 34,
    height: 34,
  },
  contentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(1, 225, 255)',
    marginBottom: 16,
  },
  courseList: {
    paddingBottom: 20,
  },
  courseItem: {
    backgroundColor: '#1e1e2d',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#2a2a3a',
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
  },
  coursePrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'rgb(1, 225, 255)',
    marginBottom: 6,
  },
  courseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseDate: {
    fontSize: 12,
    color: '#888',
  },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  completedBadge: {
    backgroundColor: 'rgba(0, 200, 83, 0.2)',
  },
  inProgressBadge: {
    backgroundColor: 'rgba(255, 171, 0, 0.2)',
  },
  notStartedBadge: {
    backgroundColor: 'rgba(255, 82, 82, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
    marginVertical: 16,
  },
  browseButton: {
    backgroundColor: 'rgb(1, 225, 255)',
    borderRadius: 8,
    padding: 12,
    width: '80%',
    alignItems: 'center',
  },
  browseButtonText: {
    color: '#0f0f1b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Course View Styles
  courseViewContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  videoContainer: {
    height: 220,
    width: '100%',
    backgroundColor: '#000',
  },
  videoInfoContainer: {
    padding: 16,
  },
  currentVideoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  videoListContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  videoList: {
    paddingBottom: 10,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1e1e2d',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2a2a3a',
  },
  selectedVideoItem: {
    backgroundColor: '#2a2a3a',
    borderColor: 'rgb(1, 225, 255)',
  },
  videoTitle: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 12,
    flex: 1,
  },
  progressContainer: {
    padding: 16,
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#2a2a3a',
    borderRadius: 4,
    marginVertical: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgb(1, 225, 255)',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: 'rgb(1, 225, 255)',
    textAlign: 'center',
  },
  // Chat Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#0f0f1b',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3a',
  },
  modalBackButton: {
    marginRight: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(1, 225, 255)',
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatContent: {
    paddingVertical: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2a2a3a',
    borderTopRightRadius: 0,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 14,
    color: '#fff',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a3a',
    backgroundColor: '#1a1a2e',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#2a2a3a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    color: '#fff',
    marginRight: 10,
  },
  sendButton: {
    padding: 8,
  },
});

export default MyLibrary;
