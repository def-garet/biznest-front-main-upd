import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Alert,
  RefreshControl,
  StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../style/theme";
import Swipeable from "react-native-gesture-handler/Swipeable";
import axiosInstance from "../api/axiosInstance";
const API = `/api/v1/Buyer Likes/buyer_like`;

const UserLike = ({ navigation }) => {
  const [likedProducts, setLikedProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLikedData();
    
  }, []);

  const fetchLikedData = async () => {
    try {
      setRefreshing(true);
      let storedItems = await AsyncStorage.getItem("likedItems");
      storedItems = storedItems ? JSON.parse(storedItems) : [];
      
      const response = await axiosInstance.get(API, { followRedirect: true });
      const fetchedLikeItems = response.data || [];

      setLikedProducts(fetchedLikeItems);
      await AsyncStorage.setItem('likedItems', JSON.stringify(fetchedLikeItems));
    } catch (error) {
      console.error("Error fetching liked items:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const removeItemFromLikes = async (id) => {
    try {
      let storedItems = await AsyncStorage.getItem("likedItems");
      storedItems = storedItems ? JSON.parse(storedItems) : [];

      const updatedLikes = storedItems.filter((item) => item.id !== id);
      await AsyncStorage.setItem("likedItems", JSON.stringify(updatedLikes));
      setLikedProducts(updatedLikes);

      const response = await axiosInstance.delete(`${API}/${id}`);
      if (response.status === 200) {
        Alert.alert("Success", "Item removed from likes");
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const confirmRemoveItem = (id) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your likes?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", onPress: () => removeItemFromLikes(id) },
      ]
    );
  };

  const renderRightActions = (progress, dragX, id) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        onPress={() => confirmRemoveItem(id)}
        style={styles.deleteButton}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <MaterialIcons name="delete-outline" size={28} color="white" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const onRefresh = () => {
    fetchLikedData();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>My Likes</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Feather name="search" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {likedProducts.length > 0 ? (
          likedProducts.map((product, index) => (
            <Swipeable
              key={index}
              renderRightActions={(progress, dragX) =>
                renderRightActions(progress, dragX, product.id)
              }
              containerStyle={styles.swipeableContainer}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("ProductDetails", { 
                  product_id: product.product_info.id 
                })}
                style={styles.productCard}
                activeOpacity={0.9}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: product.product_info.img }}
                    style={styles.productImage}
                  />
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>20% OFF</Text>
                  </View>
                </View>
                
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.product_info.name}
                  </Text>
                  
                  <View style={styles.priceContainer}>
                    <Text style={styles.productPrice}>
                      ₱{product.product_info.price.toLocaleString()}
                    </Text>
                    <Text style={styles.originalPrice}>
                      ₱{(product.product_info.price * 1.25).toLocaleString()}
                    </Text>
                  </View>
                  
                  <View style={styles.productMeta}>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>4.8</Text>
                      <Text style={styles.reviewCount}>(128)</Text>
                    </View>
                    <View style={styles.stockContainer}>
                      <Ionicons name="time-outline" size={14} color="#666" />
                      <Text style={styles.stockText}>Limited stock</Text>
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity 
                  onPress={() => confirmRemoveItem(product.id)}
                  style={styles.likeButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="heart" size={26} color={COLORS.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            </Swipeable>
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyHeart}>
              <Feather name="heart" size={60} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyText}>Your wishlist is empty</Text>
            <Text style={styles.emptySubtext}>
              Save your favorite items here by tapping the heart icon
            </Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.browseButtonText}>Browse Products</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  searchButton: {
    padding: 8,
    marginLeft: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  swipeableContainer: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    resizeMode: 'contain',
    backgroundColor: '#FAFAFA',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
    lineHeight: 22,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#999999',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  likeButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '80%',
    borderRadius: 8,
    alignSelf: 'center',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyHeart: {
    backgroundColor: '#F9F9F9',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  browseButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default UserLike;








// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Animated,
//   Alert,
//   RefreshControl,
//   StyleSheet
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
// import { COLORS } from "../style/theme";
// import axios from "axios";
// import API_URL  from "../api/api_urls";
// import Swipeable from "react-native-gesture-handler/Swipeable";
// import axiosInstance from "../api/axiosInstance";
// const API = `/api/v1/Buyer Likes/buyer_like`;

// const UserLike = ({ navigation }) => {
//   const [likedProducts, setLikedProducts] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     fetchLikedData();
//   }, []);

//   const fetchLikedData = async () => {
//     try {
//       setRefreshing(true);
//       let storedItems = await AsyncStorage.getItem("likedItems");
//       storedItems = storedItems ? JSON.parse(storedItems) : [];
      
//       const response = await axiosInstance.get(API, { followRedirect: true });
//       const fetchedLikeItems = response.data || [];

//       setLikedProducts(fetchedLikeItems);
//       await AsyncStorage.setItem('likedItems', JSON.stringify(fetchedLikeItems));
//     } catch (error) {
//       console.error("Error fetching liked items:", error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const removeItemFromLikes = async (id) => {
//     try {
//       let storedItems = await AsyncStorage.getItem("likedItems");
//       storedItems = storedItems ? JSON.parse(storedItems) : [];

//       const updatedLikes = storedItems.filter((item) => item.id !== id);
//       await AsyncStorage.setItem("likedItems", JSON.stringify(updatedLikes));
//       setLikedProducts(updatedLikes);

//       const response = await axiosInstance.delete(`${API}/${id}`);
//       if (response.status === 200) {
//         Alert.alert("Success", "Item removed from likes");
//       }
//     } catch (error) {
//       console.error("Error removing item:", error);
//     }
//   };

//   const confirmRemoveItem = (id) => {
//     Alert.alert(
//       "Remove Item",
//       "Are you sure you want to remove this item from your likes?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "Remove", onPress: () => removeItemFromLikes(id) },
//       ]
//     );
//   };

//   const renderRightActions = (progress, dragX, id) => {
//     const scale = dragX.interpolate({
//       inputRange: [-100, 0],
//       outputRange: [1, 0],
//       extrapolate: "clamp",
//     });

//     return (
//       <TouchableOpacity
//         onPress={() => confirmRemoveItem(id)}
//         style={styles.deleteButton}
//       >
//         <Animated.View style={{ transform: [{ scale }] }}>
//           <MaterialIcons name="delete-outline" size={28} color="white" />
//         </Animated.View>
//       </TouchableOpacity>
//     );
//   };

//   const onRefresh = () => {
//     fetchLikedData();
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
//         </TouchableOpacity>
//         <Text style={styles.title}>My Likes</Text>
//         <TouchableOpacity style={styles.searchButton}>
//           <Feather name="search" size={24} color={COLORS.primary} />
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         refreshControl={
//           <RefreshControl 
//             refreshing={refreshing} 
//             onRefresh={onRefresh}
//             tintColor={COLORS.primary}
//           />
//         }
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {likedProducts.length > 0 ? (
//           likedProducts.map((product, index) => (
//             <Swipeable
//               key={index}
//               renderRightActions={(progress, dragX) =>
//                 renderRightActions(progress, dragX, product.id)
//               }
//               containerStyle={styles.swipeableContainer}
//             >
//               <TouchableOpacity
//                 onPress={() => navigation.navigate("ProductDetails", { 
//                   product_id: product.product_info.id 
//                 })}
//                 style={styles.productCard}
//                 activeOpacity={0.9}
//               >
//                 <View style={styles.imageContainer}>
//                   <Image
//                     source={{ uri: product.product_info.img }}
//                     style={styles.productImage}
//                   />
//                   <View style={styles.discountBadge}>
//                     <Text style={styles.discountText}>20% OFF</Text>
//                   </View>
//                 </View>
                
//                 <View style={styles.productInfo}>
//                   <Text style={styles.productName} numberOfLines={2}>
//                     {product.product_info.name}
//                   </Text>
                  
//                   <View style={styles.priceContainer}>
//                     <Text style={styles.productPrice}>
//                       ₱{product.product_info.price.toLocaleString()}
//                     </Text>
//                     <Text style={styles.originalPrice}>
//                       ₱{(product.product_info.price * 1.25).toLocaleString()}
//                     </Text>
//                   </View>
                  
//                   <View style={styles.productMeta}>
//                     <View style={styles.ratingContainer}>
//                       <Ionicons name="star" size={16} color="#FFD700" />
//                       <Text style={styles.ratingText}>4.8</Text>
//                       <Text style={styles.reviewCount}>(128)</Text>
//                     </View>
//                     <View style={styles.stockContainer}>
//                       <Ionicons name="time-outline" size={14} color="#666" />
//                       <Text style={styles.stockText}>Limited stock</Text>
//                     </View>
//                   </View>
//                 </View>
                
//                 <TouchableOpacity 
//                   onPress={() => confirmRemoveItem(product.id)}
//                   style={styles.likeButton}
//                   activeOpacity={0.7}
//                 >
//                   <Ionicons name="heart" size={26} color={COLORS.primary} />
//                 </TouchableOpacity>
//               </TouchableOpacity>
//             </Swipeable>
//           ))
//         ) : (
//           <View style={styles.emptyState}>
//             <View style={styles.emptyHeart}>
//               <Feather name="heart" size={60} color={COLORS.primary} />
//             </View>
//             <Text style={styles.emptyText}>Your wishlist is empty</Text>
//             <Text style={styles.emptySubtext}>
//               Save your favorite items here by tapping the heart icon
//             </Text>
//             <TouchableOpacity 
//               style={styles.browseButton}
//               onPress={() => navigation.navigate("Home")}
//             >
//               <Text style={styles.browseButtonText}>Browse Products</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#F5F5F5',
//   },
//   backButton: {
//     padding: 8,
//     marginRight: 8,
//   },
//   searchButton: {
//     padding: 8,
//     marginLeft: 8,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: COLORS.primary,
//     flex: 1,
//     textAlign: 'center',
//     letterSpacing: 0.5,
//   },
//   scrollContent: {
//     padding: 16,
//     paddingBottom: 32,
//   },
//   swipeableContainer: {
//     marginBottom: 12,
//     borderRadius: 12,
//     backgroundColor: '#FFFFFF',
//   },
//   productCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#F0F0F0',
//   },
//   imageContainer: {
//     position: 'relative',
//   },
//   productImage: {
//     width: 90,
//     height: 90,
//     borderRadius: 8,
//     resizeMode: 'contain',
//     backgroundColor: '#FAFAFA',
//   },
//   discountBadge: {
//     position: 'absolute',
//     top: 8,
//     left: 8,
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   discountText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   productInfo: {
//     flex: 1,
//     marginLeft: 16,
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333333',
//     marginBottom: 6,
//     lineHeight: 22,
//   },
//   priceContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   productPrice: {
//     fontSize: 17,
//     fontWeight: '700',
//     color: COLORS.primary,
//     marginRight: 8,
//   },
//   originalPrice: {
//     fontSize: 14,
//     color: '#999999',
//     textDecorationLine: 'line-through',
//   },
//   productMeta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   ratingText: {
//     fontSize: 14,
//     color: '#666666',
//     marginLeft: 4,
//     marginRight: 4,
//   },
//   reviewCount: {
//     fontSize: 12,
//     color: '#999999',
//   },
//   stockContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   stockText: {
//     fontSize: 12,
//     color: '#666666',
//     marginLeft: 4,
//   },
//   likeButton: {
//     padding: 8,
//     marginLeft: 8,
//   },
//   deleteButton: {
//     backgroundColor: COLORS.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 80,
//     height: '80%',
//     borderRadius: 8,
//     alignSelf: 'center',
//     marginLeft: 8,
//   },
//   emptyState: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 40,
//     marginTop: 60,
//   },
//   emptyHeart: {
//     backgroundColor: '#F9F9F9',
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 24,
//   },
//   emptyText: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: COLORS.primary,
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   emptySubtext: {
//     fontSize: 15,
//     color: '#666666',
//     textAlign: 'center',
//     lineHeight: 22,
//     marginBottom: 24,
//     paddingHorizontal: 40,
//   },
//   browseButton: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 32,
//     paddingVertical: 14,
//     borderRadius: 8,
//   },
//   browseButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
// });

// export default UserLike;