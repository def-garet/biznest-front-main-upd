// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { COLORS } from "../../style/theme";

// const MyAddress = () => {
//   const navigation = useNavigation();
//   const route = useRoute();

//   const [address, setAddress] = useState(route.params?.address || "");
//   const [city, setCity] = useState(route.params?.city || "");
//   const [postalCode, setPostalCode] = useState(route.params?.postalCode || "");

//   const handleSave = () => {
//     const updatedAddress = { address, city, postalCode };
//     navigation.navigate("Profile", { updatedAddress });
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.navigate("Setting")}
//           style={styles.backButton}
//         >
//           <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
//         </TouchableOpacity>
//         <Text style={styles.title}>Edit Address</Text>
//         <View style={{ width: 24 }} /> {/* Spacer for alignment */}
//       </View>

//       <ScrollView contentContainerStyle={styles.formContainer}>
//         {/* Address Input */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Street Address</Text>
//           <TextInput
//             value={address}
//             onChangeText={setAddress}
//             style={styles.input}
//             placeholder="Enter your street address"
//             placeholderTextColor="#999"
//           />
//         </View>

//         {/* City Input */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>City</Text>
//           <TextInput
//             value={city}
//             onChangeText={setCity}
//             style={styles.input}
//             placeholder="Enter your city"
//             placeholderTextColor="#999"
//           />
//         </View>

//         {/* Postal Code Input */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Postal Code</Text>
//           <TextInput
//             value={postalCode}
//             onChangeText={setPostalCode}
//             keyboardType="numeric"
//             style={styles.input}
//             placeholder="Enter postal code"
//             placeholderTextColor="#999"
//           />
//         </View>
//       </ScrollView>

//       {/* Save Button */}
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           onPress={handleSave}
//           style={styles.saveButton}
//           activeOpacity={0.8}
//         >
//           <Text style={styles.saveButtonText}>Save Address</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: 16,
//     backgroundColor: "white",
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   backButton: {
//     padding: 4,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: COLORS.primary,
//   },
//   formContainer: {
//     padding: 16,
//     paddingBottom: 100,
//   },
//   inputContainer: {
//     marginBottom: 20,
//     backgroundColor: "white",
//     borderRadius: 8,
//     padding: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   label: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 8,
//     fontWeight: "500",
//   },
//   input: {
//     fontSize: 16,
//     color: "#333",
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   buttonContainer: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 16,
//     backgroundColor: "white",
//     borderTopWidth: 1,
//     borderTopColor: "#eee",
//   },
//   saveButton: {
//     backgroundColor: COLORS.primary,
//     padding: 16,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   saveButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default MyAddress;

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../../style/theme";

const MyAddress = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [address, setAddress] = useState(route.params?.address || "");
  const [city, setCity] = useState(route.params?.city || "");
  const [postalCode, setPostalCode] = useState(route.params?.postalCode || "");

  const handleSave = () => {
    const updatedAddress = { address, city, postalCode };
    navigation.navigate("Profile", { updatedAddress });
  };

  const isFormValid = address.trim() && city.trim() && postalCode.trim();

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Address</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Address Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
          <View style={styles.inputContent}>
            <Text style={styles.label}>Street Address</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              style={styles.input}
              placeholder="Enter your street address"
              placeholderTextColor="#999"
              returnKeyType="next"
            />
          </View>
        </View>

        {/* City Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="business-outline" size={20} color="#666" style={styles.inputIcon} />
          <View style={styles.inputContent}>
            <Text style={styles.label}>City</Text>
            <TextInput
              value={city}
              onChangeText={setCity}
              style={styles.input}
              placeholder="Enter your city"
              placeholderTextColor="#999"
              returnKeyType="next"
            />
          </View>
        </View>

        {/* Postal Code Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
          <View style={styles.inputContent}>
            <Text style={styles.label}>Postal Code</Text>
            <TextInput
              value={postalCode}
              onChangeText={setPostalCode}
              keyboardType="numeric"
              style={styles.input}
              placeholder="Enter postal code"
              placeholderTextColor="#999"
              returnKeyType="done"
            />
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSave}
          style={[
            styles.saveButton,
            !isFormValid && styles.saveButtonDisabled
          ]}
          activeOpacity={0.8}
          disabled={!isFormValid}
        >
          <Text style={styles.saveButtonText}>Save Address</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  headerSpacer: {
    width: 40,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  inputIcon: {
    marginRight: 12,
  },
  inputContent: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 4,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    fontSize: 16,
    color: "#0f172a",
    paddingVertical: 4,
    fontWeight: "500",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: "#cbd5e1",
    shadowColor: "transparent",
    elevation: 0,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default MyAddress;  