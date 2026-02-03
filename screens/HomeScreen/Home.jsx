// import React, { useState, useCallback } from "react";
// import {
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   RefreshControl,
//   StatusBar,
//   Image,
//   StyleSheet,
//   Linking,
//   Modal,
//   Pressable,
//   Dimensions,
//   Animated,
//   FlatList,
//   ActivityIndicator
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useFocusEffect, useIsFocused } from "@react-navigation/native";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import * as Animatable from "react-native-animatable";
// import axios from "axios";
// import { useNavigation } from "@react-navigation/native";
// import { DinagyangProducts } from "../SeasonalCompenents";

// import { COLORS } from "../../style/theme";
// import style from "../../style/home.style";
// import API_URL  from "../../api/api_urls";
// import { Categories, Slider, SRPMonitoring } from "./component";
// import { StaticProductStyle,CategoryModal,HomeProductsInfinite } from "../Global";
// import { AuthContext } from "../../auth/AuthContext";
// import { useContext, useEffect } from "react";
// import  axiosInstance  from "../../api/axiosInstance"; 
// import ProductsEnhanced from "../Global/ProductsEnhanced";

// const API_Like = `${API_URL}/api/v1/Buyer Likes/buyer_like`;

// const { width } = Dimensions.get('window');
// const itemWidth = (width - 36) / 2;
// const Home = () => {
//   const navigation = useNavigation();
//   const [productsample, setProduct] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [activeCategory, setActiveCategory] = useState("All");
//   const isFocused = useIsFocused();
//   const { userToken, ProtectedNavigation } = useContext(AuthContext);
//   const fadeAnim = React.useRef(new Animated.Value(0)).current;
//   const [likedItems, setLikedItems] = useState({});
//   const [simplebuyerinfo,setSimpleBuyerInfo]=useState({})
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [seasonalproduct, setSeasonalProduct] = useState([]);

//   const [wishlist, setWishlist] = useState([]);

//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [scrollableproducts, setScrollableProducts] = useState([]);
  
// //  const fetchScrollableProduct = async () => {
// //   if (refreshing || (totalPages && page > totalPages)) return;

// //   setRefreshing(true);
// //   try {
// //     const response = await axios.post(`${API_URL}/api/v1/Product/product_pagination`, {
// //       page,
// //       per_page: 10,
// //     });

// //     const { products = [], total_pages } = response.data;
// //     console.log("dsadasda",page)
// //     if (page === 1) {
// //       setScrollableProducts(products);
// //     } else {
// //       setScrollableProducts((prev) => [...prev, ...products]);
// //     }

// //     if (total_pages) setTotalPages(total_pages);
// //     setPage((prev) => prev + 1);
// //   } catch (error) {
// //     console.error("Error fetching products:", error.response?.data || error.message);
// //   } finally {
// //     setRefreshing(false);
// //   }
// // };

// const fetchScrollableProduct = async (category = activeCategory) => {
//   if (refreshing || (totalPages && page > totalPages)) return;

//   setRefreshing(true);
//   try {
//     const response = await axios.post(`${API_URL}/api/v1/Product/product_pagination`, {
//       page,
//       per_page: 10,
//       category: category === "All" ? null : category,
//     });

//     const { products = [], total_pages } = response.data;

//     if (page === 1) {
//       setScrollableProducts(products);
//     } else {
//       setScrollableProducts((prev) => [...prev, ...products]);
//     }

//     if (total_pages) setTotalPages(total_pages);
//     setPage((prev) => prev + 1);
//   } catch (error) {
//     console.error("Error fetching products:", error.response?.data || error.message);
//   } finally {
//     setRefreshing(false);
//   }
// };




//   // Iloilo local products data
//   const allProducts = [
//     // Food items
//     {
//       id: 1,
//       store: "Organic Products",
//       product: "Assorted Tarts",
//       price: 35,
//       originalPrice: 45,
//       image: "https://anec.global/cdn/shop/products/Untitleddesign_30_7a6265bd-6a8b-4a2a-9791-6e3fd4a58c39_grande.png?v=1645164662",
//       category: "Food",
//       rating: 5,
//       sold: 1250,
//     }
//   ];
  
//   const item = {
//   id: 4,
//   name: "HABLON Premium Barong Tagalog",
//   shop: "HABLON Barong & Filipiniana",
//   originalPrice: "₱1099",
//   price: "₱989",
//   discount: "10% off",
//   rating: "4.9",
//   sold: "800 sold",
//   shipping: "3-6 Days",
//   location: "Iloilo City",
//   image: "https://down-ph.img.susercontent.com/file/ph-11134207-7r98o-lzqcvjj2ym4a53",
//   isPreferred: false,
//   hasFreeShipping: true,
// };

