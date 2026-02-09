// import React, { useState, useEffect, useContext } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { AuthContext } from "../../auth/AuthContext";
// import axiosInstance from '@api/axiosInstance';

// const API = `/api/v1/Buyer Cart/buyer_cart`;
// const API_Like = `/api/v1/Buyer Likes/buyer_like`;

// const COLORS_idea = {
//   primary: "#172d55",
//   secondary: "#2196f3",
//   background: "#f8f9fa",
//   text: "#6c757d",
//   border: "#e0e0e0",
//   discount: "#e53935",
//   freeShipping: "#4caf50",
//   highlight: "#ff6b6b",
//   rating: "#FFD700",
//   white: "#ffffff",
//   headerBg: "#172d55",
// };
//   const { width } = Dimensions.get('window');
// const itemWidth = Math.min(width * 0.40, 200); // max 200px per card
// const StaticProductStyle = ({ data = [],  horizontalItem = false }) => {
//   const navigation = useNavigation();
//   const [likedItems, setLikedItems] = useState({});
//   const { userToken } = useContext(AuthContext);


//   useEffect(() => {
//     const fetchLikes = async () => {
//       try {
//         const response = await axiosInstance.get(API_Like);
//         const likedMap = (response.data || []).reduce(
//           (acc, item) => ({
//             ...acc,
//             [item.product_info.id]: true,
//           }),
//           {}
//         );
//         setLikedItems(likedMap);
//       } catch (error) {
//         console.error("Error fetching likes:", error);
//       }
//     };
//     fetchLikes();
//   }, []);

//   const handleCartAction = async (product_id) => {
//     try {
//       await axiosInstance.post(API, { product_id });
//       Alert.alert("Added to Cart", "Item has been added to your cart");
//     } catch (error) {
//       console.error("Error adding item:", error);
//       Alert.alert("Error", "Couldn't add item to cart");
//     }
//   };

//   const toggleLike = async (product_id) => {
//     try {
//       if (likedItems[product_id]) {
//         await axiosInstance.delete(`${API_Like}/${product_id}`);
//       } else {
//         await axiosInstance.post(API_Like, { like_id: product_id });
//       }

//       setLikedItems((prev) => ({
//         ...prev,
//         [product_id]: !prev[product_id],
//       }));
//     } catch (error) {
//       console.error("Error toggling like:", error);
//       Alert.alert("Error", "Failed to update like status");
//     }
//   };

//   const handleProductPress = (product) => {
//     navigation.navigate("ProductDetails", { product_id: product.id });
//   };

//  const renderItem = ({ item }) => (
//   <TouchableOpacity
//     onPress={() => handleProductPress(item)}
//     activeOpacity={0.8}
//     style={[
//       styles_idea.productItem,
//       horizontalItem && { width: 180, marginRight: 12, marginBottom: 16 }, // fixed width for horizontal
//     ]}
//   >
//     {/* Product Image with Badges */}
//     <View style={styles_idea.imageContainer}>
//       <Image
//         source={{ uri: item.image }}
//         style={styles_idea.productImage}
//         resizeMode="cover"
//       />

//       {/* Top Left Badges */}
//       <View style={styles_idea.topBadges}>
//         {item.isNew && (
//           <View style={[styles_idea.badge, styles_idea.newBadge]}>
//             <Text style={styles_idea.badgeText}>NEW</Text>
//           </View>
//         )}
//         {item.isTrending && (
//           <View style={[styles_idea.badge, styles_idea.trendingBadge]}>
//             <Text style={styles_idea.badgeText}>TRENDING</Text>
//           </View>
//         )}
//       </View>

//       {/* Free Shipping Badge */}
//       {item.hasFreeShipping && (
//         <View style={[styles_idea.badge, styles_idea.freeShippingBadge]}>
//           <Text style={styles_idea.badgeText}>FREE SHIPPING</Text>
//         </View>
//       )}

//       {/* Wishlist Button */}
//       <TouchableOpacity
//         style={styles_idea.wishlistButton}
//         onPress={(e) => {
//           e.stopPropagation();
//           if (!userToken) {
//             navigation.navigate("CustomerLogin");
//           } else {
//             toggleLike(item.id);
//           }
//         }}
//       >
//         <Ionicons
//           name={likedItems[item.id] ? "heart" : "heart-outline"}
//           size={20}
//           color={
//             likedItems[item.id] ? COLORS_idea.highlight : COLORS_idea.white
//           }
//         />
//       </TouchableOpacity>
//     </View>

