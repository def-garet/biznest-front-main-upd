import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Dimensions,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from '@api/axiosInstance';
import API_URL from "../../api/api_urls";

const { width } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - 48) / 2; // Adjusted for padding

// Custom Palette
const COLORS = {
  primary: '#172d55',    // Deep Blue
  secondary: '#2196f3',  // Bright Blue
  background: '#ffffff', // Pure White
  text: '#808080',       // Gray
  // Helpers
  surface: '#ffffff',
  border: '#f0f0f0',
  inputBg: '#f8f9fa',
  danger: '#f44336',
  success: '#4caf50',
  warning: '#ff9800',
  white: '#ffffff',
};

const ProductManagement = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState({ product_info: [] });
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    img: ''
  });
  const [initialLoading, setInitialLoading] = useState(true);

  const products_api = "/api/v1/seller/Manage Product/manage_product";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(products_api);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Alert.alert("Error", "Failed to fetch products."); 
    } finally {
      setIsLoading(false);
      setInitialLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      price: product.price?.toString() || '',
      stock: product.stock?.toString() || '',
      description: product.description || '',
      img: product.img || ''
    });
    setModalVisible(true);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.stock) {
      Alert.alert("Required Fields", "Please fill in Name, Price, and Stock.");
      return;
    }

    setIsLoading(true);
    try {
      const productData = {
        name: productForm.name,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        description: productForm.description,
        image: productForm.img,
        ...(editingProduct && { product_id: editingProduct.id }),
      };

      if (editingProduct) {
        await axiosInstance.put(products_api, productData);
      } else {
        await axiosInstance.post(products_api, productData);
      }

      fetchProducts();
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving product:", error);
      Alert.alert("Error", "Failed to save product.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await axiosInstance.delete(`${products_api}/${productId}`);
              fetchProducts();
              setModalVisible(false);
            } catch (error) {
              console.error("Error deleting product:", error);
              Alert.alert("Error", "Failed to delete product.");
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderProductItem = ({ item }) => {
    const isLowStock = (item?.stock || 0) < 5;

    return (
      <TouchableOpacity 
        style={styles.productCard} 
        activeOpacity={0.8}
        onPress={() => handleEditClick(item)}
      >
        {/* Product Image Area */}
        <View style={styles.imageContainer}>
          {item?.img ? (
            <Image source={{ uri: item.img }} style={styles.productImage} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderImage}>
              <Feather name="image" size={32} color="#CBD5E1" />
            </View>
          )}
          
          {/* Status Badge */}
          <View style={[styles.stockBadge, isLowStock ? styles.stockBadgeLow : styles.stockBadgeNormal]}>
            <Text style={[styles.stockBadgeText, isLowStock ? styles.stockTextLow : styles.stockTextNormal]}>
              {isLowStock ? 'Low Stock' : 'Active'}
            </Text>
          </View>

          {/* Edit Button Overlay */}
          <TouchableOpacity 
            style={styles.editBtnOverlay}
            onPress={() => handleEditClick(item)}
          >
            <Feather name="edit-2" size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{item?.name || 'Untitled'}</Text>
          <Text style={styles.productStock}>Stock: {item?.stock || 0}</Text>
          <Text style={styles.productPrice}>₱{parseFloat(item?.price || 0).toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (initialLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Header - Uniform with TradeScreen */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Management</Text>
        <View style={{ width: 40 }} /> 
      </View>

      {/* Main Content */}
      <View style={styles.container}>
        {products?.product_info?.length > 0 ? (
          <FlatList
            data={products.product_info}
            keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
            contentContainerStyle={styles.listContent}
            numColumns={2}
            renderItem={renderProductItem}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            refreshing={isLoading}
            onRefresh={fetchProducts}
          />
        ) : (
          <View style={styles.centerContainer}>
            <View style={styles.emptyIconContainer}>
              <Feather name="package" size={48} color="#94A3B8" />
            </View>
            <Text style={styles.emptyTitle}>Inventory Empty</Text>
            <Text style={styles.emptySubtitle}>Start adding products to your shop.</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => {
                setEditingProduct(null);
                setProductForm({ name: '', price: '', stock: '', description: '', img: '' });
                setModalVisible(true);
              }}
            >
              <Text style={styles.emptyButtonText}>Add First Product</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Floating Action Button */}
      {products?.product_info?.length > 0 && (
        <TouchableOpacity 
          style={styles.fab} 
          activeOpacity={0.9}
          onPress={() => {
            setEditingProduct(null);
            setProductForm({ name: '', price: '', stock: '', description: '', img: '' });
            setModalVisible(true);
          }}
          disabled={isLoading}
        >
          <Feather name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Add/Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => !isLoading && setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProduct ? "Edit Product" : "New Product"}
              </Text>
              <TouchableOpacity onPress={() => !isLoading && setModalVisible(false)}>
                <Feather name="x" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContent}>
              
              {/* Product Name Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Product Name</Text>
                <View style={styles.inputContainer}>
                  <Feather name="tag" size={20} color={COLORS.text} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={productForm.name}
                    onChangeText={(text) => setProductForm({ ...productForm, name: text })}
                    placeholder="e.g. Silk Scarf"
                    placeholderTextColor="#B0BEC5"
                  />
                </View>
              </View>

              {/* Price & Stock Row */}
              <View style={styles.rowInputs}>
                <View style={[styles.inputWrapper, { flex: 1, marginRight: 12 }]}>
                  <Text style={styles.label}>Price</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.prefix}>₱</Text>
                    <TextInput
                      style={styles.input}
                      value={productForm.price}
                      onChangeText={(text) => setProductForm({ ...productForm, price: text.replace(/[^0-9.]/g, '') })}
                      keyboardType="numeric"
                      placeholder="0.00"
                      placeholderTextColor="#B0BEC5"
                    />
                  </View>
                </View>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <Text style={styles.label}>Stock</Text>
                  <View style={styles.inputContainer}>
                    <Feather name="layers" size={20} color={COLORS.text} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={productForm.stock}
                      onChangeText={(text) => setProductForm({ ...productForm, stock: text.replace(/[^0-9]/g, '') })}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#B0BEC5"
                    />
                  </View>
                </View>
              </View>

              {/* Description Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Description</Text>
                <View style={[styles.inputContainer, { alignItems: 'flex-start' }]}>
                  <Feather name="file-text" size={20} color={COLORS.text} style={[styles.inputIcon, { marginTop: 12 }]} />
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={productForm.description}
                    onChangeText={(text) => setProductForm({ ...productForm, description: text })}
                    multiline
                    numberOfLines={3}
                    placeholder="Product details..."
                    placeholderTextColor="#B0BEC5"
                  />
                </View>
              </View>

              {/* Image URL Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Image URL</Text>
                <View style={styles.inputContainer}>
                  <Feather name="image" size={20} color={COLORS.text} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={productForm.img}
                    onChangeText={(text) => setProductForm({ ...productForm, img: text })}
                    placeholder="https://..."
                    placeholderTextColor="#B0BEC5"
                  />
                </View>
              </View>

            </ScrollView>

            <View style={styles.modalFooter}>
              {editingProduct && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteProduct(editingProduct.id)}
                  disabled={isLoading}
                >
                  <Feather name="trash-2" size={20} color={COLORS.danger} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.saveButton, isLoading && { opacity: 0.7 }]}
                onPress={handleSaveProduct}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {editingProduct ? "Update Product" : "Save Product"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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

  // Grid Layout
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  // Product Card
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    // Modern Shadow
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 140,
    width: '100%',
    backgroundColor: COLORS.inputBg,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockBadgeNormal: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  stockBadgeLow: {
    backgroundColor: '#ffebee', // light red
  },
  stockBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  stockTextNormal: {
    color: COLORS.primary,
  },
  stockTextLow: {
    color: COLORS.danger,
  },
  editBtnOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  productStock: {
    fontSize: 11,
    color: COLORS.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
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
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  formContent: {
    padding: 24,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  prefix: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: COLORS.primary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  deleteButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  saveButton: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // Empty State
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default ProductManagement;