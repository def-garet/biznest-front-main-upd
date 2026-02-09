// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   ScrollView
// } from "react-native";
// import React, { useEffect, useState ,useContext} from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import {
//   MaterialCommunityIcons,
//   Feather,
//   Entypo,
//   Octicons,
//   MaterialIcons,
//   Ionicons,
//   AntDesign,
//   FontAwesome
// } from "@expo/vector-icons";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { COLORS } from "../style/theme";
// import axiosInstance from '@api/axiosInstance';
// import { AuthContext } from "../auth/AuthContext";

// const API ="/api/v1/Profile/buyer_profile";
// const Profile = () => {
//   const navigation = useNavigation();
//   const route = useRoute();

//   const { sysRoles } = useContext(AuthContext);

//   const isSeller = sysRoles?.includes("seller");



//   const [profile, setProfile] = useState([]);
//   const [isImageLoading, setIsImageLoading] = useState(true);
//   const fetchProfileData = async () => {
//     try {
//       const response = await axiosInstance.get(API);
//       setProfile(response.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     const updateProfile = async () => {
//       if (route.params?.updatedProfile) {
//         setProfile(route.params.updatedProfile);
//         setIsImageLoading(true);
//       } else if (profile.length === 0) {
//         await fetchProfileData();
//         setIsImageLoading(true);
//       }
//     };
//     updateProfile();
//   }, [profile, route.params?.updatedProfile]);

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       {/* Header - Fixed outside ScrollView */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()} 
//           style={styles.headerButton}
//         >
//           <MaterialIcons name="arrow-back" size={22} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Profile</Text>
//         <View style={styles.headerIcons}>
//           <TouchableOpacity 
//             style={styles.headerButton}
//             onPress={() => navigation.navigate("Setting")}
//           >
//             <Feather name="settings" size={22} color="black" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Scrollable Content */}
//       <ScrollView 
//         showsVerticalScrollIndicator={false} 
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* Profile Section */}
//         <View style={styles.profileCard}>
//           <View style={styles.profileHeader}>
//             <View style={styles.profileImageContainer}>
//               {isImageLoading && (
//                 <ActivityIndicator size="small" color={COLORS.primary} />
//               )}
//               <Image
//                 source={{ uri: profile.profile_pic }}
//                 style={[styles.profileImage, { opacity: isImageLoading ? 0 : 1 }]}
//                 onLoad={() => setIsImageLoading(false)}
//               />
//             </View>
//             <View style={styles.profileInfo}>
//               <Text style={styles.profileName}>
//                 {profile.f_name} {profile.l_name}
//               </Text>
//               <Text style={styles.profileUsername}>@{profile.username || "testusername"}</Text>
//               <View style={styles.profileStats}>
//                 <View style={styles.statItem}>
//                   <Text style={styles.statNumber}>0</Text>
//                   <Text style={styles.statLabel}>Followers</Text>
//                 </View>
//                 <View style={styles.statDivider} />
//                 <View style={styles.statItem}>
//                   <Text style={styles.statNumber}>11</Text>
//                   <Text style={styles.statLabel}>Following</Text>
//                 </View>
//               </View>
//             </View>
//           </View>
          
//           {/* Edit Profile Button */}
//           <TouchableOpacity 
//             style={styles.editProfileButton}
//             onPress={() => navigation.navigate("EditProfile")}
//           >
//             <Feather name="edit-2" size={16} color={COLORS.primary} />
//             <Text style={styles.editProfileText}>Edit Profile</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Quick Actions */}
//         <View style={styles.quickActions}>
//           <TouchableOpacity 
//             style={styles.quickActionItem}
//             onPress={() => navigation.navigate("Chat")}
//           >
//             <View style={[styles.quickActionIcon, { backgroundColor: '#e8f4ff' }]}>
//               <FontAwesome name="wechat" size={20} color={COLORS.primary} />
//             </View>
//             <Text style={styles.quickActionText}>Chat</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.quickActionItem}
//             onPress={() => navigation.navigate("Support")}
//           >
//             <View style={[styles.quickActionIcon, { backgroundColor: '#fff2e8' }]}>
//               <Ionicons name="headset-outline" size={20} color={COLORS.primary} />
//             </View>
//             <Text style={styles.quickActionText}>Support</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.quickActionItem}
//             onPress={() => navigation.navigate("UserLike")}
//           >
//             <View style={[styles.quickActionIcon, { backgroundColor: '#ffe8ec' }]}>
//               <AntDesign name="hearto" size={20} color={COLORS.primary} />
//             </View>
//             <Text style={styles.quickActionText}>Favorites</Text>
//           </TouchableOpacity>
//         </View>

