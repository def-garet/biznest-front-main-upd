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
            <HeadingText text={"Categories"} isViewAll={true} />
            <FlatList
                data={categories_data}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity  onPress={()=> navigation.navigate("ProductByCategory",{ category_id: item.id })}>
                    <View style={styles.imageContainer}>
                        <View style={styles.iconContainer}>
                            <Image source={{ uri: item.icon }} style={styles.imgIcon} />
                        </View>
                        <Text style={{ fontFamily: 'outfit-medium', marginTop: 5 }}>{item.name}</Text>
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