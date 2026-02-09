import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity, 
  Dimensions,
  Animated,
  Easing,
  StatusBar,
  SafeAreaView
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import axiosInstance from '@api/axiosInstance';
import N8NAPI_URL from "../../api/n8n_api";
import { StaticProductStyle } from "../Global";

// Your Custom Palette Applied
const COLORS = {
  primary: '#172d55',    // Deep Blue - Active Buttons & Headers
  secondary: '#2196f3',  // Bright Blue - Accents & Icons
  background: '#ffffff', // Pure White
  text: '#808080',       // Gray - Body Text
  
  // UI Helpers derived from your palette
  textPrimary: '#172d55', 
  surface: '#f8f9fa',
  border: '#e0e0e0',
  white: '#ffffff',
  inputBg: '#f1f5f9',
};

const { width } = Dimensions.get('window');

const SearchResults = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { searchTerm } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [product, setProduct] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Latest');
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Recommended');

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${N8NAPI_URL}/webhook/656fcfbc-2d51-4b39-94b5-6fbb71629571/Search_product/${searchTerm}`
      );
      const rawData = response.data;
      const products = Array.isArray(rawData)
        ? rawData.flatMap(item => item.output)
        : [];
      setProduct(products);
      setAllProducts(products);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSelect = (filter) => {
    setActiveFilter(filter);
    let filtered = [...allProducts];

    switch (filter) {
      case 'Latest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'Top Sales':
        filtered.sort((a, b) => (b.sold || 0) - (a.sold || 0));
        break;
      case 'Price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'Free Shipping':
        filtered = filtered.filter(item => item.hasFreeShipping);
        break;
      case 'Preferred':
        filtered = filtered.filter(item => item.isPreferred);
        break;
      case 'Discount':
        filtered = filtered.filter(item => item.discount);
        break;
    }
    setProduct(filtered);
  };

  const handleSortSelect = (sortOption) => {
    setSelectedSort(sortOption);
    setShowSortModal(false);

    let sorted = [...product];

    switch (sortOption) {
      case "Recommended":
        sorted = [...allProducts];
        break;
      case "Latest":
        sorted.sort((a, b) => b.id - a.id);
        break;
      case "Top Sales":
        sorted.sort((a, b) => (b.sold || 0) - (a.sold || 0));
        break;
      case "Price: Low to High":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "Rating":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
    setProduct(sorted);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Searching for "{searchTerm}"...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>"{searchTerm}"</Text>
          <Text style={styles.headerSubtitle}>{product.length} results found</Text>
        </View>

        <TouchableOpacity 
          style={styles.iconBtn}
          onPress={() => setShowSortModal(true)}
        >
          <Feather name="sliders" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* 2. Filters & Sort Bar */}
      <View style={styles.filterSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {['Latest', 'Top Sales', 'Price', 'Free Shipping', 'Preferred', 'Discount'].map((filter) => (
            <TouchableOpacity 
              key={filter}
              style={[
                styles.filterChip, 
                activeFilter === filter && styles.activeFilterChip
              ]}
              onPress={() => handleFilterSelect(filter)}
            >
              <Text style={[
                styles.filterText, 
                activeFilter === filter && styles.activeFilterText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 3. Sort Indicator */}
      <View style={styles.sortIndicatorRow}>
        <Text style={styles.resultsText}>
          Showing results for <Text style={styles.boldText}>{searchTerm}</Text>
        </Text>
        <TouchableOpacity 
          style={styles.sortTrigger}
          onPress={() => setShowSortModal(true)}
        >
          <Text style={styles.sortTriggerText}>{selectedSort}</Text>
          <Feather name="chevron-down" size={14} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

      {/* 4. Product Grid */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {product.length > 0 ? (
          <Animated.View style={{ opacity: fadeAnim }}>
            <StaticProductStyle data={product} />
          </Animated.View>
        ) : (
          <View style={styles.emptyContainer}>
            <Feather name="search" size={64} color={COLORS.border} />
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptyText}>Try searching for a different keyword.</Text>
          </View>
        )}
      </ScrollView>

      {/* 5. Sort Modal */}
      {showSortModal && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setShowSortModal(false)} 
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <Feather name="x" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            
            {['Recommended', 'Latest', 'Top Sales', 'Price: Low to High', 'Price: High to Low', 'Rating'].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.sortOption}
                onPress={() => handleSortSelect(option)}
              >
                <Text style={[
                  styles.sortOptionText,
                  selectedSort === option && styles.selectedSortOptionText
                ]}>
                  {option}
                </Text>
                {selectedSort === option && (
                  <Feather name="check" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.text,
  },

  // Filters
  filterSection: {
    paddingVertical: 12,
    backgroundColor: COLORS.background,
  },
  filterContent: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: COLORS.primary, // Changed to Primary
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
  activeFilterText: {
    color: COLORS.white,
    fontWeight: '600',
  },

  // Sort Indicator
  sortIndicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.background,
  },
  resultsText: {
    fontSize: 13,
    color: COLORS.text,
  },
  boldText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  sortTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortTriggerText: {
    fontSize: 13,
    color: COLORS.secondary,
    fontWeight: '600',
    marginRight: 4,
  },

  // Content
  scrollContent: {
    paddingBottom: 20,
    backgroundColor: COLORS.surface, 
    minHeight: '100%',
    paddingTop: 10,
  },
  
  // Loading & Empty
  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: COLORS.background
  },
  loadingText: { 
    marginTop: 12, 
    color: COLORS.text 
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 8,
  },

  // Modal
  modalOverlay: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    zIndex: 20,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: { 
    backgroundColor: COLORS.white, 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20, 
    padding: 20, 
    width: '100%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
    paddingBottom: 12,
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: COLORS.textPrimary 
  },
  sortOption: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.surface 
  },
  sortOptionText: { 
    fontSize: 16, 
    color: COLORS.text 
  },
  selectedSortOptionText: { 
    color: COLORS.primary, 
    fontWeight: '700' 
  },
});

export default SearchResults;