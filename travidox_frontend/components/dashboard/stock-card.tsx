"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { StockPurchaseModal } from '@/components/StockPurchaseModal'
import { usePortfolio } from '@/hooks/usePortfolio'

interface StockCardProps {
  symbol: string
  name: string
  change: number
  price: number
  logo?: string
  onClick?: () => void
}

export function StockCard({
  symbol,
  name,
  change,
  price,
  logo,
  onClick
}: StockCardProps) {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const { portfolio } = usePortfolio()
  
  // Determine color and icon based on change value
  let changeColor = 'text-gray-500'  // Default black/gray for no change
  let ChangeIcon = Minus
  
  if (change > 0) {
    changeColor = 'text-green-500'
    ChangeIcon = TrendingUp
  } else if (change < 0) {
    changeColor = 'text-red-500'
    ChangeIcon = TrendingDown
  }
  
  const changeText = change === 0 
    ? `₦0.00` 
    : change > 0 
      ? `+₦${change.toFixed(2)}` 
      : `-₦${Math.abs(change).toFixed(2)}`
      
  const changePercent = change === 0 
    ? `(0.00%)` 
    : change > 0 
      ? `(+${(change / (price - change) * 100).toFixed(2)}%)` 
      : `(-${(Math.abs(change) / (price + change) * 100).toFixed(2)}%)`
  
  // Find if user owns any of this stock
  const ownedAsset = portfolio.assets.find(asset => asset.symbol === symbol)
  const ownedQuantity = ownedAsset ? ownedAsset.quantity : 0
  
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      setIsPurchaseModalOpen(true)
    }
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleClick}>
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
            <div className="font-medium">₦{price.toFixed(2)}</div>
            <div className={`flex items-center justify-end gap-1 ${changeColor}`}>
              <ChangeIcon size={14} />
              <span>{changeText} {changePercent}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <StockPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        stock={{ symbol, name, price, change }}
        ownedQuantity={ownedQuantity}
      />
    </>
  )
} 