//   // const categories_list = [
//   //   { id: 1, name: "All" },
//   //   { id: 2, name: "Food" },
//   //   { id: 3, name: "Beverage" },
//   //   { id: 4, name: "Pasalubong" },
//   //   { id: 5, name: "Handicrafts" },
//   //   { id: 6, name: "Home Decor" },
//   //   { id: 7, name: "Fashion" }
//   // ];
//   const fetchSeasonalProduct = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/v1/Seasonal Product/seasonal_products/active/latest`);
//       setSeasonalProduct(response.data);
//     } catch (error) {
//       console.error("Error fetching product:", error);
//     } finally {
//       setRefreshing(false);
//     }
//   };


// const fetchBuyerInfo = async () => {
//     try {
//       const response = await axiosInstance.get(`/api/v1/Profile/buyer_profile/simpleinfo`);
//       setSimpleBuyerInfo(response.data);
//     } catch (error) {
//       console.error("Error fetching product:", error);
//     } finally {
//       setRefreshing(false);
//     }
//   };


//   const fetchProduct = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/v1/Product/product_api`);
//       setProduct(response.data);
//     } catch (error) {
//       console.error("Error fetching product:", error);
//     } finally {
//       setRefreshing(false);
//     }
//   };






//   const fetchCategory = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/api/v1/Category/biznest_api`);
//     // Append fetched categories while keeping the default "All"
//     setCategories([{ id: 0, name: "All" }, ...response.data]);
//   } catch (error) {
//     console.error("Error fetching product:", error);
//   } finally {
//     setRefreshing(false);
//   }
// };


//  const fetchLikes = async () => {
//       try {
//         const response = await axiosInstance.get(API_Like);
//         const likedMap = (response.data || []).reduce((acc, item) => ({
//           ...acc,
//           [item.product_info.id]: true
//         }), {});
//         setLikedItems(likedMap);
//       } catch (error) {
//         console.error("Error fetching likes:", error);
//       }
//     };



//   useFocusEffect(
//     useCallback(() => {
//       fetchProduct();
//       fetchCategory();
//       // fetchLikes();
//       fetchSeasonalProduct();
//       fetchBuyerInfo();
//       fetchScrollableProduct();
//     }, [])
//   );


//   // const toggleLike = async (product_id) => {
//   //   try {
//   //     likedItems[product_id] 
//   //       ? await axiosInstance.delete(`${API_Like}/${product_id}`)
//   //       : await axiosInstance.post(API_Like, { like_id: product_id });
      
//   //     setLikedItems(prev => ({ ...prev, [product_id]: !prev[product_id] }));
//   //   } catch (error) {
//   //     console.error("Error toggling like:", error);
//   //     Alert.alert("Error", "Failed to update like status");
//   //   }
//   // };


// const handleCategoryPress = (category) => {
//   setActiveCategory(category.name);
//   setShowFilterModal(false);

//   if (category.name === "All") {
//     setFilteredProducts(productsample);
//   } else {
//     const filtered = productsample.filter(
//       (item) => item.category?.toLowerCase() === category.name.toLowerCase()
//     );
//     setFilteredProducts(filtered);
//   }
// };


// useEffect(() => {
//   if (productsample.length > 0) {
//     setFilteredProducts(productsample);
//   }
// }, [productsample]);



//   React.useEffect(() => {
//     if (isFocused) {
//       fetchProduct();
//     }
//   }, [isFocused]);

//   const onRefresh =async  () => {
//     setRefreshing(true);
//     setPage(1); // reset to first page
//   await fetchScrollableProduct();
//     fetchProduct();
//   };

//   const handleProductPress = (product) => {
//     navigation.navigate("ProductDetails", { product_id: product.id });
//   };

//   // const handleCategoryPress = (category) => {
//   //   setActiveCategory(category.name);
//   //   setShowFilterModal(false);
//   // };

//   // const filteredProducts = activeCategory === "All" 
//   //   ? productsample 
//   //   : productsample.filter(product => product.category === activeCategory);

//  return (
//   <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }} edges={['top']}>
//     <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

