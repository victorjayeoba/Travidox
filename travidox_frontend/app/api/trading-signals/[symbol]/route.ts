import { NextRequest, NextResponse } from 'next/server';

const FCS_API_KEY = 'rZnkbW4z4nYui53WPDvjn0Q0q7';
const FCS_PIVOT_POINTS_URL = 'https://fcsapi.com/api-v3/forex/pivot_points';

// Rate limiting variables
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 5000; // 5 seconds between requests

// Format symbol for FCS API (EURUSD -> EUR/USD)
function formatSymbolForFCS(symbol: string): string {
  if (symbol.length === 6 && !symbol.includes('/')) {
    return `${symbol.substring(0, 3)}/${symbol.substring(3, 6)}`;
  }
  return symbol;
}

// Symbol mapping to IDs for FCS API
const symbolToId: Record<string, string> = {
  'EUR/USD': '1',
  'GBP/USD': '2',
  'USD/JPY': '3',
  'AUD/USD': '4',
  'USD/CAD': '5',
  'USD/CHF': '6',
  'NZD/USD': '7',
  'EUR/GBP': '8',
  'EUR/JPY': '9',
  'GBP/JPY': '10'
};

// Sleep function to delay execution
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Throttled fetch function to respect API rate limits
async function throttledFetch(url: string) {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  // If we need to wait, calculate the wait time
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    console.log(`Rate limiting: Waiting ${waitTime}ms before next request`);
    await sleep(waitTime);
  }
  
  // Update the last request time
  lastRequestTime = Date.now();
  
  // Make the API request
  console.log(`Fetching from: ${url}`);
  return fetch(url, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

// Convert FCS data to our confidence format
function mapConfidence(pivotData: any): {
  level: number;
  direction: 'BUY' | 'SELL' | 'NEUTRAL';
  strength: 'STRONG' | 'MODERATE' | 'WEAK';
} {
  // Default values
  let direction: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
  let strength: 'STRONG' | 'MODERATE' | 'WEAK' = 'MODERATE';
  let level = 50;
  
  if (!pivotData || !pivotData.overall || !pivotData.overall.summary) {
    return { direction, strength, level };
  }
  
  const summary = pivotData.overall.summary.toLowerCase();
  
  // Map summary to direction and strength
  if (summary.includes('buy')) {
    direction = 'BUY';
    level = summary.includes('strong') ? 85 : 70;
    strength = summary.includes('strong') ? 'STRONG' : 'MODERATE';
  } else if (summary.includes('sell')) {
    direction = 'SELL';
    level = summary.includes('strong') ? 85 : 70;
    strength = summary.includes('strong') ? 'STRONG' : 'MODERATE';
  } else {
    direction = 'NEUTRAL';
    level = 50;
    strength = 'WEAK';
  }
  
  return {
    level,
    direction,
    strength
  };
}

// Analyze pivot point data to determine price position
function analyzePivotPoints(pivotData: any) {
  if (!pivotData || !pivotData.pivot_point) return null;
  
  const classic = pivotData.pivot_point.classic;
  const fibonacci = pivotData.pivot_point.fibonacci;
  
  // Get current price (we'll estimate from pivot point)
  // In a real scenario, you'd get this from a price API
  const estimatedPrice = parseFloat(classic.pp);
  
  // Analyze price position relative to pivot levels
  const resistanceLevels = [
    { name: 'R3', value: parseFloat(classic.R3) },
    { name: 'R2', value: parseFloat(classic.R2) },
    { name: 'R1', value: parseFloat(classic.R1) },
  ];
  
  const supportLevels = [
    { name: 'S1', value: parseFloat(classic.S1) },
    { name: 'S2', value: parseFloat(classic.S2) },
    { name: 'S3', value: parseFloat(classic.S3) },
  ];
  
  // Determine nearest support and resistance
  const pivotPoint = parseFloat(classic.pp);
  
  return {
    pivotPoint,
    resistanceLevels,
    supportLevels,
    estimatedPrice
  };
}

// Format FCS data to match our frontend expectations
function formatSignalData(pivotData: any, originalSymbol: string) {
  if (!pivotData || !pivotData.response) {
    return {
      symbol: originalSymbol,
      summary: {
        summary: 'NEUTRAL',
        moving_averages: 'NEUTRAL',
        oscillators: 'NEUTRAL'
      },
      moving_averages: {
        buy: 0,
        sell: 0,
        neutral: 0
      },
      oscillators: {
        buy: 0,
        sell: 0,
        neutral: 0
      },
      confidence: {
        level: 50,
        direction: 'NEUTRAL',
        strength: 'WEAK'
      },
      indicator_signals: {
        macd: 'neutral',
        rsi: 'neutral',
        ema: 'neutral',
        pivot: 'neutral'
      },
      indicators_agreement: {
        buy: 0,
        sell: 0,
        neutral: 4
      }
    };
  }
  
  const response = pivotData.response;
  const pivotAnalysis = analyzePivotPoints(response);
  
  // Get confidence from overall summary
  const confidence = mapConfidence(response);
  
  // Determine individual indicator signals based on pivot point analysis
  let macdSignal = 'neutral';
  let rsiSignal = 'neutral';
  let emaSignal = 'neutral';
  let pivotSignal = 'neutral';
  
  // Use overall summary for pivot signal
  if (response.overall && response.overall.summary) {
    const summary = response.overall.summary.toLowerCase();
    pivotSignal = summary.includes('buy') ? 'buy' : 
                  summary.includes('sell') ? 'sell' : 'neutral';
                  
    // For this example, we'll derive other signals from the pivot signal
    // In a real implementation, you'd want to get these from actual indicator data
    if (confidence.strength === 'STRONG') {
      macdSignal = pivotSignal;
      emaSignal = pivotSignal;
      rsiSignal = pivotSignal === 'buy' ? 'neutral' : pivotSignal;
    } else if (confidence.strength === 'MODERATE') {
      macdSignal = pivotSignal;
      emaSignal = pivotSignal;
      rsiSignal = 'neutral';
    }
  }
  
  // Count how many indicators agree with the signal
  const indicatorSignals = {
    macd: macdSignal,
    rsi: rsiSignal,
    ema: emaSignal,
    pivot: pivotSignal
  };
  
  const buyCount = Object.values(indicatorSignals).filter(v => v === 'buy').length;
  const sellCount = Object.values(indicatorSignals).filter(v => v === 'sell').length;
  const neutralCount = Object.values(indicatorSignals).filter(v => v === 'neutral').length;
  
  return {
    symbol: originalSymbol,
    summary: {
      summary: confidence.direction,
      moving_averages: pivotSignal === 'buy' ? 'BUY' : 
                       pivotSignal === 'sell' ? 'SELL' : 'NEUTRAL',
      oscillators: macdSignal === 'buy' ? 'BUY' : 
                  macdSignal === 'sell' ? 'SELL' : 'NEUTRAL'
    },
    moving_averages: {
      buy: pivotSignal === 'buy' ? 1 : 0,
      sell: pivotSignal === 'sell' ? 1 : 0,
      neutral: pivotSignal === 'neutral' ? 1 : 0
    },
    oscillators: {
      buy: macdSignal === 'buy' ? 1 : 0,
      sell: macdSignal === 'sell' ? 1 : 0,
      neutral: macdSignal === 'neutral' ? 1 : 0
    },
    confidence: confidence,
    indicator_signals: indicatorSignals,
    indicators_agreement: {
      buy: buyCount,
      sell: sellCount,
      neutral: neutralCount
    },
    pivot_data: pivotAnalysis ? {
      pivot_point: pivotAnalysis.pivotPoint.toFixed(5),
      resistance_levels: pivotAnalysis.resistanceLevels.map(level => ({
        name: level.name,
        value: level.value.toFixed(5)
      })),
      support_levels: pivotAnalysis.supportLevels.map(level => ({
        name: level.name,
        value: level.value.toFixed(5)
      }))
    } : null,
    strategy_advice: generateStrategyAdvice(confidence, pivotAnalysis, pivotSignal)
  };
}

// Generate trading strategy advice based on signals and pivot data
function generateStrategyAdvice(confidence: any, pivotAnalysis: any, pivotSignal: string) {
  const direction = confidence.direction;
  const strength = confidence.strength;
  
  // Default advice
  let advice = {
    action: 'WAIT',
    reason: 'Signals are not clear enough to take action.',
    stop_loss: null as string | null,
    take_profit: null as string | null
  };
  
  if (!pivotAnalysis) return advice;
  
  // Generate advice based on signal direction and strength
  if (direction === 'BUY' && (strength === 'STRONG' || strength === 'MODERATE')) {
    const nearestSupport = pivotAnalysis.supportLevels[0].value.toFixed(5);
    const targetResistance = pivotAnalysis.resistanceLevels[1].value.toFixed(5);
    
    advice = {
      action: 'BUY',
      reason: `Strong buy signal with price near pivot support. Overall trend is bullish.`,
      stop_loss: `Place stop loss below ${nearestSupport}`,
      take_profit: `Target resistance at ${targetResistance}`
    };
    
    // Add pivot point context
    if (pivotSignal === 'buy') {
      advice.reason += ' Price action around pivot points supports buying.';
    }
  } 
  else if (direction === 'SELL' && (strength === 'STRONG' || strength === 'MODERATE')) {
    const nearestResistance = pivotAnalysis.resistanceLevels[0].value.toFixed(5);
    const targetSupport = pivotAnalysis.supportLevels[1].value.toFixed(5);
    
    advice = {
      action: 'SELL',
      reason: `Strong sell signal with price near pivot resistance. Overall trend is bearish.`,
      stop_loss: `Place stop loss above ${nearestResistance}`,
      take_profit: `Target support at ${targetSupport}`
    };
    
    // Add pivot point context
    if (pivotSignal === 'sell') {
      advice.reason += ' Price action around pivot points supports selling.';
    }
  }
  else if (direction === 'NEUTRAL' || strength === 'WEAK') {
    advice = {
      action: 'WAIT',
      reason: 'Mixed signals or weak trend. Wait for clearer market direction.',
      stop_loss: null,
      take_profit: null
    };
  }
  
  return advice;
}

// Cache for storing API results to reduce duplicate requests
const signalCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache lifetime

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    // In Next.js App Router, we need to await the params
    const awaitedParams = await params;
    const symbolParam = awaitedParams.symbol;
    
    const searchParams = request.nextUrl.searchParams;
    const interval = searchParams.get('interval') || '1d';
    
    // Create a cache key
    const cacheKey = `${symbolParam}-${interval}`;
    
    // Check if we have a valid cached response
    if (signalCache.has(cacheKey)) {
      const cachedData = signalCache.get(cacheKey);
      if (cachedData.timestamp > Date.now() - CACHE_TTL) {
        console.log(`Using cached data for ${cacheKey}`);
        return NextResponse.json(cachedData.data);
      } else {
        // Cache expired, remove it
        signalCache.delete(cacheKey);
      }
    }
    
    // Format symbol for FCS API
    const formattedSymbol = formatSymbolForFCS(symbolParam);
    
    // Get symbol ID for API
    const symbolId = symbolToId[formattedSymbol] || '1'; // Default to EUR/USD if not found
    
    // Construct the URL for pivot points
    const pivotUrl = `${FCS_PIVOT_POINTS_URL}?id=${symbolId}&period=${interval}&access_key=${FCS_API_KEY}`;
    
    console.log(`Making API request for ${symbolParam} using FCS API`);
    
    // Use throttled fetch to respect rate limits
    const pivotResponse = await throttledFetch(pivotUrl);
    
    if (!pivotResponse.ok) {
      console.error(`Pivot API request failed with status ${pivotResponse.status}`);
      const errorText = await pivotResponse.text();
      console.error(`Response: ${errorText}`);
      
      // Handle errors
      return handleApiError(pivotResponse.status);
    }
    
    const pivotData = await pivotResponse.json();
    
    if (!pivotData.status) {
      return NextResponse.json(
        { 
          success: false, 
          error: pivotData.msg || 'Unknown error from FCS API' 
        }, 
        { status: 400 }
      );
    }
    
    // Format data for frontend
    const formattedData = formatSignalData(pivotData, symbolParam);
    
    // Create response object
    const responseData = {
      success: true,
      signal: formattedData,
      confidence: formattedData.confidence
    };
    
    // Cache the response
    signalCache.set(cacheKey, {
      timestamp: Date.now(),
      data: responseData
    });
    
    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('Error fetching trading signals:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch trading signals' 
      }, 
      { status: 500 }
    );
  }
} 

// Helper function to handle API errors
function handleApiError(status: number) {
  // Special handling for rate limiting errors
  if (status === 429) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Rate limit exceeded. Please try again in a few seconds.' 
      }, 
      { status: 429 }
    );
  }
  
  // Special handling for authentication errors
  if (status === 401 || status === 403) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Authentication failed. Please check your API key.' 
      }, 
      { status: 403 }
    );
  }
  
  return NextResponse.json(
    { 
      success: false, 
      error: `API request failed with status ${status}` 
    }, 
    { status }
  );
}