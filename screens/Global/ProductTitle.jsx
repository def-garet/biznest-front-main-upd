import { View, Text } from "react-native";
import React from "react";


const ProductsTitle = ({ title }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "600" }}>{title}</Text>
      <Text style={{ fontSize: 16, color: 'black' }}>See All</Text>
    </View>
  );
};

export default ProductsTitle;
