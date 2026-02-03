// // import React, { useEffect, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   Image,
// //   TouchableOpacity,
// //   ScrollView,
// //   ActivityIndicator,
// //   StyleSheet,
// //   Dimensions,
// //   FlatList
// // } from "react-native";
// // import { SafeAreaView } from "react-native-safe-area-context";
// // import { Feather, MaterialIcons, AntDesign, FontAwesome } from "@expo/vector-icons";
// // import axios from "axios";
// // import API_URL  from "../api/api_urls.jsx";
// // import { useNavigation } from "@react-navigation/native";

// // const { width } = Dimensions.get('window');

// // const Store = () => {
// //   const [productsample, setProduct] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [searchQuery, setSearchQuery] = useState("");

// //   const navigation = useNavigation();

// //   // Sample categories data
// //   const categories = [
// //     { id: '1', name: 'Artisan Crafts', icon: 'smartphone' },
// //     { id: '2', name: 'Handmade Bag', icon: 'shopping-bag' },
// //     { id: '3', name: 'Home Decor', icon: 'home' },
// //     { id: '4', name: 'Popular', icon: 'smile' },
// //     { id: '5', name: 'Philippine Delicacies', icon: 'gift' },
// //   ];

// //   useEffect(() => {
// //     fetchProduct();
// //   }, []);

// //   const fetchProduct = async () => {
// //     try {
// //       const response = await axios.get(`${API_URL}/api/v1/Product/product_api`);
// //       setProduct(response.data);
// //     } catch (error) {
// //       console.error("Error fetching data:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const renderCategoryItem = ({ item }) => (
// //     <TouchableOpacity style={styles.categoryItem}>
// //       <View style={styles.categoryIcon}>
// //         <Feather name={item.icon} size={24} color="#172d55" />
// //       </View>
// //       <Text style={styles.categoryText}>{item.name}</Text>
// //     </TouchableOpacity>
// //   );

// //   const handleTradePress = (product) => {
// //     // Navigate to trade screen or open trade modal
// //     navigation.navigate("TradeOffer", { product });
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       {/* Search Bar */}
// //       <View style={styles.searchContainer}>
// //         <View style={styles.searchInputContainer}>
// //           <Feather name="search" size={20} color="#555" style={styles.searchIcon} />
// //           <TextInput
// //             style={styles.searchInput}
// //             placeholder="Search products, brands, and more"
// //             placeholderTextColor="#888"
// //             value={searchQuery}
// //             onChangeText={setSearchQuery}
// //           />
// //           {searchQuery.length > 0 && (
// //             <TouchableOpacity onPress={() => setSearchQuery('')}>
// //               <MaterialIcons name="cancel" size={20} color="#888" />
// //             </TouchableOpacity>
// //           )}
// //         </View>
// //         <TouchableOpacity style={styles.scanButton}>
// //           <Feather name="maximize" size={20} color="#172d55" />
// //         </TouchableOpacity>
// //       </View>

// //       <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
// //         {/* Categories Carousel */}
// //         <View style={styles.section}>
// //           <FlatList
// //             data={categories}
// //             renderItem={renderCategoryItem}
// //             keyExtractor={item => item.id}
// //             horizontal
// //             showsHorizontalScrollIndicator={false}
// //             contentContainerStyle={styles.categoryList}
// //           />
// //         </View>

// //         {/* Promo Banner */}
// //         <View style={styles.bannerContainer}>
// //           <Image
// //             source={require("../assets/products/banner1.png")}
// //             style={styles.bannerImage}
// //           />
// //           <View style={styles.bannerIndicator}>
// //             <View style={[styles.indicatorDot, styles.activeDot]} />
// //             <View style={styles.indicatorDot} />
// //             <View style={styles.indicatorDot} />
// //           </View>
// //         </View>

// //         {/* Flash Sale Section */}
// //         <View style={styles.section}>
// //           <View style={styles.sectionHeader}>
// //             <View style={styles.sectionTitleContainer}>
// //               <Text style={styles.sectionTitle}>Flash Sale</Text>
// //               <View style={styles.timerContainer}>
// //                 <Text style={styles.timerText}>Ends in</Text>
// //                 <View style={styles.timeBox}>
// //                   <Text style={styles.timeText}>02</Text>
// //                 </View>
// //                 <Text style={styles.timerSeparator}>:</Text>
// //                 <View style={styles.timeBox}>
// //                   <Text style={styles.timeText}>45</Text>
// //                 </View>
// //                 <Text style={styles.timerSeparator}>:</Text>
// //                 <View style={styles.timeBox}>
// //                   <Text style={styles.timeText}>12</Text>
// //                 </View>
// //               </View>
// //             </View>
// //             <TouchableOpacity>
// //               <Text style={styles.seeAllText}>See All</Text>
// //             </TouchableOpacity>
// //           </View>

