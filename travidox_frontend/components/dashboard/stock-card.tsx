"use client"

import { Card, CardContent } from '@/components/ui/card'

interface StockCardProps {
  symbol: string
  name: string
  change: number
  price: number
  logo?: string
}

export function StockCard({
  symbol,
  name,
  change,
  price,
  logo
}: StockCardProps) {
  const isPositive = change >= 0
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500'
  const changeText = isPositive ? `+$${change.toFixed(2)}` : `-$${Math.abs(change).toFixed(2)}`
  const changePercent = isPositive ? `(+${(change / (price - change) * 100).toFixed(2)}%)` : `(-${(Math.abs(change) / (price + change) * 100).toFixed(2)}%)`

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-center space-x-3">
        {logo ? (
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <img src={logo} alt={name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-gray-500">{symbol.substring(0, 2)}</span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900">{symbol}</div>
          <div className="text-xs text-gray-500 truncate">{name}</div>
        </div>
        
        <div className="text-right">
          <div className={changeColor}>
            {changeText} {changePercent}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 