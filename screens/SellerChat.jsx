import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../style/theme';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../api/axiosInstance';

const SellerChat = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = async () => {
    try {
      const res = await axiosInstance.get(`/api/v1/chat/get_chats_seller`);
      if (res.data && res.data.chats) {
        setChats(res.data.chats);
        // console.log("Fetched seller chats:", res.data.chats);
      }
    } catch (err) {
      console.error("Error fetching seller chats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seller Chats</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
        {chats.map((chat) => (
          <TouchableOpacity
            key={chat.thread_id}
            style={[styles.chatItem, chat.unread && styles.unreadChatItem]}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate("SellerChatConversation", {
                chat: {
                  thread_id: chat.thread_id,
                  buyer_id: chat.buyer_id,
                  store: chat.buyer_name,
                  message: chat.last_message || "Say hi!",
                  date: chat.last_message_time || "Just now",
                }
              })
            }
          >
            <View style={[styles.chatIcon, chat.unread && styles.unreadChatIcon]}>
              <Ionicons name="storefront" size={22} color={chat.unread ? COLORS.white : COLORS.primary} />
            </View>
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={[styles.storeName, chat.unread && styles.unreadText]}>{chat.buyer_name}</Text>
                <Text style={[styles.date, chat.unread && styles.unreadDate]}>{chat.last_message_time}</Text>
              </View>
              <Text style={[styles.message, chat.unread && styles.unreadText]} numberOfLines={1}>
                {chat.last_message || "No messages yet"}
              </Text>
            </View>
            {chat.unread && (
              <View style={styles.unreadBadgeContainer}>
                <View style={styles.unreadBadge} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.lightGray,
    marginTop: Platform.OS === 'android' ? 40 : 40,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '600', color: COLORS.primary, marginHorizontal: 16 },
  searchButton: { padding: 4 },
  chatList: { flex: 1, paddingTop: 8 },
  chatItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, backgroundColor: COLORS.white },
  unreadChatItem: { backgroundColor: COLORS.lightPrimaryOpacity },
  chatIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.lightPrimary, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  unreadChatIcon: { backgroundColor: COLORS.primary },
  chatContent: { flex: 1, justifyContent: 'center' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  storeName: { fontSize: 16, fontWeight: '500', color: COLORS.darkText, flex: 1, marginRight: 8 },
  date: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  unreadDate: { color: COLORS.primary, fontWeight: '500' },
  message: { fontSize: 14, color: COLORS.gray, lineHeight: 20 },
  unreadText: { fontWeight: '600', color: COLORS.primary },
  unreadBadgeContainer: { width: 24, alignItems: 'flex-end', justifyContent: 'center' },
  unreadBadge: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default SellerChat;
