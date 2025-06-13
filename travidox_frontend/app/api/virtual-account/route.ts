import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

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

// GET handler for virtual account info
export async function GET(request: NextRequest) {
  try {
    // Verify the user's token
    const decodedToken = await verifyToken(request);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');

    // Forward the request to the backend API
    const response = await fetch(`${API_BASE_URL}/virtual-account`, {
      headers: {
        'Authorization': authHeader || '', // Pass through the original token
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to fetch account data' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in virtual-account API route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
