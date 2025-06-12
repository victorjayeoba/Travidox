import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://doclib.ngxgroup.com/REST/api/chartdata/ASI?path=IndiciesData', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; TravidoxApp/1.0)',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000)
    })

    if (!response.ok) {
      throw new Error(`NGX API responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    // Return the data with proper CORS headers
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Error fetching NGX ASI data:', error)
    
    // Return fallback data if the external API fails
    return NextResponse.json({
      currentPrice: 114659.11,
      changePercentage: 0.5627470454530305353179179200,
      currentDateTime: new Date().toISOString(),
      IndiciesData: []
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
} 