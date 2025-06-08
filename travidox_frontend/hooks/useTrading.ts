import { useState, useEffect, useCallback } from 'react';
import { tradingApi } from '@/lib/api';

// Mock data for development and fallbacks
const MOCK_ACCOUNT_INFO = {
  login: "81378629",
  name: "Demo Account",
  server: "Exness-MT5Trial10",
  currency: "USD",
  leverage: "1:500",
  balance: 10000.00,
  equity: 10120.50,
  margin: 320.80,
  free_margin: 9799.70,
  margin_level: 3154.15
};

const MOCK_POSITIONS = [
  {
    id: 123456,
    symbol: "EURUSD",
    type: "BUY" as const,
    volume: 0.1,
    price_open: 1.0850,
    current_price: 1.0865,
    profit: 15.00,
    swap: 0.50,
    time_open: Date.now() - 3600000, // 1 hour ago
    stop_loss: 1.0810,
    take_profit: 1.0900
  },
  {
    id: 123457,
    symbol: "GBPUSD",
    type: "SELL" as const,
    volume: 0.05,
    price_open: 1.2650,
    current_price: 1.2640,
    profit: 5.00,
    swap: -0.20,
    time_open: Date.now() - 7200000, // 2 hours ago
    stop_loss: 1.2690,
    take_profit: 1.2600
  }
];

const MOCK_SYMBOLS = [
  {
    name: "EURUSD",
    description: "Euro vs US Dollar",
    base_currency: "EUR",
    profit_currency: "USD",
    digits: 5,
    trade_mode: "1",
    spread: 1.5,
    tick_size: 0.00001,
    volume_min: 0.01,
    volume_max: 100.0,
    volume_step: 0.01,
    category: "forex"
  },
  {
    name: "GBPUSD",
    description: "Great Britain Pound vs US Dollar",
    base_currency: "GBP",
    profit_currency: "USD",
    digits: 5,
    trade_mode: "1",
    spread: 1.8,
    tick_size: 0.00001,
    volume_min: 0.01,
    volume_max: 100.0,
    volume_step: 0.01,
    category: "forex"
  },
  {
    name: "BTCUSD",
    description: "Bitcoin vs US Dollar",
    base_currency: "BTC",
    profit_currency: "USD",
    digits: 2,
    trade_mode: "1",
    spread: 25.0,
    tick_size: 0.01,
    volume_min: 0.001,
    volume_max: 10.0,
    volume_step: 0.001,
    category: "crypto"
  }
];

// Types
interface AccountInfo {
  login: string;
  name: string;
  server: string;
  currency: string;
  leverage: string;
  balance: number;
  equity: number;
  margin: number;
  free_margin: number;
  margin_level: number;
}

interface Position {
  id: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  price_open: number;
  current_price: number;
  profit: number;
  swap: number;
  time_open: number;
  stop_loss: number | null;
  take_profit: number | null;
}

interface OrderData {
  symbol: string;
  order_type: 'BUY' | 'SELL';
  volume: number;
  stop_loss?: number | null;
  take_profit?: number | null;
}

interface TradingHook {
  accountInfo: AccountInfo | null;
  positions: Position[];
  symbols: any[];
  loading: boolean;
  error: string | null;
  connectAccount: (accountData: any) => Promise<void>;
  placeOrder: (orderData: OrderData) => Promise<any>;
  closePosition: (positionId: number) => Promise<void>;
  refreshPositions: () => Promise<void>;
  refreshAccountInfo: () => Promise<void>;
  useMockData: boolean;
  setUseMockData: (value: boolean) => void;
}

