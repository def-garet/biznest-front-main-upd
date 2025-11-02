import React, { useState, useRef, useEffect } from 'react'
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
} from 'react-native'
import { MaterialIcons, Feather } from '@expo/vector-icons'
import { COLORS } from '../../../style/theme'
import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import API_URL  from '../../../api/api_urls'

const ChatConversation = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { chat } = route.params
  const scrollViewRef = useRef(null)
  
  const [messages, setMessages] = useState([
    // { 
    //   id: 1, 
    //   text: chat.message.includes('sent you an image') 
    //     ? "Here's the image you requested:" 
    //     : chat.message,
    //   sender: 'store', 
    //   time: chat.date 
    // },
    // { 
    //   id: 2, 
    //   text: chat.message.includes('sent you an image') 
    //     ? "Thanks for sending the image!" 
    //     : "Thanks for the message!", 
    //   sender: 'me', 
    //   time: 'Just now' 
    // }
  ])

  const [newMessage, setNewMessage] = useState('')
  const [keyboardHeight, setKeyboardHeight] = useState(0)

useEffect(() => {
  if (chat.thread_id) {
    axios.put(`${API_URL}/api/v1/chat/notifications/read/${chat.thread_id}`)
      .then(() => console.log('✅ All notifications for this chat marked as read'))
      .catch(err => console.error('Failed to mark notifications', err));
  }
}, [chat.thread_id]);


  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height)
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }, 100)
      }
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0)
      }
    )

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  useEffect(() => {
  const fetchMessages = async () => {
    if (!chat.thread_id) return; // no thread yet

    try {
      const response = await axios.get(`${API_URL}/api/v1/chat/get_messages/${chat.thread_id}`);
      const history = response.data.messages.map(msg => ({
        id: msg.id,
        text: msg.message,
        sender: msg.sender_id === chat.seller_id ? 'store' : 'me',
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
      setMessages(history);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  fetchMessages();
}, [chat.thread_id]);


  const handleSend = async () => {
  if (!newMessage.trim()) return;

  try {
    const response = await axios.post(`${API_URL}/api/v1/chat/send_message`, {
      thread_id: chat.thread_id, // could be null for first message
      seller_id: chat.seller_id,
      message: newMessage,
      message_type: "text",
    });

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages([...messages, {
      id: messages.length + 1,
      text: newMessage,
      sender: 'me',
      time: currentTime
    }]);

    setNewMessage('');
    scrollViewRef.current?.scrollToEnd({ animated: true });
    
    // Save returned thread_id if it was first message
    if (!chat.thread_id) chat.thread_id = response.data.thread_id;

  } catch (error) {
    console.error("Failed to send message", error);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button - outside KeyboardAvoidingView */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{chat.store}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Main content with KeyboardAvoidingView */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.container}
        keyboardVerticalOffset={Platform.select({
          ios: 90,
          android: 0
        })}
      >
        {/* Chat messages */}
        <ScrollView 
          style={styles.messagesContainer}
          contentContainerStyle={[
            styles.messagesContent,
            { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 80 : 16 }
          ]}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message) => (
            <View 
              key={message.id} 
              style={[
                styles.messageBubble,
                message.sender === 'me' ? styles.myMessage : styles.theirMessage
              ]}
            >
              {chat.message.includes('sent you an image') && message.sender === 'store' ? (
                <View style={styles.imagePlaceholder}>
                  <Feather name="image" size={50} color={COLORS.primary} />
                  <Text style={styles.imageText}>Image from {chat.store}</Text>
                </View>
              ) : (
                <Text style={[
                  styles.messageText,
                  message.sender === 'me' && styles.myMessageText
                ]}>
                  {message.text}
                </Text>
              )}
              <Text style={[
                styles.messageTime,
                message.sender === 'me' && styles.myMessageTime
              ]}>
                {message.time}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Message input */}
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb", // light gray background for contrast
  },
  header: {
     flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "white",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: Platform.OS === "android" ? 35 : 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 20,
    flex: 1,
    textAlign: 'center',
   marginLeft: -5, // centers title visually despite back button

  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 0,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f5f5f5',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  myMessageText: {
    color: 'white',
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  messageTime: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#f0f0f0',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
    marginRight: 8,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    alignItems: 'center',
    padding: 10,
  },
  imageText: {
    marginTop: 8,
    color: COLORS.primary,
    fontSize: 14,
  }
})

export default ChatConversation