"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { AuthDialog } from "./auth-dialog"
import { SignUpDialog } from "./sign-up-dialog"

// Mock Firebase Google Auth Response
interface GoogleAuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthDialogOpen: boolean;
  isSignUpDialogOpen: boolean;
  user: GoogleAuthUser | null;
  openAuthDialog: () => void;
  closeAuthDialog: () => void;
  openSignUpDialog: () => void;
  closeSignUpDialog: () => void;
  switchToSignUp: () => void;
  switchToSignIn: () => void;
  login: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signUpWithGoogle: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<GoogleAuthUser | null>(null)

  const openAuthDialog = () => {
    setIsSignUpDialogOpen(false)
    setIsAuthDialogOpen(true)
  }

  const closeAuthDialog = () => {
    setIsAuthDialogOpen(false)
  }

  const openSignUpDialog = () => {
    setIsAuthDialogOpen(false)
    setIsSignUpDialogOpen(true)
  }

  const closeSignUpDialog = () => {
    setIsSignUpDialogOpen(false)
  }

  const switchToSignUp = () => {
    setIsAuthDialogOpen(false)
    setIsSignUpDialogOpen(true)
  }

  const switchToSignIn = () => {
    setIsSignUpDialogOpen(false)
    setIsAuthDialogOpen(true)
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      // Mock authentication success
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUser({
        uid: "user123",
        email: email,
        displayName: email.split("@")[0],
        photoURL: "",
      })
      setIsAuthenticated(true)
      closeAuthDialog()
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true)
      // Mock Google authentication
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate successful Google login
      setUser({
        uid: "google123",
        email: "user@gmail.com",
        displayName: "Google User",
        photoURL: "https://lh3.googleusercontent.com/a/default-user",
      })
      setIsAuthenticated(true)
      closeAuthDialog()
      closeSignUpDialog()
    } catch (error) {
      console.error("Google sign-in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true)
      // Mock signup process
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setUser({
        uid: "newuser123",
        email: email,
        displayName: name,
        photoURL: "",
      })
      setIsAuthenticated(true)
      closeSignUpDialog()
    } catch (error) {
      console.error("Sign up error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const signUpWithGoogle = async () => {
    // For simplicity, we'll use the same function for both sign in and sign up with Google
    await signInWithGoogle()
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthDialogOpen,
        isSignUpDialogOpen,
        user,
        openAuthDialog,
        closeAuthDialog,
        openSignUpDialog,
        closeSignUpDialog,
        switchToSignUp,
        switchToSignIn,
        login,
        signInWithGoogle,
        signUpWithEmail,
        signUpWithGoogle,
        logout,
        isLoading,
      }}
    >
      {children}
      <AuthDialog
        isOpen={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
      />
      <SignUpDialog
        isOpen={isSignUpDialogOpen}
        onOpenChange={setIsSignUpDialogOpen}
      />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 