//         {/* My Purchases */}
//         <View style={styles.sectionCard}>
//           <Text style={styles.sectionTitle}>My Purchases</Text>
//           <View style={styles.compactGrid}>
//             {[
//               { icon: <Octicons name="credit-card" size={20} color={COLORS.primary} />, text: 'To Pay' },
//               { icon: <Feather name="package" size={20} color={COLORS.primary} />, text: 'To Ship' },
//               { icon: <MaterialIcons name="local-shipping" size={20} color={COLORS.primary} />, text: 'To Receive' },
//               { icon: <MaterialCommunityIcons name="star-circle-outline" size={20} color={COLORS.primary} />, text: 'To Rate' },
//               { icon: <MaterialIcons name="history" size={20} color={COLORS.primary} />, text: 'History' }
//             ].map((item, index) => (
//               <TouchableOpacity 
//                 key={index} 
//                 style={styles.compactGridItem}
//                 onPress={() => {
//                   if (item.text === 'History') {
//                     navigation.navigate('PurchaseHistory', {
//                       initialTab: 'History'
//                     });
//                   }else if (item.text === 'To Pay') {
//                     navigation.navigate('PurchaseHistory', {
//                       initialTab: 'To Pay'
//                     });
//                   } else if (item.text === 'To Ship') {
//                     navigation.navigate('PurchaseHistory', {
//                       initialTab: 'To Ship'
//                     });
//                   } else if (item.text === 'To Receive') {
//                     navigation.navigate('PurchaseHistory', {
//                       initialTab: 'To Receive'
//                     });
//                   } else if (item.text === 'To Rate') {
//                     navigation.navigate('PurchaseHistory', {
//                       initialTab: 'To Rate'
//                     });
//                   } else {
//                     navigation.navigate('PurchaseHistory', {
//                       initialTab: 'All'
//                     });
//                   }
//                 }}
//               >
//                 <View style={styles.gridIconContainer}>
//                   {item.icon}
//                 </View>
//                 <Text style={styles.compactGridText}>{item.text}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Wallet Section - Updated with navigation */}
//         <View style={styles.sectionCard}>
//           <Text style={styles.sectionTitle}>My Savings</Text>
//           <View style={styles.walletGrid}>
//             {[
//               { 
//                 icon: <AntDesign name="star" size={22} color={COLORS.primary} />, 
//                 text: 'Coins',
//                 onPress: () => navigation.navigate("Coins")
//               },
//               { 
//                 icon: <MaterialIcons name="confirmation-number" size={22} color={COLORS.primary} />, 
//                 text: 'Vouchers',
//                 onPress: () => navigation.navigate("Vouchers")
//               }
//             ].map((item, index) => (
//               <TouchableOpacity 
//                 key={index} 
//                 style={styles.walletItem}
//                 onPress={item.onPress}
//               >
//                 <View style={styles.walletIconContainer}>
//                   {item.icon}
//                 </View>
//                 <Text style={styles.walletText}>{item.text}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Seller Actions */}
//         <View style={styles.sectionCard}>
//           <Text style={styles.sectionTitle}>Seller Center</Text>
//           <View style={styles.sellerActions}>
//             {/* <TouchableOpacity 
//               style={[styles.sellerButton, styles.dashboardButton]}
//               onPress={() => navigation.navigate("SellerDashboard")}
//             >
//               <MaterialCommunityIcons name="view-dashboard" size={20} color="white" />
//               <Text style={styles.sellerButtonText}>Dashboard</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={[styles.sellerButton, styles.sellButton]}
//               onPress={() => navigation.navigate("StartSelling")}
//             >
//               <Entypo name="shop" size={20} color="white" />
//               <Text style={styles.sellerButtonText}>Start Selling</Text>
//             </TouchableOpacity> */}

