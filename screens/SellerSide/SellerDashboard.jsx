import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
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
import API_URL from "../../api/api_urls";
import axios from "axios";
import N8NAPI_URL from "../../api/n8n_api";

const products_api = API_URL + "/api/v1/seller/Manage Product/manage_product";

const SellerDashboard = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("analytics");
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(
  //   [
  //   {
  //     id: 1,
  //     text: "Hello! I'm your selling assistant. How can I help?",
  //     sender: "bot",
  //   },
  // ]
  );

const fetchMessage = async () => {
    try {
      const response = await axios.get(
        `${N8NAPI_URL}/webhook/get_AIHelper_SellerHistory`
      );
      setChatMessages(response.data.full_history);
      console.log("Fetched chat history:", response.data.full_history);
    } catch (error) {
      console.error("Error fetching Message details:", error);
    }
  }  


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
    fetchProducts();
    fetchMessage();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts().finally(() => setRefreshing(false));
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(products_api);
      setProducts(response.data);
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

  // const sendMessage = () => {
  //   if (chatMessage.trim()) {
      
      
  //     setChatMessages([
  //       ...chatMessages,
  //       { id: chatMessages.length + 1, text: chatMessage, sender: "user" },
  //       {
  //         id: chatMessages.length + 2,
  //         text: "Thanks for your message! I'll analyze your data and get back to you soon.",
  //         sender: "bot",
  //       },
  //     ]);
  //     setChatMessage("");
  //     setTimeout(() => {
  //       flatListRef.current?.scrollToEnd({ animated: true });
  //     }, 100);
  //   }
  // };

