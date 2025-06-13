"use client"

import { useState, useEffect } from "react"
import { TradingForm } from "@/components/trading-bot/trading-form"
import { VirtualAccountPanel } from "@/components/trading-bot/virtual-account-panel"
import { PriceTicker } from "@/components/trading-bot/price-ticker"
import { TradingViewChart } from "@/components/trading-bot/tradingview-chart"
import { TradingSignalComponent } from "@/components/trading-bot/trading-signal"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, RefreshCw, LineChart, BarChart3, DollarSign, Zap } from "lucide-react"
import Link from "next/link"

export default function TradingBotPage() {
  const { user, loading: authLoading } = useAuth()
  const [refreshKey, setRefreshKey] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<string>("signals")
  const [selectedSymbol, setSelectedSymbol] = useState<string>("EURUSD")
  const [tradeResponse, setTradeResponse] = useState<any>(null)
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }
  
  // Handle place order from trading signal
  const handlePlaceOrderFromSignal = (orderType: 'BUY' | 'SELL', symbol: string) => {
    // Set the selected symbol
    setSelectedSymbol(symbol);
    
    // Switch to trading tab
    setActiveTab("trading");
    
    // The user will need to confirm the order in the trading form
  };
  
  // Trade notification component with raw API response
  const TradeNotification = () => {
    if (!tradeResponse) return null;
    
    // Auto dismiss after 15 seconds
    useEffect(() => {
      const timer = setTimeout(() => {
        setTradeResponse(null);
      }, 15000);
      
      return () => clearTimeout(timer);
    }, [tradeResponse]);
    
    return null; // Placeholder return
  };
  
  if (authLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-40">
              <p>Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col justify-center items-center h-40">
              <p className="mb-4">You need to be logged in to access the trading bot.</p>
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold ml-4">Virtual Trading Platform</h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <VirtualAccountPanel key={`account-${refreshKey}`} />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TradingSignalComponent 
              symbol="EURUSD" 
              interval="1h"
              onPlaceOrder={handlePlaceOrderFromSignal}
            />
            <TradingSignalComponent 
              symbol="GBPUSD" 
              interval="1h"
              onPlaceOrder={handlePlaceOrderFromSignal}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TradingSignalComponent 
              symbol="USDJPY" 
              interval="1h"
              onPlaceOrder={handlePlaceOrderFromSignal}
            />
            <TradingSignalComponent 
              symbol="AUDUSD" 
              interval="1h"
              onPlaceOrder={handlePlaceOrderFromSignal}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="trading" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TradingForm onOrderPlaced={handleRefresh} />
            <PriceTicker />
          </div>
        </TabsContent>
        
        <TabsContent value="charts">
          <TradingViewChart />
        </TabsContent>
        
        <TabsContent value="market">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PriceTicker />
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Market Analysis</h2>
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
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">About Virtual Trading</h2>
            <p className="mb-2">
              This virtual trading platform allows you to practice trading without risking real money.
              Each user is allocated a virtual account with $1,000 to start.
            </p>
            <p className="mb-2">
              All trades are executed in a simulated environment that mirrors real market conditions.
              The platform uses real-time market data from Finnhub's WebSocket API to provide accurate
              price information for your trades.
            </p>
            <p className="mb-2">
              The trading signals are powered by Twelve Data's technical analysis API, which provides
              insights based on moving averages and oscillators to help you make informed trading decisions.
            </p>
            <p>
              Use this platform to develop and test your trading strategies before applying them in
              real-world trading scenarios.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
