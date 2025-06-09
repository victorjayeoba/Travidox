'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/auth-provider';

interface UserProfile {
  userId: string;
  displayName: string | null;
  email: string | null;
  xp: number;
  balance: number;
  completedCourses: string[];
  isVerified: boolean;
  joinDate: string;
  lastActive: string;
}

// Create a global event for XP/balance updates
export const XP_BALANCE_UPDATE_EVENT = 'xp-balance-update';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get the latest profile from localStorage
  const getLatestProfile = useCallback(() => {
    if (!user) return null;
    
    const storedProfile = localStorage.getItem(`userProfile_${user.uid}`);
    if (storedProfile) {
      return JSON.parse(storedProfile);
    }
    return null;
  }, [user]);

  // In a real implementation, this would fetch from your backend API
  // For now, we're simulating API behavior with local storage
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // In a real implementation, this would be a fetch call to your API
        // const response = await fetch(`/api/user-profile/${user.uid}`);
        // const data = await response.json();
        
        // For demonstration, we'll use localStorage to persist data between sessions
        const storedProfile = getLatestProfile();
        
        if (storedProfile) {
          // If we have stored profile data, use it
          setProfile(storedProfile);
        } else {
          // If not, create a new profile with default values
          const newProfile: UserProfile = {
            userId: user.uid,
            displayName: user.displayName,
            email: user.email,
            xp: 0, // XP starts at 0 for new users
            balance: 0, // Balance starts at 0 for new users (same as XP)
            completedCourses: [],
            isVerified: user.emailVerified,
            joinDate: user.metadata.creationTime || new Date().toISOString(),
            lastActive: user.metadata.lastSignInTime || new Date().toISOString()
          };
          
          // Store in localStorage (in real app, this would be saved to backend)
          localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(newProfile));
          setProfile(newProfile);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();

    // Listen for XP/balance updates from other components
    const handleXpBalanceUpdate = () => {
      const updatedProfile = getLatestProfile();
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    };

    // Add event listener for XP/balance updates
    window.addEventListener(XP_BALANCE_UPDATE_EVENT, handleXpBalanceUpdate);

    // Cleanup
    return () => {
      window.removeEventListener(XP_BALANCE_UPDATE_EVENT, handleXpBalanceUpdate);
    };
  }, [user, getLatestProfile]);

  // Function to update XP and balance when a course is completed
  const addXpAndUpdateBalance = async (amount: number, courseId: string) => {
    if (!user || !profile) return;
    
    try {
      // Check if course was already completed
      if (profile.completedCourses.includes(courseId)) {
        return;
      }
      
      // Create updated profile
      const updatedProfile = {
        ...profile,
        xp: profile.xp + amount,
        balance: profile.xp + amount, // Ensure balance is EXACTLY the same as XP
        completedCourses: [...profile.completedCourses, courseId],
        lastActive: new Date().toISOString()
      };
      
      // In a real app, you would send this to your backend
      // await fetch(`/api/user-profile/${user.uid}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedProfile)
      // });
      
      // For demo, update localStorage
      localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(updatedProfile));
      
      // Update local state
      setProfile(updatedProfile);
      
      // Dispatch event to notify other components about the update
      window.dispatchEvent(new Event(XP_BALANCE_UPDATE_EVENT));
      
      return updatedProfile;
    } catch (err) {
      console.error('Error updating XP and balance:', err);
      throw new Error('Failed to update XP and balance');
    }
  };

  // Function to directly set the XP and balance to the same value
  const setXpAndBalance = async (amount: number) => {
    if (!user || !profile) return;
    
    try {
      // Create updated profile with the same value for both XP and balance
      const updatedProfile = {
        ...profile,
        xp: amount,
        balance: amount,
        lastActive: new Date().toISOString()
      };
      
      // Update localStorage
      localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(updatedProfile));
      
      // Update local state
      setProfile(updatedProfile);
      
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