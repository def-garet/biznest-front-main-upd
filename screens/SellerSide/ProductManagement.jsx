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
  ActivityIndicator
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../style/theme";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "../../api/axiosInstance";
import API_URL from "../../api/api_urls";

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2;

const ProductManagement = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
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

  const products_api ="/api/v1/seller/Manage Product/manage_product";

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
      Alert.alert("Error", "Failed to fetch products. Please try again.");
    } finally {
      setIsLoading(false);
      setInitialLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      price: product.price.toString() || '',
      stock: product.stock.toString() || '',
      description: product.description || '',
      img: product.img || ''
    });
    setModalVisible(true);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.stock) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      if (editingProduct) {
        // Update existing product
        const productData = {
          product_id: editingProduct.id,
          name: productForm.name,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
          description: productForm.description,
          image: productForm.img,
        };
        await axiosInstance.put(products_api, productData);
      } else {
        // Create new product
        const productData = {
          name: productForm.name,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
          description: productForm.description,
          image: productForm.img,
        };
        await axiosInstance.post(products_api, productData);
      }
      
      fetchProducts();
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving product:", error);
      Alert.alert("Error", "Failed to save product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            setIsLoading(true);
            try {
              await axiosInstance.delete(`${products_api}/${productId}`);
              fetchProducts();
              setModalVisible(false);
            } catch (error) {
              console.error("Error deleting product:", error);
              Alert.alert("Error", "Failed to delete product. Please try again.");
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      {item?.img ? (
        <Image source={{ uri: item.img }} style={styles.productImage} />
      ) : (
        <View style={[styles.productImage, styles.productImagePlaceholder]}>
          <Feather name="image" size={24} color="#999" />
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item?.name || 'No Name'}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>{item?.description || 'No Description'}</Text>
        <View style={styles.productDetails}>
          <Text style={styles.priceText}>₱{item?.price || '0'}</Text>
          <Text style={(item?.stock || 0) < 5 ? styles.lowStock : styles.normalStock}>
            {item?.stock || 0} in stock
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => handleEditClick(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Management</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Products</Text>
        
        {products?.product_info?.length > 0 ? (
          <FlatList
            data={products.product_info}
            keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
            contentContainerStyle={styles.listContainer}
            numColumns={2}
            renderItem={renderProductItem}
            columnWrapperStyle={styles.columnWrapper}
            refreshing={isLoading}
            onRefresh={fetchProducts}
          />
        ) : (
          <View style={styles.emptyState}>
            <Feather name="package" size={50} color="#ccc" />
            <Text style={styles.emptyText}>No products found</Text>
            <TouchableOpacity 
              style={styles.addFirstButton}
              onPress={() => {
                setEditingProduct(null);
                setProductForm({ name: '', price: '', stock: '', description: '', img: '' });
                setModalVisible(true);
              }}
            >
              <Text style={styles.addFirstButtonText}>Add Your First Product</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {products?.product_info?.length > 0 && (
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => {
            setEditingProduct(null);
            setProductForm({ name: '', price: '', stock: '', description: '', img: '' });
            setModalVisible(true);
          }}
          disabled={isLoading}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => !isLoading && setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </Text>

            <Text style={styles.inputLabel}>Product Name *</Text>
            <TextInput
              style={styles.textInput}
              value={productForm.name}
              onChangeText={(text) =>
                setProductForm({ ...productForm, name: text })
              }
              placeholder="Enter product name"
              editable={!isLoading}
            />

            <Text style={styles.inputLabel}>Price (₱) *</Text>
            <TextInput
              style={styles.textInput}
              value={productForm.price}
              onChangeText={(text) =>
                setProductForm({ ...productForm, price: text.replace(/[^0-9.]/g, '') })
              }
              keyboardType="numeric"
              placeholder="Enter price"
              editable={!isLoading}
            />

            <Text style={styles.inputLabel}>Stock Quantity *</Text>
            <TextInput
              style={styles.textInput}
              value={productForm.stock}
              onChangeText={(text) =>
                setProductForm({ ...productForm, stock: text.replace(/[^0-9]/g, '') })
              }
              keyboardType="numeric"
              placeholder="Enter stock quantity"
              editable={!isLoading}
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.descriptionInput]}
              value={productForm.description}
              onChangeText={(text) =>
                setProductForm({ ...productForm, description: text })
              }
              multiline
              placeholder="Enter product description"
              editable={!isLoading}
            />

            <Text style={styles.inputLabel}>Image URL</Text>
            <TextInput
              style={styles.textInput}
              value={productForm.img}
              onChangeText={(text) =>
                setProductForm({ ...productForm, img: text })
              }
              placeholder="Enter image URL"
              editable={!isLoading}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, isLoading && styles.disabledButton]}
                onPress={handleSaveProduct}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "Processing..." : (editingProduct ? "Update" : "Add")}
                </Text>
              </TouchableOpacity>

              {editingProduct && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteButton, isLoading && styles.disabledButton]}
                  onPress={() => handleDeleteProduct(editingProduct.id)}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => !isLoading && setModalVisible(false)}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  listContainer: {
    paddingBottom: 16,
    backgroundColor: "white",
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productItem: {
    width: (Dimensions.get('window').width - 48) / 2,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  productImagePlaceholder: {
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    height: 32,
  },
  productDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  normalStock: {
    fontSize: 12,
    color: "#666",
  },
  lowStock: {
    fontSize: 12,
    color: "#F44336",
  },
  editButton: {
    marginTop: 8,
    padding: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: "#666",
  },
  textInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    flexWrap: 'wrap',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
    marginBottom: 8,
    minWidth: 100,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 20,
  },
  addFirstButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  addFirstButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProductManagement;