import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assetId: string }> }
) {
  try {
    const { assetId } = await params
    const { searchParams } = new URL(request.url)
    
    // Get all query parameters from the request
    const queryParams = Object.fromEntries(searchParams.entries())
    
    // Validate assetId
    if (!assetId || !/^\d+$/.test(assetId)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid asset ID. Must be a numeric value.' 
        },
        { status: 400 }
      )
    }

    // Construct API URL with all query parameters
    const apiUrl = new URL(`https://travidoxapi.opulentencounters.com/chart-data/${assetId}`)
    Object.entries(queryParams).forEach(([key, value]) => {
      apiUrl.searchParams.append(key, value)
    })
    
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Chart data API error:', error)
    
    // Return fallback mock data if external API fails
    const resolvedParams = await params
    const mockData = generateMockChartData(resolvedParams.assetId, request.url)
    
    return NextResponse.json({
      success: true,
      source: 'fallback',
      assetId: resolvedParams.assetId,
      data: mockData,
      note: 'Using generated data - external API unavailable',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// Generate mock chart data as fallback
function generateMockChartData(assetId: string, requestUrl: string) {
  const url = new URL(requestUrl)
  const queryParams = Object.fromEntries(url.searchParams.entries())
  const pointscount = parseInt(queryParams.pointscount || '160')
  const period = queryParams.period || 'P1W'
  
  let currentPrice = 100 // Default base price
  const data = []
  const now = Date.now()
  
  // Calculate time interval based on period
  let timeInterval: number
  switch(period) {
    case 'P1Y':
      timeInterval = 24 * 60 * 60 * 1000 // 1 day for 1 year period
      break
    case 'P1W':
    default:
      timeInterval = 60 * 60 * 1000 // 1 hour for 1 week period
      break
  }
  
  for (let i = 0; i < pointscount; i++) {
    // Generate price movement
    const change = (Math.random() - 0.5) * (currentPrice * 0.02) // ±2% change
    currentPrice = Math.max(currentPrice + change, currentPrice * 0.8) // Don't go below 80% of current price
    
    data.push([
      now - (pointscount - i) * timeInterval,
      currentPrice.toFixed(2),
      (currentPrice + Math.random() * (currentPrice * 0.01)).toFixed(2), // High
      (currentPrice - Math.random() * (currentPrice * 0.01)).toFixed(2), // Low
      currentPrice.toFixed(2),
      Math.floor(Math.random() * 10000) // Volume
    ])
  }
  
  return data
}