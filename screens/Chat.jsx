import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  StatusBar,
  Dimensions
} from 'react-native';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '@api/axiosInstance';
import { SafeAreaView } from "react-native-safe-area-context";

// Unified Color Palette
const COLORS = {
  primary: "#1E293B",    // Slate 800
  secondary: "#2563EB",  // Blue 600
  background: "#FFFFFF",
  surface: "#F8FAFC",    // Slate 50
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  white: "#FFFFFF",
  danger: "#EF4444",
};

const Chat = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static example for design verification
  const staticExample = {
    thread_id: "static-001",
    seller_id: "seller-001",
    seller_name: "BizNest Official Support",
    last_message: "Welcome! Here is a preview of the chat design. Let us know if you need help.",
    last_message_time: "Just now",
    unread: true, // To show the unread dot
  };

  const fetchChats = async () => {
    try {
      const res = await axiosInstance.get(`/api/v1/chat/get_chats`);
      if (res.data && res.data.chats) {
        setChats(res.data.chats);
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // Merge static example with fetched chats for display
  const displayChats = [staticExample, ...chats];

  const handleChatPress = (chat) => {
    navigation.navigate("ChatConversation", {
      chat: {
        thread_id: chat.thread_id,
        seller_id: chat.seller_id,
        store: chat.seller_name,
        message: chat.last_message,
        date: chat.last_message_time
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="search" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
        {displayChats.map((chat, index) => (
          <TouchableOpacity
            key={chat.thread_id || index}
            style={[styles.chatItem, chat.unread && styles.chatItemUnread]}
            activeOpacity={0.7}
            onPress={() => handleChatPress(chat)}
          >
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="storefront" size={20} color={COLORS.secondary} />
              </View>
              {/* Online Indicator (Optional) */}
              {/* <View style={styles.onlineBadge} /> */}
            </View>

            {/* Content */}
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={styles.storeName} numberOfLines={1}>
                  {chat.seller_name}
                </Text>
                <Text style={[styles.date, chat.unread && styles.dateUnread]}>
                  {chat.last_message_time}
                </Text>
              </View>
              
              <View style={styles.messageRow}>
                <Text 
                  style={[styles.message, chat.unread && styles.messageUnread]} 
                  numberOfLines={1}
                >
                  {chat.last_message || "No messages yet"}
                </Text>
                
                {chat.unread && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>1</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },

  // List
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
    backgroundColor: COLORS.background,
  },
  chatItemUnread: {
    backgroundColor: '#F8FAFC', // Slightly highlighted background for unread
  },
  
  // Avatar
  avatarContainer: {
    marginRight: 16,
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EFF6FF', // Light Blue bg
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  
  // Content
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  dateUnread: {
    color: COLORS.secondary,
    fontWeight: '600',
  },
  
  // Message Row
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
    marginRight: 12,
  },
  messageUnread: {
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
});

export default Chat;