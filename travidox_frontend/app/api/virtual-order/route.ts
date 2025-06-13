import { NextRequest, NextResponse } from 'next/server';
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

// POST handler for placing virtual orders
export async function POST(request: NextRequest) {
  try {
    // Verify the user's token
    const decodedToken = await verifyToken(request);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the order data from the request
    const orderData = await request.json();
    
    // Get current market price from our websocket cache
    // This is server-side, so we'll use the getLatestPrice function
    // which provides fallback values if the websocket isn't connected
    const marketData = getLatestPrice(orderData.symbol);
    
    // Use the appropriate price based on order type (BUY uses ask, SELL uses bid)
    const price = orderData.order_type === 'BUY' ? marketData.ask : marketData.bid;
    
    // Add the price to the order data
    const enrichedOrderData = {
      ...orderData,
      price: price
    };
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');

    // Forward the request to the backend API
    const response = await fetch(`${API_BASE_URL}/virtual-order`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enrichedOrderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to place order' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      ...data,
      price: price // Return the price used for the order
    });
  } catch (error: any) {
    console.error('Error in virtual-order API route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