//     <FlatList
//      data={scrollableproducts}
//   keyExtractor={(item) => item.id.toString()}
//   numColumns={2}
//   columnWrapperStyle={{
//     justifyContent: "space-between",
//     paddingHorizontal: 10,
//   }}
//   contentContainerStyle={{
//     paddingBottom: 20,
//     backgroundColor: "#fff", // ✅ makes inner scroll area white
//   }}
//   style={{
//     backgroundColor: "#fff", // ✅ makes the entire FlatList background white
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   }}
//   onEndReached={fetchScrollableProduct}
//   onEndReachedThreshold={0.5}
//   refreshing={refreshing}
//   renderItem={({ item }) => <StaticProductStyle data={[item]} />}
//   ListFooterComponent={
//     refreshing ? (
//       <ActivityIndicator
//         size="large"
//         color="#2563eb"
//         style={{ marginVertical: 20 }}
//       />
//     ) : null
//     }
//       ListHeaderComponent={
//         <>
//           {/* Header */}
//           <View style={style.HomeTopContainer}>
//             <View style={style.appBar}>
//               {userToken ? (
//                 <View style={style.appBarright}>
//                   <Ionicons name="location-outline" size={30} color={COLORS.background} />
//                   <View>
//                     <Text style={{ color: COLORS.background, fontSize: 20, fontWeight: "bold" ,textTransform: "capitalize"}}>
//                       {simplebuyerinfo?.address || "No address available"}
//                     </Text>
//                     <Text style={{ color: COLORS.background, textTransform: "capitalize" }}>
//                       {`${simplebuyerinfo?.f_name || ""} ${simplebuyerinfo?.l_name || ""}`}
//                     </Text>
//                   </View>
//                 </View>
//               ) : (
//                 <View style={{ width: '50%', height: 40 }} />
//               )}
//               <View style={style.appBarleft}>
//                 <TouchableOpacity
//                   onPress={() => ProtectedNavigation("UserLike", navigation)}
//                   activeOpacity={0.7}
//                   style={{ padding: 6 }}
//                 >
//                   <FontAwesome name="heart-o" size={24} color={COLORS.background} />
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => ProtectedNavigation("MyCart", navigation)}
//                   activeOpacity={0.7}
//                   style={{ padding: 6 }}
//                 >
//                   <Ionicons name="bag-handle-outline" size={24} color={COLORS.background} />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Search Bar */}
//             <View style={style.SearchContainer}>
//               <TouchableOpacity
//                 style={[style.searchBarcontainer, { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, flex: 1 }]}
//                 onPress={() => navigation.navigate("Search")}
//                 activeOpacity={0.7}
//               >
//                 <FontAwesome name="search" style={style.searchIcon} size={24} color="black" />
//                 <View style={style.searchwrapper}>
//                   <Text style={[style.textInput, { color: '#888' }]}>Search</Text>
//                 </View>
//               </TouchableOpacity>

//               <TouchableOpacity style={style.searchCamera} activeOpacity={0.7}>
//                 <Ionicons name="camera-outline" size={20} color="black" />
//               </TouchableOpacity>
//             </View>
//           </View>

//          {/* Body */}
// <View style={[style.homeBody, { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, flex: 1 }]}>
//   <Animatable.View animation="fadeInUp" duration={600} style={{ padding: 20 }}>

//     <Categories />


//     <Animatable.View animation="fadeIn" delay={100}>
//       <TouchableOpacity onPress={() => navigation.navigate("SRPDetails")}>
//         <SRPMonitoring />
//       </TouchableOpacity>
//     </Animatable.View>
    
//     <ProductsEnhanced data={seasonalproduct} />

//     {/* Filter Button */}
//     <TouchableOpacity
//       style={styles.filterButton}
//       onPress={() => setShowFilterModal(true)}
//       activeOpacity={0.7}
//     >
//       <Ionicons name="filter" size={20} color={COLORS.primary} />
//       <Text style={styles.filterButtonText}>
//         {activeCategory === "All" ? "All Categories" : activeCategory}
//       </Text>
//       <Ionicons name="chevron-down" size={16} color={COLORS.primary} />
//     </TouchableOpacity>

//     {/* All Products Grid */}
//     <View style={styles.productsGrid}>
//   {filteredProducts && filteredProducts.length > 0 ? (
//     filteredProducts.map((item) => (
//       <StaticProductStyle key={item.id} data={[item]} />
//     ))
//   ) : (
//     <Text style={styles.emptyText}>No products available</Text>
//   )}
// </View>

