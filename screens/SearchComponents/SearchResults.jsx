import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity, 
  Dimensions,
  Animated,
  Easing
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import axiosInstance from '@api/axiosInstance';
import N8NAPI_URL from "../../api/n8n_api";
import { StaticProductStyle } from "../Global";

const COLORS_idea = {
  primary: '#172d55',
  secondary: '#2196f3',
  background: '#f8f9fa',
  text: '#6c757d',
  border: '#e0e0e0',
  white: '#ffffff',
  headerBg: '#172d55',
  highlight: '#ff6b6b'
};

const { width } = Dimensions.get('window');

const SearchResults = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { searchTerm } = route.params;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

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
      easing: Easing.ease,
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
      console.log("Fetched products:", products);
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

  // ✅ Sort function for dropdown
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

  const handleProductPress = (product) => {
    navigation.navigate("ProductDetails", { product_id: product.id });
  };

  if (loading) {
    return (
      <View style={styles_idea.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS_idea.primary} />
        <Text style={styles_idea.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles_idea.container}>
      {/* Header */}
      <View style={styles_idea.header}>
        <View style={styles_idea.headerContent}>
          <TouchableOpacity 
            style={styles_idea.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS_idea.white} />
          </TouchableOpacity>
          <Text style={styles_idea.headerTitle}>Results for "{searchTerm}"</Text>
          <TouchableOpacity 
            style={styles_idea.filterIcon}
            onPress={() => setShowSortModal(true)}
          >
            <Ionicons name="filter" size={20} color={COLORS_idea.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles_idea.content}>
        {/* Filter Buttons */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles_idea.filterContainer}
          contentContainerStyle={styles_idea.filterContent}
        >
          {['Latest', 'Top Sales', 'Price', 'Free Shipping', 'Preferred', 'Near Me', 'Discount'].map((filter) => (
            <TouchableOpacity 
              key={filter}
              style={[
                styles_idea.filterButton, 
                activeFilter === filter && styles_idea.activeFilter
              ]}
              onPress={() => handleFilterSelect(filter)}
            >
              <Text style={[
                styles_idea.filterText, 
                activeFilter === filter && styles_idea.activeFilterText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results and Sort by */}
        <View style={styles_idea.resultsContainer}>
          <Text style={styles_idea.resultsText}>
            {product.length} results found
          </Text>
          <TouchableOpacity 
            style={styles_idea.sortButton}
            onPress={() => setShowSortModal(true)}
          >
            <Text style={styles_idea.sortText}>Sort by: {selectedSort}</Text>
            <Ionicons name="chevron-down" size={16} color={COLORS_idea.primary} />
          </TouchableOpacity>
        </View>

        {/* Product Grid */}
        <StaticProductStyle data={product} />
      </ScrollView>

      {/* Sort Modal */}
      {showSortModal && (
        <View style={styles_idea.modalOverlay}>
          <View style={styles_idea.modalContainer}>
            <Text style={styles_idea.modalTitle}>Sort by</Text>
            {['Recommended', 'Latest', 'Top Sales', 'Price: Low to High', 'Price: High to Low', 'Rating'].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles_idea.sortOption}
                onPress={() => handleSortSelect(option)}
              >
                <Text style={[
                  styles_idea.sortOptionText,
                  selectedSort === option && styles_idea.selectedSortOption
                ]}>
                  {option}
                </Text>
                {selectedSort === option && (
                  <Ionicons name="checkmark" size={20} color={COLORS_idea.primary} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles_idea.closeButton}
              onPress={() => setShowSortModal(false)}
            >
              <Text style={styles_idea.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles_idea = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS_idea.background },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: COLORS_idea.text },
  header: { paddingTop: 40, paddingBottom: 12, paddingHorizontal: 16, backgroundColor: COLORS_idea.headerBg },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: COLORS_idea.white },
  content: { paddingHorizontal: 12 },
  filterContainer: { marginVertical: 16 },
  filterContent: { paddingHorizontal: 4 },
  filterButton: { paddingHorizontal: 16, paddingVertical: 8, marginRight: 8, borderRadius: 16, backgroundColor: COLORS_idea.white, borderWidth: 1, borderColor: COLORS_idea.border },
  activeFilter: { backgroundColor: COLORS_idea.primary, borderColor: COLORS_idea.primary },
  filterText: { color: COLORS_idea.primary },
  activeFilterText: { color: COLORS_idea.white },
  resultsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  resultsText: { fontSize: 14, color: COLORS_idea.text },
  sortButton: { flexDirection: 'row', alignItems: 'center' },
  sortText: { fontSize: 14, color: COLORS_idea.primary, fontWeight: '500', marginRight: 4 },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 20 },
  modalContainer: { backgroundColor: COLORS_idea.white, borderRadius: 12, padding: 20, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: COLORS_idea.primary },
  sortOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS_idea.border },
  sortOptionText: { fontSize: 16, color: COLORS_idea.text },
  selectedSortOption: { color: COLORS_idea.primary, fontWeight: 'bold' },
  closeButton: { marginTop: 20, padding: 12, backgroundColor: COLORS_idea.primary, borderRadius: 8, alignItems: 'center' },
  closeButtonText: { color: COLORS_idea.white, fontWeight: 'bold' },
});

export default SearchResults;
