// import React, { useState } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, Modal, Image, StyleSheet } from 'react-native';
// import { COLORS } from '../style/theme';
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// const Checkout = ({ route, navigation }) => {
//   const { cartProducts, total } = route.params;
//   const [selectedPayment, setSelectedPayment] = useState(null);
//   const [selectedShipping, setSelectedShipping] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   const paymentMethods = [
//     { name: 'Cash on Delivery', icon: 'truck-delivery' },
//     { name: 'Payment Center', icon: 'bank' },
//     { name: 'Credit/Debit Card', icon: 'credit-card' }
//   ];

//   const shippingOptions = [
//     { name: 'Standard International', icon: 'truck' },
//     { name: 'Express International', icon: 'airplane' }
//   ];

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Checkout</Text>
//       </View>

//       <ScrollView style={styles.scrollView}>
//         {/* buyer deets */}
//         <View style={styles.categoryContainer}>
//           <Text style={styles.sectionTitle}>Buyer Details</Text>
//           <View style={styles.detailItem}>
//             <MaterialCommunityIcons name="account" size={16} color={COLORS.primary} />
//             <Text style={styles.detailText}>Test User</Text>
//           </View>
//           <View style={styles.detailItem}>
//             <MaterialCommunityIcons name="map-marker" size={16} color={COLORS.primary} />
//             <Text style={styles.detailText}>123 Iloilo City, Philippines 5000</Text>
//           </View>
//           <View style={styles.detailItem}>
//             <MaterialCommunityIcons name="phone" size={16} color={COLORS.primary} />
//             <Text style={styles.detailText}>+63 912 345 6789</Text>
//           </View>
//         </View>

//         {/* Products */}
//         <View style={styles.categoryContainer}>
//           <Text style={styles.sectionTitle}>Products</Text>
//           {cartProducts.map((product, index) => (
//             <View key={index} style={styles.productItem}>
//               <Image source={{ uri: product.product_info.img }} style={styles.productImage} />
//               <View style={styles.productDetails}>
//                 <Text style={styles.productName}>{product.product_info.name}</Text>
//                 <Text style={styles.productPrice}>₱{product.product_info.price} x {product.quantity}</Text>
//               </View>
//             </View>
//           ))}
//         </View>

//         {/* delivery option*/}
//         <View style={styles.categoryContainer}>
//           <Text style={styles.sectionTitle}>Delivery Options</Text>
//           {shippingOptions.map((option, index) => (
//             <TouchableOpacity
//               key={index}
//               style={[
//                 styles.shippingOption,
//                 selectedShipping === option.name && styles.selectedShippingOption,
//               ]}
//               onPress={() => setSelectedShipping(option.name)}>
//               <MaterialCommunityIcons name={option.icon} size={20} color={COLORS.primary} />
//               <Text style={styles.shippingText}>{option.name}</Text>
//               {selectedShipping === option.name && (
//                 <MaterialCommunityIcons name="check" size={20} color={COLORS.primary} style={styles.checkIcon} />
//               )}
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/*payment method*/}
//         <View style={styles.categoryContainer}>
//           <Text style={styles.sectionTitle}>Payment Method</Text>
//           <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.paymentMethod}>
//             <MaterialCommunityIcons name="credit-card-outline" size={20} color={COLORS.primary} />
//             <Text style={styles.paymentText}>
//               {selectedPayment ? selectedPayment : 'Select Payment Method'}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* payment deets static */}
//         <View style={styles.categoryContainer}>
//           <Text style={styles.sectionTitle}>Payment Details</Text>
//           <View style={styles.paymentDetailRow}>
//             <Text>Merchandise Subtotal</Text>
//             <Text>₱{total}</Text>
//           </View>
//           <View style={styles.paymentDetailRow}>
//             <Text>Shipping Fee</Text>
//             <Text>₱50</Text>
//           </View>
//           <View style={styles.paymentDetailRow}>
//             <Text>Shipping Discount</Text>
//             <Text>-₱10</Text>
//           </View>
//           <View style={styles.paymentDetailRow}>
//             <Text>Voucher Discount</Text>
//             <Text>-₱20</Text>
//           </View>
//           <View style={[styles.paymentDetailRow, styles.totalPayment]}>
//             <Text style={styles.totalText}>Total Payment</Text>
//             <Text style={styles.totalText}>₱{total + 50 - 10 - 20}</Text>
//           </View>
//         </View>
//       </ScrollView>

