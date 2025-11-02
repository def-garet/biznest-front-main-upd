import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import API_URL  from '../../api/api_urls';
import StaticProductStyle from '../Global/StaticProductStyle';

const PRIMARY_COLOR = '#172d55';
const SECONDARY_COLOR = '#f39c12';
const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
};

const ViewShop = ({ navigation, route }) => {
  const { seller_id } = route.params;

  const [shopDetails, setShopDetails] = useState({
    shop_name: "Iloilo Handicrafts Haven",
    shop_logo: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    review_count: 215,
    location: "Molo, Iloilo City, Philippines",
    description: "Proudly showcasing the finest handmade crafts from Iloilo's talented local artisans. We specialize in traditional woven products (hablon), pottery, shell crafts, and other unique Ilonggo handicrafts. Each piece tells a story of our rich cultural heritage.",
    joined_date: "2018",
    response_rate: "99%"
  });

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [products, setProductDetail] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading] = useState(false);

const handleChatWithSeller = async () => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/chat/send_message`, {
      seller_id: seller_id,
      thread_id: null ,
       message: null, // or don't send this field

    });
    
    const thread_id = response.data.thread_id;
    
    navigation.navigate("ChatConversation", { 
      chat: {
        thread_id,
        seller_id: seller_id,
        store: shopDetails.shop_name,
        message: "Say hi!",
        date: "Just now"
      }
    });
    
  } catch (err) {
    console.error("Error starting chat", err);
  }
};



  const fetchShopDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/View Shop/view_shop/${seller_id}`);
      const products = response.data.products || [];

      // Compute rating and reviews
      let totalReviews = 0;
      let totalRatingSum = 0;
      products.forEach((product) => {
        totalReviews += product.total_reviews || 0;
        totalRatingSum += product.total_rating || 0;
      });
      const averageRating = totalReviews > 0 ? (totalRatingSum / totalReviews).toFixed(1) : 0;

      const shopData = {
        shop_name: response.data.shop_name || "Noname Shop",
        shop_logo: response.data.owner_info?.profile_pic || "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        rating: averageRating,
        review_count: totalReviews,
        location: response.data.register_address || "Unknown Location",
        description: "Proudly showcasing the finest handmade crafts from Iloilo's talented local artisans.",
        joined_date: "2018",
        response_rate: "99%"
      };

      setShopDetails(shopData);
      setCategories([{ id: 0, name: "All Products" }, ...(response.data.category_info || [])]);
      setProductDetail(products);
    } catch (error) {
      console.error("Error fetching shop details", error);
    }
  };

  useEffect(() => {
    fetchShopDetails();
  }, []);

  useEffect(() => {
    if (!products || !categories) return;

    if (activeCategory === 0) {
      setFilteredProducts(products);
    } else {
      const selectedCategory = categories.find(cat => cat.id === activeCategory)?.name;
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [activeCategory, products, categories]);

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        activeCategory === item.id && styles.activeCategoryItem
      ]}
      onPress={() => setActiveCategory(item.id)}
    >
      <Text
        style={[
          styles.categoryText,
          activeCategory === item.id && styles.activeCategoryText
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Loading Shop Details...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Shop Header */}
        <View style={styles.shopHeader}>
          <View style={styles.headerBackground} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.shopLogoContainer}>
            <Image source={{ uri: shopDetails.shop_logo }} style={styles.shopLogo} />
          </View>

          <View style={styles.shopInfo}>
            <Text style={styles.shopName}>{shopDetails.shop_name}</Text>
            <View style={styles.shopRating}>
              <Ionicons name="star" size={16} color="#FFC120" />
              <Text style={styles.ratingText}>{shopDetails.rating}</Text>
              <Text style={styles.reviewCount}>({shopDetails.review_count} reviews)</Text>
            </View>
            <View style={styles.locationContainer}>
              <MaterialIcons name="location-on" size={14} color="white" />
              <Text style={styles.shopLocation}>{shopDetails.location}</Text>
            </View>
          </View>
        </View>

        {/* Shop Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <FontAwesome name="cube" size={20} color={SECONDARY_COLOR} />
            <Text style={styles.statValue}>{products.length}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome name="calendar" size={20} color={SECONDARY_COLOR} />
            <Text style={styles.statValue}>{shopDetails.joined_date}</Text>
            <Text style={styles.statLabel}>Member Since</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome name="comments" size={20} color={SECONDARY_COLOR} />
            <Text style={styles.statValue}>{shopDetails.response_rate}</Text>
            <Text style={styles.statLabel}>Response Rate</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.descriptionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="info" size={18} color={PRIMARY_COLOR} />
            <Text style={styles.sectionTitle}>About This Shop</Text>
          </View>
          <Text style={styles.shopDescription}>{shopDetails.description}</Text>
        </View>

        {/* Chat with Seller Button */}
        <View style={styles.chatContainer}>
          <TouchableOpacity
            style={styles.chatButton}
            // onPress={() =>
            //   navigation.navigate("ChatConversation", {
            //     seller_id,
            //     shop_name: shopDetails.shop_name
            //   })
            // }
          onPress={handleChatWithSeller}

          >
            <Ionicons name="chatbubbles" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.chatButtonText}>Chat with Seller</Text>
          </TouchableOpacity>
        </View>

        {/* Shop Products */}
        <View style={styles.productsSection}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="shopping-bag" size={18} color={PRIMARY_COLOR} />
            <Text style={styles.sectionTitle}>Shop Products</Text>
          </View>

          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />

          {filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="remove-shopping-cart" size={40} color="#ccc" />
              <Text style={styles.noProductsText}>No products in this category</Text>
            </View>
          ) : (
            <StaticProductStyle data={filteredProducts} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 10,
    color: PRIMARY_COLOR,
    fontSize: 14,
  },
  shopHeader: {
    backgroundColor: PRIMARY_COLOR,
    padding: 15,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  headerBackground: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: PRIMARY_COLOR,
    opacity: 0.9,
  },
  backButton: {
    position: 'absolute',
    top: 35,
    left: 10,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
    padding: 3,
  },
  shopLogoContainer: {
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 3,
    ...CARD_SHADOW,
  },
  shopLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  shopInfo: {
    flex: 1,
    marginLeft: 12,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  shopRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 13,
    color: 'white',
    marginLeft: 3,
    marginRight: 6,
  },
  reviewCount: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopLocation: {
    fontSize: 13,
    color: 'white',
    marginLeft: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: 'white',
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: -5,
    marginBottom: 10,
    ...CARD_SHADOW,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginVertical: 3,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
  },
  descriptionContainer: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    ...CARD_SHADOW,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginLeft: 8,
  },
  shopDescription: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  chatContainer: {
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 15,
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "100%",
    ...CARD_SHADOW,
  },
  chatButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  productsSection: {
    backgroundColor: '#ffffff',
    padding: 15,
  },
  categoriesContainer: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  categoryItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  activeCategoryItem: {
    backgroundColor: PRIMARY_COLOR,
  },
  categoryText: {
    fontSize: 13,
    color: '#555',
  },
  activeCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noProductsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
    fontSize: 14,
  },
});

export default ViewShop;
