import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TradeCard = ({ trade, type, onAccept, onReject, onComplete }) => {
  const getStatusColor = () => {
    switch(trade.status) {
      case 'pending': return '#FFA500';
      case 'accepted': return '#4CAF50';
      case 'completed': return '#2196F3';
      case 'rejected': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.tradeId}>Trade #{trade.id.substring(0, 6)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{trade.status}</Text>
        </View>
      </View>
      
      <View style={styles.tradeDetails}>
        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>You Give:</Text>
          {trade.itemsOffered.map((item, index) => (
            <Text key={index} style={styles.itemText}>- {item}</Text>
          ))}
        </View>
        
        <Ionicons name="swap-horizontal" size={24} color="#666" style={styles.swapIcon} />
        
        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>You Get:</Text>
          {trade.itemsRequested.map((item, index) => (
            <Text key={index} style={styles.itemText}>- {item}</Text>
          ))}
        </View>
      </View>
      
      {type === 'offer' && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.button, styles.acceptButton]}
            onPress={() => onAccept(trade.id)}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.rejectButton]}
            onPress={() => onReject(trade.id)}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {type === 'active' && (
        <TouchableOpacity 
          style={[styles.button, styles.completeButton]}
          onPress={() => onComplete(trade.id)}
        >
          <Text style={styles.buttonText}>Mark as Completed</Text>
        </TouchableOpacity>
      )}
      
      <Text style={styles.dateText}>
        {type === 'history' ? 'Completed: ' : 'Created: '}
        {trade.createdAt?.toLocaleDateString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tradeId: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
  },
  tradeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  itemsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 5,
    color: '#555',
  },
  itemText: {
    marginLeft: 5,
    color: '#666',
  },
  swapIcon: {
    marginHorizontal: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  completeButton: {
    backgroundColor: '#2196F3',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  dateText: {
    marginTop: 10,
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
});

export default TradeCard;