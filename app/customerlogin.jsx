// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   TextInput,
//   Modal,
//   Animated,
//   Easing,
// } from "react-native";
// import React, { useContext, useState, useEffect, useRef } from "react";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { useNavigation } from "@react-navigation/native";
// import { AuthContext } from "../auth/AuthContext";
// import API_URL from "../api/api_urls";
// import { COLORS } from "../style/theme";
// import Toast from 'react-native-toast-message';

// const API = API_URL + "/api/v1/Login%20Buyer/buyer_login";

// const CustomerLogin = () => {
//   const navigation = useNavigation();
//   const { login } = useContext(AuthContext);

//   const [tokenLogin, setTokenLogin] = useState(null);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [showFailPopup, setShowFailPopup] = useState(false);
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Logintoken();
//   }, []);

//   const Logintoken = async () => {
//     try {
//       const response = await fetch(API);
//       const data = await response.json();
//       setTokenLogin(data.loginToken);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleLogin = async () => {
//     const result = await login(username, password, tokenLogin, navigation);
//     console.log("Login result:", result);
//     if (!result) {
//       showLoginFailPopup();
//       Logintoken();
//     }
//   };

//   const showLoginFailPopup = () => {
//     setShowFailPopup(true);
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 300,
//       easing: Easing.out(Easing.ease),
//       useNativeDriver: true,
//     }).start();

//     // Auto close after 2.5s
//     setTimeout(() => {
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: true,
//       }).start(() => setShowFailPopup(false));
//     }, 2500);
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         <View style={styles.row}>
//           <TouchableOpacity onPress={() => navigation.navigate("Home")}>
//             <Ionicons
//               name={"arrow-undo-outline"}
//               color={"white"}
//               size={30}
//               style={styles.icon}
//             />
//           </TouchableOpacity>
//           <Text style={styles.text}>Log In</Text>
//         </View>
//         <TouchableOpacity onPress={() => navigation.push("index")}>
//           <Ionicons
//             name={"help-circle-outline"}
//             color={"white"}
//             size={30}
//             style={styles.icon}
//           />
//         </TouchableOpacity>
//       </View>

//       {/* FORM */}
//       <ScrollView style={styles.container}>
//         <View style={styles.LogoContainer}>
//           <Image
//             source={require("../assets/imgs/biznest-new.png")}
//             style={styles.logo}
//           />
//         </View>

//         <View style={styles.formContainer}>
//           <View style={styles.inputContainer}>
//             <Ionicons name={"person-outline"} size={25} />
//             <TextInput
//               style={styles.textInput}
//               placeholder="Phone/Email/Username"
//               value={username}
//               onChangeText={(uName) => setUsername(uName)}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Ionicons name={"lock-closed-outline"} size={25} />
//             <TextInput
//               style={styles.textInput}
//               placeholder="Password"
//               secureTextEntry={!showPass}
//               value={password}
//               onChangeText={(Pass) => setPassword(Pass)}
//             />
//             <TouchableOpacity onPress={() => setShowPass(!showPass)}>
//               <Ionicons
//                 name={showPass ? "eye-outline" : "eye-off-outline"}
//                 size={20}
//               />
//             </TouchableOpacity>
//             <View style={styles.separator} />
//             <TouchableOpacity>
//               <Text style={styles.forgotPass}>Forgot</Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//             <Text style={styles.loginText}>Log In</Text>
//           </TouchableOpacity>
//         </View>

//         <View>
//           <Text style={styles.contWith}>━━━━━ Or continue with ━━━━━</Text>
//         </View>

