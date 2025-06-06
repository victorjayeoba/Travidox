import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Always fetch fresh data from the external API
    const response = await fetch('https://travidoxapi.opulentencounters.com/nigeria-stocks', {
      cache: 'no-store', // Don't cache the response
      next: { revalidate: 0 }, // Force revalidation on each request
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stocks: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Nigeria stocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Nigeria stocks data' },
      { status: 500 }
    );
  }
} 