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

// Debug: Test Firebase connection
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔥 Firebase Auth Debug:', {
    auth: auth,
    config: auth.config,
    app: auth.app,
    currentUser: auth.currentUser
  })
}

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>('signIn')
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

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    console.log('🔐 Starting login process for:', email)
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      console.log('✅ Login successful:', result.user.email)
      console.log('🚀 Attempting to navigate to dashboard...')
      
      // Small delay to ensure auth state is updated
      setTimeout(() => {
        router.push('/dashboard')
        console.log('📍 Navigation command sent to /dashboard')
      }, 100)
    } catch (error: any) {
      console.error('❌ Login error:', error)
      throw new Error(error.message || 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    setIsLoading(true)
    console.log('📝 Starting signup process for:', email, 'with name:', fullName)
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      console.log('✅ Signup successful:', result.user.email)
      
      // Update the user's profile with their full name
      await updateProfile(result.user, {
        displayName: fullName
      })
      console.log('✅ Profile updated with display name:', fullName)
      console.log('🚀 Attempting to navigate to dashboard...')
      
      // Small delay to ensure auth state is updated
      setTimeout(() => {
        router.push('/dashboard')
        console.log('📍 Navigation command sent to /dashboard')
      }, 100)
    } catch (error: any) {
      console.error('❌ Sign up error:', error)
      throw new Error(error.message || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setIsLoading(true)
    console.log('🔍 Starting Google signin...')
    
    try {
      const result = await signInWithPopup(auth, googleProvider)
      console.log('✅ Google signin successful:', result.user.email)
      console.log('🚀 Attempting to navigate to dashboard...')
      
      // Small delay to ensure auth state is updated
      setTimeout(() => {
        router.push('/dashboard')
        console.log('📍 Navigation command sent to /dashboard')
      }, 100)
    } catch (error: any) {
      console.error('❌ Google sign in error:', error)
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
      console.error('Logout error:', error)
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