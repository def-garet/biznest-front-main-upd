import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const TradeConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { trade } = route.params || {};

  console.log('🎯 TradeConfirmationScreen received trade:', trade);

  // Default placeholder images using URLs
  const placeholderImages = {
    shop: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&auto=format&fit=crop&q=60',
    product: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150&auto=format&fit=crop&q=60'
  };

  // Safe image source with fallback
  const getImageSource = (uri, type = 'product') => {
    return { uri: uri || placeholderImages[type] };
  };

  if (!trade) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Feather name="alert-triangle" size={64} color="#dc2626" />
          <Text style={styles.errorTitle}>Trade Information Missing</Text>
          <Text style={styles.errorText}>
            Unable to load trade details. Please go back and try again.
          </Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleContinueTrading = () => {
    navigation.navigate('TradeScreen');
  };

  const handleViewOffers = () => {
    navigation.navigate('TradeScreen', { screen: 'offers' });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('TradeScreen')}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trade Confirmation</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <Feather name="check" size={48} color="#ffffff" />
          </View>
          <Text style={styles.successTitle}>Trade Offer Sent!</Text>
          <Text style={styles.successSubtitle}>
            Your trade offer has been successfully submitted to the shop
          </Text>
        </View>

        {/* Trade Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Trade Details</Text>
          
          {/* Shop Information */}
          <View style={styles.shopSection}>
            <Text style={styles.sectionLabel}>Trade Partner</Text>
            <View style={styles.shopInfo}>
              <Image 
                source={getImageSource(trade.shop?.image, 'shop')}
                style={styles.shopImage}
              />
              <View style={styles.shopDetails}>
                <Text style={styles.shopName}>{trade.shop?.name || 'Local Shop'}</Text>
                <View style={styles.ratingContainer}>
                  <Feather name="star" size={16} color="#f59e0b" />
                  <Text style={styles.ratingText}>{trade.shop?.rating || '4.5'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Trade Items */}
          <View style={styles.itemsSection}>
            <Text style={styles.sectionLabel}>Trade Items</Text>
            
            {/* You Give */}
            <View style={styles.tradeItem}>
              <View style={styles.itemHeader}>
                <Feather name="arrow-up-circle" size={20} color="#dc2626" />
                <Text style={styles.itemDirection}>You Give</Text>
              </View>
              <View style={styles.itemDetails}>
                <Image 
                  source={getImageSource(trade.userProduct?.image, 'product')}
                  style={styles.itemImage}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{trade.userProduct?.name || 'Your Product'}</Text>
                  <Text style={styles.itemValue}>{trade.userProduct?.value || '₱0'}</Text>
                </View>
              </View>
            </View>

            {/* Exchange Icon */}
            <View style={styles.exchangeContainer}>
              <Feather name="repeat" size={24} color="#2563eb" />
            </View>

            {/* You Get */}
            <View style={styles.tradeItem}>
              <View style={styles.itemHeader}>
                <Feather name="arrow-down-circle" size={20} color="#059669" />
                <Text style={styles.itemDirection}>You Get</Text>
              </View>
              <View style={styles.itemDetails}>
                <Image 
                  source={getImageSource(trade.shopProduct?.image, 'product')}
                  style={styles.itemImage}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{trade.shopProduct?.name || 'Shop Product'}</Text>
                  <Text style={styles.itemValue}>{trade.shopProduct?.price || '₱0'}</Text>
                  <Text style={styles.shopNameSmall}>{trade.shop?.name}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Notes */}
          {trade.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.sectionLabel}>Your Message</Text>
              <View style={styles.notesContainer}>
                <Text style={styles.notesText}>"{trade.notes}"</Text>
              </View>
            </View>
          )}

          {/* Trade Status */}
          <View style={styles.statusSection}>
            <Text style={styles.sectionLabel}>Status</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusBadge}>
                <Feather name="clock" size={16} color="#d97706" />
                <Text style={styles.statusText}>Pending Approval</Text>
              </View>
              <Text style={styles.statusDescription}>
                The shop owner will review your offer and respond within 24 hours
              </Text>
            </View>
          </View>

          {/* Trade ID */}
          <View style={styles.idSection}>
            <Text style={styles.idLabel}>Trade ID</Text>
            <Text style={styles.idValue}>{trade.id}</Text>
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>What's Next?</Text>
          
          <View style={styles.step}>
            <View style={styles.stepIcon}>
              <Feather name="bell" size={20} color="#2563eb" />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Wait for Response</Text>
              <Text style={styles.stepDescription}>
                You'll receive a notification when the shop accepts or declines your offer
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepIcon}>
              <Feather name="message-circle" size={20} color="#2563eb" />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Communication</Text>
              <Text style={styles.stepDescription}>
                You can message the shop owner to discuss trade details
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepIcon}>
              <Feather name="truck" size={20} color="#2563eb" />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Exchange</Text>
              <Text style={styles.stepDescription}>
                Arrange a meetup or delivery once the trade is accepted
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleContinueTrading}
        >
          <Feather name="plus" size={20} color="#2563eb" />
          <Text style={styles.secondaryButtonText}>Create Another Trade</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleViewOffers}
        >
          <Feather name="list" size={20} color="#ffffff" />
          <Text style={styles.primaryButtonText}>View My Offers</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  headerPlaceholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  shopSection: {
    marginBottom: 24,
  },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  shopDetails: {
    flex: 1,
  },
  shopName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  itemsSection: {
    marginBottom: 24,
  },
  tradeItem: {
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemDirection: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginLeft: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  itemValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },
  shopNameSmall: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  exchangeContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  notesSection: {
    marginBottom: 24,
  },
  notesContainer: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  notesText: {
    fontSize: 16,
    color: '#0f172a',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  statusSection: {
    marginBottom: 24,
  },
  statusContainer: {
    backgroundColor: '#fffbeb',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#d97706',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d97706',
    marginLeft: 8,
  },
  statusDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  idSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  idLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  idValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  nextStepsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  nextStepsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2563eb',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TradeConfirmationScreen;