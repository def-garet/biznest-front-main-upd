

// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   StyleSheet,
//   Dimensions,
//   FlatList,
//   Animated,
//   StatusBar,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import axios from "axios";
// import API_URL from "../api/api_urls.jsx";
// import { useNavigation } from "@react-navigation/native";
// import axiosInstance from "../api/axiosInstance.js";

// const { width } = Dimensions.get("window");

// const Store = () => {
//   const [productsample, setProduct] = useState(null);
//   const [BestProduct, setBestProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeCategory, setActiveCategory] = useState("1");
//   const [scrollY] = useState(new Animated.Value(0));
//   const [recommendedproduct, setRecommendedProduct] = useState([]);

//   const navigation = useNavigation();

//   // Modern, clean categories
//   const categories = [
//     { id: "1", name: "All", icon: "grid", color: "#1e293b" },
//     { id: "2", name: "Crafts", icon: "scissors", color: "#059669" },
//     { id: "3", name: "Fashion", icon: "shopping-bag", color: "#d97706" },
//     { id: "4", name: "Home", icon: "home", color: "#dc2626" },
//     { id: "5", name: "Food", icon: "coffee", color: "#7c3aed" },
//     { id: "6", name: "Art", icon: "feather", color: "#0891b2" },
//   ];

//   useEffect(() => {
//     fetchProduct();
//     fetchRecommendedProduct();
//   }, []);

//   const fetchProduct = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/v1/Product/product_api`);
//       setProduct(response.data);
//       const bestseller = response.data.sort((a, b) => b.rating - a.rating);
//       setBestProduct(bestseller);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRecommendedProduct = async () => {
//     try {
//       const response = await axiosInstance.get(`/api/v1/AI Recommendation/buyer_recommendation`);
//       const productList = response.data.map((item) => item.product_info);
//       setRecommendedProduct(productList);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleTradePress = () => {
//     navigation.navigate("TradeScreen");
//   };

//   // --- RENDER HELPERS (Internal Components for cleaner look) ---

//   const CategoryItem = ({ item }) => {
//     const isActive = activeCategory === item.id;
//     return (
//       <TouchableOpacity
//         style={styles.categoryItem}
//         onPress={() => setActiveCategory(item.id)}
//       >
//         <View
//           style={[
//             styles.categoryIconContainer,
//             isActive && { backgroundColor: item.color },
//           ]}
//         >
//           <Feather
//             name={item.icon}
//             size={20}
//             color={isActive ? "#fff" : "#64748b"}
//           />
//         </View>
//         <Text
//           style={[
//             styles.categoryText,
//             isActive && { color: "#0f172a", fontWeight: "600" },
//           ]}
//         >
//           {item.name}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   const ProductCard = ({ item, isHorizontal = false }) => (
//     <TouchableOpacity
//       style={isHorizontal ? styles.cardHorizontal : styles.cardGrid}
//       onPress={() => navigation.navigate("ProductDetails", { product_id: item.id })}
//       activeOpacity={0.9}
//     >
//       <View style={styles.imageWrapper}>
//         <Image source={{ uri: item.image }} style={styles.productImage} />
//         {item.discount > 0 && (
//             <View style={styles.discountBadge}>
//                 <Text style={styles.discountText}>{item.discount}% OFF</Text>
//             </View>
//         )}
//       </View>
//       <View style={styles.productInfo}>
//         <Text style={styles.productName} numberOfLines={1}>
//           {item.product}
//         </Text>
//         <View style={styles.priceRow}>
//           <Text style={styles.productPrice}>₱{item.price}</Text>
//           <View style={styles.ratingRow}>
//             <Ionicons name="star" size={12} color="#f59e0b" />
//             <Text style={styles.ratingText}>{item.rating || "4.8"}</Text>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const BestSellerRow = ({ item, index }) => (
//     <TouchableOpacity
//       style={styles.bestSellerRow}
//       onPress={() => navigation.navigate("ProductDetails", { product_id: item.id })}
//     >
//       <Text style={styles.rankNumber}>{index + 1}</Text>
//       <Image source={{ uri: item.image }} style={styles.bestSellerImg} />
//       <View style={styles.bestSellerContent}>
//         <Text style={styles.bestSellerName} numberOfLines={1}>
//           {item.product}
//         </Text>
//         <Text style={styles.bestSellerPrice}>₱{item.price}</Text>
//       </View>
//       <TouchableOpacity style={styles.miniTradeBtn} onPress={handleTradePress}>
//         <FontAwesome5 name="exchange-alt" size={12} color="#2563eb" />
//       </TouchableOpacity>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.headerSubtitle}>Good Morning,</Text>
//           <Text style={styles.headerTitle}>Find Your Treasure</Text>
//         </View>
//         <TouchableOpacity style={styles.iconButton}>
//              <Feather name="search" size={24} color="#1e293b" />
//         </TouchableOpacity>
//       </View>

