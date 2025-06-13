import { NextRequest, NextResponse } from 'next/server';

const TWELVE_DATA_API_KEY = '9e4419452e224e89a36e5b56812417cd';
const TWELVE_DATA_BASE_URL = 'https://api.twelvedata.com';

// Format symbol for Twelve Data API (EURUSD -> EUR/USD)
function formatSymbolForTwelveData(symbol: string): string {
  if (symbol.length === 6 && !symbol.includes('/')) {
    return `${symbol.substring(0, 3)}/${symbol.substring(3, 6)}`;
  }
  return symbol;
}

// Calculate confidence level based on technical summary
function calculateConfidence(summary: any): {
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

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    // In Next.js App Router, we need to await the params
    const symbolParam = await params.symbol;
    
    const searchParams = request.nextUrl.searchParams;
    const interval = searchParams.get('interval') || '1h';
    
    const formattedSymbol = formatSymbolForTwelveData(symbolParam);
    const url = `${TWELVE_DATA_BASE_URL}/technical/summary?symbol=${formattedSymbol}&interval=${interval}&apikey=${TWELVE_DATA_API_KEY}`;
    
    const response = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: `API request failed with status ${response.status}` 
        }, 
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    if (data.code) {
      // API returned an error
      return NextResponse.json(
        { 
          success: false, 
          error: data.message || 'Unknown error from Twelve Data API' 
        }, 
        { status: 400 }
      );
    }
    
    // Calculate confidence level
    const confidence = calculateConfidence(data);
    
    return NextResponse.json({
      success: true,
      signal: data,
      confidence
    });
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