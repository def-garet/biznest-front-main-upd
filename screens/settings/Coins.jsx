import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";

const Coins = ({ navigation }) => {
  // Sample check-in data
  const checkInDays = [
    { day: "Today", coins: "+0.10", completed: true, dayNumber: "Day 1" },
    { day: "Day 2", coins: "+0.10", completed: true, dayNumber: "Day 2" },
    { day: "Day 3", coins: "+0.20", completed: true, dayNumber: "Day 3" },
    { day: "Day 4", coins: "+0.20", completed: true, dayNumber: "Day 4" },
    { day: "Day 5", coins: "+0.30", completed: true, dayNumber: "Day 5" },
    { day: "Day 6", coins: "+0.30", completed: true, dayNumber: "Day 6" },
    { day: "Day 7", coins: "+1.00", completed: false, dayNumber: "Day 7" }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#172d55" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <MaterialIcons name="keyboard-arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Coins Reward</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Coins Balance Section */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Your Coins Balance</Text>
            <TouchableOpacity 
              style={styles.historyButton}
              onPress={() => navigation.navigate("CoinsHistory")}
            >
              <Text style={styles.historyText}>History</Text>
              <MaterialIcons name="keyboard-arrow-right" size={20} color="#172d55" />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>0.00</Text>
          <Text style={styles.balanceSubtitle}>Coins can be used to offset purchases</Text>
        </View>

        {/* Check-in Section */}
        <View style={styles.checkInCard}>
          <Text style={styles.sectionTitle}>Coins Check In</Text>
          
          {/* Coins Rewards Row */}
          <View style={styles.coinsRow}>
            {checkInDays.map((day, index) => (
              <View key={index} style={styles.coinItem}>
                <Text style={styles.coinAmount}>{day.coins}</Text>
              </View>
            ))}
          </View>

          {/* Status Indicators */}
          <View style={styles.statusRow}>
            {checkInDays.map((day, index) => (
              <View key={index} style={styles.statusItem}>
                <View 
                  style={[
                    styles.statusIndicator,
                    day.completed ? styles.completed : styles.pending
                  ]}
                >
                  {day.completed && (
                    <MaterialIcons name="check" size={16} color="white" />
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Day Labels */}
          <View style={styles.daysRow}>
            {checkInDays.map((day, index) => (
              <Text 
                key={index} 
                style={[
                  styles.dayLabel,
                  day.day === "Today" && styles.todayLabel
                ]}
              >
                {day.day}
              </Text>
            ))}
          </View>

          {/* Check-in Button */}
          <TouchableOpacity 
            style={styles.checkInButton}
            onPress={() => console.log("Check in pressed")}
          >
            <FontAwesome5 name="coins" size={20} color="white" />
            <Text style={styles.checkInButtonText}>Check in to earn 0.1 coins!</Text>
          </TouchableOpacity>
        </View>

        {/* How to Earn Section */}
        <View style={styles.earnCard}>
          <Text style={styles.sectionTitle}>How to Earn Coins</Text>
          
          <View style={styles.earnItem}>
            <View style={[styles.earnIcon, { backgroundColor: 'rgba(23, 45, 85, 0.1)' }]}>
              <Ionicons name="calendar-outline" size={20} color="#172d55" />
            </View>
            <View style={styles.earnContent}>
              <Text style={styles.earnTitle}>Daily Check-in</Text>
              <Text style={styles.earnDescription}>Check in daily to earn coins</Text>
            </View>
            <Text style={styles.earnCoins}>+0.1 ~ 1.0</Text>
          </View>

          <View style={styles.earnItem}>
            <View style={[styles.earnIcon, { backgroundColor: 'rgba(23, 45, 85, 0.1)' }]}>
              <MaterialIcons name="shopping-cart" size={20} color="#172d55" />
            </View>
            <View style={styles.earnContent}>
              <Text style={styles.earnTitle}>Make Purchases</Text>
              <Text style={styles.earnDescription}>Earn coins when you shop</Text>
            </View>
            <Text style={styles.earnCoins}>+1%</Text>
          </View>

          <View style={styles.earnItem}>
            <View style={[styles.earnIcon, { backgroundColor: 'rgba(23, 45, 85, 0.1)' }]}>
              <MaterialIcons name="rate-review" size={20} color="#172d55" />
            </View>
            <View style={styles.earnContent}>
              <Text style={styles.earnTitle}>Write Reviews</Text>
              <Text style={styles.earnDescription}>Review purchased products</Text>
            </View>
            <Text style={styles.earnCoins}>+0.5</Text>
          </View>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  balanceCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyText: {
    fontSize: 14,
    color: '#172d55',
    fontWeight: '500',
    marginRight: 4,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#172d55',
    marginBottom: 8,
  },
  balanceSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  checkInCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#172d55',
    marginBottom: 20,
  },
  coinsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  coinItem: {
    alignItems: 'center',
    flex: 1,
  },
  coinAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#172d55',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  completed: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  pending: {
    backgroundColor: 'transparent',
    borderColor: '#e0e0e0',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dayLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    flex: 1,
  },
  todayLabel: {
    color: '#172d55',
    fontWeight: '600',
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#172d55',
    paddingVertical: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  checkInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  earnCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  earnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  earnIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  earnContent: {
    flex: 1,
  },
  earnTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#172d55',
    marginBottom: 4,
  },
  earnDescription: {
    fontSize: 14,
    color: '#666',
  },
  earnCoins: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default Coins;