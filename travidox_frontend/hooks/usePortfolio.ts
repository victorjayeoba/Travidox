'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useUserProfile } from '@/hooks/useUserProfile';

export interface PortfolioAsset {
  symbol: string;
  name: string;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
}

export interface PortfolioTransaction {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
}

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

  // Load portfolio data from localStorage
  useEffect(() => {
    if (!user) {
      setPortfolio({ assets: [], transactions: [] });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // In a real implementation, this would fetch from your backend API
      // const response = await fetch(`/api/portfolio/${user.uid}`);
      // const data = await response.json();
      
      // For demonstration, we'll use localStorage
      const storedPortfolio = localStorage.getItem(`portfolio_${user.uid}`);
      
      if (storedPortfolio) {
        setPortfolio(JSON.parse(storedPortfolio));
      } else {
        // Initialize empty portfolio
        const initialPortfolio: PortfolioState = {
          assets: [],
          transactions: []
        };
        localStorage.setItem(`portfolio_${user.uid}`, JSON.stringify(initialPortfolio));
        setPortfolio(initialPortfolio);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading portfolio:', err);
      setError('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  }, [user]);

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
  const updatePrices = (marketData: any[]) => {
    if (!user || portfolio.assets.length === 0) return;

    try {
      let hasChanges = false;
      const updatedAssets = portfolio.assets.map(asset => {
        const latestData = marketData.find(stock => 
          stock.Symbol === asset.symbol || stock.symbol === asset.symbol
        );
        
        if (latestData) {
          const newPrice = latestData.Last || latestData.price || asset.currentPrice;
          // Only mark as changed if the price is actually different
          if (newPrice !== asset.currentPrice) {
            hasChanges = true;
            return {
              ...asset,
              currentPrice: newPrice
            };
          }
        }
        return asset;
      });

      // Only update state if there were actual price changes
      if (hasChanges) {
        const updatedPortfolio = {
          ...portfolio,
          assets: updatedAssets
        };

        setPortfolio(updatedPortfolio);
        localStorage.setItem(`portfolio_${user.uid}`, JSON.stringify(updatedPortfolio));
      }
    } catch (err) {
      console.error('Error updating prices:', err);
      setError('Failed to update stock prices');
    }
  };

  // Buy a stock
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
      // Find if the asset is already in portfolio
      const existingAssetIndex = portfolio.assets.findIndex(
        asset => asset.symbol === stock.symbol
      );
      
      let updatedAssets = [...portfolio.assets];
      
      if (existingAssetIndex >= 0) {
        // Update existing asset
        const existingAsset = updatedAssets[existingAssetIndex];
        const newTotalQuantity = existingAsset.quantity + quantity;
        const newTotalCost = existingAsset.quantity * existingAsset.averageBuyPrice + totalCost;
        const newAveragePrice = newTotalCost / newTotalQuantity;
        
        updatedAssets[existingAssetIndex] = {
          ...existingAsset,
          quantity: newTotalQuantity,
          averageBuyPrice: newAveragePrice,
          currentPrice: stock.price // Update current price too
        };
      } else {
        // Add new asset
        updatedAssets.push({
          symbol: stock.symbol,
          name: stock.name,
          quantity: quantity,
          averageBuyPrice: stock.price,
          currentPrice: stock.price
        });
      }
      
      // Create a new transaction
      const newTransaction: PortfolioTransaction = {
        id: Date.now().toString(),
        type: 'buy',
        symbol: stock.symbol,
        name: stock.name,
        quantity: quantity,
        price: stock.price,
        total: totalCost,
        date: new Date().toISOString()
      };
      
      const updatedPortfolio = {
        assets: updatedAssets,
        transactions: [newTransaction, ...portfolio.transactions]
      };
      
      // Save to localStorage
      setPortfolio(updatedPortfolio);
      localStorage.setItem(`portfolio_${user.uid}`, JSON.stringify(updatedPortfolio));
      
      // In a real app, you would update your backend here
      // await fetch(`/api/portfolio/${user.uid}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedPortfolio)
      // });
      
      return true;
    } catch (err) {
      console.error('Error buying stock:', err);
      setError('Failed to complete purchase');
      return false;
    }
  };

  // Sell a stock
  const sellStock = async (
    symbol: string,
    quantity: number,
    currentPrice: number
  ): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Find the asset in portfolio
      const assetIndex = portfolio.assets.findIndex(
        asset => asset.symbol === symbol
      );
      
      if (assetIndex === -1) {
        setError('Asset not found in portfolio');
        return false;
      }
      
      const asset = portfolio.assets[assetIndex];
      
      // Check if user has enough quantity
      if (asset.quantity < quantity) {
        setError('Insufficient shares to complete this sale');
        return false;
      }
      
      const saleValue = currentPrice * quantity;
      
      let updatedAssets = [...portfolio.assets];
      
      if (asset.quantity === quantity) {
        // Remove the asset if selling all
        updatedAssets = updatedAssets.filter((_, index) => index !== assetIndex);
      } else {
        // Update the asset quantity
        updatedAssets[assetIndex] = {
          ...asset,
          quantity: asset.quantity - quantity
        };
      }
      
      // Create a new transaction
      const newTransaction: PortfolioTransaction = {
        id: Date.now().toString(),
        type: 'sell',
        symbol: asset.symbol,
        name: asset.name,
        quantity: quantity,
        price: currentPrice,
        total: saleValue,
        date: new Date().toISOString()
      };
      
      const updatedPortfolio = {
        assets: updatedAssets,
        transactions: [newTransaction, ...portfolio.transactions]
      };
      
      // Save to localStorage
      setPortfolio(updatedPortfolio);
      localStorage.setItem(`portfolio_${user.uid}`, JSON.stringify(updatedPortfolio));
      
      // In a real app, you would update your backend here
      // await fetch(`/api/portfolio/${user.uid}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedPortfolio)
      // });
      
      return true;
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
    buyStock,
    sellStock,
    updatePrices
  };
}; 