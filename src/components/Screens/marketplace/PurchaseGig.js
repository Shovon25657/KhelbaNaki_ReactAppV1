import React from 'react';
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
} from 'react-native';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

// Mock reviews data
const reviewsData = [
  {
    id: '1',
    username: 'GameEnthusiast',
    avatar: require('../../../../assets/game1.png'),
    rating: 5,
    date: '2 weeks ago',
    comment:
      'Absolutely amazing! I went from Gold to Diamond in just 4 weeks following these strategies. The coach was patient and really knowledgeable about the game.',
  },
  {
    id: '2',
    username: 'ValorantNewbie',
    avatar: require('../../../../assets/game2.png'),
    rating: 4,
    date: '1 month ago',
    comment:
      'Great coaching sessions. I learned a lot about positioning and game sense. Would recommend to anyone looking to improve.',
  },
  {
    id: '3',
    username: 'CompetitiveGamer',
    avatar: require('../../../../assets/game3.png'),
    rating: 5,
    date: '3 weeks ago',
    comment:
      'The strategies I learned were game-changing. My aim improved significantly and I finally understand how to properly use abilities together with my team.',
  },
  {
    id: '4',
    username: 'RankClimber',
    avatar: require('../../../../assets/game1.png'),
    rating: 5,
    date: '5 days ago',
    comment:
      'Worth every penny! The personalized feedback on my gameplay recordings helped me identify mistakes I never noticed before.',
  },
];

// Mock service details
const serviceDetails = [
  {
    icon: 'clock',
    title: 'Duration',
    value: '5 hours of coaching',
  },
  {
    icon: 'users',
    title: 'Sessions',
    value: '3 one-on-one sessions',
  },
  {
    icon: 'check-circle',
    title: 'Includes',
    value: 'Gameplay review, Custom drills, Agent mastery',
  },
  {
    icon: 'calendar',
    title: 'Delivery',
    value: 'Within 7 days',
  },
];

const PurchaseGig = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { gig } = route.params || {
    image: require('../../../../assets/game1.png'),
    rating: 4.8,
    reviews: 142,
    price: '$25',
    title: 'I will teach you to go for Radiant Level in Valorant',
    seller: 'ValorantPro',
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handlePurchasePress = () => {
    navigation.navigate('BuyGig', { gig });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= rating ? 'star' : 'star-o'}
          size={14}
          color="rgb(1, 225, 255)"
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Image source={item.avatar} style={styles.reviewerAvatar} />
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>{item.username}</Text>
          <View style={styles.ratingDateContainer}>
            <View style={styles.starContainer}>{renderStars(item.rating)}</View>
            <Text style={styles.reviewDate}>{item.date}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gig Details</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <Image source={gig.image} style={styles.heroImage} />

        {/* Gig Title and Seller Info */}
        <View style={styles.gigInfoContainer}>
          <Text style={styles.gigTitle}>{gig.title}</Text>
          
          <View style={styles.sellerContainer}>
            <Image source={require('../../../../assets/game1.png')} style={styles.sellerAvatar} />
            <Text style={styles.sellerName}>{gig.seller}</Text>
            <View style={styles.verifiedBadge}>
              <Feather name="check" size={12} color="#1a1a2e" />
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <FontAwesome name="star" size={16} color="rgb(1, 225, 255)" />
              <Text style={styles.statText}>{gig.rating} ({gig.reviews} reviews)</Text>
            </View>
            <View style={styles.statItem}>
              <Feather name="clock" size={16} color="#aaa" />
              <Text style={styles.statText}>Quick Response</Text>
            </View>
          </View>

          {/* Service Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Service</Text>
            <Text style={styles.descriptionText}>
              Take your Valorant skills to the next level with personalized coaching from a professional player. 
              Whether you're stuck in your current rank or looking to master specific agents, this coaching 
              package will help you improve your gameplay, strategy understanding, and team coordination.
            </Text>
          </View>

          {/* Service Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's Included</Text>
            {serviceDetails.map((detail, index) => (
              <View key={index} style={styles.detailItem}>
                <Feather name={detail.icon} size={20} color="rgb(1, 225, 255)" />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailTitle}>{detail.title}</Text>
                  <Text style={styles.detailValue}>{detail.value}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Purchase Now Button */}
          <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchasePress}>
            <Text style={styles.purchaseButtonText}>Purchase Now - {gig.price}</Text>
          </TouchableOpacity>

          {/* Reviews Section */}
          <View style={styles.section}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
              <View style={styles.overallRating}>
                <FontAwesome name="star" size={16} color="rgb(1, 225, 255)" />
                <Text style={styles.overallRatingText}>{gig.rating} ({gig.reviews})</Text>
              </View>
            </View>
            
            <FlatList
              data={reviewsData}
              renderItem={renderReviewItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#232342',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholderButton: {
    width: 34,
    height: 34,
  },
  heroImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  gigInfoContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  gigTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    lineHeight: 28,
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sellerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 6,
  },
  verifiedBadge: {
    backgroundColor: '#rgb(1, 225, 255)',
    borderRadius: 12,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(1, 225, 255)',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#ddd',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  detailTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  detailTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#aaa',
  },
  purchaseButton: {
    backgroundColor: 'rgb(1, 225, 255)',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  purchaseButtonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overallRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overallRatingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 5,
  },
  reviewItem: {
    backgroundColor: '#232342',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  ratingDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starContainer: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: '#aaa',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: '#ddd',
  },
});

export default PurchaseGig;
