import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  Animated,
  Easing,
} from "react-native";
import React, { useContext, useState, useEffect, useRef } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../auth/AuthContext";
import API_URL from "../api/api_urls";
import { COLORS } from "../style/theme";
import Toast from 'react-native-toast-message';

const API = API_URL + "/api/v1/Login%20Buyer/buyer_login";

const CustomerLogin = () => {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const [tokenLogin, setTokenLogin] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showFailPopup, setShowFailPopup] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Logintoken();
  }, []);

  const Logintoken = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setTokenLogin(data.loginToken);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogin = async () => {
    const result = await login(username, password, tokenLogin, navigation);
    console.log("Login result:", result);
    if (!result) {
      showLoginFailPopup();
      Logintoken();
    }
  };

  const showLoginFailPopup = () => {
    setShowFailPopup(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Auto close after 2.5s
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShowFailPopup(false));
    }, 2500);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Ionicons
              name={"arrow-undo-outline"}
              color={"white"}
              size={30}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.text}>Log In</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.push("index")}>
          <Ionicons
            name={"help-circle-outline"}
            color={"white"}
            size={30}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* FORM */}
      <ScrollView style={styles.container}>
        <View style={styles.LogoContainer}>
          <Image
            source={require("../assets/imgs/biznest-new.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name={"person-outline"} size={25} />
            <TextInput
              style={styles.textInput}
              placeholder="Phone/Email/Username"
              value={username}
              onChangeText={(uName) => setUsername(uName)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name={"lock-closed-outline"} size={25} />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              secureTextEntry={!showPass}
              value={password}
              onChangeText={(Pass) => setPassword(Pass)}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Ionicons
                name={showPass ? "eye-outline" : "eye-off-outline"}
                size={20}
              />
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity>
              <Text style={styles.forgotPass}>Forgot</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.contWith}>━━━━━ Or continue with ━━━━━</Text>
        </View>

        <View style={styles.appIconContainer}>
          <TouchableOpacity>
            <Image
              source={require("../assets/imgs/facebook.png")}
              style={styles.appIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../assets/imgs/google.png")}
              style={styles.appIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../assets/imgs/apple-logo.png")}
              style={styles.appIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.signUpTextContainer}>
          <Text style={styles.signUpText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.push("CustomerSignup")}>
            <Text style={styles.signUpTouch}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ⚠️ LOGIN FAILED POPUP */}
      <Modal visible={showFailPopup} transparent animationType="none">
        <View style={styles.overlay}>
          <Animated.View style={[styles.popup, { opacity: fadeAnim }]}>
            <Ionicons name="alert-circle-outline" size={50} color="#ff5c5c" />
            <Text style={styles.popupTitle}>Login Failed</Text>
            <Text style={styles.popupText}>
              Please check your username or password.
            </Text>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomerLogin;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
  },
  row: { flexDirection: "row", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold", color: "white" },
  icon: { marginRight: 8 },
  logo: { height: 250, width: 225, marginVertical: 10 },
  LogoContainer: { alignItems: "center", justifyContent: "center" },
  formContainer: { marginTop: 10 },
  inputContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    marginVertical: 10,
    margin: 15,
  },
  textInput: { flex: 1, paddingHorizontal: 20 },
  forgotPass: {
    textDecorationLine: "underline",
    color: "blue",
    fontWeight: "500",
    marginLeft: 10,
  },
  separator: {
    height: "60%",
    width: 1,
    backgroundColor: "black",
    marginHorizontal: 10,
  },
  contWith: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 4,
  },
  appIconContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 15,
  },
  appIcon: { width: 40, height: 40, resizeMode: "contain" },
  signUpTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  signUpText: { fontSize: 20 },
  signUpTouch: { fontSize: 20, fontWeight: "bold" },
  loginButton: {
    borderWidth: 1,
    borderColor: COLORS.background,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
    margin: 10,
    backgroundColor: COLORS.primary,
  },
  loginText: { color: "white", fontSize: 20, fontWeight: "bold" },

  // 🔥 POPUP STYLES
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#1e1e1e",
    width: "80%",
    padding: 25,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 10,
  },
  popupTitle: {
    color: "#ff5c5c",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  popupText: {
    color: "#ddd",
    textAlign: "center",
    marginTop: 8,
    fontSize: 15,
  },
});
