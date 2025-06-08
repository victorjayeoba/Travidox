'use client';

import React, { useEffect, useState } from 'react';
import { useNigeriaStocks, NigeriaStock } from '@/hooks/useNigeriaStocks';
import { ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import Marquee from 'react-fast-marquee';

// Helper function to get random items from array
const getRandomItems = (array: any[], count: number) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export function NigeriaStockSlider() {
  const { stocks, loading, error, refresh } = useNigeriaStocks();
  const [displayStocks, setDisplayStocks] = useState<NigeriaStock[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Select 10 random stocks when data loads
  useEffect(() => {
    if (stocks.length > 0) {
      // Get 10 random stocks
      const randomStocks = getRandomItems(stocks, 10);
      setDisplayStocks(randomStocks);
    }
  }, [stocks]);

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  // Duplicate stocks for a more seamless effect
  const duplicatedStocks = [...displayStocks, ...displayStocks];

  // Show loading state only when no data is available
  if (loading && displayStocks.length === 0) {
    return (
      <div className="bg-gray-100 py-2 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500">Loading Nigeria stocks data...</p>
        </div>
      </div>
    );
  }

  // Show empty state with refresh button
  if (displayStocks.length === 0) {
    return (
      <div className="bg-gray-100 py-2 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {error ? 'Failed to load stock data' : 'No stocks available'}
          </p>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-sm flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Helper function to get the appropriate text color based on price change
  const getPriceColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-500';
    return 'text-gray-900';
  };

  return (
    <div className="bg-gray-100 py-2 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Refresh button */}
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="absolute right-4 top-0 z-10 p-1 text-gray-500 hover:text-gray-900 transition-colors"
          title="Refresh stock data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
        
        <Marquee
          speed={40}
          gradientWidth={50}
          pauseOnHover={true}
          className="py-2"
        >
          {duplicatedStocks.map((stock, index) => (
            <div 
              key={`${stock.Id}-${index}`} 
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded bg-white shadow mx-3"
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm text-gray-900">{stock.Name}</span>
                <span className="text-[10px] text-gray-500">{stock.Symbol}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className={`font-bold text-sm ${getPriceColor(stock.Chg ?? 0)}`}>
                  ₦{(stock.Last ?? 0).toLocaleString()}
                </span>
                <div className="flex items-center gap-1">
                  {(stock.Chg ?? 0) > 0 ? (
                    <ArrowUp className="w-3 h-3 text-green-600" />
                  ) : (stock.Chg ?? 0) < 0 ? (
                    <ArrowDown className="w-3 h-3 text-red-500" />
                  ) : (
                    <span className="w-3 h-3" />
                  )}
                  <span 
                    className={`text-[10px] font-medium ${getPriceColor(stock.Chg ?? 0)}`}
                  >
                    {(stock.ChgPct ?? 0) > 0 ? "+" : ""}{(stock.ChgPct ?? 0).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
} 