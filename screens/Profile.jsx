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
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity 
              style={styles.chatButton}
              onPress={() => navigation.navigate("Chat")}
            >
              <FontAwesome name="wechat" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Setting")}>
              <Feather name="settings" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileSection}>
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
          </View>
          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>11</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        <View style={styles.compactSection}>
          <Text style={styles.sectionTitle}>My Purchases</Text>
          <View style={styles.compactGrid}>
            {[
              { icon: <Octicons name="credit-card" size={18} color={COLORS.primary} />, text: 'To Pay' },
              { icon: <Feather name="package" size={18} color={COLORS.primary} />, text: 'To Ship' },
              { icon: <MaterialIcons name="local-shipping" size={18} color={COLORS.primary} />, text: 'To Receive' },
              { icon: <MaterialCommunityIcons name="star-circle-outline" size={18} color={COLORS.primary} />, text: 'To Rate' },
              { icon: <MaterialIcons name="history" size={18} color={COLORS.primary} />, text: 'History' }
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
                {item.icon}
                <Text style={styles.compactGridText}>{item.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Wallet Section in Row */}
        <View style={styles.compactSection}>
          <Text style={styles.sectionTitle}>My Wallet</Text>
          <View style={styles.walletGrid}>
            {[
              { icon: <Ionicons name="wallet-outline" size={22} color={COLORS.primary} />, text: 'ePay' },
              { icon: <AntDesign name="star" size={22} color={COLORS.primary} />, text: 'Coins' },
              { icon: <MaterialCommunityIcons name="credit-card-outline" size={22} color={COLORS.primary} />, text: 'PayLater' },
              { icon: <MaterialIcons name="confirmation-number" size={22} color={COLORS.primary} />, text: 'Vouchers' }
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.walletItem}>
                {item.icon}
                <Text style={styles.walletText}>{item.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Seller Actions - Redesigned */}
        <View style={styles.sellerActions}>
          <TouchableOpacity 
            style={[styles.sellerButton, styles.dashboardButton]}
            onPress={() => navigation.navigate("SellerDashboard")}
          >
            <MaterialCommunityIcons name="view-dashboard" size={18} color="white" />
            <Text style={styles.sellerButtonText}>Dashboard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.sellerButton, styles.sellButton]}
            onPress={() => navigation.navigate("StartSelling")}
          >
            <Entypo name="shop" size={18} color="white" />
            <Text style={styles.sellerButtonText}>Sell</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatButton: {
    marginRight: 20,
  },
  profileSection: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 8,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  profileUsername: {
    fontSize: 14,
    color: 'gray',
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
  },
  compactSection: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  compactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  compactGridItem: {
    alignItems: 'center',
    width: '18%',
    marginBottom: 12,
  },
  compactGridText: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
  },
  walletGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  walletItem: {
    alignItems: 'center',
    width: '22%',
  },
  walletText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  sellerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    marginTop: 8,
  },
  sellerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
});

export default Profile;