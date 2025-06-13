import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { 
  getOrCreateVirtualAccount, 
  placeVirtualOrder, 
  closeVirtualPosition, 
  getVirtualPositions, 
  getVirtualTradeHistory,
  VirtualAccount,
  VirtualPosition,
  VirtualTradeHistory,
  updatePositionPrices
} from '@/lib/firebase-trading';
import { getMarketPrice, MarketPrice, FOREX_SYMBOLS } from '@/lib/market-data';
import { getLatestPrice, subscribeToSymbol, unsubscribeFromSymbol } from '@/lib/finnhub-websocket';

export function useTradingAccount() {
  const { user } = useAuth();
  const [account, setAccount] = useState<VirtualAccount | null>(null);
  const [positions, setPositions] = useState<VirtualPosition[]>([]);
  const [history, setHistory] = useState<VirtualTradeHistory[]>([]);
  const [marketPrices, setMarketPrices] = useState<Map<string, MarketPrice>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize account and load data
  useEffect(() => {
    if (!user) {
      setAccount(null);
      setPositions([]);
      setHistory([]);
      setLoading(false);
      return;
    }
    
    const loadAccountData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get or create virtual account
        const accountData = await getOrCreateVirtualAccount(user.uid);
        setAccount(accountData);
        
        // Get open positions
        const positionsData = await getVirtualPositions(user.uid);
        setPositions(positionsData);
        
        // Get trade history
        const historyData = await getVirtualTradeHistory(user.uid);
        setHistory(historyData);
        
        // Update position prices with current market data
        await updatePositionPrices(user.uid);
        
        // Reload positions after updating prices
        const updatedPositions = await getVirtualPositions(user.uid);
        setPositions(updatedPositions);
        
        // Reload account after updating positions to get latest equity and margin level
        const updatedAccount = await getOrCreateVirtualAccount(user.uid);
        setAccount(updatedAccount);
      } catch (err) {
        console.error('Error loading trading account data:', err);
        setError('Failed to load account data');
      } finally {
        setLoading(false);
      }
    };
    
    loadAccountData();
    
    // Set up interval to refresh data every 30 seconds
    const refreshInterval = setInterval(loadAccountData, 30000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [user]);
  
  // Subscribe to market prices
  useEffect(() => {
    // Subscribe to all symbols
    FOREX_SYMBOLS.forEach(symbol => {
      subscribeToSymbol(symbol);
    });
    
    // Set up interval to fetch prices
    const priceInterval = setInterval(() => {
      const newPrices = new Map<string, MarketPrice>();
      
      FOREX_SYMBOLS.forEach(symbol => {
        try {
          // Try to get price from WebSocket
          const wsPrice = getLatestPrice(symbol);
          if (wsPrice && wsPrice.bid && wsPrice.ask) {
            newPrices.set(symbol, wsPrice);
          } else {
            // Fallback to simulated price
            getMarketPrice(symbol, true).then(price => {
              setMarketPrices(prev => {
                const updated = new Map(prev);
                updated.set(symbol, price);
                return updated;
              });
            });
          }
        } catch (err) {
          // Fallback to simulated price
          getMarketPrice(symbol, true).then(price => {
            setMarketPrices(prev => {
              const updated = new Map(prev);
              updated.set(symbol, price);
              return updated;
            });
          });
        }
      });
      
      // Only update state if we have prices
      if (newPrices.size > 0) {
        setMarketPrices(prev => {
          const updated = new Map(prev);
          newPrices.forEach((price, symbol) => {
            updated.set(symbol, price);
          });
          return updated;
        });
      }
    }, 1000);
    
    return () => {
      // Unsubscribe from all symbols
      FOREX_SYMBOLS.forEach(symbol => {
        unsubscribeFromSymbol(symbol);
      });
      
      clearInterval(priceInterval);
    };
  }, []);
  
  // Calculate account metrics
  const accountMetrics = account ? {
    balance: account.balance,
    equity: account.equity,
    marginUsed: account.margin_used,
    marginLevel: account.margin_used > 0 ? 
      // Cap the displayed margin level at 1000% for UI purposes
      Math.min(account.margin_level, 1000) : 
      Infinity,
    leverage: account.leverage,
    freeMargin: account.equity - account.margin_used,
    openPL: account.equity - account.balance,
    marginLevelStatus: account.margin_used === 0 ? 'SAFE' : 
                       account.margin_level < 100 ? 'DANGER' : 
                       account.margin_level < 200 ? 'WARNING' : 'SAFE'
  } : null;
  
  // Place order
  const placeOrder = async (
    symbol: string,
    orderType: 'BUY' | 'SELL',
    volume: number,
    stopLoss: number | null = null,
    takeProfit: number | null = null
  ): Promise<string | null> => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      // Get current market price
      let price;
      try {
        const marketPrice = getLatestPrice(symbol);
        // Use bid for SELL orders and ask for BUY orders
        price = orderType === 'BUY' ? marketPrice.ask : marketPrice.bid;
      } catch (error) {
        console.error('Error getting market price:', error);
        
        // Fallback to simulated price
        const simulatedPrice = await getMarketPrice(symbol, true);
        price = orderType === 'BUY' ? simulatedPrice.ask : simulatedPrice.bid;
      }
      
      // Place order directly with Firebase
      const positionId = await placeVirtualOrder(
        user.uid,
        symbol,
        orderType,
        volume,
        price,
        stopLoss,
        takeProfit
      );
      
      // Refresh positions
      const updatedPositions = await getVirtualPositions(user.uid);
      setPositions(updatedPositions);
      
      // Refresh account
      const updatedAccount = await getOrCreateVirtualAccount(user.uid);
      setAccount(updatedAccount);
      
      return positionId;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  };
  
  // Close position
  const closePosition = async (positionId: string): Promise<boolean> => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      // Find position to get symbol and order type
      const position = positions.find(p => p.position_id === positionId);
      if (!position) {
        throw new Error('Position not found');
      }
      
      // Get current market price
      let closePrice;
      try {
        const marketPrice = getLatestPrice(position.symbol);
        // Use bid for BUY positions and ask for SELL positions (opposite of opening)
        closePrice = position.order_type === 'BUY' ? marketPrice.bid : marketPrice.ask;
      } catch (error) {
        console.error('Error getting market price:', error);
        
        // Fallback to simulated price
        const simulatedPrice = await getMarketPrice(position.symbol, true);
        closePrice = position.order_type === 'BUY' ? simulatedPrice.bid : simulatedPrice.ask;
      }
      
      // Close position directly with Firebase
      const success = await closeVirtualPosition(user.uid, positionId, closePrice);
      
      if (success) {
        // Refresh positions
        const updatedPositions = await getVirtualPositions(user.uid);
        setPositions(updatedPositions);
        
        // Refresh history
        const updatedHistory = await getVirtualTradeHistory(user.uid);
        setHistory(updatedHistory);
        
        // Refresh account
        const updatedAccount = await getOrCreateVirtualAccount(user.uid);
        setAccount(updatedAccount);
      }
      
      return success;
    } catch (error) {
      console.error('Error closing position:', error);
      throw error;
    }
  };
  
  // Refresh data
  const refreshData = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Update position prices
      await updatePositionPrices(user.uid);
      
      // Refresh positions
      const updatedPositions = await getVirtualPositions(user.uid);
      setPositions(updatedPositions);
      
      // Refresh history
      const updatedHistory = await getVirtualTradeHistory(user.uid);
      setHistory(updatedHistory);
      
      // Refresh account
      const updatedAccount = await getOrCreateVirtualAccount(user.uid);
      setAccount(updatedAccount);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };
  
  return {
    account,
    positions,
    history,
    marketPrices,
    loading,
    error,
    accountMetrics,
    placeOrder,
    closePosition,
    refreshData
  };
} 