//         <View style={styles.appIconContainer}>
//           <TouchableOpacity>
//             <Image
//               source={require("../assets/imgs/facebook.png")}
//               style={styles.appIcon}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <Image
//               source={require("../assets/imgs/google.png")}
//               style={styles.appIcon}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <Image
//               source={require("../assets/imgs/apple-logo.png")}
//               style={styles.appIcon}
//             />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.signUpTextContainer}>
//           <Text style={styles.signUpText}>Don't have an account?</Text>
//           <TouchableOpacity onPress={() => navigation.push("CustomerSignup")}>
//             <Text style={styles.signUpTouch}> Sign Up</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* ⚠️ LOGIN FAILED POPUP */}
//       <Modal visible={showFailPopup} transparent animationType="none">
//         <View style={styles.overlay}>
//           <Animated.View style={[styles.popup, { opacity: fadeAnim }]}>
//             <Ionicons name="alert-circle-outline" size={50} color="#ff5c5c" />
//             <Text style={styles.popupTitle}>Login Failed</Text>
//             <Text style={styles.popupText}>
//               Please check your username or password.
//             </Text>
//           </Animated.View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default CustomerLogin;

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: COLORS.primary,
//   },
//   row: { flexDirection: "row", alignItems: "center" },
//   text: { fontSize: 20, fontWeight: "bold", color: "white" },
//   icon: { marginRight: 8 },
//   logo: { height: 250, width: 225, marginVertical: 10 },
//   LogoContainer: { alignItems: "center", justifyContent: "center" },
//   formContainer: { marginTop: 10 },
//   inputContainer: {
//     borderWidth: 1,
//     borderColor: "black",
//     borderRadius: 100,
//     paddingHorizontal: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 2,
//     marginVertical: 10,
//     margin: 15,
//   },
//   textInput: { flex: 1, paddingHorizontal: 20 },
//   forgotPass: {
//     textDecorationLine: "underline",
//     color: "blue",
//     fontWeight: "500",
//     marginLeft: 10,
//   },
//   separator: {
//     height: "60%",
//     width: 1,
//     backgroundColor: "black",
//     marginHorizontal: 10,
//   },
//   contWith: {
//     fontSize: 20,
//     fontWeight: "600",
//     textAlign: "center",
//     marginVertical: 4,
//   },
//   appIconContainer: {
//     flexDirection: "row",
//     justifyContent: "space-evenly",
//     alignItems: "center",
//     marginTop: 15,
//   },
//   appIcon: { width: 40, height: 40, resizeMode: "contain" },
//   signUpTextContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 18,
//   },
//   signUpText: { fontSize: 20 },
//   signUpTouch: { fontSize: 20, fontWeight: "bold" },
//   loginButton: {
//     borderWidth: 1,
//     borderColor: COLORS.background,
//     borderRadius: 10,
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 15,
//     marginVertical: 10,
//     margin: 10,
//     backgroundColor: COLORS.primary,
//   },
//   loginText: { color: "white", fontSize: 20, fontWeight: "bold" },

//   // 🔥 POPUP STYLES
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   popup: {
//     backgroundColor: "#1e1e1e",
//     width: "80%",
//     padding: 25,
//     borderRadius: 18,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.3,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 10,
//     elevation: 10,
//   },
//   popupTitle: {
//     color: "#ff5c5c",
//     fontSize: 22,
//     fontWeight: "bold",
//     marginTop: 10,
//   },
//   popupText: {
//     color: "#ddd",
//     textAlign: "center",
//     marginTop: 8,
//     fontSize: 15,
//   },
// });


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
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState, useEffect, useRef } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../auth/AuthContext";
import API_URL from "../api/api_urls";
import { COLORS } from "../style/theme";

// Define your endpoints here
const BUYER_API = API_URL + "/api/v1/Login%20Buyer/buyer_login";
const SELLER_API = API_URL + "/api/v1/Login%20Seller/seller_login"; // Ensure this matches your backend

