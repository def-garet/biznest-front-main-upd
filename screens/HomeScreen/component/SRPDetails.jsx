import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Animated
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as Animatable from "react-native-animatable";

// Adjust these paths based on your folder structure
import API_URL from "../../../api/api_urls"; 
import { COLORS } from "../../../style/theme";

const SRPI_API = API_URL + "/api/v1/seller/Seller Product SRP/seller_product_srp";

const SRPDetails = () => {
  const navigation = useNavigation();
  
  // Data States
  const [masterData, setMasterData] = useState([]); // Original full list
  const [filteredData, setFilteredData] = useState([]); // Display list
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default"); // default, price_high, price_low, change_high, change_low
  const [showSortModal, setShowSortModal] = useState(false);

  // Categories extraction
  const categories = ["All", ...new Set(masterData.map((item) => item.category || "Others"))];

  useEffect(() => {
    fetchSRPData();
  }, []);

  useEffect(() => {
    filterAndSortData();
  }, [searchQuery, selectedCategory, sortOption, masterData]);

  const fetchSRPData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(SRPI_API);
      setMasterData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching SRP details:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortData = () => {
    let result = [...masterData];

    // 1. Filter by Search
    if (searchQuery) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(item => item.category === selectedCategory);
    }

    // 3. Sort
    switch (sortOption) {
      case "price_high":
        result.sort((a, b) => b.srp - a.srp);
        break;
      case "price_low":
        result.sort((a, b) => a.srp - b.srp);
        break;
      case "change_high": // Biggest price increase
        result.sort((a, b) => (b.srp - b.prevSrp) - (a.srp - a.prevSrp));
        break;
      case "change_low": // Biggest price drop
        result.sort((a, b) => (a.srp - a.prevSrp) - (b.srp - b.prevSrp));
        break;
      default:
        // Default alphabetical or ID based
        break;
    }

    setFilteredData(result);
  };

  const getTrendConfig = (current, previous) => {
    const diff = current - previous;
    if (diff > 0) return { icon: "trending-up", color: "#ff4d4d", label: `+₱${diff.toFixed(2)}` };
    if (diff < 0) return { icon: "trending-down", color: "#00b894", label: `-₱${Math.abs(diff).toFixed(2)}` };
    return { icon: "remove", color: "#b2bec3", label: "No Change" };
  };

  const renderItem = ({ item, index }) => {
    const { icon, color, label } = getTrendConfig(item.srp, item.prevSrp);
    
    return (
      <Animatable.View 
        animation="fadeInUp" 
        duration={500} 
        delay={index * 50}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <View>
             <Text style={styles.productName}>{item.name}</Text>
             <Text style={styles.categoryName}>{item.category || "General"}</Text>
          </View>
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>₱{item.srp.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardFooter}>
           <View style={styles.infoCol}>
              <Text style={styles.label}>Previous</Text>
              <Text style={styles.value}>₱{item.prevSrp.toFixed(2)}</Text>
           </View>
           
           <View style={[styles.infoCol, { alignItems: 'flex-end' }]}>
              <Text style={styles.label}>Trend</Text>
              <View style={[styles.trendBadge, { backgroundColor: color + '15' }]}>
                 <Ionicons name={icon} size={14} color={color} style={{marginRight: 4}} />
                 <Text style={[styles.trendText, { color: color }]}>{label}</Text>
              </View>
           </View>
        </View>
      </Animatable.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Price Watch</Text>
        <TouchableOpacity onPress={() => setShowSortModal(!showSortModal)} style={styles.sortButton}>
           <MaterialIcons name="sort" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search & Filter Section */}
      <View style={styles.filterSection}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
               <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Chips */}
        <View style={{height: 50}}>
            <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
                <TouchableOpacity
                style={[
                    styles.categoryChip,
                    selectedCategory === item && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(item)}
                >
                <Text
                    style={[
                    styles.categoryText,
                    selectedCategory === item && styles.categoryTextActive,
                    ]}
                >
                    {item}
                </Text>
                </TouchableOpacity>
            )}
            />
        </View>
      </View>

      {/* Sort Options (Simple Toggle View) */}
      {showSortModal && (
          <Animatable.View animation="fadeInDown" duration={300} style={styles.sortPanel}>
              <Text style={styles.sortLabel}>Sort By:</Text>
              <View style={styles.sortRow}>
                  <TouchableOpacity onPress={() => setSortOption("price_high")} style={[styles.sortChip, sortOption==="price_high" && styles.sortChipActive]}>
                      <Text style={[styles.sortText, sortOption==="price_high" && styles.sortTextActive]}>Price High</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setSortOption("price_low")} style={[styles.sortChip, sortOption==="price_low" && styles.sortChipActive]}>
                      <Text style={[styles.sortText, sortOption==="price_low" && styles.sortTextActive]}>Price Low</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setSortOption("change_high")} style={[styles.sortChip, sortOption==="change_high" && styles.sortChipActive]}>
                      <Text style={[styles.sortText, sortOption==="change_high" && styles.sortTextActive]}>Biggest Hike</Text>
                  </TouchableOpacity>
              </View>
          </Animatable.View>
      )}

      {/* Main List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{marginTop: 10, color: '#666'}}>Fetching latest prices...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
                <FontAwesome5 name="box-open" size={50} color="#ddd" />
                <Text style={{marginTop: 15, color: '#999', fontSize: 16}}>No products found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 25,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
  },
  sortButton: {
    padding: 5,
  },
  filterSection: {
    backgroundColor: "white",
    paddingVertical: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10,
    marginTop: -10, // Overlap header slightly if needed, or just standard
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  categoryList: {
    paddingHorizontal: 15,
    alignItems: "center",
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f4f6f8",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#eee",
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "white",
  },
  
  // Sort Panel
  sortPanel: {
      backgroundColor: '#fff',
      padding: 15,
      borderBottomWidth: 1,
      borderColor: '#eee',
  },
  sortLabel: {
      fontSize: 12, 
      color: '#888',
      marginBottom: 8,
      marginLeft: 5
  },
  sortRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
  },
  sortChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      marginRight: 10,
      marginBottom: 5,
  },
  sortChipActive: {
      borderColor: COLORS.secondary,
      backgroundColor: COLORS.secondary + '10',
  },
  sortText: {
      fontSize: 12,
      color: '#666',
  },
  sortTextActive: {
      color: COLORS.secondary,
      fontWeight: 'bold',
  },

  // List
  listContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },

  // Card
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  categoryName: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  priceBadge: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: "#f4f6f8",
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoCol: {
      justifyContent: 'center',
  },
  label: {
      fontSize: 10,
      color: '#aaa',
      marginBottom: 2,
      textTransform: 'uppercase',
  },
  value: {
      fontSize: 14,
      color: '#555',
      fontWeight: '500',
  },
  trendBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
  },
  trendText: {
      fontSize: 12,
      fontWeight: '700',
  }
});

export default SRPDetails;