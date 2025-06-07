import { useState, useEffect } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for Firebase authentication
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setAuthState({
          user,
          loading: false,
          error: null
        });
      },
      (error) => {
        console.error('Auth state change error:', error);
        setAuthState({
          user: null,
          loading: false,
          error: error.message
        });
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error: any) {
      setAuthState((prev) => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Failed to sign in' 
      }));
      return false;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await createUserWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error: any) {
      setAuthState((prev) => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Failed to sign up' 
      }));
      return false;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await signInWithPopup(auth, googleProvider);
      return true;
    } catch (error: any) {
      setAuthState((prev) => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Failed to sign in with Google' 
      }));
      return false;
    }
  };

  // Sign out
  const logOut = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await signOut(auth);
      return true;
    } catch (error: any) {
      setAuthState((prev) => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Failed to sign out' 
      }));
      return false;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await sendPasswordResetEmail(auth, email);
      setAuthState((prev) => ({ ...prev, loading: false }));
      return true;
    } catch (error: any) {
      setAuthState((prev) => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Failed to reset password' 
      }));
      return false;
    }
  };

  // Clear any auth errors
  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signIn,
    signUp,
    signInWithGoogle,
    logOut,
    resetPassword,
    clearError
  };
} 