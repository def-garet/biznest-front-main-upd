import { View, FlatList, Image, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import fakeProducts from "../HomeScreen/biznestasset/fakeProducts";
import { responsiveWidth } from "react-native-responsive-dimensions";

const Suggestions = () => {
  const navigation = useNavigation();

  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Search Suggestions
      </Text>

      <FlatList
        data={fakeProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-evenly" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ProductDetails", { product_id: item.id })
            }
            activeOpacity={0.7}
            style={{
              width: responsiveWidth(27),
              aspectRatio: 1,
              marginBottom: 10,
              borderRadius: 10,
              overflow: "hidden",
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 100,
              elevation: 3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{
                height: "90%",
                width: "90%",
                resizeMode: "contain",
              }}
              source={{ uri: item.img }}
            />
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Suggestions;
