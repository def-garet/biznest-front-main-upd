import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../style/theme";

const MyAddress = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [address, setAddress] = useState(route.params?.address || "");
  const [city, setCity] = useState(route.params?.city || "");
  const [postalCode, setPostalCode] = useState(route.params?.postalCode || "");
  
  // New State for Address Label (Design Enhancement)
  const [addressLabel, setAddressLabel] = useState("Home"); 

  const handleSave = () => {
    const updatedAddress = { address, city, postalCode, label: addressLabel };
    navigation.navigate("Profile", { updatedAddress });
  };

  const isFormValid = address.trim() && city.trim() && postalCode.trim();

  // Helper component for modern inputs
  const ModernInput = ({ label, value, onChange, placeholder, icon, keyboardType = "default" }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputBox}>
        <Feather name={icon} size={18} color="#94a3b8" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#cbd5e1"
          keyboardType={keyboardType}
          returnKeyType="next"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Feather name="arrow-left" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Delivery Address</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* VISUAL HEADER / ILLUSTRATION */}
          <View style={styles.illustrationContainer}>
            <View style={styles.circleBg}>
              <MaterialIcons name="location-on" size={40} color={COLORS.primary} />
            </View>
            <Text style={styles.illustrationTitle}>Where should we deliver?</Text>
            <Text style={styles.illustrationSub}>Enter your location details below</Text>
          </View>

          {/* ADDRESS LABEL CHIPS */}
          <Text style={styles.sectionLabel}>Save address as</Text>
          <View style={styles.chipRow}>
            {["Home", "Work", "Other"].map((label) => (
              <TouchableOpacity
                key={label}
                onPress={() => setAddressLabel(label)}
                style={[
                  styles.chip, 
                  addressLabel === label && styles.chipActive
                ]}
              >
                <Feather 
                  name={label === "Home" ? "home" : label === "Work" ? "briefcase" : "map-pin"} 
                  size={14} 
                  color={addressLabel === label ? "white" : "#64748b"} 
                />
                <Text style={[styles.chipText, addressLabel === label && styles.chipTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* INPUT FORM */}
          <View style={styles.formContainer}>
            <ModernInput 
              label="Street Address" 
              value={address} 
              onChange={setAddress} 
              placeholder="House no., Street name, Brgy." 
              icon="map" 
            />
            <View style={styles.row}>
              <View style={{flex: 1, marginRight: 10}}>
                <ModernInput 
                  label="City" 
                  value={city} 
                  onChange={setCity} 
                  placeholder="e.g. Iloilo" 
                  icon="grid" 
                />
              </View>
              <View style={{flex: 1}}>
                <ModernInput 
                  label="Postal Code" 
                  value={postalCode} 
                  onChange={setPostalCode} 
                  placeholder="e.g. 5000" 
                  icon="hash" 
                  keyboardType="numeric" 
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* BOTTOM ACTION BUTTON */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveBtn, !isFormValid && styles.saveBtnDisabled]}
            activeOpacity={0.8}
            disabled={!isFormValid}
          >
            <Text style={styles.saveBtnText}>Save Address</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // --- HEADER ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },

  // --- ILLUSTRATION HEADER ---
  illustrationContainer: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 10,
  },
  circleBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F4FF", // Soft blue background for the icon
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  illustrationTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 5,
  },
  illustrationSub: {
    fontSize: 13,
    color: "#64748b",
  },

  // --- CHIPS (Tags) ---
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 25,
    gap: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },
  chipTextActive: {
    color: "white",
  },

  // --- FORM ---
  formContainer: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC", // Soft Gray Container
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1e293b",
    fontWeight: "500",
  },

  // --- BOTTOM ACTION BUTTON ---
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  saveBtnDisabled: {
    backgroundColor: "#cbd5e1",
    shadowOpacity: 0,
    elevation: 0,
  },
  saveBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default MyAddress;