//       {/* plcae order */}
//       <View style={styles.placeOrderButtonContainer}>
//         <TouchableOpacity
//           style={styles.placeOrderButton}
//           onPress={() => alert('Order Placed!')}>
//           <Text style={styles.placeOrderButtonText}>Place Order</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Payment pop up */}
//       <Modal visible={modalVisible} transparent={true} animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Select Payment Method</Text>
//             {paymentMethods.map((method, index) => (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => {
//                   setSelectedPayment(method.name);
//                   setModalVisible(false);
//                 }}
//                 style={styles.modalOption}>
//                 <MaterialCommunityIcons name={method.icon} size={24} color={COLORS.primary} />
//                 <Text style={styles.modalOptionText}>{method.name}</Text>
//               </TouchableOpacity>
//             ))}
//             <TouchableOpacity onPress={() => setModalVisible(false)}>
//               <Text style={styles.modalCancel}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: COLORS.primary,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginLeft: 10,
//     color: 'white',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   categoryContainer: {
//     backgroundColor: 'white',
//     margin: 10,
//     padding: 16,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   detailItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   detailText: {
//     marginLeft: 10,
//   },
//   productItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 5,
//   },
//   productImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 5,
//     marginRight: 10,
//   },
//   productDetails: {
//     flex: 1,
//   },
//   productName: {
//     fontSize: 16,
//   },
//   productPrice: {
//     color: COLORS.black,
//   },
//   shippingOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 5,
//     padding: 10,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: COLORS.lightGray,
//   },
//   selectedShippingOption: {
//     borderColor: COLORS.primary,
//     backgroundColor: '#f0f8ff',
//   },
//   shippingText: {
//     marginLeft: 10,
//     flex: 1,
//   },
//   checkIcon: {
//     marginLeft: 'auto',
//   },
//   paymentMethod: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: COLORS.lightGray,
//   },
//   paymentText: {
//     marginLeft: 10,
//     color: COLORS.primary,
//   },
//   paymentDetailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//   },
//   totalPayment: {
//     marginTop: 10,
//   },
//   totalText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   placeOrderButtonContainer: {
//     padding: 16,
//     backgroundColor: 'white',
//     borderTopWidth: 1,
//     borderColor: COLORS.lightGray,
//   },
//   placeOrderButton: {
//     backgroundColor: COLORS.primary,
//     padding: 15,
//     alignItems: 'center',
//     borderRadius: 10,
//   },
//   placeOrderButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     width: '80%',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   modalOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//   },
//   modalOptionText: {
//     marginLeft: 10,
//     fontSize: 16,
//   },
//   modalCancel: {
//     color: 'red',
//     textAlign: 'center',
//     marginTop: 10,
//   },
// });

// export default Checkout;

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Image, StyleSheet, Switch } from 'react-native';
import { COLORS } from '../style/theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import API_URL from '../api/api_urls';
import axios from 'axios';

const order_api = API_URL + '/api/v1/seller/Seller Orders/seller_orders';

