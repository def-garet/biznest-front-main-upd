import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

const OrderTracking = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState("ongoing");
  
  // Sample order data with Molo Mansion product
  const orders = {
    ongoing: [
      {
        id: "BN-2025-8765",
        store: "Molo Mansion",
        status: "To Receive",
        date: "Aug 18, 2025",
        items: 1,
        total: 760.00,
        estimatedDelivery: "Aug 20-22",
        tracking: [
          { id: 1, status: "Order Placed", date: "Aug 18", completed: true, time: "10:30 AM" },
          { id: 2, status: "Processed", date: "Aug 18", completed: true, time: "2:15 PM" },
          { id: 3, status: "Shipped", date: "Aug 19", completed: true, time: "9:45 AM" },
          { id: 4, status: "Out for Delivery", date: "Aug 20", completed: false, time: "Expected by 5 PM" },
          { id: 5, status: "Delivered", date: "", completed: false, time: "" },
        ],
        items: [
          { 
            name: "Assorted Tarts", 
            price: 30.00, 
            quantity: 5, 
            image: { uri: "https://anec.global/cdn/shop/products/Untitleddesign_30_7a6265bd-6a8b-4a2a-9791-6e3fd4a58c39_grande.png?v=1645164662" } 
          }
        ],
        deliveryAddress: "123 Business Street, Makati City, Metro Manila",
        paymentMethod: "Credit Card (•••• 4567)"
      }
    ],
    completed: [
      {
        id: "BN-2025-6543",
        store: "Cabayogan Weavers",
        status: "delivered",
        date: "Sep 28, 2025",
        items: 3,
        total: 3750.50,
        items: [
          { 
            name: "Shell Home Decor", 
            price: 800.00, 
            quantity: 1, 
            image: { uri: "https://anec.global/cdn/shop/products/275911656_416814450249589_2180825728258401622_n_grande.jpg?v=1648218361" } 
          },
          { 
            name: "Cabayogan Women Loom Weavers Association Hblon Fabric", 
            price: 350.00, 
            quantity: 2, 
            image: { uri: "https://likhaan.com/cdn/shop/files/cabayogan-women-loom-weavers-association-iloilo-hablon-weaving-textile-fabric-barong-cotton-abaca-pina-hiligaynon-colors-colorful-prints-patadyong-skirt-malong-wraparound-patterns.jpg?v=1710253094&width=1946" } 
          }
        ]
      }
    ],
    cancelled: [
      {
        id: "BN-2025-3210",
        store: "Fashion Hub",
        status: "cancelled",
        date: "Aug 5, 2025",
        items: 1,
        total: 899.00,
        items: [
          { 
            name: "Nito Lampshade for home decors", 
            price: 899.00, 
            quantity: 1, 
            image: { uri: "https://anec.global/cdn/shop/products/015eea547fb8d43d446dad83a1a415e8.jpg?v=1641880813" } 
          }
        ],
        cancellationReason: "Out of stock"
      }
    ]
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case "shipped": 
      case "to receive": 
        return "#2196F3";
      case "delivered": 
        return "#4CAF50";
      case "cancelled": 
        return "#F44336";
      default: 
        return "#FF9800";
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case "shipped": 
      case "to receive": 
        return "local-shipping";
      case "delivered": 
        return "check-circle";
      case "cancelled": 
        return "cancel";
      default: 
        return "hourglass-empty";
    }
  };

  const handleTrackPackage = (orderId) => {
    navigation.navigate('OrderTracking', { orderId });
  };

  const handleContactSeller = () => {
    // Implement contact seller functionality
  };

  const handleCancelOrder = () => {
    // Implement cancel order functionality
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with solid color */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <TouchableOpacity>
          <MaterialIcons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Order Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "ongoing" && styles.activeTab]}
          onPress={() => setActiveTab("ongoing")}
        >
          <Text style={[styles.tabText, activeTab === "ongoing" && styles.activeTabText]}>Ongoing</Text>
          {activeTab === "ongoing" && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "completed" && styles.activeTab]}
          onPress={() => setActiveTab("completed")}
        >
          <Text style={[styles.tabText, activeTab === "completed" && styles.activeTabText]}>Completed</Text>
          {activeTab === "completed" && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "cancelled" && styles.activeTab]}
          onPress={() => setActiveTab("cancelled")}
        >
          <Text style={[styles.tabText, activeTab === "cancelled" && styles.activeTabText]}>Cancelled</Text>
          {activeTab === "cancelled" && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {orders[activeTab].length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="remove-shopping-cart" size={60} color="#808080" />
            <Text style={styles.emptyTitle}>No {activeTab} orders</Text>
            <Text style={styles.emptySubtitle}>You don't have any {activeTab} orders at this time</Text>
            <TouchableOpacity 
              style={styles.shopButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.shopButtonText}>Browse Products</Text>
            </TouchableOpacity>
          </View>
        ) : (
          orders[activeTab].map((order) => (
            <View key={order.id} style={styles.orderCard}>
              {/* Order Header */}
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>Order #{order.id}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                  {order.store && (
                    <View style={styles.storeContainer}>
                      <FontAwesome5 name="store" size={10} color="b#172d55" />
                      <Text style={styles.storeName}> {order.store}</Text>
                    </View>
                  )}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                  <MaterialIcons name={getStatusIcon(order.status)} size={16} color="white" />
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>

              {/* Order Items */}
              {order.items && order.items.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <Image source={item.image} style={styles.itemImage} />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>₱{item.price.toFixed(2)}</Text>
                    <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                  </View>
                </View>
              ))}

              {/* Additional Order Info */}
              {order.deliveryAddress && (
                <View style={styles.infoContainer}>
                  <MaterialIcons name="location-on" size={18} color="#172d55" />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Delivery Address</Text>
                    <Text style={styles.infoValue}>{order.deliveryAddress}</Text>
                  </View>
                </View>
              )}

              {order.paymentMethod && (
                <View style={styles.infoContainer}>
                  <MaterialIcons name="payment" size={18} color="#172d55" />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Payment Method</Text>
                    <Text style={styles.infoValue}>{order.paymentMethod}</Text>
                  </View>
                </View>
              )}

              {order.cancellationReason && (
                <View style={styles.infoContainer}>
                  <MaterialIcons name="info-outline" size={18} color="#F44336" />
                  <View style={styles.infoTextContainer}>
                    <Text style={[styles.infoLabel, { color: '#F44336' }]}>Cancellation Reason</Text>
                    <Text style={[styles.infoValue, { color: '#F44336' }]}>{order.cancellationReason}</Text>
                  </View>
                </View>
              )}

              {/* Order Summary */}
              <View style={styles.summaryContainer}>
                {order.estimatedDelivery && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Estimated Delivery</Text>
                    <Text style={[styles.summaryValue, { color: '#2196F3' }]}>{order.estimatedDelivery}</Text>
                  </View>
                )}
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>₱{order.total.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Shipping Fee</Text>
                  <Text style={styles.summaryValue}>₱0.00</Text>
                </View>
                <View style={[styles.summaryRow, { marginTop: 8 }]}>
                  <Text style={styles.summaryTotalLabel}>Total</Text>
                  <Text style={styles.summaryTotalValue}>₱{order.total.toFixed(2)}</Text>
                </View>
              </View>

              {/* Tracking Progress (for ongoing orders) */}
              {activeTab === "ongoing" && order.tracking && (
                <View style={styles.trackingContainer}>
                  <Text style={styles.trackingTitle}>Order Status</Text>
                  <View style={styles.timelineContainer}>
                    {order.tracking.map((step, index) => (
                      <View key={step.id} style={styles.stepContainer}>
                        <View style={styles.stepIndicatorContainer}>
                          <View style={[
                            styles.stepIndicator,
                            step.completed ? { backgroundColor: "#4CAF50" } : { borderColor: "#808080" }
                          ]}>
                            {step.completed && <MaterialIcons name="check" size={12} color="white" />}
                          </View>
                          {index !== order.tracking.length - 1 && (
                            <View style={[
                              styles.stepConnector,
                              step.completed ? { backgroundColor: "#4CAF50" } : {}
                            ]} />
                          )}
                        </View>
                        <View style={styles.stepDetails}>
                          <Text style={[
                            styles.stepStatus,
                            step.completed ? { color: '#172d55' } : { color: '#808080' }
                          ]}>
                            {step.status}
                          </Text>
                          <Text style={styles.stepDate}>{step.date} {step.time && `• ${step.time}`}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionContainer}>
                {activeTab === "ongoing" && (
                  <>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.secondaryButton]}
                      onPress={handleContactSeller}
                    >
                      <MaterialIcons name="chat" size={18} color="#172d55" />
                      <Text style={styles.secondaryButtonText}>Contact Seller</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.primaryButton]}
                      onPress={() => handleTrackPackage(order.id)}
                    >
                      <MaterialIcons name="local-shipping" size={18} color="white" />
                      <Text style={styles.primaryButtonText}>Track Package</Text>
                    </TouchableOpacity>
                  </>
                )}
                {activeTab === "completed" && (
                  <>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.secondaryButton]}
                      onPress={handleContactSeller}
                    >
                      <MaterialIcons name="rate-review" size={18} color="#172d55" />
                      <Text style={styles.secondaryButtonText}>Leave Review</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.primaryButton]}
                      onPress={() => console.log("Reorder")}
                    >
                      <MaterialIcons name="replay" size={18} color="white" />
                      <Text style={styles.primaryButtonText}>Reorder</Text>
                    </TouchableOpacity>
                  </>
                )}
                {activeTab === "cancelled" && (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.primaryButton, { flex: 1 }]}
                    onPress={() => console.log("Buy Again")}
                  >
                    <MaterialIcons name="shopping-cart" size={18} color="white" />
                    <Text style={styles.primaryButtonText}>Buy Again</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    backgroundColor: '#172d55',
    elevation: 4,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: '#f0f5ff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#808080',
  },
  activeTabText: {
    color: '#172d55',
    fontWeight: '600',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '60%',
    backgroundColor: '#172d55',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#172d55',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#808080',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  shopButton: {
    backgroundColor: '#172d55',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 2,
  },
  shopButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#172d55',
  },
  orderDate: {
    fontSize: 12,
    color: '#808080',
    marginTop: 4,
  },
  storeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  storeName: {
    fontSize: 14,
    color: '#172d55',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
    textTransform: 'capitalize',
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 8,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    color: '#172d55',
    marginBottom: 4,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#172d55',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#808080',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#808080',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#172d55',
    fontWeight: '500',
  },
  summaryContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#808080',
  },
  summaryValue: {
    fontSize: 14,
    color: '#172d55',
    fontWeight: '500',
  },
  summaryTotalLabel: {
    fontSize: 15,
    color: '#172d55',
    fontWeight: '600',
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#172d55',
  },
  trackingContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  trackingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#172d55',
    marginBottom: 16,
  },
  timelineContainer: {
    paddingLeft: 8,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepIndicatorContainer: {
    alignItems: 'center',
    width: 24,
    marginRight: 12,
  },
  stepIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    zIndex: 1,
  },
  stepConnector: {
    width: 2,
    height: 40,
    backgroundColor: '#e0e0e0',
    position: 'absolute',
    top: 20,
    left: 9,
  },
  stepDetails: {
    flex: 1,
  },
  stepStatus: {
    fontSize: 14,
    color: '#172d55',
    marginBottom: 4,
    fontWeight: '500',
  },
  stepDate: {
    fontSize: 12,
    color: '#808080',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: '#172d55',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 8,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#172d55',
  },
  secondaryButtonText: {
    color: '#172d55',
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default OrderTracking;