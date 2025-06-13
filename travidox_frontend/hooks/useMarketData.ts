import { useState, useEffect } from 'react';
import { subscribeToSymbol, unsubscribeFromSymbol, getLatestPrice, priceUpdateEmitter } from '@/lib/finnhub-websocket';

interface MarketData {
  bid: number;
  ask: number;
  timestamp: number;
  loading: boolean;
  error: string | null;
}

// Default prices for common forex pairs
const defaultPrices: Record<string, { bid: number, ask: number }> = {
  'EURUSD': { bid: 1.1195, ask: 1.1205 },
  'GBPUSD': { bid: 1.3795, ask: 1.3805 },
  'USDJPY': { bid: 110.495, ask: 110.505 },
  'AUDUSD': { bid: 0.7495, ask: 0.7505 },
  'USDCAD': { bid: 1.2495, ask: 1.2505 },
  'USDCHF': { bid: 0.9095, ask: 0.9105 },
  'NZDUSD': { bid: 0.7095, ask: 0.7105 },
};

const initialState: MarketData = {
  bid: 0,
  ask: 0,
  timestamp: 0,
  loading: true,
  error: null
};

export function useMarketData(symbol: string): MarketData {
  const [marketData, setMarketData] = useState<MarketData>(initialState);

  useEffect(() => {
    if (!symbol) return;

    // Set initial state from cache, default, or fallback
    try {
      const initialPrice = getLatestPrice(symbol);
      setMarketData({
        bid: initialPrice.bid,
        ask: initialPrice.ask,
        timestamp: initialPrice.timestamp,
        loading: false,
        error: null
      });
    } catch (err) {
      // Use default prices if available
      const defaultPrice = defaultPrices[symbol] || { bid: 1.0, ask: 1.0001 };
      setMarketData({
        bid: defaultPrice.bid,
        ask: defaultPrice.ask,
        timestamp: Math.floor(Date.now() / 1000),
        loading: false,
        error: null
      });
    }

    // Subscribe to the symbol
    subscribeToSymbol(symbol);

    // Listen for price updates
    const handlePriceUpdate = (data: { symbol: string, bid: number, ask: number }) => {
      setMarketData(prev => ({
        ...prev,
        bid: data.bid,
        ask: data.ask,
        timestamp: Math.floor(Date.now() / 1000),
        loading: false
      }));
    };

    priceUpdateEmitter.on(`price-update-${symbol}`, handlePriceUpdate);

    // Cleanup
    return () => {
      unsubscribeFromSymbol(symbol);
      priceUpdateEmitter.off(`price-update-${symbol}`, handlePriceUpdate);
    };
  }, [symbol]);

  return marketData;
} 