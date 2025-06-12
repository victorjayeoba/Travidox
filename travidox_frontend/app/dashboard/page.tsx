"use client"

import React, { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  Plus, 
  ShoppingCart, 
  LineChart,
  PieChart,
  Activity,
  Target,
  BookOpen,
  Award,
  Shield,
  Users,
  Zap,
  ArrowDown,
  ArrowUp,
  DollarSign,
  Percent,
  RefreshCw
} from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StockCard } from '@/components/dashboard/stock-card'
import { Progress } from '@/components/ui/progress'
import { useUserPortfolioBalance } from '@/hooks/useUserPortfolioBalance'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useNigeriaStocks, STOCK_PRICES_UPDATE_EVENT } from '@/hooks/useNigeriaStocks'
import { usePortfolio, PORTFOLIO_UPDATE_EVENT } from '@/hooks/usePortfolio'
import { StockPurchaseButton } from '@/components/dashboard/StockPurchaseButton'

function getRandomColor(key: string) {
  const colors = [
    "bg-gradient-to-r from-blue-500 to-purple-600",
    "bg-gradient-to-r from-green-500 to-teal-600", 
    "bg-gradient-to-r from-yellow-500 to-orange-600",
    "bg-gradient-to-r from-pink-500 to-rose-600",
    "bg-gradient-to-r from-indigo-500 to-blue-600",
    "bg-gradient-to-r from-purple-500 to-pink-600",
    "bg-gradient-to-r from-teal-500 to-cyan-600"
  ];
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Component interfaces
interface QuickActionCardProps {
  icon: React.ComponentType<{ size: number }>
  title: string
  description: string
  onClick: () => void
  color: string
}

interface MetricCardProps {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ComponentType<{ size: number }>
  color: string
}

// Quick Action Card Component
const QuickActionCard: React.FC<QuickActionCardProps> = ({ icon: Icon, title, description, onClick, color }) => (
  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80" onClick={onClick}>
    <CardContent className="p-6">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{title}</h3>
          <p className="text-xs lg:text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
      </div>
    </CardContent>
  </Card>
)

// Metric Card Component
const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, icon: Icon, color }) => (
  <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-gray-900">{value}</p>
          <div className={`flex items-center mt-2 text-sm ${
            changeType === 'positive' ? 'text-green-600' : 
            changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {changeType === 'positive' ? <ArrowUp size={16} /> : 
             changeType === 'negative' ? <ArrowDown size={16} /> : null}
            <span className="ml-1">{change}</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white`}>
          <Icon size={24} />
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { profile, addXpAndUpdateBalance } = useUserProfile()
  const { 
    portfolio, 
    loading: portfolioLoading, 
    error: portfolioError,
    getTotalValue,
    getTotalChange,
    getPercentChange,
    updatePrices,
    sellStock
  } = useUserPortfolioBalance()
  const { stocks, loading: stocksLoading, isMockData, refresh: refreshStocks, lastUpdated } = useNigeriaStocks()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showRefreshIndicator, setShowRefreshIndicator] = useState(false)
  const router = useRouter()
  
  // Handle refresh of all data
  const handleRefresh = async () => {
    setIsRefreshing(true)
    setShowRefreshIndicator(true)
    
    try {
      // Refresh stock data (this will trigger portfolio updates automatically)
      await refreshStocks()
      
      // Hide indicator after a short delay to show it worked
      setTimeout(() => {
        setShowRefreshIndicator(false)
      }, 1000)
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Listen for real-time updates and show refresh indicator
  useEffect(() => {
    const handlePortfolioUpdate = () => {
      setShowRefreshIndicator(true)
      setTimeout(() => setShowRefreshIndicator(false), 1000)
    }

    const handleStockUpdate = () => {
      setShowRefreshIndicator(true)
      setTimeout(() => setShowRefreshIndicator(false), 1000)
    }

    window.addEventListener(PORTFOLIO_UPDATE_EVENT, handlePortfolioUpdate)
    window.addEventListener(STOCK_PRICES_UPDATE_EVENT, handleStockUpdate)
    
    return () => {
      window.removeEventListener(PORTFOLIO_UPDATE_EVENT, handlePortfolioUpdate)
      window.removeEventListener(STOCK_PRICES_UPDATE_EVENT, handleStockUpdate)
    }
  }, [])

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

  if (authLoading || portfolioLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-green-300 opacity-20"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }
  
  // Check if portfolio is empty
  const hasPortfolio = portfolio.assets.length > 0
  
  // Calculate totals from actual portfolio data
  const totalValue = getTotalValue()
  const totalChange = getTotalChange()
  const percentChange = getPercentChange()
  
  // Calculate asset allocations
  const calculateAllocations = () => {
    if (portfolio.assets.length === 0) return [];
    
    const total = getTotalValue();
    return portfolio.assets.map(asset => ({
      symbol: asset.symbol,
      name: asset.name,
      value: asset.quantity * asset.currentPrice,
      change: (asset.currentPrice - asset.averageBuyPrice) * asset.quantity,
      allocation: Math.round((asset.quantity * asset.currentPrice / total) * 100)
    }));
  };
  
  const portfolioWithAllocations = calculateAllocations();
  
  // Find recommended stock if user has no portfolio - pick a high-performing stock
  const getRecommendedStock = () => {
    if (stocks.length === 0) return null;
    
    // Normalize stock data and find a good performing stock
    const normalizedStocks = stocks.map(stock => ({
      symbol: stock.symbol || stock.Symbol || '',
      name: stock.name || stock.Name || '',
      price: stock.price || stock.Last || 0,
      change: stock.change || stock.Chg || 0,
    })).filter(stock => stock.price > 0); // Filter out stocks with zero price
    
    if (normalizedStocks.length === 0) return null;
    
    // Find a stock with positive change, or fallback to any stock with valid price
    const gainers = normalizedStocks.filter(stock => stock.change > 0);
    const validStocks = gainers.length > 0 ? gainers : normalizedStocks;
    
    // Return a random performing stock from the top choices
    return validStocks[Math.floor(Math.random() * Math.min(5, validStocks.length))];
  };
  
  const recommendedStock = getRecommendedStock();

  // Quick actions data
  const quickActions = [
          {
        icon: TrendingUp,
        title: "Trade Stocks",
        description: "Buy and sell Nigerian stocks",
        onClick: () => router.push('/dashboard/markets'),
        color: "bg-gradient-to-r from-green-500 to-emerald-600"
      },
    {
      icon: BookOpen,
      title: "Learn & Earn",
      description: "Complete courses to earn XP",
      onClick: () => router.push('/dashboard/learn'),
      color: "bg-gradient-to-r from-blue-500 to-indigo-600"
    },
    {
      icon: Award,
      title: "Certifications",
      description: "Get certified in trading",
      onClick: () => router.push('/dashboard/certifications'),
      color: "bg-gradient-to-r from-purple-500 to-pink-600"
    },
    {
      icon: Zap,
      title: "Trading Bot",
      description: "Automate your trading",
      onClick: () => router.push('/dashboard/trading-bot'),
      color: "bg-gradient-to-r from-yellow-500 to-orange-600"
    }
  ];
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl lg:text-4xl font-bold">
                  Welcome back, {user?.displayName?.split(' ')[0] || 'Trader'}! 👋
                </h1>
                {showRefreshIndicator && (
                  <div className="bg-white/20 rounded-full p-2">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  </div>
                )}
              </div>
              <p className="text-green-100 text-base lg:text-lg">
                Ready to grow your portfolio today?
              </p>
              {lastUpdated && (
                <p className="text-green-200 text-sm mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <Button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-semibold transition-all duration-300"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Updating...' : 'Refresh'}
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/markets')}
                className="bg-white text-green-700 hover:bg-gray-50 font-semibold transition-all duration-300"
              >
                <Plus className="mr-2 h-4 w-4" />
                Start Trading
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <MetricCard
          title="Portfolio Value"
          value={`₦${totalValue.toFixed(2)}`}
          change={`₦${Math.abs(totalChange).toFixed(2)} (${percentChange.toFixed(2)}%)`}
          changeType={totalChange >= 0 ? 'positive' : 'negative'}
          icon={DollarSign}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <MetricCard
          title="Available Cash"
          value={`₦${(profile?.balance || 0).toFixed(2)}`}
          change="Ready to invest"
          changeType="neutral"
          icon={Wallet}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <MetricCard
          title="Total Assets"
          value={portfolio.assets.length.toString()}
          change={hasPortfolio ? "Diversified" : "Start investing"}
          changeType={hasPortfolio ? 'positive' : 'neutral'}
          icon={PieChart}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <MetricCard
          title="XP Earned"
          value={`${(profile?.xp || 0).toFixed(0)}`}
          change="Keep learning!"
          changeType="positive"
          icon={Award}
          color="bg-gradient-to-r from-yellow-500 to-orange-600"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </div>

      {hasPortfolio ? (
        <>
          {/* Top Performers */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-0 flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
                Top Performers
              </h2>
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard/markets')}
                className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80"
              >
                View All Assets
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {portfolioWithAllocations
                .sort((a, b) => b.change - a.change)
                .slice(0, 3)
                .map((asset, index) => (
                  <Card key={asset.symbol} className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <StockCard 
                          symbol={asset.symbol}
                          name={asset.name}
                          price={asset.value}
                          change={asset.change}
                        />
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Portfolio Allocation</span>
                            <span className="font-semibold text-gray-900">{asset.allocation}%</span>
                          </div>
                          <Progress 
                            value={asset.allocation} 
                            className="h-2" 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              }
            </div>
            
            <div className="mt-6">
              <Button 
                variant="outline" 
                className="w-full bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80" 
                size="lg" 
                onClick={() => router.push('/dashboard/markets')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Investment
              </Button>
            </div>
          </div>
          
          {/* Asset Allocation Chart */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-blue-600" />
                Asset Allocation
              </CardTitle>
              <CardDescription>
                Distribution of your investment portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 flex items-center space-x-1 rounded-full overflow-hidden bg-gray-100">
                  {portfolioWithAllocations.map((asset, index) => (
                    <div 
                      key={asset.symbol}
                      className={`h-full ${getRandomColor(asset.symbol)}`}
                      style={{ width: `${asset.allocation}%` }}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {portfolioWithAllocations.map((asset, index) => (
                    <div key={asset.symbol} className="flex items-center space-x-2">
                      <div 
                        className={`w-3 h-3 rounded-full ${getRandomColor(asset.symbol)}`}
                      />
                      <span className="text-sm text-gray-600">{asset.symbol}</span>
                      <span className="text-sm font-semibold text-gray-900 ml-auto">{asset.allocation}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Getting Started Section */
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
          <CardContent className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Start Your Investment Journey</h3>
              <p className="text-gray-600 mb-6">
                You haven't made any investments yet. Explore Nigerian stocks and start building your portfolio today.
              </p>
              {recommendedStock && (
                <div className="bg-white rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Recommended for you:</p>
                  <StockCard 
                    symbol={recommendedStock.symbol || ''}
                    name={recommendedStock.name || ''}
                    price={recommendedStock.price || 0}
                    change={recommendedStock.change || 0}
                  />
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => router.push('/dashboard/learn')}
                  variant="outline"
                  className="bg-white/80 hover:bg-white"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Learn First
                </Button>
                <Button 
                  onClick={() => router.push('/dashboard/markets')}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Explore Markets
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 