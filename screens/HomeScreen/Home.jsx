import React, { useState, useCallback, useContext, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"; 
import * as Animatable from "react-native-animatable";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

// Internal Imports
import { COLORS } from "../../style/theme";
import API_URL from "../../api/api_urls";
import { Categories, SRPMonitoring } from "./component";
import { StaticProductStyle, CategoryModal } from "../Global";
import { AuthContext } from "../../auth/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import ProductsEnhanced from "../Global/ProductsEnhanced";

const { width } = Dimensions.get('window');

// --- 3D AR PRODUCTS ---
const AR_PRODUCTS = [
  {
    id: 'ar-1',
    name: 'BottleFlask',
    price: '₱1,500',
    image: 'https://www.leedsworldrefill.com/mm5/graphics/00000001/1/1601-92-6_400x400.jpg', 
    model: 'https://github.com/def-garet/biznest-assets/raw/refs/heads/main/bottle.glb' 
  },
  {
    id: 'ar-2',
    name: 'Nordic Chair',
    price: '₱3,500',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&q=80', 
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb' 
  },
  {
    id: 'ar-3',
    name: 'PaintDollies Handcraft Bag',
    price: '₱3000',
    image: 'https://i.pinimg.com/736x/b7/ad/9c/b7ad9cf8b2213af0d2214c8a671ae819.jpg',
    model: 'https://github.com/def-garet/biznest-assets/raw/refs/heads/main/wovenbag.glb'
  }
];

const Home = () => {
  const navigation = useNavigation();

  const [productsample, setProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const [seasonalproduct, setSeasonalProduct] = useState([]);
  const [simplebuyerinfo, setSimpleBuyerInfo] = useState({});
  const [scrollableproducts, setScrollableProducts] = useState([]);
  
  // UI States
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Scroll To Top Logic
  const [showScrollTop, setShowScrollTop] = useState(false);
  const flatListRef = useRef(null);

  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const isFocused = useIsFocused();
  const { userToken, ProtectedNavigation } = useContext(AuthContext);

  // --- HANDLER: OPEN 3D AR ---
  const openArView = (item) => {
    navigation.navigate('ARLiveView', { 
      productModel: item.model 
    });
  };

  // --- API CALLS ---

  const fetchScrollableProduct = async (category = activeCategory) => {
    if (refreshing || (totalPages && page > totalPages)) return;

    setRefreshing(true);
    try {
      const response = await axios.post(`${API_URL}/api/v1/Product/product_pagination`, {
        page,
        per_page: 10,
        category: category === "All" ? null : category,
      });

      const { products = [], total_pages } = response.data;

      if (page === 1) {
        setScrollableProducts(products);
      } else {
        setScrollableProducts((prev) => [...prev, ...products]);
      }

      if (total_pages) setTotalPages(total_pages);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching pagination:", error.response?.data || error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchSeasonalProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/Seasonal Product/seasonal_products/active/latest`);
      setSeasonalProduct(response.data);
    } catch (error) {
      console.error("Error fetching seasonal:", error);
    }
  };

  const fetchBuyerInfo = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/Profile/buyer_profile/simpleinfo`);
      setSimpleBuyerInfo(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/Product/product_api`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/Category/biznest_api`);
      setCategories([{ id: 0, name: "All" }, ...response.data]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProduct();
      fetchCategory();
      fetchSeasonalProduct();
      fetchBuyerInfo();
      fetchScrollableProduct();
    }, [])
  );

  // --- HANDLERS ---

  const handleCategoryPress = (category) => {
    setActiveCategory(category.name);
    setShowFilterModal(false);
    
    setPage(1);
    setScrollableProducts([]); 
    fetchScrollableProduct(category.name);

    if (category.name === "All") {
      setFilteredProducts(productsample);
    } else {
      const filtered = productsample.filter(
        (item) => item.category?.toLowerCase() === category.name.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  };

  useEffect(() => {
    if (productsample.length > 0) {
      setFilteredProducts(productsample);
    }
  }, [productsample]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await Promise.all([
      fetchScrollableProduct(),
      fetchProduct(),
      fetchSeasonalProduct(),
      fetchBuyerInfo()
    ]);
    setRefreshing(false);
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 300) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // --- RENDERERS ---

  const renderHeader = () => (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.topBar}>
          {userToken ? (
            <View style={styles.userInfo}>
              <View style={styles.locationIconBg}>
                <Ionicons name="location-sharp" size={18} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.greetingText}>Delivering to</Text>
                <Text style={styles.addressText} numberOfLines={1}>
                  {simplebuyerinfo?.address || "Select Location"}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1 }} />
          )}

          <View style={styles.headerIcons}>
            <TouchableOpacity
              onPress={() => ProtectedNavigation("UserLike", navigation)}
              style={styles.iconBtn}
            >
              <FontAwesome name="heart-o" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => ProtectedNavigation("MyCart", navigation)}
              style={styles.iconBtn}
            >
              <Ionicons name="bag-handle-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.searchContainer}
          onPress={() => navigation.navigate("Search")}
          activeOpacity={0.9}
        >
          <FontAwesome name="search" size={18} color={COLORS.text} />
          <Text style={styles.searchPlaceholder}>Search products, categories...</Text>
          <View style={styles.cameraBtn}>
             <Ionicons name="camera-outline" size={20} color={COLORS.primary} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.bodyContainer}>
        
        {/* Categories */}
        <View style={styles.sectionContainer}>
           <Categories />
        </View>

        {/* Price Watch */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Price Watch</Text>
            <Ionicons name="stats-chart" size={18} color={COLORS.secondary} />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("SRPDetails")} activeOpacity={0.8}>
            <Animatable.View animation="fadeIn" duration={800} style={styles.srpCard}>
               <SRPMonitoring />
            </Animatable.View>
          </TouchableOpacity>
        </View>

        {/* Seasonal */}
        <View style={styles.sectionContainer}>
           <Text style={styles.sectionTitle}>Seasonal Picks</Text>
           <ProductsEnhanced data={seasonalproduct} />
        </View>

        {/* --- VIRTUAL SHOWROOM (3D AR) --- */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Virtual Showroom (3D)</Text>
            <MaterialCommunityIcons name="augmented-reality" size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.arSubtitle}>Preview & Rotate items in 3D</Text>
          
          <FlatList 
            horizontal
            data={AR_PRODUCTS}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.arCard}
                activeOpacity={0.9}
                onPress={() => openArView(item)}
              >
                <ImageBackground 
                  source={{ uri: item.image }} 
                  style={styles.arCardImage} 
                  imageStyle={{ borderRadius: 12, resizeMode: 'contain', backgroundColor: '#F8FAFC' }}
                >
                  <View style={styles.arOverlay}>
                    <View style={styles.arBadge}>
                      <MaterialCommunityIcons name="cube-scan" size={14} color="#FFF" />
                      <Text style={styles.arBadgeText}>3D View</Text>
                    </View>
                  </View>
                </ImageBackground>
                <View style={styles.arDetails}>
                  <Text style={styles.arProductName}>{item.name}</Text>
                  <Text style={styles.arProductPrice}>{item.price}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          <Text style={styles.allProductsTitle}>All Products</Text>
          <TouchableOpacity
            style={styles.filterPill}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons name="filter" size={16} color={COLORS.primary} />
            <Text style={styles.filterText}>
              {activeCategory === "All" ? "Filter" : activeCategory}
            </Text>
            <Ionicons name="chevron-down" size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }} edges={['top']}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      <FlatList
        ref={flatListRef}
        data={scrollableproducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        style={styles.flatList}
        ListHeaderComponent={renderHeader}
        onEndReached={fetchScrollableProduct}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
            <View style={{ flex: 0.5, maxWidth: '48%' }}> 
               <StaticProductStyle data={[item]} />
            </View>
        )}
        ListFooterComponent={
          refreshing && scrollableproducts.length > 0 ? (
            <ActivityIndicator size="small" color={COLORS.primary} style={{ padding: 20 }} />
          ) : <View style={{ height: 40 }} />
        }
      />

      {showScrollTop && (
        <Animatable.View animation="fadeInUp" duration={300} style={styles.scrollTopContainer}>
          <TouchableOpacity style={styles.scrollTopButton} onPress={scrollToTop}>
            <Ionicons name="arrow-up" size={24} color="white" />
          </TouchableOpacity>
        </Animatable.View>
      )}

      <CategoryModal
        visible={showFilterModal}
        categories={categories}
        activeCategory={activeCategory}
        onClose={() => setShowFilterModal(false)}
        onSelectCategory={handleCategoryPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingBottom: 25, 
    paddingTop: 10,
    zIndex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIconBg: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 12,
    marginRight: 10,
  },
  greetingText: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 2,
  },
  addressText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    maxWidth: width * 0.5,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 12,
    marginLeft: 10,
  },
  searchContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: -45, 
    zIndex: 10,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.text,
    fontSize: 14,
  },
  cameraBtn: {
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },
  flatList: {
    backgroundColor: 'white',
  },
  listContent: {
    backgroundColor: 'white',
    paddingBottom: 20,
  },
  bodyContainer: {
    backgroundColor: 'white',
    paddingTop: 60, 
    paddingHorizontal: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20, 
    zIndex: 0,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  srpCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  
  // --- AR Styles ---
  arSubtitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
    marginTop: -5,
  },
  arCard: {
    width: 160,
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  arCardImage: {
    width: '100%',
    height: 140, // Slightly taller for better product view
    justifyContent: 'flex-end',
  },
  arOverlay: {
    padding: 8,
  },
  arBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  arBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  arDetails: {
    padding: 10,
  },
  arProductName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  arProductPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },

  // --- Filter & Grid ---
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 5,
  },
  allProductsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterText: {
    marginHorizontal: 8,
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  scrollTopContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 999,
  },
  scrollTopButton: {
    backgroundColor: COLORS.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});

export default Home;