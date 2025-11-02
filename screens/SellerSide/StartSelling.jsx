import React, { useState,useContext } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  FlatList
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import axiosInstance from '@api/axiosInstance';
import { AuthContext } from "../../auth/AuthContext";
const API = `/api/v1/seller/Seller Create Account/seller_register`;

const COLORS = {
  primary: '#172d55',
  secondary: '#2196f3',
  background: '#ffffff',
  text: '#808080',
  success: '#4CAF50',
  lightGray: '#E2E8F0',
};

// Dropdown options
const SHOP_CATEGORIES = [
  "Clothing & Accessories",
  "Food & Beverage",
  "Handicrafts",
  "Electronics",
  "Home & Living",
  "Beauty & Personal Care",
  "Books & Stationery",
  "Toys & Games",
  "Others"
];

const BUSINESS_TYPES = [
  "Sole Proprietorship",
  "Partnership",
  "Corporation",
  "Cooperative",
  "Home-based Business",
  "Online Business",
  "Others"
];

const StartSelling = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { logout, user } = useContext(AuthContext);
  
  // Step 1: Basic Information
  const [shopName, setShopName] = useState("");
  const [shopCategory, setShopCategory] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  
  // Step 2: Contact Information
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  
  // Step 3: Business Details
  const [businessDescription, setBusinessDescription] = useState("");


  
  

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowConfirmation(true);
    }
  };

