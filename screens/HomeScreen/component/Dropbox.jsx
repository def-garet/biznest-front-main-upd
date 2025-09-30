import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

const Dropbox = () => {
  const [myIndex, setmyIndex] = useState(null);
  const [toggle, setToggle] = useState({});

  const handlePress = (index) => {
    setmyIndex(index);
    setToggle((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <View style={{ marginTop: 20 }}>
      <FlatList
        data={drop}
        renderItem={({ item, index }) => (
          <View>
            <TouchableOpacity
              onPress={() => handlePress(index)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomColor: "#E3E3E3",
                borderBottomWidth: 1,
                marginBottom: 10,
                paddingVertical: 15,
              }}
            >
              <Text>{item.title}</Text>
              <AntDesign
                name={toggle[index] ? "down" : "right"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
            {myIndex === index && toggle[index] ? (
              <Text>{item.content}</Text>
            ) : null}
          </View>
        )}
      />
    </View>
  );
};

export default Dropbox;
