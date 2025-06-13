// Market data provider using Finnhub WebSocket API and Alpha Vantage API as fallback

import { getLatestPrice, priceCache as finnhubPriceCache } from './finnhub-websocket';

// Cache to store market data and reduce API calls
// Format: {"symbol": {"bid": 1.1234, "ask": 1.1236, "timestamp": 1234567890}}
const priceCache = new Map<string, MarketPrice>();
const CACHE_EXPIRY = 60 * 1000; // Cache expiry in milliseconds (60 seconds)

export interface MarketPrice {
  bid: number;
  ask: number;
  timestamp: number;
  lastUpdated?: string;
  error?: string;
}

// List of common forex symbols
export const FOREX_SYMBOLS = [
  'EURUSD',
  'GBPUSD',
  'USDJPY',
  'AUDUSD',
  'USDCAD',
  'USDCHF',
  'NZDUSD',
  'EURGBP',
  'EURJPY',
  'GBPJPY'
];

/**
 * Alpha Vantage API provider for forex data
 */
class AlphaVantageProvider {
  private apiKey: string;
  
  constructor(apiKey?: string) {
    // Use provided API key or default
    this.apiKey = apiKey || 'RDJ0NL7BHOPIA44E';
  }
  
  /**
   * Get real-time forex quote for a symbol
   */
  async getForexQuote(symbol: string): Promise<MarketPrice> {
    // Check cache first
    const now = Date.now();
    const cachedPrice = priceCache.get(symbol);
    
    if (cachedPrice && (now - cachedPrice.timestamp) < CACHE_EXPIRY) {
      return cachedPrice;
    }
    
    // Parse symbol for Alpha Vantage format (EURUSD -> EUR/USD)
    let fromCurrency: string;
    let toCurrency: string;
    
    if (symbol.length === 6 && !symbol.includes('/')) {
      fromCurrency = symbol.substring(0, 3);
      toCurrency = symbol.substring(3, 6);
    } else {
      const parts = symbol.split('/');
      if (parts.length === 2) {
        [fromCurrency, toCurrency] = parts;
      } else {
        return {
          bid: 0,
          ask: 0,
          timestamp: now,
          error: `Invalid symbol format: ${symbol}`
        };
      }
    }
    
    // Make API request
    const url = new URL('https://www.alphavantage.co/query');
    url.searchParams.append('function', 'CURRENCY_EXCHANGE_RATE');
    url.searchParams.append('from_currency', fromCurrency);
    url.searchParams.append('to_currency', toCurrency);
    url.searchParams.append('apikey', this.apiKey);
    
    try {
      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data['Realtime Currency Exchange Rate']) {
        const exchangeRate = parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
        
        // Alpha Vantage doesn't provide bid/ask directly, so we simulate a spread
        const spread = exchangeRate * 0.0002; // 2 pips spread (0.02%)
        const bid = exchangeRate - (spread / 2);
        const ask = exchangeRate + (spread / 2);
        
        // Format the result
        const result: MarketPrice = {
          bid: parseFloat(bid.toFixed(5)),
          ask: parseFloat(ask.toFixed(5)),
          timestamp: now,
          lastUpdated: data['Realtime Currency Exchange Rate']['6. Last Refreshed']
        };
        
        // Update cache
        priceCache.set(symbol, result);
        
        return result;
      } else {
        // Check for error messages
        if (data['Error Message']) {
          return {
            bid: 0,
            ask: 0,
            timestamp: now,
            error: data['Error Message']
          };
        } else if (data['Information']) {
          return {
            bid: 0,
            ask: 0,
            timestamp: now,
            error: `API limit reached: ${data['Information']}`
          };
        } else {
          return {
            bid: 0,
            ask: 0,
            timestamp: now,
            error: 'Unknown error from Alpha Vantage API'
          };
        }
      }
    } catch (error) {
      return {
        bid: 0,
        ask: 0,
        timestamp: now,
        error: `Error fetching forex data: ${error}`
      };
    }
  }
  
  /**
   * Get quotes for multiple symbols
   */
  async getMultipleQuotes(symbols: string[]): Promise<Map<string, MarketPrice>> {
    const results = new Map<string, MarketPrice>();
    
    // Use Promise.all to fetch multiple quotes in parallel
    const promises = symbols.map(symbol => this.getForexQuote(symbol));
    const quotes = await Promise.all(promises);
    
    symbols.forEach((symbol, index) => {
      results.set(symbol, quotes[index]);
    });
    
    return results;
  }
}

/**
 * Simulated market data provider for development/testing
 */
class SimulatedMarketDataProvider {
  private lastPrices: Map<string, MarketPrice>;
  private volatility: number;
  
  constructor(volatility: number = 0.0002) { // 0.02% default volatility
    this.lastPrices = new Map<string, MarketPrice>();
    this.volatility = volatility;
  }
  
