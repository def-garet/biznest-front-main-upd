// import React, { useContext, useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   Modal,
//   Image,
//   TextInput,
//   Alert,
//   FlatList,
//   Dimensions,
// } from "react-native";
// import { Feather } from "@expo/vector-icons";
// import { TradeContext } from "./TradeComponent/TradeContext";
// import { useNavigation } from "@react-navigation/native";

// const { width: screenWidth } = Dimensions.get('window');

// const TradeScreen = () => {
//   const tradeContext = useContext(TradeContext);
//   const navigation = useNavigation();

//   const {
//     activeTrades = [],
//     tradeHistory = [],
//     tradeOffers = [],
//     initMockData,
//     createTradeOffer,
//     acceptTrade,
//     rejectTrade,
//     completeTrade,
//   } = tradeContext || {};

//   const [activeTab, setActiveTab] = useState("browse");
//   const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
//   const [selectedUserProduct, setSelectedUserProduct] = useState(null);
//   const [selectedShopProduct, setSelectedShopProduct] = useState(null);
//   const [notes, setNotes] = useState("");
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [showHeader, setShowHeader] = useState(true);

//   // Categories for filtering
//   const categories = [
//     { id: 'all', name: 'All Products' },
//     { id: 'food', name: 'Food & Beverages' },
//     { id: 'handicrafts', name: 'Handicrafts' },
//     { id: 'coffee', name: 'Coffee & Tea' },
//     { id: 'snacks', name: 'Snacks' },
//     { id: 'home', name: 'Home Decor' },
//   ];

//   const userProducts = [
//     {
//       id: "u1",
//       name: "Hablon Wallet",
//       image:
//         "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=60",
//       value: "₱250",
//     },
//     {
//       id: "u2",
//       name: "Barako Coffee",
//       image:
//         "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300&auto=format&fit=crop&q=60",
//       value: "₱350",
//     },
//     {
//       id: "u3",
//       name: "Piaya Original",
//       image:
//         "https://images.unsplash.com/photo-1555507036-ab794f27d2e9?w=300&auto=format&fit=crop&q=60",
//       value: "₱120",
//     },
//     {
//       id: "u4",
//       name: "Handwoven Basket",
//       image:
//         "https://images.unsplash.com/photo-1586023492125-27a3ceef34b3?w=300&auto=format&fit=crop&q=60",
//       value: "₱180",
//     },
//   ];

//   // Sample available products from various shops
//   const availableProducts = [
//     {
//       id: '1',
//       name: 'Artisanal Coffee Beans',
//       description: 'Premium locally sourced coffee beans from the highlands',
//       value: '₱350',
//       category: 'coffee',
//       image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300&auto=format&fit=crop&q=60',
//       shop: {
//         name: 'Madge Coffee',
//         image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=60',
//         rating: 4.8,
//         location: 'Iloilo City'
//       },
//       tradeFor: ['Handicrafts', 'Snacks', 'Home Decor'],
//       isAvailable: true
//     },
//     {
//       id: '2',
//       name: 'Handwoven Basket',
//       description: 'Traditional handwoven native basket made from local materials',
//       value: '₱180',
//       category: 'handicrafts',
//       image: 'https://images.unsplash.com/photo-1586023492125-27a3ceef34b3?w=300&auto=format&fit=crop&q=60',
//       shop: {
//         name: 'Native Crafts',
//         image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=60',
//         rating: 4.6,
//         location: 'Guimaras'
//       },
//       tradeFor: ['Coffee & Tea', 'Food Items'],
//       isAvailable: true
//     },
//     {
//       id: '3',
//       name: 'Biscocho Original',
//       description: 'Crispy, buttery toasted bread with sugar coating',
//       value: '₱60',
//       category: 'snacks',
//       image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=300&auto=format&fit=crop&q=60',
//       shop: {
//         name: 'Iloilo Biscocho Haus',
//         image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=60',
//         rating: 4.7,
//         location: 'Iloilo City'
//       },
//       tradeFor: ['Coffee & Tea', 'Other Snacks'],
//       isAvailable: true
//     },
//     {
//       id: '4',
//       name: 'Barako Coffee Blend',
//       description: 'Strong and aromatic Batangas Barako coffee blend',
//       value: '₱280',
//       category: 'coffee',
//       image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&auto=format&fit=crop&q=60',
//       shop: {
//         name: 'Coffee Origins',
//         image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=60',
//         rating: 4.9,
//         location: 'Bacolod'
//       },
//       tradeFor: ['Handicrafts', 'Home Decor', 'Specialty Foods'],
//       isAvailable: true
//     },
//     {
//       id: '5',
//       name: 'Handmade Ceramic Mug',
//       description: 'Artisanal ceramic mug with traditional designs',
//       value: '₱220',
//       category: 'home',
//       image: 'https://images.unsplash.com/photo-1570211776045-af3a51026f4b?w=300&auto=format&fit=crop&q=60',
//       shop: {
//         name: 'Clay Creations',
//         image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=60',
//         rating: 4.5,
//         location: 'Antique'
//       },
//       tradeFor: ['Coffee & Tea', 'Snacks', 'Other Handicrafts'],
//       isAvailable: true
//     },
//     {
//       id: '6',
//       name: 'Piaya Original',
//       description: 'Sweet unleavened flatbread with muscovado filling',
//       value: '₱120',
//       category: 'snacks',
//       image: 'https://images.unsplash.com/photo-1555507036-ab794f27d2e9?w=300&auto=format&fit=crop&q=60',
//       shop: {
//         name: 'Iloilo Delights',
//         image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=60',
//         rating: 4.8,
//         location: 'Iloilo City'
//       },
//       tradeFor: ['Coffee & Tea', 'Other Local Snacks'],
//       isAvailable: true
//     },
//     {
//       id: '7',
//       name: 'Native Placemat Set',
//       description: 'Set of 4 handwoven placemats with traditional patterns',
//       value: '₱200',
//       category: 'home',
//       image: 'https://images.unsplash.com/photo-1586023492125-27a3ceef34b3?w=300&auto=format&fit=crop&q=60',
//       shop: {
//         name: 'Native Crafts',
//         image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=60',
//         rating: 4.6,
//         location: 'Guimaras'
//       },
//       tradeFor: ['Coffee & Tea', 'Food Items', 'Snacks'],
//       isAvailable: true
//     },
//     {
//       id: '8',
//       name: 'Specialty Tea Collection',
//       description: 'Assorted local herbal teas from the region',
//       value: '₱180',
//       category: 'coffee',
//       image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&auto=format&fit=crop&q=60',
//       shop: {
//         name: 'Tea Haven',
//         image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=60',
//         rating: 4.7,
//         location: 'Iloilo City'
//       },
//       tradeFor: ['Handicrafts', 'Home Decor', 'Coffee'],
//       isAvailable: true
//     }
//   ];

