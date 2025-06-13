// Twelve Data API service for technical analysis signals
const TWELVE_DATA_API_KEY = '9e4419452e224e89a36e5b56812417cd';
const TWELVE_DATA_BASE_URL = 'https://api.twelvedata.com';

export interface TechnicalSummary {
  symbol: string;
  interval: string;
  summary: {
    summary: string; // BUY, SELL, NEUTRAL
    moving_averages: string; // BUY, SELL, NEUTRAL
    oscillators: string; // BUY, SELL, NEUTRAL
  };
  moving_averages: {
    buy: number;
    sell: number;
    neutral: number;
  };
  oscillators: {
    buy: number;
    sell: number;
    neutral: number;
  };
  indicators: {
    [key: string]: {
      value: number;
      signal: string;
    };
  };
}

export interface SignalResponse {
  success: boolean;
  signal?: TechnicalSummary;
  error?: string;
}

// Format symbol for Twelve Data API (EURUSD -> EUR/USD)
export function formatSymbolForTwelveData(symbol: string): string {
  if (symbol.length === 6 && !symbol.includes('/')) {
    return `${symbol.substring(0, 3)}/${symbol.substring(3, 6)}`;
  }
  return symbol;
}

// Get technical analysis summary for a symbol
export async function getTechnicalSummary(symbol: string, interval: string = '1h'): Promise<SignalResponse> {
  try {
    const formattedSymbol = formatSymbolForTwelveData(symbol);
    const url = `${TWELVE_DATA_BASE_URL}/technical_summary?symbol=${formattedSymbol}&interval=${interval}&apikey=${TWELVE_DATA_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code) {
      // API returned an error
      return {
        success: false,
        error: data.message || 'Unknown error from Twelve Data API'
      };
    }
    
    return {
      success: true,
      signal: data as TechnicalSummary
    };
  } catch (error: any) {
    console.error('Error fetching technical summary:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch technical analysis data'
    };
  }
}

// Calculate confidence level based on technical summary
export function calculateConfidence(summary: TechnicalSummary): {
  level: number;
  direction: 'BUY' | 'SELL' | 'NEUTRAL';
  strength: 'STRONG' | 'MODERATE' | 'WEAK';
} {
  const { moving_averages, oscillators } = summary;
  
  // Calculate total signals
  const totalMA = moving_averages.buy + moving_averages.sell + moving_averages.neutral;
  const totalOsc = oscillators.buy + oscillators.sell + oscillators.neutral;
  
  // Calculate percentages
  const maBuyPercent = moving_averages.buy / totalMA;
  const maSellPercent = moving_averages.sell / totalMA;
  const oscBuyPercent = oscillators.buy / totalOsc;
  const oscSellPercent = oscillators.sell / totalOsc;
  
  // Weight MA signals more than oscillators (60% vs 40%)
  const buySignal = maBuyPercent * 0.6 + oscBuyPercent * 0.4;
  const sellSignal = maSellPercent * 0.6 + oscSellPercent * 0.4;
  
  // Determine direction
  let direction: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
  let level = 0;
  
  if (buySignal > sellSignal) {
    direction = 'BUY';
    level = buySignal * 100;
  } else if (sellSignal > buySignal) {
    direction = 'SELL';
    level = sellSignal * 100;
  } else {
    direction = 'NEUTRAL';
    level = 50;
  }
  
  // Determine strength
  let strength: 'STRONG' | 'MODERATE' | 'WEAK' = 'WEAK';
  
  if (level >= 70) {
    strength = 'STRONG';
  } else if (level >= 55) {
    strength = 'MODERATE';
  } else {
    strength = 'WEAK';
  }
  
  return {
    level: Math.round(level),
    direction,
    strength
  };
} 