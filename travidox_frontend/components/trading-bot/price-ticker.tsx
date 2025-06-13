"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowUp, ArrowDown, RefreshCw } from 'lucide-react'
import { useMarketData } from '@/hooks/useMarketData'

interface PriceTickerItemProps {
  symbol: string
}

function PriceTickerItem({ symbol }: PriceTickerItemProps) {
  const { bid, ask, loading, error } = useMarketData(symbol)
  const [bidDirection, setBidDirection] = useState<'up' | 'down' | null>(null)
  const [askDirection, setAskDirection] = useState<'up' | 'down' | null>(null)
  const [prevBid, setPrevBid] = useState<number>(0)
  const [prevAsk, setPrevAsk] = useState<number>(0)
  
  // Format symbol for display
  const formattedSymbol = symbol.length === 6 
    ? `${symbol.slice(0, 3)}/${symbol.slice(3, 6)}`
    : symbol;
  
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
  const symbols = [
    'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF', 'NZDUSD'
  ]
  
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