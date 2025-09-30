import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialIcons, AntDesign, FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import API_URL from "../api/api_urls.jsx";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window');

const Store = () => {
  const [productsample, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = useNavigation();
  

  // Sample categories data
  const categories = [
    { id: '1', name: 'Artisan Crafts', icon: 'smartphone' },
    { id: '2', name: 'Handmade Bag', icon: 'shopping-bag' },
    { id: '3', name: 'Home Decor', icon: 'home' },
    { id: '4', name: 'Popular', icon: 'smile' },
    { id: '5', name: 'Philippine Delicacies', icon: 'gift' },
  ];

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/Product/product_api`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.categoryIcon}>
        <Feather name={item.icon} size={24} color="#172d55" />
      </View>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const handleTradePress = (product) => {
    // Navigate to trade screen or open trade modal
    navigation.navigate("TradeOffer", { product });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color="#555" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, brands, and more"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="cancel" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.scanButton}>
          <Feather name="maximize" size={20} color="#172d55" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Categories Carousel */}
        <View style={styles.section}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {/* Promo Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={require("../assets/products/banner1.png")}
            style={styles.bannerImage}
          />
          <View style={styles.bannerIndicator}>
            <View style={[styles.indicatorDot, styles.activeDot]} />
            <View style={styles.indicatorDot} />
            <View style={styles.indicatorDot} />
          </View>
        </View>

        {/* Flash Sale Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Flash Sale</Text>
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>Ends in</Text>
                <View style={styles.timeBox}>
                  <Text style={styles.timeText}>02</Text>
                </View>
                <Text style={styles.timerSeparator}>:</Text>
                <View style={styles.timeBox}>
                  <Text style={styles.timeText}>45</Text>
                </View>
                <Text style={styles.timerSeparator}>:</Text>
                <View style={styles.timeBox}>
                  <Text style={styles.timeText}>12</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <ActivityIndicator size="large" color="#172d55" style={styles.loader} />
          ) : (
            <FlatList
              data={productsample?.slice(0, 4)}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.productCard}
                 onPress={() => navigation.navigate("ProductDetails", { product_id: item.id })}
                >
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.productImage}
                  />
                  <Text style={styles.productPrice}>₱{item.price}</Text>
                  <Text style={styles.originalPrice}>₱{item.price * 1.5}</Text>
                  <Text style={styles.discountTag}>-30%</Text>
                  <Text style={styles.productName} numberOfLines={2}>{item.product}</Text>
                  <View style={styles.soldTag}>
                    <Text style={styles.soldText}>{item.sold} sold</Text>
                  </View>
                  {/* Trade Button */}
                  <TouchableOpacity 
                    style={styles.tradeButton}
                    onPress={() => handleTradePress(item)}
                  >
                    <FontAwesome name="exchange" size={16} color="#172d55" />
                    <Text style={styles.tradeButtonText}>Trade</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.productList}
            />
          )}
        </View>

        {/* Exclusive Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exclusive Products</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <ActivityIndicator size="large" color="#172d55" style={styles.loader} />
          ) : (
            <View style={styles.gridContainer}>
              {productsample?.slice(0, 4).map(item => (
                <TouchableOpacity 
                key={item.id} 
                style={styles.gridProductCard}
                onPress={() => navigation.navigate("ProductDetails", { product_id: item.id })}
                >
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.gridProductImage}
                  />
                  <Text style={styles.gridProductPrice}>₱{item.price}</Text>
                  <Text style={styles.gridProductName} numberOfLines={2}>{item.product}</Text>
                  <View style={styles.ratingContainer}>
                    <AntDesign name="star" size={14} color="#FFC120" />
                    <Text style={styles.ratingText}>4.9</Text>
                    <Text style={styles.soldCount}> | {item.sold} sold</Text>
                  </View>
                  {/* Trade Button */}
                  <TouchableOpacity 
                    style={styles.gridTradeButton}
                    onPress={() => handleTradePress(item)}
                  >
                    <FontAwesome name="exchange" size={14} color="#172d55" />
                    <Text style={styles.gridTradeButtonText}>Trade</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Best Selling */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Best Selling</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <ActivityIndicator size="large" color="#172d55" style={styles.loader} />
          ) : (
            <View style={styles.gridContainer}>
              {productsample?.slice(4, 8).map(item => (
                <TouchableOpacity key={item.id} style={styles.gridProductCard}
                  onPress={() => navigation.navigate("ProductDetails", { product_id: item.id })}
                >
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.gridProductImage}
                  />
                  <Text style={styles.gridProductPrice}>₱{item.price}</Text>
                  <Text style={styles.gridProductName} numberOfLines={2}>{item.product}</Text>
                  <View style={styles.ratingContainer}>
                    <AntDesign name="star" size={14} color="#FFC120" />
                    <Text style={styles.ratingText}>4.9</Text>
                    <Text style={styles.soldCount}> | {item.sold} sold</Text>
                  </View>
                  {/* Trade Button */}
                  <TouchableOpacity 
                    style={styles.gridTradeButton}
                    onPress={() => handleTradePress(item)}
                  >
                    <FontAwesome name="exchange" size={14} color="#172d55" />
                    <Text style={styles.gridTradeButtonText}>Trade</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
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
    backgroundColor: "#F8F9FA",
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  scanButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
    backgroundColor: 'white',
    paddingVertical: 12,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF0E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  bannerContainer: {
    height: 150,
    marginVertical: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerIndicator: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#172d55',
    width: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 12,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 12,
    color: '#666',
    marginRight: 6,
  },
  timeBox: {
    backgroundColor: '#333',
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timerSeparator: {
    marginHorizontal: 2,
    color: '#333',
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#172d55',
    fontSize: 14,
  },
  productList: {
    paddingHorizontal: 16,
  },
  productCard: {
    width: 140,
    marginRight: 12,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
    resizeMode: 'contain',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#172d55',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  discountTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#172d55',
    color: 'white',
    fontSize: 12,
    paddingHorizontal: 4,
    borderRadius: 3,
    overflow: 'hidden',
  },
  productName: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
  soldTag: {
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  soldText: {
    fontSize: 10,
    color: '#666',
  },
  // Trade Button Styles
  tradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0E5',
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
  },
  tradeButtonText: {
    fontSize: 12,
    color: '#172d55',
    marginLeft: 4,
    fontWeight: '500',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  gridProductCard: {
    width: '48%',
    marginBottom: 12,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  gridProductImage: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
    resizeMode: 'contain',
    marginBottom: 8,
  },
  gridProductPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#172d55',
  },
  gridProductName: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 2,
  },
  soldCount: {
    fontSize: 11,
    color: '#666',
  },
  // Grid Trade Button Styles
  gridTradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0E5',
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 6,
  },
  gridTradeButtonText: {
    fontSize: 11,
    color: '#172d55',
    marginLeft: 4,
    fontWeight: '500',
  },
  loader: {
    marginVertical: 20,
  },
});

export default Store;