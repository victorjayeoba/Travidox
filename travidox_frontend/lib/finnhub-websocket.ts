// Finnhub WebSocket service for real-time market data
import { EventEmitter } from 'events';

// Finnhub API key - you should move this to .env in production
const FINNHUB_API_KEY = 'd15onchr01qhqto75rn0d15onchr01qhqto75rng';

// Price cache to store latest prices
export const priceCache: Record<string, { bid: number, ask: number, timestamp: number }> = {};

// Event emitter for price updates
export const priceUpdateEmitter = new EventEmitter();

// WebSocket connection
let ws: WebSocket | null = null;
let isConnected = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 3000; // 3 seconds
const subscribedSymbols = new Set<string>();

// Flag to use simulated data instead of WebSocket
let useSimulatedData = false; // Try to use real data first

// Simulate price updates for testing when WebSocket fails
function startPriceSimulation() {
  console.log('Starting price simulation mode');
  useSimulatedData = true;
  
  // Generate initial prices for common forex pairs
  const basePrices: Record<string, number> = {
    'EURUSD': 1.12,
    'GBPUSD': 1.38,
    'USDJPY': 110.5,
    'AUDUSD': 0.75,
    'USDCAD': 1.25,
    'USDCHF': 0.91,
    'NZDUSD': 0.71,
  };
  
  // Update all subscribed symbols with simulated data
  Object.keys(basePrices).forEach(symbol => {
    updateSimulatedPrice(symbol, basePrices[symbol]);
  });
  
  // Set up interval to update prices every second
  setInterval(() => {
    subscribedSymbols.forEach(symbol => {
      const basePrice = basePrices[symbol] || 1.0;
      // Add small random movement
      const randomChange = (Math.random() - 0.5) * 0.0010; // Max 1 pip movement
      const newPrice = basePrice + randomChange;
      basePrices[symbol] = newPrice; // Update base price
      updateSimulatedPrice(symbol, newPrice);
    });
  }, 1000);
}

// Update a single symbol with simulated price
function updateSimulatedPrice(symbol: string, basePrice: number) {
  const spread = basePrice * 0.0002; // 2 pips spread
  const bid = Number((basePrice - (spread / 2)).toFixed(5));
  const ask = Number((basePrice + (spread / 2)).toFixed(5));
  
  // Update cache
  priceCache[symbol] = {
    bid,
    ask,
    timestamp: Math.floor(Date.now() / 1000)
  };
  
  // Emit price update event
  priceUpdateEmitter.emit(`price-update-${symbol}`, {
    symbol,
    bid,
    ask
  });
}

