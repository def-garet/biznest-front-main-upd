import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  Alert,
  Switch,
  FlatList,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import API_URL from "../../api/api_urls";
import axios from "axios";


const { width: screenWidth } = Dimensions.get('window');
const products_api = API_URL + "/api/v1/seller/Manage Product/manage_product";

const SellerTradeManagementScreen = () => {
  const navigation = useNavigation();
  
  const [activeTab, setActiveTab] = useState('products');
  const [tradeableProducts, setTradeableProducts] = useState([]);
  const [tradeOffers, setTradeOffers] = useState([]);
  const [isAddProductModal, setIsAddProductModal] = useState(false);
  
  // New product form state
  const [newProduct, setNewProduct] = useState({
    product_id: '',
    name: '',
    description: '',
    value: '',
    // category: '',
    // image: '',
    isActive: true
  });

  const [products, setProducts] = useState([]);

  
  const fetchProducts = async () => {
    try {
      const response = await axios.get(products_api);
      setProducts(response.data.product_info);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

    useEffect(() => {
      fetchProducts();
    }, []);
  
  



  // Mock categories
  const categories = [
    'Food & Beverages',
    'Handicrafts',
    'Coffee & Tea',
    'Snacks',
    'Home Decor',
    'Personal Care',
    'Fashion',
    'Others'
  ];

  // Sample initial tradeable products
  const sampleProducts = [
    {
      id: '1',
      name: 'Artisanal Coffee Beans',
      description: 'Premium locally sourced coffee beans',
      value: '₱350',
      category: 'Coffee & Tea',
      image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300&auto=format&fit=crop&q=60',
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Handwoven Basket',
      description: 'Traditional handwoven native basket',
      value: '₱180',
      category: 'Handicrafts',
      image: 'https://images.unsplash.com/photo-1586023492125-27a3ceef34b3?w=300&auto=format&fit=crop&q=60',
      isActive: true,
      createdAt: '2024-01-10'
    }
  ];

  // Sample trade offers
  const sampleTradeOffers = [
    {
      id: 'offer1',
      user: {
        name: 'Maria Santos',
        rating: 4.8
      },
      userProduct: {
        name: 'Handmade Wallet',
        value: '₱250',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=60'
      },
      requestedProduct: {
        name: 'Artisanal Coffee Beans',
        value: '₱350'
      },
      message: 'I would love to trade my handmade wallet for your coffee beans!',
      status: 'pending',
      createdAt: '2024-01-20'
    }
  ];

  useEffect(() => {
    // Load sample data
    setTradeableProducts(sampleProducts);
    setTradeOffers(sampleTradeOffers);
  }, []);

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.value || !newProduct.category) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    const product = {
      id: `product-${Date.now()}`,
      ...newProduct,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTradeableProducts(prev => [product, ...prev]);
    setNewProduct({
      name: '',
      description: '',
      value: '',
      category: '',
      image: '',
      isActive: true
    });
    setIsAddProductModal(false);
    
    Alert.alert('Success', 'Product added successfully!');
  };

  const toggleProductStatus = (productId) => {
    setTradeableProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, isActive: !product.isActive }
          : product
      )
    );
  };

  const handleTradeOffer = (offerId, action) => {
    setTradeOffers(prev =>
      prev.map(offer =>
        offer.id === offerId
          ? { ...offer, status: action }
          : offer
      )
    );

    if (action === 'accepted') {
      Alert.alert('Offer Accepted', 'The trade offer has been accepted!');
    } else if (action === 'declined') {
      Alert.alert('Offer Declined', 'The trade offer has been declined.');
    }
  };

  const deleteProduct = (productId) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to remove this product from trade?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTradeableProducts(prev =>
              prev.filter(product => product.id !== productId)
            );
          }
        }
      ]
    );
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{item.name}</Text>
          <View style={styles.headerRight}>
            <Switch
              value={item.isActive}
              onValueChange={() => toggleProductStatus(item.id)}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={item.isActive ? '#2563eb' : '#f4f3f4'}
            />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteProduct(item.id)}
            >
              <Feather name="trash-2" size={16} color="#dc2626" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.productDescription}>{item.description}</Text>
        <View style={styles.productDetails}>
          <Text style={styles.productValue}>{item.value}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
        </View>
        <Text style={styles.productStatus}>
          Status: <Text style={{ color: item.isActive ? '#059669' : '#dc2626' }}>
            {item.isActive ? 'Available for Trade' : 'Not Available'}
          </Text>
        </Text>
      </View>
    </View>
  );

  const renderTradeOffer = ({ item }) => (
    <View style={styles.tradeOfferCard}>
      <View style={styles.offerHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <View style={styles.ratingContainer}>
            <Feather name="star" size={14} color="#f59e0b" />
            <Text style={styles.rating}>{item.user.rating}</Text>
          </View>
        </View>
        <Text style={[styles.offerStatus, 
          item.status === 'pending' ? styles.statusPending :
          item.status === 'accepted' ? styles.statusAccepted :
          styles.statusDeclined
        ]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>

      <View style={styles.tradeItems}>
        <View style={styles.tradeItem}>
          <Text style={styles.itemLabel}>User Offers:</Text>
          <View style={styles.itemWithImage}>
            <Image source={{ uri: item.userProduct.image }} style={styles.itemImage} />
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemName}>{item.userProduct.name}</Text>
              <Text style={styles.itemValue}>{item.userProduct.value}</Text>
            </View>
          </View>
        </View>

        <Feather name="repeat" size={20} color="#2563eb" style={styles.exchangeIcon} />

        <View style={styles.tradeItem}>
          <Text style={styles.itemLabel}>For Your:</Text>
          <View style={styles.itemWithImage}>
            <View style={[styles.itemImage, styles.placeholderImage]}>
              <Feather name="package" size={20} color="#64748b" />
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemName}>{item.requestedProduct.name}</Text>
              <Text style={styles.itemValue}>{item.requestedProduct.value}</Text>
            </View>
          </View>
        </View>
      </View>

      {item.message && (
        <Text style={styles.offerMessage}>"{item.message}"</Text>
      )}

      {item.status === 'pending' && (
        <View style={styles.offerActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.declineButton]}
            onPress={() => handleTradeOffer(item.id, 'declined')}
          >
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleTradeOffer(item.id, 'accepted')}
          >
            <Text style={styles.acceptText}>Accept Trade</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#0f172a" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Trade Management</Text>
          <Text style={styles.subtitle}>Manage your tradeable products</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddProductModal(true)}
        >
          <Feather name="plus" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'products' && styles.activeTab]}
          onPress={() => setActiveTab('products')}
        >
          <Feather
            name="package"
            size={18}
            color={activeTab === 'products' ? '#2563eb' : '#64748b'}
          />
          <Text style={[
            styles.tabText,
            activeTab === 'products' && styles.activeTabText
          ]}>
            Products ({tradeableProducts.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'offers' && styles.activeTab]}
          onPress={() => setActiveTab('offers')}
        >
          <Feather
            name="gift"
            size={18}
            color={activeTab === 'offers' ? '#2563eb' : '#64748b'}
          />
          <Text style={[
            styles.tabText,
            activeTab === 'offers' && styles.activeTabText
          ]}>
            Offers ({tradeOffers.filter(o => o.status === 'pending').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'products' ? (
          tradeableProducts.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="package" size={64} color="#cbd5e1" />
              <Text style={styles.emptyStateTitle}>No Tradeable Products</Text>
              <Text style={styles.emptyStateText}>
                Add products that customers can trade for
              </Text>
              <TouchableOpacity
                style={styles.addProductButton}
                onPress={() => setIsAddProductModal(true)}
              >
                <Text style={styles.addProductButtonText}>Add Your First Product</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={tradeableProducts}
              renderItem={renderProductItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )
        ) : (
          tradeOffers.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="gift" size={64} color="#cbd5e1" />
              <Text style={styles.emptyStateTitle}>No Trade Offers</Text>
              <Text style={styles.emptyStateText}>
                When customers send trade offers, they will appear here
              </Text>
            </View>
          ) : (
            <FlatList
              data={tradeOffers}
              renderItem={renderTradeOffer}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )
        )}
      </View>

      {/* Add Product Modal */}
      {isAddProductModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Tradeable Product</Text>
              <TouchableOpacity
                onPress={() => setIsAddProductModal(false)}
                style={styles.modalCloseButton}
              >
                <Feather name="x" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>

              {/* Product Name Picker */}
                        <View style={styles.formGroup}>
              <Text style={styles.label}>Product Name *</Text>
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
        value: selected.price ? selected.price.toString() : '' // convert to string
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        product_id: '',
        name: '',
        value: ''
      }));
    }
  }}
  style={styles.picker}
