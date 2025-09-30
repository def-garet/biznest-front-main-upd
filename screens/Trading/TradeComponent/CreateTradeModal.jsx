import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TradeContext } from './TradeContext';

const CreateTradeModal = ({ visible, onClose, onCreate }) => {
  const [itemsOffered, setItemsOffered] = useState([]);
  const [itemsRequested, setItemsRequested] = useState([]);
  const [newItemOffered, setNewItemOffered] = useState('');
  const [newItemRequested, setNewItemRequested] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [message, setMessage] = useState('');

  const handleAddItemOffered = () => {
    if (newItemOffered.trim()) {
      setItemsOffered([...itemsOffered, newItemOffered]);
      setNewItemOffered('');
    }
  };

  const handleAddItemRequested = () => {
    if (newItemRequested.trim()) {
      setItemsRequested([...itemsRequested, newItemRequested]);
      setNewItemRequested('');
    }
  };

  const handleRemoveItemOffered = (index) => {
    setItemsOffered(itemsOffered.filter((_, i) => i !== index));
  };

  const handleRemoveItemRequested = (index) => {
    setItemsRequested(itemsRequested.filter((_, i) => i !== index));
  };

  const handleCreateTrade = () => {
    if (itemsOffered.length === 0 || itemsRequested.length === 0 || !recipientId) {
      alert('Please add at least one item to offer, one item to request, and specify a recipient');
      return;
    }
    
    const newTrade = {
      initiator: 'currentUser', // In real app, this would be the logged-in user
      recipient: recipientId,
      itemsOffered,
      itemsRequested,
      message,
    };
    
    onCreate(newTrade);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setItemsOffered([]);
    setItemsRequested([]);
    setNewItemOffered('');
    setNewItemRequested('');
    setRecipientId('');
    setMessage('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Create New Trade</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <Text style={styles.sectionTitle}>Recipient</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter recipient ID or username"
            value={recipientId}
            onChangeText={setRecipientId}
          />
          
          <Text style={styles.sectionTitle}>Items You're Offering</Text>
          <View style={styles.itemInputContainer}>
            <TextInput
              style={[styles.input, styles.itemInput]}
              placeholder="Add item to offer"
              value={newItemOffered}
              onChangeText={setNewItemOffered}
            />
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddItemOffered}
            >
              <Ionicons name="add" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.itemsList}>
            {itemsOffered.map((item, index) => (
              <View key={index} style={styles.itemTag}>
                <Text style={styles.itemTagText}>{item}</Text>
                <TouchableOpacity onPress={() => handleRemoveItemOffered(index)}>
                  <Ionicons name="close" size={16} color="#F44336" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          
          <Text style={styles.sectionTitle}>Items You're Requesting</Text>
          <View style={styles.itemInputContainer}>
            <TextInput
              style={[styles.input, styles.itemInput]}
              placeholder="Add item to request"
              value={newItemRequested}
              onChangeText={setNewItemRequested}
            />
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddItemRequested}
            >
              <Ionicons name="add" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.itemsList}>
            {itemsRequested.map((item, index) => (
              <View key={index} style={styles.itemTag}>
                <Text style={styles.itemTagText}>{item}</Text>
                <TouchableOpacity onPress={() => handleRemoveItemRequested(index)}>
                  <Ionicons name="close" size={16} color="#F44336" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          
          <Text style={styles.sectionTitle}>Message (Optional)</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Add a message to the recipient"
            value={message}
            onChangeText={setMessage}
            multiline
          />
        </ScrollView>
        
        <View style={styles.modalFooter}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateTrade}
          >
            <Text style={styles.createButtonText}>Send Trade Offer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 15,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  itemInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemInput: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  itemTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  itemTagText: {
    marginRight: 5,
  },
  messageInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 15,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#6200EE',
    borderRadius: 5,
    padding: 15,
    flex: 1,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default CreateTradeModal;