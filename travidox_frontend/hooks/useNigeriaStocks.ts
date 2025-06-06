'use client';

import { useState, useEffect, useCallback } from 'react';

export interface NigeriaStock {
  AvgVolume: number;
  Chg: number;
  ChgPct: number;
  CountryNameTranslated: string;
  ExchangeId: string;
  Flag: string;
  FundamentalBeta: number;
  FundamentalMarketCap: number;
  FundamentalRatio: number;
  FundamentalRevenue: string;
  High: number;
  Id: string;
  IsCFD: string;
  IsOpen: string;
  Last: number;
  LastPairDecimal: number;
  Low: number;
  Name: string;
  PairType: string;
  Performance3Year: number;
  PerformanceDay: number;
  PerformanceMonth: number;
  PerformanceWeek: number;
  PerformanceYear: number;
  PerformanceYtd: number;
  Symbol: string;
  TechnicalDay: string;
  TechnicalHour: string;
  TechnicalMonth: string;
  TechnicalWeek: string;
  Time: string;
  Url: string;
  Volume: number;
}

interface StocksResponse {
  data: NigeriaStock[];
}

// LocalStorage keys
const STORAGE_KEY = 'nigeria-stocks-data';

export const useNigeriaStocks = () => {
  // Get initial state from localStorage if available
  const getInitialStocks = (): NigeriaStock[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return [];
    }
  };

  const [stocks, setStocks] = useState<NigeriaStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch stocks that can be called on demand
  const fetchStocks = useCallback(async () => {
    try {
      setLoading(true);
      
      // Always fetch fresh data
      const response = await fetch('/api/nigeria-stocks');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const data: StocksResponse = await response.json();
      
      // Set data in component state and localStorage
      setStocks(data.data);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.data));
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching Nigeria stocks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load stocks from localStorage on initial mount
  useEffect(() => {
    const storedStocks = getInitialStocks();
    
    if (storedStocks.length > 0) {
      setStocks(storedStocks);
      setLoading(false);
    } else {
      // If no stored data, fetch from API
      fetchStocks();
    }
  }, [fetchStocks]);

  // Return the stocks, loading state, error, and a function to manually refresh
  return { 
    stocks, 
    loading, 
    error,
    refresh: fetchStocks
  };
}; 