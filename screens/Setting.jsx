import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";

const Setting = ({ navigation }) => {
  const { logout, user } = useContext(AuthContext);

  // Account Settings
  const accountItems = [
    { icon: "person-outline", text: "Edit Profile", action: () => navigation.navigate("EditProfile") },
    { icon: "security", text: "Account Security", action: () => console.log("Security") },
    { icon: "notifications-none", text: "Notifications", action: () => navigation.navigate("Notifications") },
    { icon: "lock-outline", text: "Privacy", action: () => console.log("Privacy") },
    { icon: "location-pin", text: "My Address", action: () => navigation.navigate("MyAddress") },
  ];

  // Seller Management Items (only visible if user is a seller)
  const sellerItems = [
    { icon: "store", text: "Seller Dashboard", action: () => navigation.navigate("SellerDashboard") },
    { icon: "list-alt", text: "Order Management", action: () => navigation.navigate("SellerOrderManagement") },
    { icon: "inventory", text: "Product Management", action: () => navigation.navigate("ProductManagement") },
    { icon: "swap-horiz", text: "Trade Management", action: () => navigation.navigate("SellerTradeManagementScreen") },
    { icon: "analytics", text: "Sales Reports", action: () => navigation.navigate("SalesReports") },
    { icon: "chat", text: "Seller Chat", action: () => navigation.navigate("SellerChat") }, // Added Seller Chat
  ];

  // Support Items
  const supportItems = [
    { icon: "credit-card", text: "My Wallet", action: () => console.log("Wallet") },
    { icon: "help-outline", text: "Help & Support", action: () => navigation.navigate("CustomerService") },
    { icon: "info-outline", text: "Terms", action: () => console.log("Terms") },
    { icon: "outlined-flag", text: "Report", action: () => console.log("Report") },
    { icon: "people-outline", text: "Add Account", action: () => console.log("Add Account") },
    { icon: "logout", text: "Log Out", action: async () => { await logout(); navigation.navigate("Home"); }},
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ 
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0"
      }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", left: 16 }}
        >
          <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Settings</Text>
      </View>

      <ScrollView>
        {/* Account Settings */}
        <View style={{ paddingVertical: 8 }}>
          <Text style={{ 
            fontSize: 14,
            fontWeight: "500",
            color: "#666",
            paddingHorizontal: 16,
            paddingVertical: 8
          }}>
            ACCOUNT
          </Text>
          {accountItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.action}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderBottomWidth: index === accountItems.length - 1 ? 0 : 1,
                borderBottomColor: "#f5f5f5"
              }}
            >
              <MaterialIcons name={item.icon} size={22} color="#333" />
              <Text style={{ 
                marginLeft: 12, 
                fontSize: 16, 
                color: "#333",
                flex: 1 
              }}>
                {item.text}
              </Text>
              <MaterialIcons name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Seller Management (only shown if user is a seller) */}
        {/* {user?.isSeller && ( */}
          <View style={{ paddingVertical: 8 }}>
            <Text style={{ 
              fontSize: 14,
              fontWeight: "500",
              color: "#666",
              paddingHorizontal: 16,
              paddingVertical: 8
            }}>
              SELLER MANAGEMENT
            </Text>
            {sellerItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.action}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderBottomWidth: index === sellerItems.length - 1 ? 0 : 1,
                  borderBottomColor: "#f5f5f5"
                }}
              >
                <MaterialIcons name={item.icon} size={22} color="#333" />
                <Text style={{ 
                  marginLeft: 12, 
                  fontSize: 16, 
                  color: "#333",
                  flex: 1 
                }}>
                  {item.text}
                </Text>
                <MaterialIcons name="chevron-right" size={20} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        {/* )} */}

        {/* Support and About */}
        <View style={{ paddingVertical: 8 }}>
          <Text style={{ 
            fontSize: 14,
            fontWeight: "500",
            color: "#666",
            paddingHorizontal: 16,
            paddingVertical: 8
          }}>
            SUPPORT
          </Text>
          {supportItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.action}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderBottomWidth: index === supportItems.length - 1 ? 0 : 1,
                borderBottomColor: "#f5f5f5"
              }}
            >
              <MaterialIcons name={item.icon} size={22} color="#333" />
              <Text style={{ 
                marginLeft: 12, 
                fontSize: 16, 
                color: "#333",
                flex: 1 
              }}>
                {item.text}
              </Text>
              <MaterialIcons name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Setting;


