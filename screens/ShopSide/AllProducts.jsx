
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
//   StatusBar,
//   Platform,
//   SafeAreaView,
// } from "react-native";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
// import axiosInstance from "../../api/axiosInstance";
// import API_URL from "../../api/api_urls";
// import { StaticProductStyle } from "../Global";

// const COLORS = {
//   primary: "#172d55",
//   secondary: "#2196f3",
//   background: "#FFFFFF",
//   surface: "#F8F9FA",
//   textPrimary: "#1e293b",
//   textSecondary: "#64748b",
//   border: "#e2e8f0",
//   inputBg: "#f1f5f9",
//   white: "#ffffff",
//   accent: "#2563eb",
// };

// const { width } = Dimensions.get("window");

// const AllProducts = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   const { title = "Marketplace", initialProducts = null, category_id = null } = route.params || {};

//   const [products, setProducts] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeFilter, setActiveFilter] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBy, setSortBy] = useState("default");
//   const [showSortMenu, setShowSortMenu] = useState(false);

//   const filters = [
//     { id: "all", name: "All" },
//     { id: "bestseller", name: "Best Sellers" },
//     { id: "new", name: "New Arrivals" },
//     { id: "sale", name: "On Sale" },
//   ];

//   useEffect(() => {
//     initializeProducts();
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 500,
//       easing: Easing.out(Easing.ease),
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

//   const fetchAllProducts = async () => {
//     try {
//       setLoading(true);
//       let response;

//       if (category_id) {
//         response = await axiosInstance.get(
//           `${API_URL}/api/v1/Search Product/search_product`,
//           { params: { category_id: category_id } }
//         );
//       } else {
//         response = await axiosInstance.get(
//           `${API_URL}/api/v1/Search Product/search_product`,
//           { params: { query: title } }
//         );
//       }

//       if (response.data) {
//         setAllProducts(response.data);
//         setProducts(response.data);
//       } else {
//         setAllProducts([]);
//         setProducts([]);
//         setError("No products found");
//       }
//     } catch (err) {
//       console.error(err);
//       setAllProducts([]);
//       setProducts([]);
//       setError("Failed to fetch products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const extractPrice = (priceString) =>
//     priceString ? parseInt(priceString.toString().replace(/[^0-9]/g, "")) || 0 : 0;

//   const extractSoldCount = (soldString) =>
//     soldString ? parseInt(soldString.toString().replace(/[^0-9]/g, "")) || 0 : 0;

//   const filterAndSortProducts = (search = searchQuery) => {
//     let result = [...allProducts];

//     // Search filter
//     if (search) {
//       result = result.filter(
//         (p) => p?.product && p.product.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     // Category filter
//     switch (activeFilter) {
//       case "bestseller":
//         result = result.filter((p) => extractSoldCount(p.sold) > 50);
//         break;
//       case "new":
//         result = result.filter((p) => p.isNew);
//         break;
//       case "sale":
//         result = result.filter((p) => p.discount && p.discount.toString().includes("%"));
//         break;
//       default:
//         break;
//     }

//     // Sorting
//     switch (sortBy) {
//       case "price-low":
//         result.sort((a, b) => extractPrice(a.price) - extractPrice(b.price));
//         break;
//       case "price-high":
//         result.sort((a, b) => extractPrice(b.price) - extractPrice(a.price));
//         break;
//       case "name":
//         result.sort((a, b) => (a.product || "").localeCompare(b.product || ""));
//         break;
//       case "popular":
//         result.sort((a, b) => extractSoldCount(b.sold) - extractSoldCount(a.sold));
//         break;
//       default:
//         break;
//     }

//     setProducts(result);
//   };

//   const toggleSort = () => {
//     // Simple toggle logic for demo: rotate between Default -> Low -> High -> Popular
//     if (sortBy === 'default') setSortBy('price-low');
//     else if (sortBy === 'price-low') setSortBy('price-high');
//     else if (sortBy === 'price-high') setSortBy('popular');
//     else setSortBy('default');
//   };

//   const getSortLabel = () => {
//     switch(sortBy) {
//         case 'price-low': return 'Price: Low';
//         case 'price-high': return 'Price: High';
//         case 'popular': return 'Popular';
//         default: return 'Sort';
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//         <Text style={styles.loadingText}>Finding treasures...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.centerContainer}>
//           <MaterialCommunityIcons name="alert-decagram-outline" size={64} color="#ef4444" />
//           <Text style={styles.emptyStateTitle}>Oops!</Text>
//           <Text style={styles.emptyStateText}>{error}</Text>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.primaryButton}>
//             <Text style={styles.primaryButtonText}>Go Back</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
//       {/* 1. Header Section */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
//         </TouchableOpacity>
        
