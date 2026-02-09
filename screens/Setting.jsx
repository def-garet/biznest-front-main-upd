// import { View, Text, TouchableOpacity, ScrollView } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import React, { useContext } from "react";
// import { AuthContext } from "../auth/AuthContext";
// import { MaterialIcons } from "@expo/vector-icons";

// const Setting = ({ navigation }) => {
//   const { logout, user } = useContext(AuthContext);

//   // Account Settings
//   const accountItems = [
//     { icon: "person-outline", text: "Edit Profile", action: () => navigation.navigate("EditProfile") },
//     { icon: "security", text: "Account Security", action: () => console.log("Security") },
//     { icon: "notifications-none", text: "Notifications", action: () => navigation.navigate("Notifications") },
//     { icon: "lock-outline", text: "Privacy", action: () => console.log("Privacy") },
//     { icon: "location-pin", text: "My Address", action: () => navigation.navigate("MyAddress") },
//   ];

//   // Seller Management Items (only visible if user is a seller)
//   const sellerItems = [
//     { icon: "store", text: "Seller Dashboard", action: () => navigation.navigate("SellerDashboard") },
//     { icon: "list-alt", text: "Order Management", action: () => navigation.navigate("SellerOrderManagement") },
//     { icon: "inventory", text: "Product Management", action: () => navigation.navigate("ProductManagement") },
//     { icon: "swap-horiz", text: "Trade Management", action: () => navigation.navigate("SellerTradeManagementScreen") },
//     { icon: "analytics", text: "Sales Reports", action: () => navigation.navigate("SalesReports") },
//     { icon: "chat", text: "Seller Chat", action: () => navigation.navigate("SellerChat") }, // Added Seller Chat
//   ];

//   // Support Items
//   const supportItems = [
//     { icon: "credit-card", text: "My Wallet", action: () => console.log("Wallet") },
//     { icon: "help-outline", text: "Help & Support", action: () => navigation.navigate("CustomerService") },
//     { icon: "info-outline", text: "Terms", action: () => console.log("Terms") },
//     { icon: "outlined-flag", text: "Report", action: () => console.log("Report") },
//     { icon: "people-outline", text: "Add Account", action: () => console.log("Add Account") },
//     { icon: "logout", text: "Log Out", action: async () => { await logout(); navigation.navigate("Home"); }},
//   ];

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
//       <View style={{ 
//         flexDirection: "row", 
//         justifyContent: "center", 
//         alignItems: "center",
//         padding: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: "#f0f0f0"
//       }}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()}
//           style={{ position: "absolute", left: 16 }}
//         >
//           <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={{ fontSize: 18, fontWeight: "bold" }}>Settings</Text>
//       </View>

//       <ScrollView>
//         {/* Account Settings */}
//         <View style={{ paddingVertical: 8 }}>
//           <Text style={{ 
//             fontSize: 14,
//             fontWeight: "500",
//             color: "#666",
//             paddingHorizontal: 16,
//             paddingVertical: 8
//           }}>
//             ACCOUNT
//           </Text>
//           {accountItems.map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               onPress={item.action}
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 paddingVertical: 14,
//                 paddingHorizontal: 16,
//                 borderBottomWidth: index === accountItems.length - 1 ? 0 : 1,
//                 borderBottomColor: "#f5f5f5"
//               }}
//             >
//               <MaterialIcons name={item.icon} size={22} color="#333" />
//               <Text style={{ 
//                 marginLeft: 12, 
//                 fontSize: 16, 
//                 color: "#333",
//                 flex: 1 
//               }}>
//                 {item.text}
//               </Text>
//               <MaterialIcons name="chevron-right" size={20} color="#999" />
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Seller Management (only shown if user is a seller) */}
//         {/* {user?.isSeller && ( */}
//           <View style={{ paddingVertical: 8 }}>
//             <Text style={{ 
//               fontSize: 14,
//               fontWeight: "500",
//               color: "#666",
//               paddingHorizontal: 16,
//               paddingVertical: 8
//             }}>
//               SELLER MANAGEMENT
//             </Text>
//             {sellerItems.map((item, index) => (
//               <TouchableOpacity
//                 key={index}
//                 onPress={item.action}
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   paddingVertical: 14,
//                   paddingHorizontal: 16,
//                   borderBottomWidth: index === sellerItems.length - 1 ? 0 : 1,
//                   borderBottomColor: "#f5f5f5"
//                 }}
//               >
//                 <MaterialIcons name={item.icon} size={22} color="#333" />
//                 <Text style={{ 
//                   marginLeft: 12, 
//                   fontSize: 16, 
//                   color: "#333",
//                   flex: 1 
//                 }}>
//                   {item.text}
//                 </Text>
//                 <MaterialIcons name="chevron-right" size={20} color="#999" />
//               </TouchableOpacity>
//             ))}
//           </View>
//         {/* )} */}

//         {/* Support and About */}
//         <View style={{ paddingVertical: 8 }}>
//           <Text style={{ 
//             fontSize: 14,
//             fontWeight: "500",
//             color: "#666",
//             paddingHorizontal: 16,
//             paddingVertical: 8
//           }}>
//             SUPPORT
//           </Text>
//           {supportItems.map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               onPress={item.action}
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 paddingVertical: 14,
//                 paddingHorizontal: 16,
//                 borderBottomWidth: index === supportItems.length - 1 ? 0 : 1,
//                 borderBottomColor: "#f5f5f5"
//               }}
//             >
//               <MaterialIcons name={item.icon} size={22} color="#333" />
//               <Text style={{ 
//                 marginLeft: 12, 
//                 fontSize: 16, 
//                 color: "#333",
//                 flex: 1 
//               }}>
//                 {item.text}
//               </Text>
//               <MaterialIcons name="chevron-right" size={20} color="#999" />
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Setting;