export function useTrading(): TradingHook {
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [symbols, setSymbols] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState<boolean>(false);

  // Fetch account info
  const refreshAccountInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (useMockData) {
        // Use mock data if API is unreachable
        setAccountInfo(MOCK_ACCOUNT_INFO);
      } else {
        const data = await tradingApi.getAccountInfo();
        setAccountInfo(data);
      }
    } catch (err: any) {
      console.error('Error fetching account info:', err);
      
      // If API request failed, use mock data
      setAccountInfo(MOCK_ACCOUNT_INFO);
      setUseMockData(true);
      setError("Using demo data - backend connection unavailable");
    } finally {
      setLoading(false);
    }
  }, [useMockData]);

  // Fetch positions
  const refreshPositions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (useMockData) {
        // Use mock data if API is unreachable
        setPositions(MOCK_POSITIONS);
      } else {
        const data = await tradingApi.getPositions();
        setPositions(data);
      }
    } catch (err: any) {
      console.error('Error fetching positions:', err);
      
      // If API request failed, use mock data
      setPositions(MOCK_POSITIONS);
      setUseMockData(true);
      setError("Using demo data - backend connection unavailable");
    } finally {
      setLoading(false);
    }
  }, [useMockData]);

  // Connect account
  const connectAccount = useCallback(async (accountData: any) => {
    setLoading(true);
    setError(null);
    try {
      if (useMockData) {
        // Just pretend it worked with mock data
        setAccountInfo(MOCK_ACCOUNT_INFO);
      } else {
        await tradingApi.connectAccount(accountData);
        await refreshAccountInfo();
      }
    } catch (err: any) {
      console.error('Error connecting account:', err);
      
      // If API request failed, use mock data
      setAccountInfo(MOCK_ACCOUNT_INFO);
      setUseMockData(true);
      setError("Using demo data - backend connection unavailable");
    } finally {
      setLoading(false);
    }
  }, [refreshAccountInfo, useMockData]);

  // Place order
  const placeOrder = useCallback(async (orderData: OrderData) => {
    setLoading(true);
    setError(null);
    let response;
    
    try {
      if (useMockData) {
        // Create a mock new position
        const newPosition: Position = {
          id: Math.floor(Math.random() * 1000000),
          symbol: orderData.symbol,
          type: orderData.order_type,
          volume: orderData.volume,
          price_open: orderData.order_type === 'BUY' ? 1.0850 : 1.2650,
          current_price: orderData.order_type === 'BUY' ? 1.0855 : 1.2645,
          profit: 5.0,
          swap: 0,
          time_open: Date.now(),
          stop_loss: orderData.stop_loss || null,
          take_profit: orderData.take_profit || null
        };
        
        setPositions(prev => [...prev, newPosition]);
        
        // Return mock response
        response = {
          success: true,
          position_id: newPosition.id,
          symbol: newPosition.symbol,
          type: newPosition.type,
          volume: newPosition.volume,
          price: newPosition.price_open,
          message: "Order placed successfully (MOCK)",
          mock: true
        };
      } else {
        // Call the actual API and store the response
        response = await tradingApi.placeOrder(orderData);
        await refreshPositions();
      }
      
      return response; // Return the actual API response
    } catch (err: any) {
      console.error('Error placing order:', err);
      
      // Only use mock data if the user explicitly allows it
      if (!useMockData) {
        throw err; // Rethrow the error to be handled by the component
      }
      
      // If mock data is allowed, create a mock position
      setUseMockData(true);
      setError("Using demo data - backend connection unavailable");
      
      const newPosition: Position = {
        id: Math.floor(Math.random() * 1000000),
        symbol: orderData.symbol,
        type: orderData.order_type,
        volume: orderData.volume,
        price_open: orderData.order_type === 'BUY' ? 1.0850 : 1.2650,
        current_price: orderData.order_type === 'BUY' ? 1.0855 : 1.2645,
        profit: 5.0,
        swap: 0,
        time_open: Date.now(),
        stop_loss: orderData.stop_loss || null,
        take_profit: orderData.take_profit || null
      };
      
      setPositions(prev => [...prev, newPosition]);
      
      // Return error response
      response = {
        success: false,
        error: err.message || "Failed to place order",
        mock: true
      };
      
      return response;
    } finally {
      setLoading(false);
    }
  }, [refreshPositions, useMockData]);

  // Close position
  const closePosition = useCallback(async (positionId: number) => {
    setLoading(true);
    setError(null);
    try {
      if (useMockData) {
        // Remove the position from the list
        setPositions(prev => prev.filter(pos => pos.id !== positionId));
      } else {
        await tradingApi.closePosition(positionId);
        await refreshPositions();
      }
    } catch (err: any) {
      console.error('Error closing position:', err);
      
      // If API request failed, use mock data
      setUseMockData(true);
      setError("Using demo data - backend connection unavailable");
      
      // Remove the position anyway for the UI
      setPositions(prev => prev.filter(pos => pos.id !== positionId));
    } finally {
      setLoading(false);
    }
  }, [refreshPositions, useMockData]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Try to load account info
        try {
          await refreshAccountInfo();
        } catch (error) {
          console.warn('No account connected yet or error getting account info');
          setUseMockData(true);
        }
        
        // Load trading symbols
        try {
          if (useMockData) {
            setSymbols(MOCK_SYMBOLS);
          } else {
            const symbolsData = await tradingApi.getSymbols();
            setSymbols(symbolsData);
          }
        } catch (error) {
          console.error('Error loading symbols:', error);
          setSymbols(MOCK_SYMBOLS);
          setUseMockData(true);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load initial data');
        console.error('Error loading initial data:', err);
        setUseMockData(true);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [refreshAccountInfo, useMockData]);

  return {
    accountInfo,
    positions,
    symbols,
    loading,
    error,
    connectAccount,
    placeOrder,
    closePosition,
    refreshPositions,
    refreshAccountInfo,
    useMockData,
    setUseMockData
  };
} 