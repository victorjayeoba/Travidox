"use client"

import { useState, useEffect } from 'react'
import { 
  Play, Pause, Info, BarChart, History, ChevronRight, 
  Settings, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Zap, DollarSign, Sliders, Lock, Unlock, TrendingUp, AlertCircle,
  CheckCircle2, XCircle, Clock, Calendar
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { motion, AnimatePresence } from 'framer-motion'
import { tradingApi } from '@/lib/api'
import { useTrading } from '@/hooks/useTrading'
import { MTAccountConnection } from '@/components/dashboard/mt-account-connection'
import { MTAccountInfoSimple } from '@/components/dashboard/mt-account-info-simple'
import MockDataNotice from '@/components/dashboard/MockDataNotice'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

export default function TradingBotPage() {
  const [botActive, setBotActive] = useState(false)
  const [riskLevel, setRiskLevel] = useState(2) // 1: Low, 2: Medium, 3: High
  const [controlMode, setControlMode] = useState("partial") // "full" or "partial"
  const [stopLoss, setStopLoss] = useState(8)
  const [takeProfit, setTakeProfit] = useState(15)
  const [leverage, setLeverage] = useState(5)
  const [activeTab, setActiveTab] = useState("settings")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState("EURUSD")
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY")
  const [tradeVolume, setTradeVolume] = useState(0.01)
  const [tradeSL, setTradeSL] = useState<number | null>(null)
  const [tradeTP, setTradeTP] = useState<number | null>(null)
  const [tradeResponse, setTradeResponse] = useState<{
    success: boolean;
    message: string;
    details?: string;
    timestamp: number;
    apiResponse?: any;
  } | null>(null)
  const [marketOpen, setMarketOpen] = useState(false)
  const [isQuickTradeOpen, setIsQuickTradeOpen] = useState(false)
  
  // Use our trading hook for API interactions
  const {
    accountInfo,
    positions,
    loading,
    error,
    connectAccount,
    placeOrder,
    closePosition,
    refreshPositions,
    refreshAccountInfo,
    useMockData,
    setUseMockData
  } = useTrading()

  // Account connection status
  const isAccountConnected = !!accountInfo

  // Disable mock data if we have a real connection
  useEffect(() => {
    if (useMockData && isAccountConnected) {
      setUseMockData(false);
    }
  }, [useMockData, isAccountConnected, setUseMockData]);

  // Stop the bot if account gets disconnected
  useEffect(() => {
    if (botActive && !isAccountConnected) {
      setBotActive(false)
    }
  }, [isAccountConnected, botActive])
  
  // Animation when bot is started
  useEffect(() => {
    if (botActive) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [botActive])

  // Check if markets are currently open
  useEffect(() => {
    const checkMarketStatus = () => {
      const now = new Date();
      const day = now.getUTCDay(); // 0 = Sunday, 6 = Saturday
      const hour = now.getUTCHours();
      
      // Markets are generally closed on weekends
      // Simplified check: Closed on Saturday, and Sunday before 5 PM ET (21 UTC)
      if (day === 6 || (day === 0 && hour < 21)) {
        setMarketOpen(false);
        return;
      }
      
      // Markets generally close Friday 5 PM ET (21 UTC)
      if (day === 5 && hour >= 21) {
        setMarketOpen(false);
        return;
      }
      
      // For all other times, markets are generally open
      setMarketOpen(true);
    };
    
    // Check immediately and then every minute
    checkMarketStatus();
    const interval = setInterval(checkMarketStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Function to get next market open time
  const getNextMarketOpen = () => {
    const now = new Date();
    const day = now.getUTCDay(); // 0 = Sunday, 6 = Saturday
    
    // If it's Saturday or early Sunday, markets open Sunday 5 PM ET
    if (day === 6 || (day === 0 && now.getUTCHours() < 21)) {
      const nextOpen = new Date();
      // Set to next Sunday
      nextOpen.setUTCDate(now.getUTCDate() + (day === 6 ? 1 : 0));
      nextOpen.setUTCHours(21, 0, 0, 0); // 5 PM ET = 21:00 UTC
      return nextOpen;
    }
    
    // If it's Friday evening or later, markets open next Sunday
    if ((day === 5 && now.getUTCHours() >= 21) || day === 6) {
      const nextOpen = new Date();
      // Calculate days until next Sunday
      const daysUntilSunday = 7 - day;
      nextOpen.setUTCDate(now.getUTCDate() + daysUntilSunday);
      nextOpen.setUTCHours(21, 0, 0, 0); // 5 PM ET = 21:00 UTC
      return nextOpen;
    }
    
    // Otherwise markets are open or will open soon
    return null;
  };
  
  // Format the next open time in a user-friendly way
  const formatNextOpenTime = () => {
    const nextOpen = getNextMarketOpen();
    if (!nextOpen) return "";
    
    // Get day name
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = days[nextOpen.getDay()];
    
    // Format time
    const options = { hour: 'numeric' as const, minute: '2-digit' as const, hour12: true };
    const timeString = nextOpen.toLocaleTimeString(undefined, options);
    
    return `${dayName} at ${timeString} (your local time)`;
  };

  // Handle disconnecting the account
  const handleDisconnectAccount = async () => {
    // For now we just refresh - in a real app, you would call an API endpoint
    // to disconnect the account server-side
    
    // Clear local state - in production, this would be done after the API call
    localStorage.removeItem('authToken')
    window.location.reload()
  }
  
  // Function to place a real order
  const placeRealOrder = async () => {
    if (!isAccountConnected) return
    
    try {
      setIsLoading(true)
      setTradeResponse(null)
      
      // Create order data with user-selected values
      const orderData = {
        symbol: selectedSymbol,
        order_type: tradeType,
        volume: tradeVolume,
        stop_loss: tradeSL, // Add stop loss
        take_profit: tradeTP, // Add take profit
      }
      
      console.log('Placing order with data:', orderData);
      
      // Place the order using the real API and get the actual response
      const apiResponse = await placeOrder(orderData);
      console.log('API Response:', apiResponse);
      
      // Refresh positions to show the new trade
      await refreshPositions();
      
      // Format success message based on actual API response
      setTradeResponse({
        success: true,
        message: apiResponse.message || `Order placed successfully`,
        details: JSON.stringify(apiResponse, null, 2),
        timestamp: Date.now(),
        apiResponse: apiResponse
      });
      
      setIsLoading(false)
    } catch (error: any) {
      console.error('Error placing order:', error)
      
      // Show error notification with actual API error
      setTradeResponse({
        success: false,
        message: `Error placing order`,
        details: error?.message || String(error),
        timestamp: Date.now(),
        apiResponse: error?.response || null
      });
      
      setIsLoading(false)
    }
  }
  
  const getRiskColor = () => {
    switch (riskLevel) {
      case 1: return 'bg-emerald-100 text-emerald-700'
      case 2: return 'bg-amber-100 text-amber-700'
      case 3: return 'bg-rose-100 text-rose-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }
  
  const getRiskText = () => {
    switch (riskLevel) {
      case 1: return 'Low Risk'
      case 2: return 'Medium Risk'
      case 3: return 'High Risk'
      default: return 'Custom'
    }
  }

  // Sample trade history - would be replaced with actual API data
  const tradeHistory = [
    { id: 1, symbol: 'EUR/USD', type: 'buy', amount: 0.5, price: 1.0823, time: '2023-06-15 14:23', profit: null },
    { id: 2, symbol: 'EUR/USD', type: 'sell', amount: 0.5, price: 1.0855, time: '2023-06-16 10:15', profit: 16.00 },
    { id: 3, symbol: 'GBP/JPY', type: 'buy', amount: 0.25, price: 186.732, time: '2023-06-16 11:30', profit: null },
    { id: 4, symbol: 'BTC/USD', type: 'buy', amount: 0.01, price: 42675.84, time: '2023-06-17 09:45', profit: null },
    { id: 5, symbol: 'GBP/JPY', type: 'sell', amount: 0.25, price: 187.125, time: '2023-06-18 15:20', profit: 9.83 },
  ]
  
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
    
    return (
      <div className={`fixed bottom-4 right-4 max-w-md w-full shadow-lg rounded-lg transition-all duration-500 transform translate-y-0 ${tradeResponse ? 'opacity-100' : 'opacity-0 translate-y-12'}`}>
        <div className={`p-4 rounded-lg border ${tradeResponse.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              {tradeResponse.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="ml-3 w-full">
              <div className="flex justify-between">
                <h3 className={`text-sm font-medium ${tradeResponse.success ? 'text-green-800' : 'text-red-800'}`}>
                  {tradeResponse.message}
                </h3>
                <button 
                  onClick={() => setTradeResponse(null)}
                  className={`text-sm ${tradeResponse.success ? 'text-green-600' : 'text-red-600'} hover:underline`}
                >
                  Dismiss
                </button>
              </div>
              <div className={`mt-1 text-sm ${tradeResponse.success ? 'text-green-700' : 'text-red-700'}`}>
                {/* Show API details in a code block */}
                <pre className="mt-2 text-xs bg-black bg-opacity-5 p-2 rounded overflow-auto max-h-40 whitespace-pre-wrap">
                  {tradeResponse.details}
                </pre>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {new Date(tradeResponse.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Display mock data notice when using mock data */}
      {useMockData && <MockDataNotice />}
      
      {/* Market status alert */}
      {!marketOpen && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                Forex Markets Currently Closed
              </h3>
              <div className="mt-1 text-sm text-amber-700">
                <p>The forex market is closed for the weekend. Normal trading hours are from Sunday 5 PM ET to Friday 5 PM ET.</p>
                <p className="mt-1">Markets will reopen on {formatNextOpenTime()}.</p>
              </div>
              <div className="mt-2 text-xs text-amber-600">
                <p>You can still prepare strategies and explore the platform. Trading will be available when markets reopen.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Trade Notification */}
      <TradeNotification />
      
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trading Bot</h1>
          <p className="text-gray-500">AI-powered currency pair trading automation</p>
        </div>
        
        {isAccountConnected && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={botActive ? "destructive" : "default"}
                className="gap-2 transition-all duration-300 transform hover:scale-105"
                onClick={() => setBotActive(!botActive)}
                  disabled={!isAccountConnected || loading}
              >
                {isLoading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1" />
                ) : botActive ? <Pause size={16} /> : <Play size={16} />}
                {isLoading ? "Initializing..." : botActive ? "Stop Bot" : "Start Bot"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{botActive ? "Stop the trading bot" : "Start the trading bot"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        )}
      </motion.div>

      {/* First check if an account is connected */}
      {loading && !error ? (
        <Card className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            <span className="ml-3 text-lg">Loading account information...</span>
          </div>
        </Card>
      ) : error && !isAccountConnected ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading account</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : !isAccountConnected ? (
        <div className="mb-6">
          <MTAccountConnection 
            onAccountConnected={refreshAccountInfo} 
            error={error}
          />
        </div>
      ) : (
        <>
          {/* Account Info */}
          <div className="mb-6">
            <MTAccountInfoSimple 
              accountInfo={accountInfo!}
            />
          </div>

          {/* Quick Trade - Collapsible */}
          <div className="mb-6">
            <div 
              className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm cursor-pointer"
              onClick={() => setIsQuickTradeOpen(!isQuickTradeOpen)}
            >
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Quick Trade</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {isQuickTradeOpen ? "Close" : "Open"} trading panel
                </span>
                <ChevronRight 
                  className={`h-5 w-5 transition-transform duration-200 ${isQuickTradeOpen ? "rotate-90" : ""}`} 
                />
              </div>
            </div>
            
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: isQuickTradeOpen ? "auto" : 0,
                opacity: isQuickTradeOpen ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Card className="mt-2 border-t-0 rounded-t-none">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Symbol and Type */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="trade-symbol">Symbol</Label>
                        <Select defaultValue={selectedSymbol} onValueChange={setSelectedSymbol}>
                          <SelectTrigger id="trade-symbol">
                            <SelectValue placeholder="Select symbol" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Major forex pairs - highest liquidity and typically longer hours */}
                            <SelectItem value="EURUSD">EURUSD - Euro/US Dollar</SelectItem>
                            <SelectItem value="GBPUSD">GBPUSD - Great Britain Pound/US Dollar</SelectItem>
                            <SelectItem value="USDJPY">USDJPY - US Dollar/Japanese Yen</SelectItem>
                            <SelectItem value="USDCHF">USDCHF - US Dollar/Swiss Franc</SelectItem>
                            <SelectItem value="AUDUSD">AUDUSD - Australian Dollar/US Dollar</SelectItem>
                            <SelectItem value="USDCAD">USDCAD - US Dollar/Canadian Dollar</SelectItem>
                            <SelectItem value="NZDUSD">NZDUSD - New Zealand Dollar/US Dollar</SelectItem>
                            
                            {/* Minor pairs - also good liquidity */}
                            <SelectItem value="EURGBP">EURGBP - Euro/Great Britain Pound</SelectItem>
                            <SelectItem value="EURJPY">EURJPY - Euro/Japanese Yen</SelectItem>
                            <SelectItem value="EURCHF">EURCHF - Euro/Swiss Franc</SelectItem>
                            <SelectItem value="GBPJPY">GBPJPY - Great Britain Pound/Japanese Yen</SelectItem>
                            
                            {/* Cryptocurrencies - often available 24/7 */}
                            <SelectItem value="BTCUSD">BTCUSD - Bitcoin/US Dollar</SelectItem>
                            <SelectItem value="ETHUSD">ETHUSD - Ethereum/US Dollar</SelectItem>
                            <SelectItem value="XRPUSD">XRPUSD - Ripple/US Dollar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="trade-type">Type</Label>
                        <RadioGroup defaultValue={tradeType} onValueChange={(v) => setTradeType(v as "BUY" | "SELL")} className="flex pt-2">
                          <div className="flex items-center space-x-2 mr-4">
                            <RadioGroupItem value="BUY" id="trade-buy" />
                            <Label htmlFor="trade-buy">Buy</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="SELL" id="trade-sell" />
                            <Label htmlFor="trade-sell">Sell</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    
                    {/* Volume */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="trade-volume">Volume</Label>
                        <span className="text-sm font-medium">{tradeVolume.toFixed(2)}</span>
                      </div>
                      <Slider
                        id="trade-volume"
                        min={0.01}
                        max={1.00}
                        step={0.01}
                        value={[tradeVolume]}
                        onValueChange={(v) => setTradeVolume(v[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0.01</span>
                        <span>0.5</span>
                        <span>1.00</span>
                      </div>
                    </div>
                    
                    {/* Stop Loss and Take Profit */}
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {/* Stop Loss */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="stop-loss">Stop Loss (pips)</Label>
                          <span className="text-sm font-medium">{tradeSL || 'None'}</span>
                        </div>
                        <div className="flex gap-2">
                          <Input 
                            id="stop-loss"
                            type="number"
                            min="0"
                            step="1"
                            placeholder="SL (optional)"
                            value={tradeSL === null ? '' : tradeSL}
                            onChange={(e) => setTradeSL(e.target.value === '' ? null : Number(e.target.value))}
                            className="w-full"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setTradeSL(null)}
                            className="shrink-0"
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
  
                      {/* Take Profit */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="take-profit">Take Profit (pips)</Label>
                          <span className="text-sm font-medium">{tradeTP || 'None'}</span>
                        </div>
                        <div className="flex gap-2">
                          <Input 
                            id="take-profit"
                            type="number"
                            min="0"
                            step="1"
                            placeholder="TP (optional)"
                            value={tradeTP === null ? '' : tradeTP}
                            onChange={(e) => setTradeTP(e.target.value === '' ? null : Number(e.target.value))}
                            className="w-full"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setTradeTP(null)}
                            className="shrink-0"
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Risk Summary */}
                    <div className="mt-4 p-3 bg-slate-50 rounded-md text-sm">
                      <h4 className="font-medium mb-1">Trade Summary</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <div className="text-slate-600">Symbol:</div>
                        <div className="font-medium">{selectedSymbol}</div>
                        
                        <div className="text-slate-600">Type:</div>
                        <div className={`font-medium ${tradeType === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                          {tradeType}
                        </div>
                        
                        <div className="text-slate-600">Volume:</div>
                        <div className="font-medium">{tradeVolume} lot</div>
                        
                        <div className="text-slate-600">Stop Loss:</div>
                        <div className="font-medium">{tradeSL ? `${tradeSL} pips` : 'Not set'}</div>
                        
                        <div className="text-slate-600">Take Profit:</div>
                        <div className="font-medium">{tradeTP ? `${tradeTP} pips` : 'Not set'}</div>
                      </div>
                    </div>
                    
                    {/* Place Order Button */}
                    <Button 
                      className="w-full mt-4" 
                      onClick={placeRealOrder}
                      disabled={loading || !isAccountConnected || isLoading || !marketOpen}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Placing Order...
                        </>
                      ) : !marketOpen ? (
                        <>
                          <Calendar className="h-4 w-4 mr-2" />
                          Markets Closed
                        </>
                      ) : (
                        <>Place {tradeType} Order for {selectedSymbol}</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

      {/* Bot Status Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className={`transition-all duration-500 ${botActive ? "border-emerald-500 shadow-lg shadow-emerald-100" : "border-gray-200"}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${botActive ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                  <motion.div 
                    className={`w-4 h-4 rounded-full ${botActive ? 'bg-emerald-500' : 'bg-gray-400'}`}
                    animate={{ scale: botActive ? [1, 1.2, 1] : 1 }}
                    transition={{ repeat: botActive ? Infinity : 0, duration: 2 }}
                  ></motion.div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {botActive ? (
                      <span className="flex items-center gap-2">
                        <span>Trading Bot Active</span>
                        <span className="text-emerald-500 text-sm animate-pulse">●</span>
                      </span>
                    ) : 'Trading Bot Inactive'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {botActive 
                      ? `Actively monitoring ${controlMode === "full" ? "and autonomously trading" : "markets and executing your strategy"}` 
                      : 'Bot is currently paused. Press Start to begin trading'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge className={`px-3 py-1.5 ${getRiskColor()}`}>
                  {getRiskText()}
                </Badge>
                <Badge className={`px-3 py-1.5 ${controlMode === "full" ? "bg-indigo-100 text-indigo-700" : "bg-blue-100 text-blue-700"}`}>
                  {controlMode === "full" ? (
                    <span className="flex items-center gap-1.5"><Zap size={12} /> Full AI Control</span>
                  ) : (
                    <span className="flex items-center gap-1.5"><Sliders size={12} /> Partial Control</span>
                  )}
                </Badge>
              </div>
            </div>
            
            <AnimatePresence>
              {botActive && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 space-y-4 overflow-hidden"
                >
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Daily trade limit</span>
                      <span className="font-medium">7 / 10</span>
                    </div>
                    <Progress value={70} className="h-2.5 rounded-full" indicatorClassName="bg-indigo-500" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Budget utilization</span>
                          <span className="font-medium">${(accountInfo.balance * 0.58).toFixed(2)} / ${(accountInfo.balance * 0.8).toFixed(2)}</span>
                    </div>
                    <Progress value={58} className="h-2.5 rounded-full" indicatorClassName="bg-cyan-500" />
                  </div>
                  
                  <div className="pt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-sm text-slate-500">Active Positions</div>
                          <div className="text-xl font-semibold">{positions.length}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-sm text-slate-500">Today's P/L</div>
                          <div className="text-xl font-semibold text-emerald-500">
                            {positions.length > 0 
                              ? `+$${positions.reduce((sum, pos) => sum + pos.profit, 0).toFixed(2)}` 
                              : '$0.00'}
                          </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-sm text-slate-500">Waiting Orders</div>
                      <div className="text-xl font-semibold">2</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bot Configuration and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Bot Settings */}
        <motion.div 
              className="col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
              <Card>
            <CardHeader>
                  <CardTitle>Bot Settings</CardTitle>
                  <CardDescription>Configure your trading parameters</CardDescription>
            </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Risk Level</Label>
                      <Badge className={getRiskColor()}>{getRiskText()}</Badge>
                    </div>
                    <RadioGroup 
                      defaultValue={riskLevel.toString()} 
                      onValueChange={(v) => setRiskLevel(parseInt(v))}
                      className="flex justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="risk-low" />
                        <Label htmlFor="risk-low">Low</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2" id="risk-medium" />
                        <Label htmlFor="risk-medium">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3" id="risk-high" />
                        <Label htmlFor="risk-high">High</Label>
                    </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Control Mode</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-80 text-sm">
                              <strong>Full AI Control:</strong> The bot will make trading decisions automatically based on AI analysis.<br/><br/>
                              <strong>Partial Control:</strong> The bot will suggest trades but wait for your approval before executing.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <Label htmlFor="control-mode">
                          {controlMode === "full" ? (
                            <span className="flex items-center gap-1.5"><Zap size={14} /> Full AI Control</span>
                          ) : (
                            <span className="flex items-center gap-1.5"><Sliders size={14} /> Partial Control</span>
                          )}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {controlMode === "full" 
                            ? "Bot trades automatically based on AI analysis" 
                            : "Bot suggests trades for your approval"}
                        </p>
                      </div>
                      <Switch
                        id="control-mode"
                        checked={controlMode === "full"}
                        onCheckedChange={(checked) => setControlMode(checked ? "full" : "partial")}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="stop-loss">Stop Loss (pips)</Label>
                      <span className="text-sm font-medium">{stopLoss}</span>
                    </div>
                    <Slider
                      id="stop-loss"
                      min={0}
                      max={50}
                      step={1}
                      value={[stopLoss]}
                      onValueChange={(v) => setStopLoss(v[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Off</span>
                      <span>Conservative</span>
                      <span>Aggressive</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="take-profit">Take Profit (pips)</Label>
                      <span className="text-sm font-medium">{takeProfit}</span>
                    </div>
                    <Slider
                      id="take-profit"
                      min={0}
                      max={100}
                      step={1}
                      value={[takeProfit]}
                      onValueChange={(v) => setTakeProfit(v[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Off</span>
                      <span>Quick Profits</span>
                      <span>Long Term</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="leverage">Max Leverage</Label>
                      <span className="text-sm font-medium">1:{leverage}</span>
                      </div>
                      <Slider 
                      id="leverage"
                        min={1} 
                        max={20} 
                        step={1} 
                      value={[leverage]}
                      onValueChange={(v) => setLeverage(v[0])}
                      />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Safe</span>
                      <span>Balanced</span>
                      <span>High Risk</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Right: Tabs for Trading History and Statistics */}
            <motion.div 
              className="col-span-1 md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Tabs defaultValue="history" className="h-full">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="history" className="flex items-center gap-1.5">
                      <History size={14} />
                      Trading History
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="flex items-center gap-1.5">
                      <BarChart size={14} />
                      Statistics
                    </TabsTrigger>
                    <TabsTrigger value="positions" className="flex items-center gap-1.5">
                      <TrendingUp size={14} />
                      Positions ({positions.length})
                    </TabsTrigger>
                  </TabsList>
                    </div>
                    
                <TabsContent value="history" className="h-[400px] overflow-auto">
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Recent Trade Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="rounded-md overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Date/Time</th>
                              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Symbol</th>
                              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Type</th>
                              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Size</th>
                              <th className="text-left p-3 text-xs font-medium text-muted-foreground">Price</th>
                              <th className="text-right p-3 text-xs font-medium text-muted-foreground">Profit/Loss</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {tradeHistory.map((trade) => (
                              <tr key={trade.id} className="hover:bg-muted/50 transition-colors">
                                <td className="p-3 text-sm">{trade.time}</td>
                                <td className="p-3 text-sm font-medium">{trade.symbol}</td>
                                <td className="p-3">
                                  <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'} className="flex w-16 justify-center items-center">
                                    {trade.type === 'buy' ? (
                                      <ArrowUpRight className="mr-1 h-3 w-3" />
                                    ) : (
                                      <ArrowDownRight className="mr-1 h-3 w-3" />
                                    )}
                                    {trade.type.toUpperCase()}
                                  </Badge>
                                </td>
                                <td className="p-3 text-sm">{trade.amount}</td>
                                <td className="p-3 text-sm">{trade.price}</td>
                                <td className="p-3 text-sm text-right">
                                  {trade.profit !== null ? (
                                    <span className={trade.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                                      {trade.profit >= 0 ? '+' : ''}{trade.profit?.toFixed(2)}
                                    </span>
                                  ) : (
                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">Open</Badge>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="stats" className="h-[400px]">
                  <Card className="h-full flex items-center justify-center">
                    <div className="text-center p-6">
                      <BarChart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-medium mb-2">Trading Statistics</h3>
                      <p className="text-gray-500 mb-4">
                        Trading statistics and analytics will be available after you've completed more trades.
                      </p>
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="positions" className="h-[400px] overflow-auto">
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Open Positions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {positions.length > 0 ? (
                        <div className="rounded-md overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Symbol</th>
                                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Type</th>
                                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Size</th>
                                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Open Price</th>
                                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Current</th>
                                <th className="text-right p-3 text-xs font-medium text-muted-foreground">P/L</th>
                                <th className="text-right p-3 text-xs font-medium text-muted-foreground">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {positions.map((pos) => (
                                <tr key={pos.id} className="hover:bg-muted/50 transition-colors">
                                  <td className="p-3 text-sm font-medium">{pos.symbol}</td>
                                  <td className="p-3">
                                    <Badge variant={pos.type === 'BUY' ? 'default' : 'secondary'} className="flex w-16 justify-center items-center">
                                      {pos.type === 'BUY' ? (
                                        <ArrowUpRight className="mr-1 h-3 w-3" />
                                      ) : (
                                        <ArrowDownRight className="mr-1 h-3 w-3" />
                                      )}
                                      {pos.type}
                                    </Badge>
                                  </td>
                                  <td className="p-3 text-sm">{pos.volume}</td>
                                  <td className="p-3 text-sm">{pos.price_open}</td>
                                  <td className="p-3 text-sm">{pos.current_price}</td>
                                  <td className="p-3 text-sm text-right">
                                    <span className={pos.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                                      {pos.profit >= 0 ? '+' : ''}{pos.profit?.toFixed(2)}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => closePosition(pos.id)} 
                                      disabled={loading}
                                    >
                                      Close
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-gray-500 mb-4">No open positions at the moment.</p>
                          <p className="text-sm text-gray-500">
                            Use the trading form above to place a new order.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </>
      )}
    </div>
  )
} 