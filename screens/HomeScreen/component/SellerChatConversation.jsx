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
  Keyboard
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { COLORS } from '../../../style/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import API_URL  from '../../../api/api_urls';

const SellerChatConversation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { chat } = route.params;
  const scrollViewRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // === Keyboard handling ===
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // === Fetch messages from API ===
  useEffect(() => {
    if (!chat.thread_id) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/chat/get_messages/${chat.thread_id}`);
        const formatted = res.data.messages.map(msg => ({
          id: msg.id,
          text: msg.message,
          type: msg.message_type || 'text',
          sender: msg.receiver_id === chat.buyer_id ? 'me' : 'buyer',
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        setMessages(formatted);
        scrollViewRef.current?.scrollToEnd({ animated: true });
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [chat.thread_id]);

  // === Send message ===
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await axios.post(`${API_URL}/api/v1/chat/send_message_seller`, {
        thread_id: chat.thread_id,
        buyer_id: chat.buyer_id,
        message: newMessage,
        message_type: "text",
      });

      // API should return the saved message
      const msg = res.data.message || {
        id: messages.length + 1,
        message: newMessage,
        message_type: 'text',
        created_at: new Date().toISOString()
      };
    
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages(prev => [
        ...prev,
        { 
        id: messages.length + 1,
        text: newMessage,
        sender: 'me',
        time: currentTime
        }
      ]);

      setNewMessage('');
      scrollViewRef.current?.scrollToEnd({ animated: true });

      if (!chat.thread_id && res.data.thread_id) chat.thread_id = res.data.thread_id;
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{chat.store}</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
      >
        {/* Messages */}
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={{ paddingVertical: 16, paddingBottom: keyboardHeight + 80 }}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map(msg => (
            <View 
              key={msg.id} 
              style={[styles.messageBubble, msg.sender === 'me' ? styles.myMessage : styles.theirMessage]}
            >
              {msg.type === 'image' ? (
                <View style={styles.imagePlaceholder}>
                  <Feather name="image" size={50} color={COLORS.primary} />
                  <Text style={styles.imageText}>
                    {msg.sender === 'me' ? 'You sent an image' : `${chat.buyer_name} sent an image`}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.messageText, msg.sender === 'me' && styles.myMessageText]}>
                  {msg.text}
                </Text>
              )}
              <Text style={[styles.messageTime, msg.sender === 'me' && styles.myMessageTime]}>
                {msg.time}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Feather name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16, backgroundColor: "white", elevation: 4, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, flex: 1, textAlign: 'center', marginLeft: -5 },
  messagesContainer: { flex: 1, paddingHorizontal: 16 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 12, marginBottom: 12 },
  myMessage: { alignSelf: 'flex-end', backgroundColor: COLORS.primary, borderBottomRightRadius: 0 },
  theirMessage: { alignSelf: 'flex-start', backgroundColor: '#f5f5f5', borderBottomLeftRadius: 0 },
  messageText: { fontSize: 16, color: '#333' },
  myMessageText: { color: 'white' },
  messageTime: { fontSize: 10, color: '#888', marginTop: 4, textAlign: 'right' },
  myMessageTime: { color: 'rgba(255,255,255,0.7)' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#f0f0f0', backgroundColor: 'white' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 8, maxHeight: 120, marginRight: 8 },
  sendButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  imagePlaceholder: { alignItems: 'center', padding: 10 },
  imageText: { marginTop: 8, color: COLORS.primary, fontSize: 14 },
});

export default SellerChatConversation;
