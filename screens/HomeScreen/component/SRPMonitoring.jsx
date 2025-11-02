// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { COLORS } from "../../../style/theme";

// const { width } = Dimensions.get("window");

// const initialSrpData = [
//   { name: "Mangga", srp: 150, prevSrp: 160},
//   { name: "Bangus", srp: 120, prevSrp: 100 },
//   { name: "Pork per Kilo", srp: 200, prevSrp: 220 },
//   { name: "Alugbati per Kilo", srp: 100, prevSrp: 130 },
//   { name: "Onion per Kilo", srp: 149, prevSrp: 150 },
// ];

// const SRPMonitoring = () => {
//   const [srpData, setSrpData] = useState(initialSrpData);

//   // price change effect, random lang for demo purposes
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setSrpData((prevData) =>
//         prevData.map((product) => {
//           const priceFluctuation = Math.floor(Math.random() * 50 - 1);
//           return {
//             ...product,
//             prevSrp: product.srp,
//             srp: Math.max(20, product.srp + priceFluctuation),
//           };
//         })
//       );
//     }, 4000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>SRP Monitoring (Iloilo City)</Text>

//       {/* Table */}
//       <View style={styles.table}>
//         <View style={styles.tableHeader}>
//           <Text style={[styles.tableHeaderText, styles.productColumn]}>Product</Text>
//           <Text style={[styles.tableHeaderText, styles.srpColumn]}>SRP (₱)</Text>
//           <Text style={[styles.tableHeaderText, styles.changeColumn]}>Change</Text>
//         </View>

//         {srpData.map((item, index) => {
//           const priceChange = item.srp - item.prevSrp;
//           const priceUp = priceChange > 0;

//           return (
//             <View key={index} style={styles.tableRow}>
//               <Text style={[styles.tableCell, styles.productColumn]} numberOfLines={1}>
//                 {item.name}
//               </Text>
//               <Text style={[styles.tableCell, styles.srpColumn]}>₱{item.srp}</Text>
//               <View style={[styles.changeContainer, styles.changeColumn]}>
//                 <Ionicons name={priceUp ? "arrow-up" : "arrow-down"} size={14} color={priceUp ? "green" : "red"} />
//                 <Text style={[styles.tableCell, { color: priceUp ? "green" : "red" }]}>
//                   {priceUp ? "+" : "-"}₱{Math.abs(priceChange)}
//                 </Text>
//               </View>
//             </View>
//           );
//         })}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 10,
//   },
//   header: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#2c3e50",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   table: {
//     width: width * 0.95, 
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     backgroundColor: "white",
//     overflow: "hidden",
//   },
//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: COLORS.primary,
//     paddingVertical: 8,
//   },
//   tableHeaderText: {
//     fontWeight: "bold",
//     color: "white",
//     textAlign: "center",
//     fontSize: 14,
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//     paddingVertical: 6,
//   },
//   tableCell: {
//     textAlign: "center",
//     fontSize: 12,
//   },
//   changeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   // Column Sizes
//   productColumn: { flex: 2 },
//   srpColumn: { flex: 1 },
//   changeColumn: { flex: 1, flexDirection: "row", justifyContent: "center" },
// });

// export default SRPMonitoring;


import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../style/theme";
import * as Animatable from 'react-native-animatable';
import axios from "axios";
import API_URL  from "../../../api/api_urls";

const { width } = Dimensions.get("window");
const srpi_api = API_URL + "/api/v1/seller/Seller Product SRP/seller_product_srp";

// const initialSrpData = [
//   { id: 1, name: "Mangga", srp: 150, prevSrp: 160, category: "Fruits" },
//   { id: 2, name: "Bangus", srp: 120, prevSrp: 100, category: "Seafood" },
//   { id: 3, name: "Pork per Kilo", srp: 200, prevSrp: 220, category: "Meat" },
//   { id: 4, name: "Alugbati per Kilo", srp: 100, prevSrp: 130, category: "Vegetables" },
//   { id: 5, name: "Onion per Kilo", srp: 149, prevSrp: 150, category: "Vegetables" },
//   { id: 6, name: "Rice per Kilo", srp: 45, prevSrp: 42, category: "Grains" },
//   { id: 7, name: "Egg per Piece", srp: 8, prevSrp: 7, category: "Poultry" },
//   { id: 8, name: "Chicken per Kilo", srp: 160, prevSrp: 155, category: "Poultry" },
// ];

const SRPMonitoring = () => {
  const [srpData, setSrpData] = useState([]);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [fadeAnim] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch data from backend
  const fetchSrpData = async () => {
    try {
      const response = await axios.get(srpi_api);
      setSrpData(response.data);
    } catch (err) {
      console.error("Error fetching SRP data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSrpData();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Refresh every 10 seconds
    // const interval = setInterval(fetchSrpData, 10000);

    // return () => clearInterval(interval);
    return () => {}; // nothing to clean up

  }, []);

  const toggleExpand = (id) => {
    setExpandedProduct(expandedProduct === id ? null : id);
  };

  const getPriceChangeColor = (change) => {
    if (change > 0) return "#e74c3c"; 
    if (change < 0) return "#2ecc71"; 
    return "#7f8c8d"; 
  };

  const getTrendIcon = (change) => {
    if (change > 0) return "trending-up";
    if (change < 0) return "trending-down";
    return "remove-outline";
  };

  const categories = ["All", ...new Set(srpData.map(item => item.category || "Uncategorized"))];
  const filteredData = activeCategory === "All" 
    ? srpData 
    : srpData.filter(item => item.category === activeCategory);



  // const [srpData, setSrpData] = useState(initialSrpData);
  // const [expandedProduct, setExpandedProduct] = useState(null);
  // const [activeCategory, setActiveCategory] = useState("All");
  // const [fadeAnim] = useState(new Animated.Value(0));

  // const categories = ["All", ...new Set(initialSrpData.map(item => item.category))];

  // const filteredData = activeCategory === "All" 
  //   ? srpData 
  //   : srpData.filter(item => item.category === activeCategory);

  // useEffect(() => {
  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 500,
  //     useNativeDriver: true,
  //   }).start();

  //   const interval = setInterval(() => {
  //     setSrpData((prevData) =>
  //       prevData.map((product) => {
  //         const priceFluctuation = Math.floor(Math.random() * 10) - 5;
  //         const newPrice = Math.max(5, product.srp + priceFluctuation);
          
  //         return {
  //           ...product,
  //           prevSrp: product.srp,
  //           srp: newPrice,
  //         };
  //       })
  //     );
  //   }, 10000);

  //   return () => clearInterval(interval);
  // }, []);

  // const toggleExpand = (id) => {
  //   setExpandedProduct(expandedProduct === id ? null : id);
  // };

  // const getPriceChangeColor = (change) => {
  //   if (change > 0) return "#e74c3c"; 
  //   if (change < 0) return "#2ecc71"; 
  //   return "#7f8c8d"; 
  // };

  // const getTrendIcon = (change) => {
  //   if (change > 0) return "trending-up";
  //   if (change < 0) return "trending-down";
  //   return "remove-outline"; // Using remove-outline for neutral trend
  // };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.header}>SRP Monitoring</Text>
      <Text style={styles.subHeader}>Iloilo City Market Prices</Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              activeCategory === category && styles.activeCategoryButton
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              activeCategory === category && styles.activeCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.productColumn]}>Product</Text>
          <Text style={[styles.tableHeaderText, styles.priceColumn]}>Current Price</Text>
          <Text style={[styles.tableHeaderText, styles.changeColumn]}>Change</Text>
        </View>

        {filteredData.map((item) => {
          const priceChange = item.srp - item.prevSrp;
          const changePercent = item.prevSrp 
            ? ((priceChange / item.prevSrp) * 100).toFixed(1)
            : 0;
          const changeColor = getPriceChangeColor(priceChange);
          const isExpanded = expandedProduct === item.id;

          return (
            <Animatable.View 
              key={item.id}
              animation="fadeIn"
              duration={500}
              style={[
                styles.tableRow,
                isExpanded && styles.expandedRow
              ]}
            >
              <TouchableOpacity 
                style={styles.rowContent}
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.tableCell, styles.productColumn]}>
                  <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                  {isExpanded && (
                    <Text style={styles.productCategory}>{item.category}</Text>
                  )}
                </View>

                <Text style={[styles.tableCell, styles.priceColumn, styles.priceText]}>
                  ₱{item.srp.toFixed(2)}
                </Text>

                <View style={[styles.changeContainer, { backgroundColor: changeColor + '20' }]}>
                  <Ionicons 
                    name={getTrendIcon(priceChange)} 
                    size={16} 
                    color={changeColor} 
                    style={styles.trendIcon}
                  />
                  <Text style={[styles.changeText, { color: changeColor }]}>
                    {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)} ({changePercent}%)
                  </Text>
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Previous Price:</Text>
                    <Text style={styles.detailValue}>₱{item.prevSrp.toFixed(2)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Price Change:</Text>
                    <Text style={[styles.detailValue, { color: changeColor }]}>
                      {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)} ({changePercent}%)
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Updated:</Text>
                    <Text style={styles.detailValue}>Just now</Text>
                  </View>
                </View>
              )}
            </Animatable.View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Ionicons name="time-outline" size={14} color="#7f8c8d" />
        <Text style={styles.footerText}>Updates every 10 seconds</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 16,
  },
  categoryContainer: {
    paddingBottom: 12,
    marginBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#ecf0f1",
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    color: "#7f8c8d",
    fontSize: 12,
    fontWeight: "500",
  },
  activeCategoryText: {
    color: "#ffffff",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ecf0f1",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
  },
  tableHeaderText: {
    fontWeight: "600",
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
    backgroundColor: "#ffffff",
  },
  expandedRow: {
    backgroundColor: "#f8f9fa",
  },
  rowContent: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableCell: {
    justifyContent: "center",
  },
  productColumn: {
    flex: 2,
    paddingLeft: 8,
  },
  priceColumn: {
    flex: 1.5,
  },
  changeColumn: {
    flex: 1.5,
  },
  productName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#2c3e50",
  },
  productCategory: {
    fontSize: 11,
    color: "#7f8c8d",
    marginTop: 4,
  },
  priceText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#2c3e50",
    textAlign: "center",
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  trendIcon: {
    marginRight: 4,
  },
  changeText: {
    fontSize: 11,
    fontWeight: "500",
  },
  expandedContent: {
    padding: 12,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  detailValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#2c3e50",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  footerText: {
    fontSize: 12,
    color: "#7f8c8d",
    marginLeft: 4,
  },
});

export default SRPMonitoring;