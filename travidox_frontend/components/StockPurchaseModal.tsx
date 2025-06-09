"use client"

import { useState, useEffect } from 'react'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useUserPortfolioBalance } from '@/hooks/useUserPortfolioBalance'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowUpRight, AlertCircle } from 'lucide-react'

interface StockPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  stock: {
    symbol: string
    name: string
    price: number
    change: number
  }
  ownedQuantity?: number
}

export function StockPurchaseModal({
  isOpen,
  onClose,
  stock,
  ownedQuantity = 0
}: StockPurchaseModalProps) {
  const { profile } = useUserProfile()
  const { buyStock, sellStock, error: portfolioError } = useUserPortfolioBalance()
  
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')
  const [quantity, setQuantity] = useState<number>(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [userBalance, setUserBalance] = useState(0)
  
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1)
      setError(null)
      setSuccess(null)
      setActiveTab(ownedQuantity > 0 ? 'sell' : 'buy')
    }
  }, [isOpen, ownedQuantity])
  
  // Set error from portfolio hook
  useEffect(() => {
    if (portfolioError) {
      setError(portfolioError)
    }
  }, [portfolioError])
  
  // Update user balance when profile changes
  useEffect(() => {
    if (profile) {
      setUserBalance(profile.balance || 0)
    }
  }, [profile])
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    setQuantity(isNaN(value) || value < 1 ? 1 : value)
    setError(null)
  }
  
  const validateBuy = () => {
    const totalCost = stock.price * quantity
    if (!profile || userBalance < totalCost) {
      setError(`Insufficient funds. You need ₦${totalCost.toFixed(2)} to make this purchase.`)
      return false
    }
    return true
  }
  
  const validateSell = () => {
    if (quantity > (ownedQuantity || 0)) {
      setError(`You only own ${ownedQuantity} share${ownedQuantity !== 1 ? 's' : ''} of ${stock.symbol}.`)
      return false
    }
    return true
  }
  
  const handleBuy = async () => {
    setError(null)
    setSuccess(null)
    
    if (!validateBuy()) return
    
    setIsProcessing(true)
    
    try {
      const result = await buyStock(stock, quantity)
      
      if (result) {
        // Update balance locally for immediate feedback
        setUserBalance(prevBalance => prevBalance - (stock.price * quantity))
        
        setSuccess(`Successfully purchased ${quantity} share${quantity !== 1 ? 's' : ''} of ${stock.symbol} for ₦${(stock.price * quantity).toFixed(2)}.`)
        setTimeout(() => {
          onClose()
        }, 2000)
      }
    } catch (err) {
      setError('Failed to complete purchase. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleSell = async () => {
    setError(null)
    setSuccess(null)
    
    if (!validateSell()) return
    
    setIsProcessing(true)
    
    try {
      const result = await sellStock(stock.symbol, quantity, stock.price)
      
      if (result) {
        // Update balance locally for immediate feedback
        setUserBalance(prevBalance => prevBalance + (stock.price * quantity))
        
        setSuccess(`Successfully sold ${quantity} share${quantity !== 1 ? 's' : ''} of ${stock.symbol} for ₦${(stock.price * quantity).toFixed(2)}.`)
        setTimeout(() => {
          onClose()
        }, 2000)
      }
    } catch (err) {
      setError('Failed to complete sale. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }
  
  const totalCost = stock.price * quantity
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">{stock.symbol}</DialogTitle>
          <DialogDescription className="text-center">
            {stock.name} - ₦{stock.price.toFixed(2)}
            <span 
              className={`ml-2 inline-flex items-center ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              <ArrowUpRight className={`h-3.5 w-3.5 ${stock.change < 0 ? 'rotate-180' : ''}`} />
              {stock.change.toFixed(2)}
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'buy' | 'sell')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell" disabled={ownedQuantity <= 0}>Sell</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <Label className="text-xs text-gray-500">Price per share</Label>
                  <div className="font-medium">₦{stock.price.toFixed(2)}</div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Total cost</Label>
                  <div className="font-medium">₦{totalCost.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="rounded-md bg-blue-50 p-3">
                <div className="flex">
                  <div className="text-blue-600 text-sm">
                    <div className="font-medium">Available funds: ₦{userBalance.toFixed(2)}</div>
                    <div className="text-xs mt-1">
                      {totalCost > userBalance 
                        ? `You need ₦${(totalCost - userBalance).toFixed(2)} more to complete this purchase.`
                        : `You'll have ₦${(userBalance - totalCost).toFixed(2)} remaining after this purchase.`
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sell">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="sell-quantity">Quantity to sell</Label>
                <Input
                  id="sell-quantity"
                  type="number"
                  min="1"
                  max={ownedQuantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <Label className="text-xs text-gray-500">Shares owned</Label>
                  <div className="font-medium">{ownedQuantity}</div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Sale value</Label>
                  <div className="font-medium">₦{totalCost.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="rounded-md bg-green-50 p-3">
                <div className="flex">
                  <div className="text-green-600 text-sm">
                    <div className="font-medium">
                      Selling {quantity} share{quantity !== 1 ? 's' : ''} will add ₦{totalCost.toFixed(2)} to your balance.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-sm text-green-700">{success}</p>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          {activeTab === 'buy' ? (
            <Button 
              onClick={handleBuy}
              disabled={isProcessing || totalCost > userBalance}
            >
              {isProcessing ? 'Processing...' : 'Buy Shares'}
            </Button>
          ) : (
            <Button 
              onClick={handleSell}
              disabled={isProcessing || quantity > ownedQuantity || quantity <= 0}
            >
              {isProcessing ? 'Processing...' : 'Sell Shares'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 