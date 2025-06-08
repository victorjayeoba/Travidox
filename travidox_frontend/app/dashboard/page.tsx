"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { BarChart3, TrendingUp, Wallet, ArrowUpRight, Plus, RefreshCcw } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'
import { useUserProfile } from '@/hooks/useUserProfile'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useUserPortfolioBalance } from '@/hooks/useUserPortfolioBalance'
import { useNigeriaStocks } from '@/hooks/useNigeriaStocks'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StockCard } from '@/components/dashboard/stock-card'
import { Progress } from '@/components/ui/progress'
import { StockPurchaseButton } from '@/components/dashboard/StockPurchaseButton'
import MockDataNotice from '@/components/dashboard/MockDataNotice'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { profile } = useUserProfile()
  const { 
    portfolio, 
    loading: portfolioLoading, 
    error: portfolioError,
    getTotalValue,
    getTotalChange,
    getPercentChange,
    updatePrices
  } = useUserPortfolioBalance()
  const { stocks, loading: stocksLoading, isMockData } = useNigeriaStocks()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  
  // Update portfolio prices with the latest stock data
  useEffect(() => {
    if (!stocksLoading && stocks.length > 0 && !isRefreshing) {
      // Add a small delay to prevent rapid consecutive updates
      const timer = setTimeout(() => {
        updatePrices(stocks);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [stocks, stocksLoading, updatePrices, isRefreshing]);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.push('/login')
    }
    
    // If this is first login, redirect to overview
    if (user && !localStorage.getItem('hasVisitedDashboard')) {
      localStorage.setItem('hasVisitedDashboard', 'true')
      router.push('/dashboard/overview')
    }
  }, [user, authLoading, router])

  // Handler for manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    // In a real implementation, you would fetch the latest data from your API
    // For now, we'll just simulate a delay
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  if (authLoading || portfolioLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }
  
  // Get portfolio data
  const totalValue = getTotalValue()
  const totalChange = getTotalChange()
  const percentChange = getPercentChange()
  
  // Get user balance from profile
  const userBalance = profile?.balance || 0
  
  // Portfolio is empty state
  const isPortfolioEmpty = portfolio.assets.length === 0
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Portfolio</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            ) : (
              <RefreshCcw size={16} />
            )}
            Refresh
          </Button>
          <Button onClick={() => router.push('/dashboard/overview')}>
            View Dashboard
          </Button>
        </div>
      </div>
      
      {/* Show mock data notice if using mock data */}
      {isMockData && (
        <MockDataNotice message="Using demo stock data - external market API is unavailable" />
      )}
      
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{totalValue.toFixed(2)}
            </div>
            <div className={`flex items-center text-sm mt-1 ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <ArrowUpRight className={`h-4 w-4 ${totalChange < 0 ? 'rotate-180' : ''}`} />
              <span>₦{Math.abs(totalChange).toFixed(2)} ({percentChange.toFixed(2)}%)</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">Performance</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <BarChart3 className="h-9 w-9 text-blue-500 mr-3" />
            <div>
              <div className="text-2xl font-bold">
                {totalChange > 0 ? 'Good' : totalChange < 0 ? 'Down' : 'Neutral'}
              </div>
              <div className="text-sm text-gray-500">
                {totalChange > 0 ? 'Outperforming the market' : 
                 totalChange < 0 ? 'Underperforming the market' : 
                 'Holding steady'}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">Available Cash</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Wallet className="h-9 w-9 text-green-500 mr-3" />
            <div>
              <div className="text-2xl font-bold">₦{userBalance.toFixed(2)}</div>
              <div className="text-sm text-gray-500">Available to invest</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Empty portfolio state */}
      {isPortfolioEmpty && (
        <Card className="p-8 text-center">
          <div className="mb-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-gray-500" />
            </div>
          </div>
          <CardTitle className="mb-2">Your portfolio is empty</CardTitle>
          <CardDescription className="mb-6">
            Start building your portfolio by purchasing stocks from the Nigerian market.
          </CardDescription>
          <Button onClick={() => router.push('/dashboard/markets')} className="bg-green-600 hover:bg-green-700">
            Browse Stocks
          </Button>
        </Card>
      )}
      
      {/* Top Performers */}
      {!isPortfolioEmpty && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
              Top Performers
            </h2>
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/markets')}>
              View All Assets
            </Button>
          </div>
          
          <div className="space-y-4">
            {portfolio.assets
              .sort((a, b) => {
                const aChange = (a.currentPrice - a.averageBuyPrice) / a.averageBuyPrice;
                const bChange = (b.currentPrice - b.averageBuyPrice) / b.averageBuyPrice;
                return bChange - aChange;
              })
              .slice(0, 3)
              .map((asset) => {
                const change = asset.currentPrice - asset.averageBuyPrice;
                return (
                  <Card key={asset.symbol} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <StockCard 
                          symbol={asset.symbol}
                          name={asset.name}
                          price={asset.currentPrice}
                          change={change}
                        />
                      </div>
                      <div className="px-4 pb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">Shares Owned</span>
                          <span className="font-medium">{asset.quantity}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">Value</span>
                          <span className="font-medium">₦{(asset.quantity * asset.currentPrice).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">Allocation</span>
                          <span className="font-medium">
                            {((asset.quantity * asset.currentPrice / totalValue) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={((asset.quantity * asset.currentPrice / totalValue) * 100)} 
                          className="h-1.5" 
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            
            <StockPurchaseButton 
              variant="outline" 
              className="w-full" 
              size="lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Asset
            </StockPurchaseButton>
          </div>
        </div>
      )}
      
      {/* Asset Allocation */}
      {!isPortfolioEmpty && portfolio.assets.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>
              Distribution of your investment portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-14 flex items-center space-x-1">
              {portfolio.assets.map((asset) => {
                const allocation = (asset.quantity * asset.currentPrice / totalValue) * 100;
                return (
                  <div 
                    key={asset.symbol}
                    className="h-full rounded-sm"
                    style={{ 
                      width: `${allocation}%`,
                      backgroundColor: getRandomColor(asset.symbol)
                    }}
                    title={`${asset.symbol}: ${allocation.toFixed(1)}%`}
                  />
                );
              })}
            </div>
            
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {portfolio.assets.map((asset) => {
                const allocation = (asset.quantity * asset.currentPrice / totalValue) * 100;
                return (
                  <div key={asset.symbol} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: getRandomColor(asset.symbol) }}
                    />
                    <div className="text-sm">
                      {asset.symbol} <span className="text-gray-500">{allocation.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Transaction History */}
      {portfolio.transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your latest stock purchases and sales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolio.transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center pb-3 border-b">
                  <div>
                    <div className="font-medium flex items-center">
                      <span className={transaction.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                        {transaction.type === 'buy' ? 'Bought' : 'Sold'}
                      </span>
                      <span className="ml-1">{transaction.quantity} {transaction.symbol}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₦{transaction.total.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">
                      ₦{transaction.price.toFixed(2)} per share
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => router.push('/dashboard/learn')}
        >
          Earn XP
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          disabled={totalValue <= 0}
          onClick={() => {
            // In a real implementation, you would show a withdrawal modal
            alert('Withdrawal functionality would be implemented here')
          }}
        >
          Withdraw
        </Button>
        <StockPurchaseButton
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          Trade
        </StockPurchaseButton>
      </div>
    </div>
  )
}

// Helper function to generate consistent colors based on symbol
function getRandomColor(symbol: string) {
  const colors = [
    '#4F46E5', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'
  ]
  
  // Use the sum of character codes as a hash
  const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
} 