// //           {loading ? (
// //             <ActivityIndicator size="large" color="#172d55" style={styles.loader} />
// //           ) : (
// //             <FlatList
// //               data={productsample?.slice(0, 4)}
// //               horizontal
// //               showsHorizontalScrollIndicator={false}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity style={styles.productCard}
// //                  onPress={() => navigation.navigate("ProductDetails", { product_id: item.id })}
// //                 >
// //                   <Image
// //                     source={{ uri: item.image }}
// //                     style={styles.productImage}
// //                   />
// //                   <Text style={styles.productPrice}>₱{item.price}</Text>
// //                   <Text style={styles.originalPrice}>₱{item.price * 1.5}</Text>
// //                   <Text style={styles.discountTag}>-30%</Text>
// //                   <Text style={styles.productName} numberOfLines={2}>{item.product}</Text>
// //                   <View style={styles.soldTag}>
// //                     <Text style={styles.soldText}>{item.sold} sold</Text>
// //                   </View>
// //                   {/* Trade Button */}
// //                   <TouchableOpacity
// //                     style={styles.tradeButton}
// //                     onPress={() => handleTradePress(item)}
// //                   >
// //                     <FontAwesome name="exchange" size={16} color="#172d55" />
// //                     <Text style={styles.tradeButtonText}>Trade</Text>
// //                   </TouchableOpacity>
// //                 </TouchableOpacity>
// //               )}
// //               keyExtractor={item => item.id.toString()}
// //               contentContainerStyle={styles.productList}
// //             />
// //           )}
// //         </View>

// //         {/* Exclusive Products */}
// //         <View style={styles.section}>
// //           <View style={styles.sectionHeader}>
// //             <Text style={styles.sectionTitle}>Exclusive Products</Text>
// //             <TouchableOpacity>
// //               <Text style={styles.seeAllText}>See All</Text>
// //             </TouchableOpacity>
// //           </View>

// //           {loading ? (
// //             <ActivityIndicator size="large" color="#172d55" style={styles.loader} />
// //           ) : (
// //             <View style={styles.gridContainer}>
// //               {productsample?.slice(0, 4).map(item => (
// //                 <TouchableOpacity
// //                 key={item.id}
// //                 style={styles.gridProductCard}
// //                 onPress={() => navigation.navigate("ProductDetails", { product_id: item.id })}
// //                 >
// //                   <Image
// //                     source={{ uri: item.image }}
// //                     style={styles.gridProductImage}
// //                   />
// //                   <Text style={styles.gridProductPrice}>₱{item.price}</Text>
// //                   <Text style={styles.gridProductName} numberOfLines={2}>{item.product}</Text>
// //                   <View style={styles.ratingContainer}>
// //                     <AntDesign name="star" size={14} color="#FFC120" />
// //                     <Text style={styles.ratingText}>4.9</Text>
// //                     <Text style={styles.soldCount}> | {item.sold} sold</Text>
// //                   </View>
// //                   {/* Trade Button */}
// //                   <TouchableOpacity
// //                     style={styles.gridTradeButton}
// //                     onPress={() => handleTradePress(item)}
// //                   >
// //                     <FontAwesome name="exchange" size={14} color="#172d55" />
// //                     <Text style={styles.gridTradeButtonText}>Trade</Text>
// //                   </TouchableOpacity>
// //                 </TouchableOpacity>
// //               ))}
// //             </View>
// //           )}
// //         </View>

// //         {/* Best Selling */}
// //         <View style={styles.section}>
// //           <View style={styles.sectionHeader}>
// //             <Text style={styles.sectionTitle}>Best Selling</Text>
// //             <TouchableOpacity>
// //               <Text style={styles.seeAllText}>See All</Text>
// //             </TouchableOpacity>
// //           </View>