import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";

// --- MODERN ICON CONFIGURATION ---
const ACCOUNT_ITEMS = [
  { icon: "person-outline", text: "Edit Profile", bgColor: "#E8F4FF", iconColor: "#1890FF", action: (nav) => nav.navigate("EditProfile") },
  { icon: "security", text: "Account Security", bgColor: "#F6FFED", iconColor: "#52C41A", action: (nav) => nav.navigate("SellerHome") },
  { icon: "notifications-none", text: "Notifications", bgColor: "#FFF1F0", iconColor: "#FF4D4F", action: (nav) => nav.navigate("Notifications") },
  { icon: "lock-outline", text: "Privacy", bgColor: "#F9F0FF", iconColor: "#722ED1", action: () => console.log("Privacy") },
  { icon: "location-pin", text: "My Address", bgColor: "#FFF7E6", iconColor: "#FA8C16", action: (nav) => nav.navigate("MyAddress") },
];

const SELLER_ITEMS = [
  { icon: "storefront", text: "Seller Dashboard", bgColor: "#E6FFFB", iconColor: "#13C2C2", action: (nav) => nav.navigate("SellerDashboard") },
  { icon: "list-alt", text: "Order Management", bgColor: "#FFF2E8", iconColor: "#FA541C", action: (nav) => nav.navigate("SellerOrderManagement") },
  { icon: "inventory", text: "Product Management", bgColor: "#F0F5FF", iconColor: "#2F54EB", action: (nav) => nav.navigate("ProductManagement") },
  { icon: "swap-horiz", text: "Trade Management", bgColor: "#FCFFE6", iconColor: "#A0D911", action: (nav) => nav.navigate("SellerTradeManagementScreen") },
  { icon: "analytics", text: "Sales Reports", bgColor: "#FFF0F6", iconColor: "#EB2F96", action: (nav) => nav.navigate("SalesReports") },
  { icon: "chat", text: "Seller Chat", bgColor: "#E8F4FF", iconColor: "#1890FF", action: (nav) => nav.navigate("SellerChat") },
];

const SUPPORT_ITEMS = [
  { icon: "credit-card", text: "My Wallet", bgColor: "#F6FFED", iconColor: "#52C41A", action: () => console.log("Wallet") },
  { icon: "help-outline", text: "Help & Support", bgColor: "#E8F4FF", iconColor: "#1890FF", action: (nav) => nav.navigate("CustomerService") },
  { icon: "info-outline", text: "Terms & Policies", bgColor: "#F5F5F5", iconColor: "#595959", action: () => console.log("Terms") },
  { icon: "flag", text: "Report an Issue", bgColor: "#FFF1F0", iconColor: "#FF4D4F", action: () => console.log("Report") },
];

const Setting = ({ navigation }) => {
  const { logout, user } = useContext(AuthContext);
  
  // Update this to your actual logic: e.g., sysRoles?.includes("seller")
  const isSeller = true; 

  const handleLogout = async () => {
    await logout();
    navigation.navigate("Home");
  };

  // Helper component for rows
  const SettingRow = ({ item, isLast }) => (
    <TouchableOpacity 
      style={[styles.row, isLast && styles.lastRow]} 
      onPress={() => item.action(navigation)}
      activeOpacity={0.6}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
        <MaterialIcons name={item.icon} size={20} color={item.iconColor} />
      </View>
      <Text style={styles.rowText}>{item.text}</Text>
      <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* 1. Seamless White Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        
        {/* 2. Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account</Text>
          {ACCOUNT_ITEMS.map((item, index) => (
            <SettingRow key={index} item={item} isLast={index === ACCOUNT_ITEMS.length - 1} />
          ))}
        </View>

        {/* 3. Seller Management Section */}
        {isSeller && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Seller Management</Text>
            {SELLER_ITEMS.map((item, index) => (
              <SettingRow key={index} item={item} isLast={index === SELLER_ITEMS.length - 1} />
            ))}
          </View>
        )}

        {/* 4. Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Support & About</Text>
          {SUPPORT_ITEMS.map((item, index) => (
            <SettingRow key={index} item={item} isLast={index === SUPPORT_ITEMS.length - 1} />
          ))}
        </View>

        {/* 5. Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="person-add-outline" size={20} color="#1e293b" />
            <Text style={[styles.actionBtnText, { color: '#1e293b' }]}>Add Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, { borderColor: '#fecaca', backgroundColor: '#fff1f2' }]} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color="#ef4444" />
            <Text style={[styles.actionBtnText, { color: '#ef4444' }]}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>BIZNest v1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff', // Pure white background
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },

  // Section styling
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  
  // Row styling without heavy borders
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9", // Ultra light dividing line
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18, // Perfectly round icons
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  rowText: {
    flex: 1,
    fontSize: 15,
    color: "#334155",
    fontWeight: "500",
  },

  // Action Buttons
  actionContainer: {
    marginTop: 40,
    marginHorizontal: 20,
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    gap: 8,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },

  // Footer
  versionText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 30,
    marginBottom: 40,
  },
});

export default Setting;