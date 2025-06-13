"use client"

import { useState, useEffect } from 'react'
import { useMarketData } from '@/hooks/useMarketData'

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
  // Get real-time market data
  const { bid, ask, loading, error } = useMarketData(symbol)
  
  // Use appropriate price based on order type
  const currentPrice = orderType === 'BUY' ? bid : ask
  
  // Calculate profit/loss
  const priceDiff = orderType === 'BUY' 
    ? currentPrice - openPrice 
    : openPrice - currentPrice
  
  // Calculate profit/loss (volume in lots * price difference * 100)
  const profitLoss = priceDiff * volume * 100
  
  // Update parent component with new price and P&L
  useEffect(() => {
    if (onPriceUpdate && !loading && currentPrice > 0) {
      onPriceUpdate(currentPrice, profitLoss);
    }
  }, [currentPrice, profitLoss, onPriceUpdate, loading]);
  
  if (loading) {
    return <span className="text-gray-400">Loading...</span>
  }
  
  if (error) {
    return <span className="text-gray-400">-</span>
  }
  
  return (
    <span className={`${profitLoss > 0 ? 'text-green-500' : profitLoss < 0 ? 'text-red-500' : ''}`}>
      {currentPrice.toFixed(5)}
    </span>
  )
} 