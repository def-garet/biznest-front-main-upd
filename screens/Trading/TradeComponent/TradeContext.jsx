import React, { createContext, useState } from 'react';

export const TradeContext = createContext();

export const TradeProvider = ({ children }) => {
  const [activeTrades, setActiveTrades] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [tradeOffers, setTradeOffers] = useState([]);

  // Initialize with proper mock data
  const initMockData = () => {
    console.log('Initializing trade data...');
    setActiveTrades([
      {
        id: 'trade1',
        initiator: 'You',
        recipient: 'Iloilo Biscocho Haus',
        itemsOffered: [{ id: 'u1', name: 'Hablon Wallet', value: '₱250', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=60' }],
        itemsRequested: [{ id: 'p1', name: 'Biscocho', price: '₱60', image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=300&auto=format&fit=crop&q=60' }],
        status: 'active',
        createdAt: new Date(Date.now() - 86400000),
        type: 'active'
      }
    ]);
    
    setTradeHistory([
      {
        id: 'trade-hist1',
        initiator: 'You',
        recipient: 'Madge Coffee',
        itemsOffered: [{ id: 'u2', name: 'Barako Coffee', value: '₱350', image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300&auto=format&fit=crop&q=60' }],
        itemsRequested: [{ id: 'p3', name: 'Arabica Blend', price: '₱120', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&auto=format&fit=crop&q=60' }],
        status: 'completed',
        completedAt: new Date(Date.now() - 172800000),
        type: 'history'
      }
    ]);
    
    setTradeOffers([
      {
        id: 'offer1',
        from: 'Iloilo Biscocho Haus',
        to: 'You',
        itemsOffered: [{ id: 'p2', name: 'Butterscotch', price: '₱160', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300&auto=format&fit=crop&q=60' }],
        itemsRequested: [{ id: 'u1', name: 'Hablon Wallet', value: '₱250', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=60' }],
        message: "Love your Hablon Wallet! Would you trade it for our premium Butterscotch?",
        status: 'pending',
        createdAt: new Date(),
        type: 'offer'
      }
    ]);
  };

  const createTradeOffer = (offer) => {
    const newOffer = {
      id: `offer-${Date.now()}`,
      ...offer,
      status: 'pending',
      createdAt: new Date(),
      type: 'offer'
    };
    setTradeOffers(prev => [...prev, newOffer]);
    return newOffer;
  };

  const acceptTrade = (tradeId) => {
    const trade = tradeOffers.find(t => t.id === tradeId);
    if (trade) {
      setTradeOffers(prev => prev.filter(t => t.id !== tradeId));
      setActiveTrades(prev => [...prev, { 
        ...trade, 
        status: 'active',
        type: 'active',
        initiator: trade.from,
        recipient: 'You'
      }]);
    }
  };

  const rejectTrade = (tradeId) => {
    setTradeOffers(prev => prev.filter(t => t.id !== tradeId));
  };

  const completeTrade = (tradeId) => {
    const trade = activeTrades.find(t => t.id === tradeId);
    if (trade) {
      setActiveTrades(prev => prev.filter(t => t.id !== tradeId));
      setTradeHistory(prev => [...prev, { 
        ...trade, 
        status: 'completed', 
        completedAt: new Date(),
        type: 'history'
      }]);
    }
  };

  const value = {
    activeTrades,
    tradeHistory,
    tradeOffers,
    initMockData,
    createTradeOffer,
    acceptTrade,
    rejectTrade,
    completeTrade,
  };

  return (
    <TradeContext.Provider value={value}>
      {children}
    </TradeContext.Provider>
  );
};