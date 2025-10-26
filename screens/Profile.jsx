import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MaterialCommunityIcons,
  Feather,
  Entypo,
  Octicons,
  MaterialIcons,
  Ionicons,
  AntDesign,
  FontAwesome
} from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../style/theme";
import axiosInstance from "../api/axiosInstance";

const API ="/api/v1/Profile/buyer_profile";
const Profile = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [profile, setProfile] = useState([]);
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
      } else if (profile.length === 0) {
        await fetchProfileData();
        setIsImageLoading(true);
      }
    };
    updateProfile();
  }, [profile, route.params?.updatedProfile]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header - Fixed outside ScrollView */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.headerButton}
        >
          <MaterialIcons name="arrow-back" size={22} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate("Setting")}
          >
            <Feather name="settings" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              {isImageLoading && (
                <ActivityIndicator size="small" color={COLORS.primary} />
              )}
              <Image
                source={{ uri: profile.profile_pic }}
                style={[styles.profileImage, { opacity: isImageLoading ? 0 : 1 }]}
                onLoad={() => setIsImageLoading(false)}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {profile.f_name} {profile.l_name}
              </Text>
              <Text style={styles.profileUsername}>@{profile.username || "testusername"}</Text>
              <View style={styles.profileStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>11</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Edit Profile Button */}
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Feather name="edit-2" size={16} color={COLORS.primary} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => navigation.navigate("Chat")}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#e8f4ff' }]}>
              <FontAwesome name="wechat" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.quickActionText}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => navigation.navigate("Support")}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#fff2e8' }]}>
              <Ionicons name="headset-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.quickActionText}>Support</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => navigation.navigate("Favorites")}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#ffe8ec' }]}>
              <AntDesign name="hearto" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.quickActionText}>Favorites</Text>
          </TouchableOpacity>
        </View>

        {/* My Purchases */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>My Purchases</Text>
          <View style={styles.compactGrid}>
            {[
              { icon: <Octicons name="credit-card" size={20} color={COLORS.primary} />, text: 'To Pay' },
              { icon: <Feather name="package" size={20} color={COLORS.primary} />, text: 'To Ship' },
              { icon: <MaterialIcons name="local-shipping" size={20} color={COLORS.primary} />, text: 'To Receive' },
              { icon: <MaterialCommunityIcons name="star-circle-outline" size={20} color={COLORS.primary} />, text: 'To Rate' },
              { icon: <MaterialIcons name="history" size={20} color={COLORS.primary} />, text: 'History' }
            ].map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.compactGridItem}
                onPress={() => {
                  if (item.text === 'History') {
                    navigation.navigate('PurchaseHistory', {
                      initialTab: 'History'
                    });
                  }else if (item.text === 'To Pay') {
                    navigation.navigate('PurchaseHistory', {
                      initialTab: 'To Pay'
                    });
                  } else if (item.text === 'To Ship') {
                    navigation.navigate('PurchaseHistory', {
                      initialTab: 'To Ship'
                    });
                  } else if (item.text === 'To Receive') {
                    navigation.navigate('PurchaseHistory', {
                      initialTab: 'To Receive'
                    });
                  } else if (item.text === 'To Rate') {
                    navigation.navigate('PurchaseHistory', {
                      initialTab: 'To Rate'
                    });
                  } else {
                    navigation.navigate('PurchaseHistory', {
                      initialTab: 'All'
                    });
                  }
                }}
              >
                <View style={styles.gridIconContainer}>
                  {item.icon}
                </View>
                <Text style={styles.compactGridText}>{item.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Wallet Section - Updated with navigation */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>My Savings</Text>
          <View style={styles.walletGrid}>
            {[
              { 
                icon: <AntDesign name="star" size={22} color={COLORS.primary} />, 
                text: 'Coins',
                onPress: () => navigation.navigate("Coins")
              },
              { 
                icon: <MaterialIcons name="confirmation-number" size={22} color={COLORS.primary} />, 
                text: 'Vouchers',
                onPress: () => navigation.navigate("Vouchers")
              }
            ].map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.walletItem}
                onPress={item.onPress}
              >
                <View style={styles.walletIconContainer}>
                  {item.icon}
                </View>
                <Text style={styles.walletText}>{item.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Seller Actions */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Seller Center</Text>
          <View style={styles.sellerActions}>
            <TouchableOpacity 
              style={[styles.sellerButton, styles.dashboardButton]}
              onPress={() => navigation.navigate("SellerDashboard")}
            >
              <MaterialCommunityIcons name="view-dashboard" size={20} color="white" />
              <Text style={styles.sellerButtonText}>Dashboard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.sellerButton, styles.sellButton]}
              onPress={() => navigation.navigate("StartSelling")}
            >
              <Entypo name="shop" size={20} color="white" />
              <Text style={styles.sellerButtonText}>Start Selling</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacer for Floating Button */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Chatbot Floating Button - Outside ScrollView */}
      <TouchableOpacity 
        style={styles.chatbotButton}
        onPress={() => navigation.navigate("Chatbot")}
      >
        <MaterialCommunityIcons name="robot-happy" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white", 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white", 
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, 
    backgroundColor: "white", 
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e0e0f0',
  },
  editProfileText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  quickActions: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  compactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  compactGridItem: {
    alignItems: 'center',
    width: '18%',
  },
  gridIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  compactGridText: {
    fontSize: 11,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  walletGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  walletItem: {
    alignItems: 'center',
    width: '40%',
  },
  walletIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  walletText: {
    fontSize: 11,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  sellerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sellerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dashboardButton: {
    backgroundColor: COLORS.primary,
  },
  sellButton: {
    backgroundColor: COLORS.secondary,
  },
  sellerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  chatbotButton: {
    position: 'absolute',
    bottom: 80, 
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 1000, 
  },
  bottomSpacer: {
    height: 100, 
  },
});

export default Profile;