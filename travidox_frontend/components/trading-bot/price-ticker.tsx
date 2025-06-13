"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowUp, ArrowDown, RefreshCw } from 'lucide-react'
import { useMarketData } from '@/hooks/useMarketData'
import { FOREX_SYMBOLS } from '@/lib/market-data'
import { getLatestPrice, subscribeToSymbol, priceUpdateEmitter } from '@/lib/finnhub-websocket'

interface PriceTickerItemProps {
  symbol: string
}

function PriceTickerItem({ symbol }: PriceTickerItemProps) {
  const [bid, setBid] = useState<number>(0)
  const [ask, setAsk] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)
  const [bidDirection, setBidDirection] = useState<'up' | 'down' | null>(null)
  const [askDirection, setAskDirection] = useState<'up' | 'down' | null>(null)
  const [prevBid, setPrevBid] = useState<number>(0)
  const [prevAsk, setPrevAsk] = useState<number>(0)
  
  // Format symbol for display
  const formattedSymbol = symbol.length === 6 
    ? `${symbol.slice(0, 3)}/${symbol.slice(3, 6)}`
    : symbol;
  
  // Initialize prices and subscribe to updates
  useEffect(() => {
    // Get initial price
    try {
      const initialPrice = getLatestPrice(symbol);
      setBid(initialPrice.bid);
      setAsk(initialPrice.ask);
      setLoading(false);
    } catch (err) {
      console.error(`Error getting initial price for ${symbol}:`, err);
      setError(true);
      setLoading(false);
    }
    
    // Subscribe to symbol
    subscribeToSymbol(symbol);
    
    // Listen for price updates
    const handlePriceUpdate = (data: { bid: number; ask: number }) => {
      setBid(data.bid);
      setAsk(data.ask);
    };
    
    priceUpdateEmitter.on(`price-update-${symbol}`, handlePriceUpdate);
    
    // Cleanup
    return () => {
      priceUpdateEmitter.off(`price-update-${symbol}`, handlePriceUpdate);
    };
  }, [symbol]);
  
  // Track price changes to show direction indicators
  useEffect(() => {
    if (prevBid && bid !== prevBid) {
      setBidDirection(bid > prevBid ? 'up' : 'down')
      
      // Reset direction indicator after 1 second
      const timer = setTimeout(() => {
        setBidDirection(null)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
    
    setPrevBid(bid)
  }, [bid, prevBid])
  
  useEffect(() => {
    if (prevAsk && ask !== prevAsk) {
      setAskDirection(ask > prevAsk ? 'up' : 'down')
      
      // Reset direction indicator after 1 second
      const timer = setTimeout(() => {
        setAskDirection(null)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
    
    setPrevAsk(ask)
  }, [ask, prevAsk])
  
  if (loading) {
    return (
      <div className="flex justify-between items-center px-4 py-3 border-b last:border-b-0">
        <div className="font-medium">{formattedSymbol}</div>
        <div className="flex items-center text-muted-foreground">
          <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
          Loading...
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex justify-between items-center px-4 py-3 border-b last:border-b-0">
        <div className="font-medium">{formattedSymbol}</div>
        <div className="text-red-500 text-sm">Error</div>
      </div>
    )
  }
  
  return (
    <div className="flex justify-between items-center px-4 py-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
      <div className="font-medium">{formattedSymbol}</div>
      <div className="flex gap-6">
        <div className="flex items-center">
          <span className="text-xs text-muted-foreground mr-2">Bid</span>
          <span className={`font-medium ${bidDirection === 'up' ? 'text-green-500' : bidDirection === 'down' ? 'text-red-500' : ''}`}>
            {bid.toFixed(5)}
          </span>
          {bidDirection === 'up' && <ArrowUp className="h-3 w-3 text-green-500 ml-1" />}
          {bidDirection === 'down' && <ArrowDown className="h-3 w-3 text-red-500 ml-1" />}
        </div>
        <div className="flex items-center">
          <span className="text-xs text-muted-foreground mr-2">Ask</span>
          <span className={`font-medium ${askDirection === 'up' ? 'text-green-500' : askDirection === 'down' ? 'text-red-500' : ''}`}>
            {ask.toFixed(5)}
          </span>
          {askDirection === 'up' && <ArrowUp className="h-3 w-3 text-green-500 ml-1" />}
          {askDirection === 'down' && <ArrowDown className="h-3 w-3 text-red-500 ml-1" />}
        </div>
      </div>
    </div>
  )
}

export function PriceTicker() {
  // Use the common forex symbols list
  const symbols = FOREX_SYMBOLS.slice(0, 7); // Just take the first 7 symbols
  
  return (
    <Card>
      <CardContent className="p-0">
        <div className="bg-muted/50 px-4 py-3 font-medium text-sm border-b">
          Live Market Prices
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {symbols.map(symbol => (
            <PriceTickerItem key={symbol} symbol={symbol} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 