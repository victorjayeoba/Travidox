/**
 * API client configuration for connecting to the Travidox backend
 */
import { apiConfig, authConfig } from './config';

// Use the base URL from the config
export const API_BASE_URL = apiConfig.baseUrl;

/**
 * Function to make authenticated API requests to the backend
 */
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get authentication token from localStorage if available
  const token = typeof window !== 'undefined' ? localStorage.getItem(authConfig.tokenStorageKey) : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${apiConfig.timeout}ms`);
    }
    console.error('API request failed:', error);
    throw error;
  }
}

// API endpoints for trading functionality
export const tradingApi = {
  // Account connection
  connectAccount: (accountData: any) => 
    apiRequest('/connect-account', {
      method: 'POST',
      body: JSON.stringify(accountData),
    }),
  
  // Account information
  getAccountInfo: () => 
    apiRequest('/account-info'),
  
  // Trading symbols/instruments
  getSymbols: (category?: string) => 
    apiRequest(`/symbols${category ? `?category=${category}` : ''}`),
  
  // Open positions
  getPositions: () => 
    apiRequest('/positions'),
  
  // Place new order
  placeOrder: (orderData: any) => {
    // Format the order data
    const formattedOrderData = {
      ...orderData,
      // Add "z" suffix to symbol for compatibility with the backend
      symbol: orderData.symbol.endsWith('z') ? orderData.symbol : `${orderData.symbol}z`,
    };
    
    return apiRequest('/place-order', {
      method: 'POST',
      body: JSON.stringify(formattedOrderData),
    });
  },
  
  // Close position
  closePosition: (positionId: number) => 
    apiRequest(`/close-position/${positionId}`, {
      method: 'POST',
    }),
}; 