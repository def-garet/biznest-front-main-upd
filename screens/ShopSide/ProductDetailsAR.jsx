import React from 'react'; // Removed useState
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  primary: '#172d55',
  secondary: '#2196f3',
  background: '#ffffff',
  text: '#808080',
  surface: '#f8f9fa',
  border: '#f0f0f0',
  warning: '#ff9800',
  white: '#ffffff',
};

const ProductDetailsAR = () => {
  const navigation = useNavigation();
  // Removed isARVisible state

  const product = {
    id: '1',
    name: 'Modern Leather Armchair',
    price: '₱12,500.00',
    rating: 4.8,
    reviews: 124,
    description: 'Experience luxury with this hand-stitched leather armchair. Perfect for your living room or office space. Crafted with premium materials for maximum comfort.',
    // IMPORTANT: Use a PNG with transparent background for AR to look good
    image: 'https://www.pngarts.com/files/3/Modern-Chair-PNG-High-Quality-Image.png', 
  };

  const handleARPress = () => {
    // Navigate to the live camera screen and pass the image
    navigation.navigate('ARLiveView', { 
      productImage: product.image 
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="heart" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="share-2" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Hero Image Section */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="contain" />
          
          {/* THE AR TRIGGER BUTTON */}
          <TouchableOpacity 
            style={styles.arButton}
            onPress={handleARPress} // Connects to ARLiveView
            activeOpacity={0.9}
          >
            <View style={styles.arIconCircle}>
              <MaterialCommunityIcons name="cube-scan" size={24} color={COLORS.white} />
            </View>
            <Text style={styles.arButtonText}>View in your room</Text>
          </TouchableOpacity>
        </View>

        {/* Product Info */}
        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{product.rating}</Text>
            </View>
          </View>
          
          <Text style={styles.price}>{product.price}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.specsRow}>
            <View style={styles.specItem}>
              <Feather name="truck" size={20} color={COLORS.secondary} />
              <Text style={styles.specText}>Free Delivery</Text>
            </View>
            <View style={styles.specItem}>
              <Feather name="shield" size={20} color={COLORS.secondary} />
              <Text style={styles.specText}>1 Year Warranty</Text>
            </View>
            <View style={styles.specItem}>
              <Feather name="refresh-ccw" size={20} color={COLORS.secondary} />
              <Text style={styles.specText}>7 Days Return</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.qtyContainer}>
          <TouchableOpacity style={styles.qtyBtn}><Feather name="minus" size={18} color={COLORS.text} /></TouchableOpacity>
          <Text style={styles.qtyText}>1</Text>
          <TouchableOpacity style={styles.qtyBtn}><Feather name="plus" size={18} color={COLORS.text} /></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addToCartBtn}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
          <Feather name="shopping-bag" size={20} color="#FFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 10,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: '#F5F7FA',
  },
  imageContainer: {
    width: '100%',
    height: 350,
    backgroundColor: '#F5F7FA',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  productImage: {
    width: '80%',
    height: '80%',
  },
  arButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 45, 85, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  arIconCircle: {
    marginRight: 8,
  },
  arButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  detailsContainer: {
    padding: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    flex: 1,
    marginRight: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 24,
  },
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 16,
  },
  specItem: {
    alignItems: 'center',
    gap: 8,
  },
  specText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
    gap: 16,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 4,
  },
  qtyBtn: {
    padding: 12,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    width: 20,
    textAlign: 'center',
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  addToCartText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ProductDetailsAR;