//   // Mock trade data
//   const mockTradeOffers = [
//     {
//       id: 'offer1',
//       from: "Madge Coffee",
//       status: "pending",
//       itemsOffered: [{
//         name: "Artisanal Coffee Beans",
//         value: "₱350",
//         image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300&auto=format&fit=crop&q=60"
//       }],
//       itemsRequested: [{
//         name: "Hablon Wallet",
//         price: "₱250",
//         image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=60"
//       }],
//       message: "Would love to trade our premium coffee beans for your handmade wallet!"
//     }
//   ];

//   const mockActiveTrades = [
//     {
//       id: 'active1',
//       recipient: "Native Crafts",
//       status: "active",
//       itemsOffered: [{
//         name: "Barako Coffee",
//         value: "₱350",
//         image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300&auto=format&fit=crop&q=60"
//       }],
//       itemsRequested: [{
//         name: "Handwoven Basket",
//         price: "₱180",
//         image: "https://images.unsplash.com/photo-1586023492125-27a3ceef34b3?w=300&auto=format&fit=crop&q=60"
//       }]
//     }
//   ];

//   const mockTradeHistory = [
//     {
//       id: 'history1',
//       recipient: "Iloilo Biscocho Haus",
//       status: "completed",
//       itemsOffered: [{
//         name: "Piaya Original",
//         value: "₱120",
//         image: "https://images.unsplash.com/photo-1555507036-ab794f27d2e9?w=300&auto=format&fit=crop&q=60"
//       }],
//       itemsRequested: [{
//         name: "Biscocho Original",
//         price: "₱60",
//         image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=300&auto=format&fit=crop&q=60"
//       }]
//     }
//   ];

//   useEffect(() => {
//     if (initMockData) {
//       initMockData();
//     }
//   }, []);

//   // Use mock data if context data is empty
//   const displayTradeOffers = tradeOffers.length > 0 ? tradeOffers : mockTradeOffers;
//   const displayActiveTrades = activeTrades.length > 0 ? activeTrades : mockActiveTrades;
//   const displayTradeHistory = tradeHistory.length > 0 ? tradeHistory : mockTradeHistory;

//   // Filter products based on search and category
//   const filteredProducts = availableProducts.filter(product => {
//     const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          product.shop.name.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
//     return matchesSearch && matchesCategory && product.isAvailable;
//   });

//   const handleCreateTrade = () => {
//     if (!selectedUserProduct || !selectedShopProduct) {
//       Alert.alert(
//         "Missing Information",
//         "Please select both products to trade"
//       );
//       return;
//     }

//     const newTrade = {
//       id: `trade-${Date.now()}`,
//       shop: {
//         name: selectedShopProduct.shop,
//         image: selectedShopProduct.shopImage,
//         rating: 4.5,
//       },
//       userProduct: selectedUserProduct,
//       shopProduct: selectedShopProduct,
//       notes,
//       status: "pending",
//       createdAt: new Date().toISOString(),
//     };

//     if (createTradeOffer) {
//       createTradeOffer(newTrade);
//     }

//     setIsCreateModalVisible(false);
//     resetSelection();

//     Alert.alert(
//       "Trade Offer Created",
//       "Your trade offer has been sent successfully!",
//       [{ text: "OK" }]
//     );
//   };

//   const resetSelection = () => {
//     setSelectedUserProduct(null);
//     setSelectedShopProduct(null);
//     setNotes("");
//   };

//   const handleInitiateTrade = (product) => {
//     setIsCreateModalVisible(true);
//     // Pre-select the shop product when initiating trade from browse
//     const shopProduct = {
//       id: product.id,
//       name: product.name,
//       image: product.image,
//       price: product.value,
//       shop: product.shop.name,
//       shopImage: product.shop.image,
//     };
//     setSelectedShopProduct(shopProduct);
//   };

//   const handleAcceptTrade = (tradeId) => {
//     if (acceptTrade) {
//       acceptTrade(tradeId);
//     }
//     Alert.alert("Trade Accepted", "You have accepted the trade offer!");
//   };

//   const handleRejectTrade = (tradeId) => {
//     if (rejectTrade) {
//       rejectTrade(tradeId);
//     }
//     Alert.alert("Trade Declined", "You have declined the trade offer.");
//   };

//   const handleCompleteTrade = (tradeId) => {
//     if (completeTrade) {
//       completeTrade(tradeId);
//     }
//     Alert.alert("Trade Completed", "The trade has been marked as complete!");
//   };

//   const renderProductItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.productCard}
//       onPress={() => handleInitiateTrade(item)}
//     >
//       <Image source={{ uri: item.image }} style={styles.productImage} />
//       <View style={styles.productInfo}>
//         <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
//         <Text style={styles.productDescription} numberOfLines={2}>
//           {item.description}
//         </Text>
        
//         <View style={styles.shopInfo}>
//           <Image source={{ uri: item.shop.image }} style={styles.shopImage} />
//           <View style={styles.shopDetails}>
//             <Text style={styles.shopName} numberOfLines={1}>{item.shop.name}</Text>
//             <View style={styles.shopRating}>
//               <Feather name="star" size={12} color="#f59e0b" />
//               <Text style={styles.ratingText}>{item.shop.rating}</Text>
//               <Text style={styles.shopLocation}>• {item.shop.location}</Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.productDetails}>
//           <Text style={styles.productValue}>{item.value}</Text>
//           <View style={styles.tradeForContainer}>
//             <Text style={styles.tradeForLabel}>Trade for: </Text>
//             <Text style={styles.tradeForItems} numberOfLines={1}>
//               {item.tradeFor.join(', ')}
//             </Text>
//           </View>
//         </View>

