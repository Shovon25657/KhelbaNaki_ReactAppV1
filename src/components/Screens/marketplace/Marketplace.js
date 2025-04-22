import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  Animated,
  TextInput,
  Keyboard,
  Dimensions,
  ScrollView
} from 'react-native';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../../common/BottomNavBar';
import Slider from '@react-native-community/slider';

const { height, width } = Dimensions.get('window');

// Mock data for marketplace items
const marketplaceData = [
  {
    id: '1',
    image: require('../../../../assets/game1.png'),
    rating: 4.8,
    reviews: 142,
    price: '$25',
    title: 'I will teach you to go for Radiant Level in Valorant',
    seller: 'ValorantPro',
    category: 'Game Training',
    createdAt: '2025-03-15'
  },
  {
    id: '2',
    image: require('../../../../assets/game1.png'),
    rating: 4.9,
    reviews: 98,
    price: '$30',
    title: 'Pro Valorant coaching - Rank up guaranteed!',
    seller: 'GameMaster',
    category: 'Competitive Training',
    createdAt: '2025-02-22'
  },
  {
    id: '3',
    image: require('../../../../assets/game1.png'),
    rating: 4.7,
    reviews: 215,
    price: '$22',
    title: 'Master Valorant aim and strategy with a pro player',
    seller: 'AimTrainer',
    category: 'Game Training',
    createdAt: '2025-01-10'
  },
  {
    id: '4',
    image: require('../../../../assets/game1.png'),
    rating: 4.6,
    reviews: 78,
    price: '$19',
    title: 'Learn advanced Valorant tactics and team coordination',
    seller: 'TacticalCoach',
    category: 'Streaming',
    createdAt: '2024-12-05'
  },
];

// Predefined categories
const categories = [
  'Game Training',
  'Competitive Training',
  'Streaming',
  'Coaching',
  'Content Creation',
  'Strategy Development',
  'Team Building',
  'Custom Games'
];

// Time range options
const timeRanges = [
  { label: 'Any time', value: 'any' },
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last week', value: 'week' },
  { label: 'Last month', value: 'month' },
  { label: 'Last year', value: 'year' }
];