//           {isSeller ? (
//           // ✅ Show Dashboard if user is seller
//           <TouchableOpacity
//             style={[styles.sellerButton, styles.dashboardButton]}
//             onPress={() => navigation.navigate("SellerDashboard")}
//           >
//             <MaterialCommunityIcons name="view-dashboard" size={20} color="white" />
//             <Text style={styles.sellerButtonText}>Dashboard</Text>
//           </TouchableOpacity>
//         ) : (
//           // 🚀 Show Start Selling if not seller
//           <TouchableOpacity
//             style={[styles.sellerButton, styles.sellButton]}
//             onPress={() => navigation.navigate("StartSelling")}
//           >
//             <Entypo name="shop" size={20} color="white" />
//             <Text style={styles.sellerButtonText}>Start Selling</Text>
//           </TouchableOpacity>
//         )}


//           </View>
//         </View>

//         {/* Bottom Spacer for Floating Button */}
//         <View style={styles.bottomSpacer} />
//       </ScrollView>

//       {/* Chatbot Floating Button - Outside ScrollView */}
//       <TouchableOpacity 
//         style={styles.chatbotButton}
//         onPress={() => navigation.navigate("Chatbot", { buyer_id: profile.id })}
//       >
//         <MaterialCommunityIcons name="robot-happy" size={28} color="white" />
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "white", 
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   scrollView: {
//     flex: 1,
//     backgroundColor: "white", 
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: 100, 
//     backgroundColor: "white", 
//   },
//   headerButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   headerIcons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   profileCard: {
//     backgroundColor: 'white',
//     margin: 16,
//     borderRadius: 12,
//     padding: 20,
//     borderWidth: 1,
//     borderColor: '#f0f0f0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   profileHeader: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   profileImageContainer: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#f8f9fa',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//     borderWidth: 2,
//     borderColor: '#f0f0f0',
//   },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//   },
//   profileInfo: {
//     flex: 1,
//   },
//   profileName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   profileUsername: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 12,
//   },
//   profileStats: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   statDivider: {
//     width: 1,
//     height: 20,
//     backgroundColor: '#e0e0e0',
//     marginHorizontal: 16,
//   },
//   editProfileButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#f8f9fa',
//     paddingVertical: 10,
//     borderRadius: 8,
//     marginTop: 16,
//     borderWidth: 1,
//     borderColor: '#e0e0f0',
//   },
//   editProfileText: {
//     color: COLORS.primary,
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 6,
//   },
//   quickActions: {
//     flexDirection: 'row',
//     backgroundColor: 'white',
//     marginHorizontal: 16,
//     marginBottom: 16,
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#f0f0f0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   quickActionItem: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   quickActionIcon: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   quickActionText: {
//     fontSize: 12,
//     color: '#333',
//     fontWeight: '500',
//   },
//   sectionCard: {
//     backgroundColor: 'white',
//     marginHorizontal: 16,
//     marginBottom: 16,
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#f0f0f0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 16,
//   },
//   compactGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   compactGridItem: {
//     alignItems: 'center',
//     width: '18%',
//   },
//   gridIconContainer: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#f8f9fa',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 6,
//     borderWidth: 1,
//     borderColor: '#f0f0f0',
//   },
//   compactGridText: {
//     fontSize: 11,
//     color: '#333',
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   walletGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingHorizontal: 40,
//   },
//   walletItem: {
//     alignItems: 'center',
//     width: '40%',
//   },
//   walletIconContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#f8f9fa',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: '#f0f0f0',
//   },
//   walletText: {
//     fontSize: 11,
//     color: '#333',
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   sellerActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   sellerButton: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     flex: 1,
//     marginHorizontal: 6,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   dashboardButton: {
//     backgroundColor: COLORS.primary,
//   },
//   sellButton: {
//     backgroundColor: COLORS.secondary,
//   },
//   sellerButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginLeft: 8,
//   },
//   chatbotButton: {
//     position: 'absolute',
//     bottom: 30, 
//     right: 20,
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: COLORS.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//     borderWidth: 2,
//     borderColor: 'white',
//     zIndex: 1000, 
//   },
//   bottomSpacer: {
//     height: 100, 
//   },
// });

// export default Profile;

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MaterialCommunityIcons,
  Feather,
  Octicons,
  MaterialIcons,
  Ionicons,
  AntDesign,
  FontAwesome5
} from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../style/theme";
import axiosInstance from '@api/axiosInstance';
import { AuthContext } from "../auth/AuthContext";