// //           {loading ? (
// //             <ActivityIndicator size="large" color="#172d55" style={styles.loader} />
// //           ) : (
// //             <View style={styles.gridContainer}>
// //               {productsample?.slice(4, 8).map(item => (
// //                 <TouchableOpacity key={item.id} style={styles.gridProductCard}
// //                   onPress={() => navigation.navigate("ProductDetails", { product_id: item.id })}
// //                 >
// //                   <Image
// //                     source={{ uri: item.image }}
// //                     style={styles.gridProductImage}
// //                   />
// //                   <Text style={styles.gridProductPrice}>₱{item.price}</Text>
// //                   <Text style={styles.gridProductName} numberOfLines={2}>{item.product}</Text>
// //                   <View style={styles.ratingContainer}>
// //                     <AntDesign name="star" size={14} color="#FFC120" />
// //                     <Text style={styles.ratingText}>4.9</Text>
// //                     <Text style={styles.soldCount}> | {item.sold} sold</Text>
// //                   </View>
// //                   {/* Trade Button */}
// //                   <TouchableOpacity
// //                     style={styles.gridTradeButton}
// //                     onPress={() => handleTradePress(item)}
// //                   >
// //                     <FontAwesome name="exchange" size={14} color="#172d55" />
// //                     <Text style={styles.gridTradeButtonText}>Trade</Text>
// //                   </TouchableOpacity>
// //                 </TouchableOpacity>
// //               ))}
// //             </View>
// //           )}
// //         </View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#F8F9FA",
// //   },
// //   searchContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 16,
// //     paddingVertical: 10,
// //     backgroundColor: 'white',
// //   },
// //   searchInputContainer: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#F5F5F5',
// //     borderRadius: 8,
// //     paddingHorizontal: 12,
// //     paddingVertical: 8,
// //     marginRight: 10,
// //   },
// //   searchIcon: {
// //     marginRight: 8,
// //   },
// //   searchInput: {
// //     flex: 1,
// //     fontSize: 14,
// //     color: '#333',
// //   },
// //   scanButton: {
// //     padding: 8,
// //   },
// //   scrollView: {
// //     flex: 1,
// //   },
// //   section: {
// //     marginBottom: 16,
// //     backgroundColor: 'white',
// //     paddingVertical: 12,
// //   },
// //   categoryList: {
// //     paddingHorizontal: 16,
// //   },
// //   categoryItem: {
// //     alignItems: 'center',
// //     marginRight: 16,
// //     width: 70,
// //   },
// //   categoryIcon: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 25,
// //     backgroundColor: '#FFF0E5',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   categoryText: {
// //     fontSize: 12,
// //     textAlign: 'center',
// //     color: '#333',
// //   },
// //   bannerContainer: {
// //     height: 150,
// //     marginVertical: 12,
// //     marginHorizontal: 16,
// //     borderRadius: 8,
// //     overflow: 'hidden',
// //   },
// //   bannerImage: {
// //     width: '100%',
// //     height: '100%',
// //     resizeMode: 'cover',
// //   },
// //   bannerIndicator: {
// //     position: 'absolute',
// //     bottom: 10,
// //     alignSelf: 'center',
// //     flexDirection: 'row',
// //   },
// //   indicatorDot: {
// //     width: 6,
// //     height: 6,
// //     borderRadius: 3,
// //     backgroundColor: 'rgba(255,255,255,0.5)',
// //     marginHorizontal: 3,
// //   },
// //   activeDot: {
// //     backgroundColor: '#172d55',
// //     width: 12,
// //   },
// //   sectionHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingHorizontal: 16,
// //     marginBottom: 12,
// //   },
// //   sectionTitleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   sectionTitle: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: '#333',
// //     marginRight: 12,
// //   },
// //   timerContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   timerText: {
// //     fontSize: 12,
// //     color: '#666',
// //     marginRight: 6,
// //   },
// //   timeBox: {
// //     backgroundColor: '#333',
// //     paddingHorizontal: 4,
// //     borderRadius: 3,
// //   },
// //   timeText: {
// //     color: 'white',
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //   },
// //   timerSeparator: {
// //     marginHorizontal: 2,
// //     color: '#333',
// //     fontWeight: 'bold',
// //   },
// //   seeAllText: {
// //     color: '#172d55',
// //     fontSize: 14,
// //   },
// //   productList: {
// //     paddingHorizontal: 16,
// //   },
// //   productCard: {
// //     width: 140,
// //     marginRight: 12,
// //     padding: 8,
// //     backgroundColor: 'white',
// //     borderRadius: 8,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 3,
// //     elevation: 2,
// //   },
// //   productImage: {
// //     width: '100%',
// //     height: 120,
// //     borderRadius: 6,
// //     backgroundColor: '#F5F5F5',
// //     resizeMode: 'contain',
// //     marginBottom: 8,
// //   },
// //   productPrice: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     color: '#172d55',
// //   },
// //   originalPrice: {
// //     fontSize: 12,
// //     color: '#999',
// //     textDecorationLine: 'line-through',
// //     marginTop: 2,
// //   },
// //   discountTag: {
// //     position: 'absolute',
// //     top: 8,
// //     right: 8,
// //     backgroundColor: '#172d55',
// //     color: 'white',
// //     fontSize: 12,
// //     paddingHorizontal: 4,
// //     borderRadius: 3,
// //     overflow: 'hidden',
// //   },
// //   productName: {
// //     fontSize: 12,
// //     color: '#333',
// //     marginTop: 4,
// //   },
// //   soldTag: {
// //     backgroundColor: '#F5F5F5',
// //     borderRadius: 4,
// //     paddingHorizontal: 6,
// //     paddingVertical: 2,
// //     alignSelf: 'flex-start',
// //     marginTop: 6,
// //   },
// //   soldText: {
// //     fontSize: 10,
// //     color: '#666',
// //   },
// //   // Trade Button Styles
// //   tradeButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     backgroundColor: '#FFF0E5',
// //     paddingVertical: 4,
// //     borderRadius: 4,
// //     marginTop: 8,
// //   },
// //   tradeButtonText: {
// //     fontSize: 12,
// //     color: '#172d55',
// //     marginLeft: 4,
// //     fontWeight: '500',
// //   },
// //   gridContainer: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 16,
// //   },
// //   gridProductCard: {
// //     width: '48%',
// //     marginBottom: 12,
// //     padding: 8,
// //     backgroundColor: 'white',
// //     borderRadius: 8,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 3,
// //     elevation: 2,
// //   },
// //   gridProductImage: {
// //     width: '100%',
// //     height: 120,
// //     borderRadius: 6,
// //     backgroundColor: '#F5F5F5',
// //     resizeMode: 'contain',
// //     marginBottom: 8,
// //   },
// //   gridProductPrice: {
// //     fontSize: 14,
// //     fontWeight: 'bold',
// //     color: '#172d55',
// //   },
// //   gridProductName: {
// //     fontSize: 12,
// //     color: '#333',
// //     marginTop: 4,
// //   },
// //   ratingContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginTop: 4,
// //   },
// //   ratingText: {
// //     fontSize: 11,
// //     color: '#666',
// //     marginLeft: 2,
// //   },
// //   soldCount: {
// //     fontSize: 11,
// //     color: '#666',
// //   },
// //   // Grid Trade Button Styles
// //   gridTradeButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     backgroundColor: '#FFF0E5',
// //     paddingVertical: 4,
// //     borderRadius: 4,
// //     marginTop: 6,
// //   },
// //   gridTradeButtonText: {
// //     fontSize: 11,
// //     color: '#172d55',
// //     marginLeft: 4,
// //     fontWeight: '500',
// //   },
// //   loader: {
// //     marginVertical: 20,
// //   },
// // });

