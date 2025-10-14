import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { TradeContext } from "./TradeComponent/TradeContext";
import { useNavigation } from "@react-navigation/native";

const TradeScreen = () => {
  const tradeContext = useContext(TradeContext);
  const navigation = useNavigation();

  const {
    activeTrades = [],
    tradeHistory = [],
    tradeOffers = [],
    initMockData,
    createTradeOffer,
    acceptTrade,
    rejectTrade,
    completeTrade,
  } = tradeContext || {};

  const [activeTab, setActiveTab] = useState("offers");
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedUserProduct, setSelectedUserProduct] = useState(null);
  const [selectedShopProduct, setSelectedShopProduct] = useState(null);
  const [notes, setNotes] = useState("");

  const userProducts = [
    {
      id: "u1",
      name: "Hablon Wallet",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=60",
      value: "₱250",
    },
    {
      id: "u2",
      name: "Barako Coffee",
      image:
        "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300&auto=format&fit=crop&q=60",
      value: "₱350",
    },
    {
      id: "u3",
      name: "Piaya Original",
      image:
        "https://images.unsplash.com/photo-1555507036-ab794f27d2e9?w=300&auto=format&fit=crop&q=60",
      value: "₱120",
    },
    {
      id: "u4",
      name: "Handwoven Basket",
      image:
        "https://images.unsplash.com/photo-1586023492125-27a3ceef34b3?w=300&auto=format&fit=crop&q=60",
      value: "₱180",
    },
  ];

  const shopProducts = [
    {
      id: "p1",
      name: "Biscocho",
      image:
        "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=300&auto=format&fit=crop&q=60",
      price: "₱60",
      shop: "Iloilo Biscocho Haus",
      shopImage:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=60",
    },
    {
      id: "p2",
      name: "Butterscotch",
      image:
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300&auto=format&fit=crop&q=60",
      price: "₱160",
      shop: "Iloilo Biscocho Haus",
      shopImage:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=60",
    },
    {
      id: "p3",
      name: "Arabica Blend",
      image:
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&auto=format&fit=crop&q=60",
      price: "₱120",
      shop: "Madge Coffee",
      shopImage:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=60",
    },
    {
      id: "p4",
      name: "Coffee Beans",
      image:
        "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300&auto=format&fit=crop&q=60",
      price: "₱350",
      shop: "Madge Coffee",
      shopImage:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=60",
    },
  ];

  useEffect(() => {
    if (initMockData) {
      initMockData();
    }
  }, []);

  const handleCreateTrade = () => {
    if (!selectedUserProduct || !selectedShopProduct) {
      Alert.alert(
        "Missing Information",
        "Please select both products to trade"
      );
      return;
    }

    const newTrade = {
      id: `trade-${Date.now()}`,
      shop: {
        name: selectedShopProduct.shop,
        image: selectedShopProduct.shopImage,
        rating: 4.5,
      },
      userProduct: selectedUserProduct,
      shopProduct: selectedShopProduct,
      notes,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    if (createTradeOffer) {
      createTradeOffer(newTrade);
    }

    setIsCreateModalVisible(false);
    resetSelection();

    setTimeout(() => {
      navigation.navigate("TradeConfirmationScreen", { trade: newTrade });
    }, 100);
  };

  const resetSelection = () => {
    setSelectedUserProduct(null);
    setSelectedShopProduct(null);
    setNotes("");
  };

  const renderContent = () => {
    let data = [];
    let emptyMessage = "";

    switch (activeTab) {
      case "offers":
        data = tradeOffers;
        emptyMessage = "No trade offers available";
        break;
      case "active":
        data = activeTrades;
        emptyMessage = "No active trades";
        break;
      case "history":
        data = tradeHistory;
        emptyMessage = "No trade history";
        break;
      default:
        data = [];
    }

    if (data.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Feather name="shopping-bag" size={64} color="#cbd5e1" />
          <Text style={styles.emptyStateTitle}>{emptyMessage}</Text>
          <Text style={styles.emptyStateText}>
            {activeTab === "offers"
              ? "When shops send you trade offers, they will appear here."
              : activeTab === "active"
              ? "Your ongoing trades will appear here."
              : "Your completed trades will appear here."}
          </Text>
          {activeTab === "offers" && (
            <TouchableOpacity
              style={styles.createTradeButton}
              onPress={() => setIsCreateModalVisible(true)}
            >
              <Text style={styles.createTradeButtonText}>
                Create Your First Trade
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <View style={styles.tradesList}>
        {data.map((trade) => (
          <View key={trade.id} style={styles.tradeCard}>
            <View style={styles.tradeHeader}>
              <Text style={styles.shopName}>
                {activeTab === "offers" ? trade.from : trade.recipient}
              </Text>
              <Text
                style={[
                  styles.tradeStatus,
                  {
                    backgroundColor:
                      trade.status === "pending"
                        ? "#fef3c7"
                        : trade.status === "active"
                        ? "#dbeafe"
                        : "#dcfce7",
                  },
                ]}
              >
                {trade.status?.charAt(0).toUpperCase() + trade.status?.slice(1)}
              </Text>
            </View>

            <View style={styles.tradeItems}>
              <View style={styles.item}>
                <Text style={styles.itemLabel}>You give:</Text>
                <View style={styles.itemWithImage}>
                  <Image
                    source={{ uri: trade.itemsOffered?.[0]?.image }}
                    style={styles.itemImage}
                  />
                  <View>
                    <Text style={styles.itemName}>
                      {trade.itemsOffered?.[0]?.name}
                    </Text>
                    <Text style={styles.itemValue}>
                      {trade.itemsOffered?.[0]?.value}
                    </Text>
                  </View>
                </View>
              </View>

              <Feather
                name="repeat"
                size={16}
                color="#94a3b8"
                style={styles.exchangeIcon}
              />

              <View style={styles.item}>
                <Text style={styles.itemLabel}>You get:</Text>
                <View style={styles.itemWithImage}>
                  <Image
                    source={{ uri: trade.itemsRequested?.[0]?.image }}
                    style={styles.itemImage}
                  />
                  <View>
                    <Text style={styles.itemName}>
                      {trade.itemsRequested?.[0]?.name}
                    </Text>
                    <Text style={styles.itemValue}>
                      {trade.itemsRequested?.[0]?.price}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {trade.message && (
              <Text style={styles.tradeMessage}>"{trade.message}"</Text>
            )}

            {activeTab === "offers" && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.button, styles.declineButton]}
                  onPress={() => rejectTrade && rejectTrade(trade.id)}
                >
                  <Text style={styles.declineText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.acceptButton]}
                  onPress={() => acceptTrade && acceptTrade(trade.id)}
                >
                  <Text style={styles.acceptText}>Accept</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeTab === "active" && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.button, styles.completeButton]}
                  onPress={() => completeTrade && completeTrade(trade.id)}
                >
                  <Text style={styles.completeText}>Mark Complete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const getTabCount = (tab) => {
    switch (tab) {
      case "offers":
        return tradeOffers.length;
      case "active":
        return activeTrades.length;
      case "history":
        return tradeHistory.length;
      default:
        return 0;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#0f172a" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Trade Center</Text>
          <Text style={styles.subtitle}>
            Exchange products with local shops
          </Text>
        </View>
        <TouchableOpacity
          style={styles.newTradeButton}
          onPress={() => setIsCreateModalVisible(true)}
        >
          <Feather name="plus" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {[
          { key: "offers", label: "Offers", icon: "gift" },
          { key: "active", label: "Active", icon: "refresh-cw" },
          { key: "history", label: "History", icon: "check-circle" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Feather
              name={tab.icon}
              size={16}
              color={activeTab === tab.key ? "#2563eb" : "#64748b"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label} ({getTabCount(tab.key)})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>

      {/* Create Trade Modal */}
      <Modal
        visible={isCreateModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setIsCreateModalVisible(false);
          resetSelection();
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setIsCreateModalVisible(false);
                resetSelection();
              }}
              style={styles.modalCloseButton}
            >
              <Feather name="x" size={24} color="#0f172a" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Trade Offer</Text>
            <View style={styles.modalCloseButton} />
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Your Products Section */}
            <Text style={styles.sectionTitle}>Select Your Product</Text>
            <Text style={styles.sectionDescription}>
              Choose which product you want to trade
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.productsScroll}
            >
              {userProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={[
                    styles.productCard,
                    selectedUserProduct?.id === product.id &&
                      styles.selectedProductCard,
                  ]}
                  onPress={() => setSelectedUserProduct(product)}
                >
                  <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>{product.value}</Text>
                  </View>
                  {selectedUserProduct?.id === product.id && (
                    <View style={styles.selectedBadge}>
                      <Feather name="check" size={16} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Shop Products Section */}
            <Text style={styles.sectionTitle}>Select Product to Receive</Text>
            <Text style={styles.sectionDescription}>
              Choose which product you want in return
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.productsScroll}
            >
              {shopProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={[
                    styles.productCard,
                    selectedShopProduct?.id === product.id &&
                      styles.selectedProductCard,
                  ]}
                  onPress={() => setSelectedShopProduct(product)}
                >
                  <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>{product.price}</Text>
                    <Text style={styles.productShop}>{product.shop}</Text>
                  </View>
                  {selectedShopProduct?.id === product.id && (
                    <View style={styles.selectedBadge}>
                      <Feather name="check" size={16} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Notes Section */}
            <Text style={styles.sectionTitle}>Add Note (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add a message to the shop owner..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
            />

            {/* Trade Summary */}
            {(selectedUserProduct || selectedShopProduct) && (
              <View style={styles.tradeSummary}>
                <Text style={styles.summaryTitle}>Trade Summary</Text>
                <View style={styles.summaryContent}>
                  <View style={styles.summaryItem}>
                    <Image
                      source={{ uri: selectedUserProduct?.image }}
                      style={styles.summaryImage}
                    />
                    <View>
                      <Text style={styles.summaryName}>
                        You give: {selectedUserProduct?.name}
                      </Text>
                      <Text style={styles.summaryValue}>
                        {selectedUserProduct?.value}
                      </Text>
                    </View>
                  </View>

                  <Feather
                    name="repeat"
                    size={20}
                    color="#2563eb"
                    style={styles.summaryIcon}
                  />

                  <View style={styles.summaryItem}>
                    <Image
                      source={{ uri: selectedShopProduct?.image }}
                      style={styles.summaryImage}
                    />
                    <View>
                      <Text style={styles.summaryName}>
                        You get: {selectedShopProduct?.name}
                      </Text>
                      <Text style={styles.summaryValue}>
                        {selectedShopProduct?.price}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[
                styles.createButton,
                (!selectedUserProduct || !selectedShopProduct) &&
                  styles.createButtonDisabled,
              ]}
              onPress={handleCreateTrade}
              disabled={!selectedUserProduct || !selectedShopProduct}
            >
              <Text style={styles.createButtonText}>Create Trade Offer</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "400",
  },
  newTradeButton: {
    backgroundColor: "#2563eb",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginHorizontal: 4,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "#f8fafc",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
    marginLeft: 6,
  },
  activeTabText: {
    color: "#2563eb",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  createTradeButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createTradeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  tradesList: {
    gap: 12,
  },
  tradeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tradeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  shopName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  tradeStatus: {
    fontSize: 12,
    fontWeight: "500",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tradeItems: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  item: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 8,
    fontWeight: "500",
  },
  itemWithImage: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
    marginBottom: 2,
  },
  itemValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb",
  },
  exchangeIcon: {
    marginHorizontal: 12,
  },
  tradeMessage: {
    fontSize: 14,
    color: "#475569",
    fontStyle: "italic",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  declineButton: {
    borderColor: "#fecaca",
    backgroundColor: "#fef2f2",
  },
  declineText: {
    color: "#dc2626",
    fontWeight: "500",
  },
  acceptButton: {
    borderColor: "#bbf7d0",
    backgroundColor: "#f0fdf4",
  },
  acceptText: {
    color: "#059669",
    fontWeight: "500",
  },
  completeButton: {
    borderColor: "#bbf7d0",
    backgroundColor: "#f0fdf4",
  },
  completeText: {
    color: "#059669",
    fontWeight: "500",
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalCloseButton: {
    width: 40,
    alignItems: "flex-start",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
  },
  productsScroll: {
    marginBottom: 24,
  },
  productCard: {
    width: 160,
    marginRight: 12,
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#f1f5f9",
    position: "relative",
  },
  selectedProductCard: {
    borderColor: "#2563eb",
    backgroundColor: "#f0f9ff",
  },
  productImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: 2,
  },
  productShop: {
    fontSize: 12,
    color: "#64748b",
  },
  selectedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#0f172a",
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 24,
  },
  tradeSummary: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 12,
  },
  summaryContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  summaryImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  summaryName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb",
  },
  summaryIcon: {
    marginHorizontal: 16,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  createButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  createButtonDisabled: {
    backgroundColor: "#cbd5e1",
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TradeScreen;