"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TradingForm } from '@/components/trading-bot/trading-form'
import { PositionsTable } from '@/components/trading-bot/positions-table'
import { HistoryTable } from '@/components/trading-bot/history-table'
import { AccountPanel } from '@/components/trading-bot/account-panel'
import { PriceTicker } from '@/components/trading-bot/price-ticker'
import { TradingViewChart } from '@/components/trading-bot/tradingview-chart'
import { TradingSignalComponent } from '@/components/trading-bot/trading-signal'
import { DashboardHeader } from '@/components/dashboard-header'
import { DashboardShell } from '@/components/dashboard-shell'
import { useAuth } from '@/hooks/useAuth'
import { useTradingAccount } from '@/hooks/useTradingAccount'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, BarChart3, DollarSign, Zap } from 'lucide-react'

export default function TradingBotPage() {
  const { user } = useAuth()
  const { refreshData } = useTradingAccount()
  const [activeTab, setActiveTab] = useState('positions')
  const [chartTab, setChartTab] = useState('trading')
  
  // Handle order placed event
  const handleOrderPlaced = () => {
    // Refresh data to show new position
    refreshData()
    
    // Switch to positions tab
    setActiveTab('positions')
  }
  
  // Handle place order from trading signal
  const handlePlaceOrderFromSignal = async (orderType: 'BUY' | 'SELL', symbol: string) => {
    // Refresh positions after order is placed
    refreshData()
    
    // Set a timeout to refresh again after a short delay to ensure the position is loaded
    setTimeout(() => {
      refreshData()
    }, 2000)
  }
  
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Trading Bot"
        description="Virtual forex trading with real-time market data"
      />
      
      <Tabs value={chartTab} onValueChange={setChartTab} className="mb-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
          <TabsTrigger value="signals" className="flex items-center">
            <Zap className="mr-2 h-4 w-4" />
            Signals
          </TabsTrigger>
          <TabsTrigger value="trading" className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4" />
            Trading
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center">
            <LineChart className="mr-2 h-4 w-4" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="market" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Market
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="signals" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <TradingSignalComponent 
              defaultSymbol="EURUSD" 
              defaultInterval="1h"
              onPlaceOrder={handlePlaceOrderFromSignal}
            />
            <Card>
              <CardHeader>
                <CardTitle>Pivot Point Trading Signals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">
                  This trading signal uses pivot point analysis to identify key support and resistance levels
                  for more accurate trading decisions. The system analyzes classic, fibonacci, and camarilla
                  pivot levels to determine optimal entry, stop loss, and take profit points.
                </p>
                <p className="mb-2">
                  Use the dropdown menu to select different currency pairs. The system uses the 1-hour 
                  timeframe which provides a good balance between signal frequency and trend reliability.
                </p>
                <p>
                  Signals are automatically refreshed every 5 minutes to provide you with up-to-date information.
                  Due to API rate limits, there's a 5-second delay when changing pairs.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trading" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-4">
              <AccountPanel />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                <TradingForm onOrderPlaced={handleOrderPlaced} />
              </div>
            </div>
            
            <div className="grid gap-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="positions">Open Positions</TabsTrigger>
                  <TabsTrigger value="history">Trade History</TabsTrigger>
                </TabsList>
                <TabsContent value="positions">
                  <PositionsTable />
                </TabsContent>
                <TabsContent value="history">
                  <HistoryTable />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="charts">
          <TradingViewChart />
        </TabsContent>
        
        <TabsContent value="market">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PriceTicker />
            <Card>
              <CardHeader>
                <CardTitle>Market Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">
                  Use this section to analyze market trends and make informed trading decisions.
                  The price ticker shows real-time bid and ask prices for major currency pairs.
                </p>
                <p>
                  Watch for price movements and volatility to identify potential trading opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>About Virtual Trading</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              This virtual trading platform allows you to practice trading without risking real money.
              Each user is allocated a virtual account with $1,000 to start.
            </p>
            <p className="mb-2">
              All trades are executed in a simulated environment that mirrors real market conditions.
              You can place buy and sell orders on various forex pairs and track your performance.
            </p>
            <p>
              The platform now uses Firebase for real-time data storage and synchronization, providing
              a seamless trading experience without requiring a separate backend server.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
