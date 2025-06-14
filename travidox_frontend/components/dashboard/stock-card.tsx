"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { StockPurchaseModal } from '@/components/StockPurchaseModal'
import { usePortfolio } from '@/hooks/usePortfolio'
import { isValidStockSymbol } from '@/lib/stock-mapping'

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
  const router = useRouter()
  
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
  
  const safeToFixed = (x: any, digits = 2) => {
    const num = typeof x === 'number' && !isNaN(x) ? x : 0;
    return num.toFixed(digits);
  };

  const changeText = change === 0 
    ? `₦0.00` 
    : change > 0 
      ? `+₦${safeToFixed(change)}` 
      : `-₦${safeToFixed(Math.abs(change))}`
      
  const changePercent = change === 0 
    ? `(0.00%)` 
    : change > 0 
      ? `(+${safeToFixed((change / ((typeof price === 'number' && price - change !== 0) ? price - change : 1) * 100))}%)` 
      : `(-${safeToFixed((Math.abs(change) / ((typeof price === 'number' && price + change !== 0) ? price + change : 1) * 100))}%)`
  
  // Find if user owns any of this stock
  const ownedAsset = portfolio.assets.find(asset => asset.symbol === symbol)
  const ownedQuantity = ownedAsset ? ownedAsset.quantity : 0
  
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      // Navigate to stock detail page if it's a valid stock symbol, otherwise show modal
      if (isValidStockSymbol(symbol)) {
        router.push(`/dashboard/markets/${symbol.toLowerCase()}`)
      } else {
        setIsPurchaseModalOpen(true)
      }
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
            <div className="font-medium">₦{safeToFixed(price)}</div>
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