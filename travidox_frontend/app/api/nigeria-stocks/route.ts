import { NextResponse } from 'next/server';

// Mock data for when the external API is down
const MOCK_NIGERIA_STOCKS = [
  { symbol: 'DANGCEM', name: 'Dangote Cement Plc', price: 320.70, change: 5.30, sector: 'Industrial' },
  { symbol: 'MTNN', name: 'MTN Nigeria Communications Plc', price: 214.90, change: 3.40, sector: 'Telecommunications' },
  { symbol: 'GTCO', name: 'Guaranty Trust Holding Co. Plc', price: 28.50, change: 0.90, sector: 'Financial Services' },
  { symbol: 'ZENITHBANK', name: 'Zenith Bank Plc', price: 25.85, change: -0.45, sector: 'Financial Services' },
  { symbol: 'AIRTELAFRI', name: 'Airtel Africa Plc', price: 1650.00, change: 50.00, sector: 'Telecommunications' },
  { symbol: 'NESTLE', name: 'Nestle Nigeria Plc', price: 910.20, change: -10.80, sector: 'Consumer Goods' },
  { symbol: 'FBN', name: 'FBN Holdings Plc', price: 12.45, change: 0.35, sector: 'Financial Services' },
  { symbol: 'BUACEMENT', name: 'BUA Cement Plc', price: 95.80, change: 2.30, sector: 'Industrial' },
  { symbol: 'SEPLAT', name: 'Seplat Energy Plc', price: 1200.00, change: -15.50, sector: 'Oil & Gas' },
  { symbol: 'ACCESSCORP', name: 'Access Holdings Plc', price: 15.90, change: 0.65, sector: 'Financial Services' }
];

export async function GET() {
  try {
    // Try to fetch from external API
    try {
      const response = await fetch('https://travidoxapi.opulentencounters.com/nigeria-stocks', {
        cache: 'no-store', // Don't cache the response
        next: { revalidate: 0 }, // Force revalidation on each request
        // Add a shorter timeout
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stocks: ${response.status}`);
      }

      const data = await response.json();
      
      return NextResponse.json(data);
    } catch (error) {
      console.warn('External Nigeria stocks API unreachable, using mock data:', error);
      // Return mock data when external API fails
      return NextResponse.json(MOCK_NIGERIA_STOCKS);
    }
  } catch (error) {
    console.error('Error in Nigeria stocks API route:', error);
    // Return mock data with error flag
    return NextResponse.json(
      { 
        data: MOCK_NIGERIA_STOCKS,
        source: "mock",
        error: 'Using mock data - external API unavailable' 
      }
    );
  }
} 