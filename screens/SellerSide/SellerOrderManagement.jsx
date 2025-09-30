import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

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
};

const SellerOrderManagement = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([
    {
      id: "1",
      customer: "Si Ano",
      status: "Pending",
      items: [
        {
          id: "1",
          name: "Hablon Wallet",
          price: 210,
          quantity: 2,
          image: { uri: "https://i0.wp.com/www.mycitymysm.com/wp-content/uploads/2021/07/my-city-my-sm-my-craft-iloilo-26.jpg?fit=1600%2C1063&ssl=1" },
        },
        {
          id: "2",
          name: "Cashew Nuts",
          price: 50,
          quantity: 3,
          image: { uri: "https://anec.global/cdn/shop/products/Untitleddesign_2_8ee7fbd5-4324-4a5c-815a-5c53f1b6092c_grande.png?v=1644579019" },
        },
      ],
      total: 570,
      date: "2025-08-15",
      address: "Manila City",
      contact: "09123456789",
      notes: "Please pack it carefully",
    },
    {
      id: "2",
      customer: "Hello World",
      status: "Accepted",
      items: [
        {
          id: "3",
          name: "Barako Coffee Beans",
          price: 350,
          quantity: 1,
          image: { uri: "https://i0.wp.com/lostboy.blog/wp-content/uploads/2017/07/fb_img_1500417649033.jpg?ssl=1" },
        },
      ],
      total: 350,
      date: "2025-08-16",
      address: " Iloilo City",
      contact: "09234567890",
      notes: "",
    },
    {
      id: "3",
      customer: "Jo jowanaaa",
      status: "Shipped",
      items: [
        {
          id: "4",
          name: "Piaya Original",
          price: 45,
          quantity: 10,
          image: { uri: "https://anec.global/cdn/shop/products/Untitleddesign_27_02371ddb-c443-485b-86d2-290f96cdb8f3.png?v=1645853439" },
        },
        {
          id: "5",
          name: "Pinasugbo",
          price: 120,
          quantity: 2,
          image: { uri: "https://anec.global/cdn/shop/products/product_9dc08a7f-1b96-4133-8bcf-349d0ed8f49a_grande.png?v=1659940486" },
        },
      ],
      total: 690,
      date: "2025-08-14",
      address: " Iloilo City",
      contact: "09345678901",
      notes: "Deliver after 5pm",
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [editedItems, setEditedItems] = useState([]);
  const [editedNotes, setEditedNotes] = useState("");

  const handleOrderAction = (order, action) => {
    let updatedOrders = [...orders];
    const index = updatedOrders.findIndex((o) => o.id === order.id);

    switch (action) {
      case "accept":
        updatedOrders[index].status = "Accepted";
        break;
      case "ship":
        updatedOrders[index].status = "Shipped";
        break;
      case "cancel":
        updatedOrders[index].status = "Cancelled";
        break;
      default:
        break;
    }

    setOrders(updatedOrders);
    setIsActionModalVisible(false);
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setEditedItems([...order.items]);
    setEditedNotes(order.notes);
    setIsEditModalVisible(true);
  };

  const saveEditedOrder = () => {
    let updatedOrders = [...orders];
    const index = updatedOrders.findIndex((o) => o.id === selectedOrder.id);

    updatedOrders[index].items = editedItems;
    updatedOrders[index].notes = editedNotes;

    setOrders(updatedOrders);
    setIsEditModalVisible(false);
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedItems = editedItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    setEditedItems(updatedItems);
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <Text
          style={[
            styles.orderStatus,
            item.status === "Pending" && styles.statusPending,
            item.status === "Accepted" && styles.statusAccepted,
            item.status === "Shipped" && styles.statusShipped,
            item.status === "Cancelled" && styles.statusCancelled,
          ]}
        >
          {item.status}
        </Text>
      </View>

      <Text style={styles.customerName}>{item.customer}</Text>
      <Text style={styles.orderDate}>Placed on: {item.date}</Text>

      <View style={styles.itemsContainer}>
        {item.items.map((product) => (
          <View key={product.id} style={styles.productItem}>
            <Image source={product.image} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>
                x{product.quantity} at ₱{product.price.toLocaleString()}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>
          Total: ₱{item.total.toLocaleString()}
        </Text>

        <View style={styles.actionButtons}>
          {item.status === "Pending" && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => handleOrderAction(item, "accept")}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => handleOrderAction(item, "cancel")}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}

          {item.status === "Accepted" && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => openEditModal(item)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.shipButton]}
                onPress={() => handleOrderAction(item, "ship")}
              >
                <Text style={styles.buttonText}>Ship</Text>
              </TouchableOpacity>
            </>
          )}

          {item.status === "Shipped" && (
            <Text style={styles.completedText}>Order completed</Text>
          )}

          {item.status === "Cancelled" && (
            <Text style={styles.cancelledText}>Order cancelled</Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Management</Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Edit Order Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Edit Order #{selectedOrder?.id}
            </Text>

            <Text style={styles.sectionTitle}>Items:</Text>
            {editedItems.map((item) => (
              <View key={item.id} style={styles.editItemRow}>
                <Image source={item.image} style={styles.editItemImage} />
                <Text style={styles.editItemName}>{item.name}</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() =>
                      updateItemQuantity(item.id, item.quantity - 1)
                    }
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() =>
                      updateItemQuantity(item.id, item.quantity + 1)
                    }
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.editItemPrice}>
                  ₱{(item.price * item.quantity).toLocaleString()}
                </Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>Customer Notes:</Text>
            <TextInput
              style={styles.notesInput}
              multiline
              value={editedNotes}
              onChangeText={setEditedNotes}
              placeholder="Add any notes from the customer..."
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveModalButton]}
                onPress={saveEditedOrder}
              >
                <Text style={styles.modalButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 24,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
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
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: COLORS.warningLight,
    color: COLORS.warning,
  },
  statusAccepted: {
    backgroundColor: COLORS.infoLight,
    color: COLORS.info,
  },
  statusShipped: {
    backgroundColor: COLORS.successLight,
    color: COLORS.success,
  },
  statusCancelled: {
    backgroundColor: COLORS.errorLight,
    color: COLORS.error,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 12,
  },
  itemsContainer: {
    marginBottom: 12,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  productPrice: {
    fontSize: 14,
    color: COLORS.text,
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 12,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 12,
    textAlign: "right",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 4,
  },
  acceptButton: {
    backgroundColor: COLORS.success,
  },
  editButton: {
    backgroundColor: COLORS.info,
  },
  shipButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    backgroundColor: COLORS.error,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "500",
  },
  completedText: {
    color: COLORS.success,
    fontWeight: "500",
    textAlign: "center",
    flex: 1,
  },
  cancelledText: {
    color: COLORS.error,
    fontWeight: "500",
    textAlign: "center",
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  editItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  editItemImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 10,
  },
  editItemName: {
    flex: 2,
    fontSize: 14,
    color: COLORS.darkGray,
    marginLeft: 10,
  },
  quantityControls: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginHorizontal: 8,
  },
  editItemPrice: {
    flex: 1,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.primary,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 6,
    padding: 10,
    minHeight: 80,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 8,
  },
  cancelModalButton: {
    backgroundColor: COLORS.errorLight,
  },
  saveModalButton: {
    backgroundColor: COLORS.success,
  },
  modalButtonText: {
    fontWeight: "500",
  },
});

export default SellerOrderManagement;