//         <TouchableOpacity
//           style={styles.tradeButton}
//           onPress={() => handleInitiateTrade(item)}
//         >
//           <Feather name="repeat" size={16} color="#FFF" />
//           <Text style={styles.tradeButtonText}>Trade</Text>
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderTradeCard = ({ trade, tab }) => (
//     <View key={trade.id} style={styles.tradeCard}>
//       <View style={styles.tradeHeader}>
//         <Text style={styles.shopName}>
//           {tab === "offers" ? trade.from : trade.recipient}
//         </Text>
//         <Text
//           style={[
//             styles.tradeStatus,
//             {
//               backgroundColor:
//                 trade.status === "pending"
//                   ? "#fef3c7"
//                   : trade.status === "active"
//                   ? "#dbeafe"
//                   : "#dcfce7",
//             },
//           ]}
//         >
//           {trade.status?.charAt(0).toUpperCase() + trade.status?.slice(1)}
//         </Text>
//       </View>

//       <View style={styles.tradeItems}>
//         <View style={styles.item}>
//           <Text style={styles.itemLabel}>You give:</Text>
//           <View style={styles.itemWithImage}>
//             <Image
//               source={{ uri: trade.itemsOffered?.[0]?.image }}
//               style={styles.itemImage}
//             />
//             <View>
//               <Text style={styles.itemName}>
//                 {trade.itemsOffered?.[0]?.name}
//               </Text>
//               <Text style={styles.itemValue}>
//                 {trade.itemsOffered?.[0]?.value}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <Feather
//           name="repeat"
//           size={16}
//           color="#94a3b8"
//           style={styles.exchangeIcon}
//         />

//         <View style={styles.item}>
//           <Text style={styles.itemLabel}>You get:</Text>
//           <View style={styles.itemWithImage}>
//             <Image
//               source={{ uri: trade.itemsRequested?.[0]?.image }}
//               style={styles.itemImage}
//             />
//             <View>
//               <Text style={styles.itemName}>
//                 {trade.itemsRequested?.[0]?.name}
//               </Text>
//               <Text style={styles.itemValue}>
//                 {trade.itemsRequested?.[0]?.price}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </View>

//       {trade.message && (
//         <Text style={styles.tradeMessage}>"{trade.message}"</Text>
//       )}

//       {tab === "offers" && (
//         <View style={styles.actions}>
//           <TouchableOpacity
//             style={[styles.button, styles.declineButton]}
//             onPress={() => handleRejectTrade(trade.id)}
//           >
//             <Text style={styles.declineText}>Decline</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.button, styles.acceptButton]}
//             onPress={() => handleAcceptTrade(trade.id)}
//           >
//             <Text style={styles.acceptText}>Accept</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {tab === "active" && (
//         <View style={styles.actions}>
//           <TouchableOpacity
//             style={[styles.button, styles.completeButton]}
//             onPress={() => handleCompleteTrade(trade.id)}
//           >
//             <Text style={styles.completeText}>Mark Complete</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );

//   const handleScroll = (event) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
//     if (offsetY > 50 && showHeader) {
//       setShowHeader(false);
//     } else if (offsetY <= 50 && !showHeader) {
//       setShowHeader(true);
//     }
//   };

//   const renderBrowseContent = () => (
//     <View style={styles.browseContainer}>
//       {/* Search and Categories Section */}
//       {showHeader && (
//         <View style={styles.searchSection}>
//           {/* Search Bar */}
//           <View style={styles.searchContainer}>
//             <Feather name="search" size={20} color="#64748b" style={styles.searchIcon} />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search products, shops, or categories..."
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//             />
//             {searchQuery.length > 0 && (
//               <TouchableOpacity 
//                 onPress={() => setSearchQuery('')}
//                 style={styles.clearButton}
//               >
//                 <Feather name="x" size={20} color="#64748b" />
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* Categories */}
//           <View style={styles.categoriesWrapper}>
//             <ScrollView 
//               horizontal 
//               showsHorizontalScrollIndicator={false}
//               style={styles.categoriesContainer}
//               contentContainerStyle={styles.categoriesContent}
//             >
//               {categories.map(category => (
//                 <TouchableOpacity
//                   key={category.id}
//                   style={[
//                     styles.categoryChip,
//                     selectedCategory === category.id && styles.selectedCategoryChip
//                   ]}
//                   onPress={() => setSelectedCategory(category.id)}
//                 >
//                   <Text style={[
//                     styles.categoryText,
//                     selectedCategory === category.id && styles.selectedCategoryText
//                   ]}>
//                     {category.name}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </View>
//       )}

//       {/* Products Grid */}
//       {filteredProducts.length === 0 ? (
//         <View style={styles.emptyState}>
//           <Feather name="package" size={64} color="#cbd5e1" />
//           <Text style={styles.emptyStateTitle}>No Products Found</Text>
//           <Text style={styles.emptyStateText}>
//             {searchQuery || selectedCategory !== 'all' 
//               ? 'Try adjusting your search or filters'
//               : 'No products available for trade at the moment'
//             }
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredProducts}
//           renderItem={renderProductItem}
//           keyExtractor={item => item.id}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={[
//             styles.gridContent,
//             !showHeader && styles.gridContentNoHeader
//           ]}
//           numColumns={2}
//           onScroll={handleScroll}
//           scrollEventThrottle={16}
//         />
//       )}
//     </View>
//   );

//   const renderContent = () => {
//     let data = [];
//     let emptyMessage = "";

//     switch (activeTab) {
//       case "browse":
//         return renderBrowseContent();
//       case "offers":
//         data = displayTradeOffers;
//         emptyMessage = "No trade offers available";
//         break;
//       case "active":
//         data = displayActiveTrades;
//         emptyMessage = "No active trades";
//         break;
//       case "history":
//         data = displayTradeHistory;
//         emptyMessage = "No trade history";
//         break;
//       default:
//         data = [];
//     }

//     if (data.length === 0 && activeTab !== "browse") {
//       return (
//         <View style={styles.emptyState}>
//           <Feather name="shopping-bag" size={64} color="#cbd5e1" />
//           <Text style={styles.emptyStateTitle}>{emptyMessage}</Text>
//           <Text style={styles.emptyStateText}>
//             {activeTab === "offers"
//               ? "When shops send you trade offers, they will appear here."
//               : activeTab === "active"
//               ? "Your ongoing trades will appear here."
//               : "Your completed trades will appear here."}
//           </Text>
//           {activeTab === "offers" && (
//             <TouchableOpacity
//               style={styles.createTradeButton}
//               onPress={() => setIsCreateModalVisible(true)}
//             >
//               <Text style={styles.createTradeButtonText}>
//                 Create Your First Trade
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       );
//     }

//     if (activeTab !== "browse") {
//       return (
//         <ScrollView style={styles.tradesContainer} showsVerticalScrollIndicator={false}>
//           <View style={styles.tradesList}>
//             {data.map((trade) => renderTradeCard({ trade, tab: activeTab }))}
//           </View>
//         </ScrollView>
//       );
//     }
//   };

