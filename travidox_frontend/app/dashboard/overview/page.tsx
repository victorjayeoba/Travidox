"use client"

import { useAuth } from '@/components/auth/auth-provider'
import { CardSection } from '@/components/dashboard/card-section'
import { StockCard } from '@/components/dashboard/stock-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useNigeriaStocks } from '@/hooks/useNigeriaStocks'
import { useNigeriaNews } from '@/hooks/useNigeriaNews'
import { useEffect, useState } from 'react'
import { useUserProfile } from '@/hooks/useUserProfile'
import { RefreshCcw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MockDataNotice from '@/components/dashboard/MockDataNotice'

// Removed mock data as we'll use real data from API

export default function DashboardOverviewPage() {
  const { user } = useAuth()
  const { stocks, loading: stocksLoading } = useNigeriaStocks()
  const { news, loading: newsLoading, error: newsError, isMockData: isNewsMockData, refresh: refreshNews } = useNigeriaNews()
  const [topGainers, setTopGainers] = useState<any[]>([])
  const { profile } = useUserProfile()
  
  // Process stocks data to find top gainers
  useEffect(() => {
    if (stocks && stocks.length > 0) {
      // Map stocks to a consistent format
      const normalizedStocks = stocks.map(stock => ({
        symbol: stock.symbol || stock.Symbol || '',
        name: stock.name || stock.Name || '',
        price: stock.price || stock.Last || 0,
        change: stock.change || stock.Chg || 0,
        logo: null // API doesn't provide logos
      }));
      
      // Sort by change in descending order to get top gainers
      const sorted = [...normalizedStocks].sort((a, b) => b.change - a.change);
      
      // Take top 3 gainers
      setTopGainers(sorted.slice(0, 3));
    }
  }, [stocks]);

  // Format relative time for news items
  const getRelativeTime = (dateString: string) => {
    try {
      const now = new Date();
      const date = new Date(dateString);
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (isNaN(diffInHours)) return dateString; // Fallback to the original string
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      if (diffInHours < 48) return 'Yesterday';
      if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
      
      return dateString; // For older dates, use the original date string
    } catch (error) {
      return dateString; // In case of parsing errors, return the original string
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
      
      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardSection
          title="Earn by Travidox"
          description="Put your money to work and earn interest without guesswork"
          backgroundColor="bg-blue-600"
          textColor="text-white"
          linkUrl="/dashboard/earn"
          image="/images/icons/earn.svg"
        />
        
        <CardSection
          title="Redeem Gift Card"
          description="Generate the perfect amount of text to fit the layer's frame."
          backgroundColor="bg-green-100"
          textColor="text-gray-800"
          linkUrl="/dashboard/gift-cards"
          image="/images/icons/gift-card.svg"
        />
        
        <CardSection
          title="Create a US Portfolio"
          description="Fund your account with a plan to create a rewarding portfolio"
          backgroundColor="bg-green-700"
          textColor="text-white"
          linkUrl="/dashboard/portfolio/create"
          image="/images/icons/portfolio.svg"
        />
      </div>

      {/* Top Gainers Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Top Gainers</h2>
          <Link href="/dashboard/markets" className="text-green-600 hover:underline text-sm flex items-center">
            View all Top Stocks
          </Link>
        </div>
        
        <div className="space-y-3">
          {stocksLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin h-6 w-6 border-3 border-primary border-t-transparent rounded-full mr-2" />
              <span>Loading top stocks...</span>
            </div>
          ) : topGainers.length > 0 ? (
            topGainers.map((stock) => (
            <StockCard 
              key={stock.symbol}
              symbol={stock.symbol}
              name={stock.name}
              price={stock.price}
              change={stock.change}
              logo={stock.logo}
            />
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No stock data available
            </div>
          )}
        </div>
      </section>

      {/* Market News */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Market News</h2>
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
            onClick={refreshNews}
            disabled={newsLoading}
          >
            {newsLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            ) : (
              <RefreshCcw size={14} />
            )}
            Refresh
          </Button>
        </div>
        
        {/* Show mock data notice if using mock data */}
        {isNewsMockData && (
          <MockDataNotice message="Using demo news data - external news API is unavailable" />
        )}
        
        {/* Error display */}
        {newsError && !isNewsMockData && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {newsError}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Card>
          <CardContent className="p-5">
            {newsLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin h-6 w-6 border-3 border-primary border-t-transparent rounded-full mr-2" />
                <span>Loading news...</span>
              </div>
            ) : news.length > 0 ? (
              <div className="space-y-4">
                {news.slice(0, 3).map((item, index) => (
                  <article key={index} className={index < news.length - 1 ? "pb-4 border-b border-gray-100" : ""}>
                    <Badge variant="outline" className="mb-2">
                      {item.category}
                    </Badge>
                    <h3 className="font-medium mb-1 hover:text-green-600">
                      <Link href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </Link>
                    </h3>
                    <div className="flex justify-between items-center">
                      <time className="text-xs text-gray-500">{getRelativeTime(item.date)}</time>
                      <span className="text-xs text-gray-500">{item.source}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No news articles available
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Portfolio Summary */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-3xl font-bold text-gray-900">₦{(profile?.balance || 0).toFixed(2)}</div>
              <div className="text-sm text-gray-500">Start investing to build your portfolio</div>
              <div className="pt-4">
                <Link href="/dashboard/portfolio/create">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer px-3 py-1.5">
                    Create Portfolio
                  </Badge>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center flex-shrink-0 text-sm font-medium">1</div>
                <div>
                  <div className="font-medium">Complete your profile</div>
                  <div className="text-sm text-gray-500">Add your personal information and preferences</div>
                </div>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center flex-shrink-0 text-sm font-medium">2</div>
                <div>
                  <div className="font-medium">Fund your account</div>
                  <div className="text-sm text-gray-500">Add funds to start investing</div>
                </div>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center flex-shrink-0 text-sm font-medium">3</div>
                <div>
                  <div className="font-medium">Make your first investment</div>
                  <div className="text-sm text-gray-500">Choose stocks or explore automated options</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  )
} 