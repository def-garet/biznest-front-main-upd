import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../auth/AuthContext";
import axiosInstance from "@api/axiosInstance";

const API_CART = `/api/v1/Buyer Cart/buyer_cart`;
const API_LIKE = `/api/v1/Buyer Likes/buyer_like`;

const COLORS = {
  primary: "#172d55",
  secondary: "#2196f3",
  text: "#6c757d",
  discount: "#e53935",
  freeShipping: "#4caf50",
  highlight: "#ff6b6b",
  rating: "#FFD700",
  white: "#ffffff",
  border: "#e0e0e0",
};

const ProductsEnhanced = ({ data = [] }) => {
  const navigation = useNavigation();
  const { userToken } = useContext(AuthContext);
  const [likedItems, setLikedItems] = useState({});

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await axiosInstance.get(API_LIKE);
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

  const handleCartAction = async (product_id) => {
    try {
      await axiosInstance.post(API_CART, { product_id });
      Alert.alert("Added to Cart", "Item has been added to your cart");
    } catch (error) {
      console.error("Error adding item:", error);
      Alert.alert("Error", "Couldn't add item to cart");
    }
  };

  const toggleLike = async (product_id) => {
    try {
      if (likedItems[product_id]) {
        await axiosInstance.delete(`${API_LIKE}/${product_id}`);
      } else {
        await axiosInstance.post(API_LIKE, { like_id: product_id });
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

  const handleProductPress = (item) => {
    navigation.navigate("ProductDetails", { product_id: item.id });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleProductPress(item)}
      activeOpacity={0.8}
      style={styles.productItem}
    >
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />

        {/* Top Badges */}
        <View style={styles.topBadges}>
          {item.isNew && (
            <View style={[styles.badge, styles.newBadge]}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          )}
          {item.isTrending && (
            <View style={[styles.badge, styles.trendingBadge]}>
              <Text style={styles.badgeText}>TRENDING</Text>
            </View>
          )}
        </View>

        {/* Free Shipping */}
        {item.hasFreeShipping && (
          <View style={[styles.badge, styles.freeShippingBadge]}>
            <Text style={styles.badgeText}>FREE SHIPPING</Text>
          </View>
        )}

        {/* Wishlist */}
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={(e) => {
            e.stopPropagation();
            if (!userToken) navigation.navigate("CustomerLogin");
            else toggleLike(item.id);
          }}
        >
          <Ionicons
            name={likedItems[item.id] ? "heart" : "heart-outline"}
            size={20}
            color={likedItems[item.id] ? COLORS.highlight : COLORS.white}
          />
        </TouchableOpacity>
      </View>

      {/* Product Details */}
      <View style={styles.productDetails}>
        <View style={styles.shopContainer}>
          {item.isPreferred && (
            <View style={styles.preferredBadge}>
              <Text style={styles.preferredText}>Preferred</Text>
            </View>
          )}
          <Text style={styles.productShop} numberOfLines={1}>
            {item.store}
          </Text>
        </View>

        <Text style={styles.productName} numberOfLines={2}>
          {item.product}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>₱{item.price}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>₱{item.originalPrice}</Text>
          )}
          {item.discount && <Text style={styles.discount}>{item.discount}</Text>}
        </View>

        <View style={styles.ratingContainer}>
          <View style={styles.ratingWrapper}>
            <Ionicons name="star" size={14} color={COLORS.rating} />
            <Text style={styles.ratingText}>{item.rating || 0}</Text>
          </View>
          <Text style={styles.soldText}>{item.sold || "0"} sold</Text>
        </View>

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={12} color={COLORS.text} />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        {/* <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => handleCartAction(item.id)}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );

  // ✅ Early return if data is null or empty
  if (!data || data.length === 0) return null;

  return (
    <View style={{ marginVertical: 16 }}>
      {/* Header */}
      <View style={{ marginBottom: 12, paddingHorizontal: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: COLORS.primary }}>
            {data.length > 0 ? data[0].season_name : "Season Products"}
        </Text>
        <Text style={{ fontSize: 12, color: COLORS.text, marginTop: 4 }}>
          Celebrate Iloilo's vibrant culture with these exclusive items
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      />

       <TouchableOpacity style={styles.seeAllButton}
       onPress={() =>
          navigation.navigate("AllProducts", {
            title: data?.[0]?.season_name ?? "Season Products",
            initialProducts: data, // pass full data
          })
        }
       
       >
              <Text style={styles.seeAllText}>See All Dinagyang Products</Text>
              <Ionicons name="arrow-forward" size={16} color="#2196f3" />
    </TouchableOpacity>
    </View>
  );
};

export default ProductsEnhanced;

const styles = StyleSheet.create({
  productItem: {
    width: 150,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 3,
  },
  imageContainer: { position: "relative" },
  productImage: { width: "100%", height: 150 },
  topBadges: { position: "absolute", top: 8, left: 8, flexDirection: "row" },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginRight: 6 },
  badgeText: { color: COLORS.white, fontSize: 10, fontWeight: "bold" },
  newBadge: { backgroundColor: COLORS.highlight },
  trendingBadge: { backgroundColor: COLORS.secondary },
  freeShippingBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: COLORS.freeShipping,
  },
  wishlistButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  productDetails: { padding: 12 },
  shopContainer: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  preferredBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 6, backgroundColor: COLORS.secondary },
  preferredText: { color: COLORS.white, fontSize: 10, fontWeight: "bold" },
  productShop: { fontSize: 10, color: COLORS.text, flexShrink: 1 },
  productName: { fontSize: 13, color: COLORS.primary, fontWeight: "600", marginBottom: 6 },
  priceContainer: { flexDirection: "row", alignItems: "flex-end", marginBottom: 6, flexWrap: "wrap" },
  currentPrice: { fontSize: 14, fontWeight: "bold", color: COLORS.primary, marginRight: 6 },
  originalPrice: { fontSize: 12, color: COLORS.text, textDecorationLine: "line-through", marginRight: 6 },
  discount: { fontSize: 12, color: COLORS.discount, fontWeight: "bold" },
  ratingContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  ratingWrapper: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 12, color: COLORS.primary, marginLeft: 4 },
  soldText: { fontSize: 11, color: COLORS.text },
  locationContainer: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  locationText: { fontSize: 11, color: COLORS.text, marginLeft: 4 },
  addToCartButton: { backgroundColor: COLORS.secondary, paddingVertical: 4, borderRadius: 4, alignItems: "center" },
  addToCartText: { color: COLORS.white, fontWeight: "bold", fontSize: 12 },
   seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingVertical: 8,
  },
  seeAllText: {
    color: COLORS.secondary,
    fontWeight: "500",
    marginRight: 4,
  },
});
