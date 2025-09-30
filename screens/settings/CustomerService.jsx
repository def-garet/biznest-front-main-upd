import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const CustomerService = ({ navigation }) => {
  // Quick answer questions
  const quickAnswers = [
    { id: 1, question: "How to activate BizNest PayLater?", icon: "credit-card" },
    { id: 2, question: "[BizNestPay] How to verify account?", icon: "verified-user" },
    { id: 3, question: "Why can't I change my mobile number?", icon: "phone" },
    { id: 4, question: "[My Account] Delete my BizNest account", icon: "delete" },
    { id: 5, question: "[My Account] Change username", icon: "edit" },
    { id: 6, question: "Why can't I use my PayLater?", icon: "payment" },
    { id: 7, question: "[COD] Can't pay by cash-on-delivery", icon: "local-shipping" },
  ];

  // Support tools
  const supportTools = [
    { id: 1, text: "Change Phone Number", icon: "phone" },
    { id: 2, text: "Update Email Address", icon: "email" },
    { id: 3, text: "Reset Password", icon: "lock" },
    { id: 4, text: "Payment Issues", icon: "payment" },
    { id: 5, text: "Order Tracking", icon: "local-shipping" },
  ];

  // Contact methods
  const contactMethods = [
    { id: 1, text: "Live Chat", icon: "chat", color: "#4CAF50" },
    { id: 2, text: "Email Support", icon: "email", color: "#FF5722" },
    { id: 3, text: "Phone Call", icon: "call", color: "#2196F3" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with gradient */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Support</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>How can we help you today?</Text>
            <Text style={styles.heroSubtitle}>Our team is ready to assist with any questions</Text>
          </View>
          <Image 
            source={require('../../assets/imgs/biznest-new.png')} 
            style={styles.heroImage}
          />
        </View>

        {/* ai assistant */}
        <TouchableOpacity style={styles.aiCard}>
          <View style={styles.aiIconContainer}>
            <MaterialCommunityIcons name="robot-excited-outline" size={24} color="#172d55" />
            
          </View>
          <View style={styles.aiTextContainer}>
            <Text style={styles.aiTitle}>BizNest AI Assistant</Text>
            <Text style={styles.aiSubtitle}>Get instant answers to your questions</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#172d55" />
        </TouchableOpacity>

        {/* Announcement Banner */}
        <View style={styles.announcementBanner}>
          <MaterialIcons name="info-outline" size={20} color="white" />
          <Text style={styles.announcementText}>BizNestPay Hotline currently experiencing downtime</Text>
        </View>

        {/* Support Tools Section */}
        <Text style={styles.sectionHeader}>Account Support Tools</Text>
        <View style={styles.toolsContainer}>
          {supportTools.map((tool) => (
            <TouchableOpacity key={tool.id} style={styles.toolCard}>
              <View style={[styles.toolIconContainer, { backgroundColor: '#e8f0fe' }]}>
                <MaterialIcons name={tool.icon} size={20} color="#172d55" />
              </View>
              <Text style={styles.toolText}>{tool.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Answers Section */}
        <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>
        <View style={styles.faqContainer}>
          {quickAnswers.map((item) => (
            <TouchableOpacity key={item.id} style={styles.faqItem}>
              <View style={styles.faqIcon}>
                <MaterialIcons name={item.icon} size={18} color="#2196f3" />
              </View>
              <Text style={styles.faqText}>{item.question}</Text>
              <MaterialIcons name="chevron-right" size={20} color="#808080" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Methods */}
        <Text style={styles.sectionHeader}>Contact Support</Text>
        <View style={styles.contactContainer}>
          {contactMethods.map((method) => (
            <TouchableOpacity 
              key={method.id} 
              style={[styles.contactCard, { backgroundColor: method.color }]}
            >
              <MaterialIcons name={method.icon} size={24} color="white" />
              <Text style={styles.contactText}>{method.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  heroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    elevation: 2,
  },
  heroTextContainer: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#172d55',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#808080',
  },
  heroImage: {
    width: 80,
    height: 80,
    marginLeft: 16,
  },
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  aiIconContainer: {
    backgroundColor: '#e8f0fe',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#172d55',
  },
  aiSubtitle: {
    fontSize: 13,
    color: '#808080',
  },
  announcementBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  announcementText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 8,
    flex: 1,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#172d55',
    marginTop: 16,
    marginBottom: 12,
  },
  toolsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  toolCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  toolIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  toolText: {
    fontSize: 14,
    color: '#172d55',
    flex: 1,
  },
  faqContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    elevation: 1,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  faqIcon: {
    marginRight: 12,
  },
  faqText: {
    flex: 1,
    fontSize: 14,
    color: '#172d55',
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  contactCard: {
    width: '30%',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
  },
  contactText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default CustomerService;