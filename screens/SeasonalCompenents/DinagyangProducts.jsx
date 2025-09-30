import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const DinagyangProducts = () => {
  const dinagyangProducts = [
    {
      id: 1,
      name: "Dinagyang Festival T-Shirt",
      price: "₱399",
      originalPrice: "₱499",
      discount: "20% off",
      rating: "4.8",
      sold: "1.2K sold",
      image: "https://m.media-amazon.com/images/I/61w+n2HM7nL.jpg",
      isTrending: true,
      hasFreeShipping: true
    },
    {
      id: 2,
      name: "Ilonggo Tribal Mask",
      price: "₱120",
      originalPrice: "₱70",
      discount: "25% off",
      rating: "4.9",
      sold: "850 sold",
      image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSHlcV3Idwm3FEVw80DzJMoMP-1is74-fpdrJAhIaPRpD4uxFptWIMse6RFo7Kt2U09CD1BnwmeR4U_2yA9giJULv18Ur6_1jX3DEYsOJoHVNXB54a7j_Kz",
      isNew: true
    },
    {
      id: 3,
      name: "Dinagyang Beaded Bracelet",
      price: "₱199",
      originalPrice: "₱249",
      discount: "20% off",
      rating: "4.7",
      sold: "2.3K sold",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLAgtose76iJyocowBItVIpSZoK7KXpIfuuQ&s",
      hasFreeShipping: true
    },
    {
      id: 4,
      name: "Tribal Costume Accessories Set",
      price: "₱899",
      originalPrice: "₱1099",
      discount: "18% off",
      rating: "4.8",
      sold: "520 sold",
      image: "https://fameplus.com/uploads/articles/1628647790124_DF_PhInspiredAccessoriesBanner.jpg",
      isTrending: true
    }
  ];

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productItem}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        {item.isTrending && (
          <View style={[styles.badge, styles.trendingBadge]}>
            <Text style={styles.badgeText}>TRENDING</Text>
          </View>
        )}
        {item.isNew && (
          <View style={[styles.badge, styles.newBadge]}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        )}
      </View>

      <View style={styles.productDetails}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>{item.price}</Text>
          <Text style={styles.originalPrice}>{item.originalPrice}</Text>
          <Text style={styles.discount}>{item.discount}</Text>
        </View>

        <View style={styles.ratingContainer}>
          <View style={styles.ratingWrapper}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.soldText}>{item.sold}</Text>
        </View>

        {item.hasFreeShipping && (
          <View style={styles.freeShippingBadge}>
            <Text style={styles.freeShippingText}>FREE SHIPPING</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dinagyang Festival Specials</Text>
        <Text style={styles.subtitle}>Celebrate Iloilo's vibrant culture with these exclusive items</Text>
      </View>

      <FlatList
        data={dinagyangProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity style={styles.seeAllButton}>
        <Text style={styles.seeAllText}>See All Dinagyang Products</Text>
        <Ionicons name="arrow-forward" size={16} color="#2196f3" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 12,
  },
  header: {
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#172d55',
  },
  subtitle: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
  },
  listContent: {
    paddingVertical: 8,
  },
  productItem: {
    width: 160,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginRight: 12,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  trendingBadge: {
    backgroundColor: '#2196f3',
  },
  newBadge: {
    backgroundColor: '#ff6b6b',
  },
  productDetails: {
    padding: 8,
  },
  productName: {
    fontSize: 13,
    color: '#172d55',
    fontWeight: '600',
    marginBottom: 6,
    height: 36,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#172d55',
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 11,
    color: '#6c757d',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  discount: {
    fontSize: 11,
    color: '#e53935',
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#172d55',
    marginLeft: 4,
  },
  soldText: {
    fontSize: 11,
    color: '#6c757d',
  },
  freeShippingBadge: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  freeShippingText: {
    fontSize: 10,
    color: '#4caf50',
    fontWeight: 'bold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  seeAllText: {
    color: '#2196f3',
    fontWeight: '500',
    marginRight: 4,
  },
});

export default DinagyangProducts;