// // export default Store;

// import React, { useEffect, useState } from "react";
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
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Feather, AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
// import axios from "axios";
// import API_URL  from "../api/api_urls.jsx";
// import { useNavigation } from "@react-navigation/native";
// import Categories from "./HomeScreen/component/Categories.jsx";
// import StaticProductStyle from "./Global/StaticProductStyle.jsx";
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

//   // Minimalist categories data
//   const categories = [
//     { id: "1", name: "All", icon: "grid", color: "#2563eb" },
//     { id: "2", name: "Crafts", icon: "package", color: "#059669" },
//     { id: "3", name: "Bags", icon: "shopping-bag", color: "#d97706" },
//     { id: "4", name: "Home", icon: "home", color: "#dc2626" },
//     { id: "5", name: "Food", icon: "coffee", color: "#7c3aed" },
//     { id: "6", name: "Art", icon: "feather", color: "#0891b2" },
//   ];

//   useEffect(() => {
//     fetchProduct();
//     fetchRecommendedProduct()
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


// const fetchRecommendedProduct = async () => {
//     try {
//       const response = await axiosInstance.get(`/api/v1/AI Recommendation/buyer_recommendation`);
//       const productList = response.data.map(item => item.product_info);

//       setRecommendedProduct(productList);
//       // const bestseller = response.data.sort((a, b) => b.rating - a.rating);
//       // setBestProduct(bestseller);

//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const headerOpacity = scrollY.interpolate({
//     inputRange: [0, 100],
//     outputRange: [1, 0.95],
//     extrapolate: "clamp",
//   });

//   const renderCategoryItem = ({ item }) => (
//     <TouchableOpacity
//       style={[
//         styles.categoryItem,
//         activeCategory === item.id && styles.activeCategoryItem,
//       ]}
//       onPress={() => setActiveCategory(item.id)}
//     >
//       <View
//         style={[
//           styles.categoryIcon,
//           activeCategory === item.id && [
//             styles.activeCategoryIcon,
//             { backgroundColor: item.color },
//           ],
//         ]}
//       >
//         <Feather
//           name={item.icon}
//           size={20}
//           color={activeCategory === item.id ? "#fff" : item.color}
//         />
//       </View>
//       <Text
//         style={[
//           styles.categoryText,
//           activeCategory === item.id && styles.activeCategoryText,
//         ]}
//       >
//         {item.name}
//       </Text>
//     </TouchableOpacity>
//   );

