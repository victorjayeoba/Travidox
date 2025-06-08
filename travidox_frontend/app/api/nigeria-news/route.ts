import { NextResponse } from 'next/server';

// Cache duration in seconds: 3 hours
const CACHE_DURATION = 60 * 60 * 3;

// Mock data for when the external API is down
const MOCK_NIGERIA_NEWS = {
  "success": true,
  "count": 4,
  "data": [
    {
      "title": "Weekly Market Wrap: Premium stocks lead rally as All-Share Index hits N72 trillion cap, banking sector shines",
      "link": "https://nairametrics.com/2025/06/08/weekly-market-wrap-premium-stocks-lead-rally-as-all-share-index-hits-n72-trillion-cap-banking-sector-shines/",
      "date": "June 8, 2025",
      "category": "Equities",
      "author": "Izuchukwu Okoye",
      "source": "Nairametrics"
    },
    {
      "title": "Nigerian Stock Market hits new record as June rally pops",
      "link": "https://nairametrics.com/2025/06/07/nigerian-stock-market-hits-new-record-as-june-rally-pops/",
      "date": "June 7, 2025",
      "category": "Equities",
      "author": "Unknown Author",
      "source": "Nairametrics"
    },
    {
      "title": "NGX Chairman Umaru Kwairanga eyes Dangote Petrochemicals, NNPC listings in 2025",
      "link": "https://nairametrics.com/2025/06/07/ngx-chairman-umaru-kwairanga-eyes-dangote-petrochemicals-nnpc-listings-in-2025/",
      "date": "June 7, 2025",
      "category": "Energy",
      "author": "Unknown Author",
      "source": "Nairametrics"
    },
    {
      "title": "Dangote Petrochemicals listing on NGX to strengthen Nigeria's stock market – Chairman Kwairanga",
      "link": "https://nairametrics.com/2025/06/07/dangote-petrochemicals-listing-on-ngx-to-strengthen-nigerias-stock-market-chairman-kwairanga/",
      "date": "June 7, 2025",
      "category": "Energy",
      "author": "Unknown Author",
      "source": "Nairametrics"
    }
  ],
  "source": "Nairametrics",
  "timestamp": new Date().toISOString()
};

export async function GET() {
  try {
    // Try to fetch from external API with caching
    try {
      const response = await fetch('https://travidoxapi.opulentencounters.com/nigeria-news', {
        next: { 
          revalidate: CACHE_DURATION // Cache for 3 hours
        },
        headers: {
          'Cache-Control': 'public, max-age=10800, s-maxage=10800' // 3 hours in seconds
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`);
      }

      const data = await response.json();
      
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': `public, max-age=${CACHE_DURATION}, s-maxage=${CACHE_DURATION}`,
        }
      });
    } catch (error) {
      console.warn('External Nigeria news API unreachable, using mock data:', error);
      // Return mock data when external API fails
      return NextResponse.json(MOCK_NIGERIA_NEWS, {
        headers: {
          'Cache-Control': `public, max-age=${CACHE_DURATION}, s-maxage=${CACHE_DURATION}`,
        }
      });
    }
  } catch (error) {
    console.error('Error in Nigeria news API route:', error);
    // Return mock data with error flag
    return NextResponse.json(
      { 
        ...MOCK_NIGERIA_NEWS,
        source: "mock",
        error: 'Using mock data - external API unavailable' 
      },
      {
        headers: {
          'Cache-Control': `public, max-age=${CACHE_DURATION}, s-maxage=${CACHE_DURATION}`,
        }
      }
    );
  }
} 