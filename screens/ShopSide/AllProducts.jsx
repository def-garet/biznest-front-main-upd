// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   TouchableOpacity,
//   TextInput,
//   Dimensions,
//   Animated,
//   Easing,
//   SafeAreaView,
// } from "react-native";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { Feather } from "@expo/vector-icons";
// import axiosInstance from "../../api/axiosInstance";
// import API_URL  from "../../api/api_urls";
// import { StaticProductStyle } from "../Global";

// const COLORS = {
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

// const { width } = Dimensions.get("window");

// const AllProducts = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   const { title = "All Products", initialProducts = null, category_id=null } = route.params || {};

//   const [products, setProducts] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeFilter, setActiveFilter] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBy, setSortBy] = useState("default");

//   const productAPI = API_URL + "/api/v1/Product/product_api";

//   const filters = [
//     { id: "all", name: "All" },
//     { id: "bestseller", name: "Best Sellers" },
//     { id: "new", name: "New Arrivals" },
//     { id: "sale", name: "On Sale" },
//   ];

//   const sortOptions = [
//     { id: "default", name: "Recommended" },
//     { id: "price-low", name: "Price: Low to High" },
//     { id: "price-high", name: "Price: High to Low" },
//     { id: "name", name: "Name: A to Z" },
//     { id: "popular", name: "Most Popular" },
//   ];

//   useEffect(() => {
//     initializeProducts();
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 500,
//       easing: Easing.ease,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   useEffect(() => {
//     if (allProducts.length > 0) filterAndSortProducts();
//   }, [searchQuery, activeFilter, sortBy, allProducts]);

//   const initializeProducts = async () => {
//     try {
//       setLoading(true);
//       if (initialProducts && Array.isArray(initialProducts)) {
//         setAllProducts(initialProducts);
//         setProducts(initialProducts);
//       } else {
//         await fetchAllProducts();
//       }
//     } catch (err) {
//       setError("Failed to load products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const fetchAllProducts = async () => {
//   //   try {
//   //     const response = await axiosInstance.get(productAPI);
//   //     if (response.data) {
//   //       setAllProducts(response.data);
//   //       setProducts(response.data);
//   //     } else setError("No products found");
//   //   } catch (err) {
//   //     setError("Failed to fetch products");
//   //   }
//   // };

// //   const fetchAllProducts = async () => {
// //   try {
// //     setLoading(true);
// //     const response = await axiosInstance.get(
// //       `${API_URL}/api/v1/Search Product/search_product`, // your Flask endpoint
// //       {
// //         params: { query: title } // pass query as GET param
// //       }
// //     );

// //     if (response.data) {
// //       setAllProducts(response.data);
// //       setProducts(response.data);
// //     } else {
// //       setAllProducts([]);
// //       setProducts([]);
// //       setError("No products found");
// //     }
// //   } catch (err) {
// //     console.error(err);
// //     setAllProducts([]);
// //     setProducts([]);
// //     setError("Failed to fetch products");
// //   } finally {
// //     setLoading(false);
// //   }
// // };


// const fetchAllProducts = async () => {
//   try {
//     setLoading(true);
//     let response;

//     if (category_id) {
//       // Fetch products by category
//       response = await axiosInstance.get(
//         `${API_URL}/api/v1/Search Product/search_product`,
//         {
//           params: { category_id: category_id },
//         }
//       );
//     } else {
//       // Fetch products by title
//       response = await axiosInstance.get(
//         `${API_URL}/api/v1/Search Product/search_product`,
//         {
//           params: { query: title },
//         }
//       );
//     }

//     if (response.data) {
//       setAllProducts(response.data);
//       setProducts(response.data);
//     } else {
//       setAllProducts([]);
//       setProducts([]);
//       setError("No products found");
//     }
//   } catch (err) {
//     console.error(err);
//     setAllProducts([]);
//     setProducts([]);
//     setError("Failed to fetch products");
//   } finally {
//     setLoading(false);
//   }
// };


//   const extractPrice = (priceString) =>
//     priceString ? parseInt(priceString.replace(/[^0-9]/g, "")) || 0 : 0;

//   const extractSoldCount = (soldString) =>
//     soldString ? parseInt(soldString.replace(/[^0-9]/g, "")) || 0 : 0;