//   const handleTradePress = () => {
//     navigation.navigate("TradeScreen");
//   };

//   return (
//     <SafeAreaView style={styles.container}>
      
//       <Animated.ScrollView
//         showsVerticalScrollIndicator={false}
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: true }
//         )}
//         scrollEventThrottle={16}
//       >
//         {/* Minimal Header */}
//         <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
//           <View style={styles.headerContent}>
//             <View style={styles.headerTextContainer}>
//               <Text style={styles.greetingText}>Welcome back</Text>
//               <Text style={styles.headerTitle}>Discover Handmade</Text>
//               <Text style={styles.headerTitle}>Treasures</Text>
//             </View>
//             <TouchableOpacity
//               style={styles.tradeButton}
//               onPress={handleTradePress}
//             >
//               <View style={styles.tradeIconContainer}>
//                 <FontAwesome name="exchange" size={16} color="#2563eb" />
//               </View>
//               <Text style={styles.tradeButtonText}>Trade</Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>

//         {/* Search Bar
//         <View style={styles.searchContainer}>
//           <View style={styles.searchInputContainer}>
//             <Feather
//               name="search"
//               size={20}
//               color="#64748b"
//               style={styles.searchIcon}
//             />
//             <Text style={styles.searchPlaceholder}>Search products...</Text>
//           </View>
//           <TouchableOpacity style={styles.filterButton}>
//             <Feather name="sliders" size={20} color="#64748b" />
//           </TouchableOpacity>
//         </View> */}

//         {/* Categories
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Categories</Text>
//           <FlatList
//             data={categories}
//             renderItem={renderCategoryItem}
//             keyExtractor={(item) => item.id}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.categoryList}
//           />
//         </View> */}

//         {/* Featured Banner */}
//         <View style={styles.featuredBanner}>
//           <Image
//             source={require("../assets/products/banner1.png")}
//             style={styles.featuredBannerImage}
//           />
//           <View style={styles.featuredBannerContent}>
//             <Text style={styles.featuredBannerTitle}>Summer Collection</Text>
//             <Text style={styles.featuredBannerSubtitle}>
//               Up to 50% off artisan crafts
//             </Text>
//             <TouchableOpacity style={styles.featuredBannerButton}>
//               <Text style={styles.featuredBannerButtonText}>Explore</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
      
//       {/* Categories */}
//       <View style={[styles.section, {marginTop: 14}]}>
//       <Categories />
//       </View>
        

//             {/* Best Sellers */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <View>
//               <Text style={styles.sectionTitle}>Best Sellers</Text>
//               <Text style={styles.sectionSubtitle}>Customer favorites</Text>
//             </View>
//             <TouchableOpacity
//               style={styles.seeAllButton}
//               onPress={() =>
//                 navigation.navigate("AllProducts", {
//                   title: "Best Sellers",
//                   initialProducts: BestProduct,
//                 })
//               }
//             >
//               <Text style={styles.seeAllText}>View all</Text>
//               <Feather name="chevron-right" size={16} color="#2563eb" />
//             </TouchableOpacity>
//           </View>

//           {loading ? (
//             <ActivityIndicator
//               size="large"
//               color="#2563eb"
//               style={styles.loader}
//             />
//           ) : (
//             <View style={styles.bestSellersContainer}>
//               {BestProduct?.slice(0, 5).map((item, index) => (
//                 <TouchableOpacity
//                   key={item.id}
//                   style={styles.bestSellerCard}
//                   onPress={() =>
//                     navigation.navigate("ProductDetails", {
//                       product_id: item.id,
//                     })
//                   }
//                 >
//                   <View style={styles.rankContainer}>
//                     <Text style={styles.rankText}>{index + 1}</Text>
//                   </View>
//                   <Image
//                     source={{ uri: item.image }}
//                     style={styles.bestSellerImage}
//                   />
//                   <View style={styles.bestSellerInfo}>
//                     <Text style={styles.bestSellerName} numberOfLines={2}>
//                       {item.product}
//                     </Text>
//                     <Text style={styles.bestSellerPrice}>₱{item.price}</Text>
//                   </View>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//         </View>

//       {/* Trending Products */}
// <View style={styles.section}>
//   <View style={styles.sectionHeader}>
//     <View>
//       <Text style={styles.sectionTitle}>Trending Now</Text>
//       <Text style={styles.sectionSubtitle}>Most popular this week</Text>
//     </View>
//     <TouchableOpacity
//       style={styles.seeAllButton}
//       onPress={() =>
//         navigation.navigate("AllProducts", {
//           title: "Trending Now",
//           initialProducts: productsample, // pass full data
//         })
//       }
//     >
//       <Text style={styles.seeAllText}>View all</Text>
//       <Feather name="chevron-right" size={16} color="#2563eb" />
//     </TouchableOpacity>
//   </View>

