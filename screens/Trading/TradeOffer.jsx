import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TradeOffer = ({ visible, onClose, onCreate }) => {
  // Color theme
  const colors = {
    primary: '#172d55',
    secondary: '#2196f3',
    background: '#ffffff',
    text: '#808080',
  };

  // Mock shop data with products
  const mockShops = [
    {
      id: '1',
      name: 'Iloilo Biscocho Haus',
      image: 'https://d3up48wss6lvj.cloudfront.net/data/uploads/2020/07/ORIGINAL_BISCOCHO_HAUS.jpg',
      products: [
        { id: 'p1', name: 'Biscocho', image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=500&auto=format&fit=crop&q=60', price: '₱60' },
        { id: 'p2', name: 'Manok', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500&auto=format&fit=crop&q=60', price: '₱160' },
      ]
    },
    {
      id: '2', 
      name: 'Madge Coffee',
      image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=500',
      products: [
        { id: 'p3', name: 'Bluetooth Speaker', image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=500&auto=format&fit=crop&q=60', price: '₱120' },
        { id: 'p4', name: 'Power Bank', image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=500&auto=format&fit=crop&q=60', price: '₱350' },
      ]
    }
  ];

  // Users products
  const userProducts = [
    { id: 'u1', name: 'Hablon Wallet', image: 'https://i0.wp.com/www.mycitymysm.com/wp-content/uploads/2021/07/my-city-my-sm-my-craft-iloilo-26.jpg?fit=1600%2C1063&ssl=1', value: '₱250' },
    { id: 'u2', name: 'Barako Coffee', image: 'https://i0.wp.com/lostboy.blog/wp-content/uploads/2017/07/fb_img_1500417649033.jpg?ssl=1', value: '₱350' },
    { id: 'u3', name: 'Piaya Original', image: 'https://anec.global/cdn/shop/products/Untitleddesign_27_02371ddb-c443-485b-86d2-290f96cdb8f3.png?v=1645853439', value: '₱120' },
  ];

  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedUserProduct, setSelectedUserProduct] = useState(null);
  const [selectedShopProduct, setSelectedShopProduct] = useState(null);
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState(1); // 1: select shop, 2: select products, 3: confirm

  const handleCreateOffer = () => {
    if (!selectedShop || !selectedUserProduct || !selectedShopProduct) return;
    
    const newTrade = {
      id: Date.now().toString(),
      shop: selectedShop,
      userProduct: selectedUserProduct,
      shopProduct: selectedShopProduct,
      notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    onCreate(newTrade);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedShop(null);
    setSelectedUserProduct(null);
    setSelectedShopProduct(null);
    setNotes('');
    setStep(1);
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          {step !== 1 && (
            <TouchableOpacity onPress={goBack}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
          {step === 1 && <View style={{ width: 24 }} />}
          
          <Text style={[styles.title, { color: colors.primary }]}>
            {step === 1 ? 'Select Shop' : 
             step === 2 ? 'Select Products' : 'Confirm Trade'}
          </Text>
          
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {step === 1 ? (
          <ScrollView style={styles.shopList}>
            {mockShops.map(shop => (
              <TouchableOpacity
                key={shop.id}
                style={[
                  styles.shopItem,
                  selectedShop?.id === shop.id && { borderColor: colors.secondary }
                ]}
                onPress={() => {
                  setSelectedShop(shop);
                  setStep(2);
                }}
              >
                <Image source={{ uri: shop.image }} style={styles.shopImage} />
                <View style={styles.shopInfo}>
                  <Text style={[styles.shopName, { color: colors.primary }]}>{shop.name}</Text>
                  <Text style={[styles.shopProducts, { color: colors.text }]}>
                    {shop.products.length} products available
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : step === 2 ? (
          <ScrollView style={styles.productsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Your Products</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsHorizontal}>
              {userProducts.map(product => (
                <TouchableOpacity
                  key={product.id}
                  style={[
                    styles.productCard,
                    selectedUserProduct?.id === product.id && { borderColor: colors.secondary }
                  ]}
                  onPress={() => setSelectedUserProduct(product)}
                >
                  <Image source={{ uri: product.image }} style={styles.productImage} />
                  <Text style={[styles.productName, { color: colors.primary }]}>{product.name}</Text>
                  <Text style={[styles.productValue, { color: colors.secondary }]}>{product.value}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.sectionTitle, { color: colors.primary }]}>{selectedShop.name}'s Products</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsHorizontal}>
              {selectedShop.products.map(product => (
                <TouchableOpacity
                  key={product.id}
                  style={[
                    styles.productCard,
                    selectedShopProduct?.id === product.id && { borderColor: colors.secondary }
                  ]}
                  onPress={() => setSelectedShopProduct(product)}
                >
                  <Image source={{ uri: product.image }} style={styles.productImage} />
                  <Text style={[styles.productName, { color: colors.primary }]}>{product.name}</Text>
                  <Text style={[styles.productValue, { color: colors.secondary }]}>{product.price}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.primary }]}>Notes (optional):</Text>
              <TextInput
                style={[styles.input, styles.notesInput, { color: colors.text }]}
                multiline
                placeholder="Add any message to the shop owner..."
                placeholderTextColor={colors.text}
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.nextButton, 
                { backgroundColor: colors.secondary },
                (!selectedUserProduct || !selectedShopProduct) && styles.disabledButton
              ]}
              onPress={() => setStep(3)}
              disabled={!selectedUserProduct || !selectedShopProduct}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <View style={styles.confirmationContainer}>
            <Text style={[styles.confirmationTitle, { color: colors.primary }]}>Trade Summary</Text>
            
            <View style={styles.tradeSummary}>
              <View style={styles.tradeItem}>
                <Text style={[styles.tradeLabel, { color: colors.text }]}>You're offering:</Text>
                <View style={styles.productSummary}>
                  <Image source={{ uri: selectedUserProduct.image }} style={styles.summaryImage} />
                  <View>
                    <Text style={[styles.summaryName, { color: colors.primary }]}>{selectedUserProduct.name}</Text>
                    <Text style={[styles.summaryValue, { color: colors.secondary }]}>{selectedUserProduct.value}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.exchangeIcon}>
                <Ionicons name="swap-horizontal" size={30} color={colors.secondary} />
              </View>

              <View style={styles.tradeItem}>
                <Text style={[styles.tradeLabel, { color: colors.text }]}>You'll receive:</Text>
                <View style={styles.productSummary}>
                  <Image source={{ uri: selectedShopProduct.image }} style={styles.summaryImage} />
                  <View>
                    <Text style={[styles.summaryName, { color: colors.primary }]}>{selectedShopProduct.name}</Text>
                    <Text style={[styles.summaryValue, { color: colors.secondary }]}>{selectedShopProduct.price}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.shopInfoBox}>
              <Image source={{ uri: selectedShop.image }} style={styles.shopThumbnail} />
              <Text style={[styles.shopNameText, { color: colors.primary }]}>{selectedShop.name}</Text>
            </View>

            <View style={styles.notesSummary}>
              <Text style={[styles.notesLabel, { color: colors.text }]}>Your Note:</Text>
              <Text style={[styles.notesText, { color: colors.primary }]}>{notes || 'No message'}</Text>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[styles.backButton, { borderColor: colors.primary }]}
                onPress={() => setStep(2)}
              >
                <Text style={[styles.backButtonText, { color: colors.primary }]}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: colors.secondary }]}
                onPress={handleCreateOffer}
              >
                <Text style={styles.confirmButtonText}>Confirm Trade</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  shopList: {
    flex: 1,
    padding: 15,
  },
  shopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  shopImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
  },
  shopProducts: {
    fontSize: 14,
    marginTop: 4,
  },
  productsContainer: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  productsHorizontal: {
    marginBottom: 25,
  },
  productCard: {
    width: 150,
    marginRight: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  productValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  nextButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#b2bec3',
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  confirmationContainer: {
    flex: 1,
    padding: 20,
  },
  confirmationTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  tradeSummary: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  tradeItem: {
    marginBottom: 15,
  },
  tradeLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  productSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  summaryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  exchangeIcon: {
    alignItems: 'center',
    marginVertical: 10,
  },
  shopInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  shopThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  shopNameText: {
    fontSize: 16,
    fontWeight: '600',
  },
  notesSummary: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  notesText: {
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TradeOffer;