const handleSubmit = async () => {
  try {
    const payload = {
      phone: phoneNumber,
      seller_type: businessType,
      shop_name: shopName,
      // shop_logo: "https://example.com/logo.png", // Optional placeholder
      shop_category: shopCategory,
      shop_description: businessDescription,
      register_address: pickupAddress,
    };

    console.log("Submitting seller registration:", payload);

    const response = await axiosInstance.post(API, payload);

    if (response.status === 200 || response.status === 201) {
      console.log("✅ Seller created:", response.data);
      setShowConfirmation(true);
       await logout(); 
       navigation.navigate("Home"); 
    } else {
      console.log("⚠️ Unexpected response:", response.status);
      alert("Something went wrong, please try again.");
    }
  } catch (error) {
    console.error("❌ Error creating seller:", error.response?.data || error.message);
    alert("Failed to register seller. Please check your connection or try again later.");
  }
};



  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    navigation.navigate("Profile");
  };

  const isStepValid = () => {
    switch(currentStep) {
      case 1:
        return shopName && shopCategory && businessType;
      case 2:
        return email && phoneNumber && pickupAddress;
      case 3:
        return businessDescription;
      default:
        return false;
    }
  };

  const selectCategory = (category) => {
    setShopCategory(category);
    setShowCategoryDropdown(false);
  };

  const selectBusinessType = (type) => {
    setBusinessType(type);
    setShowTypeDropdown(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      {/* Overlay for dropdowns - moved to top level */}
      {(showCategoryDropdown || showTypeDropdown) && (
        <TouchableWithoutFeedback 
          onPress={() => {
            setShowCategoryDropdown(false);
            setShowTypeDropdown(false);
          }}
        >
          <View style={styles.dropdownOverlay} />
        </TouchableWithoutFeedback>
      )}

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={handlePrevStep}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={currentStep === 1 ? "chevron-back" : "arrow-back"} 
              size={28} 
              color="white" 
            />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {currentStep === 1 ? "Shop Information" : 
               currentStep === 2 ? "Contact Details" : "About Your Business"}
            </Text>
            <Text style={styles.subtitle}>Step {currentStep} of 3</Text>
          </View>
        </View>

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(currentStep/3)*100}%` }]} />
          </View>
        </View>

        {/* Form content */}
        <View style={styles.contentContainer}>
          {currentStep === 1 && (
            <>
              <View style={styles.sectionHeader}>
                <Ionicons name="storefront" size={22} color={COLORS.primary} />
                <Text style={styles.sectionHeaderText}>Basic Information</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Shop Name *</Text>
                <TextInput 
                  value={shopName} 
                  onChangeText={setShopName} 
                  style={styles.input} 
                  placeholder="E.g. Hablon Haven"
                  placeholderTextColor={COLORS.text}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Shop Category *</Text>
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={() => {
                    setShowTypeDropdown(false);
                    setShowCategoryDropdown(!showCategoryDropdown);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dropdownButtonText, !shopCategory && { color: COLORS.text }]}>
                    {shopCategory || "Select a category"}
                  </Text>
                  <Ionicons 
                    name={showCategoryDropdown ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={COLORS.primary} 
                  />
                </TouchableOpacity>
                
                {showCategoryDropdown && (
                  <View style={styles.dropdownList}>
                    <FlatList
                      data={SHOP_CATEGORIES}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => selectCategory(item)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.dropdownItemText}>{item}</Text>
                          {shopCategory === item && (
                            <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                          )}
                        </TouchableOpacity>
                      )}
                      nestedScrollEnabled={true}
                    />
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Business Type *</Text>
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={() => {
                    setShowCategoryDropdown(false);
                    setShowTypeDropdown(!showTypeDropdown);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dropdownButtonText, !businessType && { color: COLORS.text }]}>
                    {businessType || "Select business type"}
                  </Text>
                  <Ionicons 
                    name={showTypeDropdown ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={COLORS.primary} 
                  />
                </TouchableOpacity>
                
                {showTypeDropdown && (
                  <View style={styles.dropdownList}>
                    <FlatList
                      data={BUSINESS_TYPES}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => selectBusinessType(item)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.dropdownItemText}>{item}</Text>
                          {businessType === item && (
                            <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                          )}
                        </TouchableOpacity>
                      )}
                      nestedScrollEnabled={true}
                    />
                  </View>
                )}
              </View>
            </>
          )}

          {currentStep === 2 && (
            <>
              <View style={styles.sectionHeader}>
                <Ionicons name="person" size={22} color={COLORS.primary} />
                <Text style={styles.sectionHeaderText}>Contact Information</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput 
                  value={email} 
                  onChangeText={setEmail} 
                  keyboardType="email-address" 
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor={COLORS.text}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput 
                  value={phoneNumber} 
                  onChangeText={setPhoneNumber} 
                  keyboardType="phone-pad" 
                  style={styles.input}
                  placeholder="(+63)"
                  placeholderTextColor={COLORS.text}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Pickup Address *</Text>
                <TextInput 
                  value={pickupAddress} 
                  onChangeText={setPickupAddress} 
                  style={[styles.input, styles.multilineInput]} 
                  placeholder="Where will customers pick up orders?"
                  placeholderTextColor={COLORS.text}
                  multiline
                />
              </View>
            </>
          )}

          {currentStep === 3 && (
            <>
              <View style={styles.sectionHeader}>
                <Ionicons name="information-circle" size={22} color={COLORS.primary} />
                <Text style={styles.sectionHeaderText}>About Your Business</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Business Description *</Text>
                <TextInput 
                  value={businessDescription} 
                  onChangeText={setBusinessDescription} 
                  style={[styles.input, styles.multilineInput, {height: 120}]}
                  placeholder="Tell us about your business (what you sell, your experience, etc.)"
                  placeholderTextColor={COLORS.text}
                  multiline
                />
              </View>
            </>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            {currentStep > 1 && (
              <TouchableOpacity 
                onPress={handlePrevStep}
                style={[styles.navButton, styles.secondaryButton]}
                activeOpacity={0.8}
              >
                <Text style={[styles.navButtonText, { color: COLORS.primary }]}>Back</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              onPress={() => {
                if (currentStep === 3) {
                  handleSubmit();
                } else {
                  handleNextStep();
                }
              }}
              
              style={[
                styles.navButton, 
                styles.primaryButton,
                !isStepValid() && styles.disabledButton,
                currentStep === 1 && { width: '100%' }
              ]}
              activeOpacity={0.8}
              disabled={!isStepValid()}
            >
              <Text style={[styles.navButtonText, { color: "white" }]}>
                {currentStep === 3 ? 'Submit' : 'Continue'}
              </Text>
              <Ionicons 
                name={currentStep === 3 ? "checkmark" : "arrow-forward"} 
                size={22} 
                color="white" 
                style={styles.buttonIcon} 
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.helpText}>
            All fields marked with * are required. We'll never share your information with third parties.
          </Text>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Ionicons name="checkmark-circle" size={48} color={COLORS.success} />
              <Text style={styles.modalTitle}>Application Submitted!</Text>
            </View>
            
            <Text style={styles.modalText}>
              Thank you for your application! We've sent a confirmation email to {email}. 
              Our team will review your details and get back to you within 2 business days.
            </Text>
            
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleConfirmationClose}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>Got it!</Text>
              <Ionicons 
                name="checkmark" 
                size={20} 
                color="white" 
                style={styles.modalButtonIcon} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  progressBar: {
    height: 6,
    backgroundColor: '#EDF2F7',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 3,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginLeft: 12,
  },
  inputGroup: {
    marginBottom: 24,
    zIndex: 1, // Ensure dropdown appears above other elements
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    padding: 16,
    fontSize: 15,
    color: "#2D3748",
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  // Dropdown styles
  dropdownButton: {
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 15,
    color: "#2D3748",
  },
  dropdownList: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    marginTop: 8,
    maxHeight: 200,
    overflow: 'hidden',
    elevation: 3,
  },
  dropdownItem: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#2D3748",
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  navButton: {
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  disabledButton: {
    opacity: 0.6,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  buttonIcon: {
    marginLeft: 10,
  },
  helpText: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 18,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  modalButtonIcon: {
    marginLeft: 10,
  },
});

export default StartSelling;