//         <View style={styles.headerTitleContainer}>
//             <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
//             <Text style={styles.productCount}>{products.length} items</Text>
//         </View>

//         <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate("MyCart")}>
//             <Ionicons name="cart-outline" size={24} color={COLORS.textPrimary} />
//         </TouchableOpacity>
//       </View>

//       {/* 2. Search & Sort Bar */}
//       <View style={styles.searchSection}>
//         <View style={styles.searchBar}>
//             <Feather name="search" size={20} color={COLORS.textSecondary} style={{marginRight: 8}} />
//             <TextInput
//                 style={styles.searchInput}
//                 placeholder="Search..."
//                 placeholderTextColor={COLORS.textSecondary}
//                 value={searchQuery}
//                 onChangeText={(text) => {
//                     setSearchQuery(text);
//                     filterAndSortProducts(text);
//                 }}
//             />
//              {searchQuery.length > 0 && (
//                 <TouchableOpacity onPress={() => setSearchQuery("")}>
//                     <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
//                 </TouchableOpacity>
//             )}
//         </View>
        
//         <TouchableOpacity style={[styles.sortBtn, sortBy !== 'default' && styles.sortBtnActive]} onPress={toggleSort}>
//             <MaterialCommunityIcons name="sort" size={20} color={sortBy !== 'default' ? COLORS.white : COLORS.textPrimary} />
//             {sortBy !== 'default' && <Text style={styles.sortBtnText}>{getSortLabel()}</Text>}
//         </TouchableOpacity>
//       </View>

//       {/* 3. Filter Pills */}
//       <View style={styles.filterSection}>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
//             {filters.map((item) => (
//             <TouchableOpacity
//                 key={item.id}
//                 style={[styles.filterChip, activeFilter === item.id && styles.activeFilterChip]}
//                 onPress={() => setActiveFilter(item.id)}
//             >
//                 <Text style={[styles.filterText, activeFilter === item.id && styles.activeFilterText]}>
//                 {item.name}
//                 </Text>
//             </TouchableOpacity>
//             ))}
//         </ScrollView>
//       </View>

//       {/* 4. Product Grid */}
//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//         <Animated.View style={{ opacity: fadeAnim }}>
//           {products.length === 0 ? (
//             <View style={styles.emptyContainer}>
//               <Feather name="shopping-bag" size={60} color="#e2e8f0" />
//               <Text style={styles.emptyStateTitle}>No products found</Text>
//               <Text style={styles.emptyStateText}>Try adjusting your filters or search query.</Text>
//             </View>
//           ) : (
//             // Assuming StaticProductStyle handles its own layout (usually wrap flex)
//             // If StaticProductStyle needs a container, wrapped it here
//             <View style={styles.gridContainer}>
//                 <StaticProductStyle data={products} />
//             </View>
//           )}
//         </Animated.View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.background },
  
//   // Header
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: COLORS.background,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f1f5f9',
//   },
//   iconBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: COLORS.surface,
//   },
//   headerTitleContainer: { flex: 1, alignItems: 'center' },
//   headerTitle: { fontSize: 18, fontWeight: "700", color: COLORS.textPrimary },
//   productCount: { fontSize: 12, color: COLORS.textSecondary },

//   // Search
//   searchSection: {
//     flexDirection: 'row',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     gap: 10,
//   },
//   searchBar: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.inputBg,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     height: 44,
//   },
//   searchInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
  
//   // Sort
//   sortBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.surface,
//     paddingHorizontal: 12,
//     borderRadius: 12,
//     height: 44,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     gap: 6,
//   },
//   sortBtnActive: {
//     backgroundColor: COLORS.primary,
//     borderColor: COLORS.primary,
//   },
//   sortBtnText: { fontSize: 12, fontWeight: '600', color: COLORS.white },

//   // Filters
//   filterSection: { marginBottom: 4 },
//   filterContent: { paddingHorizontal: 16, paddingBottom: 12 },
//   filterChip: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: COLORS.surface,
//     marginRight: 8,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   activeFilterChip: {
//     backgroundColor: COLORS.primary,
//     borderColor: COLORS.primary,
//     elevation: 2,
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//   },
//   filterText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: "500" },
//   activeFilterText: { color: COLORS.white, fontWeight: "600" },

//   // Content
//   scrollContent: { paddingBottom: 20 },
//   gridContainer: { paddingHorizontal: 4 }, 

//   // States
//   loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background },
//   loadingText: { marginTop: 12, color: COLORS.textSecondary, fontSize: 14 },
  
//   centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
//   emptyContainer: { alignItems: 'center', marginTop: 80, paddingHorizontal: 32 },
//   emptyStateTitle: { fontSize: 18, fontWeight: "600", color: COLORS.textPrimary, marginTop: 16 },
//   emptyStateText: { fontSize: 14, color: COLORS.textSecondary, textAlign: "center", marginTop: 8, lineHeight: 20 },
  
