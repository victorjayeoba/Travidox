"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useUserPortfolioBalance } from '@/hooks/useUserPortfolioBalance'
import { StockPurchaseModal } from '@/components/StockPurchaseModal'

interface StockPurchaseButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  stock?: {
    symbol: string
    name: string
    price: number
    change: number
  }
  className?: string
  children?: React.ReactNode
}

export function StockPurchaseButton({
  variant = 'default',
  size = 'default',
  stock,
  className = '',
  children
}: StockPurchaseButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { portfolio } = useUserPortfolioBalance()
  
  const handleOpenModal = () => {
    setIsModalOpen(true)
  }
  
  // Find if user owns any of this stock
  const ownedAsset = stock ? 
    portfolio.assets.find(asset => asset.symbol === stock.symbol) : 
    undefined
  
  const ownedQuantity = ownedAsset ? ownedAsset.quantity : 0
  
  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        onClick={handleOpenModal}
      >
        {children || 'Trade'}
      </Button>
      
      {stock && (
        <StockPurchaseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          stock={stock}
          ownedQuantity={ownedQuantity}
        />
      )}
    </>
  )
} 