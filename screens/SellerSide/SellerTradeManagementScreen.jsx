import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Switch,
  FlatList,
  Dimensions,
  Modal,
  Platform,
  KeyboardAvoidingView,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import axiosInstance from '@api/axiosInstance';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

// --- API ENDPOINTS ---
const products_api = "/api/v1/seller/Manage Product/manage_product";
const trade_api = "/api/v1/seller/Seller Trade/seller_trade";

// --- CUSTOM PALETTE ---
const COLORS = {
  primary: '#172d55',    // Deep Blue
  secondary: '#2196f3',  // Bright Blue
  background: '#ffffff', // Pure White
  text: '#808080',       // Gray
  surface: '#ffffff',
  border: '#f0f0f0',
  inputBg: '#f8f9fa',
  success: '#4caf50',
  warning: '#ff9800',
  danger: '#f44336',
  darkText: '#0f172a',
  lightBlue: '#e3f2fd',
};

const SellerTradeManagementScreen = () => {
  const navigation = useNavigation();
  
  const [activeTab, setActiveTab] = useState('products');
  const [tradeableProducts, setTradeableProducts] = useState([]);
  const [tradeOffers, setTradeOffers] = useState([]);
  const [isAddProductModal, setIsAddProductModal] = useState(false);
  const [products, setProducts] = useState([]); // Inventory products for picker

  // Form State
  const [newProduct, setNewProduct] = useState({
    product_id: '',
    name: '',
    description: '',
    value: '',
    isActive: true
  });

  // --- MOCK DATA LOADER ---
  useEffect(() => {
    // 1. Mock Tradeable Products (Your Store)
    setTradeableProducts([
      {
        id: 'TP-001',
        name: 'Artisanal Coffee Set',
        value: '₱450.00',
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80',
        isActive: true,
        note: 'Includes 2 mugs and 1 pack of beans.'
      },
      {
        id: 'TP-002',
        name: 'Handwoven Banig',
        value: '₱850.00',
        image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=400&q=80',
        isActive: true,
        note: 'Brand new, never used.'
      },
      {
        id: 'TP-003',
        name: 'Dried Mangoes (Box)',
        value: '₱300.00',
        image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=80',
        isActive: false,
        note: 'Out of stock temporarily.'
      },
    ]);

    // 2. Mock Offers (Incoming)
    setTradeOffers([
      {
        id: 'OFF-101',
        status: 'pending',
        user: { name: 'Elena Gilbert', rating: 4.9 },
        userProduct: { 
          name: 'Vintage Lamp', 
          value: '₱500', 
          image: 'https://images.unsplash.com/photo-1507473888900-52e1ad14db39?w=200' 
        },
        requestedProduct: { 
          name: 'Artisanal Coffee Set', 
          value: '₱450' 
        },
        message: 'Hello! I love your coffee set. Would you trade for my vintage lamp?'
      },
      {
        id: 'OFF-102',
        status: 'accepted',
        user: { name: 'Damon S.', rating: 4.5 },
        userProduct: { 
          name: 'Leather Journal', 
          value: '₱800', 
          image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200' 
        },
        requestedProduct: { 
          name: 'Handwoven Banig', 
          value: '₱850' 
        },
        message: ''
      }
    ]);

    // 3. Mock Inventory for Picker
    setProducts([
      { id: 'P-001', name: 'Artisanal Coffee Set', price: 450 },
      { id: 'P-002', name: 'Handwoven Banig', price: 850 },
      { id: 'P-003', name: 'Dried Mangoes', price: 300 },
      { id: 'P-004', name: 'Coconut Oil', price: 150 },
    ]);

    // Uncomment below to fetch real data
    // fetchProducts();
    // fetchTradeProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(products_api);
      if (response.data?.product_info) setProducts(response.data.product_info);
    } catch (error) { console.error(error); }
  };

  const fetchTradeProducts = async () => {
    try {
      const response = await axiosInstance.get(trade_api);
      if (response.data) setTradeableProducts(response.data);
    } catch (error) { console.error(error); }
  };

  // --- Handlers ---
  const handleAddProduct = async () => {
    if (!newProduct.product_id || !newProduct.value) {
      Alert.alert('Incomplete', 'Please select a product and enter its value.');
      return;
    }
    // Optimistic Add
    const newEntry = {
      id: `NEW-${Date.now()}`,
      name: newProduct.name,
      value: `₱${parseFloat(newProduct.value).toFixed(2)}`,
      image: 'https://via.placeholder.com/150', // Placeholder for demo
      isActive: newProduct.isActive,
      note: newProduct.description
    };
    setTradeableProducts([newEntry, ...tradeableProducts]);
    setIsAddProductModal(false);
    
    // API Call logic here...
  };

  const toggleProductStatus = (productId) => {
    setTradeableProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const deleteProduct = (productId) => {
    Alert.alert("Remove", "Stop trading this product?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Remove", 
        style: "destructive", 
        onPress: () => setTradeableProducts(prev => prev.filter(p => p.id !== productId)) 
      }
    ]);
  };

  const handleTradeOffer = (offerId, action) => {
    setTradeOffers(prev => prev.map(offer => 
      offer.id === offerId ? { ...offer, status: action } : offer
    ));
  };

  // --- Render Components ---

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard} 
      activeOpacity={0.9}
      onPress={() => {}}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
        <View style={[styles.statusTag, item.isActive ? styles.statusActive : styles.statusInactive]}>
          <Text style={styles.statusTagText}>{item.isActive ? 'Active' : 'Hidden'}</Text>
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productValue}>{item.value}</Text>
        
        <View style={styles.cardFooter}>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>{item.isActive ? 'On' : 'Off'}</Text>
            <Switch
              value={item.isActive}
              onValueChange={() => toggleProductStatus(item.id)}
              trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
              thumbColor={item.isActive ? COLORS.secondary : '#f4f3f4'}
              style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }} 
            />
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={() => deleteProduct(item.id)}>
            <Feather name="trash-2" size={16} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTradeOffer = ({ item }) => (
    <View style={styles.offerCard}>
      {/* Trader Header */}
      <View style={styles.offerHeader}>
        <View style={styles.traderRow}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{item.user.name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.traderName}>{item.user.name}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.ratingText}>{item.user.rating}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.statusBadge, 
          item.status === 'pending' ? styles.bgPending : 
          item.status === 'accepted' ? styles.bgAccepted : styles.bgDeclined
        ]}>
          <Text style={[styles.statusText,
             item.status === 'pending' ? {color: COLORS.warning} :
             item.status === 'accepted' ? {color: COLORS.success} : {color: COLORS.danger}
          ]}>{item.status}</Text>
        </View>
      </View>

      {/* Exchange Visual */}
      <View style={styles.exchangeBox}>
        <View style={styles.exchangeItem}>
          <Image source={{ uri: item.userProduct.image }} style={styles.exchangeImg} />
          <Text style={styles.exchangeLabel} numberOfLines={1}>{item.userProduct.name}</Text>
          <Text style={styles.exchangeVal}>{item.userProduct.value}</Text>
        </View>

        <View style={styles.exchangeArrow}>
          <View style={styles.arrowCircle}>
            <Feather name="arrow-right" size={18} color={COLORS.white} />
          </View>
        </View>

        <View style={styles.exchangeItem}>
          <View style={[styles.exchangeImg, styles.myProductImg]}>
             <Feather name="box" size={24} color={COLORS.primary} />
          </View>
          <Text style={styles.exchangeLabel} numberOfLines={1}>{item.requestedProduct.name}</Text>
          <Text style={styles.exchangeVal}>{item.requestedProduct.value}</Text>
        </View>
      </View>

      {item.message ? (
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>"{item.message}"</Text>
        </View>
      ) : null}

      {/* Actions */}
      {item.status === 'pending' && (
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={[styles.btn, styles.btnDecline]} 
            onPress={() => handleTradeOffer(item.id, 'declined')}
          >
            <Text style={[styles.btnText, { color: COLORS.danger }]}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.btn, styles.btnAccept]} 
            onPress={() => handleTradeOffer(item.id, 'accepted')}
          >
            <Text style={[styles.btnText, { color: "white"}]}>Accept Trade</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trade Center</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => setIsAddProductModal(true)}>
          <Feather name="plus" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Modern Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsBackground}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'products' && styles.activeTab]} 
            onPress={() => setActiveTab('products')}
          >
            <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>My Items</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'offers' && styles.activeTab]} 
            onPress={() => setActiveTab('offers')}
          >
            <Text style={[styles.tabText, activeTab === 'offers' && styles.activeTabText]}>Offers</Text>
            {tradeOffers.filter(o => o.status === 'pending').length > 0 && (
              <View style={styles.badge} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.content}>
        {activeTab === 'products' ? (
          <FlatList
            key="grid" // Force re-render when switching tabs
            data={tradeableProducts}
            renderItem={renderProductItem}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="tag-off-outline" size={60} color={COLORS.border} />
                <Text style={styles.emptyText}>No items listed for trade.</Text>
              </View>
            }
          />
        ) : (
          <FlatList
            key="list" // Force re-render when switching tabs
            data={tradeOffers}
            renderItem={renderTradeOffer}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Feather name="inbox" size={60} color={COLORS.border} />
                <Text style={styles.emptyText}>No trade offers yet.</Text>
              </View>
            }
          />
        )}
      </View>

      {/* Modal */}
      <Modal
        visible={isAddProductModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddProductModal(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>List Item for Trade</Text>
              <TouchableOpacity onPress={() => setIsAddProductModal(false)}>
                <Feather name="x" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody}>
              <Text style={styles.label}>Select Product</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={newProduct.product_id}
                  onValueChange={(itemValue) => {
                    const selected = products.find(p => p.id === itemValue);
                    if (selected) {
                      setNewProduct(prev => ({
                        ...prev,
                        product_id: selected.id,
                        name: selected.name,
                        value: selected.price ? selected.price.toString() : ''
                      }));
                    }
                  }}
                  style={{color: COLORS.primary}}
                >
                  <Picker.Item label="Choose from inventory..." value="" />
                  {products.map(p => (
                    <Picker.Item key={p.id} label={p.name} value={p.id} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Estimated Trade Value (₱)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={newProduct.value}
                onChangeText={t => setNewProduct({...newProduct, value: t})}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Condition / Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g. Brand new, includes box..."
                multiline
                numberOfLines={3}
                value={newProduct.description}
                onChangeText={t => setNewProduct({...newProduct, description: t})}
              />

              <View style={styles.switchRow}>
                <Text style={styles.switchLabelModal}>Make Active Immediately</Text>
                <Switch
                  value={newProduct.isActive}
                  onValueChange={v => setNewProduct({...newProduct, isActive: v})}
                  trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
                  thumbColor={newProduct.isActive ? COLORS.secondary : '#f4f3f4'}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddProduct}>
                <Text style={styles.saveBtnText}>List Item</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  headerBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.inputBg,
  },

  // Tabs
  tabsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
  },
  tabsBackground: {
    flexDirection: 'row',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  activeTab: {
    backgroundColor: COLORS.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  badge: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.danger,
  },

  // Content
  content: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  listContent: {
    padding: 20,
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  // --- Product Card ---
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageWrapper: {
    height: 110,
    backgroundColor: COLORS.inputBg,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  statusTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusActive: { backgroundColor: 'rgba(255,255,255,0.9)' },
  statusInactive: { backgroundColor: '#fee2e2' },
  statusTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  cardBody: {
    padding: 10,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  productValue: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  switchLabel: {
    fontSize: 10,
    color: COLORS.text,
  },
  iconButton: {
    padding: 4,
    backgroundColor: '#fff1f2',
    borderRadius: 4,
  },

  // --- Offer Card ---
  offerCard: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  traderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.secondary,
    fontWeight: '700',
    fontSize: 16,
  },
  traderName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bgPending: { backgroundColor: '#fff7ed' },
  bgAccepted: { backgroundColor: '#f0fdf4' },
  bgDeclined: { backgroundColor: '#fef2f2' },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  
  // Exchange Visuals
  exchangeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  exchangeItem: {
    alignItems: 'center',
    flex: 1,
  },
  exchangeImg: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: COLORS.white,
  },
  myProductImg: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  exchangeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.darkText,
    textAlign: 'center',
  },
  exchangeVal: {
    fontSize: 10,
    color: COLORS.secondary,
    fontWeight: '700',
  },
  exchangeArrow: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 12,
    color: COLORS.text,
    fontStyle: 'italic',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDecline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  btnAccept: {
    backgroundColor: COLORS.primary,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  modalBody: {
    paddingBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.inputBg,
    overflow: 'hidden',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: COLORS.inputBg,
    fontSize: 15,
    color: COLORS.primary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  switchLabelModal: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  modalFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  saveBtn: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // Empty
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: COLORS.text,
    marginTop: 12,
  },
});

export default SellerTradeManagementScreen;