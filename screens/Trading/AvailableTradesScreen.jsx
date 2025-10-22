//wala ni ha

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
  FlatList,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AvailableTradesScreen = () => {
  const navigation = useNavigation();
  
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availableProducts, setAvailableProducts] = useState([]);
  const [tradeOffers, setTradeOffers] = useState([]);

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'food', name: 'Food & Beverages' },
    { id: 'handicrafts', name: 'Handicrafts' },
    { id: 'coffee', name: 'Coffee & Tea' },
    { id: 'snacks', name: 'Snacks' },
    { id: 'home', name: 'Home Decor' },
  ];

  // Sample available products from various shops
  const sampleAvailableProducts = [
    {
      id: '1',
      name: 'Artisanal Coffee Beans',
      description: 'Premium locally sourced coffee beans from the highlands',
      value: '₱350',
      category: 'coffee',
      image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300&auto=format&fit=crop&q=60',
      shop: {
        name: 'Madge Coffee',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=60',
        rating: 4.8,
        location: 'Iloilo City'
      },
      tradeFor: ['Handicrafts', 'Snacks', 'Home Decor'],
      isAvailable: true
    },
    {
      id: '2',
      name: 'Handwoven Basket',
      description: 'Traditional handwoven native basket made from local materials',
      value: '₱180',
      category: 'handicrafts',
      image: 'https://images.unsplash.com/photo-1586023492125-27a3ceef34b3?w=300&auto=format&fit=crop&q=60',
      shop: {
        name: 'Native Crafts',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=60',
        rating: 4.6,
        location: 'Guimaras'
      },
      tradeFor: ['Coffee & Tea', 'Food Items'],
      isAvailable: true
    },
    {
      id: '3',
      name: 'Biscocho Original',
      description: 'Crispy, buttery toasted bread with sugar coating',
      value: '₱60',
      category: 'snacks',
      image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=300&auto=format&fit=crop&q=60',
      shop: {
        name: 'Iloilo Biscocho Haus',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=60',
        rating: 4.7,
        location: 'Iloilo City'
      },
      tradeFor: ['Coffee & Tea', 'Other Snacks'],
      isAvailable: true
    },
    {
      id: '4',
      name: 'Barako Coffee Blend',
      description: 'Strong and aromatic Batangas Barako coffee blend',
      value: '₱280',
      category: 'coffee',
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&auto=format&fit=crop&q=60',
      shop: {
        name: 'Coffee Origins',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=60',
        rating: 4.9,
        location: 'Bacolod'
      },
      tradeFor: ['Handicrafts', 'Home Decor', 'Specialty Foods'],
      isAvailable: true
    },
    {
      id: '5',
      name: 'Handmade Ceramic Mug',
      description: 'Artisanal ceramic mug with traditional designs',
      value: '₱220',
      category: 'home',
      image: 'https://images.unsplash.com/photo-1570211776045-af3a51026f4b?w=300&auto=format&fit=crop&q=60',
      shop: {
        name: 'Clay Creations',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=60',
        rating: 4.5,
        location: 'Antique'
      },
      tradeFor: ['Coffee & Tea', 'Snacks', 'Other Handicrafts'],
      isAvailable: true
    },
    {
      id: '6',
      name: 'Piaya Original',
      description: 'Sweet unleavened flatbread with muscovado filling',
      value: '₱120',
      category: 'snacks',
      image: 'https://images.unsplash.com/photo-1555507036-ab794f27d2e9?w=300&auto=format&fit=crop&q=60',
      shop: {
        name: 'Iloilo Delights',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=60',
        rating: 4.8,
        location: 'Iloilo City'
      },
      tradeFor: ['Coffee & Tea', 'Other Local Snacks'],
      isAvailable: true
    }
  ];

  // Sample trade offers from other users
  const sampleTradeOffers = [
    {
      id: 'offer1',
      user: {
        name: 'Maria Santos',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&auto=format&fit=crop&q=60'
      },
      offeredProduct: {
        name: 'Handmade Leather Wallet',
        value: '₱250',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=60',
        category: 'handicrafts'
      },
      wantedProduct: {
        id: '1',
        name: 'Artisanal Coffee Beans',
        value: '₱350'
      },
      message: 'I would love to trade my handmade wallet for your coffee beans! I can add some local snacks to balance the value.',
      status: 'pending',
      createdAt: '2 hours ago'
    },
    {
      id: 'offer2',
      user: {
        name: 'Juan Dela Cruz',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=60'
      },
      offeredProduct: {
        name: 'Handwoven Table Runner',
        value: '₱180',
        image: 'https://images.unsplash.com/photo-1586023492125-27a3ceef34b3?w=300&auto=format&fit=crop&q=60',
        category: 'home'
      },
      wantedProduct: {
        id: '3',
        name: 'Biscocho Original',
        value: '₱60'
      },
      message: 'Looking to trade my table runner for multiple packs of biscocho. Let me know if interested!',
      status: 'pending',
      createdAt: '1 day ago'
    }
  ];

  useEffect(() => {
    setAvailableProducts(sampleAvailableProducts);
    setTradeOffers(sampleTradeOffers);
  }, []);

  // Filter products based on search and category
  const filteredProducts = availableProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.shop.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.isAvailable;
  });

  const handleInitiateTrade = (product) => {
    navigation.navigate('TradeScreen', { 
      preselectedProduct: product 
    });
  };

  const handleRespondToOffer = (offer, action) => {
    if (action === 'accept') {
      Alert.alert('Offer Accepted', `You accepted the trade offer from ${offer.user.name}`);
      // Update offer status
      setTradeOffers(prev => prev.map(o => 
        o.id === offer.id ? { ...o, status: 'accepted' } : o
      ));
    } else {
      Alert.alert('Offer Declined', `You declined the trade offer from ${offer.user.name}`);
      setTradeOffers(prev => prev.map(o => 
        o.id === offer.id ? { ...o, status: 'declined' } : o
      ));
    }
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        
        <View style={styles.shopInfo}>
          <Image source={{ uri: item.shop.image }} style={styles.shopImage} />
          <View style={styles.shopDetails}>
            <Text style={styles.shopName}>{item.shop.name}</Text>
            <View style={styles.shopRating}>
              <Feather name="star" size={12} color="#f59e0b" />
              <Text style={styles.ratingText}>{item.shop.rating}</Text>
              <Text style={styles.shopLocation}>• {item.shop.location}</Text>
            </View>
          </View>
        </View>

        <View style={styles.productDetails}>
          <Text style={styles.productValue}>{item.value}</Text>
          <View style={styles.tradeForContainer}>
            <Text style={styles.tradeForLabel}>Trade for: </Text>
            <Text style={styles.tradeForItems}>{item.tradeFor.join(', ')}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.tradeButton}
          onPress={() => handleInitiateTrade(item)}
        >
          <Feather name="repeat" size={16} color="#FFF" />
          <Text style={styles.tradeButtonText}>Initiate Trade</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTradeOffer = ({ item }) => (
    <View style={styles.tradeOfferCard}>
      <View style={styles.offerHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.user.image }} style={styles.userImage} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.user.name}</Text>
            <View style={styles.ratingContainer}>
              <Feather name="star" size={14} color="#f59e0b" />
              <Text style={styles.rating}>{item.user.rating}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.offerTime}>{item.createdAt}</Text>
      </View>

      <View style={styles.offerContent}>
        <View style={styles.tradeItems}>
          <View style={styles.tradeItem}>
            <Text style={styles.itemLabel}>They offer:</Text>
            <View style={styles.itemWithImage}>
              <Image source={{ uri: item.offeredProduct.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.offeredProduct.name}</Text>
                <Text style={styles.itemValue}>{item.offeredProduct.value}</Text>
              </View>
            </View>
          </View>

          <View style={styles.arrowContainer}>
            <Feather name="arrow-right" size={16} color="#2563eb" />
          </View>

          <View style={styles.tradeItem}>
            <Text style={styles.itemLabel}>For your:</Text>
            <View style={styles.itemWithImage}>
              <View style={[styles.itemImage, styles.placeholderImage]}>
                <Feather name="package" size={16} color="#64748b" />
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.wantedProduct.name}</Text>
                <Text style={styles.itemValue}>{item.wantedProduct.value}</Text>
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
              onPress={() => handleRespondToOffer(item, 'decline')}
            >
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleRespondToOffer(item, 'accept')}
            >
              <Text style={styles.acceptText}>Accept Offer</Text>
            </TouchableOpacity>
          </View>
        )}

        {item.status === 'accepted' && (
          <View style={styles.acceptedBadge}>
            <Feather name="check-circle" size={16} color="#059669" />
            <Text style={styles.acceptedText}>Offer Accepted</Text>
          </View>
        )}

        {item.status === 'declined' && (
          <View style={styles.declinedBadge}>
            <Feather name="x-circle" size={16} color="#dc2626" />
            <Text style={styles.declinedText}>Offer Declined</Text>
          </View>
        )}
      </View>
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
          <Text style={styles.title}>Available Trades</Text>
          <Text style={styles.subtitle}>
            Browse products available for trading
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#64748b" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products, shops, or categories..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Feather name="x" size={20} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories - Reduced height */}
      <View style={styles.categoriesWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.selectedCategoryChip
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'browse' && styles.activeTab]}
          onPress={() => setActiveTab('browse')}
        >
          <Feather
            name="grid"
            size={16}
            color={activeTab === 'browse' ? '#2563eb' : '#64748b'}
          />
          <Text style={[
            styles.tabText,
            activeTab === 'browse' && styles.activeTabText
          ]}>
            Browse Products ({filteredProducts.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'offers' && styles.activeTab]}
          onPress={() => setActiveTab('offers')}
        >
          <Feather
            name="gift"
            size={16}
            color={activeTab === 'offers' ? '#2563eb' : '#64748b'}
          />
          <Text style={[
            styles.tabText,
            activeTab === 'offers' && styles.activeTabText
          ]}>
            Trade Offers ({tradeOffers.filter(o => o.status === 'pending').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'browse' ? (
          filteredProducts.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="package" size={64} color="#cbd5e1" />
              <Text style={styles.emptyStateTitle}>No Products Found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No products available for trade at the moment'
                }
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
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
                When other users send you trade offers, they will appear here
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  // Categories - Reduced height
  categoriesWrapper: {
    maxHeight: 50, // Reduced from default height
    marginBottom: 8,
  },
  categoriesContainer: {
    marginHorizontal: 16,
  },
  categoriesContent: {
    paddingRight: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 6, // Reduced padding
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedCategoryChip: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  selectedCategoryText: {
    color: '#ffffff',
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
    paddingHorizontal: 12,
    gap: 8,
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
    gap: 16,
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
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 20,
  },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  shopImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  shopDetails: {
    flex: 1,
  },
  shopName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  shopRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
    marginRight: 8,
  },
  shopLocation: {
    fontSize: 12,
    color: '#64748b',
  },
  productDetails: {
    marginBottom: 12,
  },
  productValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 4,
  },
  tradeForContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tradeForLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  tradeForItems: {
    fontSize: 14,
    color: '#0f172a',
    flex: 1,
  },
  tradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  tradeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Trade Offer Styles
  tradeOfferCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
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
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
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
  offerTime: {
    fontSize: 12,
    color: '#64748b',
  },
  offerContent: {
    padding: 16,
  },
  tradeItems: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tradeItem: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '500',
  },
  itemWithImage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  placeholderImage: {
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
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
  arrowContainer: {
    paddingHorizontal: 8,
  },
  offerMessage: {
    fontSize: 14,
    color: '#475569',
    fontStyle: 'italic',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    lineHeight: 20,
  },
  offerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 100,
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
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dcfce7',
    padding: 12,
    borderRadius: 6,
    gap: 8,
  },
  acceptedText: {
    color: '#059669',
    fontWeight: '500',
    fontSize: 14,
  },
  declinedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 6,
    gap: 8,
  },
  declinedText: {
    color: '#dc2626',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default AvailableTradesScreen;