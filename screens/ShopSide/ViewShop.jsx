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
import API_URL from '../../api/api_urls';

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
  
  const [shopDetails,setShopDetails] = useState(
    {
    shop_name: "Iloilo Handicrafts Haven",
    shop_logo: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    review_count: 215,
    location: "Molo, Iloilo City, Philippines",
    description: "Proudly showcasing the finest handmade crafts from Iloilo's talented local artisans. We specialize in traditional woven products (hablon), pottery, shell crafts, and other unique Ilonggo handicrafts. Each piece tells a story of our rich cultural heritage.",
    joined_date: "2018",
    response_rate: "99%"
  }
);
  
  const [categories,setCategories] = useState(
    [
    { id: 0, name: 'All Products' },
    { id: 'woven', name: 'Woven Products' },
    { id: 'pottery', name: 'Pottery' },
    { id: 'shell', name: 'Shell Crafts' },
    { id: 'clothing', name: 'Clothing' }
  ]
);
  
  const [activeCategory, setActiveCategory] = useState('all');
  
  const [products,setProductDetail] = useState([
    {
      id: 1,
      name: "Hablon Tote Bag",
      price: 450,
      img: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: 'woven'
    },
    {
      id: 2,
      name: "Bamboo Coffee Mug Set",
      price: 1200,
      img: "https://images.unsplash.com/photo-1595341595379-cf0f2f9cfd0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: 'pottery'
    },
    {
      id: 3,
      name: "Capiz Shell Wind Chime",
      price: 650,
      img: "https://images.unsplash.com/photo-1605000797499-95e51f0dc0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: 'shell'
    },
    {
      id: 4,
      name: "Handwoven Patadyong",
      price: 850,
      img: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: 'clothing'
    },
    {
      id: 5,
      name: "Ceramic Jar",
      price: 1500,
      img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: 'pottery'
    },
    {
      id: 6,
      name: "Raffia Sun Hat",
      price: 550,
      img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: 'woven'
    }
  ]);
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading] = useState(false);
  
  const fetchShopDetails = async () => {
    try {
      console.log("Fetching shop details for seller_id:", `${API_URL}/api/v1/View Shop/view_shop/${seller_id}`);
      const response = await axios.get(`${API_URL}/api/v1/View Shop/view_shop/${seller_id}`);
      
      // Assuming 'response.data' contains your shop data
      const products = response.data.products || [];

      // Compute total reviews and total rating
      let totalReviews = 0;
      let totalRatingSum = 0;

      products.forEach((product) => {
        totalReviews += product.total_reviews || 0;
        totalRatingSum += product.total_rating || 0;
      });

      // Compute average rating (avoid dividing by zero)
      const averageRating = totalReviews > 0 ? (totalRatingSum / totalReviews).toFixed(1) : 0;

      const shopData = { 
        shop_name: response.data.shop_name || "Noname Shop",
        shop_logo: response.data.owner_info.profile_pic || "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        rating: averageRating,        // ✅ computed average rating
        review_count: totalReviews,   // ✅ computed total reviews
        location: response.data.register_address || "Unknown Location",
        description: "Proudly showcasing the finest handmade crafts from Iloilo's talented local artisans.",
        joined_date: "2018",
        response_rate: "99%"
      };
      setShopDetails(shopData);
      setCategories([{ id: 0, name: "All" }, ...response.data.category_info]);
    } catch (error) {
      console.error("Error fetching shop details", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchShopDetails();
  }, []);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === activeCategory));
    }
  }, [activeCategory, products]);

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { product_id: item.id })}
    >
      <Image 
        source={{ uri: item.img }} 
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfoContainer}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productPrice}>₱{item.price.toLocaleString()}</Text>
        <View style={styles.productRating}>
          <Ionicons name="star" size={14} color="#FFC120" />
          <Text style={styles.ratingText}>4.8</Text>
          <Text style={styles.soldText}>({Math.floor(Math.random() * 100) + 1} sold)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        activeCategory === item.id && styles.activeCategoryItem
      ]}
      onPress={() => setActiveCategory(item.id)}
    >
      <Text style={[
        styles.categoryText,
        activeCategory === item.id && styles.activeCategoryText
      ]}>
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
            <Image 
              source={{ uri: shopDetails.shop_logo }} 
              style={styles.shopLogo}
            />
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

        {/* Shop Description */}
        <View style={styles.descriptionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="info" size={18} color={PRIMARY_COLOR} />
            <Text style={styles.sectionTitle}>About This Shop</Text>
          </View>
          <Text style={styles.shopDescription}>
            {shopDetails.description}
          </Text>
        </View>

        {/* Shop Products */}
        <View style={styles.productsSection}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="shopping-bag" size={18} color={PRIMARY_COLOR} />
            <Text style={styles.sectionTitle}>Shop Products</Text>
          </View>
          
          {/* Categories */}
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id}
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
            <FlatList
              data={filteredProducts}
              renderItem={renderProductItem}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={styles.productsRow}
              contentContainerStyle={styles.productsList}
              scrollEnabled={false}
            />
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  productsRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  productsList: {
    paddingBottom: 5,
  },
  productCard: {
    width: Dimensions.get('window').width / 2 - 25,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  productImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#f5f5f5',
  },
  productInfoContainer: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    height: 36,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 6,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  soldText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
});

export default ViewShop;