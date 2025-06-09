"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

// Debug: Test Firebase connection removed for security

type AuthMode = 'signIn' | 'signUp'

interface AuthContextType {
  user: User | null
  loading: boolean
  authMode: AuthMode
  switchToSignIn: () => void
  switchToSignUp: () => void
  login: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signUpWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
  isAuthenticated: boolean
  openAuthDialog: () => void
  isAuthDialogOpen: boolean
  setIsAuthDialogOpen: (isOpen: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>('signIn')
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const switchToSignIn = () => {
    setAuthMode('signIn')
  }

  const switchToSignUp = () => {
    setAuthMode('signUp')
  }

  const openAuthDialog = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      setIsAuthDialogOpen(true)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      
      // Small delay to ensure auth state is updated
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    } catch (error: any) {
      throw new Error(error.message || 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    setIsLoading(true)
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update the user's profile with their full name
      await updateProfile(result.user, {
        displayName: fullName
      })
      
      // Small delay to ensure auth state is updated
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setIsLoading(true)
    
    try {
      const result = await signInWithPopup(auth, googleProvider)
      
      // Small delay to ensure auth state is updated
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in with Google')
    } finally {
      setIsLoading(false)
    }
  }

  const signUpWithGoogle = async () => {
    // For Google, sign up and sign in are the same
    return signInWithGoogle()
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await signOut(auth)
      router.push('/')
    } catch (error: any) {
      throw new Error(error.message || 'Failed to logout')
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    loading,
    authMode,
    switchToSignIn,
    switchToSignUp,
    login,
    signUpWithEmail,
    signInWithGoogle,
    signUpWithGoogle,
    logout,
    isLoading,
    isAuthenticated: !!user,
    openAuthDialog,
    isAuthDialogOpen,
    setIsAuthDialogOpen,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 