//   const getTabCount = (tab) => {
//     switch (tab) {
//       case "browse":
//         return "";
//       case "offers":
//         return displayTradeOffers.length;
//       case "active":
//         return displayActiveTrades.length;
//       case "history":
//         return displayTradeHistory.length;
//       default:
//         return 0;
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       {showHeader && (
//         <View style={styles.header}>
//           <TouchableOpacity 
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}
//           >
//             <Feather name="arrow-left" size={24} color="#0f172a" />
//           </TouchableOpacity>
//           <View style={styles.headerContent}>
//             <Text style={styles.title}>Trade Center</Text>
//             <Text style={styles.subtitle}>
//               Exchange products with local shops
//             </Text>
//           </View>
//           <TouchableOpacity
//             style={styles.newTradeButton}
//             onPress={() => setIsCreateModalVisible(true)}
//           >
//             <Feather name="plus" size={20} color="#FFF" />
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Tabs */}
//       {showHeader && (
//         <View style={styles.tabs}>
//           {[
//             { key: "browse", label: "Browse", icon: "grid" },
//             { key: "offers", label: "Offers", icon: "gift" },
//             { key: "active", label: "Active", icon: "refresh-cw" },
//             { key: "history", label: "History", icon: "check-circle" },
//           ].map((tab) => (
//             <TouchableOpacity
//               key={tab.key}
//               style={[styles.tab, activeTab === tab.key && styles.activeTab]}
//               onPress={() => setActiveTab(tab.key)}
//             >
//               <Feather
//                 name={tab.icon}
//                 size={16}
//                 color={activeTab === tab.key ? "#2563eb" : "#64748b"}
//               />
//               <Text
//                 style={[
//                   styles.tabText,
//                   activeTab === tab.key && styles.activeTabText,
//                 ]}
//               >
//                 {tab.label} {getTabCount(tab.key) && `(${getTabCount(tab.key)})`}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}

//       {/* Content */}
//       <View style={[
//         styles.content,
//         !showHeader && styles.contentNoHeader
//       ]}>
//         {renderContent()}
//       </View>

//       {/* Create Trade Modal */}
//       <Modal
//         visible={isCreateModalVisible}
//         animationType="slide"
//         presentationStyle="pageSheet"
//         onRequestClose={() => {
//           setIsCreateModalVisible(false);
//           resetSelection();
//         }}
//       >
//         <SafeAreaView style={styles.modalContainer}>
//           {/* Modal Header */}
//           <View style={styles.modalHeader}>
//             <TouchableOpacity
//               onPress={() => {
//                 setIsCreateModalVisible(false);
//                 resetSelection();
//               }}
//               style={styles.modalCloseButton}
//             >
//               <Feather name="x" size={24} color="#0f172a" />
//             </TouchableOpacity>
//             <Text style={styles.modalTitle}>Create Trade Offer</Text>
//             <View style={styles.modalCloseButton} />
//           </View>

//           <ScrollView style={styles.modalContent}>
//             {/* Your Products Section */}
//             <Text style={styles.sectionTitle}>Select Your Product</Text>
//             <Text style={styles.sectionDescription}>
//               Choose which product you want to trade
//             </Text>

//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               style={styles.productsScroll}
//             >
//               {userProducts.map((product) => (
//                 <TouchableOpacity
//                   key={product.id}
//                   style={[
//                     styles.modalProductCard,
//                     selectedUserProduct?.id === product.id &&
//                       styles.selectedProductCard,
//                   ]}
//                   onPress={() => setSelectedUserProduct(product)}
//                 >
//                   <Image
//                     source={{ uri: product.image }}
//                     style={styles.modalProductImage}
//                   />
//                   <View style={styles.modalProductInfo}>
//                     <Text style={styles.modalProductName}>{product.name}</Text>
//                     <Text style={styles.modalProductPrice}>{product.value}</Text>
//                   </View>
//                   {selectedUserProduct?.id === product.id && (
//                     <View style={styles.selectedBadge}>
//                       <Feather name="check" size={16} color="#FFF" />
//                     </View>
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>

//             {/* Shop Products Section */}
//             <Text style={styles.sectionTitle}>Select Product to Receive</Text>
//             <Text style={styles.sectionDescription}>
//               Choose which product you want in return
//             </Text>

//             {selectedShopProduct && (
//               <View style={styles.preSelectedProduct}>
//                 <Image
//                   source={{ uri: selectedShopProduct.image }}
//                   style={styles.preSelectedImage}
//                 />
//                 <View style={styles.preSelectedInfo}>
//                   <Text style={styles.preSelectedName}>{selectedShopProduct.name}</Text>
//                   <Text style={styles.preSelectedPrice}>{selectedShopProduct.price}</Text>
//                   <Text style={styles.preSelectedShop}>{selectedShopProduct.shop}</Text>
//                 </View>
//                 <Feather name="check" size={20} color="#059669" />
//               </View>
//             )}

//             {!selectedShopProduct && (
//               <Text style={styles.noProductSelected}>
//                 Select a product from the Browse tab to trade for
//               </Text>
//             )}

//             {/* Notes Section */}
//             <Text style={styles.sectionTitle}>Add Note (Optional)</Text>
//             <TextInput
//               style={styles.notesInput}
//               placeholder="Add a message to the shop owner..."
//               placeholderTextColor="#94a3b8"
//               multiline
//               numberOfLines={3}
//               value={notes}
//               onChangeText={setNotes}
//             />

//             {/* Trade Summary */}
//             {(selectedUserProduct || selectedShopProduct) && (
//               <View style={styles.tradeSummary}>
//                 <Text style={styles.summaryTitle}>Trade Summary</Text>
//                 <View style={styles.summaryContent}>
//                   <View style={styles.summaryItem}>
//                     <Image
//                       source={{ uri: selectedUserProduct?.image }}
//                       style={styles.summaryImage}
//                     />
//                     <View>
//                       <Text style={styles.summaryName}>
//                         You give: {selectedUserProduct?.name}
//                       </Text>
//                       <Text style={styles.summaryValue}>
//                         {selectedUserProduct?.value}
//                       </Text>
//                     </View>
//                   </View>

//                   <Feather
//                     name="repeat"
//                     size={20}
//                     color="#2563eb"
//                     style={styles.summaryIcon}
//                   />

//                   <View style={styles.summaryItem}>
//                     <Image
//                       source={{ uri: selectedShopProduct?.image }}
//                       style={styles.summaryImage}
//                     />
//                     <View>
//                       <Text style={styles.summaryName}>
//                         You get: {selectedShopProduct?.name}
//                       </Text>
//                       <Text style={styles.summaryValue}>
//                         {selectedShopProduct?.price}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//               </View>
//             )}
//           </ScrollView>

