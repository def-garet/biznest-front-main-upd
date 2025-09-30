import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import TradeCard from './TradeCard';
// import { TradeContext } from './TradeContext';
// import CreateTradeModal from './CreateTradeModal';
import TradeCard from './TradeComponent/TradeCard';
import { TradeContext } from './TradeComponent/TradeContext';   
import CreateTradeModal from './TradeComponent/CreateTradeModal';

const TradeScreen = () => {
  const { 
    activeTrades, 
    tradeHistory, 
    tradeOffers, 
    initMockData,
    createTradeOffer,
    acceptTrade,
    rejectTrade,
    completeTrade,
  } = useContext(TradeContext);
  
  const [activeTab, setActiveTab] = useState('offers');
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    initMockData();
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'offers':
        return (
          <>
            {tradeOffers.length > 0 ? (
              tradeOffers.map(trade => (
                <TradeCard 
                  key={trade.id}
                  trade={trade}
                  type="offer"
                  onAccept={acceptTrade}
                  onReject={rejectTrade}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No trade offers available</Text>
            )}
          </>
        );
      case 'active':
        return (
          <>
            {activeTrades.length > 0 ? (
              activeTrades.map(trade => (
                <TradeCard 
                  key={trade.id}
                  trade={trade}
                  type="active"
                  onComplete={completeTrade}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No active trades</Text>
            )}
          </>
        );
      case 'history':
        return (
          <>
            {tradeHistory.length > 0 ? (
              tradeHistory.map(trade => (
                <TradeCard 
                  key={trade.id}
                  trade={trade}
                  type="history"
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No trade history</Text>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BizNest Trades</Text>
        <TouchableOpacity 
          style={styles.newTradeButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'offers' && styles.activeTab]}
          onPress={() => setActiveTab('offers')}
        >
          <Text style={styles.tabText}>Offers ({tradeOffers.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={styles.tabText}>Active ({activeTrades.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={styles.tabText}>History ({tradeHistory.length})</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {renderContent()}
      </ScrollView>
      
      <CreateTradeModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onCreate={createTradeOffer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#6200EE',
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  newTradeButton: {
    backgroundColor: '#03DAC6',
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6200EE',
  },
  tabText: {
    color: '#6200EE',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});

export default TradeScreen;