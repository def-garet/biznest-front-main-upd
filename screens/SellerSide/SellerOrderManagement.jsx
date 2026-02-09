import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  StatusBar,
  SafeAreaView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import axiosInstance from '@api/axiosInstance';

const API = `/api/v1/seller/Seller Orders/seller_orders`;

// YOUR CUSTOM PALETTE
const COLORS = {
  primary: '#172d55',    // Deep Blue (Headers, Primary Text)
  secondary: '#2196f3',  // Bright Blue (Buttons, Accents)
  background: '#ffffff', // Pure White (Screen Bg)
  text: '#808080',       // Gray (Body Text)
  
  // UI Helper Colors derived for better UX
  surface: '#f9fbfd',    // Very light blue-gray for background contrast
  white: '#ffffff',
  border: '#eceff1',
  success: '#4caf50',    // Kept for UX status
  danger: '#f44336',     // Kept for UX status
  warning: '#ff9800',    // Kept for UX status
  inputBg: '#f5f7fa',
};

const SellerOrderManagement = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("All");

  // --- MOCK DATA ---
  const [orders, setOrders] = useState([
    {
      id: "ORD-9921",
      status: "Pending",
      order_date: "2025-05-20T10:30:00",
      buyer_info: { f_name: "Maria", l_name: "Clara" },
      product_info: {
        name: "Handwoven Abaca Basket",
        img: "https://images.unsplash.com/photo-1586023492125-27a3ceef34b3?w=300&auto=format&fit=crop&q=60"
      },
      quantity: 2,
      total_price: 360,
      notes: "Please pack this with extra care."
    },
    {
      id: "ORD-9922",
      status: "Accepted",
      order_date: "2025-05-19T14:15:00",
      buyer_info: { f_name: "Jose", l_name: "Rizal" },
      product_info: {
        name: "Premium Barako Coffee",
        img: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300&auto=format&fit=crop&q=60"
      },
      quantity: 1,
      total_price: 350,
      notes: ""
    },
    {
      id: "ORD-9923",
      status: "Shipped",
      order_date: "2025-05-18T09:00:00",
      buyer_info: { f_name: "Andres", l_name: "Bonifacio" },
      product_info: {
        name: "Piaya Original Box",
        img: "https://images.unsplash.com/photo-1555507036-ab794f27d2e9?w=300&auto=format&fit=crop&q=60"
      },
      quantity: 5,
      total_price: 600,
      notes: "Deliver to office address."
    }
  ]);

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedNotes, setEditedNotes] = useState("");

  const fetchOrder = async () => {
    try {
      const response = await axiosInstance.get(API);
      if (response.data && response.data.length > 0) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Using mock data due to error:", error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  useEffect(() => {
    if (activeTab === "All") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(o => o.status === activeTab));
    }
  }, [activeTab, orders]);

  const handleOrderAction = async (order, action) => {
    let updatedStatus = "";
    switch (action) {
      case "accept": updatedStatus = "Accepted"; break;
      case "ship": updatedStatus = "Shipped"; break;
      case "cancel": updatedStatus = "Cancelled"; break;
      default: break;
    }

    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === order.id ? { ...o, status: updatedStatus } : o
      )
    );

    try {
      await axiosInstance.put(API, {
        order_id: order.id,
        status: updatedStatus,
      });
    } catch (error) {
      console.log("Error updating order:", error);
    }
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setEditedNotes(order.notes);
    setIsEditModalVisible(true);
  };

  const renderOrderItem = ({ item }) => {
    // Status Logic for Colors
    const getStatusStyle = (status) => {
      switch(status) {
        case "Pending": return { color: COLORS.warning, bg: '#fff8e1', icon: 'clock' };
        case "Accepted": return { color: COLORS.secondary, bg: '#e3f2fd', icon: 'check-circle' };
        case "Shipped": return { color: COLORS.success, bg: '#e8f5e9', icon: 'truck' };
        case "Cancelled": return { color: COLORS.danger, bg: '#ffebee', icon: 'x-circle' };
        default: return { color: COLORS.text, bg: '#f5f5f5', icon: 'help-circle' };
      }
    };
    const statusMeta = getStatusStyle(item.status || "Pending");

    return (
      <View style={styles.orderCard}>
        {/* Card Header: Order ID & Date */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderIdLabel}>ORDER ID</Text>
            <Text style={styles.orderIdText}>#{item.id}</Text>
          </View>
          <Text style={styles.orderDate}>
            {new Date(item.order_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Product Section */}
        <View style={styles.productSection}>
          <Image source={{ uri: item.product_info?.img }} style={styles.productImage} />
          <View style={styles.productDetails}>
            <Text style={styles.productName} numberOfLines={1}>{item.product_info?.name}</Text>
            <View style={styles.buyerRow}>
              <Feather name="user" size={12} color={COLORS.text} />
              <Text style={styles.buyerName}>
                {item.buyer_info?.f_name} {item.buyer_info?.l_name}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.quantityBadge}>x{item.quantity}</Text>
              <Text style={styles.totalPrice}>₱{(item.total_price ?? 0).toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Notes (if any) */}
        {item.notes ? (
          <View style={styles.noteContainer}>
            <Feather name="message-square" size={12} color={COLORS.text} style={{marginTop: 2}} />
            <Text style={styles.noteText} numberOfLines={2}>"{item.notes}"</Text>
          </View>
        ) : null}

        <View style={styles.divider} />

        {/* Footer: Status & Actions */}
        <View style={styles.cardFooter}>
          <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
            <Feather name={statusMeta.icon} size={12} color={statusMeta.color} style={{ marginRight: 4 }} />
            <Text style={[styles.statusText, { color: statusMeta.color }]}>{item.status}</Text>
          </View>

          {/* Dynamic Buttons based on status */}
          <View style={styles.actionRow}>
            {(item.status === "Pending" || item.status === null) && (
              <>
                <TouchableOpacity style={styles.btnOutline} onPress={() => handleOrderAction(item, "cancel")}>
                  <Text style={styles.btnTextOutline}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPrimary} onPress={() => handleOrderAction(item, "accept")}>
                  <Text style={styles.btnTextPrimary}>Accept</Text>
                </TouchableOpacity>
              </>
            )}

            {item.status === "Accepted" && (
              <>
                <TouchableOpacity style={styles.btnOutline} onPress={() => openEditModal(item)}>
                  <Feather name="edit-2" size={14} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSecondary} onPress={() => handleOrderAction(item, "ship")}>
                  <Text style={styles.btnTextPrimary}>Ship Order</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Management</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Feather name="search" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['All', 'Pending', 'Accepted', 'Shipped'].map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Order List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={60} color={COLORS.text} />
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />

      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Customer Note</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Feather name="x" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.modalInput}
              multiline
              value={editedNotes}
              onChangeText={setEditedNotes}
              placeholder="Enter note here..."
              placeholderTextColor={COLORS.text}
            />

            <TouchableOpacity style={styles.modalSaveBtn} onPress={() => setIsEditModalVisible(false)}>
              <Text style={styles.modalSaveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface, // Subtle contrast background
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  backBtn: {
    padding: 4,
  },
  searchBtn: {
    padding: 4,
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.background,
  },
  tab: {
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: '600',
  },

  // List
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    // Modern Shadow
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIdLabel: {
    fontSize: 10,
    color: COLORS.text,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  orderIdText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  
  // Product Section
  productSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: COLORS.inputBg,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'space-between',
    height: 64,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  buyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  buyerName: {
    fontSize: 12,
    color: COLORS.text,
    marginLeft: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityBadge: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.secondary,
  },

  // Note
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff8e1', // Light yellow for note
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  noteText: {
    fontSize: 12,
    color: '#f57f17', // Darker yellow/orange
    flex: 1,
    fontStyle: 'italic',
  },

  // Footer & Actions
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btnOutline: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  btnTextOutline: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  btnPrimary: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  btnSecondary: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.secondary,
  },
  btnTextPrimary: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.white,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  modalInput: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    padding: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 24,
  },
  modalSaveBtn: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalSaveText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 14,
    marginTop: 12,
  },
});

export default SellerOrderManagement;