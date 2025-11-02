import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Platform,
  ActivityIndicator,

} from 'react-native'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { COLORS } from '../style/theme'
import { useNavigation } from '@react-navigation/native'
import axiosInstance from '@api/axiosInstance';
import { SafeAreaView } from "react-native-safe-area-context";

const Chat = () => {
  const navigation = useNavigation()
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

   const fetchChats = async () => {
    try {
      const res = await axiosInstance.get(`/api/v1/chat/get_chats`);
      if (res.data && res.data.chats) {
        setChats(res.data.chats);
        console.log("Fetched chats:", res.data.chats);
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


   if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // const chats = [
  //   {
  //     id: 1,
  //     store: "Molo Mansion Store",
  //     date: "Today, 10:30 AM",
  //     message: "sent you an image",
  //     icon: "image",
  //     unread: true
  //   },
  //   {
  //     id: 2,
  //     store: "La Paz Batchoy House",
  //     date: "Yesterday",
  //     message: "Here's a special voucher to thank you for your purchase!",
  //     icon: "gift",
  //     unread: false
  //   },
  //   {
  //     id: 3,
  //     store: "Esplanade Souvenirs",
  //     date: "Jul 17",
  //     message: "Smile ka na! Claim this special voucher today!",
  //     icon: "happy",
  //     unread: false
  //   },
  //   {
  //     id: 4,
  //     store: "Biscocho Haus Iloilo",
  //     date: "May 14",
  //     message: "Good Day, po 🌟 May 15th is coming with special offers...",
  //     icon: "calendar",
  //     unread: false
  //   },
  //   {
  //     id: 5,
  //     store: "Roberto's Siopao",
  //     date: "May 10",
  //     message: "New siopao flavors available now! Try our ube cheese!",
  //     icon: "fast-food",
  //     unread: false
  //   },
  //   {
  //     id: 6,
  //     store: "Iloilo Coffee Roasters",
  //     date: "Apr 28",
  //     message: "Your order has been shipped and will arrive tomorrow",
  //     icon: "cube",
  //     unread: false
  //   },
  //   {
  //     id: 7,
  //     store: "Miagao Handicrafts",
  //     date: "Apr 15",
  //     message: "Thank you for your recent purchase!",
  //     icon: "thumbs-up",
  //     unread: false
  //   }
  // ]

    return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
        {chats.map((chat) => (
          <TouchableOpacity
            key={chat.thread_id}
            style={styles.chatItem}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate("ChatConversation", {
                chat:{
                thread_id: chat.thread_id,
                seller_id: chat.seller_id,
                store: chat.seller_name,
                message: "Say hi!",
                date: "Just now"
                }
              })
            }
          >
            <View style={styles.chatIcon}>
              <Ionicons name="storefront" size={22} color={COLORS.white} />
            </View>
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={styles.storeName}>{chat.seller_name}</Text>
                <Text style={styles.date}>{chat.last_message_time}</Text>
              </View>
              <Text style={styles.message} numberOfLines={1}>
                {chat.last_message || "No messages yet"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Chats</Text>
//         <TouchableOpacity style={styles.searchButton}>
//           <Ionicons name="search" size={22} color={COLORS.primary} />
//         </TouchableOpacity>
//       </View>

//       {/* Chat List */}
//       <ScrollView 
//         style={styles.chatList}
//         showsVerticalScrollIndicator={false}
//       >
//         {chats.map((chat) => (
//           <TouchableOpacity 
//             key={chat.id}
//             style={[
//               styles.chatItem,
//               chat.unread && styles.unreadChatItem
//             ]}
//             activeOpacity={0.7}
//             onPress={() => navigation.navigate('ChatConversation', { chat })}
//           >
//             <View style={[
//               styles.chatIcon,
//               chat.unread && styles.unreadChatIcon
//             ]}>
//               <Ionicons 
//                 name={chat.icon} 
//                 size={22} 
//                 color={chat.unread ? COLORS.white : COLORS.primary} 
//               />
//             </View>
            
//             <View style={styles.chatContent}>
//               <View style={styles.chatHeader}>
//                 <Text style={[styles.storeName, chat.unread && styles.unreadText]}>
//                   {chat.store}
//                 </Text>
//                 <Text style={[styles.date, chat.unread && styles.unreadDate]}>
//                   {chat.date}
//                 </Text>
//               </View>
//               <Text 
//                 style={[styles.message, chat.unread && styles.unreadText]}
//                 numberOfLines={1}
//                 ellipsizeMode="tail"
//               >
//                 {chat.message}
//               </Text>
//             </View>

//             {chat.unread && (
//               <View style={styles.unreadBadgeContainer}>
//                 <View style={styles.unreadBadge} />
//               </View>
//             )}
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   )
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.primary,
    marginHorizontal: 16,
  },
  searchButton: {
    padding: 4,
  },
  chatList: {
    flex: 1,
    paddingTop: 8,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  unreadChatItem: {
    backgroundColor: COLORS.lightPrimaryOpacity,
  },
  chatIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.lightPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  unreadChatIcon: {
    backgroundColor: COLORS.primary,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.darkText,
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  unreadDate: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  message: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  unreadText: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  unreadBadgeContainer: {
    width: 24,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
})

export default Chat