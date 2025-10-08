import React, { useState,useEffect } from "react";
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
import axiosInstance from "../../api/axiosInstance";
import N8NAPI_URL from "../../api/n8n_api";
import { StaticProductStyle } from "../Global";

const COLORS_idea = {
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


const SearchResults = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { searchTerm } = route.params;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [product, setProduct] = useState([]);
  
  // State for active filter
  const [activeFilter, setActiveFilter] = useState('Latest');
  // State for wishlist items
  const [wishlist, setWishlist] = useState([]);
  // State for sort modal visibility
  const [showSortModal, setShowSortModal] = useState(false);
  // State for selected sort option
  const [selectedSort, setSelectedSort] = useState('Recommended');

 useEffect(() => {
    fetchProduct();
  }, []);

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


    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`${N8NAPI_URL}/webhook/656fcfbc-2d51-4b39-94b5-6fbb71629571/Search_product/${searchTerm}`);
        setProduct(response.data.output);
      } catch (error) {
        console.error("Error fetching data:", error);
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

    const handleProductPress = (product) => {
    navigation.navigate("ProductDetails", { product_id: product.id });
  };

  const renderProductItem = ({ item }) => (
    <Animated.View style={[styles_idea.productItem, { opacity: fadeAnim }]}>
      <TouchableOpacity 
           onPress={() => handleProductPress(item)}
        activeOpacity={0.8}
      >
        {/* Product Image with Badges */}
        <View style={styles_idea.imageContainer}>
          <Image source={{ uri: item.image }} style={styles_idea.productImage} />
          
          {/* Top Left Badges */}
          <View style={styles_idea.topBadges}>
            {item.isNew && (
              <View style={[styles_idea.badge, styles_idea.newBadge]}>
                <Text style={styles_idea.badgeText}>NEW</Text>
              </View>
            )}
            {item.isTrending && (
              <View style={[styles_idea.badge, styles_idea.trendingBadge]}>
                <Text style={styles_idea.badgeText}>TRENDING</Text>
              </View>
            )}
          </View>
          
          {/* Free Shipping Badge */}
          {item.hasFreeShipping && (
            <View style={[styles_idea.badge, styles_idea.freeShippingBadge]}>
              <Text style={styles_idea.badgeText}>FREE SHIPPING</Text>
            </View>
          )}
          
          {/* Wishlist Button */}
          <TouchableOpacity 
            style={styles_idea.wishlistButton}
            onPress={(e) => {
              e.stopPropagation(); // Prevent triggering the parent TouchableOpacity
              toggleWishlist(item.id);
            }}
          >
            <Ionicons 
              name={wishlist.includes(item.id) ? "heart" : "heart-outline"} 
              size={20} 
              color={wishlist.includes(item.id) ? COLORS_idea.highlight : COLORS_idea.white} 
            />
          </TouchableOpacity>
        </View>

        {/* Product Details */}
        <View style={styles_idea.productDetails}>
          {/* Shop and Preferred Badge */}
          <View style={styles_idea.shopContainer}>
            {item.isPreferred && (
              <View style={styles_idea.preferredBadge}>
                <Text style={styles_idea.preferredText}>Preferred</Text>
              </View>
            )}
            <Text style={styles_idea.productShop} numberOfLines={1}>{item.shop}</Text>
          </View>

          {/* Product Name */}
          <Text style={styles_idea.productName} numberOfLines={2}>{item.name}</Text>

          {/* Price */}
          <View style={styles_idea.priceContainer}>
            <Text style={styles_idea.currentPrice}>{item.price}</Text>
            <Text style={styles_idea.originalPrice}>{item.originalPrice}</Text>
            <Text style={styles_idea.discount}>{item.discount}</Text>
          </View>

          {/* Rating */}
          <View style={styles_idea.ratingContainer}>
            <View style={styles_idea.ratingWrapper}>
              <Ionicons name="star" size={14} color={COLORS_idea.rating} />
              <Text style={styles_idea.ratingText}>{item.rating}</Text>
            </View>
            <Text style={styles_idea.soldText}>{item.sold}</Text>
          </View>

          {/* Location */}
          <View style={styles_idea.locationContainer}>
            <Ionicons name="location-outline" size={12} color={COLORS_idea.text} />
            <Text style={styles_idea.locationText}>{item.location}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles_idea.container}>
      {/* Header with Back Button and Search */}
      <View style={styles_idea.header}>
        <View style={styles_idea.headerContent}>
          <TouchableOpacity 
            style={styles_idea.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS_idea.white} />
          </TouchableOpacity>
          <Text style={styles_idea.headerTitle}>Results for "{searchTerm}"</Text>
          <TouchableOpacity 
            style={styles_idea.filterIcon}
            onPress={() => console.log('Filter button pressed')}
          >
            <Ionicons name="filter" size={20} color={COLORS_idea.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles_idea.content}>
        {/* Filter Options */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles_idea.filterContainer}
          contentContainerStyle={styles_idea.filterContent}
        >
          {['Latest', 'Top Sales', 'Price', 'Free Shipping', 'Preferred', 'Near Me', 'Discount'].map((filter) => (
            <TouchableOpacity 
              key={filter}
              style={[
                styles_idea.filterButton, 
                activeFilter === filter && styles_idea.activeFilter
              ]}
              onPress={() => handleFilterSelect(filter)}
            >
              <Text style={[
                styles_idea.filterText, 
                activeFilter === filter && styles_idea.activeFilterText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Count */}
        <View style={styles_idea.resultsContainer}>
          <Text style={styles_idea.resultsText}>1,248 results found</Text>
          <TouchableOpacity 
            style={styles_idea.sortButton}
            onPress={() => setShowSortModal(true)}
          >
            <Text style={styles_idea.sortText}>Sort by: {selectedSort}</Text>
            <Ionicons name="chevron-down" size={16} color={COLORS_idea.primary} />
          </TouchableOpacity>
        </View>

        {/* Product Grid */}
       <StaticProductStyle data={product} />
     
      </ScrollView>

      {/* Sort Modal */}
      {showSortModal && (
        <View style={styles_idea.modalOverlay}>
          <View style={styles_idea.modalContainer}>
            <Text style={styles_idea.modalTitle}>Sort by</Text>
            {['Recommended', 'Latest', 'Top Sales', 'Price: Low to High', 'Price: High to Low', 'Rating'].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles_idea.sortOption}
                onPress={() => handleSortSelect(option)}
              >
                <Text style={[
                  styles_idea.sortOptionText,
                  selectedSort === option && styles_idea.selectedSortOption
                ]}>
                  {option}
                </Text>
                {selectedSort === option && (
                  <Ionicons name="checkmark" size={20} color={COLORS_idea.primary} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles_idea.closeButton}
              onPress={() => setShowSortModal(false)}
            >
              <Text style={styles_idea.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles_idea = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS_idea.background,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS_idea.headerBg,
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
    color: COLORS_idea.white,
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
    backgroundColor: COLORS_idea.white,
    borderWidth: 1,
    borderColor: COLORS_idea.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeFilter: {
    backgroundColor: COLORS_idea.primary,
    borderColor: COLORS_idea.primary,
  },
  filterText: {
    color: COLORS_idea.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: COLORS_idea.white,
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: COLORS_idea.text,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: 14,
    color: COLORS_idea.primary,
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
    backgroundColor: COLORS_idea.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS_idea.border,
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
    color: COLORS_idea.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  newBadge: {
    backgroundColor: COLORS_idea.highlight,
  },
  trendingBadge: {
    backgroundColor: COLORS_idea.secondary,
  },
  freeShippingBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: COLORS_idea.freeShipping,
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
    backgroundColor: COLORS_idea.secondary,
  },
  preferredText: {
    color: COLORS_idea.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  productShop: {
    fontSize: 10,
    color: COLORS_idea.text,
    flexShrink: 1,
  },
  productName: {
    fontSize: 13,
    color: COLORS_idea.primary,
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
    color: COLORS_idea.primary,
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS_idea.text,
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  discount: {
    fontSize: 12,
    color: COLORS_idea.discount,
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
    color: COLORS_idea.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  soldText: {
    fontSize: 12,
    color: COLORS_idea.text,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 11,
    color: COLORS_idea.text,
    marginLeft: 4,
  },
  // Modal styles_idea
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
    backgroundColor: COLORS_idea.white,
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS_idea.primary,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS_idea.border,
  },
  sortOptionText: {
    fontSize: 16,
    color: COLORS_idea.text,
  },
  selectedSortOption: {
    color: COLORS_idea.primary,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: COLORS_idea.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS_idea.white,
    fontWeight: 'bold',
  },
});

export default SearchResults;




// const hablonProducts = [
//   {
//     id: 1,
//     name: "HABLON Barong Filipiniana Blazer",
//     shop: "HABLON Barong & Filipiniana",
//     originalPrice: "₱2,790",
//     price: "₱2,045",
//     discount: "10% off",
//     rating: "4.9",
//     sold: "426 sold",
//     shipping: "3-6 Days",
//     location: "Antique",
//     image: "https://down-ph.img.susercontent.com/file/ph-11134207-7r98s-lvfodscvt9e9a5",
//     isPreferred: true,
//     hasFreeShipping: true,
//     isNew: true,
//     isTrending: true
//   },
//   {
//     id: 2,
//     name: "HABLON  Mules with Coco Coir Footbed",
//     shop: "Roots Collective PH",
//     originalPrice: "₱1,200",
//     price: "₱854",
//     discount: "15% off",
//     rating: "4.9",
//     sold: "2K+ sold",
//     shipping: "3-6 Days",
//     location: "Oton, Iloilo",
//     image: "https://down-ph.img.susercontent.com/file/sg-11134201-7rbky-llt1dke4e2v980.webp",
//     isPreferred: true,
//     hasFreeShipping: true,
//     isTrending: true
//   },
//   {
//     id: 3,
//     name: "HABLON Blanket Shawl with Fringe",
//     shop: "Roots Collective PH",
//     originalPrice: "₱799",
//     price: "₱719",
//     discount: "10% off",
//     rating: "4.8",
//     sold: "1.5K sold",
//     shipping: "3-6 Days",
//     location: "Oton, Iloilo",
//     image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSoW3sMvbaUYRNmZmvYehNH6BSE16NoLBp61pCPyg2zpmy_E22rJLbPERiKtK_SbYG7cDj9N3R9aIavApvH-_8BZzt0YiPfcifpiihQuOnwqgYe5uzN67WF",
//     isPreferred: true,
//     hasFreeShipping: false,
//     isNew: true
//   },
//   {
//     id: 4,
//     name: "HABLON Premium Barong Tagalog",
//     shop: "HABLON Barong & Filipiniana",
//     originalPrice: "₱1099",
//     price: "₱989",
//     discount: "10% off",
//     rating: "4.9",
//     sold: "800 sold",
//     shipping: "3-6 Days",
//     location: "Iloilo City",
//     image: "https://down-ph.img.susercontent.com/file/ph-11134207-7r98o-lzqcvjj2ym4a53",
//     isPreferred: false,
//     hasFreeShipping: true
//   },
// ];