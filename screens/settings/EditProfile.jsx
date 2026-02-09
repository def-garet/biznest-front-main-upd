// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { COLORS } from "../../style/theme";
// import * as ImageManipulator from "expo-image-manipulator";
// import "react-native-get-random-values";
// import { v4 as uuidv4 } from "uuid";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import axiosInstance from '@api/axiosInstance';

// const API = "/api/v1/Profile/buyer_profile";

// const EditProfile = () => {
//   const navigation = useNavigation();
//   const route = useRoute();

//   const [f_name, setFirstName] = useState("");
//   const [l_name, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [gender, setGender] = useState("");
//   const [address, setLocation] = useState("");
//   const [profile_pic, setProfilePicture] = useState("");
//   const [profilePictureBase64, setProfilePictureBase64] = useState(null);
//   const [isImageLoading, setIsImageLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);

//   const userInformation = [
//     { 
//       label: "First Name", 
//       value: f_name, 
//       action: setFirstName, 
//       icon: "person-outline",
//     },
//     { 
//       label: "Last Name", 
//       value: l_name, 
//       action: setLastName, 
//       icon: "person-outline",
//     },
//     { 
//       label: "Email", 
//       value: email, 
//       action: setEmail, 
//       icon: "mail-outline",
//       keyboardType: "email-address"
//     },
//     { 
//       label: "Location", 
//       value: address, 
//       action: setLocation, 
//       icon: "location-outline",
//     },
//     { 
//       label: "Phone Number", 
//       value: phone, 
//       action: setPhone, 
//       icon: "call-outline",
//       keyboardType: "phone-pad" 
//     },
//     { 
//       label: "Gender", 
//       value: gender, 
//       action: setGender, 
//       icon: "male-female-outline",
//     },
//   ];

//   const fetchProfileData = async () => {
//     try {
//       const response = await axiosInstance.get(API);
//       const profile = response.data;

//       setFirstName(profile.f_name);
//       setLastName(profile.l_name);
//       setEmail(profile.email);
//       setLocation(profile.address);
//       setPhone(profile.phone);
//       setGender(profile.gender);
//       setProfilePicture(profile.profile_pic);
//     } catch (error) {
//       console.error("Error fetching profile data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchProfileData();
//   }, []);

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permission required", "Allow access to the gallery to update your profile picture.");
//       return;
//     }

//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//       });

//       if (!result.canceled) {
//         setIsImageLoading(true);
//         const imageUri = result.assets[0].uri;
//         setProfilePicture(imageUri);

//         const manipulatedImage = await ImageManipulator.manipulateAsync(
//           imageUri,
//           [],
//           { base64: true }
//         );
//         setProfilePictureBase64(manipulatedImage.base64);
//       }
//     } catch (error) {
//       console.error("Image picker error:", error);
//       Alert.alert("Error", "Failed to select image.");
//     } finally {
//       setIsImageLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     setIsSaving(true);
//     try {
//       const profilepic_name = `file_${uuidv4()}.jpg`;
//       const jsonData = {
//         f_name,
//         l_name,
//         email,
//         address,
//         phone,
//         gender,
//         profilepic_name,
//         profilePictureBase64,
//       };

//       await axiosInstance.post(API, jsonData);

//       const updatedProfilePic = profilePictureBase64
//         ? `${API_URL}/static/media/Profilepic/${profilepic_name}`
//         : profile_pic;

//       const updatedProfile = {
//         f_name,
//         l_name,
//         email,
//         address,
//         phone,
//         gender,
//         profile_pic: updatedProfilePic,
//       };

//       setProfilePicture(updatedProfilePic);
//       navigation.navigate("Home", { screen: "Profile" });
//     } catch (error) {
//       console.error("Save error:", error);
//       Alert.alert("Error", "Failed to save profile. Please try again.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const isFormValid = f_name.trim() && l_name.trim() && email.trim();

//   return (
//     <KeyboardAvoidingView 
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <ScrollView 
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity 
//             onPress={() => navigation.goBack()} 
//             style={styles.backButton}
//           >
//             <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Edit Profile</Text>
//           <View style={styles.headerSpacer} />
//         </View>

//         {/* Profile Picture Section - Stretched to full width */}
//         <View style={styles.profileSection}>
//           <View style={styles.profileContent}>
//             <TouchableOpacity onPress={pickImage} style={styles.profilePicWrapper}>
//               {isImageLoading ? (
//                 <ActivityIndicator size="large" color={COLORS.primary} />
//               ) : (
//                 <>
//                   <Image
//                     source={{ uri: profile_pic || "https://via.placeholder.com/150" }}
//                     style={styles.profilePic}
//                   />
//                   <View style={styles.cameraIcon}>
//                     <Ionicons name="camera" size={18} color="white" />
//                   </View>
//                 </>
//               )}
//             </TouchableOpacity>
//             <Text style={styles.profileName}>{f_name} {l_name}</Text>
//             <Text style={styles.profileEmail}>{email}</Text>
//             <Text style={styles.changePhotoText}>Tap photo to update</Text>
//           </View>
//         </View>