//  const filterAndSortProducts = (search = searchQuery) => {
//   let result = [...allProducts];

//   // Search filter
//   if (search) {
//     result = result.filter(
//       (p) => p?.product && p.product.toLowerCase().includes(search.toLowerCase())
//     );
//   }
//   console.log("After search filter:", result);

//   // Category filter
//   switch (activeFilter) {
//     case "bestseller":
//       result = result.filter((p) => extractSoldCount(p.sold) > 50);
//       break;
//     case "new":
//       result = result.filter((p) => p.isNew);
//       break;
//     case "sale":
//       result = result.filter((p) => p.discount && p.discount.includes("%"));
//       break;
//     default:
//       break;
//   }

//   // Sorting
//   switch (sortBy) {
//     case "price-low":
//       result.sort((a, b) => extractPrice(a.price) - extractPrice(b.price));
//       break;
//     case "price-high":
//       result.sort((a, b) => extractPrice(b.price) - extractPrice(a.price));
//       break;
//     case "name":
//       result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
//       break;
//     case "popular":
//       result.sort((a, b) => extractSoldCount(b.sold) - extractSoldCount(a.sold));
//       break;
//     default:
//       break;
//   }

//   setProducts(result);
// };


//   const renderFilterItem = ({ item }) => (
//     <TouchableOpacity
//       style={[styles.filterButton, activeFilter === item.id && styles.activeFilterButton]}
//       onPress={() => setActiveFilter(item.id)}
//     >
//       <Text style={[styles.filterButtonText, activeFilter === item.id && styles.activeFilterButtonText]}>
//         {item.name}
//       </Text>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//         <Text style={styles.loadingText}>Loading products...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.centerContainer}>
//           <Feather name="alert-triangle" size={64} color="#dc2626" />
//           <Text style={styles.emptyStateTitle}>Error</Text>
//           <Text style={styles.emptyStateText}>{error}</Text>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.emptyStateButton}>
//             <Text style={styles.emptyStateButtonText}>Go Back</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerContent}>
//           <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//             <Ionicons name="arrow-back" size={24} color={COLORS.white} />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>{title}</Text>
//           <TouchableOpacity style={styles.filterIcon} onPress={() => console.log("Filter pressed")}>
//             <Ionicons name="filter" size={20} color={COLORS.white} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Search + Filters */}
//       <View style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: COLORS.background }}>
//         {/* Search Bar */}
//         <View style={styles.searchInputContainer}>
//           <Feather name="search" size={20} color="#64748b" style={styles.searchIcon} />
//          <TextInput
//   style={styles.searchInput}
//   placeholder="Search products..."
//   placeholderTextColor="#94a3b8"
//   value={searchQuery}
//   onChangeText={(text) => {
//     setSearchQuery(text);            // Update state
//     filterAndSortProducts(text);     // Immediately filter with new query
//   }}
// />

//           {searchQuery.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchQuery("")}>
//               <Feather name="x" size={20} color="#64748b" />
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Filter Row */}
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 12 }}>
//           {filters.map((item) => (
//             <TouchableOpacity
//               key={item.id}
//               style={[styles.filterButton, activeFilter === item.id && styles.activeFilterButton]}
//               onPress={() => setActiveFilter(item.id)}
//             >
//               <Text style={[styles.filterButtonText, activeFilter === item.id && styles.activeFilterButtonText]}>
//                 {item.name}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Results count */}
//       <View style={styles.resultsContainer}>
//         <Text style={styles.resultsText}>
//           {products.length} {products.length === 1 ? "product" : "products"} found
//         </Text>
//       </View>

