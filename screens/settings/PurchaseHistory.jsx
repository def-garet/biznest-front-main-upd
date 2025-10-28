import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native"; 
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";
import API_URL from "../../api/api_urls";

const purchaseHistory_api = `/api/v1/Purchase History/purchase_history`;
const COLORS = {
  primary: "#172d55",
  secondary: "#2196f3",
  background: "#ffffff",
  text: "#808080",
  white: "#ffffff",
  lightGray: "#f5f5f5",
  darkGray: "#555555",
  success: "#4caf50",
  successLight: "#e8f5e9",
  warning: "#ff9800",
  warningLight: "#fff3e0",
  error: "#f44336",
  errorLight: "#ffebee",
  info: "#2196f3",
  infoLight: "#e3f2fd",
  textSecondary: "#aaaaaa",
};

const PurchaseHistory = ({ route }) => {
  const [activeTab, setActiveTab] = useState("");
  const navigation = useNavigation();

  const [allOrders, setAllOrders] = useState([
    // Completed orders
    {
      id: "1",
      store: "Roberto's Siopao",
      status: "Completed",
      product: "Queen Siopao Special (6 pieces)",
      quantity: 2,
      price: 420,
      ratingDeadline: "15 Aug",
      coins: 1.2,
      image:
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: "2",
      store: "Madge Coffee",
      status: "Completed",
      product: "Barako Coffee Beans",
      variant: "500g pack",
      quantity: 1,
      price: 350,
      image:
        "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=500&auto=format&fit=crop&q=60",
    },

    // To Pay orders
    {
      id: "3",
      store: "Iloilo Biscocho Haus",
      status: "To Pay",
      product: "Original Biscocho Pack",
      variant: "Family size",
      quantity: 3,
      price: 675,
      dueDate: "Today, 5:00 PM",
      image:
        "https://images.unsplash.com/photo-1587241321921-91a834d6d191?w=500&auto=format&fit=crop&q=60",
    },

    // To Ship orders
    {
      id: "4",
      store: "Tatoy's Manokan",
      status: "To Ship",
      product: "Native Chicken BBQ",
      variant: "10 sticks",
      quantity: 1,
      price: 450,
      estimatedShipDate: "Tomorrow",
      image:
        "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500&auto=format&fit=crop&q=60",
    },

    // To Receive orders
    {
      id: "5",
      store: "Molo Mansion",
      status: "To Receive",
      product: "Assorted Tarts",
      quantity: 10,
      price: 30,
      estimatedDelivery: "Aug 20-22",
      image:
        "https://anec.global/cdn/shop/products/Untitleddesign_30_7a6265bd-6a8b-4a2a-9791-6e3fd4a58c39_grande.png?v=1645164662",
    },
  ]);

  useEffect(() => {
    console.log(route.params?.initialTab);
    setActiveTab(route.params?.initialTab || "All"); 
    axiosInstance
      .get(purchaseHistory_api)
      .then((response) => {
        setAllOrders((prevOrders) => [...prevOrders, ...response.data]); 
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const filteredOrders =
    activeTab === "All"
      ? allOrders
      : allOrders.filter((order) => order.status === activeTab);

  const renderStatus = (status) => {
    let statusStyle, statusText;

    switch (status) {
      case "Completed":
        statusStyle = { backgroundColor: COLORS.successLight };
        statusText = { color: COLORS.success };
        break;
      case "To Pay":
        statusStyle = { backgroundColor: COLORS.errorLight };
        statusText = { color: COLORS.error };
        break;
      case "To Ship":
        statusStyle = { backgroundColor: COLORS.warningLight };
        statusText = { color: COLORS.warning };
        break;
      case "To Receive":
        statusStyle = { backgroundColor: COLORS.infoLight };
        statusText = { color: COLORS.info };
        break;
      default:
        statusStyle = { backgroundColor: COLORS.lightGray };
        statusText = { color: COLORS.text };
    }

    return (
      <View style={[styles.statusContainer, statusStyle]}>
        <Text style={[styles.statusText, statusText]}>{status}</Text>
      </View>
    );
  };

  const renderOrderActions = (order) => {
    switch (order.status) {
      case "To Pay":
        return (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => console.log("Pay Now")}
            >
              <Text style={styles.primaryButtonText}>Pay Now</Text>
            </TouchableOpacity>
            <Text style={styles.dueDateText}>Due {order.dueDate}</Text>
          </View>
        );
      case "To Ship":
        return (
          <View style={styles.actionButtons}>
            <Text style={styles.infoText}>
              Estimated to ship: {order.estimatedShipDate}
            </Text>
          </View>
        );
      case "To Receive":
        return (
          <View style={styles.actionButtons}>
            <Text style={styles.infoText}>
              Estimated delivery: {order.estimatedDelivery}
            </Text>
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() =>
                navigation.navigate("OrderTracking", { orderId: order.id })
              }
            >
              <Text style={styles.outlineButtonText}>Track Order</Text>
            </TouchableOpacity>
          </View>
        );
      case "Completed":
        return order.ratingDeadline ? (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingPrompt}>
              ⏳ Rate by {order.ratingDeadline} to earn {order.coins} Coins
            </Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => console.log("Buy Again")}
              >
                <Text style={styles.outlineButtonText}>Buy Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => console.log("Rate Now")}
              >
                <Text style={styles.primaryButtonText}>Rate Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.textButton}
              onPress={() => console.log("View Details")}
            >
              <Text style={styles.textButtonText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => console.log("Buy Again")}
            >
              <Text style={styles.outlineButtonText}>Buy Again</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderItem}
      activeOpacity={0.9}
      onPress={() => console.log("View order details")}
    >
      {/* Store and Status */}
      <View style={styles.storeHeader}>
        <Text style={styles.storeName}>{item.store || item.shop}</Text>
        {renderStatus(item.status)}
      </View>

      {/* Product Info with Image */}
      <View style={styles.productContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.product}</Text>
          {item.variant && (
            <Text style={styles.productVariant}>
              {item.variant} • x{item.quantity}
            </Text>
          )}
          <Text style={styles.productPrice}>
            ₱{item.price.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Status-specific actions */}
      {renderOrderActions(item)}

      {/* Divider line */}
      <View style={styles.divider} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with tabs */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Purchases</Text>
        </View>
        <View style={styles.tabContainer}>
          {["All", "To Pay", "To Ship", "To Receive", "Completed"].map(
            (tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      {/* Order List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No {activeTab === "All" ? "" : activeTab + " "}orders found
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    paddingTop: 24,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 30,
    color: COLORS.primary,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tab: {
    paddingBottom: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  orderItem: {
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  storeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500",
  },
  productContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 15,
    color: COLORS.darkGray,
    marginBottom: 4,
    fontWeight: "500",
  },
  productVariant: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  ratingContainer: {
    marginTop: 8,
  },
  ratingPrompt: {
    fontSize: 13,
    color: COLORS.warning,
    marginBottom: 12,
    fontWeight: "500",
  },
  textButton: {
    paddingVertical: 8,
  },
  textButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "500",
  },
  dueDateText: {
    fontSize: 13,
    color: COLORS.error,
    fontWeight: "500",
  },
  infoText: {
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text,
  },
});

export default PurchaseHistory;
