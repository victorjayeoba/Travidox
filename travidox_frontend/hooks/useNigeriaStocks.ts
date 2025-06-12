'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface NigeriaStock {
  symbol?: string;
  Symbol?: string;
  name?: string;
  Name?: string;
  price?: number;
  Last?: number;
  change?: number;
  Chg?: number;
  sector?: string;
  PairType?: string;
  changePercent?: number;
  // Keep original fields
  AvgVolume?: number;
  ChgPct?: number;
  CountryNameTranslated?: string;
  ExchangeId?: string;
  Flag?: string;
  FundamentalBeta?: number;
  FundamentalMarketCap?: number;
  FundamentalRatio?: number;
  FundamentalRevenue?: string;
  High?: number;
  Id?: string;
  IsCFD?: string;
  IsOpen?: string;
  LastPairDecimal?: number;
  Low?: number;
  Performance3Year?: number;
  PerformanceDay?: number;
  PerformanceMonth?: number;
  PerformanceWeek?: number;
  PerformanceYear?: number;
  PerformanceYtd?: number;
  TechnicalDay?: string;
  TechnicalHour?: string;
  TechnicalMonth?: string;
  TechnicalWeek?: string;
  Time?: string;
  Url?: string;
  Volume?: number;
}

interface StocksResponse {
  data?: NigeriaStock[];
  source?: string;
  error?: string;
}

// Export event for stock price updates
export const STOCK_PRICES_UPDATE_EVENT = 'stock_prices_update';

export const useNigeriaStocks = (autoRefresh: boolean = true) => {
  const [stocks, setStocks] = useState<NigeriaStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to fetch stocks that can be called on demand
  const fetchStocks = useCallback(async (silent: boolean = false) => {
    try {
      if (!silent) setLoading(true);
      
      // Always fetch fresh data 
      const response = await fetch('/api/nigeria-stocks', {
        cache: 'no-store', // Don't use browser cache
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const result: StocksResponse = await response.json();
      
      // Check if we got mock data
      if (result.source === "mock") {
        setIsMockData(true);
        if (result.error) {
          setError(result.error);
        }
      } else {
        setIsMockData(false);
        setError(null);
      }

      let newStocks: NigeriaStock[] = [];
      
      // Handle different response formats
      if (Array.isArray(result)) {
        // Direct array response
        newStocks = result;
      } else if (result.data && Array.isArray(result.data)) {
        // Wrapped in data property
        newStocks = result.data;
      } else {
        // Unknown format
        newStocks = [];
        throw new Error('Invalid data format received');
      }
      
      setStocks(newStocks);
      setLastUpdated(new Date());
      
      // Dispatch event to notify other components about price updates
      window.dispatchEvent(new CustomEvent(STOCK_PRICES_UPDATE_EVENT, { 
        detail: newStocks 
      }));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching Nigeria stocks:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Setup automatic refresh
  useEffect(() => {
    // Initial fetch
    fetchStocks();
    
    if (autoRefresh) {
      // Set up interval for automatic refresh every 30 seconds
      intervalRef.current = setInterval(() => {
        fetchStocks(true); // Silent refresh
      }, 30000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchStocks, autoRefresh]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchStocks(false); // Non-silent refresh
  }, [fetchStocks]);
  
  // Return the stocks, loading state, error, and refresh functions
  return { 
    stocks, 
    loading, 
    error,
    isMockData,
    lastUpdated,
    refresh
  };
}; 