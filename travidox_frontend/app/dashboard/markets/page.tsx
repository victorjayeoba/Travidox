"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { TrendingUp, TrendingDown, AlertCircle, RefreshCcw, Filter, ChevronDown, Newspaper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StockCard } from '@/components/dashboard/stock-card'
import { useNigeriaStocks } from '@/hooks/useNigeriaStocks'
import { useNigeriaNews } from '@/hooks/useNigeriaNews'
import { usePortfolio } from '@/hooks/usePortfolio'
import MockDataNotice from '@/components/dashboard/MockDataNotice'
import Link from 'next/link'

export default function MarketsPage() {
  const searchParams = useSearchParams()
  const [selectedFilter, setSelectedFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStock, setSelectedStock] = useState('')
  const [showAllStocks, setShowAllStocks] = useState(false)
  
  // Use the Nigeria stocks hook
  const { stocks, loading, error, isMockData, refresh } = useNigeriaStocks()
  
  // Use the Nigeria news hook
  const { news, loading: newsLoading, error: newsError, isMockData: isNewsMockData, refresh: refreshNews } = useNigeriaNews()
  
  // Use portfolio hook to update stock prices
  const { updatePrices } = usePortfolio()
  
  // Get URL parameters
  useEffect(() => {
    const query = searchParams.get('q')
    const stock = searchParams.get('stock')
    
    if (query) {
      setSearchQuery(query)
    }
    if (stock) {
      setSelectedStock(stock)
    }
  }, [searchParams])
  
  // Update portfolio prices when stocks data changes
  useEffect(() => {
    if (!loading && stocks.length > 0) {
      const timer = setTimeout(() => {
        updatePrices(stocks);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [stocks, loading, updatePrices]);
  
  // Handle normalized stock data
  const normalizeStock = (stock: any) => {
    const symbol = stock.symbol || stock.Symbol || '';
    const name = stock.name || stock.Name || '';
    
    return {
      symbol: symbol,
      name: name,
      price: stock.price || stock.Last || 0,
      change: stock.change || stock.Chg || 0,
    };
  }
  
  const normalizedStocks = stocks.map(normalizeStock)
  
  // Filter stocks based on search query and filters
  const filteredStocks = normalizedStocks.filter(stock => {
    // Search filter
    let matchesSearch = true;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      matchesSearch = stock.symbol.toLowerCase().includes(query) || 
                     stock.name.toLowerCase().includes(query);
    }
    
    // Selected stock filter (from URL)
    let matchesSelected = true;
    if (selectedStock) {
      matchesSelected = stock.symbol.toLowerCase() === selectedStock.toLowerCase();
    }
    
    // Performance filter
    let matchesFilter = true;
    if (selectedFilter === 'Gainers') {
      matchesFilter = stock.change > 0;
    } else if (selectedFilter === 'Losers') {
      matchesFilter = stock.change < 0;
    }
    
    return matchesSearch && matchesSelected && matchesFilter;
  })
  
  const getDisplayTitle = () => {
    if (selectedStock) {
      const stock = normalizedStocks.find(s => s.symbol.toLowerCase() === selectedStock.toLowerCase());
      return `${stock?.symbol || selectedStock} - ${stock?.name || 'Stock Details'}`;
    }
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    return 'Nigerian Markets';
  };
  
  return (
    <div className="space-y-6">
      {/* Show mock data notice if using mock data */}
      {isMockData && (
        <MockDataNotice message="Using demo stock data - external market API is unavailable" />
      )}
      
      {/* Header with title and refresh */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{getDisplayTitle()}</h1>
          {searchQuery && (
            <p className="text-gray-600 mt-1">
              Found {filteredStocks.length} result{filteredStocks.length !== 1 ? 's' : ''}
            </p>
          )}
          {selectedStock && (
            <p className="text-gray-600 mt-1">
              Detailed view for {selectedStock}
            </p>
          )}
        </div>
        <Button 
          variant="outline" 
          className="gap-2 self-start sm:self-auto"
          onClick={refresh}
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          ) : (
            <RefreshCcw size={16} />
          )}
          Refresh Data
        </Button>
      </div>
      
      {/* Error display */}
      {error && !isMockData && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          <span className="ml-3 text-lg">Loading stocks data...</span>
        </div>
      )}

      {/* Quick Filters - Only show if no specific stock selected */}
      {!loading && !selectedStock && (
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Quick Filters:</span>
              </div>
              
          <Button 
            size="sm" 
            variant="outline"
            className={`gap-1 transition-all duration-200 font-medium ${
              selectedFilter === '' 
                ? "bg-gray-800 hover:bg-gray-900 text-white border-gray-800 shadow-md" 
                : "border-gray-300 hover:bg-gray-50 text-gray-700"
            }`}
            onClick={() => setSelectedFilter('')}
          >
            All Stocks
          </Button>
          
                <Button 
                  size="sm" 
                  variant="outline" 
            className={`gap-1 transition-all duration-200 font-medium ${
              selectedFilter === 'Gainers' 
                ? "bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-md" 
                : "bg-green-50 border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400"
            }`}
                  onClick={() => setSelectedFilter(selectedFilter === 'Gainers' ? '' : 'Gainers')}
                >
                  <TrendingUp size={14} />
            Top Gainers
                </Button>
          
                <Button 
                  size="sm" 
                  variant="outline" 
            className={`gap-1 transition-all duration-200 font-medium ${
              selectedFilter === 'Losers' 
                ? "bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-md" 
                : "bg-red-50 border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400"
            }`}
                  onClick={() => setSelectedFilter(selectedFilter === 'Losers' ? '' : 'Losers')}
                >
                  <TrendingDown size={14} />
            Top Losers
                </Button>
              </div>
      )}
            
      {/* Stocks List */}
      {!loading && (
            <div className="space-y-3">
          {filteredStocks.length > 0 ? (
            <>
              {/* Display stocks - limited to 10 initially unless showing all */}
              {(showAllStocks ? filteredStocks : filteredStocks.slice(0, 10)).map((stock) => (
                <StockCard 
                  key={stock.symbol}
                  symbol={stock.symbol}
                  name={stock.name}
                  price={stock.price}
                  change={stock.change}
                />
              ))}
              
              {/* Show More Button - only show if there are more than 10 stocks and not showing all */}
              {filteredStocks.length > 10 && !showAllStocks && (
                <div className="flex justify-center pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAllStocks(true)}
                    className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 gap-2"
                  >
                    <ChevronDown className="h-4 w-4" />
                    Show More Stocks 
                  </Button>
                </div>
              )}

            </>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No stocks found' : 'No stocks match your filters'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery 
                    ? `Try searching for a different stock symbol or company name.`
                    : `Try adjusting your filters or search for specific stocks.`
                  }
                </p>
                {(searchQuery || selectedFilter) && (
                  <Button 
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedFilter('')
                      window.history.pushState({}, '', '/dashboard/markets')
                    }}
                    variant="outline"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
          )}
                </div>
              )}

      {/* Market News Section */}
      <section className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center">
            <Newspaper className="mr-2 h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
            Market News
          </h2>
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
        
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            {newsLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin h-6 w-6 border-3 border-primary border-t-transparent rounded-full mr-2" />
                <span>Loading news...</span>
              </div>
            ) : news.length > 0 ? (
              <div className="space-y-4">
                {news.slice(0, 5).map((item, index) => (
                  <article key={index} className={index < 4 ? "pb-4 border-b border-gray-100" : ""}>
                    <Badge variant="outline" className="mb-2">
                      {item.category}
                    </Badge>
                    <h3 className="font-medium mb-1 hover:text-blue-600 transition-colors">
                      <Link href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </Link>
                    </h3>
                    <div className="flex justify-between items-center">
                      <time className="text-xs text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </time>
                      <span className="text-xs text-gray-500">{item.source}</span>
                    </div>
                  </article>
                ))}
                
                {/* View More News Button */}
                {news.length > 5 && (
                  <div className="pt-4 text-center">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/news">
                        View All News ({news.length} articles)
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Newspaper className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p>No news articles available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

    </div>
  )
} 