const CustomerLogin = () => {
  const navigation = useNavigation();
  // Ensure sellerLogin is exposed in your AuthContext, or handle it here
  const { login, sellerLogin } = useContext(AuthContext);

  const [tokenLogin, setTokenLogin] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // NEW: Toggle State ('buyer' or 'seller')
  const [userType, setUserType] = useState("buyer");

  const [showFailPopup, setShowFailPopup] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Refresh token when userType changes
  useEffect(() => {
    Logintoken();
  }, [userType]);

  const Logintoken = async () => {
    try {
      const endpoint = userType === "buyer" ? BUYER_API : SELLER_API;
      const response = await fetch(endpoint);
      const data = await response.json();
      setTokenLogin(data.loginToken);
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      showLoginFailPopup();
      return;
    }

    setLoading(true);
    let result;

    try {
      if (userType === "buyer") {
        result = await login(username, password, tokenLogin, navigation);
      } else {
        // Assuming sellerLogin exists in your context. 
        // If not, you might need to implement the fetch logic directly here for now.
        if (sellerLogin) {
            result = await sellerLogin(username, password, tokenLogin, navigation);
        } else {
            console.warn("sellerLogin function not found in AuthContext");
            result = { success: false };
        }
      }

      console.log("Login result:", result);
      
      if (!result || !result.success) {
        showLoginFailPopup();
        Logintoken(); // Refresh token on failure
      }
    } catch (error) {
      console.error("Login error:", error);
      showLoginFailPopup();
    } finally {
      setLoading(false);
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

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShowFailPopup(false));
    }, 2500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
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
          <Text style={styles.headerText}>Log In</Text>
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

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.LogoContainer}>
          <Image
            source={require("../assets/imgs/biznest-new.png")}
            style={styles.logo}
          />
        </View>

        {/* 🔥 MODERN TOGGLE SWITCH */}
        <View style={styles.toggleWrapper}>
            <View style={styles.toggleContainer}>
            <TouchableOpacity
                style={[styles.toggleBtn, userType === "buyer" && styles.activeToggle]}
                onPress={() => setUserType("buyer")}
                activeOpacity={0.8}
            >
                <Text style={[styles.toggleText, userType === "buyer" && styles.activeText]}>
                Customer
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.toggleBtn, userType === "seller" && styles.activeToggle]}
                onPress={() => setUserType("seller")}
                activeOpacity={0.8}
            >
                <Text style={[styles.toggleText, userType === "seller" && styles.activeText]}>
                Seller
                </Text>
            </TouchableOpacity>
            </View>
        </View>

        {/* FORM */}
        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>
            Welcome Back, {userType === 'buyer' ? 'Shopper' : 'Partner'}!
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons name={"person-outline"} size={22} color="#555" />
            <TextInput
              style={styles.textInput}
              placeholder={userType === "buyer" ? "Phone / Email / Username" : "Seller ID / Email"}
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name={"lock-closed-outline"} size={22} color="#555" />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#888"
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Ionicons
                name={showPass ? "eye-outline" : "eye-off-outline"}
                size={22}
                color="#555"
              />
            </TouchableOpacity>
            
            <View style={styles.separator} />
            
            <TouchableOpacity>
              <Text style={styles.forgotPass}>Forgot?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, loading && { opacity: 0.7 }]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text style={styles.loginText}>
                    Log In as {userType === "buyer" ? "Customer" : "Seller"}
                </Text>
            )}
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.contWith}>━━━━━ Or continue with ━━━━━</Text>
        </View>

        <View style={styles.appIconContainer}>
          <TouchableOpacity style={styles.socialBtn}>
            <Image source={require("../assets/imgs/facebook.png")} style={styles.appIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <Image source={require("../assets/imgs/google.png")} style={styles.appIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <Image source={require("../assets/imgs/apple-logo.png")} style={styles.appIcon} />
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
              Please check your {userType} credentials.
            </Text>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomerLogin;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 30 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.primary,
    paddingTop: 40, // Adjust for status bar
  },
  row: { flexDirection: "row", alignItems: "center" },
  headerText: { fontSize: 20, fontWeight: "bold", color: "white" },
  icon: { marginRight: 8 },
  logo: { height: 200, width: 200, marginVertical: 10, resizeMode: 'contain' },
  LogoContainer: { alignItems: "center", justifyContent: "center", marginTop: 10 },
  
  // 🔥 UPDATED TOGGLE STYLES
  toggleWrapper: { alignItems: 'center', marginBottom: 15 },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 30,
    padding: 4,
    width: '85%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  toggleBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  activeToggle: {
    backgroundColor: COLORS.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
  },
  activeText: {
    color: 'white',
    fontWeight: 'bold',
  },

  formContainer: { paddingHorizontal: 25 },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
  inputContainer: {
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    backgroundColor: "#FAFAFA",
    borderRadius: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    height: 55,
    marginVertical: 8,
  },
  textInput: { flex: 1, paddingHorizontal: 10, fontSize: 16, color: "#333" },
  forgotPass: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 10,
  },
  separator: {
    height: "50%",
    width: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 8,
  },
  
  loginButton: {
    borderRadius: 15,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  loginText: { color: "white", fontSize: 18, fontWeight: "bold" },

  contWith: {
    fontSize: 14,
    color: '#888',
    textAlign: "center",
    marginVertical: 20,
  },
  appIconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialBtn: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
  },
  appIcon: { width: 30, height: 30, resizeMode: "contain" },
  
  signUpTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  signUpText: { fontSize: 16, color: '#555' },
  signUpTouch: { fontSize: 16, fontWeight: "bold", color: COLORS.primary },

  // POPUP STYLES
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  popupTitle: {
    color: "#ff5c5c",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  popupText: {
    color: "#555",
    textAlign: "center",
    marginTop: 5,
    fontSize: 14,
  },
});