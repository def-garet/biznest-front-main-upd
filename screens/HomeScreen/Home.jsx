// import React, { useState, useCallback } from "react";
// import {
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   RefreshControl,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useFocusEffect, useIsFocused } from "@react-navigation/native";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import * as Animatable from "react-native-animatable";
// import axios from "axios";
// import { useNavigation, useRoute } from "@react-navigation/native";

// import { COLORS } from "../../style/theme";
// import style from "../../style/home.style";
// import API_URL  from "../../api/api_urls";
// import { Categories, Slider, SRPMonitoring } from "./component";
// import { ProductStyle, ProductsTitle } from "../Global";


// const Home = () => {
//   const navigation = useNavigation();
//   const [productsample, setProduct] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const isFocused = useIsFocused(); 

//   const fetchProduct = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/v1/Product/product_api`);
//       setProduct(response.data);
//     } catch (error) {
//       console.error("Error fetching product:", error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   // Re-fetch when screen is focused
//   useFocusEffect(
//     useCallback(() => {
//       fetchProduct();
//     }, [])
//   );


//   React.useEffect(() => {
//     if (isFocused) {
//       fetchProduct();
//     }
//   }, [isFocused]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchProduct();
//   };

//   return (
//     <SafeAreaView>
//       <View style={{ height: "100%" }}>
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           style={{ flex: 1 }}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={[COLORS.primary]}
//               tintColor={COLORS.primary}
//             />
//           }
//         >
//           {/* Top Section */}
//           <View style={style.HomeTopContainer}>
//             <View style={style.appBar}>
//               <View style={style.appBarright}>
//                 <Ionicons name="location-outline" size={30} color={COLORS.background} />
//                 <View>
//                   <Text style={{ color: COLORS.background, fontSize: 20, fontWeight: "bold" }}>
//                     Iloilo
//                   </Text>
//                   <Text style={{ color: COLORS.background }}>Iloilo City</Text>
//                 </View>
//               </View>
//               <View style={style.appBarleft}>
//                 <TouchableOpacity
//                   onPress={() => navigation.navigate("UserLike")}
//                   activeOpacity={0.7}
//                   style={{ padding: 6 }}
//                 >
//                   <FontAwesome name="heart-o" size={24} color={COLORS.background} />
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => navigation.navigate("MyCart")}
//                   activeOpacity={0.7}
//                   style={{ padding: 6 }}
//                 >
//                   <Ionicons name="bag-handle-outline" size={24} color={COLORS.background} />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Search Bar */}
//             <View style={style.SearchContainer}>
//               <View
//                 style={[
//                   style.searchBarcontainer,
//                   {
//                     backgroundColor: "#fff",
//                     borderRadius: 10,
//                     shadowColor: "#000",
//                     shadowOffset: { width: 0, height: 2 },
//                     shadowOpacity: 0.1,
//                     shadowRadius: 4,
//                     elevation: 2,
//                   },
//                 ]}
//               >
//                 <TouchableOpacity>
//                   <FontAwesome name="search" style={style.searchIcon} size={24} color="black" />
//                 </TouchableOpacity>
//                 <View style={style.searchwrapper}>
//                   <TextInput placeholder="Search" style={style.textInput} />
//                 </View>
//               </View>
//               <TouchableOpacity style={style.searchCamera}>
//                 <Ionicons name="camera-outline" size={20} color="black" />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Body Section */}
//           <View style={style.homeBody}>
//             <Animatable.View animation="fadeInUp" duration={600} style={{ padding: 20 }}>
//               <Animatable.View animation="fadeIn" delay={100}>
//                 <SRPMonitoring />
//               </Animatable.View>
//               <Animatable.View animation="fadeIn" delay={300}>
//                 <Slider />
//               </Animatable.View>
//               <Animatable.View animation="fadeIn" delay={500}>
//                 <Categories />
//               </Animatable.View>
//               <Animatable.View animation="fadeInUp" delay={700} style={{ gap: 20, marginTop: 20 }}>
//                 <ProductsTitle title="Exclusive Products" />
//                 <ProductStyle data={productsample} />
//               </Animatable.View>
//               <Animatable.View
//                 animation="fadeInUp"
//                 delay={900}
//                 style={{ gap: 20, marginTop: 20, marginBottom: 100 }}
//               >
//                 <ProductsTitle title="Exclusive Products" />
//                 <ProductStyle data={productsample} />
//               </Animatable.View>
//             </Animatable.View>
//           </View>
//         </ScrollView>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Home;