//     {/* Product Details */}
//     <View style={styles_idea.productDetails}>
//       <View style={styles_idea.shopContainer}>
//         {item.isPreferred && (
//           <View style={styles_idea.preferredBadge}>
//             <Text style={styles_idea.preferredText}>Preferred</Text>
//           </View>
//         )}
//         <Text style={styles_idea.productShop} numberOfLines={1}>
//           {item.store}
//         </Text>
//       </View>

//       <Text style={styles_idea.productName} numberOfLines={2}>
//         {item.product}
//       </Text>

//       <View style={styles_idea.priceContainer}>
//         <Text style={styles_idea.currentPrice}>₱{item.price}</Text>
//         {item.originalPrice && (
//           <Text style={styles_idea.originalPrice}>₱{item.originalPrice}</Text>
//         )}
//         {item.discount && (
//           <Text style={styles_idea.discount}>{item.discount}</Text>
//         )}
//       </View>

//       <View style={styles_idea.ratingContainer}>
//         <View style={styles_idea.ratingWrapper}>
//           <Ionicons name="star" size={14} color={COLORS_idea.rating} />
//           <Text style={styles_idea.ratingText}>{item.rating || 0}</Text>
//         </View>
//         <Text style={styles_idea.soldText}>{item.sold || "0"} sold</Text>
//       </View>

//       <View style={styles_idea.locationContainer}>
//         <Ionicons name="location-outline" size={12} color={COLORS_idea.text} />
//         <Text style={styles_idea.locationText}>{item.location}</Text>
//       </View>
//     </View>
//   </TouchableOpacity>
// );


//   return (
//      <FlatList
//       data={data}
//       keyExtractor={(item) => item.id?.toString()}
//       renderItem={renderItem}
//       numColumns={horizontalItem ? 1 : 2}
//       horizontal={horizontalItem}
//       showsHorizontalScrollIndicator={false}
//       contentContainerStyle={{ padding: 10 }}
//       columnWrapperStyle={!horizontalItem ? { justifyContent: "space-between" } : null}
//       scrollEnabled={false}          // disable FlatList’s scroll
//       nestedScrollEnabled={true} 
//     />
//   );
// };

// export default StaticProductStyle;

