"use client"

import React, { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { BarChart3, TrendingUp, Wallet, ArrowUpRight, Plus } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StockCard } from '@/components/dashboard/stock-card'
import { Progress } from '@/components/ui/progress'
import { useUserPortfolioBalance } from '@/hooks/useUserPortfolioBalance'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useNigeriaStocks } from '@/hooks/useNigeriaStocks'
import { useState } from 'react'

// Mock portfolio data
const portfolioAssets = [
  { symbol: 'AAPL', name: 'Apple Inc.', value: 850.25, change: 32.45, allocation: 21 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', value: 1104.37, change: 45.88, allocation: 27 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', value: 650.82, change: 12.75, allocation: 16 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', value: 745.41, change: -18.32, allocation: 18 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', value: 420.67, change: -35.21, allocation: 10 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', value: 328.19, change: 78.92, allocation: 8 }
]

function getRandomColor(key: string) {
  // Simple hash to color mapping for demo purposes
  const colors = [
    "#34d399", "#60a5fa", "#fbbf24", "#f87171", "#a78bfa", "#f472b6", "#38bdf8"
  ];
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

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
  
  // Calculate totals
  const totalValue = portfolioAssets.reduce((total, asset) => total + asset.value, 0)
  const totalChange = portfolioAssets.reduce((total, asset) => total + asset.change, 0)
  const percentChange = totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Portfolio</h1>
        <Button onClick={() => router.push('/dashboard/overview')}>
          View Dashboard
        </Button>
      </div>
      
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalValue.toFixed(2)}
            </div>
            <div className={`flex items-center text-sm mt-1 ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <ArrowUpRight className={`h-4 w-4 ${totalChange < 0 ? 'rotate-180' : ''}`} />
              <span>${Math.abs(totalChange).toFixed(2)} ({percentChange.toFixed(2)}%)</span>
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
              <div className="text-2xl font-bold">Good</div>
              <div className="text-sm text-gray-500">Outperforming the market</div>
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
              <div className="text-2xl font-bold">$245.32</div>
              <div className="text-sm text-gray-500">Available to invest</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Performers */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
            Top Performers
          </h2>
          <Button variant="outline" size="sm">
            View All Assets
          </Button>
        </div>
        
        <div className="space-y-4">
          {portfolioAssets
            .sort((a, b) => b.change - a.change)
            .slice(0, 3)
            .map((asset) => (
              <Card key={asset.symbol} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <StockCard 
                      symbol={asset.symbol}
                      name={asset.name}
                      price={asset.value / (asset.allocation / 100)}
                      change={asset.change}
                    />
                  </div>
                  <div className="px-4 pb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Allocation</span>
                      <span className="font-medium">{asset.allocation}%</span>
                    </div>
                    <Progress value={asset.allocation} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>
            ))
          }
          
          <Button variant="outline" className="w-full" size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Add New Asset
          </Button>
        </div>
      </div>
      
      {/* Asset Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
          <CardDescription>
            Distribution of your investment portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-14 flex items-center space-x-1">
            {portfolioAssets.map((asset) => (
              <div 
                key={asset.symbol}
                className="h-full rounded-sm"
                style={{ 
                  width: `${asset.allocation}%`,
                  backgroundColor: getRandomColor(asset.symbol)
                }}
                title={`${asset.symbol}: ${asset.allocation}%`}
              />
            ))}
          </div>
          
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {portfolioAssets.map((asset) => (
              <div key={asset.symbol} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: getRandomColor(asset.symbol) }}
                />
                <div className="text-sm">{asset.symbol} <span className="text-gray-500">{asset.allocation}%</span></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" className="flex-1">Deposit Funds</Button>
        <Button variant="outline" className="flex-1">Withdraw</Button>
        <Button className="flex-1 bg-green-600 hover:bg-green-700">Trade</Button>
      </div>
    </div>
  )
} 