//   {loading ? (
//     <ActivityIndicator
//       size="large"
//       color="#2563eb"
//       style={styles.loader}
//     />
//   ) : (
//     <FlatList
//       data={productsample?.slice(0, 4)}
//       horizontal
//       showsHorizontalScrollIndicator={false}
//       keyExtractor={(item) => item.id?.toString()}
//       renderItem={({ item }) => (
//         <StaticProductStyle data={[item]} horizontalItem />
//       )}
//       contentContainerStyle={{ paddingHorizontal: 10 }}
//     />
//   )}
// </View>


//           {/* Special Offer */}
//         <View style={styles.specialOffer}>
//           <View style={styles.specialOfferContent}>
//             <Text style={styles.specialOfferTitle}>Weekend Special</Text>
//             <Text style={styles.specialOfferSubtitle}>
//               15% off on handmade bags
//             </Text>
//             <TouchableOpacity style={styles.specialOfferButton}>
//               <Text style={styles.specialOfferButtonText}>Shop Now</Text>
//             </TouchableOpacity>
//           </View>
//           <View style={styles.specialOfferIcon}>
//             <Feather name="shopping-bag" size={40} color="#2563eb" />
//           </View>
//         </View>

//        {/* New Arrivals */}
//   <View style={[styles.section, { marginBottom: 60 }]}>
//   <View style={styles.sectionHeader}>
//     <View>
//       <Text style={styles.sectionTitle}>New Arrivals</Text>
//       <Text style={styles.sectionSubtitle}>Fresh from artisans</Text>
//     </View>
//     <TouchableOpacity
//       style={styles.seeAllButton}
//       onPress={() =>
//         navigation.navigate("AllProducts", {
//           title: "New Arrivals",
//           initialProducts: productsample, // pass full data
//         })
//       }
//     >
//       <Text style={styles.seeAllText}>View all</Text>
//       <Feather name="chevron-right" size={16} color="#2563eb" />
//     </TouchableOpacity>
//   </View>

//   {loading ? (
//     <ActivityIndicator
//       size="large"
//       color="#2563eb"
//       style={styles.loader}
//     />
//   ) : (
//     // Use StaticProductStyle here
//     <StaticProductStyle data={productsample?.slice(0, 4)} />
//   )}
// </View>


// {/* Recommendation */}
// {/* {recommendedproduct && recommendedproduct.length > 0 && ( */}

// {recommendedproduct && recommendedproduct.length > 0 ? (
//   <View style={[styles.section, { marginTop: -30 }]}>
//     <View style={styles.sectionHeader}>
//       <View>
//         <Text style={styles.sectionTitle}>Recommended For You</Text>
//         <Text style={styles.sectionSubtitle}>Picked just for you</Text>
//       </View>
//       <TouchableOpacity
//         style={styles.seeAllButton}
//         onPress={() =>
//           navigation.navigate("AllProducts", {
//             title: "Recommended For You",
//             initialProducts: recommendedproduct, // pass full data
//           })
//         }
//       >
//         <Text style={styles.seeAllText}>View all</Text>
//         <Feather name="chevron-right" size={16} color="#2563eb" />
//       </TouchableOpacity>
//     </View>

//     {loading ? (
//       <ActivityIndicator
//         size="large"
//         color="#2563eb"
//         style={styles.loader}
//       />
//     ) : (
//       <StaticProductStyle data={recommendedproduct.slice(0, 4)} />
//     )}
//   </View>
// ): (
//   !loading && (
//     <Text style={{ textAlign: "center", color: "#888", marginBottom: 10,marginTop: -50 }}>
//       No recommendations available right now.
//     </Text>
//   )
// )


// }



//        {/* Recommendation
//   <View style={[styles.section, { marginBottom: 60 }]}>
//   <View style={styles.sectionHeader}>
//     <View>
//       <Text style={styles.sectionTitle}>Recommended For You</Text>
//       <Text style={styles.sectionSubtitle}>Picked just for you</Text>
//     </View>
//     <TouchableOpacity
//       style={styles.seeAllButton}
//       onPress={() =>
//         navigation.navigate("Recommended For You", {
//           title: "New Arrivals",
//           initialProducts: recommendedproduct, // pass full data
//         })
//       }
//     >
//       <Text style={styles.seeAllText}>View all</Text>
//       <Feather name="chevron-right" size={16} color="#2563eb" />
//     </TouchableOpacity>
//   </View>

//   {loading ? (
//     <ActivityIndicator
//       size="large"
//       color="#2563eb"
//       style={styles.loader}
//     />
//   ) : (
//     // Use StaticProductStyle here
//     <StaticProductStyle data={recommendedproduct?.slice(0, 4)} />
//   )}
// </View> */}


