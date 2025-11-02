  import { StatusBar } from "expo-status-bar";
  import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
  import { Home, Search, Store, Profile, Notifications } from "../screens";
  import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
  import FontAwesome from "@expo/vector-icons/FontAwesome";
  import { MaterialCommunityIcons } from "@expo/vector-icons";
  import { COLORS } from "../style/theme";
  import { AuthContext } from "../auth/AuthContext";
  import { useContext, useEffect } from "react";
  import { useNavigation } from "@react-navigation/native";
  import { useSafeAreaInsets } from "react-native-safe-area-context";
  import N8NAPI_URL from "../api/n8n_api";
  import axiosInstance from "../api/axiosInstance";
  import AsyncStorage from "@react-native-async-storage/async-storage";

  const Tab = createBottomTabNavigator();

  const TabNavigator = () => {
    const navigation = useNavigation();
    const { userToken, pageload } = useContext(AuthContext);
    const insets = useSafeAreaInsets(); // 👈 auto-detects bottom padding
    
    const fetchRecommendationEvaluation = async () => {
    try {
      // http://localhost:5678/webhook-test/Recommendation http://localhost:5678/webhook/Recommendation
      const response = await axiosInstance.post(`${N8NAPI_URL}/webhook/Recommendation`); 
        console.log("Recommendation Data:", response.data);
        await AsyncStorage.setItem("lastRecommendationFetch", new Date().toISOString());
    } catch (error) {
      console.error("Error fetching data:", error);

  };
}
    // useEffect(() => {
    //   console.log("User Token:", userToken);
    //   fetchRecommendationEvaluation();
    // }, []);

  useEffect(() => {
    const checkAndFetch = async () => {
      console.log("User Token:", userToken);

      const lastFetch = await AsyncStorage.getItem("lastRecommendationFetch");
      const now = new Date();

      if (!lastFetch) {
        // First run
        await fetchRecommendationEvaluation();
      } else {
        const lastDate = new Date(lastFetch);
        const diffHours = (now - lastDate) / (1000 * 60 * 60);

        if (diffHours >= 24) {
          // 1 day or more passed
          await fetchRecommendationEvaluation();
        } else {
          console.log(`Next fetch in ${Math.ceil(24 - diffHours)} hours.`);
        }
      }
    };

    checkAndFetch();
  }, [userToken]);


    return (
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: [
            styles.tabBarStyle,
            { paddingBottom: insets.bottom  }, // 👈 dynamically adjust
          ],        
        }}
      >
        <Tab.Screen
          name="HomeMain"
          component={Home}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="home" label="HOME" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="search" label="Search" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Store"
          component={Store}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="shopping-bag" label="Store" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={Notifications}
          options={{
            tabBarButton: userToken
              ? undefined
              : (props) => (
                  <TouchableOpacity
                    {...props}
                    onPress={() => navigation.navigate("CustomerLogin")}
                  />
                ),
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name="bell-outline"
                label="Notify"
                focused={focused}
                isMaterialCommunity
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarButton: userToken
              ? undefined
              : (props) => (
                  <TouchableOpacity
                    {...props}
                    onPress={() => navigation.navigate("CustomerLogin")}
                  />
                ),
            tabBarIcon: ({ focused }) => (
              <TabIcon name="user-circle-o" label="Profile" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };

  export default TabNavigator;

  const TabIcon = ({ name, label, focused, isMaterialCommunity = false }) => {
    const IconComponent = isMaterialCommunity
      ? MaterialCommunityIcons
      : FontAwesome;

    return (
      <View style={styles.navIcon}>
        {focused ? (
          <View style={styles.activeCircle}>
            <IconComponent name={name} size={22} color="#fff" />
          </View>
        ) : (
          <IconComponent name={name} size={22} color="#ECEBDE" />
        )}
        <Text
          style={[
            styles.label,
            { color: focused ? COLORS.secondary : "#ECEBDE" },
          ]}
        >
          {label}
        </Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
    tabBarStyle: {
     backgroundColor: COLORS.primary,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    height: 60,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 10,
    },
    navIcon: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 6,
    },
    activeCircle: {
      backgroundColor: COLORS.secondary,
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 4,
    },
    // centerButton: {
    //   position: "absolute",
    //   top: -25,
    //   width: 65,
    //   height: 65,
    //   borderRadius: 32.5,
    //   backgroundColor: "#fff",
    //   alignItems: "center",
    //   justifyContent: "center",
    //   shadowColor: "#000",
    //   shadowOffset: { width: 0, height: 6 },
    //   shadowOpacity: 0.2,
    //   shadowRadius: 6,
    //   elevation: 8,
    //   zIndex: 10,
    // },
    label: {
      fontSize: 10,
      marginTop: 2,
    },
  });