//     {/* Filter Modal */}
//     <Animatable.View animation="slideInUp" duration={300} style={styles.modalContent}>
//       <CategoryModal
//         visible={showFilterModal}
//         categories={categories}
//         activeCategory={activeCategory}
//         onClose={() => setShowFilterModal(false)}
//         onSelectCategory={handleCategoryPress}
//       />
//     </Animatable.View>
//   </Animatable.View>
// </View>
//         </>
//       }
//     />
//   </SafeAreaView>
// );
// };

// const styles = StyleSheet.create({
//   filterButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     marginBottom: 20,
//     alignSelf: 'flex-start'
//   },
//   filterButtonText: {
//     marginLeft: 8,
//     marginRight: 5,
//     color: COLORS.primary,
//     fontWeight: '500'
//   },
//   productsGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     paddingHorizontal: 10,
//     marginBottom: 2,
//   },
//   productCard: {
//     width: '48%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   productImage: {
//     width: '100%',
//     height: 120,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   productInfo: {
//     paddingHorizontal: 5
//   },
//   storeName: {
//     fontSize: 12,
//     color: '#555',
//     marginBottom: 2
//   },
//   productName: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 5,
//     height: 20
//   },
//   priceContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   discountedPrice: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#ff0000',
//     marginRight: 8,
//   },
//   originalPrice: {
//     fontSize: 12,
//     color: '#888',
//     textDecorationLine: 'line-through',
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center'
//   },
//   soldText: {
//     fontSize: 10,
//     color: '#888',
//     marginLeft: 5
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.5)'
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     maxHeight: '60%'
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center'
//   },
//   categoryItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0'
//   },
//   activeCategoryItem: {
//     backgroundColor: '#f5f5f5'
//   },
//   categoryText: {
//     fontSize: 16,
//     color: '#333'
//   },
//   activeCategoryText: {
//     color: COLORS.primary,
//     fontWeight: '500'
//   },
//   closeButton: {
//     backgroundColor: COLORS.primary,
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 20
//   },
//   closeButtonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontWeight: 'bold',
//     fontSize: 16
//   }
// });


// const COLORS_idea = {
//   primary: '#172d55',
//   secondary: '#2196f3',
//   background: '#f8f9fa',
//   text: '#6c757d',
//   border: '#e0e0e0',
//   discount: '#e53935',
//   freeShipping: '#4caf50',
//   highlight: '#ff6b6b',
//   rating: '#FFD700',
//   white: '#ffffff',
//   headerBg: '#172d55',
// };