//         {/* Form Section - Stretched to full width */}
//         <View style={styles.formSection}>
//           <View style={styles.sectionHeader}>
//             <Ionicons name="person-circle" size={24} color={COLORS.primary} />
//             <Text style={styles.sectionTitle}>Personal Information</Text>
//           </View>
          
//           <View style={styles.formContainer}>
//             {userInformation.map((item, index) => (
//               <View key={index} style={styles.inputRow}>
//                 <View style={styles.inputIcon}>
//                   <Ionicons name={item.icon} size={22} color={COLORS.primary} />
//                 </View>
//                 <View style={styles.inputWrapper}>
//                   <Text style={styles.label}>{item.label}</Text>
//                   <TextInput
//                     value={item.value}
//                     onChangeText={item.action}
//                     style={styles.input}
//                     placeholder={`Enter ${item.label.toLowerCase()}`}
//                     placeholderTextColor="#94a3b8"
//                     keyboardType={item.keyboardType || "default"}
//                     returnKeyType={index === userInformation.length - 1 ? "done" : "next"}
//                   />
//                 </View>
//                 <View style={styles.inputDecorator} />
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Save Button */}
//         <View style={styles.buttonSection}>
//           <TouchableOpacity
//             onPress={handleSave}
//             style={[
//               styles.saveButton,
//               !isFormValid && styles.saveButtonDisabled
//             ]}
//             disabled={!isFormValid || isSaving}
//             activeOpacity={0.8}
//           >
//             {isSaving ? (
//               <ActivityIndicator color="white" size="small" />
//             ) : (
//               <View style={styles.buttonContent}>
//                 <Ionicons name="checkmark-circle" size={20} color="white" />
//                 <Text style={styles.saveButtonText}>Save Changes</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 24,
//     paddingVertical: 20,
//     backgroundColor: "#ffffff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#f1f5f9",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.03,
//     shadowRadius: 8,
//     elevation: 2,
//     zIndex: 10,
//   },
//   backButton: {
//     padding: 8,
//     borderRadius: 12,
//     backgroundColor: "#f8fafc",
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "800",
//     color: COLORS.primary,
//     letterSpacing: 0.5,
//   },
//   headerSpacer: {
//     width: 40,
//   },
//   profileSection: {
//     backgroundColor: "#ffffff",
//     paddingVertical: 40,
//     marginHorizontal: 0,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f1f5f9",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.02,
//     shadowRadius: 16,
//     elevation: 1,
//   },
//   profileContent: {
//     alignItems: "center",
//     paddingHorizontal: 24,
//   },
//   profilePicWrapper: {
//     position: "relative",
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: "#f8fafc",
//     justifyContent: "center",
//     alignItems: "center",
//     overflow: "hidden",
//     marginBottom: 20,
//     borderWidth: 4,
//     borderColor: "#e2e8f0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.1,
//     shadowRadius: 16,
//     elevation: 4,
//   },
//   profilePic: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 60,
//   },
//   cameraIcon: {
//     position: "absolute",
//     bottom: 8,
//     right: 8,
//     backgroundColor: COLORS.primary,
//     borderRadius: 18,
//     width: 36,
//     height: 36,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.4,
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   profileName: {
//     fontSize: 22,
//     fontWeight: "800",
//     color: "#0f172a",
//     marginBottom: 6,
//     letterSpacing: 0.3,
//   },
//   profileEmail: {
//     fontSize: 16,
//     color: "#64748b",
//     fontWeight: "500",
//     marginBottom: 12,
//   },
//   changePhotoText: {
//     color: COLORS.primary,
//     fontSize: 14,
//     fontWeight: "700",
//     textTransform: "uppercase",
//     letterSpacing: 0.8,
//   },
//   formSection: {
//     backgroundColor: "#ffffff",
//     marginHorizontal: 0,
//     marginBottom: 0,
//     borderTopWidth: 1,
//     borderTopColor: "#f1f5f9",
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 24,
//     paddingVertical: 24,
//     backgroundColor: "#ffffff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#f1f5f9",
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: "#0f172a",
//     marginLeft: 12,
//     letterSpacing: 0.3,
//   },
//   formContainer: {
//     paddingHorizontal: 0,
//   },
//   inputRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 20,
//     paddingHorizontal: 24,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f8fafc",
//     backgroundColor: "#ffffff",
//     position: "relative",
//   },
//   inputIcon: {
//     width: 44,
//     alignItems: "center",
//     marginRight: 16,
//   },
//   inputWrapper: {
//     flex: 1,
//   },
//   label: {
//     fontSize: 12,
//     color: "#64748b",
//     fontWeight: "700",
//     textTransform: "uppercase",
//     letterSpacing: 0.8,
//     marginBottom: 6,
//   },
//   input: {
//     fontSize: 16,
//     color: "#0f172a",
//     fontWeight: "600",
//     padding: 0,
//     margin: 0,
//     minHeight: 24,
//   },
//   inputDecorator: {
//     position: "absolute",
//     right: 24,
//     top: "50%",
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: "#e2e8f0",
//     transform: [{ translateY: -3 }],
//   },
//   buttonSection: {
//     paddingHorizontal: 24,
//     paddingVertical: 32,
//     backgroundColor: "#ffffff",
//     marginTop: 0,
//   },
//   saveButton: {
//     backgroundColor: COLORS.primary,
//     padding: 20,
//     borderRadius: 16,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.4,
//     shadowRadius: 12,
//     elevation: 6,
//     transform: [{ scale: 1 }],
//   },
//   saveButtonDisabled: {
//     backgroundColor: "#cbd5e1",
//     shadowColor: "transparent",
//     transform: [{ scale: 1 }],
//   },
//   buttonContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },
//   saveButtonText: {
//     color: "white",
//     fontSize: 17,
//     fontWeight: "800",
//     letterSpacing: 0.5,
//   },
// });

// export default EditProfile;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../../style/theme";
import * as ImageManipulator from "expo-image-manipulator";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Ionicons, Feather } from "@expo/vector-icons";
import axiosInstance from '@api/axiosInstance';