// Initialize WebSocket connection
export function initWebSocket() {
  if (typeof window === 'undefined') return; // Don't run on server-side
  
  if (useSimulatedData) return; // Don't connect if using simulated data
  
  if (ws) {
    // Close existing connection
    try {
      ws.close();
    } catch (e) {
      console.error('Error closing existing WebSocket:', e);
    }
  }
  
  try {
    console.log('Connecting to Finnhub WebSocket...');
    ws = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);
    
    ws.onopen = () => {
      console.log('Finnhub WebSocket connected');
      isConnected = true;
      reconnectAttempts = 0;
      
      // Resubscribe to all symbols
      subscribedSymbols.forEach(symbol => {
        subscribeToSymbol(symbol);
      });
    };
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'trade' && message.data && message.data.length > 0) {
          message.data.forEach((trade: any) => {
            const symbol = trade.s.replace('OANDA:', '').replace('_', '');
            const price = trade.p;
            const timestamp = trade.t;
            
            if (!price) return;
            
            // Calculate bid/ask with a small spread
            const spread = price * 0.0002; // 2 pips spread
            const bid = price - (spread / 2);
            const ask = price + (spread / 2);
            
            // Update cache
            priceCache[symbol] = {
              bid: Number(bid.toFixed(5)),
              ask: Number(ask.toFixed(5)),
              timestamp: Math.floor(Date.now() / 1000)
            };
            
            // Emit price update event
            priceUpdateEmitter.emit(`price-update-${symbol}`, {
              symbol,
              bid: priceCache[symbol].bid,
              ask: priceCache[symbol].ask
            });
          });
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('Finnhub WebSocket error:', error);
      // If we get an error on the first attempt, switch to simulation mode
      if (reconnectAttempts === 0) {
        console.log('WebSocket connection failed, switching to simulation mode');
        startPriceSimulation();
      }
    };
    
    ws.onclose = () => {
      console.log('Finnhub WebSocket disconnected');
      isConnected = false;
      
      // Attempt to reconnect
      if (reconnectAttempts < maxReconnectAttempts && !useSimulatedData) {
        reconnectAttempts++;
        console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`);
        setTimeout(initWebSocket, reconnectDelay);
      } else if (!useSimulatedData) {
        console.log('Max reconnect attempts reached. Switching to simulation mode.');
        startPriceSimulation();
      }
    };
  } catch (error) {
    console.error('Error initializing WebSocket:', error);
    // If we can't even create the WebSocket, switch to simulation mode
    startPriceSimulation();
  }
}

// Subscribe to a symbol
export function subscribeToSymbol(symbol: string) {
  // Add to subscribed symbols list
  subscribedSymbols.add(symbol);
  
  if (useSimulatedData) {
    // In simulation mode, just make sure we have a price for this symbol
    if (!priceCache[symbol]) {
      let basePrice = 1.0;
      if (symbol === 'EURUSD') basePrice = 1.12;
      else if (symbol === 'GBPUSD') basePrice = 1.38;
      else if (symbol === 'USDJPY') basePrice = 110.5;
      else if (symbol === 'AUDUSD') basePrice = 0.75;
      else if (symbol === 'USDCAD') basePrice = 1.25;
      else if (symbol === 'USDCHF') basePrice = 0.91;
      else if (symbol === 'NZDUSD') basePrice = 0.71;
      
      updateSimulatedPrice(symbol, basePrice);
    }
    return;
  }
  
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    if (!isConnected) {
      initWebSocket();
    }
    return;
  }
  
  // Format symbol for Finnhub (EURUSD -> OANDA:EUR_USD)
  let formattedSymbol = symbol;
  if (symbol.length === 6 && !symbol.includes('_') && !symbol.includes(':')) {
    formattedSymbol = `OANDA:${symbol.substring(0, 3)}_${symbol.substring(3, 6)}`;
  }
  
  console.log(`Subscribing to symbol: ${formattedSymbol}`);
  try {
    ws.send(JSON.stringify({ type: 'subscribe', symbol: formattedSymbol }));
  } catch (error) {
    console.error(`Error subscribing to ${formattedSymbol}:`, error);
    if (!useSimulatedData) {
      startPriceSimulation();
    }
  }
}

// Unsubscribe from a symbol
export function unsubscribeFromSymbol(symbol: string) {
  subscribedSymbols.delete(symbol);
  
  if (useSimulatedData) return;
  
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  
  // Format symbol for Finnhub (EURUSD -> OANDA:EUR_USD)
  let formattedSymbol = symbol;
  if (symbol.length === 6 && !symbol.includes('_') && !symbol.includes(':')) {
    formattedSymbol = `OANDA:${symbol.substring(0, 3)}_${symbol.substring(3, 6)}`;
  }
  
  console.log(`Unsubscribing from symbol: ${formattedSymbol}`);
  try {
    ws.send(JSON.stringify({ type: 'unsubscribe', symbol: formattedSymbol }));
  } catch (error) {
    console.error(`Error unsubscribing from ${formattedSymbol}:`, error);
  }
}

// Get latest price for a symbol
export function getLatestPrice(symbol: string) {
  // If we don't have a price in cache, provide fallback values
  if (!priceCache[symbol]) {
    let fallbackPrice = 1.0;
    if (symbol === 'EURUSD') fallbackPrice = 1.12;
    else if (symbol === 'GBPUSD') fallbackPrice = 1.38;
    else if (symbol === 'USDJPY') fallbackPrice = 110.5;
    else if (symbol === 'AUDUSD') fallbackPrice = 0.75;
    else if (symbol === 'USDCAD') fallbackPrice = 1.25;
    else if (symbol === 'USDCHF') fallbackPrice = 0.91;
    else if (symbol === 'NZDUSD') fallbackPrice = 0.71;
    
    const spread = fallbackPrice * 0.0002; // 2 pips spread
    
    return {
      bid: Number((fallbackPrice - (spread / 2)).toFixed(5)),
      ask: Number((fallbackPrice + (spread / 2)).toFixed(5)),
      timestamp: Math.floor(Date.now() / 1000)
    };
  }
  
  return priceCache[symbol];
}

// Initialize on import (client-side only)
if (typeof window !== 'undefined') {
  // Try WebSocket first, but have a fallback
  try {
    initWebSocket();
  } catch (e) {
    console.error('Failed to initialize WebSocket, using simulation mode:', e);
    startPriceSimulation();
  }
} 