// const styles_idea = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS_idea.background,
//   },
//   header: {
//     paddingTop: 40,
//     paddingBottom: 12,
//     paddingHorizontal: 16,
//     backgroundColor: COLORS_idea.headerBg,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//     zIndex: 10,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   backButton: {
//     marginRight: 12,
//   },
//   headerTitle: {
//     flex: 1,
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: COLORS_idea.white,
//   },
//   filterIcon: {
//     marginLeft: 12,
//   },
//   content: {
//     paddingHorizontal: 12,
//   },
//   filterContainer: {
//     marginVertical: 16,
//   },
//   filterContent: {
//     paddingHorizontal: 4,
//   },
//   filterButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     marginRight: 8,
//     borderRadius: 16,
//     backgroundColor: COLORS_idea.white,
//     borderWidth: 1,
//     borderColor: COLORS_idea.border,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   activeFilter: {
//     backgroundColor: COLORS_idea.primary,
//     borderColor: COLORS_idea.primary,
//   },
//   filterText: {
//     color: COLORS_idea.primary,
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   activeFilterText: {
//     color: COLORS_idea.white,
//   },
//   resultsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   resultsText: {
//     fontSize: 14,
//     color: COLORS_idea.text,
//   },
//   sortButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   sortText: {
//     fontSize: 14,
//     color: COLORS_idea.primary,
//     fontWeight: '500',
//     marginRight: 4,
//   },
//   productList: {
//     paddingBottom: 20,
//   },
//   row: {
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   productItem: {
//     width: '48%',
//     backgroundColor: COLORS_idea.white,
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: COLORS_idea.border,
//   },
//   imageContainer: {
//     position: 'relative',
//   },
//   productImage: {
//     width: '100%',
//     height: itemWidth,
//     resizeMode: 'cover',
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//   },
//   topBadges: {
//     position: 'absolute',
//     top: 8,
//     left: 8,
//     flexDirection: 'row',
//   },
//   badge: {
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 4,
//     marginRight: 6,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   badgeText: {
//     color: COLORS_idea.white,
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   newBadge: {
//     backgroundColor: COLORS_idea.highlight,
//   },
//   trendingBadge: {
//     backgroundColor: COLORS_idea.secondary,
//   },
//   freeShippingBadge: {
//     position: 'absolute',
//     bottom: 8,
//     left: 8,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 4,
//     backgroundColor: COLORS_idea.freeShipping,
//   },
//   wishlistButton: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   productDetails: {
//     padding: 12,
//   },
//   shopContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   preferredBadge: {
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//     marginRight: 6,
//     backgroundColor: COLORS_idea.secondary,
//   },
//   preferredText: {
//     color: COLORS_idea.white,
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   productShop: {
//     fontSize: 10,
//     color: COLORS_idea.text,
//     flexShrink: 1,
//   },
//   productName: {
//     fontSize: 13,
//     color: COLORS_idea.primary,
//     marginBottom: 8,
//     fontWeight: '600',
//     height: 36,
//     lineHeight: 16,
//   },
//   priceContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     marginBottom: 6,
//     flexWrap: 'wrap',
//   },
//   currentPrice: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     color: COLORS_idea.primary,
//     marginRight: 6,
//   },
//   originalPrice: {
//     fontSize: 12,
//     color: COLORS_idea.text,
//     textDecorationLine: 'line-through',
//     marginRight: 6,
//   },
//   discount: {
//     fontSize: 12,
//     color: COLORS_idea.discount,
//     fontWeight: 'bold',
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//     justifyContent: 'space-between',
//   },
//   ratingWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   ratingText: {
//     fontSize: 12,
//     color: COLORS_idea.primary,
//     marginLeft: 4,
//     fontWeight: '500',
//   },
//   soldText: {
//     fontSize: 12,
//     color: COLORS_idea.text,
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   locationText: {
//     fontSize: 11,
//     color: COLORS_idea.text,
//     marginLeft: 4,
//   },
//   // Modal styles_idea
//   modalOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 20,
//   },
//   modalContainer: {
//     backgroundColor: COLORS_idea.white,
//     borderRadius: 12,
//     padding: 20,
//     width: '80%',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: COLORS_idea.primary,
//   },
//   sortOption: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS_idea.border,
//   },
//   sortOptionText: {
//     fontSize: 16,
//     color: COLORS_idea.text,
//   },
//   selectedSortOption: {
//     color: COLORS_idea.primary,
//     fontWeight: 'bold',
//   },
//   closeButton: {
//     marginTop: 20,
//     padding: 12,
//     backgroundColor: COLORS_idea.primary,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     color: COLORS_idea.white,
//     fontWeight: 'bold',
//   },
// });




// export default Home;

import React, { useState, useCallback, useContext, useEffect, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions,
  Animated,
  FlatList,
  ActivityIndicator,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
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

const Home = () => {
  const navigation = useNavigation();
  
  // Data States
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
  
  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const isFocused = useIsFocused();
  const { userToken, ProtectedNavigation } = useContext(AuthContext);

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
    
    // Reset pagination for new category
    setPage(1);
    setScrollableProducts([]); 
    fetchScrollableProduct(category.name);

    // Filter local products sample
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

  // --- RENDERERS ---

  const renderHeader = () => (
    <>
      {/* 1. Header Background & Top Bar */}
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

        {/* 2. Floating Search Bar */}
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

      {/* 3. Main Content Body */}
      <View style={styles.bodyContainer}>
        
        {/* Categories Section */}
        <View style={styles.sectionContainer}>
           <Categories />
        </View>

        {/* Price Watch Section */}
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

        {/* Seasonal / Featured Section */}
        <View style={styles.sectionContainer}>
           <Text style={styles.sectionTitle}>Seasonal Picks</Text>
           <ProductsEnhanced data={seasonalproduct} />
        </View>

        {/* Filter Sticky Header Equivalent */}
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

      {/* Filter Modal */}
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
  // --- Header Styles ---
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingBottom: 25, // Space for floating search bar overlap
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

  // --- Search Bar Styles ---
  searchContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    // Floating Effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: -45, // Pulls it down to overlap with body
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

  // --- Body Styles ---
  flatList: {
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    backgroundColor: '#f8f9fa',
    paddingBottom: 20,
  },
  bodyContainer: {
    backgroundColor: '#f8f9fa',
    paddingTop: 60, // Space for the search bar overlap
    paddingHorizontal: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20, // Negative margin to blend with header if needed
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
    marginBottom: 10,
  },
  
  // --- Price Watch Card ---
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

  // --- Filter Row ---
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

  // --- Grid Styles ---
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
});

export default Home;