/**
 * Application configuration
 */

// Backend API configuration
export const apiConfig = {
  // Replace with your actual EC2 instance's IP address or domain
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://16.171.230.94:8000',
  
  // API request timeout in milliseconds
  timeout: 30000,
  
  // Whether to enable debug logging for API requests
  debug: process.env.NODE_ENV === 'development',
};

// Authentication configuration
export const authConfig = {
  // Firebase configuration keys
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
  
  // Token storage key in localStorage
  tokenStorageKey: 'authToken',
};

// Trading configuration
export const tradingConfig = {
  // Default refresh interval for trading data (in milliseconds)
  refreshInterval: 10000,
  
  // Default risk settings
  defaultRiskLevel: 'medium', // 'low', 'medium', 'high'
  
  // Default trading parameters
  defaultStopLoss: 15, // pips
  defaultTakeProfit: 30, // pips
  
  // Trading bot settings
  botSettings: {
    maxDailyTrades: 10,
    maxBudgetPercentage: 20, // percentage of account balance
  },
}; 