import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Switch,
  TextInput,
  Modal,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { 
  MaterialIcons, 
  Ionicons,
  Feather 
} from "@expo/vector-icons";

const AccountSecurity = ({ navigation }) => {
  const [fingerprintEnabled, setFingerprintEnabled] = useState(true);
  const [quickLoginEnabled, setQuickLoginEnabled] = useState(true);
  
  // State for editable fields
  const [phone, setPhone] = useState("*****61");
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  
  // State for change password
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const sectionData = [
    {
      title: "Account",
      items: [
        {
          icon: "person-outline",
          title: "My Profile",
          subtitle: "Username: testuser",
          type: "navigation"
        },
        {
          icon: "phone-iphone",
          title: "Phone",
          subtitle: phone,
          type: "editable",
          action: () => setIsEditingPhone(true)
        },
        {
          icon: "email-outline",
          title: "Email",
          subtitle: "t***@gmail.com",
          type: "navigation"
        },
        {
          icon: "share-outline",
          title: "Social Media Accounts",
          type: "navigation"
        },
        {
          icon: "lock-outline",
          title: "Change Password",
          subtitle: "Update your password",
          type: "editable",
          action: () => setIsChangingPassword(true)
        }
      ]
    },
    {
      title: "Security",
      items: [
        {
          icon: "fingerprint",
          title: "Fingerprint Authentication",
          subtitle: "Your Fingerprint data is on your device and Shopee does not store it",
          type: "switch",
          value: fingerprintEnabled,
          onValueChange: setFingerprintEnabled
        },
        {
          icon: "zap",
          title: "Quick Login",
          subtitle: "Allow quick login on this device: SAMSUNG",
          type: "switch",
          value: quickLoginEnabled,
          onValueChange: setQuickLoginEnabled
        },
        {
          icon: "security",
          title: "Check Account Activity",
          subtitle: "Check your login and account changes in the last 30 days",
          type: "navigation"
        },
        {
          icon: "devices",
          title: "Manage Login Device",
          subtitle: "Review the devices that you have logged in Shopee account.",
          type: "navigation"
        }
      ]
    }
  ];

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "person-outline":
        return <MaterialIcons name="person-outline" size={22} color="#172d55" />;
      case "phone-iphone":
        return <MaterialIcons name="phone-iphone" size={22} color="#172d55" />;
      case "email-outline":
        return <MaterialIcons name="email" size={22} color="#172d55" />;
      case "share-outline":
        return <Ionicons name="share-social-outline" size={22} color="#172d55" />;
      case "lock-outline":
        return <MaterialIcons name="lock-outline" size={22} color="#172d55" />;
      case "fingerprint":
        return <MaterialIcons name="fingerprint" size={22} color="#172d55" />;
      case "zap":
        return <Feather name="zap" size={22} color="#172d55" />;
      case "security":
        return <MaterialIcons name="security" size={22} color="#172d55" />;
      case "devices":
        return <MaterialIcons name="devices" size={22} color="#172d55" />;
      default:
        return <MaterialIcons name="info-outline" size={22} color="#172d55" />;
    }
  };

  const handleItemPress = (item) => {
    if (item.type === "navigation") {
      console.log(`Navigate to: ${item.title}`);
    } else if (item.type === "editable" && item.action) {
      item.action();
    }
  };

  const handleSavePhone = () => {
    if (newPhone.trim() && newPhone.length >= 10) {
      // Mask the phone number for display (show only last 2 digits)
      const maskedPhone = "*****" + newPhone.slice(-2);
      setPhone(maskedPhone);
      setIsEditingPhone(false);
      setNewPhone("");
      Alert.alert("Success", "Phone number updated successfully");
    } else {
      Alert.alert("Error", "Please enter a valid phone number");
    }
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    // Simulate password change
    Alert.alert("Success", "Password changed successfully");
    setIsChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const PhoneEditModal = () => (
    <Modal
      visible={isEditingPhone}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsEditingPhone(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Phone Number</Text>
            <TouchableOpacity onPress={() => setIsEditingPhone(false)}>
              <MaterialIcons name="close" size={24} color="#172d55" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalLabel}>New Phone Number</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your new phone number"
            value={newPhone}
            onChangeText={setNewPhone}
            keyboardType="phone-pad"
            autoFocus={true}
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsEditingPhone(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSavePhone}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const ChangePasswordModal = () => (
    <Modal
      visible={isChangingPassword}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsChangingPassword(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TouchableOpacity onPress={() => setIsChangingPassword(false)}>
              <MaterialIcons name="close" size={24} color="#172d55" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalLabel}>Current Password</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={true}
          />
          
          <Text style={styles.modalLabel}>New Password</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={true}
          />
          
          <Text style={styles.modalLabel}>Confirm New Password</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsChangingPassword(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleChangePassword}
            >
              <Text style={styles.saveButtonText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account & Security</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {sectionData.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.itemContainer,
                    itemIndex !== section.items.length - 1 && styles.itemBorder
                  ]}
                  onPress={() => handleItemPress(item)}
                  activeOpacity={0.7}
                >
                  {/* Icon */}
                  <View style={styles.iconContainer}>
                    {getIconComponent(item.icon)}
                  </View>
                  
                  {/* Content */}
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    {item.subtitle && (
                      <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                    )}
                  </View>
                  
                  {/* Right Content */}
                  <View style={styles.rightContent}>
                    {item.type === "navigation" && (
                      <MaterialIcons name="keyboard-arrow-right" size={22} color="#808080" />
                    )}
                    {item.type === "editable" && (
                      <MaterialIcons name="edit" size={18} color="#172d55" />
                    )}
                    {item.type === "switch" && (
                      <Switch
                        value={item.value}
                        onValueChange={item.onValueChange}
                        trackColor={{ false: '#767577', true: '#172d55' }}
                        thumbColor={item.value ? '#f4f3f4' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        
        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modals */}
      <PhoneEditModal />
      <ChangePasswordModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    backgroundColor: '#172d55',
    elevation: 4,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  placeholder: {
    width: 28,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#172d55',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(23, 45, 85, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#172d55',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#808080',
    lineHeight: 16,
  },
  rightContent: {
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#172d55',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#172d55',
    marginBottom: 8,
    marginTop: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#172d55',
  },
  cancelButtonText: {
    color: '#172d55',
    fontWeight: '500',
    fontSize: 16,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default AccountSecurity;