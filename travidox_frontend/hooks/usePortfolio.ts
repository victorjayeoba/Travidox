'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useUserProfile, XP_BALANCE_UPDATE_EVENT } from '@/hooks/useUserProfile';
import { STOCK_PRICES_UPDATE_EVENT } from '@/hooks/useNigeriaStocks';
import { 
  getUserPortfolio, 
  getUserTransactions, 
  buyStock as buyStockDB, 
  sellStock as sellStockDB, 
  updatePortfolioPrices,
  PortfolioAsset, 
  PortfolioTransaction 
} from '@/lib/firebase-portfolio';

// Re-export interfaces for backward compatibility
export type { PortfolioAsset, PortfolioTransaction };

// Event name for portfolio updates
export const PORTFOLIO_UPDATE_EVENT = 'portfolio_update';

interface PortfolioState {
  assets: PortfolioAsset[];
  transactions: PortfolioTransaction[];
}

export const usePortfolio = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [portfolio, setPortfolio] = useState<PortfolioState>({ assets: [], transactions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to refresh portfolio data
  const refreshPortfolio = async () => {
    if (!user) {
      setPortfolio({ assets: [], transactions: [] });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Load portfolio and transactions from Firestore
      const [portfolioData, transactionsData] = await Promise.all([
        getUserPortfolio(user.uid),
        getUserTransactions(user.uid)
      ]);
      
      if (portfolioData) {
        setPortfolio({
          assets: portfolioData.assets,
          transactions: transactionsData
        });
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading portfolio:', err);
      setError('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  // Load portfolio data from Firestore
  useEffect(() => {
    refreshPortfolio();
  }, [user]);

  // Listen for portfolio update events
  useEffect(() => {
    const handlePortfolioUpdate = () => {
      refreshPortfolio();
    };

    window.addEventListener(PORTFOLIO_UPDATE_EVENT, handlePortfolioUpdate);
    
    return () => {
      window.removeEventListener(PORTFOLIO_UPDATE_EVENT, handlePortfolioUpdate);
    };
  }, [user]);

  // Remove automatic price updates - only update on manual refresh or trading activity
  // This prevents UI glitches from constant updates

  // Calculate total portfolio value
  const getTotalValue = (): number => {
    return portfolio.assets.reduce((total, asset) => {
      return total + (asset.quantity * asset.currentPrice);
    }, 0);
  };

  // Calculate total portfolio change
  const getTotalChange = (): number => {
    return portfolio.assets.reduce((total, asset) => {
      const invested = asset.quantity * asset.averageBuyPrice;
      const current = asset.quantity * asset.currentPrice;
      return total + (current - invested);
    }, 0);
  };

  // Calculate percent change
  const getPercentChange = (): number => {
    const totalValue = getTotalValue();
    const totalChange = getTotalChange();
    if (totalValue - totalChange <= 0) return 0;
    return (totalChange / (totalValue - totalChange)) * 100;
  };

  // Update asset prices with latest market data
  const updatePrices = async (marketData: any[]) => {
    if (!user || portfolio.assets.length === 0) return;

    try {
      // Normalize market data to expected format
      const normalizedData = marketData.map(stock => ({
        symbol: stock.Symbol || stock.symbol || '',
        price: stock.Last || stock.price || 0
      })).filter(stock => stock.symbol && stock.price > 0);
      
      // Update prices in Firestore
      await updatePortfolioPrices(user.uid, normalizedData);
      
      // Trigger portfolio update event
      window.dispatchEvent(new Event(PORTFOLIO_UPDATE_EVENT));
      
    } catch (err) {
      console.error('Error updating prices:', err);
      setError('Failed to update stock prices');
    }
  };

  // Buy a stock using Firestore
  const buyStock = async (
    stock: { symbol: string; name: string; price: number },
    quantity: number
  ): Promise<boolean> => {
    if (!user || !profile) return false;
    
    const totalCost = stock.price * quantity;
    
    // Check if user has enough balance
    if ((profile.balance || 0) < totalCost) {
      setError('Insufficient funds to complete this purchase');
      return false;
    }
    
    try {
      // Use Firestore to buy stock
      const success = await buyStockDB(user.uid, stock, quantity);
      
      if (success) {
        // Trigger both portfolio and balance updates
        window.dispatchEvent(new Event(PORTFOLIO_UPDATE_EVENT));
        window.dispatchEvent(new Event(XP_BALANCE_UPDATE_EVENT));
        
        setError(null);
      }
      
      return success;
    } catch (err) {
      console.error('Error buying stock:', err);
      setError('Failed to complete purchase');
      return false;
    }
  };

  // Sell a stock using Firestore
  const sellStock = async (
    symbol: string,
    quantity: number,
    currentPrice: number
  ): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Use Firestore to sell stock
      const success = await sellStockDB(user.uid, symbol, quantity, currentPrice);
      
      if (success) {
        // Trigger both portfolio and balance updates
        window.dispatchEvent(new Event(PORTFOLIO_UPDATE_EVENT));
        window.dispatchEvent(new Event(XP_BALANCE_UPDATE_EVENT));
        
        setError(null);
      }
      
      return success;
    } catch (err) {
      console.error('Error selling stock:', err);
      setError('Failed to complete sale');
      return false;
    }
  };

  return {
    portfolio,
    loading,
    error,
    getTotalValue,
    getTotalChange,
    getPercentChange,
    updatePrices,
    buyStock,
    sellStock
  };
}; 