const API = "/api/v1/Profile/buyer_profile";

const Profile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { sysRoles } = useContext(AuthContext);
  const isSeller = sysRoles?.includes("seller");

  const [profile, setProfile] = useState({});
  const [isImageLoading, setIsImageLoading] = useState(true);

  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get(API);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const updateProfile = async () => {
      if (route.params?.updatedProfile) {
        setProfile(route.params.updatedProfile);
        setIsImageLoading(true);
      } else if (Object.keys(profile).length === 0) {
        await fetchProfileData();
        setIsImageLoading(true);
      }
    };
    updateProfile();
  }, [route.params?.updatedProfile]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate("Chat")} style={styles.iconBtn}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#1e293b" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Setting")} style={styles.iconBtn}>
              <Feather name="settings" size={22} color="#1e293b" />
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* --- 1. PROFILE HEADER SECTION --- */}
        <View style={styles.profileBlock}>
          <View style={styles.avatarWrapper}>
            {isImageLoading && <ActivityIndicator size="small" color={COLORS.primary} style={StyleSheet.absoluteFill} />}
            <Image
              source={{ uri: profile.profile_pic || 'https://via.placeholder.com/100' }}
              style={styles.avatar}
              onLoad={() => setIsImageLoading(false)}
            />
          </View>
          
          <View style={styles.profileDetails}>
            <Text style={styles.profileName} numberOfLines={1}>
              {profile.f_name} {profile.l_name}
            </Text>
            
            {/* Membership Tier Badge */}
            <TouchableOpacity style={styles.tierBadge}>
                <MaterialCommunityIcons name="crown" size={14} color="#D4AF37" />
                <Text style={styles.tierText}>Classic Member</Text>
                <MaterialIcons name="chevron-right" size={14} color="#64748b" />
            </TouchableOpacity>

            <View style={styles.statsContainer}>
              <Text style={styles.statText}><Text style={styles.statBold}>0</Text> Followers</Text>
              <Text style={styles.statDivider}>|</Text>
              <Text style={styles.statText}><Text style={styles.statBold}>11</Text> Following</Text>
            </View>
          </View>
        </View>

        {/* --- 2. SELLER BANNER --- */}
        <TouchableOpacity 
            style={styles.sellerBanner}
            onPress={() => navigation.navigate(isSeller ? "SellerDashboard" : "StartSelling")}
            activeOpacity={0.8}
        >
          <View style={styles.sellerBannerIcon}>
             <FontAwesome5 name="store" size={18} color="white" />
          </View>
          <View style={styles.sellerBannerTextContainer}>
             <Text style={styles.sellerBannerTitle}>{isSeller ? "Seller Dashboard" : "Become a Seller"}</Text>
             <Text style={styles.sellerBannerSub}>{isSeller ? "Manage your products and orders" : "Open a free shop and start earning"}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
        </TouchableOpacity>

        {/* --- 3. MY PURCHASES --- */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Purchases</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PurchaseHistory', { initialTab: 'History' })}>
              <Text style={styles.viewAllText}>View History <MaterialIcons name="chevron-right" size={16} /></Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.gridRow}>
            {[
              { icon: 'credit-card', name: Octicons, text: 'To Pay', tab: 'To Pay' },
              { icon: 'package', name: Feather, text: 'To Ship', tab: 'To Ship' },
              { icon: 'local-shipping', name: MaterialIcons, text: 'To Receive', tab: 'To Receive' },
              { icon: 'star-circle-outline', name: MaterialCommunityIcons, text: 'To Rate', tab: 'To Rate' }
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.gridItem} onPress={() => navigation.navigate('PurchaseHistory', { initialTab: item.tab })}>
                <View style={styles.iconCircle}>
                  <item.name name={item.icon} size={22} color="#1e293b" />
                </View>
                <Text style={styles.gridText}>{item.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* --- 4. MY WALLET & SAVINGS --- */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>My Savings</Text>
          <View style={styles.walletRow}>
            <TouchableOpacity style={[styles.walletCard, { backgroundColor: '#FFF7E6', borderColor: '#FFE7BA' }]} onPress={() => navigation.navigate("Coins")}>
               <FontAwesome5 name="coins" size={20} color="#FAAD14" />
               <View style={styles.walletTextCol}>
                   <Text style={styles.walletValue}>0</Text>
                   <Text style={styles.walletLabel}>My Coins</Text>
               </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.walletCard, { backgroundColor: '#E6F7FF', borderColor: '#BAE7FF' }]} onPress={() => navigation.navigate("Vouchers")}>
               <MaterialCommunityIcons name="ticket-percent" size={24} color="#1890FF" />
               <View style={styles.walletTextCol}>
                   <Text style={styles.walletValue}>0</Text>
                   <Text style={styles.walletLabel}>Vouchers</Text>
               </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- 5. SERVICES LIST --- */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Services</Text>
          
          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate("UserLike")}>
              <View style={[styles.listIconBg, { backgroundColor: '#FFF1F0' }]}>
                  <AntDesign name="hearto" size={18} color="#FF4D4F" />
              </View>
              <Text style={styles.listText}>My Favorites</Text>
              <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate("Support")}>
              <View style={[styles.listIconBg, { backgroundColor: '#F6FFED' }]}>
                  <Ionicons name="headset-outline" size={18} color="#52C41A" />
              </View>
              <Text style={styles.listText}>Help & Support</Text>
              <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
          </TouchableOpacity>

        </View>

      </ScrollView>

      {/* Floating Chatbot */}
      <TouchableOpacity 
        style={styles.chatbotBtn}
        onPress={() => navigation.navigate("Chatbot", { buyer_id: profile.id })}
      >
        <MaterialCommunityIcons name="robot-happy" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff', 
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F3F4F6', // The secret to modern UI: Light gray background between white sections
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // --- HEADER ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    padding: 8,
  },

  // --- PROFILE HEADER BLOCK ---
  profileBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    marginBottom: 10, // Creates the separation line to the next block
  },
  avatarWrapper: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: '#f1f5f9',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 37.5,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  tierText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginHorizontal: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 13,
    color: '#64748b',
  },
  statBold: {
    fontWeight: '700',
    color: '#1e293b',
  },
  statDivider: {
    color: '#cbd5e1',
    marginHorizontal: 10,
  },

  // --- SELLER BANNER ---
  sellerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 15,
    marginBottom: 15,
    marginTop: 5,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sellerBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sellerBannerTextContainer: {
    flex: 1,
  },
  sellerBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  sellerBannerSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },

  // --- SECTION BLOCKS ---
  sectionBlock: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12, // Default bottom margin for sections without custom headers
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    flexDirection: 'row',
    alignItems: 'center',
  },

  // --- ICONS GRID ---
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  gridItem: {
    alignItems: 'center',
    width: '22%',
  },
  iconCircle: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  gridText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },

  // --- WALLET ROW ---
  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  walletCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  walletTextCol: {
    marginLeft: 10,
  },
  walletValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  walletLabel: {
    fontSize: 11,
    color: '#64748b',
  },

  // --- LIST ITEMS (UTILITIES) ---
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  listIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },

  // --- CHATBOT ---
  chatbotBtn: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default Profile;