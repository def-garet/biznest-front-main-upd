import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  Animated,
  Easing
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const COLORS = {
  primary: '#172d55',
  secondary: '#2196f3',
  background: '#f8f9fa',
  text: '#6c757d',
  border: '#e0e0e0',
  discount: '#e53935',
  freeShipping: '#4caf50',
  highlight: '#ff6b6b',
  rating: '#FFD700',
  white: '#ffffff',
  headerBg: '#172d55',
};

const { width } = Dimensions.get('window');
const itemWidth = (width - 36) / 2;

const hablonProducts = [
  {
    id: 1,
    name: "HABLON Barong Filipiniana Blazer",
    shop: "HABLON Barong & Filipiniana",
    originalPrice: "₱2,790",
    price: "₱2,045",
    discount: "10% off",
    rating: "4.9",
    sold: "426 sold",
    shipping: "3-6 Days",
    location: "Antique",
    image: "https://down-ph.img.susercontent.com/file/ph-11134207-7r98s-lvfodscvt9e9a5",
    isPreferred: true,
    hasFreeShipping: true,
    isNew: true,
    isTrending: true
  },
  {
    id: 2,
    name: "HABLON  Mules with Coco Coir Footbed",
    shop: "Roots Collective PH",
    originalPrice: "₱1,200",
    price: "₱854",
    discount: "15% off",
    rating: "4.9",
    sold: "2K+ sold",
    shipping: "3-6 Days",
    location: "Oton, Iloilo",
    image: "https://down-ph.img.susercontent.com/file/sg-11134201-7rbky-llt1dke4e2v980.webp",
    isPreferred: true,
    hasFreeShipping: true,
    isTrending: true
  },
  {
    id: 3,
    name: "HABLON Blanket Shawl with Fringe",
    shop: "Roots Collective PH",
    originalPrice: "₱799",
    price: "₱719",
    discount: "10% off",
    rating: "4.8",
    sold: "1.5K sold",
    shipping: "3-6 Days",
    location: "Oton, Iloilo",
    image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSoW3sMvbaUYRNmZmvYehNH6BSE16NoLBp61pCPyg2zpmy_E22rJLbPERiKtK_SbYG7cDj9N3R9aIavApvH-_8BZzt0YiPfcifpiihQuOnwqgYe5uzN67WF",
    isPreferred: true,
    hasFreeShipping: false,
    isNew: true
  },
  {
    id: 4,
    name: "HABLON Premium Barong Tagalog",
    shop: "HABLON Barong & Filipiniana",
    originalPrice: "₱1099",
    price: "₱989",
    discount: "10% off",
    rating: "4.9",
    sold: "800 sold",
    shipping: "3-6 Days",
    location: "Iloilo City",
    image: "https://down-ph.img.susercontent.com/file/ph-11134207-7r98o-lzqcvjj2ym4a53",
    isPreferred: false,
    hasFreeShipping: true
  },
];

