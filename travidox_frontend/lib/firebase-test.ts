// This is a test file to verify Firebase configuration
import { auth } from './firebase'

export const testFirebaseConnection = () => {
  // Debug logs removed for security reasons
  
  // Test if auth is properly initialized
  if (auth && auth.app) {
    console.log('✅ Firebase Authentication is properly initialized')
    return true
  } else {
    console.error('❌ Firebase Authentication initialization failed')
    return false
  }
}

// Auto-test on import (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  testFirebaseConnection()
} 