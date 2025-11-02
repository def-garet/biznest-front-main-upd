// import React, { useState, useEffect } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
// import axios from 'axios';
// import { COLORS } from '../style/theme';
// import API_URL  from '../api/api_urls';

// // new cart

// const API = `${API_URL}/api/v1/Buyer%20Cart/buyer_cart/`;

// const MyCart = ({ navigation }) => {
//   const [cartProducts, setCartProducts] = useState([]);
//   const [total, setTotal] = useState(0);
//   const width = Dimensions.get('window').width;

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       fetchCartData();
//     });
//     return unsubscribe;
//   }, [navigation]);

//   const fetchCartData = async () => {
//     try {
//       let storedItems = await AsyncStorage.getItem('cartItems');
//       storedItems = storedItems ? JSON.parse(storedItems) : [];

//       console.log('Stored Cart Items:', storedItems);

//       const response = await axios.get(API, { followRedirect: true });
//       const fetchedItems = response.data || [];

//       console.log('Fetched Items from API:', fetchedItems);

//         setCartProducts(fetchedItems);
//         calculateTotal(fetchedItems);
//         await AsyncStorage.setItem('cartItems', JSON.stringify(fetchedItems));
      

//     } catch (error) {
//       console.error('Error fetching cart data:', error);
//     }
//   };

//   const calculateTotal = (products) => {
//     const totalAmount = products.reduce((sum, item) => sum + item.product_info.price * item.quantity, 0);
//     setTotal(totalAmount);
//   };

//   const updateQuantity = async (id, method) => {
//     try {
//       let updatedCart = cartProducts.map(item => {
//         if (item.id === id) {
//           let newQuantity = method ? item.quantity + 1 : item.quantity - 1;
//           return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
//         }
//         return item;
//       }).filter(item => item !== null);

//       setCartProducts(updatedCart);
//       calculateTotal(updatedCart);
//       await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));

//       await axios.put(`${API}/${id}`, { method: method ? true : false });

//     } catch (error) {
//       console.error('Error updating quantity:', error);
//     }
//   };

//   const removeItemFromCart = async (id) => {
//     try {
//       const updatedCart = cartProducts.filter(item => item.id !== id);
//       setCartProducts(updatedCart);
//       calculateTotal(updatedCart);
//       await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));

//       const response = await axios.delete(`${API}/${id}`);
//       if (response.status === 200) {
//         Alert.alert("Success", "Item removed from cart");
//       } else {
//         Alert.alert("Error", "Failed to remove item");
//       }

//     } catch (error) {
//       console.error('Error removing item:', error);
//       Alert.alert("Error", "Something went wrong");
//     }
//   };

//   const proceedToCheckout = () => {
//     navigation.navigate('Checkout', { cartProducts, total });
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: "white" }}>
//       <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={{ fontSize: 22, fontWeight: 'bold', marginLeft: 10 }}>My Cart</Text>
//       </View>

//       <ScrollView>
//         {cartProducts.length > 0 ? (
//           cartProducts.map((product, index) => (
//             <View key={index} style={{ flexDirection: 'row', padding: 16, alignItems: 'center' }}>
//               <Image source={{ uri: product.product_info.img }} style={{ width: 80, height: 80, resizeMode: 'contain' }} />
//               <View style={{ flex: 1, marginLeft: 10 }}>
//                 <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{product.product_info.name}</Text>
//                 <Text style={{ fontSize: 14, color: COLORS.black }}>₱{product.product_info.price}</Text>

//                 <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
//                   <TouchableOpacity onPress={() => updateQuantity(product.id, false)}>
//                     <MaterialCommunityIcons name="minus-circle" size={24} color={COLORS.primary} />
//                   </TouchableOpacity>
//                   <Text style={{ fontSize: 16, marginHorizontal: 10 }}>{product.quantity}</Text>
//                   <TouchableOpacity onPress={() => updateQuantity(product.id, true)}>
//                     <MaterialCommunityIcons name="plus-circle" size={24} color={COLORS.primary} />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//               <TouchableOpacity onPress={() => removeItemFromCart(product.id)}>
//                 <MaterialCommunityIcons name="delete" size={24} color="red" />
//               </TouchableOpacity>
//             </View>
//           ))
//         ) : (
//           <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 18 }}>Your cart is empty</Text>
//         )}
//       </ScrollView>

//       {cartProducts.length > 0 && (
//         <View style={{ padding: 16 }}>
//           <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Total: ₱{total}</Text>
//           <TouchableOpacity
//             onPress={proceedToCheckout}
//             style={{
//               backgroundColor: COLORS.primary,
//               padding: 15,
//               alignItems: 'center',
//               borderRadius: 10,
//               marginTop: 10,
//             }}>
//             <Text style={{ color: "white", fontSize: 16, fontWeight: 'bold' }}>
//               Proceed to Checkout
//             </Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// export default MyCart;


