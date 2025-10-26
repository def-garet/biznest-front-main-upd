import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons, FontAwesome5, Feather, AntDesign } from "@expo/vector-icons";

const Vouchers = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("all");

  // Sample vouchers data - removed PayLater vouchers
  const vouchers = {
    all: [
      {
        id: 1,
        title: "BizNest VIP",
        description: "Enjoy extra 20% off vouchers daily with exclusive benefits!",
        discount: "20% OFF",
        minSpend: "Min. Spend P500",
        used: null,
        expiring: "2 days left",
        type: "special",
        icon: "crown",
        color: "#FF6B35"
      },
      {
        id: 2,
        title: "Free Shipping",
        discount: "FREE SHIPPING",
        minSpend: "Min. Spend P299",
        used: "57% used",
        expiring: "7 hours left",
        type: "shipping",
        icon: "local-shipping",
        color: "#2196F3"
      },
      {
        id: 3,
        title: "Welcome Offer",
        discount: "P150 OFF",
        minSpend: "Min. Spend P1,000",
        used: null,
        expiring: "1 day left",
        type: "voucher",
        icon: "confirmation-number",
        color: "#4CAF50"
      },
      {
        id: 4,
        title: "Flash Sale",
        discount: "30% OFF",
        minSpend: "Min. Spend P800",
        used: "82% used",
        expiring: "5 hours left",
        type: "voucher",
        icon: "flash-on",
        color: "#FF4081"
      },
      {
        id: 5,
        title: "BIZNEST",
        discount: "P225 OFF",
        minSpend: "Min. Spend P1,500",
        used: null,
        expiring: "1 day left",
        type: "voucher",
        icon: "store",
        color: "#172d55"
      },
      {
        id: 6,
        title: "New User",
        discount: "P100 OFF",
        minSpend: "No min. spend",
        used: null,
        expiring: "50 minutes ago",
        type: "voucher",
        icon: "person-add",
        color: "#9C27B0"
      }
    ],
    biznest: [
      {
        id: 1,
        title: "BizNest VIP",
        description: "Enjoy extra 20% off vouchers daily with exclusive benefits!",
        discount: "20% OFF",
        minSpend: "Min. Spend P500",
        used: null,
        expiring: "2 days left",
        type: "special",
        icon: "crown",
        color: "#FF6B35"
      },
      {
        id: 3,
        title: "Welcome Offer",
        discount: "P150 OFF",
        minSpend: "Min. Spend P1,000",
        used: null,
        expiring: "1 day left",
        type: "voucher",
        icon: "confirmation-number",
        color: "#4CAF50"
      },
      {
        id: 5,
        title: "BIZNEST",
        discount: "P225 OFF",
        minSpend: "Min. Spend P1,500",
        used: null,
        expiring: "1 day left",
        type: "voucher",
        icon: "store",
        color: "#172d55"
      }
    ],
    shop: [
      {
        id: 2,
        title: "Free Shipping",
        discount: "FREE SHIPPING",
        minSpend: "Min. Spend P299",
        used: "57% used",
        expiring: "7 hours left",
        type: "shipping",
        icon: "local-shipping",
        color: "#2196F3"
      },
      {
        id: 4,
        title: "Flash Sale",
        discount: "30% OFF",
        minSpend: "Min. Spend P800",
        used: "82% used",
        expiring: "5 hours left",
        type: "voucher",
        icon: "flash-on",
        color: "#FF4081"
      },
      {
        id: 6,
        title: "New User",
        discount: "P100 OFF",
        minSpend: "No min. spend",
        used: null,
        expiring: "50 minutes ago",
        type: "voucher",
        icon: "person-add",
        color: "#9C27B0"
      }
    ]
  };

  const getIconComponent = (iconName, color = "white") => {
    switch (iconName) {
      case "crown":
        return <FontAwesome5 name="crown" size={16} color={color} />;
      case "local-shipping":
        return <MaterialIcons name="local-shipping" size={20} color={color} />;
      case "confirmation-number":
        return <MaterialIcons name="confirmation-number" size={20} color={color} />;
      case "flash-on":
        return <MaterialIcons name="flash-on" size={20} color={color} />;
      case "store":
        return <MaterialIcons name="store" size={20} color={color} />;
      case "person-add":
        return <MaterialIcons name="person-add" size={20} color={color} />;
      case "local-offer":
        return <MaterialIcons name="local-offer" size={20} color={color} />;
      default:
        return <MaterialIcons name="confirmation-number" size={20} color={color} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#172d55" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <MaterialIcons name="keyboard-arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Vouchers</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "all" && styles.activeTab]}
            onPress={() => setActiveTab("all")}
          >
            <Text style={[styles.tabText, activeTab === "all" && styles.activeTabText]}>
              All ({vouchers.all.length})
            </Text>
            {activeTab === "all" && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === "biznest" && styles.activeTab]}
            onPress={() => setActiveTab("biznest")}
          >
            <Text style={[styles.tabText, activeTab === "biznest" && styles.activeTabText]}>
              BizNest ({vouchers.biznest.length})
            </Text>
            {activeTab === "biznest" && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === "shop" && styles.activeTab]}
            onPress={() => setActiveTab("shop")}
          >
            <Text style={[styles.tabText, activeTab === "shop" && styles.activeTabText]}>
              Shop ({vouchers.shop.length})
            </Text>
            {activeTab === "shop" && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Promo Code Input */}
        <View style={styles.promoCard}>
          <View style={styles.promoHeader}>
            <MaterialIcons name="local-offer" size={24} color="#172d55" />
            <Text style={styles.promoTitle}>Redeem Promo Code</Text>
          </View>
          <View style={styles.promoInputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.promoInput}
                placeholder="Enter promo code here..."
                placeholderTextColor="#999"
              />
              <Feather name="tag" size={20} color="#666" style={styles.inputIcon} />
            </View>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>APPLY</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.getMoreButton}>
            <Ionicons name="gift" size={20} color="#172d55" />
            <Text style={styles.getMoreText}>Discover More Vouchers</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#172d55" />
          </TouchableOpacity>
        </View>

        {/* Vouchers List */}
        <View style={styles.vouchersList}>
          {vouchers[activeTab].map((voucher) => (
            <View key={voucher.id} style={styles.voucherCard}>
              {/* Voucher Header with Icon */}
              <View style={styles.voucherHeader}>
                <View style={styles.voucherTitleContainer}>
                  <View style={[styles.voucherIconContainer, { backgroundColor: voucher.color }]}>
                    {getIconComponent(voucher.icon)}
                  </View>
                  <View>
                    <Text style={styles.voucherTitle}>{voucher.title}</Text>
                    {voucher.used && (
                      <Text style={styles.usedText}>{voucher.used}</Text>
                    )}
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: voucher.color }]}>
                  <Text style={styles.statusBadgeText}>ACTIVE</Text>
                </View>
              </View>

              {/* Voucher Content */}
              <View style={styles.voucherContent}>
                <View style={styles.discountContainer}>
                  <Text style={styles.discountText}>{voucher.discount}</Text>
                  {voucher.description ? (
                    <Text style={styles.descriptionText}>{voucher.description}</Text>
                  ) : (
                    <Text style={styles.minSpendText}>{voucher.minSpend}</Text>
                  )}
                </View>

                {/* Progress Bar for used vouchers */}
                {voucher.used && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill,
                          { 
                            width: voucher.used === "57% used" ? "57%" : "82%",
                            backgroundColor: voucher.color
                          }
                        ]} 
                      />
                    </View>
                  </View>
                )}

                {/* Voucher Footer */}
                <View style={styles.voucherFooter}>
                  <View style={styles.expiryContainer}>
                    <Ionicons name="time-outline" size={14} color="#FF6B35" />
                    <Text style={styles.expiryText}>
                      {voucher.expiring}
                    </Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.termsButton}>
                      <Text style={styles.termsText}>Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.useNowButton}>
                      <Text style={styles.useNowText}>USE NOW</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Special VIP Banner */}
              {voucher.type === "special" && (
                <View style={styles.vipBanner}>
                  <FontAwesome5 name="crown" size={14} color="#FFD700" />
                  <Text style={styles.vipText}>EXCLUSIVE VIP OFFER</Text>
                  <FontAwesome5 name="crown" size={14} color="#FFD700" />
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    backgroundColor: '#172d55',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  placeholder: {
    width: 28,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
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
  promoCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#172d55',
    marginLeft: 8,
  },
  promoInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
    marginRight: 12,
  },
  promoInput: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    paddingLeft: 48,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    fontWeight: '500',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 16,
  },
  applyButton: {
    backgroundColor: '#172d55',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    shadowColor: '#172d55',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  getMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#172d55',
    borderRadius: 12,
    backgroundColor: 'rgba(23, 45, 85, 0.05)',
  },
  getMoreText: {
    color: '#172d55',
    fontWeight: '600',
    fontSize: 16,
    marginHorizontal: 8,
  },
  vouchersList: {
    paddingHorizontal: 16,
  },
  voucherCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  voucherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  voucherTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  voucherIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  voucherTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#172d55',
    marginBottom: 4,
  },
  usedText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  voucherContent: {
    padding: 20,
  },
  discountContainer: {
    marginBottom: 16,
  },
  discountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#172d55',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  minSpendText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  voucherFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expiryText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  termsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginRight: 12,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  useNowButton: {
    backgroundColor: '#172d55',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#172d55',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  useNowText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  vipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  vipText: {
    color: '#FF6B35',
    fontWeight: 'bold',
    fontSize: 12,
    marginHorizontal: 8,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default Vouchers;