import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect,useContext } from "react";
import style from "../../style/home.style";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { COLORS } from "../../style/theme";
import { Categories, Slider } from "./component";
import { ProductStyle, ProductsTitle } from "../Global";
import axios from "axios";
import API_URL from "../../api/api_urls";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../auth/AuthContext";
import { axiosInstance } from "../../api/axiosInstance"; // Importing the singleton instance
const Home = () => {
  
  const [productsample, setProduct] = useState(null);
  useEffect(() => {
    fetchProduct();
  }, []);


  const fetchProduct = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/Product/product_api`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <View style={{ height: "100%" }}>
        {/* top section */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
          }}
        >
          <View style={style.HomeTopContainer}>
            {/* navbar icon content */}
            <View style={style.appBar}>
              <View style={style.appBarright}>
                <Ionicons
                  name="location-outline"
                  size={30}
                  color={COLORS.background}
                />
                <View>
                  <Text
                    style={{
                      color: COLORS.background,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    373b
                  </Text>
                  <Text style={{ color: COLORS.background }}>Iloilo City</Text>
                </View>
              </View>
              <View style={style.appBarleft}>
                <FontAwesome
                  name="heart-o"
                  size={24}
                  color={COLORS.background}
                />
                <TouchableOpacity onPress={() => navigation.navigate("MyCart")}>
                  <Ionicons
                    name="bag-handle-outline"
                    size={24}
                    color={COLORS.background}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* search content */}
            <View style={style.SearchContainer}>
              <View style={style.searchBarcontainer}>
                <TouchableOpacity>
                  <FontAwesome
                    name="search"
                    style={style.searchIcon}
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>

                <View style={style.searchwrapper}>
                  <TextInput placeholder="Search" style={style.textInput} />
                </View>
              </View>
              <TouchableOpacity style={style.searchCamera}>
                <Ionicons name="camera-outline" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={style.homeBody}>
            <View style={{ padding: 20 }}>
              {/* slider area */}
              <Slider></Slider>

              {/* Categories area */}
              <Categories></Categories>

              {/* Product Scroll view */}
              <View style={{ gap: 20, marginTop: 20 }}>
                {/* Product Title 1 */}
                <ProductsTitle title="Exclusive Products" />
                <ProductStyle data={productsample} />
              </View>
              <View style={{ gap: 20, marginTop: 20, marginBottom: 100 }}>
                {/* Product Title 2 */}
                <ProductsTitle title="Exclusive Products" />
                <ProductStyle data={productsample} />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;