>
  <Picker.Item label="Select a product" value="" />
  {products.map(product => (
    <Picker.Item
      key={product.id}
      label={product.name}
      value={product.id}
    />
  ))}
</Picker>

              </View>
            </View>
              
              {/* Description Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe your product..."
                  multiline
                  numberOfLines={3}
                  value={newProduct.description}
                  onChangeText={(text) => setNewProduct(prev => ({ ...prev, description: text }))}
                />
              </View>
              
{/*       tO BE ADDED LATER            
          <View style={styles.formGroup}>
            <Text style={styles.label}>Trade Quantity *</Text>
            <TextInput
              style={styles.input}
              placeholder="1"
              value={newTradeProduct.trade_quantity}
              keyboardType="numeric"
              onChangeText={(text) =>
                setNewTradeProduct(prev => ({ ...prev, trade_quantity: text }))
              }
            />
          </View> */}

            
            {/* Expanded value input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Estimated Value *</Text>
<TextInput
  style={styles.input}
  placeholder="₱0.00"
  value={newProduct.value}
  onChangeText={(text) => setNewProduct(prev => ({ ...prev, value: text }))}
  keyboardType="numeric"
/>



              </View>

              {/* <View style={styles.formGroup}>
                <Text style={styles.label}>Category *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                  {categories.map(category => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        newProduct.category === category && styles.selectedCategoryChip
                      ]}
                      onPress={() => setNewProduct(prev => ({ ...prev, category }))}
                    >
                      <Text style={[
                        styles.categoryText,
                        newProduct.category === category && styles.selectedCategoryText
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View> */}

              {/* <View style={styles.formGroup}>
                <Text style={styles.label}>Product Image URL (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="https://example.com/image.jpg"
                  value={newProduct.image}
                  onChangeText={(text) => setNewProduct(prev => ({ ...prev, image: text }))}
                />
              </View> */}

              <View style={styles.formGroup}>
                <View style={styles.switchContainer}>
                  <Text style={styles.label}>Available for Trade</Text>
                  <Switch
                    value={newProduct.isActive}
                    onValueChange={(value) => setNewProduct(prev => ({ ...prev, isActive: value }))}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={newProduct.isActive ? '#2563eb' : '#f4f3f4'}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsAddProductModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddProduct}
              >
                <Text style={styles.saveButtonText}>Add Product</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  //product name picker styles
  pickerWrapper: {
  borderWidth: 1,
  borderColor: '#e2e8f0',
  borderRadius: 8,
  overflow: 'hidden',
},
picker: {
  height: 50,
  width: '100%',
  color: '#0f172a',
},
// end 




  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '400',
  },
  addButton: {
    backgroundColor: '#2563eb',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#f8fafc',
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  activeTabText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  addProductButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addProductButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Product Card Styles
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
    marginRight: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 6,
    backgroundColor: '#fef2f2',
    borderRadius: 6,
  },
  productDescription: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
    lineHeight: 18,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },
  productCategory: {
    fontSize: 12,
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  productStatus: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  // Trade Offer Styles
  tradeOfferCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  offerStatus: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
  },
  statusAccepted: {
    backgroundColor: '#dcfce7',
    color: '#059669',
  },
  statusDeclined: {
    backgroundColor: '#fecaca',
    color: '#dc2626',
  },
  tradeItems: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  tradeItem: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 6,
    fontWeight: '500',
  },
  itemWithImage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 45,
    height: 45,
    borderRadius: 8,
    marginRight: 10,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 2,
  },
  itemValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  placeholderImage: {
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exchangeIcon: {
    marginHorizontal: 4,
  },
  offerMessage: {
    fontSize: 14,
    color: '#475569',
    fontStyle: 'italic',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    lineHeight: 18,
  },
  offerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  declineButton: {
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
  declineText: {
    color: '#dc2626',
    fontWeight: '500',
    fontSize: 14,
  },
  acceptButton: {
    borderColor: '#bbf7d0',
    backgroundColor: '#f0fdf4',
  },
  acceptText: {
    color: '#059669',
    fontWeight: '500',
    fontSize: 14,
  },
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
    maxHeight: 400,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 12,
  },
  // Form Styles
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoriesScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedCategoryChip: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SellerTradeManagementScreen;