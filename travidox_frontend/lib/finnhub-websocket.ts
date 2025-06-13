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

// Initialize WebSocket connection
export function initWebSocket() {
  if (typeof window === 'undefined') return; // Don't run on server-side
  
  if (ws) {
    // Close existing connection
    ws.close();
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
    };
    
    ws.onclose = () => {
      console.log('Finnhub WebSocket disconnected');
      isConnected = false;
      
      // Attempt to reconnect
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`);
        setTimeout(initWebSocket, reconnectDelay);
      } else {
        console.error('Max reconnect attempts reached. Please refresh the page.');
      }
    };
  } catch (error) {
    console.error('Error initializing WebSocket:', error);
  }
}

// Subscribe to a symbol
export function subscribeToSymbol(symbol: string) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    subscribedSymbols.add(symbol);
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
  ws.send(JSON.stringify({ type: 'subscribe', symbol: formattedSymbol }));
  subscribedSymbols.add(symbol);
}

// Unsubscribe from a symbol
export function unsubscribeFromSymbol(symbol: string) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  
  // Format symbol for Finnhub (EURUSD -> OANDA:EUR_USD)
  let formattedSymbol = symbol;
  if (symbol.length === 6 && !symbol.includes('_') && !symbol.includes(':')) {
    formattedSymbol = `OANDA:${symbol.substring(0, 3)}_${symbol.substring(3, 6)}`;
  }
  
  console.log(`Unsubscribing from symbol: ${formattedSymbol}`);
  ws.send(JSON.stringify({ type: 'unsubscribe', symbol: formattedSymbol }));
  subscribedSymbols.delete(symbol);
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
  initWebSocket();
} 