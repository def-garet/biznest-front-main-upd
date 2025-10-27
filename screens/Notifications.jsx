import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Animated,
} from "react-native";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome,
  Entypo,
} from "@expo/vector-icons";
import { COLORS } from "../style/theme";

const notifications = [
  {
    id: "1",
    type: "promotion",
    title: "Flash Sale!",
    message: "Get 50% off on all items until midnight!",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "update",
    title: "BIZnest Update",
    message: "We've introduced new features for better experience.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "3",
    type: "reminder",
    title: "Don't forget!",
    message: "Complete your profile to start selling.",
    time: "3 days ago",
    read: true,
  },
]; 

const orderUpdates = [
  {
    id: "4",
    title: "Parcel Delivered",
    message: "Parcel BZ12345 for your order has been delivered.",
    time: "Just now",
    read: false,
  },
  {
    id: "5",
    title: "Order Shipped",
    message: "Your order BZ67890 is on the way. Track it now!",
    time: "Yesterday",
    read: true,
  },
  {
    id: "6",
    title: "Payment Received",
    message: "We've received your payment for order BZ45678.",
    time: "2 days ago",
    read: true,
  },
];

const Notifications = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount] = useState(
    notifications.filter((n) => !n.read).length +
      orderUpdates.filter((o) => !o.read).length
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getIconForType = (type) => {
    switch (type) {
      case "promotion":
        return <FontAwesome name="tag" size={18} color={COLORS.primary} />;
      case "update":
        return <Entypo name="megaphone" size={18} color="#4CAF50" />;
      case "reminder":
        return <MaterialIcons name="alarm" size={18} color="#FF9800" />;
      default:
        return (
          <MaterialIcons
            name="notifications"
            size={18}
            color={COLORS.primary}
          />
        );
    }
  };

  const handleNotificationPress = (item) => {
    // Mark as read when pressed
    console.log("Notification pressed:", item.id);
    // Add your navigation logic here if needed
  };

  const handleSettingsPress = () => {
    console.log("Settings pressed");
    // Navigate to settings screen
    // navigation.navigate('NotificationSettings');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Enhanced Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.header}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSettingsPress}
          style={styles.settingsButton}
          activeOpacity={0.7}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <MaterialIcons name="more-vert" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
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
        {/* General Notifications */}
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>General</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {notifications.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.notificationItem,
              !item.read && styles.unreadNotification,
            ]}
            onPress={() => handleNotificationPress(item)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: !item.read
                    ? "rgba(0, 122, 255, 0.1)"
                    : "#f5f5f5",
                },
              ]}
            >
              {getIconForType(item.type)}
            </View>
            <View style={styles.textContainer}>
              <View style={styles.titleContainer}>
                <Text
                  style={[styles.title, !item.read && { fontWeight: "600" }]}
                >
                  {item.title}
                </Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.message}>{item.message}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Order Updates */}
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>Order Updates</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {orderUpdates.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.orderItem, !item.read && styles.unreadNotification]}
            onPress={() => handleNotificationPress(item)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: !item.read
                    ? "rgba(0, 122, 255, 0.1)"
                    : "#f5f5f5",
                },
              ]}
            >
              <MaterialIcons
                name={
                  item.title.includes("Delivered")
                    ? "check-circle"
                    : "local-shipping"
                }
                size={18}
                color={
                  item.title.includes("Delivered") ? "#4CAF50" : COLORS.primary
                }
              />
            </View>
            <View style={styles.textContainer}>
              <View style={styles.titleContainer}>
                <Text
                  style={[styles.title, !item.read && { fontWeight: "600" }]}
                >
                  {item.title}
                </Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.message}>{item.message}</Text>
              {item.title.includes("Shipped") && (
                <TouchableOpacity
                  style={styles.trackButton}
                  onPress={() => navigation.navigate("OrderTracking")}
                >
                  <Text style={styles.trackButtonText}>Track Order</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 4,
  },
  settingsButton: {
    padding: 4,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#757575",
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  unreadNotification: {
    backgroundColor: "#f5f9ff",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: "#212121",
    flex: 1,
  },
  message: {
    fontSize: 13,
    color: "#616161",
    marginBottom: 4,
    lineHeight: 18,
  },
  time: {
    fontSize: 12,
    color: "#9e9e9e",
    marginLeft: 8,
  },
  trackButton: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  trackButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "500",
  },
});

export default Notifications;
