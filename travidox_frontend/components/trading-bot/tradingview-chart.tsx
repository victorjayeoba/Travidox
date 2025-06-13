"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface TradingViewChartProps {
  defaultSymbol?: string
}

export function TradingViewChart({ defaultSymbol = 'EURUSD' }: TradingViewChartProps) {
  const [symbol, setSymbol] = useState(defaultSymbol)
  const [chartKey, setChartKey] = useState(0)
  
  const symbols = [
    { value: 'EURUSD', label: 'EUR/USD' },
    { value: 'GBPUSD', label: 'GBP/USD' },
    { value: 'USDJPY', label: 'USD/JPY' },
    { value: 'AUDUSD', label: 'AUD/USD' },
    { value: 'USDCAD', label: 'USD/CAD' },
    { value: 'USDCHF', label: 'USD/CHF' },
    { value: 'NZDUSD', label: 'NZD/USD' }
  ]
  
  // Format symbol for TradingView (EURUSD -> FX:EURUSD)
  const getFormattedSymbol = (sym: string) => {
    if (sym.length === 6 && !sym.includes(':')) {
      return `FX:${sym}`;
    }
    return sym;
  }
  
  // Update chart when symbol changes
  useEffect(() => {
    // Force re-render of iframe by changing key
    setChartKey(prev => prev + 1);
  }, [symbol]);
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Market Chart</CardTitle>
          <div className="w-40">
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger>
                <SelectValue placeholder="Select symbol" />
              </SelectTrigger>
              <SelectContent>
                {symbols.map((sym) => (
                  <SelectItem key={sym.value} value={sym.value}>{sym.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full rounded-md overflow-hidden border">
          <iframe
            key={chartKey}
            src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=${getFormattedSymbol(symbol)}&interval=15&theme=dark&style=1&locale=en`}
            style={{ width: '100%', height: '100%' }}
            title="TradingView Chart"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </CardContent>
    </Card>
  )
} 