// import React, { useState, useCallback } from "react";
// import {
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   RefreshControl,
//   StatusBar,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useFocusEffect, useIsFocused } from "@react-navigation/native";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import * as Animatable from "react-native-animatable";
// import axios from "axios";
// import { useNavigation } from "@react-navigation/native";

// import { COLORS } from "../../style/theme";
// import style from "../../style/home.style";
// import API_URL  from "../../api/api_urls";
// import { Categories, Slider, SRPMonitoring } from "./component";
// import { ProductStyle, ProductsTitle } from "../Global";
// import { AuthContext } from "../../auth/AuthContext";
// import { useContext, useEffect } from "react";


// const Home = () => {
//   const navigation = useNavigation();
//   const [productsample, setProduct] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const isFocused = useIsFocused();
//   const { userToken, ProtectedNavigation } = useContext(AuthContext);

//   const fetchProduct = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/v1/Product/product_api`);
//       setProduct(response.data);
//     } catch (error) {
//       console.error("Error fetching product:", error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchProduct();
//     }, [])
//   );

//   React.useEffect(() => {
//     if (isFocused) {
//       fetchProduct();
//     }
//   }, [isFocused]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchProduct();
//   };

 



//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }} edges={['top']}>
//       <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ flexGrow: 1 }}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={[COLORS.primary]}
//             tintColor={COLORS.primary}
//           />
//         }
//       >
//         {/* location */}
//         <View style={style.HomeTopContainer}>
//           <View style={style.appBar}>
//                   {
//               userToken ? (
//                 <View style={style.appBarright}>
//                   <Ionicons name="location-outline" size={30} color={COLORS.background} />
//                   <View>
//                     <Text style={{ color: COLORS.background, fontSize: 20, fontWeight: "bold" }}>
//                       Iloilo
//                     </Text>
//                     <Text style={{ color: COLORS.background }}>Iloilo City</Text>
//                   </View>
//                 </View>
//               ) : (
//                 // Spacer View to keep layout same
//                 <View style={{ width: '50%' ,height: 40  }} />
//               )
//             }
//             <View style={style.appBarleft}>
//               <TouchableOpacity
//                 onPress={() => ProtectedNavigation("UserLike",navigation) }
//                 activeOpacity={0.7}
//                 style={{ padding: 6 }}
//               >
//                 <FontAwesome name="heart-o" size={24} color={COLORS.background} />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => ProtectedNavigation("MyCart",navigation)  }
//                 activeOpacity={0.7}
//                 style={{ padding: 6 }}
//               >
//                 <Ionicons name="bag-handle-outline" size={24} color={COLORS.background} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* search bar */}
//           <View style={style.SearchContainer}>
//             <View
//               style={[
//                 style.searchBarcontainer,
//                 {
//                   backgroundColor: "#fff",
//                   borderRadius: 10,
//                   shadowColor: "#000",
//                   shadowOffset: { width: 0, height: 2 },
//                   shadowOpacity: 0.1,
//                   shadowRadius: 4,
//                   elevation: 2,
//                 },
//               ]}
//             >
//               <TouchableOpacity>
//                 <FontAwesome name="search" style={style.searchIcon} size={24} color="black" />
//               </TouchableOpacity>
//               <View style={style.searchwrapper}>
//                 <TextInput placeholder="Search" style={style.textInput} />
//               </View>
//             </View>
//             <TouchableOpacity style={style.searchCamera}>
//               <Ionicons name="camera-outline" size={20} color="black" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={style.homeBody}>
//           <Animatable.View animation="fadeInUp" duration={600} style={{ padding: 20 }}>
//             <Animatable.View animation="fadeIn" delay={100}>
//               <SRPMonitoring />
//             </Animatable.View>
//             <Animatable.View animation="fadeIn" delay={300}>
//               <Slider />
//             </Animatable.View>
//             <Animatable.View animation="fadeIn" delay={500}>
//               <Categories />
//             </Animatable.View>
//             <Animatable.View animation="fadeInUp" delay={700} style={{ gap: 20, marginTop: 20 }}>
//               <ProductsTitle title="Exclusive Products" />
//               <ProductStyle data={productsample} />
//             </Animatable.View>
//             <Animatable.View
//               animation="fadeInUp"
//               delay={900}
//               style={{ gap: 20, marginTop: 20, marginBottom: 100 }}
//             >
//               <ProductsTitle title="Exclusive Products" />
//               <ProductStyle data={productsample} />
//             </Animatable.View>
//           </Animatable.View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Home;

