import { useState, useEffect } from 'react';

export interface TradingSignal {
  symbol: string;
  interval: string;
  summary: {
    summary: string; // BUY, SELL, NEUTRAL
    moving_averages: string; // BUY, SELL, NEUTRAL
    oscillators: string; // BUY, SELL, NEUTRAL
  };
  moving_averages: {
    buy: number;
    sell: number;
    neutral: number;
  };
  oscillators: {
    buy: number;
    sell: number;
    neutral: number;
  };
  confidence: {
    level: number;
    direction: 'BUY' | 'SELL' | 'NEUTRAL';
    strength: 'STRONG' | 'MODERATE' | 'WEAK';
  };
}

interface UseTradingSignalsResult {
  signal: TradingSignal | null;
  loading: boolean;
  error: string | null;
  refreshSignal: () => Promise<void>;
}

export function useTradingSignals(symbol: string, interval: string = '1h'): UseTradingSignalsResult {
  const [signal, setSignal] = useState<TradingSignal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSignal = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/trading-signals/${symbol}?interval=${interval}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch trading signals');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }
      
      // Combine signal data with confidence
      const signalWithConfidence: TradingSignal = {
        ...data.signal,
        confidence: data.confidence
      };
      
      setSignal(signalWithConfidence);
    } catch (error: any) {
      console.error('Error in useTradingSignals hook:', error);
      setError(error.message || 'Failed to fetch trading signals');
    } finally {
      setLoading(false);
    }
  };

  // Fetch signal when symbol or interval changes
  useEffect(() => {
    fetchSignal();
    
    // Set up interval to refresh every 5 minutes
    const intervalId = setInterval(() => {
      fetchSignal();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [symbol, interval]);

  return {
    signal,
    loading,
    error,
    refreshSignal: fetchSignal
  };
} 