//       <Animated.ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//         onScroll={Animated.event(
//             [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//             { useNativeDriver: true }
//         )}
//       >
        
//         {/* Banner - Clean & Modern */}
//         <View style={styles.bannerContainer}>
//           <Image
//             source={require("../assets/products/banner1.png")}
//             style={styles.bannerImage}
//           />
//           <View style={styles.bannerOverlay}>
//             <View>
//                 <Text style={styles.bannerTitle}>Artisan Festival</Text>
//                 <Text style={styles.bannerSubtitle}>Handcrafted with love</Text>
//             </View>
//             <TouchableOpacity style={styles.bannerBtn}>
//                 <Text style={styles.bannerBtnText}>Explore</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Categories */}
//         <View style={styles.sectionNoPad}>
//           <FlatList
//             data={categories}
//             renderItem={({ item }) => <CategoryItem item={item} />}
//             keyExtractor={(item) => item.id}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.categoryList}
//           />
//         </View>

//         {/* Trending Section - Horizontal Scroll */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Trending Now</Text>
//             <TouchableOpacity onPress={() => navigation.navigate("AllProducts", { title: "Trending", initialProducts: productsample })}>
//                 <Text style={styles.seeAll}>See All</Text>
//             </TouchableOpacity>
//           </View>
//           {loading ? (
//              <ActivityIndicator color="#2563eb" />
//           ) : (
//             <FlatList
//                 data={productsample?.slice(0, 5)}
//                 renderItem={({ item }) => <ProductCard item={item} isHorizontal={true} />}
//                 keyExtractor={(item) => item.id.toString()}
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={{ paddingLeft: 20 }}
//             />
//           )}
//         </View>

//         {/* Best Sellers - Clean List */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Best Sellers</Text>
//           <View style={styles.bestSellerList}>
//             {BestProduct?.slice(0, 4).map((item, index) => (
//                <BestSellerRow key={item.id} item={item} index={index} />
//             ))}
//           </View>
//         </View>

//         {/* Special Offer - Modern Gradient-ish feel */}
//         <View style={styles.offerContainer}>
//             <View style={styles.offerContent}>
//                 <MaterialCommunityIcons name="ticket-percent-outline" size={32} color="#fff" />
//                 <View style={{marginLeft: 15, flex: 1}}>
//                     <Text style={styles.offerTitle}>Weekend Deal</Text>
//                     <Text style={styles.offerSub}>Get 20% off on all local crafts</Text>
//                 </View>
//                 <Feather name="chevron-right" size={24} color="#fff" />
//             </View>
//         </View>

//         {/* New Arrivals & Recommended - Clean Grid */}
//         <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//                 <Text style={styles.sectionTitle}>New Arrivals</Text>
//             </View>
//             <View style={styles.gridContainer}>
//                 {productsample?.slice(0, 6).map((item) => (
//                     <ProductCard key={item.id} item={item} />
//                 ))}
//             </View>
//         </View>
        
