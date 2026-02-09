import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView, 
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axiosInstance from '../../../api/axiosInstance';
import API_URL from '../../../api/api_urls';

// Unified Theme Colors - Set Background to White
const COLORS = {
  primary: "#1E293B",    // Slate 800
  secondary: "#2563EB",  // Blue 600
  background: "#FFFFFF", // Pure White
  surface: "#FFFFFF",    // Pure White for cards/containers
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  white: "#FFFFFF",
  inputBg: "#F1F5F9",    // Light gray for input fields
};

const ChatConversation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { chat } = route.params; 
  const scrollViewRef = useRef(null);
  
  const [threadId, setThreadId] = useState(chat.thread_id || null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // STATIC EXAMPLE DATA
  const [messages, setMessages] = useState([
    {
      id: 'static-1',
      text: `Welcome to ${chat.store || "BizNest"}! How can we help you with your order today?`,
      sender: 'store',
      time: 'Just now'
    }
  ]);

  // 1. Mark Notifications as Read
  useEffect(() => {
    if (threadId) {
      axiosInstance.put(`${API_URL}/api/v1/chat/notifications/read/${threadId}`)
        .then(() => console.log('✅ Notifications read'))
        .catch(err => console.error('Failed to mark read', err));
    }
  }, [threadId]);

  // 2. Fetch Messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!threadId) {
        setLoading(false);
        return; 
      }

      try {
        const response = await axiosInstance.get(`${API_URL}/api/v1/chat/get_messages/${threadId}`);
        const history = response.data.messages.map(msg => ({
          id: msg.id,
          text: msg.message,
          sender: msg.sender_id === chat.seller_id ? 'store' : 'me',
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        
        setMessages(history); 
      } catch (err) {
        console.error("Failed to fetch messages", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [threadId, chat.seller_id]);

  // 3. Send Message
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const tempMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const response = await axiosInstance.post(`${API_URL}/api/v1/chat/send_message`, {
        thread_id: threadId,
        seller_id: chat.seller_id,
        message: tempMessage.text,
        message_type: "text",
      });

      if (!threadId && response.data.thread_id) {
        setThreadId(response.data.thread_id);
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          {/* UPDATED: Changed from Feather 'arrow-left' to MaterialIcons 'arrow-back' */}
          <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <View style={styles.avatar}>
             <Ionicons name="storefront" size={20} color={COLORS.secondary} />
          </View>
          <View>
            <Text style={styles.headerTitle}>{chat.store || "Store Name"}</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Feather name="more-vertical" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Main Chat Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
          showsVerticalScrollIndicator={false}
        >
          {loading && <ActivityIndicator size="small" color={COLORS.secondary} style={{margin: 20}} />}
          
          {messages.map((message) => {
            const isMe = message.sender === 'me';
            return (
              <View 
                key={message.id} 
                style={[
                  styles.messageRow,
                  isMe ? styles.rowMe : styles.rowStore
                ]}
              >
                {!isMe && (
                  <View style={styles.smallAvatar}>
                    <Text style={styles.avatarLetter}>{chat.store?.charAt(0) || "S"}</Text>
                  </View>
                )}
                
                <View 
                  style={[
                    styles.messageBubble,
                    isMe ? styles.bubbleMe : styles.bubbleStore
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    isMe ? styles.textMe : styles.textStore
                  ]}>
                    {message.text}
                  </Text>
                  <Text style={[
                    styles.timeText,
                    isMe ? styles.timeMe : styles.timeStore
                  ]}>
                    {message.time}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Feather name="plus" size={24} color={COLORS.secondary} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.textSecondary}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />

          <TouchableOpacity 
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={!newMessage.trim()}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Pure white background
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 0, 
  },
  iconButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  headerStatus: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '500',
  },

  // Messages Area
  messagesContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  rowMe: {
    justifyContent: 'flex-end',
  },
  rowStore: {
    justifyContent: 'flex-start',
  },
  smallAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 2,
  },
  avatarLetter: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  bubbleMe: {
    backgroundColor: COLORS.secondary,
    borderBottomRightRadius: 2,
  },
  bubbleStore: {
    backgroundColor: '#F1F5F9',
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  textMe: {
    color: '#FFFFFF',
  },
  textStore: {
    color: COLORS.textPrimary,
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeMe: {
    color: 'rgba(255,255,255,0.8)',
  },
  timeStore: {
    color: COLORS.textSecondary,
  },

  // Input Area
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  attachButton: {
    padding: 10,
    marginRight: 4,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.inputBg,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
    maxHeight: 100, 
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.border,
  },
});

export default ChatConversation;