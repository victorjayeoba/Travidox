'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { getUserProfile, updateUserXP, addCompletedQuiz, UserProfile } from '@/lib/firebase-user';

// Event name for XP/balance updates
export const XP_BALANCE_UPDATE_EVENT = 'xp_balance_update';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the user profile from Firestore
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get profile from Firestore
        const userProfile = await getUserProfile(user.uid);
        
        if (userProfile) {
          // Ensure XP and balance are synchronized on load
          if (userProfile.xp !== userProfile.balance) {
            console.log('Synchronizing XP and balance on profile load');
            // Use the XP value as the source of truth
            const syncedProfile = await updateUserXP(user.uid, 0);
            const updatedProfile = await getUserProfile(user.uid);
            if (updatedProfile) {
              setProfile(updatedProfile);
            } else {
              setProfile(userProfile);
            }
          } else {
            setProfile(userProfile);
          }
        } else {
          console.error('User profile not found in Firestore');
          setError('Failed to load user profile');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();

    // Listen for XP/balance updates from other components
    const handleXpBalanceUpdate = async () => {
      if (user) {
        const updatedProfile = await getUserProfile(user.uid);
        if (updatedProfile) {
          setProfile(updatedProfile);
        }
      }
    };

    // Add event listener for XP/balance updates
    window.addEventListener(XP_BALANCE_UPDATE_EVENT, handleXpBalanceUpdate);

    // Cleanup
    return () => {
      window.removeEventListener(XP_BALANCE_UPDATE_EVENT, handleXpBalanceUpdate);
    };
  }, [user]);

  // Function to update XP and balance when a quiz is completed
  const addXpAndUpdateBalance = async (amount: number, quizId: string, score?: number, totalQuestions?: number, isRetake: boolean = false) => {
    if (!user || !profile) return;
    
    try {
      // Find the quiz name from the quiz ID (in a real app, you'd fetch this from your database)
      const quizName = quizId === 'investing-basics' 
        ? 'Investing Basics' 
        : quizId === 'stock-analysis'
          ? 'Stock Analysis'
          : quizId === 'portfolio-strategies'
            ? 'Portfolio Strategies'
            : 'Quiz';
      
      // For retakes, we still want to update the score and completion time, but not award XP
      if (isRetake) {
        // Just update the last completed quiz data without adding XP
        await addCompletedQuiz(
          user.uid, 
          quizId, 
          quizName,
          score || 0,
          totalQuestions || 3,
          0 // No XP for retakes
        );
      } else {
        // Add completed quiz to user profile with XP for first-time completion
        await addCompletedQuiz(
          user.uid, 
          quizId, 
          quizName,
          score || 0,
          totalQuestions || 3,
          amount
        );
      }
      
      // Get updated profile
      const updatedProfile = await getUserProfile(user.uid);
      
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
      
      // Dispatch event to notify other components about the update
      window.dispatchEvent(new Event(XP_BALANCE_UPDATE_EVENT));
      
      return updatedProfile;
    } catch (err) {
      console.error('Error updating XP and completing quiz:', err);
      throw new Error('Failed to update XP and complete quiz');
    }
  };

  // Function to directly set the XP and balance to the same value
  const setXpAndBalance = async (amount: number) => {
    if (!user || !profile) return;
    
    try {
      // This is a simplified version - in a real app you'd have a proper API
      // Here we just calculate the difference and update
      const difference = amount - profile.xp;
      
      // Update XP in Firestore (positive or negative change) - this also updates balance
      await updateUserXP(user.uid, difference);
      
      // Get updated profile
      const updatedProfile = await getUserProfile(user.uid);
      
      if (updatedProfile) {
        // Verify the balance and XP are equal
        if (updatedProfile.xp !== updatedProfile.balance) {
          console.warn('XP and balance are out of sync after setting values');
        }
        setProfile(updatedProfile);
      }
      
      // Dispatch event to notify other components about the update
      window.dispatchEvent(new Event(XP_BALANCE_UPDATE_EVENT));
      
      return updatedProfile;
    } catch (err) {
      console.error('Error setting XP and balance:', err);
      throw new Error('Failed to set XP and balance');
    }
  };

  return {
    profile,
    loading,
    error,
    addXpAndUpdateBalance,
    setXpAndBalance
  };
}; 