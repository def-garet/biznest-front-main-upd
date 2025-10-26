import { View, Text, Image, StyleSheet, FlatList, Platform, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, HeadingText } from '../../../style/theme';
import { useNavigation } from "@react-navigation/native";
import API_URL from '../../../api/api_urls';
const API = API_URL + "/api/v1/Category/biznest_api"


export default function Categories() {
    const [categories_data, setCategories] = useState([]);
    const navigation = useNavigation();
    

    useEffect(() => {
        fetchDataCategories();
    }, []);

    const fetchDataCategories = async () => {
        try {
            const response = await fetch(API);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    return (
        <View>
            <HeadingText text={"Categories"} isViewAll={false} />
            <FlatList
                data={categories_data}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    // <TouchableOpacity  onPress={()=> navigation.navigate("ProductByCategory",{ category_id: item.id })}>
                <TouchableOpacity
                                  style={styles.seeAllButton}
                                  onPress={() =>
                                    navigation.navigate("AllProducts", {
                                      title: item.name,
                                      category_id:item.id,
                                    })
                                  }
                                >
                    <View style={styles.imageContainer}>
                        <View style={styles.iconContainer}>
                            <Image source={{ uri: item.icon }} style={styles.imgIcon} />
                        </View>
                        <Text style={{ fontFamily: 'outfit-medium', marginTop: 5 , marginBottom: 20 }}>{item.name}</Text>
                    </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    imgIcon: {
        width: 30,
        height: 30
    },
    iconContainer: {
        backgroundColor: COLORS.primary,
        padding: 17,
        borderRadius: 20,
    },
    imageContainer: {
        alignContent: "center",
        alignItems: "center",
        marginRight: 10,
        ...Platform.select({
            android: {
                elevation: 5,
            },
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            web: {
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Web equivalent of shadow
            },
        }),
    },
})




// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { Feather } from "@expo/vector-icons";
// import API_URL from "../../../api/api_urls";
// import { COLORS, HeadingText } from "../../../style/theme";

// const API = API_URL + "/api/v1/Category/biznest_api";

// export default function Categories() {
//   const [categories_data, setCategories] = useState([]);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const navigation = useNavigation();

//   useEffect(() => {
//     fetchDataCategories();
//   }, []);

//   const fetchDataCategories = async () => {
//     try {
//       const response = await fetch(API);
//       const data = await response.json();
//       setCategories(data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const renderCategoryItem = ({ item }) => {
//     const isActive = activeCategory === item.id;
//     return (
//       <TouchableOpacity
//         style={styles.categoryItem}
//         onPress={() => {
//           setActiveCategory(item.id);
//           navigation.navigate("AllProducts", {
//             title: item.name,
//             category_id: item.id,
//           });
//         }}
//       >
//         <View
//           style={[
//             styles.categoryIcon,
//             { backgroundColor: isActive ? COLORS.primary : "#f0f0f0" },
//           ]}
//         >
//           {item.icon ? (
//             <Image source={{ uri: item.icon }} style={styles.imgIcon} />
//           ) : (
//             <Feather
//               name="box"
//               size={24}
//               color={isActive ? "#fff" : "#333"}
//             />
//           )}
//         </View>
//         <Text
//           style={[
//             styles.categoryText,
//             { color: isActive ? COLORS.primary : "#333" },
//           ]}
//         >
//           {item.name}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={{ marginBottom: 16 }}>
//       <HeadingText text={"Categories"} isViewAll={true} />
//       <FlatList
//         data={categories_data}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={{ paddingHorizontal: 16 }}
//         renderItem={renderCategoryItem}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   categoryItem: {
//     alignItems: "center",
//     marginRight: 16,
//   },
//   categoryIcon: {
//     width: 60,
//     height: 60,
//     borderRadius: 16,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 6,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   imgIcon: {
//     width: 30,
//     height: 30,
//     resizeMode: "contain",
//   },
//   categoryText: {
//     fontSize: 12,
//     fontWeight: "500",
//     textAlign: "center",
//   },
// });
