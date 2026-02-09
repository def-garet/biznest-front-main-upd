import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StatusBar,
} from "react-native";
import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  AntDesign,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";
import { COLORS } from "../../style/theme";
import { useNavigation } from "@react-navigation/native";
import ProductManagement from "./ProductManagement";
import axios from "axios";
import axiosInstance from '@api/axiosInstance';
import N8NAPI_URL from "../../api/n8n_api";
import { AuthContext } from "../../auth/AuthContext";

const products_api = "/api/v1/seller/Manage Product/manage_product";

const SellerDashboard = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("analytics");
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [seller_id, setSellerId] = useState(null);
  const { userToken } = useContext(AuthContext);

  const fetchMessage = async (id) => {
    try {
      const response = await axios.get(
        `${N8NAPI_URL}/webhook/706f713f-873b-437e-9dd0-791c9fbbb51d/get_AIHelper_SellerHistory/${id}`
      );
      setChatMessages(response.data.full_history);
    } catch (error) {
      console.error("Error fetching Message details:", error);
    }
  };

  const [products, setProducts] = useState({ product_info: [] });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    img: "",
  });

  const flatListRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetchProducts();
      const id = response.seller_info.id;
      await fetchMessage(id);
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts().finally(() => setRefreshing(false));
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(products_api);
      setProducts(response.data);
      setSellerId(response.data.seller_info.id);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const salesData = (products.product_info || []).map((product) => ({
    id: product.id,
    product: product.name,
    sales: product.total_quantity_sold || 0,
    revenue: product.total_price_sold || 0,
    stock: product.stock,
  }));

  const pricingSuggestions = (products.product_info || []).map((product) => ({
    id: product.id,
    product: product.name,
    current: product.price,
    suggested: Math.floor(product.price * (0.9 + Math.random() * 0.3)),
    reason: [
      "High demand",
      "Material costs",
      "Optimal price",
      "Low conversion",
    ][Math.floor(Math.random() * 4)],
  }));

  const analyticsData = {
    totalSales: salesData.reduce((sum, item) => sum + item.sales, 0),
    totalRevenue: salesData.reduce((sum, item) => sum + item.revenue, 0),
    conversionRate: `${(Math.random() * 5).toFixed(1)}%`,
    topProduct: salesData.length > 0
      ? salesData.reduce((max, item) =>
          item.sales > max.sales ? item : max,
          salesData[0]
        ).product
      : "No products",
  };

  const sendMessage = async () => {
    if (chatMessage.trim()) {
      const userMsg = {
        id: chatMessages.length + 1,
        text: chatMessage,
        sender: "user",
        seller_id: seller_id,
        userToken: userToken,
      };

      setChatMessages((prev) => [...prev, userMsg]);
      setChatMessage("");
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      try {
        const res = await axios.post(`${N8NAPI_URL}/webhook/c018e021-d270-4db5-9428-aab1b3cdce01/AI_Seller_Helper/${seller_id}`, {
          userMsg,
        });

        const botMsg = {
          id: chatMessages.length + 2,
          text: res.data.last_exchange.text || "Sorry, I couldn’t process your message.",
          sender: "bot",
        };

        setChatMessages((prev) => [...prev, botMsg]);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

      } catch (error) {
        console.error("Error sending message:", error);
        const errorMsg = {
          id: chatMessages.length + 2,
          text: "⚠️ Error connecting to server. Please try again later.",
          sender: "bot",
        };
        setChatMessages((prev) => [...prev, errorMsg]);
      }
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: "", price: "", stock: "", description: "", img: "" });
    setModalVisible(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
      img: product.img,
    });
    setModalVisible(true);
  };

  const handleSaveProduct = async () => {
    try {
      const productData = {
        name: productForm.name,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        description: productForm.description,
        image: productForm.img,
        ...(editingProduct && { product_id: editingProduct.id }),
      };
      await axios.axiosInstance(products_api, productData);
      fetchProducts();
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axiosInstance.delete(`${products_api}/${id}`);
      fetchProducts();
      setModalVisible(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // --- HEADER & TABS COMPONENT ---
  const DashboardHeader = () => (
    // Wrapped in a View to prevent vertical stretching in KeyboardAvoidingView
    <View>
      <View style={styles.topSection}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryLabel}>Today's Sales</Text>
            <Text style={styles.summaryValue}>₱3,450</Text>
            <View style={styles.trendRow}>
              <Feather name="trending-up" size={14} color="#16A34A" />
              <Text style={styles.trendText}>12% vs yesterday</Text>
            </View>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryLabel}>Items Sold</Text>
            <Text style={styles.summaryValue}>14</Text>
            <View style={styles.trendRow}>
              <Feather name="trending-down" size={14} color="#DC2626" />
              <Text style={styles.trendTextRed}>3% vs yesterday</Text>
            </View>
          </View>
        </View>

        <View style={styles.aiBanner}>
          <View style={styles.aiBannerIcon}>
            <FontAwesome5 name="earlybirds" size={18} color="white" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiBannerTitle}>AI Insight</Text>
            <Text style={styles.aiBannerText}>
              Your Handwoven Baskets are selling fast! Restock soon to prevent losing momentum.
            </Text>
          </View>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.tabsContainer}
        contentContainerStyle={{ flexGrow: 0 }} // Prevents stretching
      >
        {[
          { id: "analytics", label: "Analytics", icon: "bar-chart-2" },
          { id: "inventory", label: "Inventory", icon: "box" },
          { id: "pricing", label: "Pricing", icon: "tag" },
          { id: "products", label: "Products", icon: "grid" },
          { id: "assistant", label: "Assistant", icon: "message-circle" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, activeTab === tab.id && styles.activeTabButton]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Feather 
              name={tab.icon} 
              size={16} 
              color={activeTab === tab.id ? "white" : "#64748b"} 
              style={styles.tabIcon}
            />
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // --- TAB CONTENT ---
  const renderTabContent = () => {
    switch (activeTab) {
      case "analytics":
        return (
          <View style={styles.tabContent}>
            <View style={styles.analyticsGrid}>
              <View style={[styles.analyticsCard, { backgroundColor: '#F0F9FF' }]}>
                <View style={[styles.iconBg, { backgroundColor: '#E0F2FE' }]}>
                  <MaterialIcons name="trending-up" size={20} color="#0284C7" />
                </View>
                <Text style={styles.analyticsValue}>{analyticsData.totalSales}</Text>
                <Text style={styles.analyticsLabel}>Total Sales</Text>
              </View>
              <View style={[styles.analyticsCard, { backgroundColor: '#FDF4FF' }]}>
                <View style={[styles.iconBg, { backgroundColor: '#FAE8FF' }]}>
                  <FontAwesome name="money" size={18} color="#C026D3" />
                </View>
                <Text style={styles.analyticsValue}>₱{analyticsData.totalRevenue.toLocaleString()}</Text>
                <Text style={styles.analyticsLabel}>Total Revenue</Text>
              </View>
              <View style={[styles.analyticsCard, { backgroundColor: '#F0FDF4' }]}>
                <View style={[styles.iconBg, { backgroundColor: '#DCFCE7' }]}>
                  <MaterialIcons name="compare-arrows" size={20} color="#16A34A" />
                </View>
                <Text style={styles.analyticsValue}>{analyticsData.conversionRate}</Text>
                <Text style={styles.analyticsLabel}>Conversion Rate</Text>
              </View>
              <View style={[styles.analyticsCard, { backgroundColor: '#FFFBEB' }]}>
                <View style={[styles.iconBg, { backgroundColor: '#FEF3C7' }]}>
                  <MaterialIcons name="star" size={20} color="#D97706" />
                </View>
                <Text style={styles.analyticsValue} numberOfLines={1}>{analyticsData.topProduct}</Text>
                <Text style={styles.analyticsLabel}>Top Product</Text>
              </View>
            </View>

            <Text style={styles.sectionHeader}>Sales Performance</Text>
            {salesData.length > 0 ? (
              salesData.map((item) => (
                <View key={item.id.toString()} style={styles.listItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.product}</Text>
                    <View style={styles.stockBadge}>
                      <View style={[styles.stockDot, item.stock < 5 ? styles.lowStockBg : styles.goodStockBg]} />
                      <Text style={styles.stockText}>{item.stock < 5 ? "Low stock" : "In stock"} ({item.stock})</Text>
                    </View>
                  </View>
                  <View style={styles.itemMeta}>
                    <Text style={styles.salesText}>{item.sales} sold</Text>
                    <Text style={styles.revenueText}>₱{item.revenue.toLocaleString()}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Feather name="bar-chart-2" size={32} color="#CBD5E1" />
                <Text style={styles.emptyStateText}>No sales data yet</Text>
              </View>
            )}
          </View>
        );

      case "inventory":
        return (
          <View style={styles.tabContent}>
            <View style={styles.headerRow}>
                <Text style={styles.sectionHeader}>Current Inventory</Text>
                <TouchableOpacity onPress={handleAddProduct}>
                    <Text style={styles.actionText}>+ Add New</Text>
                </TouchableOpacity>
            </View>
            {products.product_info?.length > 0 ? (
              products.product_info.map((item) => (
                <TouchableOpacity key={item.id.toString()} style={styles.listItem} onPress={() => handleEditProduct(item)}>
                  {item.img ? (
                    <Image source={{ uri: item.img }} style={styles.productImage} />
                  ) : (
                    <View style={styles.productImagePlaceholder}>
                      <Feather name="image" size={20} color="#94A3B8" />
                    </View>
                  )}
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.itemSub} numberOfLines={1}>{item.description || "No description"}</Text>
                  </View>
                  <View style={styles.itemMeta}>
                    <Text style={[styles.stockStatus, item.stock < 5 && styles.lowStockText]}>
                      {item.stock} left
                    </Text>
                    <Text style={styles.priceText}>₱{item.price.toLocaleString()}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Feather name="package" size={32} color="#CBD5E1" />
                <Text style={styles.emptyStateText}>Your inventory is empty</Text>
              </View>
            )}
          </View>
        );

      case "pricing":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionHeader}>Pricing Suggestions</Text>
            {pricingSuggestions.length > 0 ? (
              pricingSuggestions.map((item) => (
                <View key={item.id.toString()} style={styles.listItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.product}</Text>
                    <View style={styles.reasonTag}>
                      <Feather name="info" size={12} color="#64748b" style={{ marginRight: 4 }} />
                      <Text style={styles.reasonText}>{item.reason}</Text>
                    </View>
                  </View>
                  <View style={styles.pricingMeta}>
                    <Text style={styles.currentPrice}>₱{item.current.toLocaleString()}</Text>
                    <Feather name="arrow-right" size={14} color="#94A3B8" style={{ marginHorizontal: 4 }} />
                    <Text style={[styles.suggestedPrice, item.suggested > item.current ? styles.priceUp : styles.priceDown]}>
                      ₱{item.suggested.toLocaleString()}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Feather name="tag" size={32} color="#CBD5E1" />
                <Text style={styles.emptyStateText}>No suggestions available</Text>
              </View>
            )}
          </View>
        );

      case "assistant":
        return (
          <View style={[styles.tabContent, { flex: 1, paddingHorizontal: 0, paddingBottom: 0 }]}>
            <Text style={[styles.sectionHeader, { paddingHorizontal: 20 }]}>Selling Assistant</Text>
            
            {chatMessages.length > 0 ? (
              <FlatList
                data={chatMessages}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                contentContainerStyle={styles.chatContainer}
                renderItem={({ item }) => (
                  <View style={[styles.chatBubble, item.sender === "user" ? styles.userBubble : styles.botBubble]}>
                    {item.sender === "bot" && (
                      <View style={styles.botAvatar}>
                        <FontAwesome5 name="earlybirds" size={14} color={COLORS.primary} />
                      </View>
                    )}
                    <Text style={item.sender === "user" ? styles.userText : styles.botText}>{item.text}</Text>
                  </View>
                )}
                ref={flatListRef}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              />
            ) : (
              <View style={styles.emptyChat}>
                <View style={styles.botAvatarLarge}>
                  <FontAwesome5 name="earlybirds" size={32} color={COLORS.primary} />
                </View>
                <Text style={styles.welcomeText}>How can I help you sell today?</Text>
                <Text style={styles.promptText}>Ask about sales, inventory, or pricing.</Text>
              </View>
            )}

            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatInput}
                value={chatMessage}
                onChangeText={setChatMessage}
                placeholder="Type a message..."
                placeholderTextColor="#94A3B8"
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity style={[styles.sendBtn, !chatMessage.trim() && styles.sendBtnDisabled]} onPress={sendMessage} disabled={!chatMessage.trim()}>
                <Ionicons name="send" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        );

      case "products":
        return (
          <ProductManagement
            products={products}
            handleAddProduct={handleAddProduct}
            handleEditProduct={handleEditProduct}
            handleSaveProduct={handleSaveProduct}
            handleDeleteProduct={handleDeleteProduct}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            productForm={productForm}
            setProductForm={setProductForm}
            editingProduct={editingProduct}
          />
        );

      default: return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={onRefresh}>
          <Feather name="refresh-cw" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* CONDITIONAL LAYOUT: 
          Uses KeyboardAvoidingView for chat to prevent keyboard overlap.
          Uses ScrollView for everything else to allow page scrolling. */}
      {activeTab === "assistant" ? (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <DashboardHeader />
          {renderTabContent()}
        </KeyboardAvoidingView>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        >
          <DashboardHeader />
          {renderTabContent()}
        </ScrollView>
      )}

      {/* FLOATING ACTION BUTTON */}
      {activeTab !== "assistant" && (
        <TouchableOpacity style={styles.fab} onPress={handleAddProduct}>
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  iconBtn: {
    padding: 8,
    borderRadius: 8,
  },

  // Top Section (Summary & AI)
  topSection: {
    padding: 20,
  },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 16,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 8,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 20,
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendText: {
    fontSize: 12,
    color: "#16A34A",
    marginLeft: 6,
    fontWeight: "600",
  },
  trendTextRed: {
    fontSize: 12,
    color: "#DC2626",
    marginLeft: 6,
    fontWeight: "600",
  },
  aiBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  aiBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  aiBannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 2,
  },
  aiBannerText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },

  // Tabs
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    flexGrow: 0,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    marginRight: 10,
  },
  activeTabButton: {
    backgroundColor: COLORS.primary,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  activeTabText: {
    color: "white",
  },

  // Content Area
  tabContent: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },

  // Analytics Grid
  analyticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  analyticsCard: {
    width: "48%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  analyticsValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },

  // List Items
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  productImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    paddingRight: 16,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  itemSub: {
    fontSize: 13,
    color: "#94A3B8",
  },
  itemMeta: {
    alignItems: "flex-end",
  },
  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  goodStockBg: { backgroundColor: "#16A34A" },
  lowStockBg: { backgroundColor: "#DC2626" },
  stockText: {
    fontSize: 12,
    color: "#64748B",
  },
  salesText: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 2,
  },
  revenueText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  stockStatus: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 2,
  },
  lowStockText: {
    color: "#DC2626",
    fontWeight: "600",
  },
  priceText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },

  // Pricing Layout
  reasonTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  reasonText: {
    fontSize: 11,
    color: "#64748b",
  },
  pricingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 14,
    color: "#94A3B8",
    textDecorationLine: 'line-through',
  },
  suggestedPrice: {
    fontSize: 16,
    fontWeight: "700",
  },
  priceUp: { color: "#16A34A" },
  priceDown: { color: "#DC2626" },

  // Chat/Assistant
  chatContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  chatBubble: {
    maxWidth: "85%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F5F9",
    borderBottomLeftRadius: 4,
    flexDirection: 'row',
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  botAvatar: {
    marginRight: 8,
    marginTop: 2,
  },
  botText: {
    flex: 1,
    fontSize: 14,
    color: "#1E293B",
    lineHeight: 20,
  },
  userText: {
    fontSize: 14,
    color: "white",
    lineHeight: 20,
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  botAvatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  promptText: {
    fontSize: 14,
    color: '#64748B',
  },
  chatInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  chatInput: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1E293B",
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  sendBtnDisabled: {
    backgroundColor: "#CBD5E1",
  },

  // Empty States
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 15,
    color: "#94A3B8",
    marginTop: 12,
    fontWeight: "500",
  },

  // Floating Action Button
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default SellerDashboard;