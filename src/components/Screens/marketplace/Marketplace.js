import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../../common/BottomNavBar';

// Mock data for marketplace items - reduced to 4 items
const marketplaceData = [
  {
    id: '1',
    image: require('../../../../assets/game1.png'),
    rating: 4.8,
    reviews: 142,
    price: '$25',
    title: 'I will teach you to go for Radiant Level in Valorant',
    seller: 'ValorantPro'
  },
  {
    id: '2',
    image: require('../../../../assets/game1.png'),
    rating: 4.9,
    reviews: 98,
    price: '$30',
    title: 'Pro Valorant coaching - Rank up guaranteed!',
    seller: 'GameMaster'
  },
  {
    id: '3',
    image: require('../../../../assets/game1.png'),
    rating: 4.7,
    reviews: 215,
    price: '$22',
    title: 'Master Valorant aim and strategy with a pro player',
    seller: 'AimTrainer'
  },
  {
    id: '4',
    image: require('../../../../assets/game1.png'),
    rating: 4.6,
    reviews: 78,
    price: '$19',
    title: 'Learn advanced Valorant tactics and team coordination',
    seller: 'TacticalCoach'
  },
];

const MarketPlace = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleLibraryPress = () => {
    navigation.navigate('MyLibrary');
  };

  const handleGigPress = (item) => {
    navigation.navigate('PurchaseGig', { gig: item });
  };

  const renderMarketplaceItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => handleGigPress(item)}
    >
      <Image 
        source={item.image} 
        style={styles.itemImage}
        defaultSource={require('../../../../assets/game1.png')}
      />
      <View style={styles.itemInfoContainer}>
        <View style={styles.ratingPriceContainer}>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewsText}>({item.reviews})</Text>
          </View>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
        <Text style={styles.titleText} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.sellerText}>by {item.seller}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFD700" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Marketplace</Text>
        
        <TouchableOpacity onPress={handleLibraryPress} style={styles.libraryButton}>
          <FontAwesome name="book" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>
      
      {/* Marketplace grid - changed to a vertical list with larger items */}
      <FlatList
        data={marketplaceData}
        renderItem={renderMarketplaceItem}
        keyExtractor={item => item.id}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      
      {/* Bottom Navigation Bar */}
      <BottomNavBar />
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  libraryButton: {
    padding: 5,
  },
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    margin: 8,
    backgroundColor: '#232342',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  itemImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  itemInfoContainer: {
    padding: 14,
  },
  ratingPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: '600',
    fontSize: 15,
    color: '#fff',
  },
  reviewsText: {
    fontSize: 13,
    color: '#aaa',
    marginLeft: 2,
  },
  priceText: {
    fontWeight: '700',
    fontSize: 18,
    color: '#FFD700',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
    lineHeight: 22,
  },
  sellerText: {
    fontSize: 14,
    color: '#aaa',
  },
});

export default MarketPlace;