const API = "/api/v1/Profile/buyer_profile";

const EditProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [f_name, setFirstName] = useState("");
  const [l_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [address, setLocation] = useState("");
  const [profile_pic, setProfilePicture] = useState("");
  const [profilePictureBase64, setProfilePictureBase64] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get(API);
      const profile = response.data;
      setFirstName(profile.f_name);
      setLastName(profile.l_name);
      setEmail(profile.email);
      setLocation(profile.address);
      setPhone(profile.phone);
      setGender(profile.gender);
      setProfilePicture(profile.profile_pic);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Allow access to the gallery to update your profile picture.");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setIsImageLoading(true);
        const imageUri = result.assets[0].uri;
        setProfilePicture(imageUri);

        const manipulatedImage = await ImageManipulator.manipulateAsync(
          imageUri, [], { base64: true }
        );
        setProfilePictureBase64(manipulatedImage.base64);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select image.");
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const profilepic_name = `file_${uuidv4()}.jpg`;
      const jsonData = {
        f_name, l_name, email, address, phone, gender, profilepic_name, profilePictureBase64,
      };

      await axiosInstance.post(API, jsonData);
      navigation.navigate("Home", { screen: "Profile" });
    } catch (error) {
      Alert.alert("Error", "Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = f_name.trim() && l_name.trim() && email.trim();

  const InputField = ({ label, value, onChange, icon, keyboardType = "default" }) => (
    <View style={styles.inputRow}>
      <View style={styles.iconContainer}>
        <Feather name={icon} size={20} color="#64748b" />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor="#cbd5e1"
          keyboardType={keyboardType}
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
        {/* Clean White Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Feather name="arrow-left" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Centered Profile Picture without heavy borders */}
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
              {isImageLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : (
                <>
                  <Image source={{ uri: profile_pic || "https://via.placeholder.com/150" }} style={styles.avatar} />
                  <View style={styles.cameraBadge}>
                    <Ionicons name="camera" size={16} color="white" />
                  </View>
                </>
              )}
            </TouchableOpacity>
            <Text style={styles.avatarHelperText}>Tap to change photo</Text>
          </View>

          {/* Form Fields - Flat Design */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            
            <InputField label="First Name" value={f_name} onChange={setFirstName} icon="user" />
            <InputField label="Last Name" value={l_name} onChange={setLastName} icon="user" />
            <InputField label="Email Address" value={email} onChange={setEmail} icon="mail" keyboardType="email-address" />
            <InputField label="Phone Number" value={phone} onChange={setPhone} icon="phone" keyboardType="phone-pad" />
            <InputField label="Gender" value={gender} onChange={setGender} icon="smile" />
            <InputField label="Location" value={address} onChange={setLocation} icon="map-pin" />
          </View>

        </ScrollView>

        {/* Floating Save Button at Bottom */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.saveBtn, !isFormValid && styles.saveBtnDisabled]}
            disabled={!isFormValid || isSaving}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveBtnText}>Save Changes</Text>
            )}
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
    paddingBottom: 40,
  },

  // Header
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

  // Avatar Section
  avatarSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#ffffff", // Creates a cutout effect
  },
  avatarHelperText: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "500",
  },

  // Form Section
  formContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9", // Ultra-light divider
    marginBottom: 10,
  },
  iconContainer: {
    width: 30,
    alignItems: "flex-start",
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "500",
    padding: 0,
    margin: 0,
  },

  // Bottom Button
  bottomContainer: {
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

export default EditProfile;