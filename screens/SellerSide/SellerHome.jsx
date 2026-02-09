import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Updated Import
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Custom Palette
const COLORS = {
  primary: '#172d55',    // Deep Blue
  secondary: '#2196f3',  // Bright Blue
  background: '#ffffff', // Pure White
  text: '#808080',       // Gray
  surface: '#ffffff',
  border: '#f0f0f0',
  success: '#4caf50',
  warning: '#ff9800',
  danger: '#f44336',
  white: '#ffffff',
  lightBlue: '#e3f2fd',
  inputBg: '#f8f9fa',
};

const { width } = Dimensions.get('window');

const SellerHome = () => {
  const navigation = useNavigation();
  
  // Mock Data
  const stats = {
    todaySales: '₱12,450',
    totalOrders: 14,
    pending: 8,
    unreadMessages: 5,
    rating: 4.8
  };

  const recentOrders = [
    { id: '#1024', time: '10:30 AM', items: '2x Handwoven Basket', status: 'Pending', total: '₱360' },
    { id: '#1023', time: '09:15 AM', items: '1x Barako Coffee', status: 'Shipped', total: '₱350' },
    { id: '#1022', time: 'Yesterday', items: '5x Piaya Original', status: 'Delivered', total: '₱600' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Status Bar is now Dark Content on White Background */}
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* 1. CLEAN MINIMALIST HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
             {/* Placeholder for Store Logo */}
             <Text style={styles.avatarText}>B</Text>
          </View>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.storeName}>BizNest Store</Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="search" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="bell" size={24} color={COLORS.primary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.mainScroll} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* 2. HERO DASHBOARD CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>Today's Revenue</Text>
              <Text style={styles.heroValue}>{stats.todaySales}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Feather name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{stats.rating}</Text>
            </View>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>{stats.totalOrders}</Text>
              <Text style={styles.heroStatLabel}>Orders</Text>
            </View>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>{stats.pending}</Text>
              <Text style={styles.heroStatLabel}>Pending</Text>
            </View>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>24</Text>
              <Text style={styles.heroStatLabel}>Views</Text>
            </View>
          </View>
        </View>

        {/* 3. Operations Grid */}
        <Text style={styles.sectionTitle}>Manage Shop</Text>
        <View style={styles.gridContainer}>
          
          <TouchableOpacity 
            style={styles.gridCard}
            onPress={() => navigation.navigate('SellerOrderManagement')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#fff3e0' }]}>
              <Feather name="package" size={24} color={COLORS.warning} />
            </View>
            <Text style={styles.cardTitle}>Orders</Text>
            <Text style={styles.cardCount}>{stats.pending} New</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.gridCard}
            onPress={() => navigation.navigate('ProductManagement')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#e3f2fd' }]}>
              <Feather name="box" size={24} color={COLORS.secondary} />
            </View>
            <Text style={styles.cardTitle}>Products</Text>
            <Text style={styles.cardCount}>Inventory</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.gridCard}
            onPress={() => navigation.navigate('SalesReports')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#e8f5e9' }]}>
              <Feather name="bar-chart-2" size={24} color={COLORS.success} />
            </View>
            <Text style={styles.cardTitle}>Insights</Text>
            <Text style={styles.cardCount}>Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.gridCard}
            onPress={() => navigation.navigate('SellerTradeManagementScreen')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#f3e5f5' }]}>
              <Feather name="repeat" size={24} color="#9c27b0" />
            </View>
            <Text style={styles.cardTitle}>Trades</Text>
            <Text style={styles.cardCount}>B2B</Text>
          </TouchableOpacity>

        </View>

        {/* 4. Messages Area */}
        <TouchableOpacity 
          style={styles.messageBanner}
          onPress={() => navigation.navigate('Chat')}
        >
          <View style={styles.messageContent}>
            <View style={[styles.iconCircle, { backgroundColor: '#e0f7fa', width: 40, height: 40 }]}>
              <Feather name="message-circle" size={20} color="#006064" />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.messageTitle}>Messages</Text>
              <Text style={styles.messageSubtitle}>You have {stats.unreadMessages} unread chats</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={COLORS.text} />
        </TouchableOpacity>

        {/* 5. Live Orders Feed */}
        <View style={styles.feedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SellerOrderManagement')}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentOrders.map((order, index) => (
            <View key={index} style={styles.orderRow}>
              <View style={[
                styles.statusStrip, 
                order.status === 'Pending' ? { backgroundColor: COLORS.warning } : 
                order.status === 'Shipped' ? { backgroundColor: COLORS.secondary } : 
                { backgroundColor: COLORS.success }
              ]} />
              
              <View style={styles.orderContent}>
                <View style={styles.orderTop}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderTime}>{order.time}</Text>
                </View>
                <Text style={styles.orderItem} numberOfLines={1}>{order.items}</Text>
                <Text style={styles.orderTotal}>{order.total}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('ProductManagement')} 
      >
        <Feather name="plus" size={28} color="#FFF" />
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // --- HEADER STYLES ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  greeting: {
    fontSize: 12,
    color: COLORS.text,
    marginBottom: 2,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 8,
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
    borderWidth: 2,
    borderColor: COLORS.background,
  },

  // --- CONTENT STYLES ---
  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },

  // Hero Card
  heroCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
  heroValue: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '700',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: COLORS.white,
    fontWeight: '700',
    marginLeft: 4,
    fontSize: 12,
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 16,
  },
  heroStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  heroStatValue: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  heroStatLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
  },

  // Grid
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  gridCard: {
    width: (width - 52) / 2,
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 0,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  cardCount: {
    fontSize: 12,
    color: COLORS.text,
  },

  // Message Banner
  messageBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  messageSubtitle: {
    fontSize: 12,
    color: COLORS.text,
  },

  // Orders Feed
  feedSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    color: COLORS.secondary,
    fontWeight: '600',
    fontSize: 14,
  },
  orderRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  statusStrip: {
    width: 6,
    backgroundColor: COLORS.text, // Default fallback
  },
  orderContent: {
    flex: 1,
    padding: 16,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  orderTime: {
    fontSize: 12,
    color: COLORS.text,
  },
  orderItem: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 6,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
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

export default SellerHome;