import React, { useState, useCallback } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StatusBar,
  Image,
  StyleSheet,
  Linking,
  Modal,
  Pressable,
  Dimensions,
  Animated
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { DinagyangProducts } from "../SeasonalCompenents";

import { COLORS } from "../../style/theme";
import style from "../../style/home.style";
import API_URL  from "../../api/api_urls";
import { Categories, Slider, SRPMonitoring } from "./component";
import { StaticProductStyle,CategoryModal } from "../Global";
import { AuthContext } from "../../auth/AuthContext";
import { useContext, useEffect } from "react";
import  axiosInstance  from "../../api/axiosInstance"; 
const API_Like = `${API_URL}/api/v1/Buyer Likes/buyer_like`;

const { width } = Dimensions.get('window');
const itemWidth = (width - 36) / 2;
const Home = () => {
  const navigation = useNavigation();
  const [productsample, setProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const isFocused = useIsFocused();
  const { userToken, ProtectedNavigation } = useContext(AuthContext);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [likedItems, setLikedItems] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [wishlist, setWishlist] = useState([]);


  // Iloilo local products data
  const allProducts = [
    // Food items
    {
      id: 1,
      store: "Organic Products",
      product: "Assorted Tarts",
      price: 35,
      originalPrice: 45,
      image: "https://anec.global/cdn/shop/products/Untitleddesign_30_7a6265bd-6a8b-4a2a-9791-6e3fd4a58c39_grande.png?v=1645164662",
      category: "Food",
      rating: 5,
      sold: 1250,
    },
    {
      id: 2,
      store: "JM Drinks and Foods",
      product: "100% Pineapple Drink Concentrate 1 Gal.",
      price: 120,
      originalPrice: 150,
      image: "https://anec.global/cdn/shop/products/PINEAPLEDRINKCONCENTRATE1GAL_grande.png?v=1661236579",
      category: "Beverage",
      rating: 4,
      sold: 980
    },
    // Handicrafts and woven products
    {
      id: 3,
      store: "Iloilo Handicrafts",
      product: "Ratan bag",
      price: 450,
      originalPrice: 550,
      image: "https://anec.global/cdn/shop/products/Untitleddesign_4_370f4737-fb81-4106-a09e-755bc1490bd3_grande.png?v=1637546152",
      category: "Handicrafts",
      rating: 4,
      sold: 320
    },
    {
      id: 4,
      store: "Cabayogan Women Loom Weavers Association",
      product: "Hablon Textiles: Custom Made",
      price: 350,
      originalPrice: 400,
      image: "https://likhaan.com/cdn/shop/files/cabayogan-women-loom-weavers-association-iloilo-hablon-weaving-textile-fabric-barong-cotton-abaca-pina-hiligaynon-colors-colorful-prints-patadyong-skirt-malong-wraparound-patterns.jpg?v=1710253094&width=1946",
      category: "Handicrafts",
      rating: 5,
      sold: 210
    },
    // Pasalubong items
    {
      id: 5,
      store: "Lit's Special Baye-Baye",
      product: "Special Baye-Baye",
      price: 180,
      originalPrice: 220,
      image: "https://liit-bayebaye.vercel.app/assets/images/boxes_image.jpg",
      category: "Pasalubong",
      rating: 5,
      sold: 3200
    },
    {
      id: 6,
      store: "Iloilo Delicacies",
      product: "Peanut Brittle with Honey",
      price: 150,
      originalPrice: 180,
      image: "https://anec.global/cdn/shop/products/product_13_bd501aac-9bdc-4354-a28f-c915bd9d0803_grande.png?v=1651290251",
      category: "Pasalubong",
      rating: 4,
      sold: 1750
    },
    // Home decor
    {
      id: 7,
      store: "Uswag Arts & Crafts",
      product: "Nito Lampshade for home decors",
      price: 1200,
      originalPrice: 1500,
      image: "https://anec.global/cdn/shop/products/015eea547fb8d43d446dad83a1a415e8.jpg?v=1641880813",
      category: "Home Decor",
      rating: 5,
      sold: 150
    },
    {
      id: 8,
      store: "Fashion and Home Crafts",
      product: "Shell Home Decor",
      price: 800,
      originalPrice: 950,
      image: "https://anec.global/cdn/shop/products/275911656_416814450249589_2180825728258401622_n_grande.jpg?v=1648218361",
      category: "Home Decor",
      rating: 4,
      sold: 95
    },
    // Fashion accessories
    {
      id: 9,
      store: "Iloilo Fashion Center",
      product: "Pearl Beads Necklace",
      price: 1500,
      originalPrice: 1800,
      image: "https://anec.global/cdn/shop/products/necklace1_7_grande.png?v=1678244835",
      category: "Fashion",
      rating: 4,
      sold: 120
    },
    {
      id: 10,
      store: "Home of Arts and Crafts",
      product: "Handmade Earrings",
      price: 350,
      originalPrice: 420,
      image: "https://likhaan.com/cdn/shop/files/Jumimo_by_Vickit_Chips_Stone_Choker_804796dd-0c4e-4c1e-bd27-9c77a4ce7021.jpg?v=1747852463&width=823",
      category: "Fashion",
      rating: 5,
      sold: 280
    }
  ];
  const item = {
  id: 4,
  name: "HABLON Premium Barong Tagalog",
  shop: "HABLON Barong & Filipiniana",
  originalPrice: "₱1099",
  price: "₱989",
  discount: "10% off",
  rating: "4.9",
  sold: "800 sold",
  shipping: "3-6 Days",
  location: "Iloilo City",
  image: "https://down-ph.img.susercontent.com/file/ph-11134207-7r98o-lzqcvjj2ym4a53",
  isPreferred: false,
  hasFreeShipping: true,
};

  // const categories_list = [
  //   { id: 1, name: "All" },
  //   { id: 2, name: "Food" },
  //   { id: 3, name: "Beverage" },
  //   { id: 4, name: "Pasalubong" },
  //   { id: 5, name: "Handicrafts" },
  //   { id: 6, name: "Home Decor" },
  //   { id: 7, name: "Fashion" }
  // ];

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://192.168.195.57:5000/api/v1/Product/product_api`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setRefreshing(false);
    }
  };






  const fetchCategory = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/Category/biznest_api`);
    // Append fetched categories while keeping the default "All"
    setCategories([{ id: 0, name: "All" }, ...response.data]);
  } catch (error) {
    console.error("Error fetching product:", error);
  } finally {
    setRefreshing(false);
  }
};


 const fetchLikes = async () => {
      try {
        const response = await axiosInstance.get(API_Like);
        const likedMap = (response.data || []).reduce((acc, item) => ({
          ...acc,
          [item.product_info.id]: true
        }), {});
        setLikedItems(likedMap);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };


  useFocusEffect(
    useCallback(() => {
      fetchProduct();
      fetchCategory();
      fetchLikes();
    }, [])
  );


  // const toggleLike = async (product_id) => {
  //   try {
  //     likedItems[product_id] 
  //       ? await axiosInstance.delete(`${API_Like}/${product_id}`)
  //       : await axiosInstance.post(API_Like, { like_id: product_id });
      
  //     setLikedItems(prev => ({ ...prev, [product_id]: !prev[product_id] }));
  //   } catch (error) {
  //     console.error("Error toggling like:", error);
  //     Alert.alert("Error", "Failed to update like status");
  //   }
  // };


const handleCategoryPress = (category) => {
  setActiveCategory(category.name);
  setShowFilterModal(false);

  if (category.name === "All") {
    setFilteredProducts(productsample);
  } else {
    const filtered = productsample.filter(
      (item) => item.category?.toLowerCase() === category.name.toLowerCase()
    );
    setFilteredProducts(filtered);
  }
};


useEffect(() => {
  if (productsample.length > 0) {
    setFilteredProducts(productsample);
  }
}, [productsample]);



  React.useEffect(() => {
    if (isFocused) {
      fetchProduct();
    }
  }, [isFocused]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProduct();
  };

  const handleProductPress = (product) => {
    navigation.navigate("ProductDetails", { product_id: product.id });
  };

  // const handleCategoryPress = (category) => {
  //   setActiveCategory(category.name);
  //   setShowFilterModal(false);
  // };

  // const filteredProducts = activeCategory === "All" 
  //   ? productsample 
  //   : productsample.filter(product => product.category === activeCategory);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }} edges={['top']}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Header */}
        <View style={style.HomeTopContainer}>
          <View style={style.appBar}>
            {userToken ? (
              <View style={style.appBarright}>
                <Ionicons name="location-outline" size={30} color={COLORS.background} />
                <View>
                  <Text style={{ color: COLORS.background, fontSize: 20, fontWeight: "bold" }}>
                    Iloilo 
                  </Text>
                  <Text style={{ color: COLORS.background }}>Iloilo City</Text>
                </View>
              </View>
            ) : (
              <View style={{ width: '50%', height: 40 }} />
            )}
            <View style={style.appBarleft}>
              <TouchableOpacity
                onPress={() => ProtectedNavigation("UserLike", navigation)}
                activeOpacity={0.7}
                style={{ padding: 6 }}
              >
                <FontAwesome name="heart-o" size={24} color={COLORS.background} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => ProtectedNavigation("MyCart", navigation)}
                activeOpacity={0.7}
                style={{ padding: 6 }}
              >
                <Ionicons name="bag-handle-outline" size={24} color={COLORS.background} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search bar old*/}
          {/* <View style={style.SearchContainer}>
            <View style={[style.searchBarcontainer, {
              backgroundColor: "#fff",
              borderRadius: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }]}>
              <TouchableOpacity>
                <FontAwesome name="search" style={style.searchIcon} size={24} color="black" />
              </TouchableOpacity>
              <View style={style.searchwrapper}>
                <TextInput placeholder="Search" style={style.textInput} />
              </View>
            </View>
            
            <TouchableOpacity style={style.searchCamera}>
              <Ionicons name="camera-outline" size={20} color="black" />
            </TouchableOpacity>
          </View> */}
        {/* Search bar new Redirect*/}
        <View style={style.SearchContainer}>
        <TouchableOpacity
          style={[style.searchBarcontainer, {
            backgroundColor: "#fff",
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            flex: 1,
          }]}
          onPress={() => navigation.navigate("Search")} // Redirect here
          activeOpacity={0.7}
        >
          <FontAwesome name="search" style={style.searchIcon} size={24} color="black" />
          <View style={style.searchwrapper}>
            <Text style={[style.textInput, { color: '#888' }]}>
              Search
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={style.searchCamera}
          // onPress={() => navigation.navigate("CameraSearch")} // Redirect camera tap
          activeOpacity={0.7}
        >
          <Ionicons name="camera-outline" size={20} color="black" />
        </TouchableOpacity>
      </View>

        </View>
        

        <View style={style.homeBody}>
          <Animatable.View animation="fadeInUp" duration={600} style={{ padding: 20 }}>
           {/* Categories Product */}
          
          <Categories />
           
            {/* SRP Monitoring */}
            <Animatable.View animation="fadeIn" delay={100}>
              <TouchableOpacity onPress={() => navigation.navigate("SRPDetails")}>
                <SRPMonitoring />
              </TouchableOpacity>
            </Animatable.View>

            {/* Seasional Product */}
            <DinagyangProducts />

            {/* Filter Button */}
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="filter" size={20} color={COLORS.primary} />
              <Text style={styles.filterButtonText}>
                {activeCategory === "All" ? "All Categories" : activeCategory}
              </Text>
              <Ionicons name="chevron-down" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          


         

            {/* All Products Grid */}
       <View style={styles.productsGrid}>
        <StaticProductStyle data={filteredProducts} />
      </View>


            {/* Additional Sections */}
            <Animatable.View animation="fadeIn" delay={300}>
              {/* <Slider /> */}
            </Animatable.View>
            <Animatable.View animation="fadeIn" delay={500}>


            </Animatable.View>
          </Animatable.View>
        </View>
      </ScrollView>

      {/* Filter Modal */}
    <CategoryModal
  visible={showFilterModal}
  categories={categories}
  activeCategory={activeCategory}
  onClose={() => setShowFilterModal(false)}
  onSelectCategory={handleCategoryPress}
/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: 'flex-start'
  },
  filterButtonText: {
    marginLeft: 8,
    marginRight: 5,
    color: COLORS.primary,
    fontWeight: '500'
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 50
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
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
    marginBottom: 10,
  },
  productInfo: {
    paddingHorizontal: 5
  },
  storeName: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    height: 20
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff0000',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  soldText: {
    fontSize: 10,
    color: '#888',
    marginLeft: 5
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  activeCategoryItem: {
    backgroundColor: '#f5f5f5'
  },
  categoryText: {
    fontSize: 16,
    color: '#333'
  },
  activeCategoryText: {
    color: COLORS.primary,
    fontWeight: '500'
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: 20
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  }
});


const COLORS_idea = {
  primary: '#172d55',
  secondary: '#2196f3',
  background: '#f8f9fa',
  text: '#6c757d',
  border: '#e0e0e0',
  discount: '#e53935',
  freeShipping: '#4caf50',
  highlight: '#ff6b6b',
  rating: '#FFD700',
  white: '#ffffff',
  headerBg: '#172d55',
};



const styles_idea = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS_idea.background,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS_idea.headerBg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS_idea.white,
  },
  filterIcon: {
    marginLeft: 12,
  },
  content: {
    paddingHorizontal: 12,
  },
  filterContainer: {
    marginVertical: 16,
  },
  filterContent: {
    paddingHorizontal: 4,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: COLORS_idea.white,
    borderWidth: 1,
    borderColor: COLORS_idea.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeFilter: {
    backgroundColor: COLORS_idea.primary,
    borderColor: COLORS_idea.primary,
  },
  filterText: {
    color: COLORS_idea.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: COLORS_idea.white,
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: COLORS_idea.text,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: 14,
    color: COLORS_idea.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  productList: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productItem: {
    width: '48%',
    backgroundColor: COLORS_idea.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS_idea.border,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: itemWidth,
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  topBadges: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeText: {
    color: COLORS_idea.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  newBadge: {
    backgroundColor: COLORS_idea.highlight,
  },
  trendingBadge: {
    backgroundColor: COLORS_idea.secondary,
  },
  freeShippingBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: COLORS_idea.freeShipping,
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: {
    padding: 12,
  },
  shopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  preferredBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
    backgroundColor: COLORS_idea.secondary,
  },
  preferredText: {
    color: COLORS_idea.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  productShop: {
    fontSize: 10,
    color: COLORS_idea.text,
    flexShrink: 1,
  },
  productName: {
    fontSize: 13,
    color: COLORS_idea.primary,
    marginBottom: 8,
    fontWeight: '600',
    height: 36,
    lineHeight: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  currentPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS_idea.primary,
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS_idea.text,
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  discount: {
    fontSize: 12,
    color: COLORS_idea.discount,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'space-between',
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: COLORS_idea.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  soldText: {
    fontSize: 12,
    color: COLORS_idea.text,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 11,
    color: COLORS_idea.text,
    marginLeft: 4,
  },
  // Modal styles_idea
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  modalContainer: {
    backgroundColor: COLORS_idea.white,
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS_idea.primary,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS_idea.border,
  },
  sortOptionText: {
    fontSize: 16,
    color: COLORS_idea.text,
  },
  selectedSortOption: {
    color: COLORS_idea.primary,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: COLORS_idea.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS_idea.white,
    fontWeight: 'bold',
  },
});




export default Home;