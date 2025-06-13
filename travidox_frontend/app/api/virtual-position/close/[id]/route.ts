import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { getLatestPrice } from '@/lib/finnhub-websocket';

const API_BASE_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

// Helper function to verify Firebase ID token
async function verifyToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split('Bearer ')[1];
    // In a production app, this would verify the token on the server
    // For now, we'll just pass the token through
    return { uid: "demo-user-id" };
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

// POST handler for closing virtual positions
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const positionId = params.id;
    
    // Verify the user's token
    const decodedToken = await verifyToken(request);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the position details first to get the symbol and order type
    const authHeader = request.headers.get('authorization');
    const positionResponse = await fetch(`${API_BASE_URL}/virtual-position/${positionId}`, {
      headers: {
        'Authorization': authHeader || '',
      },
    });
    
    if (!positionResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to get position details' },
        { status: positionResponse.status }
      );
    }
    
    const positionData = await positionResponse.json();
    
    if (!positionData.success || !positionData.position) {
      return NextResponse.json(
        { error: 'Position not found' },
        { status: 404 }
      );
    }
    
    const position = positionData.position;
    
    // Get current market price from our websocket cache
    const marketData = getLatestPrice(position.symbol);
    
    // Use the appropriate price based on order type (BUY closes at bid, SELL closes at ask)
    // This is the opposite of opening a position
    const closePrice = position.order_type === 'BUY' ? marketData.bid : marketData.ask;
    
    // Forward the request to the backend API with the close price
    const response = await fetch(`${API_BASE_URL}/virtual-position/close/${positionId}`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        close_price: closePrice
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to close position' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      ...data,
      close_price: closePrice // Return the price used for closing
    });
  } catch (error: any) {
    console.error('Error in close-position API route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
