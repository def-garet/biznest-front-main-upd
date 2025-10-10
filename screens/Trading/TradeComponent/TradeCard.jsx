import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const TradeCard = ({ trade, type, onAccept, onReject, onComplete }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f59e0b';
      case 'active': return '#2563eb';
      case 'completed': return '#059669';
      default: return '#64748b';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return 'clock';
      case 'active': return 'refresh-cw';
      case 'completed': return 'check-circle';
      default: return 'help-circle';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.shopInfo}>
          <Text style={styles.shopName}>
            {type === 'offer' ? trade.from : trade.recipient}
          </Text>
          <View style={styles.statusContainer}>
            <Feather 
              name={getStatusIcon(trade.status)} 
              size={12} 
              color={getStatusColor(trade.status)} 
            />
            <Text style={[styles.status, { color: getStatusColor(trade.status) }]}>
              {trade.status?.charAt(0).toUpperCase() + trade.status?.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.date}>
          {formatDate(trade.createdAt || trade.completedAt)}
        </Text>
      </View>

      {/* Trade Items */}
      <View style={styles.tradeContent}>
        {/* Your Item */}
        <View style={styles.itemSection}>
          <Text style={styles.sectionLabel}>You give:</Text>
          <View style={styles.item}>
            <Image 
              source={{ uri: trade.itemsOffered?.[0]?.image }} 
              style={styles.itemImage} 
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>
                {trade.itemsOffered?.[0]?.name || 'Unknown Item'}
              </Text>
              <Text style={styles.itemValue}>
                {trade.itemsOffered?.[0]?.value || trade.itemsOffered?.[0]?.price}
              </Text>
            </View>
          </View>
        </View>

        {/* Exchange Icon */}
        <View style={styles.exchangeIcon}>
          <Feather name="repeat" size={20} color="#94a3b8" />
        </View>

        {/* Their Item */}
        <View style={styles.itemSection}>
          <Text style={styles.sectionLabel}>You get:</Text>
          <View style={styles.item}>
            <Image 
              source={{ uri: trade.itemsRequested?.[0]?.image }} 
              style={styles.itemImage} 
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>
                {trade.itemsRequested?.[0]?.name || 'Unknown Item'}
              </Text>
              <Text style={styles.itemValue}>
                {trade.itemsRequested?.[0]?.price || trade.itemsRequested?.[0]?.value}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Message */}
      {trade.message && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>"{trade.message}"</Text>
        </View>
      )}

      {/* Actions */}
      {type === 'offers' && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.button, styles.rejectButton]}
            onPress={onReject}
          >
            <Feather name="x" size={16} color="#dc2626" />
            <Text style={[styles.buttonText, styles.rejectText]}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.acceptButton]}
            onPress={onAccept}
          >
            <Feather name="check" size={16} color="#059669" />
            <Text style={[styles.buttonText, styles.acceptText]}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}

      {type === 'active' && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.button, styles.completeButton]}
            onPress={onComplete}
          >
            <Feather name="check-circle" size={16} color="#059669" />
            <Text style={[styles.buttonText, styles.completeText]}>Mark Complete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  date: {
    fontSize: 12,
    color: '#64748b',
  },
  tradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemSection: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '500',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 2,
  },
  itemValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  exchangeIcon: {
    paddingHorizontal: 12,
  },
  messageContainer: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 14,
    color: '#475569',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  rejectButton: {
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
  rejectText: {
    color: '#dc2626',
  },
  acceptButton: {
    borderColor: '#bbf7d0',
    backgroundColor: '#f0fdf4',
  },
  acceptText: {
    color: '#059669',
  },
  completeButton: {
    borderColor: '#bbf7d0',
    backgroundColor: '#f0fdf4',
  },
  completeText: {
    color: '#059669',
  },
});

export default TradeCard;