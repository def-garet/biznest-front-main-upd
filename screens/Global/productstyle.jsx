import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
// import API_URL from "../../api/api_urls";
import { COLORS } from "../../style/theme";
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import  axiosInstance  from "../../api/axiosInstance"; 

const API = `/api/v1/Buyer Cart/buyer_cart`;
const API_Like = `/api/v1/Buyer Likes/buyer_like`;

const ProductStyle = ({ data }) => {
  const navigation = useNavigation();
  const [likedItems, setLikedItems] = useState({});
  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await axiosInstance.get(API_Like);
        const likedMap = (response.data || []).reduce((acc, item) => ({
          ...acc,
          [item.product_info.id]: true
        }), {});
        setLikedItems(likedMap);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };
    fetchLikes();
  }, []);

  const handleCartAction = async (product_id) => {
    try {
      await axiosInstance.post(API, { product_id });
      Alert.alert("Added to Cart", "Item has been added to your cart");
    } catch (error) {
      console.error("Error adding item:", error);
      Alert.alert("Error", "Couldn't add item to cart");
    }
  };

  const toggleLike = async (product_id) => {
    try {
      likedItems[product_id] 
        ? await axiosInstance.delete(`${API_Like}/${product_id}`)
        : await axiosInstance.post(API_Like, { like_id: product_id });
      
      setLikedItems(prev => ({ ...prev, [product_id]: !prev[product_id] }));
    } catch (error) {
      console.error("Error toggling like:", error);
      Alert.alert("Error", "Failed to update like status");
    }
  };

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item) => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate("ProductDetails", { product_id: item.id })}
          activeOpacity={0.9}
          style={styles.card}
        >
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: item.img }} 
              style={styles.image}
              resizeMode="cover"
            />
            
            <TouchableOpacity 
              onPress={(e) => { 
                    if (!userToken) {
                      navigation.navigate("CustomerLogin");
                    } else {
                      e.stopPropagation();
                      toggleLike(item.id); 
                    }
                
                }}
              style={[styles.likeButton, likedItems[item.id] && styles.likedButton]}
            >
              <AntDesign name="heart" size={16} color={likedItems[item.id] ? "#fff" : "rgba(0,0,0,0.5)"} />
            </TouchableOpacity>
            
            {item.discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{item.discount}%</Text>
              </View>
            )}
          </View>

          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            </Text>
            
            <View style={styles.metaContainer}>
              <Text style={styles.subtitle} numberOfLines={1}>{item.pieces}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating || '4.8'}</Text>
              </View>
            </View>

            <View style={styles.footer}>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>₱{item.price.toLocaleString()}</Text>
                {item.originalPrice && (
                  <Text style={styles.originalPrice}>₱{item.originalPrice.toLocaleString()}</Text>
                )}
              </View>
              <TouchableOpacity
                onPress={(e) => {
                    if (!userToken) {
                      navigation.navigate("CustomerLogin");
                    } else {
                      e.stopPropagation(); 
                      handleCartAction(item.id);
                    }
  
                   }}
                style={styles.cartButton}
              >
                <Ionicons name="cart-outline" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 16,
  },
  card: {
    width: responsiveWidth(44),
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    height: responsiveHeight(20),
    width: '100%',
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  likeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)'
  },
  likedButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 14,
    paddingTop: 12,
  },
  title: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    lineHeight: 20,
    height: 40,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: "#666",
    fontSize: responsiveFontSize(1.5),
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  ratingText: {
    fontSize: responsiveFontSize(1.4),
    color: "#666",
    marginLeft: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: responsiveFontSize(2.1),
    fontWeight: "700",
    color: COLORS.primary,
  },
  originalPrice: {
    fontSize: responsiveFontSize(1.4),
    color: "#999",
    textDecorationLine: "line-through",
    marginTop: 2,
  },
  cartButton: {
    backgroundColor: COLORS.primary,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default ProductStyle;