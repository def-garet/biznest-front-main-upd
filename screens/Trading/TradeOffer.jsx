import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Modal, 
  Image,
  SafeAreaView,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import TradeConfirmation from './TradeComponent/TradeConfirmationScreen';

const TradeOffer = ({ visible, onClose, onCreate }) => {
  const navigation = useNavigation();
  
  const colors = {
    primary: '#0f172a',
    secondary: '#2563eb',
    accent: '#f59e0b',
    background: '#ffffff',
    cardBackground: '#f8fafc',
    text: '#0f172a',
    textLight: '#64748b',
    border: '#e2e8f0',
    success: '#059669'
  };

  const mockShops = [
    {
      id: '1',
      name: 'Iloilo Biscocho Haus',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=60',
      rating: 4.5,
      products: [
        { id: 'p1', name: 'Biscocho', image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=300&auto=format&fit=crop&q=60', price: '₱60' },
        { id: 'p2', name: 'Butterscotch', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300&auto=format&fit=crop&q=60', price: '₱160' },
      ]
    },
    {
      id: '2', 
      name: 'Madge Coffee',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=60',
      rating: 4.7,
      products: [
        { id: 'p3', name: 'Arabica Blend', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&auto=format&fit=crop&q=60', price: '₱120' },
        { id: 'p4', name: 'Coffee Beans', image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300&auto=format&fit=crop&q=60', price: '₱350' },
      ]
    }
  ];

  const userProducts = [
    { id: 'u1', name: 'Hablon Wallet', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=60', value: '₱250' },
    { id: 'u2', name: 'Barako Coffee', image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300&auto=format&fit=crop&q=60', value: '₱350' },
    { id: 'u3', name: 'Piaya Original', image: 'https://images.unsplash.com/photo-1555507036-ab794f27d2e9?w=300&auto=format&fit=crop&q=60', value: '₱120' },
  ];

  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedUserProduct, setSelectedUserProduct] = useState(null);
  const [selectedShopProduct, setSelectedShopProduct] = useState(null);
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState(1);

  const handleCreateOffer = async () => {
    console.log('=== CREATE OFFER PROCESS STARTED ===');
    
    if (!selectedShop || !selectedUserProduct || !selectedShopProduct) {
      Alert.alert('Missing Information', 'Please select a shop and both products to continue.');
      return;
    }
    
    const newTrade = {
      id: `trade-${Date.now()}`,
      shop: selectedShop,
      userProduct: selectedUserProduct,
      shopProduct: selectedShopProduct,
      notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    console.log('Trade created:', newTrade);
    
    // 1. First call onCreate callback if provided
    if (onCreate && typeof onCreate === 'function') {
      console.log('Calling onCreate callback...');
      onCreate(newTrade);
    }
    
    // 2. Reset form and close modal
    console.log('Closing modal and resetting form...');
    resetForm();
    onClose();
    
    // 3. Navigate after a small delay to ensure modal is closed
    setTimeout(() => {
      console.log('Attempting navigation to TradeConfirmationScreen...');
      try {
        navigation.navigate('TradeConfirmationScreen', { 
          trade: newTrade 
        });
        console.log('Navigation successful!');
      } catch (error) {
        console.error('Navigation failed:', error);
        Alert.alert(
          'Navigation Error', 
          'Could not navigate to confirmation page. Please try again.'
        );
      }
    }, 100);
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
      resetForm();
    }
  };

  const renderStars = (rating) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Feather
            key={star}
            name={star <= rating ? "star" : "star"}
            size={14}
            color={star <= rating ? "#fbbf24" : "#cbd5e1"}
          />
        ))}
        <Text style={styles.ratingText}>({rating})</Text>
      </View>
    );
  };

  // Add a helper to check if confirm button should be enabled
  const isConfirmDisabled = !selectedShop || !selectedUserProduct || !selectedShopProduct;

  return (
    <Modal 
      visible={visible} 
      animationType="slide"
      onRequestClose={goBack}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={goBack} style={styles.headerButton}>
            <Feather 
              name={step === 1 ? "x" : "arrow-left"} 
              size={24} 
              color={colors.primary} 
            />
          </TouchableOpacity>
          
          <View style={styles.headerTitle}>
            <Text style={[styles.title, { color: colors.primary }]}>
              {step === 1 ? 'Select Shop' : 
               step === 2 ? 'Select Products' : 'Confirm Trade'}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(step / 3) * 100}%`,
                    backgroundColor: colors.secondary
                  }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.headerButton} />
        </View>

        {/* Step 1: Shop Selection */}
        {step === 1 && (
          <ScrollView style={styles.shopList}>
            <Text style={[styles.sectionDescription, { color: colors.textLight }]}>
              Choose a shop to trade with
            </Text>
            {mockShops.map(shop => (
              <TouchableOpacity
                key={shop.id}
                style={[
                  styles.shopItem,
                  { 
                    backgroundColor: colors.cardBackground,
                    borderColor: selectedShop?.id === shop.id ? colors.secondary : colors.border
                  }
                ]}
                onPress={() => {
                  setSelectedShop(shop);
                  setStep(2);
                }}
              >
                <Image source={{ uri: shop.image }} style={styles.shopImage} />
                <View style={styles.shopInfo}>
                  <Text style={[styles.shopName, { color: colors.primary }]}>{shop.name}</Text>
                  {renderStars(shop.rating)}
                  <Text style={[styles.shopProducts, { color: colors.textLight }]}>
                    {shop.products.length} products available
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color={colors.secondary} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Step 2: Product Selection */}
        {step === 2 && (
          <ScrollView style={styles.productsContainer}>
            {/* Your Products */}
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Your Products</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsRow}>
              {userProducts.map(product => (
                <TouchableOpacity
                  key={product.id}
                  style={[
                    styles.productCard,
                    { 
                      backgroundColor: colors.cardBackground,
                      borderColor: selectedUserProduct?.id === product.id ? colors.secondary : colors.border
                    }
                  ]}
                  onPress={() => setSelectedUserProduct(product)}
                >
                  <Image source={{ uri: product.image }} style={styles.productImage} />
                  <Text style={[styles.productName, { color: colors.primary }]}>{product.name}</Text>
                  <Text style={[styles.productValue, { color: colors.secondary }]}>{product.value}</Text>
                  {selectedUserProduct?.id === product.id && (
                    <View style={[styles.selectedIndicator, { backgroundColor: colors.secondary }]}>
                      <Feather name="check" size={16} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Shop Products */}
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>{selectedShop?.name}'s Products</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsRow}>
              {selectedShop?.products.map(product => (
                <TouchableOpacity
                  key={product.id}
                  style={[
                    styles.productCard,
                    { 
                      backgroundColor: colors.cardBackground,
                      borderColor: selectedShopProduct?.id === product.id ? colors.secondary : colors.border
                    }
                  ]}
                  onPress={() => setSelectedShopProduct(product)}
                >
                  <Image source={{ uri: product.image }} style={styles.productImage} />
                  <Text style={[styles.productName, { color: colors.primary }]}>{product.name}</Text>
                  <Text style={[styles.productValue, { color: colors.secondary }]}>{product.price}</Text>
                  {selectedShopProduct?.id === product.id && (
                    <View style={[styles.selectedIndicator, { backgroundColor: colors.secondary }]}>
                      <Feather name="check" size={16} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Notes */}
            <View style={[styles.notesContainer, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.label, { color: colors.primary }]}>Notes (optional):</Text>
              <TextInput
                style={[styles.textInput, { color: colors.text, borderColor: colors.border }]}
                multiline
                placeholder="Add any message to the shop owner..."
                placeholderTextColor={colors.textLight}
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.continueButton, 
                { backgroundColor: colors.secondary },
                (!selectedUserProduct || !selectedShopProduct) && { backgroundColor: colors.border }
              ]}
              onPress={() => setStep(3)}
              disabled={!selectedUserProduct || !selectedShopProduct}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
              <Feather name="arrow-right" size={20} color="#FFF" />
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <View style={styles.confirmationContainer}>
            <ScrollView>
              <Text style={[styles.confirmationTitle, { color: colors.primary }]}>Trade Summary</Text>
              
              {/* Trade Items */}
              <View style={[styles.tradeCard, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.tradeItem}>
                  <Text style={[styles.tradeLabel, { color: colors.text }]}>You're offering:</Text>
                  <View style={styles.productSummary}>
                    <Image source={{ uri: selectedUserProduct?.image }} style={styles.summaryImage} />
                    <View>
                      <Text style={[styles.productName, { color: colors.primary }]}>{selectedUserProduct?.name}</Text>
                      <Text style={[styles.productValue, { color: colors.secondary }]}>{selectedUserProduct?.value}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.exchangeIcon}>
                  <Feather name="repeat" size={24} color={colors.secondary} />
                </View>

                <View style={styles.tradeItem}>
                  <Text style={[styles.tradeLabel, { color: colors.text }]}>You'll receive:</Text>
                  <View style={styles.productSummary}>
                    <Image source={{ uri: selectedShopProduct?.image }} style={styles.summaryImage} />
                    <View>
                      <Text style={[styles.productName, { color: colors.primary }]}>{selectedShopProduct?.name}</Text>
                      <Text style={[styles.productValue, { color: colors.secondary }]}>{selectedShopProduct?.price}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Shop Info */}
              <View style={[styles.shopCard, { backgroundColor: colors.cardBackground }]}>
                <Image source={{ uri: selectedShop?.image }} style={styles.shopThumbnail} />
                <View>
                  <Text style={[styles.shopName, { color: colors.primary }]}>{selectedShop?.name}</Text>
                  {renderStars(selectedShop?.rating)}
                </View>
              </View>

              {/* Notes */}
              {notes ? (
                <View style={[styles.notesCard, { backgroundColor: colors.cardBackground }]}>
                  <Text style={[styles.label, { color: colors.primary }]}>Your Note:</Text>
                  <Text style={[styles.notesText, { color: colors.text }]}>{notes}</Text>
                </View>
              ) : null}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.backButton, { borderColor: colors.primary }]}
                onPress={() => setStep(2)}
              >
                <Text style={[styles.backButtonText, { color: colors.primary }]}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmButton, 
                  { backgroundColor: isConfirmDisabled ? colors.border : colors.success }
                ]}
                onPress={handleCreateOffer}
                disabled={isConfirmDisabled}
              >
                <Text style={styles.confirmButtonText}>
                  {isConfirmDisabled ? 'Select All Items' : 'Confirm Trade'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerButton: {
    width: 40,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    width: 100,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  shopList: {
    flex: 1,
    padding: 20,
  },
  sectionDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  shopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    marginBottom: 4,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 5,
  },
  shopProducts: {
    fontSize: 12,
  },
  productsContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  productsRow: {
    marginBottom: 25,
  },
  productCard: {
    width: 140,
    marginRight: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  productValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    height: 80,
    textAlignVertical: 'top',
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  confirmationContainer: {
    flex: 1,
    padding: 20,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  tradeCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  tradeItem: {
    marginBottom: 15,
  },
  tradeLabel: {
    fontSize: 16,
    fontWeight: '600',
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
  exchangeIcon: {
    alignItems: 'center',
    marginVertical: 10,
  },
  shopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  shopThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  notesCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  backButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
    fontWeight: '600',
  },
});

export default TradeOffer;