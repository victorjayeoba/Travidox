import { NextRequest, NextResponse } from 'next/server';

// Finnhub API key - you should move this to .env in production
const FINNHUB_API_KEY = 'd15onchr01qhqto75rn0d15onchr01qhqto75rng';

// Cache market data to reduce API calls
const priceCache: Record<string, { bid: number, ask: number, timestamp: number }> = {};
const CACHE_EXPIRY = 60; // seconds

export async function GET(
  request: NextRequest,
  context: { params: { symbol: string } }
) {
  // Properly await and destructure the params
  const { params } = context;
  const symbol = params.symbol;
  
  try {
    // Check cache first
    const now = Date.now() / 1000;
    if (priceCache[symbol] && (now - priceCache[symbol].timestamp) < CACHE_EXPIRY) {
      return NextResponse.json({
        success: true,
        symbol,
        bid: priceCache[symbol].bid,
        ask: priceCache[symbol].ask,
        last_updated: new Date(priceCache[symbol].timestamp * 1000).toISOString()
      });
    }
    
    // Format symbol for Finnhub (EURUSD -> OANDA:EUR_USD)
    let formattedSymbol = symbol;
    if (symbol.length === 6 && !symbol.includes('_') && !symbol.includes(':')) {
      // Always prefix with OANDA: for forex pairs
      formattedSymbol = `OANDA:${symbol.substring(0, 3)}_${symbol.substring(3, 6)}`;
    }
    
    console.log(`Fetching market data for symbol: ${formattedSymbol}`);
    
    // Call Finnhub API
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${formattedSymbol}&token=${FINNHUB_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Check if we got valid data
    if (!data || !data.c) {
      console.error('Invalid response from Finnhub API:', data);
      
      // Provide fallback values based on the symbol
      let fallbackPrice = 1.0;
      if (symbol === 'EURUSD') fallbackPrice = 1.12;
      else if (symbol === 'GBPUSD') fallbackPrice = 1.38;
      else if (symbol === 'USDJPY') fallbackPrice = 110.5;
      else if (symbol === 'AUDUSD') fallbackPrice = 0.75;
      else if (symbol === 'USDCAD') fallbackPrice = 1.25;
      else if (symbol === 'USDCHF') fallbackPrice = 0.91;
      else if (symbol === 'NZDUSD') fallbackPrice = 0.71;
      
      const spread = fallbackPrice * 0.0002; // 2 pips spread
      
      // Update cache with fallback values
      priceCache[symbol] = {
        bid: Number((fallbackPrice - (spread / 2)).toFixed(5)),
        ask: Number((fallbackPrice + (spread / 2)).toFixed(5)),
        timestamp: now
      };
      
      return NextResponse.json({
        success: true,
        symbol,
        bid: priceCache[symbol].bid,
        ask: priceCache[symbol].ask,
        last_updated: new Date().toISOString(),
        note: "Using fallback price data"
      });
    }
    
    // Calculate bid/ask from current price with a small spread
    const currentPrice = data.c;
    const spread = currentPrice * 0.0002; // 2 pips spread (0.02%)
    const bid = currentPrice - (spread / 2);
    const ask = currentPrice + (spread / 2);
    
    // Update cache
    priceCache[symbol] = {
      bid: Number(bid.toFixed(5)),
      ask: Number(ask.toFixed(5)),
      timestamp: now
    };
    
    return NextResponse.json({
      success: true,
      symbol,
      bid: Number(bid.toFixed(5)),
      ask: Number(ask.toFixed(5)),
      last_updated: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Error fetching market data:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to fetch market data',
        symbol,
        bid: null,
        ask: null
      },
      { status: 500 }
    );
  }
} 