import { View, Text, Image, StyleSheet, FlatList, Platform } from 'react-native';
import React, { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import { COLORS } from '../../../style/theme';
import API_URL from '../../../api/api_urls';
import { AuthContext } from '../../../auth/AuthContext';
const API = API_URL + "/api/v1/DiscountCoupon/biznest_api"
import { Link } from 'expo-router';
export default function Slider() {
    const [data, setData] = useState([]);
    const { pageload } = useContext(AuthContext);

    useEffect(() => {
        const loadData = async () => {
            await pageload(); 
            fetchDataDiscount(); 
        };
        loadData(); 
    }, []);
    

    // const fetchDataDiscount = async () => {
    //     try {
    //         const response = await fetch(API);
    //         const data = await response.json();
    //         setData(data);
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // };

    const fetchDataDiscount = async () => {
        try {
            const response = await axios.get(API);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <View>
            <Text style={styles.sliderHeading}>Offer For You</Text>
            <FlatList
                data={data}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (

                    <View style={styles.imageContainer}>
                        {/* make a compotent in a link to edit */}
                        <Link href="/login" >
                            <Image
                                source={{ uri: item.discount_image }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </Link>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    sliderHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'outfit-medium',
        marginBottom: 10,
        color: COLORS.text,
    },
    imageContainer: {
        width: 270,
        height: 150,
        borderRadius: 30,
        overflow: 'hidden',
        backgroundColor: 'white',
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

        }),
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
