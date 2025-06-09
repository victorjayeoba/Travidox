"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown, Filter, AlertCircle, RefreshCcw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StockCard } from '@/components/dashboard/stock-card'
import { Badge } from '@/components/ui/badge'
import { useNigeriaStocks } from '@/hooks/useNigeriaStocks'
import { usePortfolio } from '@/hooks/usePortfolio'
import MockDataNotice from '@/components/dashboard/MockDataNotice'

export default function MarketsPage() {
  const [selectedSector, setSelectedSector] = useState('All')
  const [selectedFilter, setSelectedFilter] = useState('')
  
  // Use the Nigeria stocks hook
  const { stocks, loading, error, isMockData, refresh } = useNigeriaStocks()
  
  // Use portfolio hook to update stock prices
  const { updatePrices } = usePortfolio()
  
  // Update portfolio prices when stocks data changes
  useEffect(() => {
    if (!loading && stocks.length > 0) {
      // Add a small delay to prevent rapid consecutive updates
      const timer = setTimeout(() => {
        updatePrices(stocks);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [stocks, loading, updatePrices]);
  
  // Handle normalized stock data
  const normalizeStock = (stock: any) => ({
    symbol: stock.symbol || stock.Symbol || '',
    name: stock.name || stock.Name || '',
    price: stock.price || stock.Last || 0,
    change: stock.change || stock.Chg || 0,
    sector: stock.sector || stock.PairType || 'Uncategorized'
  })
  
  const normalizedStocks = stocks.map(normalizeStock)
  
  const filteredStocks = normalizedStocks.filter(stock => 
    (selectedSector === 'All' || stock.sector === selectedSector) &&
    (selectedFilter === '' || 
     (selectedFilter === 'Gainers' && stock.change > 0) ||
     (selectedFilter === 'Losers' && stock.change < 0))
  )
  
  // Extract unique sectors for filters
  const sectors = ['All', ...Array.from(new Set(normalizedStocks.map(stock => stock.sector)))]
  
  return (
    <div className="space-y-6">
      {/* Show mock data notice if using mock data */}
      {isMockData && (
        <MockDataNotice message="Using demo stock data - external market API is unavailable" />
      )}
      
      {/* Refresh button and error display */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Nigerian Markets</h1>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={refresh}
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          ) : (
            <RefreshCcw size={16} />
          )}
          Refresh
        </Button>
      </div>
      
      {error && !isMockData && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
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

      {/* Filters */}
      {!loading && (
        <div className="space-y-4">
          <div className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                {sectors.map(sector => (
                  <Badge 
                    key={sector}
                    variant="outline" 
                    className={selectedSector === sector ? "bg-gray-100" : ""}
                    onClick={() => setSelectedSector(sector)}
                    style={{ cursor: 'pointer' }}
                  >
                    {sector}
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className={`gap-1 ${selectedFilter === 'Gainers' ? 'bg-gray-100' : ''}`}
                  onClick={() => setSelectedFilter(selectedFilter === 'Gainers' ? '' : 'Gainers')}
                >
                  <TrendingUp size={14} />
                  Gainers
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className={`gap-1 ${selectedFilter === 'Losers' ? 'bg-gray-100' : ''}`}
                  onClick={() => setSelectedFilter(selectedFilter === 'Losers' ? '' : 'Losers')}
                >
                  <TrendingDown size={14} />
                  Losers
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {filteredStocks.map((stock) => (
                <StockCard 
                  key={stock.symbol}
                  symbol={stock.symbol}
                  name={stock.name}
                  price={stock.price}
                  change={stock.change}
                />
              ))}
              
              {filteredStocks.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No Nigerian stocks found matching your filters.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Market Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
          <CardDescription>
            Today's performance of major market indices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <div className="font-medium">NGX ASI</div>
                <div className="text-sm text-gray-500">Nigeria</div>
              </div>
              <div className="text-right">
                <div className="font-medium">64,273.12</div>
                <div className="text-sm text-red-500">-0.34%</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <div className="font-medium">NGX 30</div>
                <div className="text-sm text-gray-500">Nigeria</div>
              </div>
              <div className="text-right">
                <div className="font-medium">2,487.54</div>
                <div className="text-sm text-green-500">+0.22%</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <div className="font-medium">NGX Banking</div>
                <div className="text-sm text-gray-500">Nigeria</div>
              </div>
              <div className="text-right">
                <div className="font-medium">571.83</div>
                <div className="text-sm text-green-500">+1.04%</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">NGX Industrial</div>
                <div className="text-sm text-gray-500">Nigeria</div>
              </div>
              <div className="text-right">
                <div className="font-medium">2,145.27</div>
                <div className="text-sm text-green-500">+0.15%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 