//         {/* Special Offer
//         <View style={styles.specialOffer}>
//           <View style={styles.specialOfferContent}>
//             <Text style={styles.specialOfferTitle}>Weekend Special</Text>
//             <Text style={styles.specialOfferSubtitle}>
//               15% off on handmade bags
//             </Text>
//             <TouchableOpacity style={styles.specialOfferButton}>
//               <Text style={styles.specialOfferButtonText}>Shop Now</Text>
//             </TouchableOpacity>
//           </View>
//           <View style={styles.specialOfferIcon}>
//             <Feather name="shopping-bag" size={40} color="#2563eb" />
//           </View>
//         </View> */}

//         {/* Best Sellers
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <View>
//               <Text style={styles.sectionTitle}>Best Sellers</Text>
//               <Text style={styles.sectionSubtitle}>Customer favorites</Text>
//             </View>
//             <TouchableOpacity
//               style={styles.seeAllButton}
//               onPress={() =>
//                 navigation.navigate("AllProducts", {
//                   title: "Trending Now",
//                   products: productsample,
//                 })
//               }
//             >
//               <Text style={styles.seeAllText}>View all</Text>
//               <Feather name="chevron-right" size={16} color="#2563eb" />
//             </TouchableOpacity>
//           </View>

//           {loading ? (
//             <ActivityIndicator
//               size="large"
//               color="#2563eb"
//               style={styles.loader}
//             />
//           ) : (
//             <View style={styles.bestSellersContainer}>
//               {productsample?.slice(4, 8).map((item, index) => (
//                 <TouchableOpacity
//                   key={item.id}
//                   style={styles.bestSellerCard}
//                   onPress={() =>
//                     navigation.navigate("ProductDetails", {
//                       product_id: item.id,
//                     })
//                   }
//                 >
//                   <View style={styles.rankContainer}>
//                     <Text style={styles.rankText}>{index + 1}</Text>
//                   </View>
//                   <Image
//                     source={{ uri: item.image }}
//                     style={styles.bestSellerImage}
//                   />
//                   <View style={styles.bestSellerInfo}>
//                     <Text style={styles.bestSellerName} numberOfLines={2}>
//                       {item.product}
//                     </Text>
//                     <Text style={styles.bestSellerPrice}>₱{item.price}</Text>
//                   </View>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//         </View> */}
//       </Animated.ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: 20,
//   },
//   // Header Styles
//   header: {
//     backgroundColor: "#ffffff",
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f1f5f9",
//   },
//   headerContent: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//   },
//   headerTextContainer: {
//     flex: 1,
//   },
//   greetingText: {
//     fontSize: 14,
//     color: "#64748b",
//     marginBottom: 4,
//     fontWeight: "400",
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "600",
//     color: "#0f172a",
//     lineHeight: 28,
//   },
//   tradeButton: {
//     alignItems: "center",
//   },
//   tradeIconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: "#f8fafc",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 4,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   tradeButtonText: {
//     fontSize: 12,
//     color: "#2563eb",
//     fontWeight: "500",
//   },
//   // Search Bar
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     backgroundColor: "#ffffff",
//   },
//   searchInputContainer: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f8fafc",
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     marginRight: 12,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   searchIcon: {
//     marginRight: 12,
//   },
//   searchPlaceholder: {
//     fontSize: 16,
//     color: "#94a3b8",
//   },
//   filterButton: {
//     padding: 12,
//     backgroundColor: "#f8fafc",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   // Section Styles
//   section: {
//     marginBottom: 24,
//     paddingHorizontal: 20,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-end",
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#0f172a",
//   },
//   sectionSubtitle: {
//     fontSize: 14,
//     color: "#64748b",
//     marginTop: 4,
//   },
//   seeAllButton: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   seeAllText: {
//     color: "#2563eb",
//     fontSize: 14,
//     fontWeight: "500",
//     marginRight: 4,
//   },
//   // Categories Styles
//   categoryList: {
//     paddingRight: 20,
//   },
//   categoryItem: {
//     alignItems: "center",
//     marginRight: 16,
//   },
//   categoryIcon: {
//     width: 56,
//     height: 56,
//     borderRadius: 16,
//     backgroundColor: "#f8fafc",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   activeCategoryIcon: {
//     borderWidth: 0,
//   },
//   categoryText: {
//     fontSize: 12,
//     textAlign: "center",
//     color: "#64748b",
//     fontWeight: "500",
//   },
//   activeCategoryText: {
//     color: "#0f172a",
//     fontWeight: "600",
//   },
//   // Featured Banner
//   featuredBanner: {
//     height: 160,
//     marginHorizontal: 20,
//     marginBottom: 24,
//     borderRadius: 16,
//     overflow: "hidden",
//     position: "relative",
//     backgroundColor: "#f8fafc",
//   },
//   featuredBannerImage: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "cover",
//   },
//   featuredBannerContent: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(15, 23, 42, 0.7)",
//     justifyContent: "center",
//     paddingLeft: 20,
//   },
//   featuredBannerTitle: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#ffffff",
//     marginBottom: 4,
//   },
//   featuredBannerSubtitle: {
//     fontSize: 14,
//     color: "#e2e8f0",
//     marginBottom: 16,
//   },
//   featuredBannerButton: {
//     backgroundColor: "#ffffff",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 12,
//     alignSelf: "flex-start",
//   },
//   featuredBannerButtonText: {
//     color: "#0f172a",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   // Product Card Styles
//   productList: {
//     paddingRight: 20,
//   },
//   productCard: {
//     width: 160,
//     marginRight: 12,
//     backgroundColor: "white",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#f1f5f9",
//     overflow: "hidden",
//   },
//   productImage: {
//     width: "100%",
//     height: 120,
//     backgroundColor: "#f8fafc",
//     resizeMode: "cover",
//   },
//   productInfo: {
//     padding: 12,
//   },
//   productName: {
//     fontSize: 14,
//     color: "#0f172a",
//     fontWeight: "500",
//     marginBottom: 6,
//     lineHeight: 18,
//   },
//   productPrice: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#0f172a",
//     marginBottom: 6,
//   },
//   productMeta: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   // Grid Product Styles
//   gridContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },
//   gridProductCard: {
//     width: "48%",
//     marginBottom: 12,
//     backgroundColor: "white",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#f1f5f9",
//     overflow: "hidden",
//     position: "relative",
//   },
//   newBadge: {
//     position: "absolute",
//     top: 8,
//     left: 8,
//     backgroundColor: "#dc2626",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//     zIndex: 1,
//   },
//   newBadgeText: {
//     color: "white",
//     fontSize: 10,
//     fontWeight: "600",
//   },
//   gridProductImage: {
//     width: "100%",
//     height: 120,
//     backgroundColor: "#f8fafc",
//     resizeMode: "cover",
//   },
//   gridProductInfo: {
//     padding: 12,
//   },
//   gridProductName: {
//     fontSize: 13,
//     color: "#0f172a",
//     fontWeight: "500",
//     marginBottom: 6,
//     lineHeight: 16,
//   },
//   gridProductPrice: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#0f172a",
//     marginBottom: 4,
//   },
//   gridProductMeta: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   // Rating Container
//   ratingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   ratingText: {
//     fontSize: 12,
//     color: "#475569",
//     marginLeft: 2,
//   },
//   soldText: {
//     fontSize: 12,
//     color: "#64748b",
//   },
//   // Special Offer
//   specialOffer: {
//     flexDirection: "row",
//     backgroundColor: "#f8fafc",
//     marginHorizontal: 20,
//     marginBottom: 24,
//     borderRadius: 16,
//     padding: 20,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   specialOfferContent: {
//     flex: 1,
//   },
//   specialOfferTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#0f172a",
//     marginBottom: 4,
//   },
//   specialOfferSubtitle: {
//     fontSize: 14,
//     color: "#475569",
//     marginBottom: 12,
//   },
//   specialOfferButton: {
//     backgroundColor: "#2563eb",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//     alignSelf: "flex-start",
//   },
//   specialOfferButtonText: {
//     color: "#ffffff",
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   specialOfferIcon: {
//     width: 60,
//     height: 60,
//     backgroundColor: "#ffffff",
//     borderRadius: 12,
//     justifyContent: "center",
//     alignItems: "center",
//     marginLeft: 10,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   // Best Sellers
//   bestSellersContainer: {
//     // Add styles for best sellers container
//   },
//   bestSellerCard: {
//     flexDirection: "row",
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: "#f1f5f9",
//   },
//   rankContainer: {
//     width: 24,
//     height: 24,
//     borderRadius: 6,
//     backgroundColor: "#2563eb",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   rankText: {
//     color: "#ffffff",
//     fontSize: 12,
//     fontWeight: "600",
//   },
//   bestSellerImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 8,
//     backgroundColor: "#f8fafc",
//     resizeMode: "cover",
//     marginRight: 12,
//   },
//   bestSellerInfo: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   bestSellerName: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#0f172a",
//     marginBottom: 4,
//   },
//   bestSellerPrice: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#0f172a",
//   },
//   loader: {
//     marginVertical: 20,
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
        <TouchableOpacity style={styles.iconButton}>
             <Feather name="search" size={24} color="#1e293b" />
        </TouchableOpacity>
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