const Marketplace = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customCategory, setCustomCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('any');
  const [filteredData, setFilteredData] = useState(marketplaceData);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  
  // Animation refs
  const slideAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const toggleSearchPanel = () => {
    if (showSearchPanel) {
      // Hide panel
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => {
        setShowSearchPanel(false);
        Keyboard.dismiss();
      });
    } else {
      // Show panel
      setShowSearchPanel(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  };

  const applyFilters = () => {
    let results = [...marketplaceData];
    
    // Filter by search query
    if (searchQuery) {
      results = results.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      results = results.filter(item => item.category === selectedCategory);
    }
    
    // Filter by price
    results = results.filter(item => {
      const numericPrice = parseFloat(item.price.replace('$', ''));
      return numericPrice >= priceRange[0] && numericPrice <= priceRange[1];
    });
    
    // Filter by time range
    const currentDate = new Date();
    if (selectedTimeRange !== 'any') {
      results = results.filter(item => {
        const itemDate = new Date(item.createdAt);
        const timeDiff = currentDate - itemDate;
        const daysDiff = timeDiff / (1000 * 3600 * 24);
        
        switch (selectedTimeRange) {
          case '24h': return daysDiff <= 1;
          case 'week': return daysDiff <= 7;
          case 'month': return daysDiff <= 30;
          case 'year': return daysDiff <= 365;
          default: return true;
        }
      });
    }
    
    setFilteredData(results);
    toggleSearchPanel();
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setCustomCategory('');
    setPriceRange([0, 100]);
    setSelectedTimeRange('any');
    setFilteredData(marketplaceData);
  };

  const addCustomCategory = () => {
    if (customCategory.trim() && !categories.includes(customCategory.trim())) {
      categories.push(customCategory.trim());
      setSelectedCategory(customCategory.trim());
      setCustomCategory('');
    }
  };

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
      activeOpacity={0.8}
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
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
        <Text style={styles.titleText} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.sellerText}>by {item.seller}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item && styles.selectedCategoryItem
      ]}
      onPress={() => setSelectedCategory(item === selectedCategory ? null : item)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.categoryItemText,
        selectedCategory === item && styles.selectedCategoryItemText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderTimeRangeItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.timeRangeItem,
        selectedTimeRange === item.value && styles.selectedTimeRangeItem
      ]}
      onPress={() => setSelectedTimeRange(item.value)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.timeRangeItemText,
        selectedTimeRange === item.value && styles.selectedTimeRangeItemText
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  // Search panel animation
  const panelTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0] // Now slides all the way up
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
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
      
      {/* Search Button */}
      <TouchableOpacity 
        style={styles.searchButton}
        onPress={toggleSearchPanel}
        activeOpacity={0.8}
      >
        <FontAwesome name="search" size={22} color="#FFD700" />
        <Text style={styles.searchButtonText}>
          {searchQuery ? `Search: "${searchQuery}"` : 'Search Marketplace'}
        </Text>
        <FontAwesome name="sliders" size={22} color="#FFD700" />
      </TouchableOpacity>
      
      {/* Marketplace grid */}
      <FlatList
        data={filteredData}
        renderItem={renderMarketplaceItem}
        keyExtractor={item => item.id}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items found. Try adjusting your search filters.</Text>
          </View>
        }
      />
      
      {/* Search Panel Overlay */}
      {showSearchPanel && (
        <Animated.View 
          style={[
            styles.overlay, 
            { opacity: overlayOpacity }
          ]}
          onTouchStart={toggleSearchPanel}
        />
      )}
      
      {/* Search Panel */}
      {showSearchPanel && (
        <Animated.View 
          style={[
            styles.searchPanel, 
            { 
              transform: [{ translateY: panelTranslateY }],
              height: height * 0.85 // Increased height
            }
          ]}
        >
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Advanced Search</Text>
            <TouchableOpacity onPress={toggleSearchPanel}>
              <Ionicons name="close" size={28} color="#FFD700" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.panelScrollContent}
            contentContainerStyle={styles.panelContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Search input field */}
            <View style={styles.searchInputContainer}>
              <FontAwesome name="search" size={18} color="#aaa" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by title, seller or category"
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
              />
            </View>
            
            {/* Categories section */}
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.categoriesScrollContainer}>
              <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={item => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
              />
            </View>
            
            {/* Custom Category Input */}
            <View style={styles.customCategoryContainer}>
              <TextInput
                style={styles.customCategoryInput}
                placeholder="Add custom category"
                placeholderTextColor="#888"
                value={customCategory}
                onChangeText={setCustomCategory}
                onSubmitEditing={addCustomCategory}
                returnKeyType="done"
              />
              <TouchableOpacity 
                style={[
                  styles.addCategoryButton,
                  !customCategory.trim() && styles.disabledButton
                ]}
                onPress={addCustomCategory}
                disabled={!customCategory.trim()}
                activeOpacity={0.7}
              >
                <Text style={styles.addCategoryButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            
            {/* Price Range Section */}
            <Text style={styles.sectionTitle}>
              Price Range: ${Math.round(priceRange[0])} - ${Math.round(priceRange[1])}
            </Text>
            <View style={styles.priceRangeContainer}>
              <Text style={styles.sliderLabel}>Min Price: ${Math.round(priceRange[0])}</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={priceRange[0]}
                onValueChange={(value) => setPriceRange([value, priceRange[1]])}
                minimumTrackTintColor="#FFD700"
                maximumTrackTintColor="#888"
                thumbTintColor="#FFD700"
                step={1}
              />
              <Text style={styles.sliderLabel}>Max Price: ${Math.round(priceRange[1])}</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={priceRange[1]}
                onValueChange={(value) => setPriceRange([priceRange[0], value])}
                minimumTrackTintColor="#FFD700"
                maximumTrackTintColor="#888"
                thumbTintColor="#FFD700"
                step={1}
              />
            </View>
            
            {/* Time Range Section */}
            <Text style={styles.sectionTitle}>Time Range</Text>
            <View style={styles.timeRangeScrollContainer}>
              <FlatList
                data={timeRanges}
                renderItem={renderTimeRangeItem}
                keyExtractor={item => item.value}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.timeRangeContainer}
              />
            </View>
          </ScrollView>
          
          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.resetButton]}
              onPress={resetFilters}
              activeOpacity={0.7}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.applyButton]}
              onPress={applyFilters}
              activeOpacity={0.7}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
      
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
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#232342',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    margin: 15,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  searchButtonText: {
    flex: 1,
    color: '#FFD700',
    fontWeight: '600',
    fontSize: 16,
    marginHorizontal: 10,
  },
  listContainer: {
    padding: 10,
    paddingBottom: 20,
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
  categoryBadge: {
    backgroundColor: '#313160',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  categoryText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '500',
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
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 10,
  },
  searchPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    zIndex: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#313160',
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  panelScrollContent: {
    flex: 1,
  },
  panelContent: {
    paddingBottom: 80, // Space for action buttons
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232342',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  categoriesScrollContainer: {
    maxHeight: 80,
    marginBottom: 15,
  },
  categoriesContainer: {
    paddingRight: 15,
  },
  categoryItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#232342',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#313160',
  },
  selectedCategoryItem: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  categoryItemText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  selectedCategoryItemText: {
    color: '#1a1a2e',
    fontWeight: '700',
  },
  customCategoryContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  customCategoryInput: {
    flex: 1,
    backgroundColor: '#232342',
    color: '#fff',
    padding: 12,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#313160',
  },
  addCategoryButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 15,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  addCategoryButtonText: {
    color: '#1a1a2e',
    fontWeight: 'bold',
  },
  priceRangeContainer: {
    marginBottom: 15,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabel: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 5,
  },
  timeRangeScrollContainer: {
    maxHeight: 50,
    marginBottom: 15,
  },
  timeRangeContainer: {
    paddingRight: 15,
  },
  timeRangeItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#232342',
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#313160',
  },
  selectedTimeRangeItem: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  timeRangeItemText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  },
  selectedTimeRangeItemText: {
    color: '#1a1a2e',
    fontWeight: '600',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 5,
  },
  actionButton: {
    paddingVertical: 15,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    backgroundColor: '#313160',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  applyButton: {
    backgroundColor: '#FFD700',
    marginLeft: 10,
  },
  resetButtonText: {
    color: '#FFD700',
    fontWeight: '600',
    fontSize: 16,
  },
  applyButtonText: {
    color: '#1a1a2e',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default Marketplace;