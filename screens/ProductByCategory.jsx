import { Text,View,SafeAreaView,StatusBar,ScrollView } from 'react-native';
import React,{ useEffect, useState } from 'react';
import { ProductStyle,ProductsTitle } from './Global';
import API_URL  from '../api/api_urls';
import { useRoute } from "@react-navigation/native";
import axios from "axios";
const API = API_URL + "/api/v1/Category/biznest_api"


export default function ProductByCategory() {
    const route = useRoute();
    const [categories_data, setCategories] = useState(null);
    const { category_id } = route.params;

    useEffect(() => {
        fetchDataCategories();
    }, []);

    const fetchDataCategories = async () => {
        try {
            const response = await axios.post(API,{category_id});
              setCategories(response.data[0]);              
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    if (!categories_data) {
        return (
          <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading...</Text>
          </SafeAreaView>
        );
      }

    
    
    return (
        <SafeAreaView style={{ flex: 1, gap: 20 }}>
        <StatusBar backgroundColor="white" />
          <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                      flex: 1,
                    }}
                  >
        
        <View>
          <View style={{ gap: 20, marginTop: 20}}>
            {/* Product Title 2 */}
            <ProductsTitle title={categories_data.name} />
            <ProductStyle data={categories_data.products} />
          </View>
        </View>
        </ScrollView>
      </SafeAreaView>
    )
}
