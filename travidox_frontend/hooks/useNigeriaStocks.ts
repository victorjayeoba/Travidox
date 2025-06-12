'use client';

import { useState, useEffect, useCallback } from 'react';

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

export const useNigeriaStocks = () => {
  const [stocks, setStocks] = useState<NigeriaStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);

  // Function to fetch stocks that can be called on demand
  const fetchStocks = useCallback(async () => {
    try {
      setLoading(true);
      
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

      // Handle different response formats
      if (Array.isArray(result)) {
        // Direct array response
        setStocks(result);
      } else if (result.data && Array.isArray(result.data)) {
        // Wrapped in data property
        setStocks(result.data);
      } else {
        // Unknown format
        setStocks([]);
        throw new Error('Invalid data format received');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching Nigeria stocks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Always fetch fresh data on mount
  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);
  
  // Return the stocks, loading state, error, and a function to manually refresh
  return { 
    stocks, 
    loading, 
    error,
    isMockData,
    refresh: fetchStocks
  };
}; 