// const styles_idea = StyleSheet.create({
//   productItem: {
//     width: itemWidth ,
//     backgroundColor: COLORS_idea.white,
//     borderRadius: 12,
//     overflow: "hidden",
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: COLORS_idea.border,
//     elevation: 3,
//   },
//   imageContainer: {
//     position: "relative",
//   },
//   productImage: {
//     width: "100%",
//     height: 150,
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//   },
//   topBadges: {
//     position: "absolute",
//     top: 8,
//     left: 8,
//     flexDirection: "row",
//   },
//   badge: {
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 4,
//     marginRight: 6,
//   },
//   badgeText: {
//     color: COLORS_idea.white,
//     fontSize: 10,
//     fontWeight: "bold",
//   },
//   newBadge: { backgroundColor: COLORS_idea.highlight },
//   trendingBadge: { backgroundColor: COLORS_idea.secondary },
//   freeShippingBadge: {
//     position: "absolute",
//     bottom: 8,
//     left: 8,
//     backgroundColor: COLORS_idea.freeShipping,
//   },
//   wishlistButton: {
//     position: "absolute",
//     top: 8,
//     right: 8,
//     backgroundColor: "rgba(0,0,0,0.3)",
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   productDetails: {
//     padding: 12,
//   },
//   shopContainer: {
//     flexDirection: "row",
//     alignItems: "center",
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
//     fontWeight: "bold",
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
//     fontWeight: "600",
//   },
//   priceContainer: {
//     flexDirection: "row",
//     alignItems: "flex-end",
//     marginBottom: 6,
//     flexWrap: "wrap",
//   },
//   currentPrice: {
//     fontSize: 15,
//     fontWeight: "bold",
//     color: COLORS_idea.primary,
//     marginRight: 6,
//   },
//   originalPrice: {
//     fontSize: 12,
//     color: COLORS_idea.text,
//     textDecorationLine: "line-through",
//     marginRight: 6,
//   },
//   discount: {
//     fontSize: 12,
//     color: COLORS_idea.discount,
//     fontWeight: "bold",
//   },
//   ratingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 6,
//   },
//   ratingWrapper: { flexDirection: "row", alignItems: "center" },
//   ratingText: {
//     fontSize: 12,
//     color: COLORS_idea.primary,
//     marginLeft: 4,
//   },
//   soldText: { fontSize: 12, color: COLORS_idea.text },
//   locationContainer: { flexDirection: "row", alignItems: "center" },
//   locationText: { fontSize: 11, color: COLORS_idea.text, marginLeft: 4 },
// });

// // import React, { useState, useEffect, useContext } from "react";
// // import {
// //   View,
// //   Text,
// //   FlatList,
// //   Image,
// //   TouchableOpacity,
// //   Alert,
// //   StyleSheet,
// // } from "react-native";
// // import { Ionicons } from "@expo/vector-icons";
// // import { useNavigation } from "@react-navigation/native";
// // import axiosInstance from "../../api/axiosInstance";
// // import { AuthContext } from "../../auth/AuthContext";

// // const API = `/api/v1/Buyer Cart/buyer_cart`;
// // const API_Like = `/api/v1/Buyer Likes/buyer_like`;

// // const COLORS_idea = {
// //   primary: "#172d55",
// //   secondary: "#2196f3",
// //   background: "#f8f9fa",
// //   text: "#6c757d",
// //   border: "#e0e0e0",
// //   discount: "#e53935",
// //   freeShipping: "#4caf50",
// //   highlight: "#ff6b6b",
// //   rating: "#FFD700",
// //   white: "#ffffff",
// //   headerBg: "#172d55",
// // };

// // const StaticProductStyle = ({ data = [] }) => {
// //   const navigation = useNavigation();
// //   const [likedItems, setLikedItems] = useState({});
// //   const { userToken } = useContext(AuthContext);

// //   useEffect(() => {
// //     const fetchLikes = async () => {
// //       try {
// //         const response = await axiosInstance.get(API_Like);
// //         const likedMap = (response.data || []).reduce(
// //           (acc, item) => ({
// //             ...acc,
// //             [item.product_info.id]: true,
// //           }),
// //           {}
// //         );
// //         setLikedItems(likedMap);
// //       } catch (error) {
// //         console.error("Error fetching likes:", error);
// //       }
// //     };
// //     fetchLikes();
// //   }, []);

// //   const handleCartAction = async (product_id) => {
// //     try {
// //       await axiosInstance.post(API, { product_id });
// //       Alert.alert("Added to Cart", "Item has been added to your cart");
// //     } catch (error) {
// //       console.error("Error adding item:", error);
// //       Alert.alert("Error", "Couldn't add item to cart");
// //     }
// //   };

// //   const toggleLike = async (product_id) => {
// //     try {
// //       if (likedItems[product_id]) {
// //         await axiosInstance.delete(`${API_Like}/${product_id}`);
// //       } else {
// //         await axiosInstance.post(API_Like, { like_id: product_id });
// //       }

// //       setLikedItems((prev) => ({
// //         ...prev,
// //         [product_id]: !prev[product_id],
// //       }));
// //     } catch (error) {
// //       console.error("Error toggling like:", error);
// //       Alert.alert("Error", "Failed to update like status");
// //     }
// //   };

// //   const handleProductPress = (product) => {
// //     navigation.navigate("ProductDetails", { product_id: product.id });
// //   };

// //   const renderItem = ({ item }) => (
// //     <TouchableOpacity
// //       onPress={() => handleProductPress(item)}
// //       activeOpacity={0.8}
// //       style={styles_idea.productItem}
// //     >
// //       {/* Product Image with Badges */}
// //       <View style={styles_idea.imageContainer}>
// //         <Image
// //           source={{ uri: item.image }}
// //           style={styles_idea.productImage}
// //           resizeMode="cover"
// //         />

// //         {/* Top Left Badges */}
// //         <View style={styles_idea.topBadges}>
// //           {item.isNew && (
// //             <View style={[styles_idea.badge, styles_idea.newBadge]}>
// //               <Text style={styles_idea.badgeText}>NEW</Text>
// //             </View>
// //           )}
// //           {item.isTrending && (
// //             <View style={[styles_idea.badge, styles_idea.trendingBadge]}>
// //               <Text style={styles_idea.badgeText}>TRENDING</Text>
// //             </View>
// //           )}
// //         </View>

// //         {/* Free Shipping Badge */}
// //         {item.hasFreeShipping && (
// //           <View style={[styles_idea.badge, styles_idea.freeShippingBadge]}>
// //             <Text style={styles_idea.badgeText}>FREE SHIPPING</Text>
// //           </View>
// //         )}

// //         {/* Wishlist Button */}
// //         <TouchableOpacity
// //           style={styles_idea.wishlistButton}
// //           onPress={(e) => {
// //             e.stopPropagation();
// //             if (!userToken) {
// //               navigation.navigate("CustomerLogin");
// //             } else {
// //               toggleLike(item.id);
// //             }
// //           }}
// //         >
// //           <Ionicons
// //             name={likedItems[item.id] ? "heart" : "heart-outline"}
// //             size={20}
// //             color={
// //               likedItems[item.id] ? COLORS_idea.highlight : COLORS_idea.white
// //             }
// //           />
// //         </TouchableOpacity>
// //       </View>

// //       {/* Product Details */}
// //       <View style={styles_idea.productDetails}>
// //         {/* Shop */}
// //         <View style={styles_idea.shopContainer}>
// //           {item.isPreferred && (
// //             <View style={styles_idea.preferredBadge}>
// //               <Text style={styles_idea.preferredText}>Preferred</Text>
// //             </View>
// //           )}
// //           <Text style={styles_idea.productShop} numberOfLines={1}>
// //             {item.store}
// //           </Text>
// //         </View>

// //         {/* Product Name */}
// //         <Text style={styles_idea.productName} numberOfLines={2}>
// //           {item.product}
// //         </Text>

// //         {/* Price */}
// //         <View style={styles_idea.priceContainer}>
// //           <Text style={styles_idea.currentPrice}>₱{item.price}</Text>
// //           {item.originalPrice && (
// //             <Text style={styles_idea.originalPrice}>₱{item.originalPrice}</Text>
// //           )}
// //           {item.discount && (
// //             <Text style={styles_idea.discount}>{item.discount}</Text>
// //           )}
// //         </View>

// //         {/* Rating */}
// //         <View style={styles_idea.ratingContainer}>
// //           <View style={styles_idea.ratingWrapper}>
// //             <Ionicons name="star" size={14} color={COLORS_idea.rating} />
// //             <Text style={styles_idea.ratingText}>{item.rating || 0}</Text>
// //           </View>
// //           <Text style={styles_idea.soldText}>{item.sold || "0"} sold</Text>
// //         </View>

// //         {/* Location */}
// //         <View style={styles_idea.locationContainer}>
// //           <Ionicons
// //             name="location-outline"
// //             size={12}
// //             color={COLORS_idea.text}
// //           />
// //           <Text style={styles_idea.locationText}>{item.location}</Text>
// //         </View>
// //       </View>
// //     </TouchableOpacity>
// //   );

// //   return (
// //     <FlatList
// //       data={data}
// //       keyExtractor={(item) => item.id?.toString()}
// //       renderItem={renderItem}
// //       numColumns={2}
// //       contentContainerStyle={{ padding: 10 }}
// //       columnWrapperStyle={{ justifyContent: "space-between" }}
// //       showsVerticalScrollIndicator={false}
// //     />
// //   );
// // };

// // export default StaticProductStyle;

// // const styles_idea = StyleSheet.create({
// //   productItem: {
// //     width: "48%",
// //     backgroundColor: COLORS_idea.white,
// //     borderRadius: 12,
// //     overflow: "hidden",
// //     marginBottom: 16,
// //     borderWidth: 1,
// //     borderColor: COLORS_idea.border,
// //     elevation: 3,
// //   },
// //   imageContainer: {
// //     position: "relative",
// //   },
// //   productImage: {
// //     width: "100%",
// //     height: 150,
// //     borderTopLeftRadius: 12,
// //     borderTopRightRadius: 12,
// //   },
// //   topBadges: {
// //     position: "absolute",
// //     top: 8,
// //     left: 8,
// //     flexDirection: "row",
// //   },
// //   badge: {
// //     paddingHorizontal: 8,
// //     paddingVertical: 3,
// //     borderRadius: 4,
// //     marginRight: 6,
// //   },
// //   badgeText: {
// //     color: COLORS_idea.white,
// //     fontSize: 10,
// //     fontWeight: "bold",
// //   },
// //   newBadge: { backgroundColor: COLORS_idea.highlight },
// //   trendingBadge: { backgroundColor: COLORS_idea.secondary },
// //   freeShippingBadge: {
// //     position: "absolute",
// //     bottom: 8,
// //     left: 8,
// //     backgroundColor: COLORS_idea.freeShipping,
// //   },
// //   wishlistButton: {
// //     position: "absolute",
// //     top: 8,
// //     right: 8,
// //     backgroundColor: "rgba(0,0,0,0.3)",
// //     width: 28,
// //     height: 28,
// //     borderRadius: 14,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   productDetails: {
// //     padding: 12,
// //   },
// //   shopContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginBottom: 6,
// //   },
// //   preferredBadge: {
// //     paddingHorizontal: 6,
// //     paddingVertical: 2,
// //     borderRadius: 4,
// //     marginRight: 6,
// //     backgroundColor: COLORS_idea.secondary,
// //   },
// //   preferredText: {
// //     color: COLORS_idea.white,
// //     fontSize: 10,
// //     fontWeight: "bold",
// //   },
// //   productShop: {
// //     fontSize: 10,
// //     color: COLORS_idea.text,
// //     flexShrink: 1,
// //   },
// //   productName: {
// //     fontSize: 13,
// //     color: COLORS_idea.primary,
// //     marginBottom: 8,
// //     fontWeight: "600",
// //   },
// //   priceContainer: {
// //     flexDirection: "row",
// //     alignItems: "flex-end",
// //     marginBottom: 6,
// //     flexWrap: "wrap",
// //   },
// //   currentPrice: {
// //     fontSize: 15,
// //     fontWeight: "bold",
// //     color: COLORS_idea.primary,
// //     marginRight: 6,
// //   },
// //   originalPrice: {
// //     fontSize: 12,
// //     color: COLORS_idea.text,
// //     textDecorationLine: "line-through",
// //     marginRight: 6,
// //   },
// //   discount: {
// //     fontSize: 12,
// //     color: COLORS_idea.discount,
// //     fontWeight: "bold",
// //   },
// //   ratingContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     marginBottom: 6,
// //   },
// //   ratingWrapper: { flexDirection: "row", alignItems: "center" },
// //   ratingText: {
// //     fontSize: 12,
// //     color: COLORS_idea.primary,
// //     marginLeft: 4,
// //   },
// //   soldText: { fontSize: 12, color: COLORS_idea.text },
// //   locationContainer: { flexDirection: "row", alignItems: "center" },
// //   locationText: { fontSize: 11, color: COLORS_idea.text, marginLeft: 4 },
// // });

import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../auth/AuthContext";
import axiosInstance from '@api/axiosInstance';

const API = `/api/v1/Buyer Cart/buyer_cart`;
const API_Like = `/api/v1/Buyer Likes/buyer_like`;

// Unified Modern Color Palette
const COLORS = {
  primary: "#1E293B",    // Slate 800
  secondary: "#2563EB",  // Blue 600
  background: "#FFFFFF",
  surface: "#F8FAFC",    // Slate 50
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  rating: "#F59E0B",     // Amber 500
  danger: "#EF4444",
  success: "#10B981",
  white: "#FFFFFF",
};

const { width } = Dimensions.get('window');
// Calculate card width for grid view (2 columns with padding)
const CARD_MARGIN = 8;
const CONTAINER_PADDING = 16;
const GRID_ITEM_WIDTH = (width - (CONTAINER_PADDING * 2) - (CARD_MARGIN * 2)) / 2;

const StaticProductStyle = ({ data = [], horizontalItem = false }) => {
  const navigation = useNavigation();
  const [likedItems, setLikedItems] = useState({});
  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await axiosInstance.get(API_Like);
        const likedMap = (response.data || []).reduce(
          (acc, item) => ({
            ...acc,
            [item.product_info.id]: true,
          }),
          {}
        );
        setLikedItems(likedMap);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };
    fetchLikes();
  }, []);

  const toggleLike = async (product_id) => {
    try {
      if (likedItems[product_id]) {
        await axiosInstance.delete(`${API_Like}/${product_id}`);
      } else {
        await axiosInstance.post(API_Like, { like_id: product_id });
      }

      setLikedItems((prev) => ({
        ...prev,
        [product_id]: !prev[product_id],
      }));
    } catch (error) {
      console.error("Error toggling like:", error);
      Alert.alert("Error", "Failed to update like status");
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate("ProductDetails", { product_id: product.id });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleProductPress(item)}
      activeOpacity={0.9}
      style={[
        styles.card,
        horizontalItem ? styles.cardHorizontal : styles.cardGrid
      ]}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Badges */}
        <View style={styles.badgeContainer}>
          {item.isNew && (
            <View style={[styles.badge, styles.badgeNew]}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          )}
          {item.discount && (
            <View style={[styles.badge, styles.badgeSale]}>
              <Text style={styles.badgeText}>{item.discount}</Text>
            </View>
          )}
        </View>

        {/* Heart Icon */}
        <TouchableOpacity
          style={styles.likeButton}
          onPress={(e) => {
            e.stopPropagation();
            if (!userToken) navigation.navigate("CustomerLogin");
            else toggleLike(item.id);
          }}
        >
          <Ionicons
            name={likedItems[item.id] ? "heart" : "heart-outline"}
            size={18}
            color={likedItems[item.id] ? COLORS.danger : COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Shop Name */}
        {item.store && (
          <View style={styles.shopRow}>
            {item.isPreferred && (
              <Feather name="check-circle" size={10} color={COLORS.secondary} style={{marginRight: 4}} />
            )}
            <Text style={styles.shopName} numberOfLines={1}>{item.store}</Text>
          </View>
        )}

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>{item.product}</Text>

        {/* Price Row */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>₱{item.price}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>₱{item.originalPrice}</Text>
          )}
        </View>

        {/* Footer: Rating & Location */}
        <View style={styles.footer}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color={COLORS.rating} />
            <Text style={styles.ratingText}>{item.rating || "New"}</Text>
            <Text style={styles.soldText}> • {item.sold || 0} sold</Text>
          </View>
          
          {item.location && (
             <Text style={styles.location} numberOfLines={1}>{item.location}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id?.toString()}
      renderItem={renderItem}
      horizontal={horizontalItem}
      numColumns={horizontalItem ? 1 : 2}
      // If Grid: Use columnWrapperStyle for spacing between columns
      columnWrapperStyle={!horizontalItem ? { justifyContent: 'space-between' } : null}
      // If Horizontal: Use simple padding
      contentContainerStyle={{ 
        paddingHorizontal: horizontalItem ? 16 : CONTAINER_PADDING,
        paddingBottom: 20 
      }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      scrollEnabled={horizontalItem} // Only scroll internally if horizontal
    />
  );
};

const styles = StyleSheet.create({
  // Card Styles
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 16,
    // Soft Shadow
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardGrid: {
    width: GRID_ITEM_WIDTH,
  },
  cardHorizontal: {
    width: 160,
    marginRight: 12,
  },

  // Image Area
  imageContainer: {
    height: 150,
    backgroundColor: COLORS.surface,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  
  // Floating Elements on Image
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeNew: {
    backgroundColor: COLORS.secondary,
  },
  badgeSale: {
    backgroundColor: COLORS.danger,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  likeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Content Area
  content: {
    padding: 10,
  },
  shopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  shopName: {
    fontSize: 11,
    color: COLORS.textSecondary,
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
    lineHeight: 18,
    height: 36, // Fixed height for 2 lines alignment
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  
  // Footer
  footer: {
    flexDirection: 'column',
    gap: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 3,
  },
  soldText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  location: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

export default StaticProductStyle;