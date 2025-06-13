import { useState, useEffect } from 'react';
import { subscribeToSymbol, unsubscribeFromSymbol, getLatestPrice, priceUpdateEmitter } from '@/lib/finnhub-websocket';

interface MarketData {
  bid: number;
  ask: number;
  timestamp: number;
  loading: boolean;
  error: string | null;
}

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

    // Set initial state from cache or fallback
    const initialPrice = getLatestPrice(symbol);
    setMarketData({
      bid: initialPrice.bid,
      ask: initialPrice.ask,
      timestamp: initialPrice.timestamp,
      loading: false,
      error: null
    });

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