// // import { View, Text, TouchableOpacity, ScrollView } from "react-native";
// // import { SafeAreaView } from "react-native-safe-area-context";
// // import React, { useContext } from "react";
// // import { AuthContext } from "../auth/AuthContext";
// // import { MaterialIcons } from "@expo/vector-icons";

// // const Setting = ({ navigation }) => {
// //   const { logout, user } = useContext(AuthContext);

// //   // Account Settings
// //   const accountItems = [
// //     { icon: "person-outline", text: "Edit Profile", action: () => navigation.navigate("EditProfile") },
// //     { icon: "security", text: "Account Security", action: () => console.log("Security") },
// //     { icon: "notifications-none", text: "Notifications", action: () => navigation.navigate("Notifications") },
// //     { icon: "lock-outline", text: "Privacy", action: () => console.log("Privacy") },
// //     { icon: "location-pin", text: "My Address", action: () => navigation.navigate("MyAddress") },
// //   ];

// //   // Seller Management Items (only visible if user is a seller)
// //   const sellerItems = [
// //     { icon: "store", text: "Seller Dashboard", action: () => navigation.navigate("SellerDashboard") },
// //     { icon: "list-alt", text: "Order Management", action: () => navigation.navigate("SellerOrderManagement") },
// //     { icon: "inventory", text: "Product Management", action: () => navigation.navigate("ProductManagement") },
// //     { icon: "analytics", text: "Sales Reports", action: () => navigation.navigate("SalesReports") },
// //   ];

// //   // Support Items
// //   const supportItems = [
// //     { icon: "credit-card", text: "My Wallet", action: () => console.log("Wallet") },
// //     { icon: "help-outline", text: "Help & Support", action: () => navigation.navigate("CustomerService") },
// //     { icon: "info-outline", text: "Terms", action: () => console.log("Terms") },
// //     { icon: "outlined-flag", text: "Report", action: () => console.log("Report") },
// //     { icon: "people-outline", text: "Add Account", action: () => console.log("Add Account") },
// //     { icon: "logout", text: "Log Out", action: async () => { await logout(); navigation.navigate("Home"); }},
// //   ];

// //   return (
// //     <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
// //       <View style={{ 
// //         flexDirection: "row", 
// //         justifyContent: "center", 
// //         alignItems: "center",
// //         padding: 16,
// //         borderBottomWidth: 1,
// //         borderBottomColor: "#f0f0f0"
// //       }}>
// //         <TouchableOpacity 
// //           onPress={() => navigation.goBack()}
// //           style={{ position: "absolute", left: 16 }}
// //         >
// //           <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
// //         </TouchableOpacity>
// //         <Text style={{ fontSize: 18, fontWeight: "bold" }}>Settings</Text>
// //       </View>

// //       <ScrollView>
// //         {/* Account Settings */}
// //         <View style={{ paddingVertical: 8 }}>
// //           <Text style={{ 
// //             fontSize: 14,
// //             fontWeight: "500",
// //             color: "#666",
// //             paddingHorizontal: 16,
// //             paddingVertical: 8
// //           }}>
// //             ACCOUNT
// //           </Text>
// //           {accountItems.map((item, index) => (
// //             <TouchableOpacity
// //               key={index}
// //               onPress={item.action}
// //               style={{
// //                 flexDirection: "row",
// //                 alignItems: "center",
// //                 paddingVertical: 14,
// //                 paddingHorizontal: 16,
// //                 borderBottomWidth: index === accountItems.length - 1 ? 0 : 1,
// //                 borderBottomColor: "#f5f5f5"
// //               }}
// //             >
// //               <MaterialIcons name={item.icon} size={22} color="#333" />
// //               <Text style={{ 
// //                 marginLeft: 12, 
// //                 fontSize: 16, 
// //                 color: "#333",
// //                 flex: 1 
// //               }}>
// //                 {item.text}
// //               </Text>
// //               <MaterialIcons name="chevron-right" size={20} color="#999" />
// //             </TouchableOpacity>
// //           ))}
// //         </View>

