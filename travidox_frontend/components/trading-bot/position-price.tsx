"use client"

import { useState, useEffect } from 'react'
import { useMarketData } from '@/hooks/useMarketData'
import { getLatestPrice, subscribeToSymbol, unsubscribeFromSymbol, priceUpdateEmitter } from '@/lib/finnhub-websocket'

interface PositionPriceProps {
  symbol: string
  orderType: 'BUY' | 'SELL'
  openPrice: number
  onPriceUpdate?: (price: number, pnl: number) => void
  volume?: number
}

export function PositionPrice({ 
  symbol, 
  orderType, 
  openPrice, 
  onPriceUpdate,
  volume = 0.01 
}: PositionPriceProps) {
  const [currentPrice, setCurrentPrice] = useState<number>(openPrice)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  
  // Subscribe to real-time price updates
  useEffect(() => {
    // Get initial price
    try {
      const initialPrice = getLatestPrice(symbol);
      const price = orderType === 'BUY' ? initialPrice.bid : initialPrice.ask;
      if (price > 0) {
        setCurrentPrice(price);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(`Error getting initial price for ${symbol}:`, err);
    }
    
    // Subscribe to symbol
    subscribeToSymbol(symbol);
    
    // Listen for price updates
    const handlePriceUpdate = (data: { bid: number; ask: number }) => {
      const price = orderType === 'BUY' ? data.bid : data.ask;
      if (price > 0) {
        setCurrentPrice(price);
        setIsLoading(false);
      }
    };
    
    priceUpdateEmitter.on(`price-update-${symbol}`, handlePriceUpdate);
    
    // Cleanup
    return () => {
      unsubscribeFromSymbol(symbol);
      priceUpdateEmitter.off(`price-update-${symbol}`, handlePriceUpdate);
    };
  }, [symbol, orderType]);
  
  // Calculate profit/loss
  const priceDiff = orderType === 'BUY' 
    ? currentPrice - openPrice 
    : openPrice - currentPrice
  
  // Calculate profit/loss (volume in lots * price difference * 100)
  const profitLoss = priceDiff * volume * 100
  
  // Update parent component with new price and P&L
  useEffect(() => {
    if (onPriceUpdate && currentPrice > 0) {
      onPriceUpdate(currentPrice, profitLoss);
    }
  }, [currentPrice, profitLoss, onPriceUpdate]);
  
  // Always show a price, with loading indicator if needed
  return (
    <span className={`${profitLoss > 0 ? 'text-green-500' : profitLoss < 0 ? 'text-red-500' : ''}`}>
      {currentPrice.toFixed(5)}
      {isLoading && <span className="ml-1 text-gray-400">(updating...)</span>}
    </span>
  )
} 