//   primaryButton: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   primaryButtonText: { color: COLORS.white, fontWeight: "600" },
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
  SafeAreaView,
  Platform
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import axiosInstance from "../../api/axiosInstance";
import API_URL from "../../api/api_urls";
import { StaticProductStyle } from "../Global";

// Unified Modern Color Palette
const COLORS = {
  primary: "#1E293B",    // Slate 800 - Main Text/Dark Elements
  secondary: "#2563EB",  // Blue 600 - Accents/Active States
  background: "#FFFFFF", // White
  surface: "#F8FAFC",    // Slate 50 - Inputs/Cards/Backgrounds
  textPrimary: "#0F172A",
  textSecondary: "#64748B", // Slate 500
  border: "#E2E8F0",     // Slate 200
  danger: "#EF4444",
  white: "#FFFFFF",
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

  const filters = [
    { id: "all", name: "All Items" },
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
        <ActivityIndicator size="large" color={COLORS.secondary} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* 1. Uniform Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
            {products.length > 0 && (
                <Text style={styles.productCount}>{products.length} items found</Text>
            )}
        </View>

        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate("MyCart")}>
            <View>
                <Feather name="shopping-bag" size={24} color={COLORS.textPrimary} />
            </View>
        </TouchableOpacity>
      </View>

      {/* 2. Sticky Search & Filter Header */}
      <View style={styles.stickyHeader}>
        {/* Search & Sort Row */}
        <View style={styles.searchRow}>
            <View style={styles.searchBar}>
                <Feather name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for items..."
                    placeholderTextColor={COLORS.textSecondary}
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                        filterAndSortProducts(text);
                    }}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => {
                        setSearchQuery("");
                        filterAndSortProducts("");
                    }}>
                        <Feather name="x-circle" size={18} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>
            
            <TouchableOpacity 
                style={[styles.sortBtn, sortBy !== 'default' && styles.sortBtnActive]} 
                onPress={toggleSort}
            >
                <MaterialCommunityIcons 
                    name={sortBy === 'default' ? "sort" : sortBy === 'price-low' ? "sort-ascending" : "sort-descending"} 
                    size={22} 
                    color={sortBy !== 'default' ? COLORS.white : COLORS.textPrimary} 
                />
            </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
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
      </View>

      {/* 3. Product Grid Content */}
      <View style={styles.contentContainer}>
        {error ? (
            <View style={styles.centerState}>
                <MaterialCommunityIcons name="alert-circle-outline" size={48} color={COLORS.danger} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={initializeProducts} style={styles.retryBtn}>
                    <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        ) : products.length === 0 ? (
            <View style={styles.centerState}>
                <Feather name="package" size={64} color="#E2E8F0" />
                <Text style={styles.emptyTitle}>No products found</Text>
                <Text style={styles.emptyText}>Try adjusting your search or filters.</Text>
            </View>
        ) : (
            <ScrollView 
                contentContainerStyle={styles.gridScrollContent} 
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={{ opacity: fadeAnim }}>
                    <StaticProductStyle data={products} />
                </Animated.View>
            </ScrollView>
        )}
      </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitleContainer: { 
    flex: 1, 
    alignItems: 'center' 
  },
  headerTitle: { 
    fontSize: 17, 
    fontWeight: "700", 
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  productCount: { 
    fontSize: 11, 
    color: COLORS.textSecondary,
    marginTop: 2
  },

  // Sticky Header Area (Search + Filter)
  stickyHeader: {
    backgroundColor: COLORS.background,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: { 
    flex: 1, 
    fontSize: 15, 
    color: COLORS.textPrimary,
    height: '100%',
  },
  sortBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sortBtnActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },

  // Filters
  filterRow: {
    marginTop: 0,
  },
  filterContent: { 
    paddingHorizontal: 16,
  },
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
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  filterText: { 
    fontSize: 13, 
    color: COLORS.textSecondary, 
    fontWeight: "600" 
  },
  activeFilterText: { 
    color: COLORS.white, 
  },

  // Content
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  gridScrollContent: { 
    paddingTop: 16,
    paddingBottom: 40,
    paddingHorizontal: 4, 
  },

  // States
  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: COLORS.background 
  },
  loadingText: { 
    marginTop: 12, 
    color: COLORS.textSecondary, 
    fontSize: 14, 
    fontWeight: '500' 
  },
  
  centerState: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 32 
  },
  emptyTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: COLORS.textPrimary, 
    marginTop: 16 
  },
  emptyText: { 
    fontSize: 14, 
    color: COLORS.textSecondary, 
    textAlign: "center", 
    marginTop: 8, 
    lineHeight: 20 
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  retryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: '600',
  }
});

export default AllProducts;