import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  Alert,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { COLORS } from '../style/theme';
const API = `/api/v1/Buyer%20Cart/buyer_cart/`;
import axiosInstance from '@api/axiosInstance';

const MyCart = ({ navigation }) => {
  const [cartProducts, setCartProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const width = Dimensions.get('window').width;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCartData();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchCartData = async () => {
    try {
      let storedItems = await AsyncStorage.getItem('cartItems');
      storedItems = storedItems ? JSON.parse(storedItems) : [];

      const response = await axiosInstance.get(API, { followRedirect: true });
      const fetchedItems = response.data || [];

      setCartProducts(fetchedItems);
      calculateTotal(fetchedItems);
      await AsyncStorage.setItem('cartItems', JSON.stringify(fetchedItems));
      
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };

  const calculateTotal = (products) => {
    const totalAmount = products.reduce((sum, item) => sum + item.product_info.price * item.quantity, 0);
    setTotal(totalAmount);
  };

  const updateQuantity = async (id, method) => {
    try {
      let updatedCart = cartProducts.map(item => {
        if (item.id === id) {
          let newQuantity = method ? item.quantity + 1 : item.quantity - 1;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(item => item !== null);

      setCartProducts(updatedCart);
      calculateTotal(updatedCart);
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));

      await axiosInstance.put(`${API}/${id}`, { method: method ? true : false });

    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItemFromCart = async (id) => {
    try {
      const updatedCart = cartProducts.filter(item => item.id !== id);
      setCartProducts(updatedCart);
      calculateTotal(updatedCart);
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));

      const response = await axiosInstance.delete(`${API}/${id}`);
      if (response.status === 200) {
        Alert.alert("Success", "Item removed from cart");
      } else {
        Alert.alert("Error", "Failed to remove item");
      }

    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };

  const proceedToCheckout = () => {
    navigation.navigate('Checkout', { 
      cartProducts: selectedItems.length > 0 
        ? cartProducts.filter(item => selectedItems.includes(item.id))
        : cartProducts, 
      total 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      {cartProducts.length > 0 ? (
        <>
          <ScrollView style={styles.scrollView}>
            {/* Select All Option */}
            <TouchableOpacity 
              style={styles.selectAllContainer}
              onPress={() => {
                if (selectedItems.length === cartProducts.length) {
                  setSelectedItems([]);
                } else {
                  setSelectedItems(cartProducts.map(item => item.id));
                }
              }}
            >
              <MaterialCommunityIcons 
                name={selectedItems.length === cartProducts.length ? "checkbox-marked" : "checkbox-blank-outline"} 
                size={24} 
                color={COLORS.primary} 
              />
              <Text style={styles.selectAllText}>
                Select All ({selectedItems.length}/{cartProducts.length})
              </Text>
            </TouchableOpacity>

            {/* Cart Items */}
            {cartProducts.map((product, index) => (
              <View key={index} style={styles.cartItem}>
                <TouchableOpacity 
                  style={styles.checkbox}
                  onPress={() => toggleSelectItem(product.id)}
                >
                  <MaterialCommunityIcons 
                    name={selectedItems.includes(product.id) ? "checkbox-marked" : "checkbox-blank-outline"} 
                    size={24} 
                    color={COLORS.primary} 
                  />
                </TouchableOpacity>
                
                <Image 
                  source={{ uri: product.product_info.img }} 
                  style={styles.productImage} 
                />
                
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.product_info.name}
                  </Text>
                  <Text style={styles.productPrice}>₱{product.product_info.price}</Text>
                  
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(product.id, false)}
                    >
                      <MaterialCommunityIcons name="minus" size={16} color="white" />
                    </TouchableOpacity>
                    
                    <Text style={styles.quantityText}>{product.quantity}</Text>
                    
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(product.id, true)}
                    >
                      <MaterialCommunityIcons name="plus" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => removeItemFromCart(product.id)}
                >
                  <MaterialCommunityIcons name="delete-outline" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Checkout Bar */}
          <View style={styles.checkoutBar}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total:</Text>
              <Text style={styles.totalAmount}>₱{total}</Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.checkoutButton,
                selectedItems.length === 0 && styles.disabledButton
              ]}
              onPress={proceedToCheckout}
              disabled={selectedItems.length === 0}
            >
              <Text style={styles.checkoutButtonText}>
                Checkout ({selectedItems.length || cartProducts.length})
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyCart}>
          <FontAwesome name="shopping-cart" size={80} color="#E0E0E0" />
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <Text style={styles.emptyCartSubtext}>Start shopping to add items to your cart</Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.shopButtonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectAllText: {
    marginLeft: 8,
    fontSize: 14,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  checkbox: {
    marginRight: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'contain',
    backgroundColor: '#F5F5F5',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
  },
  deleteButton: {
    padding: 8,
  },
  checkoutBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: 'white',
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 16,
    marginRight: 8,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  checkoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCartSubtext: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
    textAlign: 'center',
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  shopButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MyCart;