//       {/* Product Grid */}
//       <ScrollView>
//         <Animated.View style={{ opacity: fadeAnim }}>
//           {products.length === 0 ? (
//             <View style={styles.centerContainer}>
//               <Feather name="package" size={64} color="#cbd5e1" />
//               <Text style={styles.emptyStateTitle}>No Products Found</Text>
//               <Text style={styles.emptyStateText}>Try adjusting your search or filter to find products.</Text>
//             </View>
//           ) : (
//             <StaticProductStyle data={products} />
//           )}
//         </Animated.View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   ...StaticProductStyle,
//   container: { flex: 1, backgroundColor: COLORS.background },
//   header: { paddingTop: 40, paddingBottom: 12, paddingHorizontal: 16, backgroundColor: COLORS.headerBg },
//   headerContent: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
//   headerTitle: { flex: 1, fontSize: 18, fontWeight: "bold", color: COLORS.white, textAlign: "center" },
//   filterIcon: { padding: 4 },
//   backButton: { padding: 4 },
//   searchInputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#f1f5f9", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
//   searchInput: { flex: 1, fontSize: 14, color: "#0f172a" },
//   searchIcon: { marginRight: 6 },
//   filterButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, marginRight: 8 },
//   activeFilterButton: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
//   filterButtonText: { fontSize: 14, color: COLORS.primary, fontWeight: "500" },
//   activeFilterButtonText: { color: COLORS.white },
//   resultsContainer: { paddingHorizontal: 12, paddingVertical: 4 },
//   resultsText: { fontSize: 14, color: COLORS.text },
//   centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 },
//   loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   loadingText: { marginTop: 10, color: COLORS.text, fontSize: 16 },
//   emptyStateTitle: { fontSize: 20, fontWeight: "600", color: "#0f172a", marginTop: 16, marginBottom: 8 },
//   emptyStateText: { fontSize: 16, color: "#64748b", textAlign: "center", lineHeight: 24 },
//   emptyStateButton: { backgroundColor: "#2563eb", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
//   emptyStateButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
// });

// export default AllProducts;

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
  Easing,
  StatusBar,
  Platform,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import axiosInstance from "../../api/axiosInstance";
import API_URL from "../../api/api_urls";
import { StaticProductStyle } from "../Global";

const COLORS = {
  primary: "#172d55",
  secondary: "#2196f3",
  background: "#FFFFFF",
  surface: "#F8F9FA",
  textPrimary: "#1e293b",
  textSecondary: "#64748b",
  border: "#e2e8f0",
  inputBg: "#f1f5f9",
  white: "#ffffff",
  accent: "#2563eb",
};

const { width } = Dimensions.get("window");

const AllProducts = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { title = "Marketplace", initialProducts = null, category_id = null } = route.params || {};

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filters = [
    { id: "all", name: "All" },
    { id: "bestseller", name: "Best Sellers" },
    { id: "new", name: "New Arrivals" },
    { id: "sale", name: "On Sale" },
  ];

  useEffect(() => {
    initializeProducts();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (allProducts.length > 0) filterAndSortProducts();
  }, [searchQuery, activeFilter, sortBy, allProducts]);

  const initializeProducts = async () => {
    try {
      setLoading(true);
      if (initialProducts && Array.isArray(initialProducts)) {
        setAllProducts(initialProducts);
        setProducts(initialProducts);
      } else {
        await fetchAllProducts();
      }
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      let response;

      if (category_id) {
        response = await axiosInstance.get(
          `${API_URL}/api/v1/Search Product/search_product`,
          { params: { category_id: category_id } }
        );
      } else {
        response = await axiosInstance.get(
          `${API_URL}/api/v1/Search Product/search_product`,
          { params: { query: title } }
        );
      }

      if (response.data) {
        setAllProducts(response.data);
        setProducts(response.data);
      } else {
        setAllProducts([]);
        setProducts([]);
        setError("No products found");
      }
    } catch (err) {
      console.error(err);
      setAllProducts([]);
      setProducts([]);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const extractPrice = (priceString) =>
    priceString ? parseInt(priceString.toString().replace(/[^0-9]/g, "")) || 0 : 0;

  const extractSoldCount = (soldString) =>
    soldString ? parseInt(soldString.toString().replace(/[^0-9]/g, "")) || 0 : 0;

  const filterAndSortProducts = (search = searchQuery) => {
    let result = [...allProducts];

    // Search filter
    if (search) {
      result = result.filter(
        (p) => p?.product && p.product.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    switch (activeFilter) {
      case "bestseller":
        result = result.filter((p) => extractSoldCount(p.sold) > 50);
        break;
      case "new":
        result = result.filter((p) => p.isNew);
        break;
      case "sale":
        result = result.filter((p) => p.discount && p.discount.toString().includes("%"));
        break;
      default:
        break;
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => extractPrice(a.price) - extractPrice(b.price));
        break;
      case "price-high":
        result.sort((a, b) => extractPrice(b.price) - extractPrice(a.price));
        break;
      case "name":
        result.sort((a, b) => (a.product || "").localeCompare(b.product || ""));
        break;
      case "popular":
        result.sort((a, b) => extractSoldCount(b.sold) - extractSoldCount(a.sold));
        break;
      default:
        break;
    }

    setProducts(result);
  };

  const toggleSort = () => {
    // Simple toggle logic for demo: rotate between Default -> Low -> High -> Popular
    if (sortBy === 'default') setSortBy('price-low');
    else if (sortBy === 'price-low') setSortBy('price-high');
    else if (sortBy === 'price-high') setSortBy('popular');
    else setSortBy('default');
  };

  const getSortLabel = () => {
    switch(sortBy) {
        case 'price-low': return 'Price: Low';
        case 'price-high': return 'Price: High';
        case 'popular': return 'Popular';
        default: return 'Sort';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Finding treasures...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="alert-decagram-outline" size={64} color="#ef4444" />
          <Text style={styles.emptyStateTitle}>Oops!</Text>
          <Text style={styles.emptyStateText}>{error}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* 1. Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
            <Text style={styles.productCount}>{products.length} items</Text>
        </View>

        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate("MyCart")}>
            <Ionicons name="cart-outline" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* 2. Search & Sort Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
            <Feather name="search" size={20} color={COLORS.textSecondary} style={{marginRight: 8}} />
            <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor={COLORS.textSecondary}
                value={searchQuery}
                onChangeText={(text) => {
                    setSearchQuery(text);
                    filterAndSortProducts(text);
                }}
            />
             {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
                </TouchableOpacity>
            )}
        </View>
        
        <TouchableOpacity style={[styles.sortBtn, sortBy !== 'default' && styles.sortBtnActive]} onPress={toggleSort}>
            <MaterialCommunityIcons name="sort" size={20} color={sortBy !== 'default' ? COLORS.white : COLORS.textPrimary} />
            {sortBy !== 'default' && <Text style={styles.sortBtnText}>{getSortLabel()}</Text>}
        </TouchableOpacity>
      </View>

      {/* 3. Filter Pills */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
            {filters.map((item) => (
            <TouchableOpacity
                key={item.id}
                style={[styles.filterChip, activeFilter === item.id && styles.activeFilterChip]}
                onPress={() => setActiveFilter(item.id)}
            >
                <Text style={[styles.filterText, activeFilter === item.id && styles.activeFilterText]}>
                {item.name}
                </Text>
            </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      {/* 4. Product Grid */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {products.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="shopping-bag" size={60} color="#e2e8f0" />
              <Text style={styles.emptyStateTitle}>No products found</Text>
              <Text style={styles.emptyStateText}>Try adjusting your filters or search query.</Text>
            </View>
          ) : (
            // Assuming StaticProductStyle handles its own layout (usually wrap flex)
            // If StaticProductStyle needs a container, wrapped it here
            <View style={styles.gridContainer}>
                <StaticProductStyle data={products} />
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: "700", color: COLORS.textPrimary },
  productCount: { fontSize: 12, color: COLORS.textSecondary },

  // Search
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
  
  // Sort
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  sortBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortBtnText: { fontSize: 12, fontWeight: '600', color: COLORS.white },

  // Filters
  filterSection: { marginBottom: 4 },
  filterContent: { paddingHorizontal: 16, paddingBottom: 12 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeFilterChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  filterText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: "500" },
  activeFilterText: { color: COLORS.white, fontWeight: "600" },

  // Content
  scrollContent: { paddingBottom: 20 },
  gridContainer: { paddingHorizontal: 4 }, 

  // States
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background },
  loadingText: { marginTop: 12, color: COLORS.textSecondary, fontSize: 14 },
  
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  emptyContainer: { alignItems: 'center', marginTop: 80, paddingHorizontal: 32 },
  emptyStateTitle: { fontSize: 18, fontWeight: "600", color: COLORS.textPrimary, marginTop: 16 },
  emptyStateText: { fontSize: 14, color: COLORS.textSecondary, textAlign: "center", marginTop: 8, lineHeight: 20 },
  
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  primaryButtonText: { color: COLORS.white, fontWeight: "600" },
});

export default AllProducts;