  /**
   * Get simulated forex quote
   */
  async getForexQuote(symbol: string): Promise<MarketPrice> {
    const now = Date.now();
    let basePrice: number;
    
    // If we have a last price, use it as the base
    if (this.lastPrices.has(symbol)) {
      basePrice = this.lastPrices.get(symbol)!.bid;
    } else {
      // Generate initial prices based on symbol
      switch (symbol) {
        case 'EURUSD':
          basePrice = 1.0850;
          break;
        case 'GBPUSD':
          basePrice = 1.2650;
          break;
        case 'USDJPY':
          basePrice = 149.50;
          break;
        case 'AUDUSD':
          basePrice = 0.6550;
          break;
        case 'USDCAD':
          basePrice = 1.3650;
          break;
        case 'NZDUSD':
          basePrice = 0.6050;
          break;
        default:
          basePrice = 1.0000;
      }
    }
    
    // Generate random price movement
    const movement = basePrice * this.volatility * (Math.random() * 2 - 1);
    const newBasePrice = basePrice + movement;
    
    // Calculate bid/ask with a spread
    const spread = newBasePrice * 0.0002; // 2 pips spread (0.02%)
    const bid = newBasePrice - (spread / 2);
    const ask = newBasePrice + (spread / 2);
    
    const result: MarketPrice = {
      bid: parseFloat(bid.toFixed(5)),
      ask: parseFloat(ask.toFixed(5)),
      timestamp: now,
      lastUpdated: new Date().toISOString()
    };
    
    // Store the new price
    this.lastPrices.set(symbol, result);
    
    return result;
  }
  
  /**
   * Get quotes for multiple symbols
   */
  async getMultipleQuotes(symbols: string[]): Promise<Map<string, MarketPrice>> {
    const results = new Map<string, MarketPrice>();
    
    // Use Promise.all to fetch multiple quotes in parallel
    const promises = symbols.map(symbol => this.getForexQuote(symbol));
    const quotes = await Promise.all(promises);
    
    symbols.forEach((symbol, index) => {
      results.set(symbol, quotes[index]);
    });
    
    return results;
  }
}

// Create singleton instances
let alphaVantageProvider: AlphaVantageProvider | null = null;
let simulatedProvider: SimulatedMarketDataProvider | null = null;

/**
 * Get market data provider
 */
export function getMarketDataProvider(useSimulated: boolean = false): AlphaVantageProvider | SimulatedMarketDataProvider {
  if (useSimulated) {
    if (!simulatedProvider) {
      simulatedProvider = new SimulatedMarketDataProvider();
    }
    return simulatedProvider;
  } else {
    if (!alphaVantageProvider) {
      alphaVantageProvider = new AlphaVantageProvider();
    }
    return alphaVantageProvider;
  }
}

/**
 * Get market price for a symbol
 */
export async function getMarketPrice(symbol: string, useSimulated: boolean = false): Promise<MarketPrice> {
  // First try to get price from Finnhub WebSocket
  try {
    const finnhubPrice = finnhubPriceCache[symbol];
    if (finnhubPrice && finnhubPrice.bid > 0 && finnhubPrice.ask > 0) {
      return {
        bid: finnhubPrice.bid,
        ask: finnhubPrice.ask,
        timestamp: finnhubPrice.timestamp * 1000, // Convert to milliseconds
        lastUpdated: new Date(finnhubPrice.timestamp * 1000).toISOString()
      };
    }
  } catch (e) {
    console.error('Error getting price from Finnhub:', e);
  }
  
  // If Finnhub data is not available, use Alpha Vantage or simulation
  const provider = getMarketDataProvider(useSimulated);
  return provider.getForexQuote(symbol);
}

/**
 * Get market prices for multiple symbols
 */
export async function getMarketPrices(symbols: string[], useSimulated: boolean = false): Promise<Map<string, MarketPrice>> {
  const results = new Map<string, MarketPrice>();
  
  // First try to get prices from Finnhub WebSocket
  let missingSymbols: string[] = [];
  
  for (const symbol of symbols) {
    try {
      const finnhubPrice = finnhubPriceCache[symbol];
      if (finnhubPrice && finnhubPrice.bid > 0 && finnhubPrice.ask > 0) {
        results.set(symbol, {
          bid: finnhubPrice.bid,
          ask: finnhubPrice.ask,
          timestamp: finnhubPrice.timestamp * 1000, // Convert to milliseconds
          lastUpdated: new Date(finnhubPrice.timestamp * 1000).toISOString()
        });
      } else {
        missingSymbols.push(symbol);
      }
    } catch (e) {
      console.error(`Error getting price for ${symbol} from Finnhub:`, e);
      missingSymbols.push(symbol);
    }
  }
  
  // If any symbols are missing from Finnhub, use Alpha Vantage or simulation
  if (missingSymbols.length > 0) {
    const provider = getMarketDataProvider(useSimulated);
    const fallbackPrices = await provider.getMultipleQuotes(missingSymbols);
    
    for (const [symbol, price] of fallbackPrices.entries()) {
      results.set(symbol, price);
    }
  }
  
  return results;
} 