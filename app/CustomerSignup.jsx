import React, { useState, useContext, useEffect, useRef } from "react";
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
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../auth/AuthContext";
import API_URL from "../api/api_urls";
import { COLORS } from "../style/theme";

const API = API_URL + "/api/v1/Register%20Buyer/buyer_register";

const CustomerSignup = () => {
  const navigation = useNavigation();
  const { customerRegister } = useContext(AuthContext);

  const [fName, setFname] = useState("");
  const [lName, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setReEPassword] = useState("");
  const [tokenRegistration, setTokenRegistration] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [reEnterPass, setReEnterPass] = useState(false);

  // Custom Alert Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupColor, setPopupColor] = useState("#ff5c5c");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Regisrationtoken();
  }, []);

  const Regisrationtoken = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setTokenRegistration(data.registerToken);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  

  // 🔥 Custom popup animation
  const showCustomAlert = (title, message, color = "#ff5c5c") => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupColor(color);
    setShowPopup(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShowPopup(false));
    }, 2500);
  };

 const register = async () => {
  try {
    const result = await customerRegister(
      fName,
      lName,
      email,
      password,
      rePassword,
      tokenRegistration
    );

    if (result && result.success) {
      showCustomAlert("Registration Successful", "Welcome to BIZNest!", "#4CAF50");
      setTimeout(() => navigation.goBack(), 2700);
    } else {
      showCustomAlert(
        "Registration Failed",
        result?.message || "Please check your details and try again."
      );
    }
  } catch (error) {
    console.error("Registration Error:", error);
    showCustomAlert("Error", "Couldn't complete registration. Try again.");
  }
};


  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name={"arrow-undo-outline"}
              color={"white"}
              size={30}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.text}>Sign Up</Text>
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

      {/* BODY */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.LogoContainer}>
          <Image
            source={require("../assets/imgs/biznest-new.png")}
            style={styles.logo}
          />
        </View>

        {/* FORM */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name={"person-outline"} size={25} />
            <TextInput
              style={styles.textInput}
              placeholder="First Name"
              value={fName}
              onChangeText={(f_name) => setFname(f_name)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name={"person-outline"} size={25} />
            <TextInput
              style={styles.textInput}
              placeholder="Last Name"
              value={lName}
              onChangeText={(l_name) => setLname(l_name)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name={"mail-outline"} size={25} />
            <TextInput
              style={styles.textInput}
              placeholder="Email Address"
              value={email}
              onChangeText={(email) => setEmail(email)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name={"lock-closed-outline"} size={25} />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              secureTextEntry={!showPass}
              value={password}
              onChangeText={(pass) => setPassword(pass)}
            />
            <TouchableOpacity
              onPress={() => setShowPass(!showPass)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPass ? "eye-outline" : "eye-off-outline"}
                size={20}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name={"lock-closed-outline"} size={25} />
            <TextInput
              style={styles.textInput}
              placeholder="Re-enter Password"
              secureTextEntry={!reEnterPass}
              value={rePassword}
              onChangeText={(repass) => setReEPassword(repass)}
            />
            <TouchableOpacity
              onPress={() => setReEnterPass(!reEnterPass)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={reEnterPass ? "eye-outline" : "eye-off-outline"}
                size={20}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signupButton} onPress={register}>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.contWith}>━━━━━━ Or continue with ━━━━━━</Text>

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

        <View style={styles.loginTextContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginTouch}> Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ⚠️ CUSTOM POPUP ALERT */}
      <Modal visible={showPopup} transparent animationType="none">
        <View style={styles.overlay}>
          <Animated.View style={[styles.popup, { opacity: fadeAnim }]}>
            <Ionicons name="alert-circle-outline" size={50} color={popupColor} />
            <Text style={[styles.popupTitle, { color: popupColor }]}>
              {popupTitle}
            </Text>
            <Text style={styles.popupText}>{popupMessage}</Text>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomerSignup;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
  },
  row: { flexDirection: "row", alignItems: "center" },
  text: { color: "white", fontSize: 20, fontWeight: "bold" },
  icon: { marginRight: 8 },
  logo: { height: 250, width: 225, marginVertical: -10 },
  LogoContainer: { alignItems: "center", justifyContent: "center" },
  formContainer: { marginTop: 15, paddingHorizontal: 20 },
  inputContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginVertical: 10,
    paddingVertical: 5,
  },
  textInput: { color: "black", flex: 1, paddingHorizontal: 10 },
  signupButton: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    marginVertical: 10,
  },
  signupText: { color: "white", fontSize: 20, fontWeight: "bold" },
  contWith: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 20,
  },
  appIconContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 15,
  },
  appIcon: { width: 40, height: 40, resizeMode: "contain" },
  loginTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  loginText: { fontSize: 20 },
  loginTouch: { fontSize: 20, fontWeight: "bold" },
  eyeIcon: { position: "absolute", right: 15 },

  // Popup Styles
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
