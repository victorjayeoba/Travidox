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

export const useNigeriaStocks = () => {
  const [stocks, setStocks] = useState<NigeriaStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      
      const data: StocksResponse = await response.json();
      
      // Set data in component state only (no localStorage)
      setStocks(data.data);
      
      setError(null);
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
    refresh: fetchStocks
  };
}; 