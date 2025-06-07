"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown, Filter } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StockCard } from '@/components/dashboard/stock-card'
import { Badge } from '@/components/ui/badge'
import { useNigeriaStocks } from '@/hooks/useNigeriaStocks'

// Nigerian stocks
const nigerianStocks = [
  { symbol: 'DANGCEM', name: 'Dangote Cement Plc', price: 320.70, change: 5.30, sector: 'Industrial' },
  { symbol: 'MTNN', name: 'MTN Nigeria Communications Plc', price: 214.90, change: 3.40, sector: 'Telecommunications' },
  { symbol: 'GTCO', name: 'Guaranty Trust Holding Co. Plc', price: 28.50, change: 0.90, sector: 'Financial Services' },
  { symbol: 'ZENITHBANK', name: 'Zenith Bank Plc', price: 25.85, change: -0.45, sector: 'Financial Services' },
  { symbol: 'AIRTELAFRI', name: 'Airtel Africa Plc', price: 1650.00, change: 50.00, sector: 'Telecommunications' },
]

export default function MarketsPage() {
  const [selectedSector, setSelectedSector] = useState('All')
  const [selectedFilter, setSelectedFilter] = useState('')
  
  const filteredStocks = nigerianStocks.filter(stock => 
    (selectedSector === 'All' || stock.sector === selectedSector) &&
    (selectedFilter === '' || 
     (selectedFilter === 'Gainers' && stock.change > 0) ||
     (selectedFilter === 'Losers' && stock.change < 0))
  )
  
  return (
    <div className="space-y-6">
      {/* <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Nigerian Markets</h1>
        <Button variant="outline" className="gap-2">
          <Filter size={16} />
          Filter
        </Button>
      </div> */}

      {/* Filters */}
      <div className="space-y-4">
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Badge 
                variant="outline" 
                className={selectedSector === 'All' ? "bg-gray-100" : ""}
                onClick={() => setSelectedSector('All')}
                style={{ cursor: 'pointer' }}
              >
                All
              </Badge>
              <Badge 
                variant="outline"
                className={selectedSector === 'Financial Services' ? "bg-gray-100" : ""}
                onClick={() => setSelectedSector('Financial Services')}
                style={{ cursor: 'pointer' }}
              >
                Financial
              </Badge>
              <Badge 
                variant="outline"
                className={selectedSector === 'Telecommunications' ? "bg-gray-100" : ""}
                onClick={() => setSelectedSector('Telecommunications')}
                style={{ cursor: 'pointer' }}
              >
                Telecom
              </Badge>
              <Badge 
                variant="outline"
                className={selectedSector === 'Industrial' ? "bg-gray-100" : ""}
                onClick={() => setSelectedSector('Industrial')}
                style={{ cursor: 'pointer' }}
              >
                Industrial
              </Badge>
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