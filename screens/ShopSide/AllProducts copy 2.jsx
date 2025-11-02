import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  TextInput,
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import { Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axiosInstance from '@api/axiosInstance';
import N8NAPI_URL from "../../api/n8n_api";
import API_URL  from "../../api/api_urls";

const productAPI = API_URL + "/api/v1/Product/product_api";

const { width } = Dimensions.get('window');

const AllProducts = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { title = "All Products", initialProducts = null } = route.params || {};

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [error, setError] = useState(null);

  // Filter options
  const filters = [
    { id: 'all', name: 'All' },
    { id: 'bestseller', name: 'Best Sellers' },
    { id: 'new', name: 'New Arrivals' },
    { id: 'sale', name: 'On Sale' },
  ];

  // Sort options
  const sortOptions = [
    { id: 'default', name: 'Default' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'name', name: 'Name: A to Z' },
    { id: 'popular', name: 'Most Popular' },
  ];

  useEffect(() => {
    initializeProducts();
  }, []);

  useEffect(() => {
    if (allProducts.length > 0) {
      filterAndSortProducts();
    }
  }, [searchQuery, sortBy, activeFilter, allProducts]);

  const initializeProducts = async () => {
    try {
      setLoading(true);
      
      // If initial products are provided via navigation, use them
      if (initialProducts && Array.isArray(initialProducts)) {
        console.log('Using initial products from navigation:', initialProducts.length);
        setAllProducts(initialProducts);
        setFilteredProducts(initialProducts);
      } else {
        // Otherwise, fetch all products from API
        console.log('Fetching all products from API');
        await fetchAllProducts();
      }
    } catch (err) {
      console.error('Error initializing products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // const fetchAllProducts = async () => {
  //   try {
  //     // You might need to adjust this endpoint to get all products
  //     const response = await axiosInstance.get(`${N8NAPI_URL}/webhook/656fcfbc-2d51-4b39-94b5-6fbb71629571/Search_product/all`);
      
  //     if (response.data && response.data.output) {
  //       setAllProducts(response.data.output);
  //       setFilteredProducts(response.data.output);
  //     } else {
  //       setError('No products found');
  //     }
  //   } catch (err) {
  //     console.error('Error fetching products:', err);
  //     setError('Failed to fetch products');
  //   }
  // };

    const fetchAllProducts = async () => {
    try {
      // You might need to adjust this endpoint to get all products
      const response = await axiosInstance.get(productAPI);
      
      if (response.data) {
        setAllProducts(response.data);
        setFilteredProducts(response.data);
      } else {
        setError('No products found');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    }
  };

  const filterAndSortProducts = () => {
    try {
      let result = [...allProducts];

      // Apply search filter
      if (searchQuery) {
        result = result.filter(product => 
          product && 
          product.name &&  // Changed from product.product to product.name
          typeof product.name === 'string' &&
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply category filter
      if (activeFilter !== 'all') {
        switch (activeFilter) {
          case 'bestseller':
            // Extract numeric value from sold string (e.g., "426 sold" -> 426)
            result = result.filter(product => {
              if (!product.sold) return false;
              const soldCount = parseInt(product.sold.replace(/[^0-9]/g, ''));
              return soldCount > 50;
            });
            break;
          case 'new':
            result = result.filter(product => product.isNew);
            break;
          case 'sale':
            result = result.filter(product => product.discount && product.discount.includes('%'));
            break;
          default:
            break;
        }
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          result.sort((a, b) => {
            const priceA = extractPrice(a.price);
            const priceB = extractPrice(b.price);
            return priceA - priceB;
          });
          break;
        case 'price-high':
          result.sort((a, b) => {
            const priceA = extractPrice(a.price);
            const priceB = extractPrice(b.price);
            return priceB - priceA;
          });
          break;
        case 'name':
          result.sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
          break;
        case 'popular':
          result.sort((a, b) => {
            const soldA = extractSoldCount(a.sold);
            const soldB = extractSoldCount(b.sold);
            return soldB - soldA;
          });
          break;
        default:
          break;
      }

      setFilteredProducts(result);
    } catch (error) {
      console.error('Error filtering products:', error);
      setFilteredProducts([]);
    }
  };

  // Helper function to extract numeric price from string (e.g., "₱2,045" -> 2045)
  const extractPrice = (priceString) => {
    if (!priceString) return 0;
    const numericString = priceString.replace(/[^0-9]/g, '');
    return parseInt(numericString) || 0;
  };

  // Helper function to extract sold count from string (e.g., "426 sold" -> 426)
  const extractSoldCount = (soldString) => {
    if (!soldString) return 0;
    const numericString = soldString.replace(/[^0-9]/g, '');
    return parseInt(numericString) || 0;
  };

  const renderProductItem = ({ item, index }) => {
    if (!item || typeof item !== 'object') {
      return null;
    }

    return (
      <TouchableOpacity 
        style={[
          styles.productCard,
          index % 2 === 0 ? styles.leftCard : styles.rightCard
        ]}
        onPress={() => {
          if (item && item.id) {
            navigation.navigate("ProductDetails", { product_id: item.id });
          }
        }}
      >
        <View style={styles.productImageContainer}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.productImage}
          />
          
          {/* Badges based on your API structure */}
          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          )}
          
          {item.isTrending && (
            <View style={styles.trendingBadge}>
              <Text style={styles.badgeText}>TRENDING</Text>
            </View>
          )}
          
          {item.hasFreeShipping && (
            <View style={styles.freeShippingBadge}>
              <Text style={styles.badgeText}>FREE SHIPPING</Text>
            </View>
          )}
          
          {extractSoldCount(item.sold) > 500 && (
            <View style={styles.bestSellerBadge}>
              <Ionicons name="trophy" size={12} color="#fff" />
              <Text style={styles.bestSellerText}>Best Seller</Text>
            </View>
          )}
        </View>
        
        <View style={styles.productInfo}>
          {/* Shop name with preferred badge */}
          <View style={styles.shopContainer}>
            {item.isPreferred && (
              <View style={styles.preferredBadge}>
                <Text style={styles.preferredText}>Preferred</Text>
              </View>
            )}
            <Text style={styles.productShop} numberOfLines={1}>
              {item.shop || 'Unknown Shop'}
            </Text>
          </View>

          {/* Product name */}
          <Text style={styles.productName} numberOfLines={2}>
            {item.name || 'Unnamed Product'}
          </Text>

          {/* Price information */}
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>{item.price || '₱0'}</Text>
            {item.originalPrice && item.originalPrice !== item.price && (
              <Text style={styles.originalPrice}>{item.originalPrice}</Text>
            )}
            {item.discount && (
              <Text style={styles.discountText}>{item.discount}</Text>
            )}
          </View>

          {/* Rating and sold information */}
          <View style={styles.productMeta}>
            <View style={styles.ratingContainer}>
              <AntDesign name="star" size={12} color="#f59e0b" />
              <Text style={styles.ratingText}>{item.rating || '0.0'}</Text>
              <Text style={styles.ratingCount}>({extractSoldCount(item.sold)})</Text>
            </View>
            <Text style={styles.soldText}>{item.sold || '0 sold'}</Text>
          </View>

          {/* Location */}
          {item.location && (
            <View style={styles.locationContainer}>
              <Feather name="map-pin" size={10} color="#64748b" />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === item.id && styles.activeFilterButton
      ]}
      onPress={() => setActiveFilter(item.id)}
    >
      <Text style={[
        styles.filterButtonText,
        activeFilter === item.id && styles.activeFilterButtonText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const productsCount = filteredProducts.length;

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="chevron-left" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.centerContainer}>
          <Feather name="alert-triangle" size={64} color="#dc2626" />
          <Text style={styles.emptyStateTitle}>Something went wrong</Text>
          <Text style={styles.emptyStateText}>{error}</Text>
          <TouchableOpacity 
            style={styles.emptyStateButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.emptyStateButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-left" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Search Bar */}
      {allProducts.length > 0 && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Feather name="search" size={20} color="#64748b" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Feather name="x" size={20} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Filter Bar */}
      {allProducts.length > 0 && (
        <View style={styles.filterSection}>
          <FlatList
            data={filters}
            renderItem={renderFilterItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          />
          
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => {
              const currentIndex = sortOptions.findIndex(option => option.id === sortBy);
              const nextIndex = (currentIndex + 1) % sortOptions.length;
              setSortBy(sortOptions[nextIndex].id);
            }}
          >
            <Feather name="sliders" size={18} color="#64748b" />
            <Text style={styles.sortButtonText}>
              {sortOptions.find(option => option.id === sortBy)?.name || 'Sort'}
            </Text>
            <Feather name="chevron-down" size={16} color="#64748b" />
          </TouchableOpacity>
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {loading ? 'Loading...' : `${productsCount} ${productsCount === 1 ? 'product' : 'products'} found`}
        </Text>
      </View>

      {/* Content based on state */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : allProducts.length === 0 ? (
        <View style={styles.centerContainer}>
          <Feather name="package" size={64} color="#cbd5e1" />
          <Text style={styles.emptyStateTitle}>No Products Available</Text>
          <Text style={styles.emptyStateText}>
            There are no products to display at the moment.
          </Text>
          <TouchableOpacity 
            style={styles.emptyStateButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.emptyStateButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : productsCount === 0 ? (
        <View style={styles.centerContainer}>
          <Feather name="search" size={64} color="#cbd5e1" />
          <Text style={styles.emptyStateTitle}>No Products Found</Text>
          <Text style={styles.emptyStateText}>
            Try adjusting your search or filter to find what you're looking for.
          </Text>
          <TouchableOpacity 
            style={styles.emptyStateButton}
            onPress={() => {
              setSearchQuery("");
              setActiveFilter("all");
              setSortBy("default");
            }}
          >
            <Text style={styles.emptyStateButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item?.id?.toString() || `product-${Math.random()}`}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsGrid}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  headerRight: {
    width: 32,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  filterList: {
    flex: 1,
    paddingRight: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#ffffff',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginHorizontal: 6,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
  },
  resultsText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  productsGrid: {
    padding: 10,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productCard: {
    width: (width - 40) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
    marginBottom: 10,
  },
  leftCard: {
    marginRight: 5,
  },
  rightCard: {
    marginLeft: 5,
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f8fafc',
    resizeMode: 'cover',
  },
  // Badge styles
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#dc2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trendingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#2563eb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  freeShippingBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#059669',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bestSellerBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  bestSellerText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  productInfo: {
    padding: 12,
  },
  shopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  preferredBadge: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  preferredText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  productShop: {
    fontSize: 10,
    color: '#64748b',
    flex: 1,
  },
  productName: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 16,
    height: 32,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  currentPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: '#64748b',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  discountText: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '600',
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#475569',
    marginLeft: 2,
  },
  ratingCount: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 2,
  },
  soldText: {
    fontSize: 12,
    color: '#64748b',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 11,
    color: '#64748b',
    marginLeft: 4,
  },
});

export default AllProducts;