//           {/* Modal Footer */}
//           <View style={styles.modalFooter}>
//             <TouchableOpacity
//               style={[
//                 styles.createButton,
//                 (!selectedUserProduct || !selectedShopProduct) &&
//                   styles.createButtonDisabled,
//               ]}
//               onPress={handleCreateTrade}
//               disabled={!selectedUserProduct || !selectedShopProduct}
//             >
//               <Text style={styles.createButtonText}>Create Trade Offer</Text>
//             </TouchableOpacity>
//           </View>
//         </SafeAreaView>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 16,
//     backgroundColor: "#ffffff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#f1f5f9",
//   },
//   backButton: {
//     padding: 4,
//     marginRight: 8,
//   },
//   headerContent: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     color: "#0f172a",
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#64748b",
//     fontWeight: "400",
//   },
//   newTradeButton: {
//     backgroundColor: "#2563eb",
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#2563eb",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   tabs: {
//     flexDirection: "row",
//     backgroundColor: "#ffffff",
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f1f5f9",
//   },
//   tab: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 12,
//     marginHorizontal: 2,
//     borderRadius: 8,
//   },
//   activeTab: {
//     backgroundColor: "#f8fafc",
//   },
//   tabText: {
//     fontSize: 12,
//     fontWeight: "500",
//     color: "#64748b",
//     marginLeft: 4,
//   },
//   activeTabText: {
//     color: "#2563eb",
//     fontWeight: "600",
//   },
//   content: {
//     flex: 1,
//   },
//   contentNoHeader: {
//     marginTop: 0,
//   },
//   // Browse Tab Styles
//   browseContainer: {
//     flex: 1,
//   },
//   searchSection: {
//     backgroundColor: '#ffffff',
//     paddingBottom: 8,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     margin: 16,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#f8fafc',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//   },
//   searchIcon: {
//     marginRight: 12,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#0f172a',
//     paddingVertical: 4,
//   },
//   clearButton: {
//     padding: 4,
//     marginLeft: 8,
//   },
//   categoriesWrapper: {
//     maxHeight: 50,
//     marginBottom: 8,
//   },
//   categoriesContainer: {
//     marginHorizontal: 16,
//   },
//   categoriesContent: {
//     paddingRight: 16,
//     gap: 8,
//   },
//   categoryChip: {
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 20,
//     backgroundColor: '#f1f5f9',
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//   },
//   selectedCategoryChip: {
//     backgroundColor: '#2563eb',
//     borderColor: '#2563eb',
//   },
//   categoryText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#64748b',
//   },
//   selectedCategoryText: {
//     color: '#ffffff',
//   },
//   // Grid Layout Styles
//   gridContent: {
//     padding: 8,
//     paddingTop: 8,
//   },
//   gridContentNoHeader: {
//     paddingTop: 8,
//   },
//   productCard: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     margin: 8,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: '#f1f5f9',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//     maxWidth: (screenWidth - 32) / 2,
//   },
//   productImage: {
//     width: '100%',
//     height: 120,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   productInfo: {
//     flex: 1,
//   },
//   productName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#0f172a',
//     marginBottom: 4,
//     lineHeight: 18,
//   },
//   productDescription: {
//     fontSize: 12,
//     color: '#64748b',
//     marginBottom: 8,
//     lineHeight: 16,
//   },
//   shopInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   shopImage: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     marginRight: 8,
//   },
//   shopDetails: {
//     flex: 1,
//   },
//   shopName: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#0f172a',
//     marginBottom: 2,
//   },
//   shopRating: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   ratingText: {
//     fontSize: 10,
//     color: '#64748b',
//     marginLeft: 4,
//   },
//   shopLocation: {
//     fontSize: 10,
//     color: '#64748b',
//   },
//   productDetails: {
//     marginBottom: 8,
//   },
//   productValue: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#2563eb',
//     marginBottom: 4,
//   },
//   tradeForContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   tradeForLabel: {
//     fontSize: 11,
//     color: '#64748b',
//     fontWeight: '500',
//   },
//   tradeForItems: {
//     fontSize: 11,
//     color: '#0f172a',
//     flex: 1,
//   },
//   tradeButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#2563eb',
//     paddingVertical: 8,
//     borderRadius: 6,
//     gap: 4,
//   },
//   tradeButtonText: {
//     color: '#ffffff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   emptyState: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 40,
//   },
//   emptyStateTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#0f172a',
//     marginTop: 16,
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   emptyStateText: {
//     fontSize: 14,
//     color: '#64748b',
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   // Trades List Styles
//   tradesContainer: {
//     flex: 1,
//   },
//   tradesList: {
//     gap: 12,
//     padding: 16,
//   },
//   tradeCard: {
//     backgroundColor: "#ffffff",
//     borderRadius: 16,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: "#f1f5f9",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   tradeHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   shopName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#0f172a",
//   },
//   tradeStatus: {
//     fontSize: 12,
//     fontWeight: "500",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   tradeItems: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   item: {
//     flex: 1,
//   },
//   itemLabel: {
//     fontSize: 12,
//     color: "#64748b",
//     marginBottom: 8,
//     fontWeight: "500",
//   },
//   itemWithImage: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   itemImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 8,
//     marginRight: 12,
//   },
//   itemName: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#0f172a",
//     marginBottom: 2,
//   },
//   itemValue: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#2563eb",
//   },
//   exchangeIcon: {
//     marginHorizontal: 12,
//   },
//   tradeMessage: {
//     fontSize: 14,
//     color: "#475569",
//     fontStyle: "italic",
//     backgroundColor: "#f8fafc",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   actions: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     gap: 8,
//   },
//   button: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//     borderWidth: 1,
//   },
//   declineButton: {
//     borderColor: "#fecaca",
//     backgroundColor: "#fef2f2",
//   },
//   declineText: {
//     color: "#dc2626",
//     fontWeight: "500",
//   },
//   acceptButton: {
//     borderColor: "#bbf7d0",
//     backgroundColor: "#f0fdf4",
//   },
//   acceptText: {
//     color: "#059669",
//     fontWeight: "500",
//   },
//   completeButton: {
//     borderColor: "#bbf7d0",
//     backgroundColor: "#f0fdf4",
//   },
//   completeText: {
//     color: "#059669",
//     fontWeight: "500",
//   },
//   createTradeButton: {
//     backgroundColor: "#2563eb",
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   createTradeButtonText: {
//     color: "#ffffff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   // Modal Styles
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f1f5f9",
//   },
//   modalCloseButton: {
//     width: 40,
//     alignItems: "flex-start",
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#0f172a",
//   },
//   modalContent: {
//     flex: 1,
//     padding: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#0f172a",
//     marginBottom: 8,
//   },
//   sectionDescription: {
//     fontSize: 14,
//     color: "#64748b",
//     marginBottom: 16,
//   },
//   productsScroll: {
//     marginBottom: 24,
//   },
//   modalProductCard: {
//     width: 160,
//     marginRight: 12,
//     padding: 12,
//     backgroundColor: "#f8fafc",
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: "#f1f5f9",
//     position: "relative",
//   },
//   selectedProductCard: {
//     borderColor: "#2563eb",
//     backgroundColor: "#f0f9ff",
//   },
//   modalProductImage: {
//     width: "100%",
//     height: 100,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   modalProductInfo: {
//     flex: 1,
//   },
//   modalProductName: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#0f172a",
//     marginBottom: 4,
//   },
//   modalProductPrice: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#2563eb",
//     marginBottom: 2,
//   },
//   selectedBadge: {
//     position: "absolute",
//     top: 8,
//     right: 8,
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: "#2563eb",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   preSelectedProduct: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f0fdf4',
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#bbf7d0',
//     marginBottom: 16,
//   },
//   preSelectedImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     marginRight: 12,
//   },
//   preSelectedInfo: {
//     flex: 1,
//   },
//   preSelectedName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#0f172a',
//     marginBottom: 4,
//   },
//   preSelectedPrice: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#059669',
//     marginBottom: 2,
//   },
//   preSelectedShop: {
//     fontSize: 14,
//     color: '#64748b',
//   },
//   noProductSelected: {
//     fontSize: 14,
//     color: '#64748b',
//     fontStyle: 'italic',
//     textAlign: 'center',
//     padding: 20,
//     backgroundColor: '#f8fafc',
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   notesInput: {
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     color: "#0f172a",
//     minHeight: 80,
//     textAlignVertical: "top",
//     marginBottom: 24,
//   },
//   tradeSummary: {
//     backgroundColor: "#f8fafc",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 24,
//   },
//   summaryTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#0f172a",
//     marginBottom: 12,
//   },
//   summaryContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   summaryItem: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   summaryImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 8,
//     marginRight: 12,
//   },
//   summaryName: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#0f172a",
//     marginBottom: 2,
//   },
//   summaryValue: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#2563eb",
//   },
//   summaryIcon: {
//     marginHorizontal: 16,
//   },
//   modalFooter: {
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: "#f1f5f9",
//   },
//   createButton: {
//     backgroundColor: "#2563eb",
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   createButtonDisabled: {
//     backgroundColor: "#cbd5e1",
//   },
//   createButtonText: {
//     color: "#ffffff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

// export default TradeScreen;

import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Image,
  TextInput,
  Alert,
  FlatList,
  Dimensions,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { TradeContext } from "./TradeComponent/TradeContext";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get('window');

// Create animated components
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const TradeScreen = () => {
  const tradeContext = useContext(TradeContext);
  const navigation = useNavigation();

  const {
    activeTrades = [],
    tradeHistory = [],
    tradeOffers = [],
    initMockData,
    createTradeOffer,
    acceptTrade,
    rejectTrade,
    completeTrade,
  } = tradeContext || {};

  const [activeTab, setActiveTab] = useState("browse");
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedUserProduct, setSelectedUserProduct] = useState(null);
  const [selectedShopProduct, setSelectedShopProduct] = useState(null);
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const headerHeight = 180;
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const scrollDirection = useRef('down');
  
  // Improved animation: hide completely when scrolling down, show when scrolling up
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'food', name: 'Food & Beverages' },
    { id: 'handicrafts', name: 'Handicrafts' },
    { id: 'coffee', name: 'Coffee & Tea' },
    { id: 'snacks', name: 'Snacks' },
    { id: 'home', name: 'Home Decor' },
  ];

  const userProducts = [
    {
      id: "u1",
      name: "Hablon Wallet",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=60",
      value: "₱250",
    },
    {
      id: "u2",
      name: "Barako Coffee",
      image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300&auto=format&fit=crop&q=60",
      value: "₱350",
    },
    {
      id: "u3",
      name: "Piaya Original",
      image: "https://images.unsplash.com/photo-1555507036-ab794f27d2e9?w=300&auto=format&fit=crop&q=60",
      value: "₱120",
    },
    {
      id: "u4",
      name: "Handwoven Basket",
      image: "https://images.unsplash.com/photo-1586023492125-27a3ceef34b3?w=300&auto=format&fit=crop&q=60",
      value: "₱180",
    },
  ];

  const availableProducts = [
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
    },
    {
      id: '7',
      name: 'Native Placemat Set',
      description: 'Set of 4 handwoven placemats with traditional patterns',
      value: '₱200',
      category: 'home',
      image: 'https://images.unsplash.com/photo-1586023492125-27a3ceef34b3?w=300&auto=format&fit=crop&q=60',
      shop: {
        name: 'Native Crafts',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=60',
        rating: 4.6,
        location: 'Guimaras'
      },
      tradeFor: ['Coffee & Tea', 'Food Items', 'Snacks'],
      isAvailable: true
    },
    {
      id: '8',
      name: 'Specialty Tea Collection',
      description: 'Assorted local herbal teas from the region',
      value: '₱180',
      category: 'coffee',
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&auto=format&fit=crop&q=60',
      shop: {
        name: 'Tea Haven',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=60',
        rating: 4.7,
        location: 'Iloilo City'
      },
      tradeFor: ['Handicrafts', 'Home Decor', 'Coffee'],
      isAvailable: true
    }
  ];

  const mockTradeOffers = [
    {
      id: 'offer1',
      from: "Madge Coffee",
      status: "pending",
      itemsOffered: [{
        name: "Artisanal Coffee Beans",
        value: "₱350",
        image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300&auto=format&fit=crop&q=60"
      }],
      itemsRequested: [{
        name: "Hablon Wallet",
        price: "₱250",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=60"
      }],
      message: "Would love to trade our premium coffee beans for your handmade wallet!"
    }
  ];

  const mockActiveTrades = [
    {
      id: 'active1',
      recipient: "Native Crafts",
      status: "active",
      itemsOffered: [{
        name: "Barako Coffee",
        value: "₱350",
        image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300&auto=format&fit=crop&q=60"
      }],
      itemsRequested: [{
        name: "Handwoven Basket",
        price: "₱180",
        image: "https://images.unsplash.com/photo-1586023492125-27a3ceef34b3?w=300&auto=format&fit=crop&q=60"
      }]
    }
  ];

  const mockTradeHistory = [
    {
      id: 'history1',
      recipient: "Iloilo Biscocho Haus",
      status: "completed",
      itemsOffered: [{
        name: "Piaya Original",
        value: "₱120",
        image: "https://images.unsplash.com/photo-1555507036-ab794f27d2e9?w=300&auto=format&fit=crop&q=60"
      }],
      itemsRequested: [{
        name: "Biscocho Original",
        price: "₱60",
        image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=300&auto=format&fit=crop&q=60"
      }]
    }
  ];

  useEffect(() => {
    if (initMockData) {
      initMockData();
    }
  }, []);

  const displayTradeOffers = tradeOffers.length > 0 ? tradeOffers : mockTradeOffers;
  const displayActiveTrades = activeTrades.length > 0 ? activeTrades : mockActiveTrades;
  const displayTradeHistory = tradeHistory.length > 0 ? tradeHistory : mockTradeHistory;

  const filteredProducts = availableProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.shop.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.isAvailable;
  });

  const handleCreateTrade = () => {
    if (!selectedUserProduct || !selectedShopProduct) {
      Alert.alert(
        "Missing Information",
        "Please select both products to trade"
      );
      return;
    }

    const newTrade = {
      id: `trade-${Date.now()}`,
      shop: {
        name: selectedShopProduct.shop,
        image: selectedShopProduct.shopImage,
        rating: 4.5,
      },
      userProduct: selectedUserProduct,
      shopProduct: selectedShopProduct,
      notes,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    if (createTradeOffer) {
      createTradeOffer(newTrade);
    }

    setIsCreateModalVisible(false);
    resetSelection();

    Alert.alert(
      "Trade Offer Created",
      "Your trade offer has been sent successfully!",
      [{ text: "OK" }]
    );
  };

  const resetSelection = () => {
    setSelectedUserProduct(null);
    setSelectedShopProduct(null);
    setNotes("");
  };

  const handleInitiateTrade = (product) => {
    setIsCreateModalVisible(true);
    const shopProduct = {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.value,
      shop: product.shop.name,
      shopImage: product.shop.image,
    };
    setSelectedShopProduct(shopProduct);
  };

  const handleAcceptTrade = (tradeId) => {
    if (acceptTrade) {
      acceptTrade(tradeId);
    }
    Alert.alert("Trade Accepted", "You have accepted the trade offer!");
  };

  const handleRejectTrade = (tradeId) => {
    if (rejectTrade) {
      rejectTrade(tradeId);
    }
    Alert.alert("Trade Declined", "You have declined the trade offer.");
  };

  const handleCompleteTrade = (tradeId) => {
    if (completeTrade) {
      completeTrade(tradeId);
    }
    Alert.alert("Trade Completed", "The trade has been marked as complete!");
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => handleInitiateTrade(item)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.shopInfo}>
          <Image source={{ uri: item.shop.image }} style={styles.shopImage} />
          <View style={styles.shopDetails}>
            <Text style={styles.shopName} numberOfLines={1}>{item.shop.name}</Text>
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
            <Text style={styles.tradeForItems} numberOfLines={1}>
              {item.tradeFor.join(', ')}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.tradeButton}
          onPress={() => handleInitiateTrade(item)}
        >
          <Feather name="repeat" size={16} color="#FFF" />
          <Text style={styles.tradeButtonText}>Trade</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderTradeCard = ({ trade, tab }) => (
    <View key={trade.id} style={styles.tradeCard}>
      <View style={styles.tradeHeader}>
        <Text style={styles.shopName}>
          {tab === "offers" ? trade.from : trade.recipient}
        </Text>
        <Text
          style={[
            styles.tradeStatus,
            {
              backgroundColor:
                trade.status === "pending"
                  ? "#fef3c7"
                  : trade.status === "active"
                  ? "#dbeafe"
                  : "#dcfce7",
            },
          ]}
        >
          {trade.status?.charAt(0).toUpperCase() + trade.status?.slice(1)}
        </Text>
      </View>

      <View style={styles.tradeItems}>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>You give:</Text>
          <View style={styles.itemWithImage}>
            <Image
              source={{ uri: trade.itemsOffered?.[0]?.image }}
              style={styles.itemImage}
            />
            <View>
              <Text style={styles.itemName}>
                {trade.itemsOffered?.[0]?.name}
              </Text>
              <Text style={styles.itemValue}>
                {trade.itemsOffered?.[0]?.value}
              </Text>
            </View>
          </View>
        </View>

        <Feather
          name="repeat"
          size={16}
          color="#94a3b8"
          style={styles.exchangeIcon}
        />

        <View style={styles.item}>
          <Text style={styles.itemLabel}>You get:</Text>
          <View style={styles.itemWithImage}>
            <Image
              source={{ uri: trade.itemsRequested?.[0]?.image }}
              style={styles.itemImage}
            />
            <View>
              <Text style={styles.itemName}>
                {trade.itemsRequested?.[0]?.name}
              </Text>
              <Text style={styles.itemValue}>
                {trade.itemsRequested?.[0]?.price}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {trade.message && (
        <Text style={styles.tradeMessage}>"{trade.message}"</Text>
      )}

      {tab === "offers" && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.declineButton]}
            onPress={() => handleRejectTrade(trade.id)}
          >
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => handleAcceptTrade(trade.id)}
          >
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}

      {tab === "active" && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.completeButton]}
            onPress={() => handleCompleteTrade(trade.id)}
          >
            <Text style={styles.completeText}>Mark Complete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { 
      useNativeDriver: true,
      listener: (event) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        scrollDirection.current = currentScrollY > lastScrollY.current ? 'down' : 'up';
        lastScrollY.current = currentScrollY;
      }
    }
  );

  const renderBrowseContent = () => (
    <View style={styles.browseContainer}>
      {filteredProducts.length === 0 ? (
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
        <AnimatedFlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
          numColumns={2}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      )}
    </View>
  );

  const renderContent = () => {
    let data = [];
    let emptyMessage = "";

    switch (activeTab) {
      case "browse":
        return renderBrowseContent();
      case "offers":
        data = displayTradeOffers;
        emptyMessage = "No trade offers available";
        break;
      case "active":
        data = displayActiveTrades;
        emptyMessage = "No active trades";
        break;
      case "history":
        data = displayTradeHistory;
        emptyMessage = "No trade history";
        break;
      default:
        data = [];
    }

    if (data.length === 0 && activeTab !== "browse") {
      return (
        <View style={styles.emptyState}>
          <Feather name="shopping-bag" size={64} color="#cbd5e1" />
          <Text style={styles.emptyStateTitle}>{emptyMessage}</Text>
          <Text style={styles.emptyStateText}>
            {activeTab === "offers"
              ? "When shops send you trade offers, they will appear here."
              : activeTab === "active"
              ? "Your ongoing trades will appear here."
              : "Your completed trades will appear here."}
          </Text>
          {activeTab === "offers" && (
            <TouchableOpacity
              style={styles.createTradeButton}
              onPress={() => setIsCreateModalVisible(true)}
            >
              <Text style={styles.createTradeButtonText}>
                Create Your First Trade
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if (activeTab !== "browse") {
      return (
        <AnimatedScrollView 
          style={styles.tradesContainer} 
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.tradesList}>
            {data.map((trade) => renderTradeCard({ trade, tab: activeTab }))}
          </View>
        </AnimatedScrollView>
      );
    }
  };

  const getTabCount = (tab) => {
    switch (tab) {
      case "browse":
        return "";
      case "offers":
        return displayTradeOffers.length;
      case "active":
        return displayActiveTrades.length;
      case "history":
        return displayTradeHistory.length;
      default:
        return 0;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header that will completely hide when scrolling down */}
      <Animated.View 
        style={[
          styles.headerContainer,
          {
            transform: [{ translateY: headerTranslateY }],
          }
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color="#0f172a" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Trade Center</Text>
            <Text style={styles.subtitle}>
              Exchange products with local shops
            </Text>
          </View>
          <TouchableOpacity
            style={styles.newTradeButton}
            onPress={() => setIsCreateModalVisible(true)}
          >
            <Feather name="plus" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          {[
            { key: "browse", label: "Browse", icon: "grid" },
            { key: "offers", label: "Offers", icon: "gift" },
            { key: "active", label: "Active", icon: "refresh-cw" },
            { key: "history", label: "History", icon: "check-circle" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Feather
                name={tab.icon}
                size={16}
                color={activeTab === tab.key ? "#2563eb" : "#64748b"}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.activeTabText,
                ]}
              >
                {tab.label} {getTabCount(tab.key) && `(${getTabCount(tab.key)})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.searchSection}>
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
        </View>
      </Animated.View>

      {/* Content with proper spacing */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      <Modal
        visible={isCreateModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setIsCreateModalVisible(false);
          resetSelection();
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setIsCreateModalVisible(false);
                resetSelection();
              }}
              style={styles.modalCloseButton}
            >
              <Feather name="x" size={24} color="#0f172a" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Trade Offer</Text>
            <View style={styles.modalCloseButton} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Select Your Product</Text>
            <Text style={styles.sectionDescription}>
              Choose which product you want to trade
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.productsScroll}
            >
              {userProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={[
                    styles.modalProductCard,
                    selectedUserProduct?.id === product.id &&
                      styles.selectedProductCard,
                  ]}
                  onPress={() => setSelectedUserProduct(product)}
                >
                  <Image
                    source={{ uri: product.image }}
                    style={styles.modalProductImage}
                  />
                  <View style={styles.modalProductInfo}>
                    <Text style={styles.modalProductName}>{product.name}</Text>
                    <Text style={styles.modalProductPrice}>{product.value}</Text>
                  </View>
                  {selectedUserProduct?.id === product.id && (
                    <View style={styles.selectedBadge}>
                      <Feather name="check" size={16} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>Select Product to Receive</Text>
            <Text style={styles.sectionDescription}>
              Choose which product you want in return
            </Text>

            {selectedShopProduct && (
              <View style={styles.preSelectedProduct}>
                <Image
                  source={{ uri: selectedShopProduct.image }}
                  style={styles.preSelectedImage}
                />
                <View style={styles.preSelectedInfo}>
                  <Text style={styles.preSelectedName}>{selectedShopProduct.name}</Text>
                  <Text style={styles.preSelectedPrice}>{selectedShopProduct.price}</Text>
                  <Text style={styles.preSelectedShop}>{selectedShopProduct.shop}</Text>
                </View>
                <Feather name="check" size={20} color="#059669" />
              </View>
            )}

            {!selectedShopProduct && (
              <Text style={styles.noProductSelected}>
                Select a product from the Browse tab to trade for
              </Text>
            )}

            <Text style={styles.sectionTitle}>Add Note (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add a message to the shop owner..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
            />

            {(selectedUserProduct || selectedShopProduct) && (
              <View style={styles.tradeSummary}>
                <Text style={styles.summaryTitle}>Trade Summary</Text>
                <View style={styles.summaryContent}>
                  <View style={styles.summaryItem}>
                    <Image
                      source={{ uri: selectedUserProduct?.image }}
                      style={styles.summaryImage}
                    />
                    <View>
                      <Text style={styles.summaryName}>
                        You give: {selectedUserProduct?.name}
                      </Text>
                      <Text style={styles.summaryValue}>
                        {selectedUserProduct?.value}
                      </Text>
                    </View>
                  </View>

                  <Feather
                    name="repeat"
                    size={20}
                    color="#2563eb"
                    style={styles.summaryIcon}
                  />

                  <View style={styles.summaryItem}>
                    <Image
                      source={{ uri: selectedShopProduct?.image }}
                      style={styles.summaryImage}
                    />
                    <View>
                      <Text style={styles.summaryName}>
                        You get: {selectedShopProduct?.name}
                      </Text>
                      <Text style={styles.summaryValue}>
                        {selectedShopProduct?.price}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[
                styles.createButton,
                (!selectedUserProduct || !selectedShopProduct) &&
                  styles.createButtonDisabled,
              ]}
              onPress={handleCreateTrade}
              disabled={!selectedUserProduct || !selectedShopProduct}
            >
              <Text style={styles.createButtonText}>Create Trade Offer</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "400",
  },
  newTradeButton: {
    backgroundColor: "#2563eb",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 2,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#f8fafc",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
    marginLeft: 4,
  },
  activeTabText: {
    color: "#2563eb",
    fontWeight: "600",
  },
  searchSection: {
    backgroundColor: '#ffffff',
    paddingBottom: 8,
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
  categoriesWrapper: {
    maxHeight: 50,
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
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
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
  content: {
    flex: 1,
  },
  // FIXED: Remove paddingTop from containers and use contentContainerStyle instead
  browseContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  gridContent: {
    paddingTop: 180, // This creates space for the header
    padding: 8,
  },
  tradesContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tradesList: {
    paddingTop: 180, // This creates space for the header
    padding: 16,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
    lineHeight: 16,
  },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  shopImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  shopDetails: {
    flex: 1,
  },
  shopName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0f172a',
  },
  shopRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 10,
    color: '#f59e0b',
    marginLeft: 2,
    marginRight: 4,
  },
  shopLocation: {
    fontSize: 10,
    color: '#64748b',
  },
  productDetails: {
    marginBottom: 8,
  },
  productValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  tradeForContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tradeForLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748b',
  },
  tradeForItems: {
    fontSize: 10,
    color: '#0f172a',
    flex: 1,
  },
  tradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 'auto',
  },
  tradeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  tradeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tradeStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '500',
  },
  tradeItems: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  item: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  itemWithImage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
  },
  itemValue: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  exchangeIcon: {
    marginHorizontal: 12,
  },
  tradeMessage: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#64748b',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  acceptButton: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  completeButton: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  declineText: {
    color: '#dc2626',
    fontWeight: '600',
  },
  acceptText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  completeText: {
    color: '#059669',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
    paddingTop: 180, // Space for header
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  createTradeButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createTradeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalCloseButton: {
    width: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  productsScroll: {
    marginBottom: 24,
  },
  modalProductCard: {
    width: 140,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedProductCard: {
    borderColor: '#2563eb',
    backgroundColor: '#f0f9ff',
  },
  modalProductImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  modalProductInfo: {
    alignItems: 'center',
  },
  modalProductName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalProductPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#2563eb',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preSelectedProduct: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  preSelectedImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  preSelectedInfo: {
    flex: 1,
  },
  preSelectedName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  preSelectedPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 2,
  },
  preSelectedShop: {
    fontSize: 12,
    color: '#64748b',
  },
  noProductSelected: {
    fontSize: 14,
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 32,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 24,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#0f172a',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  tradeSummary: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  summaryImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  summaryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  summaryIcon: {
    marginHorizontal: 16,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  createButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TradeScreen;