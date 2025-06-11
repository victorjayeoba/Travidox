'use client';

import { useEffect } from 'react';
import { useUserProfile, XP_BALANCE_UPDATE_EVENT } from '@/hooks/useUserProfile';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useAuth } from '@/components/auth/auth-provider';
import { updateUserXP } from '@/lib/firebase-user';

// This hook connects the user's balance with portfolio transactions
export const useUserPortfolioBalance = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading, setXpAndBalance } = useUserProfile();
  const { 
    portfolio, 
    buyStock: originalBuyStock, 
    sellStock: originalSellStock, 
    loading: portfolioLoading,
    error: portfolioError,
    getTotalValue,
    getTotalChange,
    getPercentChange,
    updatePrices
  } = usePortfolio();

  // Ensure balance and XP are synchronized
  useEffect(() => {
    if (profile && profile.balance !== profile.xp) {
      console.log('Force synchronizing XP and balance in useUserPortfolioBalance');
      // Force synchronization if they're out of sync
      setXpAndBalance(profile.xp);
    }
  }, [profile, setXpAndBalance]);

  // Override the buyStock function to update user balance
  const buyStock = async (
    stock: { symbol: string; name: string; price: number },
    quantity: number
  ): Promise<boolean> => {
    if (!user || !profile) return false;

    const totalCost = stock.price * quantity;

    // Check if user has enough balance
    if ((profile.balance || 0) < totalCost) {
      return false;
    }

    // Call the original buyStock function
    const success = await originalBuyStock(stock, quantity);

    if (success) {
      // Update user XP and balance directly in Firestore
      const newAmount = profile.xp - totalCost;
      await setXpAndBalance(newAmount);
      
      // No need to update localStorage or trigger events manually
      // as setXpAndBalance handles that
    }

    return success;
  };

  // Override the sellStock function to update user balance
  const sellStock = async (
    symbol: string,
    quantity: number,
    currentPrice: number
  ): Promise<boolean> => {
    if (!user || !profile) return false;

    const totalValue = currentPrice * quantity;

    // Call the original sellStock function
    const success = await originalSellStock(symbol, quantity, currentPrice);

    if (success) {
      // Update user XP and balance directly in Firestore
      const newAmount = profile.xp + totalValue;
      await setXpAndBalance(newAmount);
      
      // No need to update localStorage or trigger events manually
      // as setXpAndBalance handles that
    }

    return success;
  };

  return {
    profile,
    portfolio,
    loading: profileLoading || portfolioLoading,
    error: portfolioError,
    buyStock,
    sellStock,
    getTotalValue,
    getTotalChange,
    getPercentChange,
    updatePrices
  };
}; 