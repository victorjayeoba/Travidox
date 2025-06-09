'use client';

import { useEffect } from 'react';
import { useUserProfile, XP_BALANCE_UPDATE_EVENT } from '@/hooks/useUserProfile';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useAuth } from '@/components/auth/auth-provider';

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
      // Update user balance and XP in localStorage
      const newBalance = (profile.balance || 0) - totalCost;
      const updatedProfile = {
        ...profile,
        xp: newBalance, // Set XP equal to balance
        balance: newBalance
      };

      localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(updatedProfile));

      // In a real app, you would update your backend here
      // await fetch(`/api/user-profile/${user.uid}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedProfile)
      // });

      // Trigger the XP/balance update event
      window.dispatchEvent(new Event(XP_BALANCE_UPDATE_EVENT));

      // Force a page reload to update all components
      // This is a simple solution for demo purposes
      // In a production app, you'd use state management or context
      // window.location.reload(); - No longer needed with event system
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
      // Update user balance and XP in localStorage
      const newBalance = (profile.balance || 0) + totalValue;
      const updatedProfile = {
        ...profile,
        xp: newBalance, // Set XP equal to balance
        balance: newBalance
      };

      localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(updatedProfile));

      // In a real app, you would update your backend here
      // await fetch(`/api/user-profile/${user.uid}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedProfile)
      // });

      // Trigger the XP/balance update event
      window.dispatchEvent(new Event(XP_BALANCE_UPDATE_EVENT));

      // Force a page reload to update all components
      // window.location.reload(); - No longer needed with event system
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