const SearchResults = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { searchTerm } = route.params;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  // State for active filter
  const [activeFilter, setActiveFilter] = useState('Latest');
  // State for wishlist items
  const [wishlist, setWishlist] = useState([]);
  // State for sort modal visibility
  const [showSortModal, setShowSortModal] = useState(false);
  // State for selected sort option
  const [selectedSort, setSelectedSort] = useState('Recommended');

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Toggle wishlist status for a product
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  // Handle filter selection
  const handleFilterSelect = (filter) => {
    setActiveFilter(filter);
    // Here you would typically filter your products based on the selected filter
    console.log(`Filtering by: ${filter}`);
  };

  // Handle sort selection
  const handleSortSelect = (sortOption) => {
    setSelectedSort(sortOption);
    setShowSortModal(false);
    // Here you would typically sort your products based on the selected option
    console.log(`Sorting by: ${sortOption}`);
  };

  const renderProductItem = ({ item }) => (
    <Animated.View style={[styles.productItem, { opacity: fadeAnim }]}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
        activeOpacity={0.8}
      >
        {/* Product Image with Badges */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          
          {/* Top Left Badges */}
          <View style={styles.topBadges}>
            {item.isNew && (
              <View style={[styles.badge, styles.newBadge]}>
                <Text style={styles.badgeText}>NEW</Text>
              </View>
            )}
            {item.isTrending && (
              <View style={[styles.badge, styles.trendingBadge]}>
                <Text style={styles.badgeText}>TRENDING</Text>
              </View>
            )}
          </View>
          
          {/* Free Shipping Badge */}
          {item.hasFreeShipping && (
            <View style={[styles.badge, styles.freeShippingBadge]}>
              <Text style={styles.badgeText}>FREE SHIPPING</Text>
            </View>
          )}
          
          {/* Wishlist Button */}
          <TouchableOpacity 
            style={styles.wishlistButton}
            onPress={(e) => {
              e.stopPropagation(); // Prevent triggering the parent TouchableOpacity
              toggleWishlist(item.id);
            }}
          >
            <Ionicons 
              name={wishlist.includes(item.id) ? "heart" : "heart-outline"} 
              size={20} 
              color={wishlist.includes(item.id) ? COLORS.highlight : COLORS.white} 
            />
          </TouchableOpacity>
        </View>

        {/* Product Details */}
        <View style={styles.productDetails}>
          {/* Shop and Preferred Badge */}
          <View style={styles.shopContainer}>
            {item.isPreferred && (
              <View style={styles.preferredBadge}>
                <Text style={styles.preferredText}>Preferred</Text>
              </View>
            )}
            <Text style={styles.productShop} numberOfLines={1}>{item.shop}</Text>
          </View>

          {/* Product Name */}
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>{item.price}</Text>
            <Text style={styles.originalPrice}>{item.originalPrice}</Text>
            <Text style={styles.discount}>{item.discount}</Text>
          </View>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <View style={styles.ratingWrapper}>
              <Ionicons name="star" size={14} color={COLORS.rating} />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
            <Text style={styles.soldText}>{item.sold}</Text>
          </View>

          {/* Location */}
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={12} color={COLORS.text} />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Back Button and Search */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Results for "{searchTerm}"</Text>
          <TouchableOpacity 
            style={styles.filterIcon}
            onPress={() => console.log('Filter button pressed')}
          >
            <Ionicons name="filter" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Filter Options */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {['Latest', 'Top Sales', 'Price', 'Free Shipping', 'Preferred', 'Near Me', 'Discount'].map((filter) => (
            <TouchableOpacity 
              key={filter}
              style={[
                styles.filterButton, 
                activeFilter === filter && styles.activeFilter
              ]}
              onPress={() => handleFilterSelect(filter)}
            >
              <Text style={[
                styles.filterText, 
                activeFilter === filter && styles.activeFilterText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>1,248 results found</Text>
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => setShowSortModal(true)}
          >
            <Text style={styles.sortText}>Sort by: {selectedSort}</Text>
            <Ionicons name="chevron-down" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Product Grid */}
        <FlatList
          data={hablonProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.productList}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>

      {/* Sort Modal */}
      {showSortModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Sort by</Text>
            {['Recommended', 'Latest', 'Top Sales', 'Price: Low to High', 'Price: High to Low', 'Rating'].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.sortOption}
                onPress={() => handleSortSelect(option)}
              >
                <Text style={[
                  styles.sortOptionText,
                  selectedSort === option && styles.selectedSortOption
                ]}>
                  {option}
                </Text>
                {selectedSort === option && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSortModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.headerBg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  filterIcon: {
    marginLeft: 12,
  },
  content: {
    paddingHorizontal: 12,
  },
  filterContainer: {
    marginVertical: 16,
  },
  filterContent: {
    paddingHorizontal: 4,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeFilter: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: COLORS.white,
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: COLORS.text,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  productList: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productItem: {
    width: itemWidth,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: itemWidth,
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  topBadges: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  newBadge: {
    backgroundColor: COLORS.highlight,
  },
  trendingBadge: {
    backgroundColor: COLORS.secondary,
  },
  freeShippingBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: COLORS.freeShipping,
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: {
    padding: 12,
  },
  shopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  preferredBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
    backgroundColor: COLORS.secondary,
  },
  preferredText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  productShop: {
    fontSize: 10,
    color: COLORS.text,
    flexShrink: 1,
  },
  productName: {
    fontSize: 13,
    color: COLORS.primary,
    marginBottom: 8,
    fontWeight: '600',
    height: 36,
    lineHeight: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  currentPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.text,
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  discount: {
    fontSize: 12,
    color: COLORS.discount,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'space-between',
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  soldText: {
    fontSize: 12,
    color: COLORS.text,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 11,
    color: COLORS.text,
    marginLeft: 4,
  },
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.primary,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sortOptionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  selectedSortOption: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default SearchResults;