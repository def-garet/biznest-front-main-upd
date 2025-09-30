import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions ,Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../style/theme';
import axios from 'axios';
import API_URL from '../api/api_urls';

// for archiving 
const API = `${API_URL}/api/v1/Buyer Cart/buyer_cart`;

const oldMyCart = ({ navigation }) => {
  const [cartProducts, setCartProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const width = Dimensions.get('window').width;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchDataCart);
    return unsubscribe;
  }, [navigation]);


  // const fetchCartData = async () => {
  //   try {
  //     let storedItems = await AsyncStorage.getItem('cartItems');
  //     storedItems = storedItems ? JSON.parse(storedItems) : [];

  //     if (storedItems.length === 0) {
  //       setCartProducts(fakeProducts);
  //       calculateTotal(fakeProducts);

  //       // to save product 
  //       await AsyncStorage.setItem('cartItems', JSON.stringify(fakeProducts));
  //       return;
  //     }

  //     setCartProducts(storedItems);
  //     calculateTotal(storedItems);
  //   } catch (error) {
  //     console.error('Error fetching cart data:', error);
  //   }
  // };

  const fetchDataCart = async () => {
    try {
      let storedItems = await AsyncStorage.getItem('cartItems');
      storedItems = storedItems ? JSON.parse(storedItems) : [];

      const response = await axios.get(API);
      const fetchedItems = response.data || [];

      setCartProducts(fetchedItems);
      calculateTotal(fetchedItems);

      await AsyncStorage.setItem('cartItems', JSON.stringify(fetchedItems));

      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const calculateTotal = (productData) => {
    const totalAmount = productData.reduce((sum, item) => sum + (item.product_info?.price || 0), 0);
    setTotal(totalAmount);
  };

  const removeItemFromCart = async (id) => {
    try {
      let storedItems = await AsyncStorage.getItem('cartItems');
      storedItems = storedItems ? JSON.parse(storedItems) : [];
      const response = await axios.delete(`${API}/${id}`)
      
      if (response.status==200) {
        Alert.alert("Success", "Item removed from cart");
      } else {
        Alert.alert("Error", "Failed to remove item");
      }

      const updatedCart = storedItems.filter(item => item.id !== id);
      
      setCartProducts(updatedCart);
      calculateTotal(updatedCart);
      
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
      
    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert("Error", "Something went wrong");

    }
  };

  const checkOut = async () => {
    try {
      await AsyncStorage.removeItem('cartItems');
      setCartProducts([]);
      setTotal(0);
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        <Text style={{ fontSize: 22, fontWeight: 'bold', padding: 16, alignSelf:'center' }}>My Cart</Text>

        {cartProducts.length > 0 ? (
          cartProducts.map((product, index) => (
            <View key={index} style={{ flexDirection: 'row', padding: 16, alignItems: 'center' }}>
              <Image
                source={{ uri: product.product_info?.img || 'https://via.placeholder.com/80' }}
                style={{ width: 80, height: 80, resizeMode: 'contain' }}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{product.product_info?.name || "No Name"}</Text>
                <Text style={{ fontSize: 14, color: COLORS.black }}>₱{product.product_info?.price || 0}</Text>
              </View>
              <TouchableOpacity onPress={() => removeItemFromCart(product.id)}>
                <MaterialCommunityIcons name="delete" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 18 }}>Your cart is empty</Text>
        )}
      </ScrollView>

      {cartProducts.length > 0 && (
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Total: ₱{total}</Text>
          <TouchableOpacity
            onPress={checkOut}
            style={{
              backgroundColor: COLORS.primary,
              padding: 15,
              alignItems: 'center',
              borderRadius: 10,
              marginTop: 10,
            }}>
            <Text style={{ color: "white", fontSize: 16, fontWeight: 'bold' }}>
              Proceed to Checkout
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MyCart;