// //         {/* Seller Management (only shown if user is a seller) */}
// //         {/* {user?.isSeller && ( */}
// //           <View style={{ paddingVertical: 8 }}>
// //             <Text style={{ 
// //               fontSize: 14,
// //               fontWeight: "500",
// //               color: "#666",
// //               paddingHorizontal: 16,
// //               paddingVertical: 8
// //             }}>
// //               SELLER MANAGEMENT
// //             </Text>
// //             {sellerItems.map((item, index) => (
// //               <TouchableOpacity
// //                 key={index}
// //                 onPress={item.action}
// //                 style={{
// //                   flexDirection: "row",
// //                   alignItems: "center",
// //                   paddingVertical: 14,
// //                   paddingHorizontal: 16,
// //                   borderBottomWidth: index === sellerItems.length - 1 ? 0 : 1,
// //                   borderBottomColor: "#f5f5f5"
// //                 }}
// //               >
// //                 <MaterialIcons name={item.icon} size={22} color="#333" />
// //                 <Text style={{ 
// //                   marginLeft: 12, 
// //                   fontSize: 16, 
// //                   color: "#333",
// //                   flex: 1 
// //                 }}>
// //                   {item.text}
// //                 </Text>
// //                 <MaterialIcons name="chevron-right" size={20} color="#999" />
// //               </TouchableOpacity>
// //             ))}
// //           </View>
// //         {/* )} */}

// //         {/* Support and About */}
// //         <View style={{ paddingVertical: 8 }}>
// //           <Text style={{ 
// //             fontSize: 14,
// //             fontWeight: "500",
// //             color: "#666",
// //             paddingHorizontal: 16,
// //             paddingVertical: 8
// //           }}>
// //             SUPPORT
// //           </Text>
// //           {supportItems.map((item, index) => (
// //             <TouchableOpacity
// //               key={index}
// //               onPress={item.action}
// //               style={{
// //                 flexDirection: "row",
// //                 alignItems: "center",
// //                 paddingVertical: 14,
// //                 paddingHorizontal: 16,
// //                 borderBottomWidth: index === supportItems.length - 1 ? 0 : 1,
// //                 borderBottomColor: "#f5f5f5"
// //               }}
// //             >
// //               <MaterialIcons name={item.icon} size={22} color="#333" />
// //               <Text style={{ 
// //                 marginLeft: 12, 
// //                 fontSize: 16, 
// //                 color: "#333",
// //                 flex: 1 
// //               }}>
// //                 {item.text}
// //               </Text>
// //               <MaterialIcons name="chevron-right" size={20} color="#999" />
// //             </TouchableOpacity>
// //           ))}
// //         </View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // };

// // export default Setting;

// import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
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

//   const handleNavigation = (screenName, screenTitle) => {
//     try {
//       navigation.navigate(screenName);
//     } catch (error) {
//       Alert.alert(
//         "Navigation Error",
//         `Unable to navigate to ${screenTitle}. Please make sure the screen is properly configured.`,
//         [{ text: "OK" }]
//       );
//     }
//   };

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

//         {/* Seller Management */}
//         <View style={{ paddingVertical: 8 }}>
//           <Text style={{ 
//             fontSize: 14,
//             fontWeight: "500",
//             color: "#666",
//             paddingHorizontal: 16,
//             paddingVertical: 8
//           }}>
//             SELLER MANAGEMENT
//           </Text>
//           {sellerItems.map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               onPress={() => handleNavigation(item.action(), item.text)}
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 paddingVertical: 14,
//                 paddingHorizontal: 16,
//                 borderBottomWidth: index === sellerItems.length - 1 ? 0 : 1,
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