//         {/* Recommended */}
//         {recommendedproduct.length > 0 && (
//             <View style={styles.section}>
//                 <View style={styles.sectionHeader}>
//                     <Text style={styles.sectionTitle}>Recommended For You</Text>
//                 </View>
//                 <View style={styles.gridContainer}>
//                     {recommendedproduct.slice(0, 4).map((item) => (
//                         <ProductCard key={item.id} item={item} />
//                     ))}
//                 </View>
//             </View>
//         )}

//       </Animated.ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//   },
//   scrollContent: {
//     paddingBottom: 40,
//   },
  
//   // Header
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 10,
//     paddingBottom: 15,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#64748b',
//     fontWeight: '500',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#1e293b',
//     letterSpacing: -0.5,
//   },
//   iconButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#f8fafc',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   // Banner
//   bannerContainer: {
//     marginHorizontal: 20,
//     height: 180,
//     borderRadius: 24,
//     overflow: 'hidden',
//     position: 'relative',
//     marginBottom: 25,
//   },
//   bannerImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   bannerOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     padding: 20,
//     justifyContent: 'flex-end',
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//   },
//   bannerTitle: {
//     color: '#fff',
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   bannerSubtitle: {
//     color: '#f1f5f9',
//     fontSize: 14,
//     marginTop: 4,
//   },
//   bannerBtn: {
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginLeft: 'auto',
//   },
//   bannerBtnText: {
//     color: '#1e293b',
//     fontWeight: '600',
//     fontSize: 12,
//   },

//   // Categories
//   sectionNoPad: {
//     marginBottom: 30,
//   },
//   categoryList: {
//     paddingHorizontal: 20,
//   },
//   categoryItem: {
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   categoryIconContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#f1f5f9',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   categoryText: {
//     fontSize: 12,
//     color: '#64748b',
//     fontWeight: '500',
//   },

//   // Sections
//   section: {
//     marginBottom: 30,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     marginBottom: 15,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1e293b',
//     paddingHorizontal: 20, // Align with grid if header is separate
//   },
//   seeAll: {
//     fontSize: 14,
//     color: '#2563eb',
//     fontWeight: '500',
//   },

//   // Cards (Horizontal)
//   cardHorizontal: {
//     width: 160,
//     marginRight: 16,
//     backgroundColor: '#fff',
//     // No borders, relying on spacing
//   },
//   imageWrapper: {
//     width: '100%',
//     height: 160,
//     borderRadius: 16,
//     backgroundColor: '#f8fafc',
//     marginBottom: 10,
//     overflow: 'hidden',
//   },
//   productImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   discountBadge: {
//     position: 'absolute',
//     top: 8,
//     left: 8,
//     backgroundColor: '#ef4444',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   discountText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: '700',
//   },
//   productName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#334155',
//     marginBottom: 4,
//   },
//   priceRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   productPrice: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1e293b',
//   },
//   ratingRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fffbeb',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 6,
//   },
//   ratingText: {
//     fontSize: 10,
//     fontWeight: '600',
//     color: '#b45309',
//     marginLeft: 2,
//   },

//   // Best Seller List
//   bestSellerList: {
//     paddingHorizontal: 20,
//     marginTop: 10,
//   },
//   bestSellerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   rankNumber: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#cbd5e1',
//     width: 24,
//   },
//   bestSellerImg: {
//     width: 56,
//     height: 56,
//     borderRadius: 12,
//     backgroundColor: '#f1f5f9',
//     marginHorizontal: 12,
//   },
//   bestSellerContent: {
//     flex: 1,
//   },
//   bestSellerName: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#1e293b',
//     marginBottom: 2,
//   },
//   bestSellerPrice: {
//     fontSize: 14,
//     color: '#64748b',
//   },
//   miniTradeBtn: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#eff6ff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   // Offer
//   offerContainer: {
//     marginHorizontal: 20,
//     marginBottom: 30,
//     backgroundColor: '#2563eb', // Solid bold color instead of border
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: "#2563eb",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   offerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   offerTitle: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '700',
//   },
//   offerSub: {
//     color: '#bfdbfe',
//     fontSize: 13,
//   },

//   // Grid Layout
//   gridContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     paddingHorizontal: 20,
//     justifyContent: 'space-between',
//   },
//   cardGrid: {
//     width: (width - 55) / 2, // Calculated width for 2 columns with spacing
//     marginBottom: 24,
//   },

// });

// export default Store;

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import API_URL from "../api/api_urls.jsx";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "../api/axiosInstance.js";

const { width } = Dimensions.get("window");

const Store = () => {
  const [productsample, setProduct] = useState(null);
  const [BestProduct, setBestProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("1");
  const [scrollY] = useState(new Animated.Value(0));
  const [recommendedproduct, setRecommendedProduct] = useState([]);

  const navigation = useNavigation();

  // Modern, clean categories
  const categories = [
    { id: "1", name: "All", icon: "grid", color: "#1e293b" },
    { id: "2", name: "Crafts", icon: "scissors", color: "#059669" },
    { id: "3", name: "Fashion", icon: "shopping-bag", color: "#d97706" },
    { id: "4", name: "Home", icon: "home", color: "#dc2626" },
    { id: "5", name: "Food", icon: "coffee", color: "#7c3aed" },
    { id: "6", name: "Art", icon: "feather", color: "#0891b2" },
  ];

  useEffect(() => {
    fetchProduct();
    fetchRecommendedProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/Product/product_api`);
      setProduct(response.data);
      const bestseller = response.data.sort((a, b) => b.rating - a.rating);
      setBestProduct(bestseller);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedProduct = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/AI Recommendation/buyer_recommendation`);
      const productList = response.data.map((item) => item.product_info);
      setRecommendedProduct(productList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleTradePress = () => {
    navigation.navigate("TradeScreen");
  };

  // --- RENDER HELPERS (Internal Components for cleaner look) ---

  const CategoryItem = ({ item }) => {
    const isActive = activeCategory === item.id;
    return (
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => setActiveCategory(item.id)}
      >
        <View
          style={[
            styles.categoryIconContainer,
            isActive && { backgroundColor: item.color },
          ]}
        >
          <Feather
            name={item.icon}
            size={20}
            color={isActive ? "#fff" : "#64748b"}
          />
        </View>
        <Text
          style={[
            styles.categoryText,
            isActive && { color: "#0f172a", fontWeight: "600" },
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const ProductCard = ({ item, isHorizontal = false }) => (
    <TouchableOpacity
      style={isHorizontal ? styles.cardHorizontal : styles.cardGrid}
      onPress={() => navigation.navigate("ProductDetails", { product_id: item.id })}
      activeOpacity={0.9}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        {item.discount > 0 && (
            <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{item.discount}% OFF</Text>
            </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.product}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>₱{item.price}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color="#f59e0b" />
            <Text style={styles.ratingText}>{item.rating || "4.8"}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const BestSellerRow = ({ item, index }) => (
    <TouchableOpacity
      style={styles.bestSellerRow}
      onPress={() => navigation.navigate("ProductDetails", { product_id: item.id })}
    >
      <Text style={styles.rankNumber}>{index + 1}</Text>
      <Image source={{ uri: item.image }} style={styles.bestSellerImg} />
      <View style={styles.bestSellerContent}>
        <Text style={styles.bestSellerName} numberOfLines={1}>
          {item.product}
        </Text>
        <Text style={styles.bestSellerPrice}>₱{item.price}</Text>
      </View>
      <TouchableOpacity style={styles.miniTradeBtn} onPress={handleTradePress}>
        <FontAwesome5 name="exchange-alt" size={12} color="#2563eb" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Good Morning,</Text>
          <Text style={styles.headerTitle}>Find Your Treasure</Text>
        </View>
        
        {/* Added Trade Button Group */}
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleTradePress}
          >
               <Feather name="repeat" size={20} color="#1e293b" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton}>
               <Feather name="search" size={20} color="#1e293b" />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
        )}
      >
        
        {/* Banner - Clean & Modern */}
        <View style={styles.bannerContainer}>
          <Image
            source={require("../assets/products/banner1.png")}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <View>
                <Text style={styles.bannerTitle}>Artisan Festival</Text>
                <Text style={styles.bannerSubtitle}>Handcrafted with love</Text>
            </View>
            <TouchableOpacity style={styles.bannerBtn}>
                <Text style={styles.bannerBtnText}>Explore</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.sectionNoPad}>
          <FlatList
            data={categories}
            renderItem={({ item }) => <CategoryItem item={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {/* Trending Section - Horizontal Scroll */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <TouchableOpacity onPress={() => navigation.navigate("AllProducts", { title: "Trending", initialProducts: productsample })}>
                <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
             <ActivityIndicator color="#2563eb" />
          ) : (
            <FlatList
                data={productsample?.slice(0, 5)}
                renderItem={({ item }) => <ProductCard item={item} isHorizontal={true} />}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 20 }}
            />
          )}
        </View>

        {/* Best Sellers - Clean List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Best Sellers</Text>
          <View style={styles.bestSellerList}>
            {BestProduct?.slice(0, 4).map((item, index) => (
               <BestSellerRow key={item.id} item={item} index={index} />
            ))}
          </View>
        </View>

        {/* Special Offer - Modern Gradient-ish feel */}
        <View style={styles.offerContainer}>
            <View style={styles.offerContent}>
                <MaterialCommunityIcons name="ticket-percent-outline" size={32} color="#fff" />
                <View style={{marginLeft: 15, flex: 1}}>
                    <Text style={styles.offerTitle}>Weekend Deal</Text>
                    <Text style={styles.offerSub}>Get 20% off on all local crafts</Text>
                </View>
                <Feather name="chevron-right" size={24} color="#fff" />
            </View>
        </View>

        {/* New Arrivals & Recommended - Clean Grid */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>New Arrivals</Text>
            </View>
            <View style={styles.gridContainer}>
                {productsample?.slice(0, 6).map((item) => (
                    <ProductCard key={item.id} item={item} />
                ))}
            </View>
        </View>
        
        {/* Recommended */}
        {recommendedproduct.length > 0 && (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recommended For You</Text>
                </View>
                <View style={styles.gridContainer}>
                    {recommendedproduct.slice(0, 4).map((item) => (
                        <ProductCard key={item.id} item={item} />
                    ))}
                </View>
            </View>
        )}

      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Banner
  bannerContainer: {
    marginHorizontal: 20,
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 25,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    color: '#f1f5f9',
    fontSize: 14,
    marginTop: 4,
  },
  bannerBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 'auto',
  },
  bannerBtnText: {
    color: '#1e293b',
    fontWeight: '600',
    fontSize: 12,
  },

  // Categories
  sectionNoPad: {
    marginBottom: 30,
  },
  categoryList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },

  // Sections
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    paddingHorizontal: 20, // Align with grid if header is separate
  },
  seeAll: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },

  // Cards (Horizontal)
  cardHorizontal: {
    width: 160,
    marginRight: 16,
    backgroundColor: '#fff',
    // No borders, relying on spacing
  },
  imageWrapper: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    marginBottom: 10,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#b45309',
    marginLeft: 2,
  },

  // Best Seller List
  bestSellerList: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  bestSellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#cbd5e1',
    width: 24,
  },
  bestSellerImg: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 12,
  },
  bestSellerContent: {
    flex: 1,
  },
  bestSellerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  bestSellerPrice: {
    fontSize: 14,
    color: '#64748b',
  },
  miniTradeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Offer
  offerContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#2563eb', // Solid bold color instead of border
    borderRadius: 20,
    padding: 20,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  offerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  offerSub: {
    color: '#bfdbfe',
    fontSize: 13,
  },

  // Grid Layout
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  cardGrid: {
    width: (width - 55) / 2, // Calculated width for 2 columns with spacing
    marginBottom: 24,
  },

});

export default Store;