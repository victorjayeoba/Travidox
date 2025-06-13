import { NextRequest, NextResponse } from 'next/server';

// GET handler for market price
export async function GET(
  request: NextRequest,
  context: { params: { symbol: string } }
) {
  // Properly await and destructure the params
  const { params } = context;
  const symbol = params.symbol;
  
  try {
    // Forward to our new market-data API route
    const response = await fetch(
      `${request.nextUrl.origin}/api/market-data/${symbol}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to get market price' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in market-price API route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 