const Checkout = ({ route, navigation }) => {
  const { cartProducts, total } = route.params;
  const [selectedDelivery, setSelectedDelivery] = useState('Standard');
  const [selectedTip, setSelectedTip] = useState(null);
  const [isContactless, setIsContactless] = useState(false);
  const [isSavingForNext, setIsSavingForNext] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const placeOderSubmit = () => {
    console.log("Order placed successfully!");
    const orderDetails = cartProducts.map(item => ({
      buyer_id: item.buyer_id,
      product_id: item.product_info.id,
      status: "To Ship",
      quantity: item.quantity,
      total_price: (item.product_info.price * item.quantity).toFixed(2),
    }));

    const response = axios.post(order_api, orderDetails).then(res => { 
      console.log("Order response:", res.data);
    }).catch(err => {
      console.error("Error placing order:", err);
    });

    console.log("Selected Product:",cartProducts );
  }

  const deliveryOptions = [
    { name: 'Standard', time: '10 - 25 mins', price: null },
    { name: 'Priority', time: '5 - 20 mins', price: '+19.50' },
    { name: 'Scheduled', time: 'Select a date and time', price: null }
  ];

  const tipOptions = [
    { amount: '5.00' },
    { amount: '20.00' },
    { amount: '40.00' }
  ];

  const paymentMethods = [
    { name: 'Cash on Delivery', icon: 'truck-delivery' },
    { name: 'Payment Center', icon: 'bank' },
    { name: 'Credit/Debit Card', icon: 'credit-card' }
  ];

  // Calculate subtotal from cart products
  const subtotal = cartProducts.reduce((sum, item) => {
    return sum + (item.product_info.price * item.quantity);
  }, 0);

  // Calculate shipping fee (example logic)
  const shippingFee = 39.00;
  const topUpFee = 8.04;
  const voucherDiscount = 20.00;
  const finalTotal = subtotal + shippingFee + topUpFee - voucherDiscount;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} /> {/* For alignment */}
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Delivery Address */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Delivery address</Text>
          <View style={styles.addressContainer}>
            <MaterialCommunityIcons name="google-maps" size={24} color={COLORS.primary} />
            <View style={styles.addressTextContainer}>
              <Text style={styles.addressText}>52 Zone 2 Bray. Don Esteban, Lapuz</Text>
              <Text style={styles.addressText}>Iloilo City Iloilo</Text>
            </View>
          </View>
          
          <Text style={styles.label}>Delivery instructions</Text>
          <Text style={styles.instructionsText}>Note to rider - e.g. landmark</Text>
          
          <View style={styles.contactlessContainer}>
            <Text style={styles.contactlessText}>Contactless delivery: switch to online payment for this option</Text>
            <Switch 
              value={isContactless}
              onValueChange={setIsContactless}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
            />
          </View>
        </View>

        {/* Delivery Options */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Delivery options</Text>
          {deliveryOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.deliveryOption,
                selectedDelivery === option.name && styles.selectedDeliveryOption
              ]}
              onPress={() => setSelectedDelivery(option.name)}
            >
              <View style={styles.deliveryOptionText}>
                <Text style={styles.deliveryOptionName}>{option.name}</Text>
                <Text style={styles.deliveryOptionTime}>{option.time}</Text>
              </View>
              {option.price && <Text style={styles.deliveryOptionPrice}>{option.price}</Text>}
              {selectedDelivery === option.name && (
                <MaterialCommunityIcons name="check" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Tip Options */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Tip your rider</Text>
          <Text style={styles.tipSubtitle}>100% of the tips go to your rider, we don't deduct anything from it.</Text>
          
          <View style={styles.tipOptionsContainer}>
            <TouchableOpacity 
              style={[styles.tipOption, selectedTip === null && styles.selectedTipOption]}
              onPress={() => setSelectedTip(null)}
            >
              <Text style={selectedTip === null ? styles.selectedTipText : styles.tipText}>Not now</Text>
            </TouchableOpacity>
            
            {tipOptions.map((tip, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tipOption,
                  selectedTip === tip.amount && styles.selectedTipOption
                ]}
                onPress={() => setSelectedTip(tip.amount)}
              >
                <Text style={selectedTip === tip.amount ? styles.selectedTipText : styles.tipText}>{tip.amount}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.mostCommonText}>Most common</Text>
          
          <TouchableOpacity 
            style={styles.saveOption}
            onPress={() => setIsSavingForNext(!isSavingForNext)}
          >
            <MaterialCommunityIcons 
              name={isSavingForNext ? "checkbox-marked" : "checkbox-blank-outline"} 
              size={24} 
              color={isSavingForNext ? COLORS.primary : COLORS.lightGray} 
            />
            <Text style={styles.saveText}>Save for your next order</Text>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Order summary</Text>
          
          {/* Render cart products with images */}
          {cartProducts.map((product, index) => (
            <View key={index} style={styles.productItemContainer}>
              <Image 
                source={{ uri: product.product_info.img }} 
                style={styles.productImage}
                resizeMode="cover"
              />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>
                  {product.quantity}x {product.product_info.name}
                </Text>
                <Text style={styles.productPrice}>
                  ₱{(product.product_info.price * product.quantity).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text>Subtotal</Text>
            <Text>₱{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Standard delivery</Text>
            <Text>₱{shippingFee.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Top up to minimum order</Text>
            <Text>₱{topUpFee.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Voucher Discount</Text>
            <Text>-₱{voucherDiscount.toFixed(2)}</Text>
          </View>
          
          <View style={styles.promoContainer}>
            <Text style={styles.promoText}>Add ₱90 to get 25% off</Text>
            <Text style={styles.timerText}>43 : 51</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer with Total and Place Order */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total (incl. fees and tax)</Text>
          <Text style={styles.totalAmount}>₱{finalTotal.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.summaryButton}>
          <Text style={styles.summaryButtonText}>See summary</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.placeOrderButton}
          onPress={() => placeOderSubmit()}
        >
          <Text style={styles.placeOrderButtonText}>Place order</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Method Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Payment Method</Text>
            {paymentMethods.map((method, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedPayment(method.name);
                  setModalVisible(false);
                }}
                style={styles.modalOption}>
                <MaterialCommunityIcons name={method.icon} size={24} color={COLORS.primary} />
                <Text style={styles.modalOptionText}>{method.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
    paddingBottom: 120, // Space for footer
  },
  sectionContainer: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTextContainer: {
    marginLeft: 10,
  },
  addressText: {
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  contactlessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  contactlessText: {
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedDeliveryOption: {
    backgroundColor: '#f5f5f5',
  },
  deliveryOptionText: {
    flex: 1,
  },
  deliveryOptionName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  deliveryOptionTime: {
    fontSize: 12,
    color: '#666',
  },
  deliveryOptionPrice: {
    marginRight: 10,
    color: COLORS.primary,
  },
  tipSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  tipOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tipOption: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedTipOption: {
    borderColor: COLORS.primary,
    backgroundColor: '#f0f8ff',
  },
  tipText: {
    fontSize: 14,
  },
  selectedTipText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  mostCommonText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  saveOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  saveText: {
    marginLeft: 8,
    fontSize: 14,
  },
  productItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  promoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    padding: 8,
    backgroundColor: '#f0f8ff',
    borderRadius: 4,
  },
  promoText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  timerText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  summaryButtonText: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  placeOrderButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  modalOptionText: {
    marginLeft: 10,
    fontSize: 16,
  },
  modalCancel: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Checkout;