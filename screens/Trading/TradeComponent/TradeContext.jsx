import React, { createContext, useState } from 'react';

export const TradeContext = createContext();

export const TradeProvider = ({ children }) => {
  const [activeTrades, setActiveTrades] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [tradeOffers, setTradeOffers] = useState([]);

  // Initialize with mock data for visualization
  const initMockData = () => {
    setActiveTrades([
      {
        id: 'trade1',
        initiator: 'user123',
        recipient: 'seller456',
        itemsOffered: ['item1', 'item3'],
        itemsRequested: ['item7'],
        status: 'pending',
        createdAt: new Date(),
      }
    ]);
    
    setTradeHistory([
      {
        id: 'trade-hist1',
        initiator: 'user123',
        recipient: 'seller789',
        itemsOffered: ['item2'],
        itemsRequested: ['item5'],
        status: 'completed',
        completedAt: new Date(Date.now() - 86400000),
      }
    ]);
    
    setTradeOffers([
      {
        id: 'offer1',
        from: 'seller456',
        to: 'user123',
        itemsOffered: ['item8'],
        itemsRequested: ['item1'],
        message: "I'd like to trade my premium service for your product",
        createdAt: new Date(),
      }
    ]);
  };

  const createTradeOffer = (offer) => {
    const newOffer = {
      id: `offer-${Date.now()}`,
      ...offer,
      status: 'pending',
      createdAt: new Date(),
    };
    setTradeOffers([...tradeOffers, newOffer]);
    return newOffer;
  };

  const acceptTrade = (tradeId) => {
    const trade = tradeOffers.find(t => t.id === tradeId);
    if (trade) {
      setTradeOffers(tradeOffers.filter(t => t.id !== tradeId));
      setActiveTrades([...activeTrades, { ...trade, status: 'accepted' }]);
    }
  };

  const rejectTrade = (tradeId) => {
    setTradeOffers(tradeOffers.filter(t => t.id !== tradeId));
  };

  const completeTrade = (tradeId) => {
    const trade = activeTrades.find(t => t.id === tradeId);
    if (trade) {
      setActiveTrades(activeTrades.filter(t => t.id !== tradeId));
      setTradeHistory([...tradeHistory, { ...trade, status: 'completed', completedAt: new Date() }]);
    }
  };

  return (
    <TradeContext.Provider value={{
      activeTrades,
      tradeHistory,
      tradeOffers,
      initMockData,
      createTradeOffer,
      acceptTrade,
      rejectTrade,
      completeTrade,
    }}>
      {children}
    </TradeContext.Provider>
  );
};
