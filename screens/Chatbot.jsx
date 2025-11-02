import React, { useState, useRef, useEffect,useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import {
  Ionicons,
  FontAwesome
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../style/theme';
import axios from 'axios';
import N8NAPI_URL from '../api/n8n_api';

const Chatbot = ({route}) => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const buyer_id = route?.params?.buyer_id; // 👈 get it here
  console.log("Buyer ID in Chatbot:", buyer_id);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I\'m your shopping assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

useEffect(() => {
    fetchMessageHistory();
  }, []);

const fetchMessageHistory = async () => {
  try {
    // http://localhost:5678/webhook/706f713f-873b-437e-9dd0-791c9fbbb51d/get_AIHelper_BuyerHistory/:buyer_id
    const response = await axios.get(`${N8NAPI_URL}/webhook/706f713f-873b-437e-9dd0-791c9fbbb51d/get_AIHelper_BuyerHistory/${buyer_id}`);
    const msgs = response.data.full_history.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp), // convert here
    }));
    setMessages(msgs);
    console.log("Fetched message history:", msgs);
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};








  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  

  // Auto-scroll to bottom when new messages are added or keyboard appears
  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, keyboardHeight]);




  // const handleSend = async () => {
  //   if (inputText.trim() === '') return;

  //   // Add user message
  //   const userMessage = {
  //     id: Date.now(),
  //     text: inputText.trim(),
  //     isUser: true,
  //     timestamp: new Date(),
  //   };

  //   setMessages(prev => [...prev, userMessage]);
  //   setInputText('');
  //   setIsLoading(true);

  //   // Dismiss keyboard
  //   Keyboard.dismiss();

  //   // Simulate bot response after a delay
  //   setTimeout(() => {
  //     const botResponse = {
  //       id: Date.now() + 1,
  //       text: 'How can I help you?',
  //       isUser: false,
  //       timestamp: new Date(),
  //     };
  //     setMessages(prev => [...prev, botResponse]);
  //     setIsLoading(false);
      
  //     // Auto-scroll after bot response
  //     setTimeout(() => {
  //       if (flatListRef.current) {
  //         flatListRef.current.scrollToEnd({ animated: true });
  //       }
  //     }, 100);
  //   }, 1500);
  // };

  const handleSend = async () => {
  if (inputText.trim() === '') return;

  // Add user message locally
  const userMessage = {
    text: inputText.trim(),
    isUser: true,
    timestamp: new Date(),
  };

  // Add to current messages
  const updatedMessages = [...messages, userMessage];

  // Reindex IDs sequentially
  updatedMessages.forEach((msg, index) => {
    msg.id = index + 1;
  });

  setMessages(updatedMessages);
  setInputText('');
  setIsLoading(true);

  // Dismiss keyboard
  Keyboard.dismiss();

  try {
    // Send to API
    // http://localhost:5678/webhook/c018e021-d270-4db5-9428-aab1b3cdce01/send_AIHelper_BuyerMessage/:buyer_id
    // http://localhost:5678/webhook-test/c018e021-d270-4db5-9428-aab1b3cdce01/send_AIHelper_BuyerMessage/:buyer_id
    const response = await axios.post(`${N8NAPI_URL}/webhook/c018e021-d270-4db5-9428-aab1b3cdce01/send_AIHelper_BuyerMessage/${buyer_id}`, {
      sessionId: buyer_id,
      userMsg: userMessage
    });

    // Extract bot response
    const botMessage = response.data.last_exchange;

    // Convert timestamp to Date object
    botMessage.timestamp = new Date(botMessage.timestamp);

    // Add bot message to messages and reindex again
    const finalMessages = [...updatedMessages, botMessage];
    finalMessages.forEach((msg, index) => {
      msg.id = index + 1;
    });

    setMessages(finalMessages);

    // Auto-scroll
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);

  } catch (error) {
    console.error("Error sending message:", error);

    const errorMessage = {
      text: "Oops! Something went wrong. Please try again.",
      isUser: false,
      timestamp: new Date(),
    };

    const finalMessages = [...updatedMessages, errorMessage];
    finalMessages.forEach((msg, index) => {
      msg.id = index + 1;
    });

    setMessages(finalMessages);

  } finally {
    setIsLoading(false);
  }
};


  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessageContainer : styles.botMessageContainer
    ]}>
      {/* Bot Avatar */}
      {!item.isUser && (
        <View style={styles.botAvatar}>
          <FontAwesome name="robot" size={20} color="white" />
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.botBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isUser ? styles.userMessageText : styles.botMessageText
        ]}>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {formatTime(item.timestamp)}
        </Text>
      </View>

      {/* User Avatar */}
      {item.isUser && (
        <View style={styles.userAvatar}>
          <Ionicons name="person" size={20} color="white" />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <View style={styles.botHeaderAvatar}>
            <FontAwesome name="robot" size={20} color="white" />
          </View>
          <Text style={styles.headerTitle}>Shopping Assistant</Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Main Container with Keyboard Avoiding */}
        <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
    >
        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          style={styles.messagesList}
          contentContainerStyle={[
            styles.messagesContainer,
            { paddingBottom: keyboardHeight > 0 ? 20 : 20 }
          ]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToEnd({ animated: true });
            }
          }}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <View style={styles.botMessageContainer}>
              <View style={styles.botAvatar}>
                <FontAwesome name="robot" size={20} color="white" />
              </View>
              <View style={styles.botBubble}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            </View>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              inputText.trim() === '' && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={inputText.trim() === ''}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() === '' ? '#ccc' : 'white'} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginTop: Platform.OS === 'android' ? 1 : 0,
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botHeaderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  menuButton: {
    padding: 4,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingTop: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
  },
  botMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 12,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
});

export default Chatbot;