const sendMessage = async () => {
  if (chatMessage.trim()) {
    // Add the user's message immediately
    const userMsg = {
      id: chatMessages.length + 1,
      text: chatMessage,
      sender: "user",
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatMessage("");
    // Auto-scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const res = await axios.post( `${N8NAPI_URL}/webhook/AI_Seller_Helper`, {
        userMsg,
      });

      // Handle the bot's reply
      const botMsg = {
        id: chatMessages.length + 2,
        text: res.data.last_exchange.text || "Sorry, I couldn’t process your message.",
        sender: "bot",
      };

      // Add bot message to chat
      setChatMessages((prev) => [...prev, botMsg]);

      // Scroll again after receiving reply
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

    } catch (error) {
      console.error("Error sending message:", error);

      // Show error message in chat
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
    setProductForm({
      name: "",
      price: "",
      stock: "",
      description: "",
      img: "",
    });
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
      if (editingProduct) {
        const productData = {
          product_id: editingProduct.id,
          name: productForm.name,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
          description: productForm.description,
          image: productForm.img,
        };
        await axios.put(products_api, productData);
      } else {
        const productData = {
          name: productForm.name,
          price: parseInt(productForm.price),
          stock: parseInt(productForm.stock),
          description: productForm.description,
          image: productForm.img,
        };
        await axios.post(products_api, productData);
      }
      fetchProducts();
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${products_api}/${id}`);
      fetchProducts();
      setModalVisible(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "analytics":
        return (
          <View style={styles.tabContent}>
            <View style={styles.analyticsGrid}>
              <View style={styles.analyticsCard}>
                <MaterialIcons name="trending-up" size={24} color={COLORS.primary} />
                <Text style={styles.analyticsValue}>
                  {analyticsData.totalSales}
                </Text>
                <Text style={styles.analyticsLabel}>Total Sales</Text>
              </View>
              <View style={styles.analyticsCard}>
                <FontAwesome name="money" size={20} color={COLORS.primary} />
                <Text style={styles.analyticsValue}>
                  ₱{analyticsData.totalRevenue.toLocaleString()}
                </Text>
                <Text style={styles.analyticsLabel}>Total Revenue</Text>
              </View>
              <View style={styles.analyticsCard}>
                <MaterialIcons name="compare-arrows" size={24} color={COLORS.primary} />
                <Text style={styles.analyticsValue}>
                  {analyticsData.conversionRate}
                </Text>
                <Text style={styles.analyticsLabel}>Conversion Rate</Text>
              </View>
              <View style={styles.analyticsCard}>
                <MaterialIcons name="star" size={24} color={COLORS.primary} />
                <Text style={styles.analyticsValue}>
                  {analyticsData.topProduct}
                </Text>
                <Text style={styles.analyticsLabel}>Top Product</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Sales Performance</Text>
            {salesData.length > 0 ? (
              <FlatList
                data={salesData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.salesItem}>
                    <View style={{ flex: 2 }}>
                      <Text style={styles.productName}>{item.product}</Text>
                      <View style={styles.stockIndicatorContainer}>
                        <View style={[
                          styles.stockIndicator,
                          item.stock < 5 ? styles.lowStockIndicator : styles.normalStockIndicator
                        ]} />
                        <Text style={styles.stockText}>
                          {item.stock < 5 ? "Low stock" : "In stock"} ({item.stock})
                        </Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                      <Text style={styles.salesText}>{item.sales} sold</Text>
                      <Text style={styles.revenueText}>₱{item.revenue.toLocaleString()}</Text>
                    </View>
                  </View>
                )}
              />
            ) : (
              <View style={styles.emptyState}>
                <Feather name="box" size={40} color="#ccc" />
                <Text style={styles.emptyStateText}>No sales data available</Text>
              </View>
            )}
          </View>
        );
      case "inventory":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Current Inventory</Text>
            {products.product_info?.length > 0 ? (
              <FlatList
                data={products.product_info}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.inventoryItem}
                    onPress={() => handleEditProduct(item)}
                  >
                    {item.img ? (
                      <Image source={{ uri: item.img }} style={styles.productImage} />
                    ) : (
                      <View style={[styles.productImage, styles.productImagePlaceholder]}>
                        <Feather name="image" size={24} color="#ccc" />
                      </View>
                    )}
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.productName}>{item.name}</Text>
                      <Text style={styles.productDescription} numberOfLines={2}>
                        {item.description || "No description"}
                      </Text>
                    </View>
                    <View style={styles.stockContainer}>
                      <View style={styles.stockIndicatorContainer}>
                        <View style={[
                          styles.stockIndicator,
                          item.stock < 5 ? styles.lowStockIndicator : styles.normalStockIndicator
                        ]} />
                        <Text style={item.stock < 5 ? styles.lowStock : styles.normalStock}>
                          {item.stock} left
                        </Text>
                      </View>
                      <Text style={styles.priceText}>₱{item.price.toLocaleString()}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View style={styles.emptyState}>
                <Feather name="box" size={40} color="#ccc" />
                <Text style={styles.emptyStateText}>No products in inventory</Text>
                <TouchableOpacity 
                  style={styles.addProductButton} 
                  onPress={handleAddProduct}
                >
                  <Text style={styles.addProductButtonText}>Add Product</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      case "pricing":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Pricing Suggestions</Text>
            {pricingSuggestions.length > 0 ? (
              <FlatList
                data={pricingSuggestions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.pricingItem}>
                    <Text style={styles.productName}>{item.product}</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.currentPrice}>₱{item.current.toLocaleString()}</Text>
                      <MaterialIcons
                        name="trending-flat"
                        size={20}
                        color="#666"
                      />
                      <Text
                        style={[
                          styles.suggestedPrice,
                          item.suggested > item.current
                            ? styles.priceUp
                            : item.suggested < item.current
                            ? styles.priceDown
                            : styles.priceSame,
                        ]}
                      >
                        ₱{item.suggested.toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.reasonContainer}>
                      <Ionicons 
                        name="information-circle-outline" 
                        size={16} 
                        color="#666" 
                        style={styles.infoIcon}
                      />
                      <Text style={styles.reasonText}>{item.reason}</Text>
                    </View>
                  </View>
                )}
              />
            ) : (
              <View style={styles.emptyState}>
                <Feather name="tag" size={40} color="#ccc" />
                <Text style={styles.emptyStateText}>No pricing suggestions available</Text>
              </View>
            )}
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
      case "assistant":
        return (
          <View style={styles.assistantContainer}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
              style={{ flex: 1 }}
            >
              <View style={styles.tabContent}>
                <Text style={styles.sectionTitle}>Selling Assistant</Text>

                {chatMessages.length > 1 ? (
                  <FlatList
                    data={chatMessages}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    renderItem={({ item }) => (
                      <View
                        style={[
                          styles.chatBubble,
                          item.sender === "user"
                            ? styles.userBubble
                            : styles.botBubble,
                        ]}
                      >
                        {item.sender === "bot" && (
                          <View style={styles.botAvatar}>
                            <FontAwesome5 name="earlybirds" size={20} color="white" />
                          </View>
                        )}
                        <Text
                          style={
                            item.sender === "user"
                              ? styles.userText
                              : styles.botText
                          }
                        >
                          {item.text}
                        </Text>
                        {item.sender === "user" && (
                          <View style={styles.userAvatar}>
                            <Ionicons name="person" size={16} color="white" />
                          </View>
                        )}
                      </View>
                    )}
                    ref={flatListRef}
                    onContentSizeChange={() =>
                      flatListRef.current?.scrollToEnd({ animated: true })
                    }
                    onLayout={() =>
                      flatListRef.current?.scrollToEnd({ animated: true })
                    }
                  />
                ) : (
                  <View style={styles.assistantEmptyState}>
                    <View style={styles.botAvatarLarge}>
                      <FontAwesome5 name="earlybirds" size={32} color="white" />
                    </View>
                    <Text style={styles.assistantWelcomeText}>Hi there! I'm your selling assistant.</Text>
                    <Text style={styles.assistantPromptText}>Ask me about your sales, inventory, or pricing suggestions.</Text>
                  </View>
                )}

                <View style={styles.chatInputContainer}>
                  <TextInput
                    style={styles.chatInput}
                    value={chatMessage}
                    onChangeText={setChatMessage}
                    placeholder="Ask about your sales..."
                    placeholderTextColor="#999"
                    onSubmitEditing={sendMessage}
                  />
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={sendMessage}
                    disabled={!chatMessage.trim()}
                  >
                    <Ionicons 
                      name="send" 
                      size={20} 
                      color={chatMessage.trim() ? "white" : "#ccc"} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.header}>Seller Dashboard</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Quick Stats Overview */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewItem}>
            <View style={styles.overviewIconContainer}>
              <FontAwesome name="money" size={16} color="white" />
            </View>
            <Text style={styles.overviewLabel}>Today's Sales</Text>
            <Text style={styles.overviewValue}>₱3,450</Text>
            <View style={styles.overviewChangeContainer}>
              <Ionicons name="arrow-up" size={12} color="#4CAF50" />
              <Text style={styles.overviewChangePositive}>12% from yesterday</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.overviewItem}>
            <View style={styles.overviewIconContainer}>
              <Feather name="shopping-cart" size={16} color="white" />
            </View>
            <Text style={styles.overviewLabel}>Items Sold</Text>
            <Text style={styles.overviewValue}>14</Text>
            <View style={styles.overviewChangeContainer}>
              <Ionicons name="arrow-down" size={12} color="#F44336" />
              <Text style={styles.overviewChangeNegative}>3% from yesterday</Text>
            </View>
          </View>
        </View>

        {/* AI Insights */}
        <View style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <View style={styles.aiIconContainer}>
              <FontAwesome name="lightbulb-o" size={16} color="white" />
            </View>
            <Text style={styles.aiTitle}>AI Insights</Text>
          </View>
          <Text style={styles.aiText}>
            Your Handwoven Baskets are selling fast! Consider increasing
            production. Wooden Sculptures have low stock - reorder soon to avoid
            stockouts.
          </Text>
        </View>

        {/* Tab Navigation */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScrollContainer}
          contentContainerStyle={styles.tabScrollContent}
        >
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "analytics" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("analytics")}
          >
            <View style={[
              styles.tabIconContainer,
              activeTab === "analytics" && styles.activeTabIconContainer
            ]}>
              <MaterialIcons
                name="analytics"
                size={20}
                color={activeTab === "analytics" ? COLORS.primary : "#666"}
              />
            </View>
            <Text
              style={[
                styles.tabText,
                activeTab === "analytics" && styles.activeTabText,
              ]}
            >
              Analytics
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "inventory" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("inventory")}
          >
            <View style={[
              styles.tabIconContainer,
              activeTab === "inventory" && styles.activeTabIconContainer
            ]}>
              <MaterialIcons
                name="inventory"
                size={20}
                color={activeTab === "inventory" ? COLORS.primary : "#666"}
              />
            </View>
            <Text
              style={[
                styles.tabText,
                activeTab === "inventory" && styles.activeTabText,
              ]}
            >
              Inventory
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "pricing" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("pricing")}
          >
            <View style={[
              styles.tabIconContainer,
              activeTab === "pricing" && styles.activeTabIconContainer
            ]}>
              <FontAwesome
                name="tags"
                size={20}
                color={activeTab === "pricing" ? COLORS.primary : "#666"}
              />
            </View>
            <Text
              style={[
                styles.tabText,
                activeTab === "pricing" && styles.activeTabText,
              ]}
            >
              Pricing
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "products" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("products")}
          >
            <View style={[
              styles.tabIconContainer,
              activeTab === "products" && styles.activeTabIconContainer
            ]}>
              <Feather
                name="box"
                size={20}
                color={activeTab === "products" ? COLORS.primary : "#666"}
              />
            </View>
            <Text
              style={[
                styles.tabText,
                activeTab === "products" && styles.activeTabText,
              ]}
            >
              Products
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "assistant" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("assistant")}
          >
            <View style={[
              styles.tabIconContainer,
              activeTab === "assistant" && styles.activeTabIconContainer
            ]}>
              <AntDesign
                name="message1"
                size={20}
                color={activeTab === "assistant" ? COLORS.primary : "#666"}
              />
            </View>
            <Text
              style={[
                styles.tabText,
                activeTab === "assistant" && styles.activeTabText,
              ]}
            >
              Assistant
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>

      {/* Add Product Floating Button */}
      {activeTab !== "assistant" && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddProduct}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  overviewCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  overviewItem: {
    flex: 1,
    alignItems: "flex-start",
  },
  overviewIconContainer: {
    backgroundColor: COLORS.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  overviewLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  overviewChangeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  overviewChangePositive: {
    fontSize: 12,
    color: "#4CAF50",
    marginLeft: 4,
  },
  overviewChangeNegative: {
    fontSize: 12,
    color: "#F44336",
    marginLeft: 4,
  },
  divider: {
    width: 1,
    backgroundColor: "#eee",
    marginHorizontal: 16,
  },
  aiCard: {
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  aiIconContainer: {
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
    color: "#333",
  },
  aiText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  tabScrollContainer: {
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tabScrollContent: {
    paddingHorizontal: 8,
  },
  tabButton: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    minWidth: 80,
  },
  tabIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  activeTabIconContainer: {
    backgroundColor: "#E3F2FD",
  },
  activeTab: {
    // backgroundColor: "#E3F2FD",
  },
  tabText: {
    fontSize: 12,
    marginTop: 6,
    color: "#666",
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  tabContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flex: 1,
  },
  assistantContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  analyticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  analyticsCard: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  analyticsValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginVertical: 8,
  },
  analyticsLabel: {
    fontSize: 12,
    color: "#666",
  },
  salesItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  productName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  productDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  stockIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  normalStockIndicator: {
    backgroundColor: "#4CAF50",
  },
  lowStockIndicator: {
    backgroundColor: "#F44336",
  },
  stockText: {
    fontSize: 12,
    color: "#666",
  },
  salesText: {
    fontSize: 14,
    color: "#333",
  },
  revenueText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 4,
  },
  inventoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  productImagePlaceholder: {
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  stockContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginLeft: 12,
  },
  normalStock: {
    fontSize: 13,
    color: "#666",
  },
  lowStock: {
    fontSize: 13,
    color: "#F44336",
    fontWeight: "500",
  },
  priceText: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 4,
  },
  pricingItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  currentPrice: {
    fontSize: 16,
    color: "#333",
    marginRight: 8,
  },
  suggestedPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  priceUp: {
    color: "#4CAF50",
  },
  priceDown: {
    color: "#F44336",
  },
  priceSame: {
    color: "#FFC107",
  },
  reasonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  infoIcon: {
    marginRight: 4,
  },
  reasonText: {
    fontSize: 12,
    color: "#666",
  },
  chatBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#E3F2FD",
    borderTopLeftRadius: 0,
  },
  botAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  botAvatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 0,
  },
  userAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#666",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  botText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  userText: {
    fontSize: 14,
    color: "white",
    flex: 1,
  },
  chatInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: 8,
    paddingBottom: Platform.OS === "ios" ? 30 : 8,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  chatInput: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
  addProductButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  addProductButtonText: {
    color: "white",
    fontWeight: "500",
  },
  assistantEmptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  assistantWelcomeText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginTop: 16,
  },
  assistantPromptText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});

export default SellerDashboard;



// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   TextInput,
//   Modal,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import React, { useState, useRef, useEffect } from "react";
// import {
//   Ionicons,
//   MaterialIcons,
//   FontAwesome,
//   AntDesign,
//   Feather,
// } from "@expo/vector-icons";
// import { COLORS } from "../../style/theme";
// import { useNavigation } from "@react-navigation/native";
// import ProductManagement from "./ProductManagement";
// import API_URL from "../../api/api_urls";
// import axios from "axios";

// const products_api = API_URL + "/api/v1/seller/Manage Product/manage_product";

// const SellerDashboard = () => {
//   const navigation = useNavigation();
//   const [activeTab, setActiveTab] = useState("analytics");
//   const [chatMessage, setChatMessage] = useState("");
//   const [chatMessages, setChatMessages] = useState([
//     {
//       id: 1,
//       text: "Hello! I'm your selling assistant. How can I help?",
//       sender: "bot",
//     },
//   ]);
//   const [products, setProducts] = useState({ product_info: [] });
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [productForm, setProductForm] = useState({
//     name: "",
//     price: "",
//     stock: "",
//     description: "",
//     img: "",
//   });

//   const flatListRef = useRef(null);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get(products_api);
//       setProducts(response.data);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   const salesData = (products.product_info || []).map((product) => ({
//     id: product.id,
//     product: product.name,
//     sales: product.total_quantity_sold || 0,
//     revenue: product.total_price_sold || 0,
//     stock: product.stock,
//   }));

//   const pricingSuggestions = (products.product_info || []).map((product) => ({
//     id: product.id,
//     product: product.name,
//     current: product.price,
//     suggested: Math.floor(product.price * (0.9 + Math.random() * 0.3)),
//     reason: [
//       "High demand",
//       "Material costs",
//       "Optimal price",
//       "Low conversion",
//     ][Math.floor(Math.random() * 4)],
//   }));

//   const analyticsData = {
//     totalSales: salesData.reduce((sum, item) => sum + item.sales, 0),
//     totalRevenue: salesData.reduce((sum, item) => sum + item.revenue, 0),
//     conversionRate: `${(Math.random() * 5).toFixed(1)}%`,
//     topProduct: salesData.length > 0
//       ? salesData.reduce((max, item) => 
//           item.sales > max.sales ? item : max, 
//           salesData[0]
//         ).product
//       : "No products",
//   };

//   const sendMessage = () => {
//     if (chatMessage.trim()) {
//       setChatMessages([
//         ...chatMessages,
//         { id: chatMessages.length + 1, text: chatMessage, sender: "user" },
//         {
//           id: chatMessages.length + 2,
//           text: "Thanks for your message! I'll analyze your data and get back to you soon.",
//           sender: "bot",
//         },
//       ]);
//       setChatMessage("");
//       setTimeout(() => {
//         flatListRef.current?.scrollToEnd({ animated: true });
//       }, 100);
//     }
//   };

//   const handleAddProduct = () => {
//     setEditingProduct(null);
//     setProductForm({
//       name: "",
//       price: "",
//       stock: "",
//       description: "",
//       img: "",
//     });
//     setModalVisible(true);
//   };

//   const handleEditProduct = (product) => {
//     setEditingProduct(product);
//     setProductForm({
//       name: product.name,
//       price: product.price.toString(),
//       stock: product.stock.toString(),
//       description: product.description,
//       img: product.img,
//     });
//     setModalVisible(true);
//   };

//   const handleSaveProduct = async () => {
//     try {
//       if (editingProduct) {
//         const productData = {
//           product_id: editingProduct.id,
//           name: productForm.name,
//           price: parseFloat(productForm.price),
//           stock: parseInt(productForm.stock),
//           description: productForm.description,
//           image: productForm.img,
//         };
//         await axios.put(products_api, productData);
//       } else {
//         const productData = {
//           name: productForm.name,
//           price: parseInt(productForm.price),
//           stock: parseInt(productForm.stock),
//           description: productForm.description,
//           image: productForm.img,
//         };
//         await axios.post(products_api, productData);
//       }
//       fetchProducts();
//       setModalVisible(false);
//     } catch (error) {
//       console.error("Error saving product:", error);
//     }
//   };

//   const handleDeleteProduct = async (id) => {
//     try {
//       await axios.delete(`${products_api}/${id}`);
//       fetchProducts();
//       setModalVisible(false);
//     } catch (error) {
//       console.error("Error deleting product:", error);
//     }
//   };

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "analytics":
//         return (
//           <View style={styles.tabContent}>
//             <View style={styles.analyticsGrid}>
//               <View style={styles.analyticsCard}>
//                 <Text style={styles.analyticsValue}>
//                   {analyticsData.totalSales}
//                 </Text>
//                 <Text style={styles.analyticsLabel}>Total Sales</Text>
//               </View>
//               <View style={styles.analyticsCard}>
//                 <Text style={styles.analyticsValue}>
//                   ₱{analyticsData.totalRevenue.toLocaleString()}
//                 </Text>
//                 <Text style={styles.analyticsLabel}>Total Revenue</Text>
//               </View>
//               <View style={styles.analyticsCard}>
//                 <Text style={styles.analyticsValue}>
//                   {analyticsData.conversionRate}
//                 </Text>
//                 <Text style={styles.analyticsLabel}>Conversion Rate</Text>
//               </View>
//               <View style={styles.analyticsCard}>
//                 <Text style={styles.analyticsValue}>
//                   {analyticsData.topProduct}
//                 </Text>
//                 <Text style={styles.analyticsLabel}>Top Product</Text>
//               </View>
//             </View>

//             <Text style={styles.sectionTitle}>Sales Performance</Text>
//             <FlatList
//               data={salesData}
//               keyExtractor={(item) => item.id.toString()}
//               renderItem={({ item }) => (
//                 <View style={styles.salesItem}>
//                   <View style={{ flex: 2 }}>
//                     <Text style={styles.productName}>{item.product}</Text>
//                     <Text style={styles.stockText}>
//                       {item.stock < 5 ? "Low stock!" : "In stock"} ({item.stock}{" "}
//                       left)
//                     </Text>
//                   </View>
//                   <View style={{ flex: 1, alignItems: "flex-end" }}>
//                     <Text style={styles.salesText}>{item.sales} sold</Text>
//                     <Text style={styles.revenueText}>₱{item.revenue}</Text>
//                   </View>
//                 </View>
//               )}
//             />
//           </View>
//         );
//       case "inventory":
//         return (
//           <View style={styles.tabContent}>
//             <Text style={styles.sectionTitle}>Current Inventory</Text>
//             <FlatList
//               data={products.product_info || []}
//               keyExtractor={(item) => item.id.toString()}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.inventoryItem}
//                   onPress={() => handleEditProduct(item)}
//                 >
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.productName}>{item.name}</Text>
//                     <Text style={styles.productDescription}>
//                       {item.description}
//                     </Text>
//                   </View>
//                   <View style={styles.stockContainer}>
//                     <Text
//                       style={
//                         item.stock < 5 ? styles.lowStock : styles.normalStock
//                       }
//                     >
//                       {item.stock} remaining
//                     </Text>
//                     <Text style={styles.priceText}>₱{item.price}</Text>
//                   </View>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         );
//       case "pricing":
//         return (
//           <View style={styles.tabContent}>
//             <Text style={styles.sectionTitle}>Pricing Suggestions</Text>
//             <FlatList
//               data={pricingSuggestions}
//               keyExtractor={(item) => item.id.toString()}
//               renderItem={({ item }) => (
//                 <View style={styles.pricingItem}>
//                   <Text style={styles.productName}>{item.product}</Text>
//                   <View style={styles.priceRow}>
//                     <Text style={styles.currentPrice}>₱{item.current}</Text>
//                     <MaterialIcons
//                       name="trending_flat"
//                       size={20}
//                       color="#666"
//                     />
//                     <Text
//                       style={[
//                         styles.suggestedPrice,
//                         item.suggested > item.current
//                           ? styles.priceUp
//                           : item.suggested < item.current
//                           ? styles.priceDown
//                           : null,
//                       ]}
//                     >
//                       ₱{item.suggested}
//                     </Text>
//                   </View>
//                   <Text style={styles.reasonText}>{item.reason}</Text>
//                 </View>
//               )}
//             />
//           </View>
//         );
//       case "products":
//         return (
//           <ProductManagement
//             products={products}
//             handleAddProduct={handleAddProduct}
//             handleEditProduct={handleEditProduct}
//             handleSaveProduct={handleSaveProduct}
//             handleDeleteProduct={handleDeleteProduct}
//             modalVisible={modalVisible}
//             setModalVisible={setModalVisible}
//             productForm={productForm}
//             setProductForm={setProductForm}
//             editingProduct={editingProduct}
//           />
//         );
//       case "assistant":
//         return (
//           <View style={styles.assistantContainer}>
//             <KeyboardAvoidingView
//               behavior={Platform.OS === "ios" ? "padding" : "height"}
//               keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
//               style={{ flex: 1 }}
//             >
//               <View style={styles.tabContent}>
//                 <Text style={styles.sectionTitle}>Selling Assistant</Text>

//                 <FlatList
//                   data={chatMessages}
//                   keyExtractor={(item) => item.id.toString()}
//                   contentContainerStyle={{ paddingBottom: 80 }}
//                   renderItem={({ item }) => (
//                     <View
//                       style={[
//                         styles.chatBubble,
//                         item.sender === "user"
//                           ? styles.userBubble
//                           : styles.botBubble,
//                       ]}
//                     >
//                       <Text
//                         style={
//                           item.sender === "user"
//                             ? styles.userText
//                             : styles.botText
//                         }
//                       >
//                         {item.text}
//                       </Text>
//                     </View>
//                   )}
//                   ref={flatListRef}
//                   onContentSizeChange={() =>
//                     flatListRef.current?.scrollToEnd({ animated: true })
//                   }
//                   onLayout={() =>
//                     flatListRef.current?.scrollToEnd({ animated: true })
//                   }
//                 />

//                 <View style={styles.chatInputContainer}>
//                   <TextInput
//                     style={styles.chatInput}
//                     value={chatMessage}
//                     onChangeText={setChatMessage}
//                     placeholder="Ask about your sales..."
//                     placeholderTextColor="#999"
//                     onSubmitEditing={sendMessage}
//                   />
//                   <TouchableOpacity
//                     style={styles.sendButton}
//                     onPress={sendMessage}
//                   >
//                     <Ionicons name="send" size={20} color="white" />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </KeyboardAvoidingView>
//           </View>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Back Button Header */}
//       <View style={styles.headerContainer}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
//         </TouchableOpacity>
//         <Text style={styles.header}>Seller Dashboard</Text>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {/* Main Analytics Overview */}
//         <View style={styles.overviewCard}>
//           <View style={styles.overviewItem}>
//             <Text style={styles.overviewLabel}>Today's Sales</Text>
//             <Text style={styles.overviewValue}>₱3,450</Text>
//             <Text style={styles.overviewChangePositive}>
//               ↑ 12% from yesterday
//             </Text>
//           </View>
//           <View style={styles.overviewItem}>
//             <Text style={styles.overviewLabel}>Items Sold</Text>
//             <Text style={styles.overviewValue}>14</Text>
//             <Text style={styles.overviewChangeNegative}>
//               ↓ 3% from yesterday
//             </Text>
//           </View>
//         </View>

//         {/* AI Insights */}
//         <View style={styles.aiCard}>
//           <View style={styles.aiHeader}>
//             <FontAwesome name="lightbulb-o" size={18} color={COLORS.primary} />
//             <Text style={styles.aiTitle}>AI Insights</Text>
//           </View>
//           <Text style={styles.aiText}>
//             Your Handwoven Baskets are selling fast! Consider increasing
//             production. Wooden Sculptures have low stock - reorder soon to avoid
//             stockouts.
//           </Text>
//         </View>

//         {/* Tab Navigation */}
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.tabScrollContainer}
//           contentContainerStyle={styles.tabScrollContent}
//         >
//           <TouchableOpacity
//             style={[
//               styles.tabButton,
//               activeTab === "analytics" && styles.activeTab,
//             ]}
//             onPress={() => setActiveTab("analytics")}
//           >
//             <MaterialIcons
//               name="analytics"
//               size={24}
//               color={activeTab === "analytics" ? COLORS.primary : "#666"}
//             />
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === "analytics" && styles.activeTabText,
//               ]}
//             >
//               Analytics
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.tabButton,
//               activeTab === "inventory" && styles.activeTab,
//             ]}
//             onPress={() => setActiveTab("inventory")}
//           >
//             <MaterialIcons
//               name="inventory"
//               size={24}
//               color={activeTab === "inventory" ? COLORS.primary : "#666"}
//             />
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === "inventory" && styles.activeTabText,
//               ]}
//             >
//               Inventory
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.tabButton,
//               activeTab === "pricing" && styles.activeTab,
//             ]}
//             onPress={() => setActiveTab("pricing")}
//           >
//             <FontAwesome
//               name="tags"
//               size={24}
//               color={activeTab === "pricing" ? COLORS.primary : "#666"}
//             />
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === "pricing" && styles.activeTabText,
//               ]}
//             >
//               Pricing
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.tabButton,
//               activeTab === "products" && styles.activeTab,
//             ]}
//             onPress={() => setActiveTab("products")}
//           >
//             <Feather
//               name="box"
//               size={24}
//               color={activeTab === "products" ? COLORS.primary : "#666"}
//             />
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === "products" && styles.activeTabText,
//               ]}
//             >
//               Products
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.tabButton,
//               activeTab === "assistant" && styles.activeTab,
//             ]}
//             onPress={() => setActiveTab("assistant")}
//           >
//             <AntDesign
//               name="message1"
//               size={24}
//               color={activeTab === "assistant" ? COLORS.primary : "#666"}
//             />
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === "assistant" && styles.activeTabText,
//               ]}
//             >
//               Assistant
//             </Text>
//           </TouchableOpacity>
//         </ScrollView>

//         {/* Tab Content */}
//         {renderTabContent()}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//   },
//   headerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     paddingTop: 16, // Reduced from 40 to remove extra space
//     backgroundColor: "white",
//   },
//   backButton: {
//     marginRight: 16,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   scrollContainer: {
//     padding: 16,
//     paddingBottom: 80,
//   },
//   overviewCard: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 16,
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   overviewItem: {
//     flex: 1,
//     alignItems: "center",
//   },
//   overviewLabel: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 4,
//   },
//   overviewValue: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 4,
//   },
//   overviewChangePositive: {
//     fontSize: 12,
//     color: "#4CAF50",
//   },
//   overviewChangeNegative: {
//     fontSize: 12,
//     color: "#F44336",
//   },
//   aiCard: {
//     backgroundColor: "#E3F2FD",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//   },
//   aiHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   aiTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginLeft: 8,
//     color: "#333",
//   },
//   aiText: {
//     fontSize: 14,
//     color: "#333",
//     lineHeight: 20,
//   },
//   tabScrollContainer: {
//     marginBottom: 16,
//     backgroundColor: "white",
//     borderRadius: 12,
//     paddingVertical: 12,
//   },
//   tabScrollContent: {
//     paddingHorizontal: 8,
//   },
//   tabButton: {
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginHorizontal: 4,
//     minWidth: 100,
//   },
//   activeTab: {
//     backgroundColor: "#E3F2FD",
//   },
//   tabText: {
//     fontSize: 14,
//     marginTop: 8,
//     color: "#666",
//   },
//   activeTabText: {
//     color: COLORS.primary,
//     fontWeight: "bold",
//   },
//   tabContent: {
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//     flex: 1,
//   },
//   assistantContainer: {
//     flex: 1,
//     backgroundColor: "white",
//     borderRadius: 12,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 16,
//     color: "#333",
//   },
//   analyticsGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     marginBottom: 16,
//   },
//   analyticsCard: {
//     width: "48%",
//     backgroundColor: "#f9f9f9",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//     alignItems: "center",
//   },
//   analyticsValue: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: COLORS.primary,
//     marginBottom: 4,
//   },
//   analyticsLabel: {
//     fontSize: 12,
//     color: "#666",
//   },
//   salesItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   productName: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#333",
//   },
//   productDescription: {
//     fontSize: 12,
//     color: "#666",
//     marginTop: 4,
//   },
//   stockText: {
//     fontSize: 12,
//     color: "#666",
//     marginTop: 4,
//   },
//   salesText: {
//     fontSize: 14,
//     color: "#333",
//   },
//   revenueText: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: COLORS.primary,
//     marginTop: 4,
//   },
//   inventoryItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   productItem: {
//     flexDirection: "row",
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   productImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     marginRight: 12,
//   },
//   productImagePlaceholder: {
//     backgroundColor: "#f5f5f5",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   productInfo: {
//     flex: 1,
//   },
//   productDetails: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 8,
//   },
//   stockContainer: {
//     flexDirection: "column",
//     alignItems: "flex-end",
//   },
//   normalStock: {
//     fontSize: 14,
//     color: "#666",
//   },
//   lowStock: {
//     fontSize: 14,
//     color: "#F44336",
//   },
//   priceText: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: COLORS.primary,
//   },
//   pricingItem: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   priceRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 8,
//   },
//   currentPrice: {
//     fontSize: 16,
//     color: "#333",
//     marginRight: 8,
//   },
//   suggestedPrice: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginLeft: 8,
//   },
//   priceUp: {
//     color: "#4CAF50",
//   },
//   priceDown: {
//     color: "#F44336",
//   },
//   reasonText: {
//     fontSize: 12,
//     color: "#666",
//   },
//   chatBubble: {
//     maxWidth: "80%",
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 8,
//   },
//   botBubble: {
//     alignSelf: "flex-start",
//     backgroundColor: "#E3F2FD",
//     borderTopLeftRadius: 0,
//   },
//   userBubble: {
//     alignSelf: "flex-end",
//     backgroundColor: COLORS.primary,
//     borderTopRightRadius: 0,
//   },
//   botText: {
//     fontSize: 14,
//     color: "#333",
//   },
//   userText: {
//     fontSize: 14,
//     color: "white",
//   },
//   chatInputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingTop: 8,
//     paddingHorizontal: 8,
//     paddingBottom: Platform.OS === "ios" ? 30 : 8,
//     backgroundColor: "white",
//     borderTopWidth: 1,
//     borderTopColor: "#eee",
//   },
//   chatInput: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     fontSize: 14,
//   },
//   sendButton: {
//     backgroundColor: COLORS.primary,
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     marginLeft: 8,
//   },
//   addButton: {
//     position: "absolute",
//     bottom: 20,
//     right: 20,
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: COLORS.primary,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.5)",
//   },
//   modalContent: {
//     width: "90%",
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#333",
//   },
//   inputLabel: {
//     fontSize: 14,
//     marginBottom: 6,
//     color: "#666",
//   },
//   textInput: {
//     backgroundColor: "#f5f5f5",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//     color: "#333",
//   },
//   saveButton: {
//     backgroundColor: COLORS.primary,
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   deleteButton: {
//     backgroundColor: "#F44336",
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   cancelButton: {
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//   },
//   buttonText: {
//     color: "white",
//     fontWeight: "bold",
//   },
// });

// export default SellerDashboard;

