"use client"

import { useState, useEffect } from 'react'
import { 
  Play, Pause, Info, BarChart, History, ChevronRight, 
  Settings, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Zap, DollarSign, Sliders, Lock, Unlock, TrendingUp
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
import { motion, AnimatePresence } from 'framer-motion'

export default function TradingBotPage() {
  const [botActive, setBotActive] = useState(false)
  const [riskLevel, setRiskLevel] = useState(2) // 1: Low, 2: Medium, 3: High
  const [controlMode, setControlMode] = useState("partial") // "full" or "partial"
  const [stopLoss, setStopLoss] = useState(8)
  const [takeProfit, setTakeProfit] = useState(15)
  const [leverage, setLeverage] = useState(5)
  const [activeTab, setActiveTab] = useState("settings")
  const [isLoading, setIsLoading] = useState(false)
  
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

  // Sample trade history
  const tradeHistory = [
    { id: 1, symbol: 'EUR/USD', type: 'buy', amount: 0.5, price: 1.0823, time: '2023-06-15 14:23', profit: null },
    { id: 2, symbol: 'EUR/USD', type: 'sell', amount: 0.5, price: 1.0855, time: '2023-06-16 10:15', profit: 16.00 },
    { id: 3, symbol: 'GBP/JPY', type: 'buy', amount: 0.25, price: 186.732, time: '2023-06-16 11:30', profit: null },
    { id: 4, symbol: 'BTC/USD', type: 'buy', amount: 0.01, price: 42675.84, time: '2023-06-17 09:45', profit: null },
    { id: 5, symbol: 'GBP/JPY', type: 'sell', amount: 0.25, price: 187.125, time: '2023-06-18 15:20', profit: 9.83 },
  ]
  
  return (
    <div className="space-y-6">
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={botActive ? "destructive" : "default"}
                className="gap-2 transition-all duration-300 transform hover:scale-105"
                onClick={() => setBotActive(!botActive)}
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
      </motion.div>

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
                      <span className="font-medium">$1,450 / $2,500</span>
                    </div>
                    <Progress value={58} className="h-2.5 rounded-full" indicatorClassName="bg-cyan-500" />
                  </div>
                  
                  <div className="pt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-sm text-slate-500">Active Positions</div>
                      <div className="text-xl font-semibold">3</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-sm text-slate-500">Today's P/L</div>
                      <div className="text-xl font-semibold text-emerald-500">+$24.27</div>
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
          className="md:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={18} />
                Bot Configuration
              </CardTitle>
              <CardDescription>
                Customize how your trading bot operates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="settings" className="text-sm">General Settings</TabsTrigger>
                  <TabsTrigger value="strategy" className="text-sm">Trading Strategy</TabsTrigger>
                </TabsList>
                
                <TabsContent value="settings" className="space-y-5 mt-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Control Mode</div>
                      <div className="text-sm text-gray-500">Choose how much control to give the AI</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1.5 ${controlMode === "full" ? "text-indigo-600" : "text-gray-400"}`}>
                        <Lock size={16} />
                        <span className="text-sm">Full AI</span>
                      </div>
                      <Switch 
                        checked={controlMode === "partial"}
                        onCheckedChange={(checked) => setControlMode(checked ? "partial" : "full")}
                      />
                      <div className={`flex items-center gap-1.5 ${controlMode === "partial" ? "text-blue-600" : "text-gray-400"}`}>
                        <Unlock size={16} />
                        <span className="text-sm">Partial</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Auto-trade</div>
                      <div className="text-sm text-gray-500">Bot will execute trades without confirmation</div>
                    </div>
                    <Switch checked={botActive} onCheckedChange={setBotActive} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Risk Level</div>
                      <div className="text-sm text-gray-500">Determines aggressiveness of trading strategy</div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant={riskLevel === 1 ? "default" : "outline"}
                        onClick={() => setRiskLevel(1)}
                        className={riskLevel === 1 ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                      >
                        Low
                      </Button>
                      <Button 
                        size="sm" 
                        variant={riskLevel === 2 ? "default" : "outline"}
                        onClick={() => setRiskLevel(2)}
                        className={riskLevel === 2 ? "bg-amber-500 hover:bg-amber-600" : ""}
                      >
                        Medium
                      </Button>
                      <Button 
                        size="sm" 
                        variant={riskLevel === 3 ? "default" : "outline"}
                        onClick={() => setRiskLevel(3)}
                        className={riskLevel === 3 ? "bg-rose-500 hover:bg-rose-600" : ""}
                      >
                        High
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Daily Budget</div>
                      <div className="text-sm text-gray-500">Maximum amount to invest per day</div>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <DollarSign size={16} className="text-gray-400" />
                      <span>2,500</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Market Hours Only</div>
                      <div className="text-sm text-gray-500">Trade only during market open hours</div>
                    </div>
                    <Switch checked={true} />
                  </div>
                </TabsContent>
                
                <TabsContent value="strategy" className="space-y-5 mt-0">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between">
                        <Label htmlFor="stop-loss" className="font-medium">Stop Loss <span className="text-gray-500">({stopLoss}%)</span></Label>
                        <span className="text-sm text-gray-500">Limit potential losses</span>
                      </div>
                      <Slider 
                        id="stop-loss"
                        value={[stopLoss]} 
                        min={1} 
                        max={20} 
                        step={1} 
                        onValueChange={(value) => setStopLoss(value[0])} 
                        className="mt-2" 
                        disabled={controlMode === "full"}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <Label htmlFor="take-profit" className="font-medium">Take Profit <span className="text-gray-500">({takeProfit}%)</span></Label>
                        <span className="text-sm text-gray-500">Lock in gains</span>
                      </div>
                      <Slider 
                        id="take-profit"
                        value={[takeProfit]} 
                        min={5} 
                        max={50} 
                        step={1} 
                        onValueChange={(value) => setTakeProfit(value[0])} 
                        className="mt-2" 
                        disabled={controlMode === "full"}
                      />
                    </div>
                    
                    <div className={controlMode === "full" ? "opacity-50" : ""}>
                      <div className="flex justify-between">
                        <Label htmlFor="leverage" className="font-medium">Leverage <span className="text-gray-500">({leverage}x)</span></Label>
                        <span className="text-sm text-gray-500">Multiplier for trades</span>
                      </div>
                      <Slider 
                        id="leverage"
                        value={[leverage]} 
                        min={1} 
                        max={20} 
                        step={1} 
                        onValueChange={(value) => setLeverage(value[0])} 
                        className="mt-2" 
                        disabled={controlMode === "full"}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <Label className="font-medium mb-2 block">Preferred Currency Pairs</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="eurusd" className="rounded text-indigo-600" defaultChecked />
                          <label htmlFor="eurusd" className="text-sm">EUR/USD</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="gbpusd" className="rounded text-indigo-600" defaultChecked />
                          <label htmlFor="gbpusd" className="text-sm">GBP/USD</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="usdjpy" className="rounded text-indigo-600" defaultChecked />
                          <label htmlFor="usdjpy" className="text-sm">USD/JPY</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="btcusd" className="rounded text-indigo-600" defaultChecked />
                          <label htmlFor="btcusd" className="text-sm">BTC/USD</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {controlMode === "full" && (
                    <div className="p-3 bg-indigo-50 rounded-lg mt-4 border border-indigo-100">
                      <div className="flex items-center gap-2 text-indigo-700 font-medium mb-1">
                        <Zap size={16} />
                        <span>AI Control Active</span>
                      </div>
                      <p className="text-sm text-indigo-600">
                        The AI will optimize your trading parameters based on market conditions and risk level.
                        Only Stop Loss and Take Profit can be manually set.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <motion.div 
                className="mt-6"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button variant="outline" className="w-full">
                  Advanced Settings
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: Performance Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full bg-gradient-to-br from-slate-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart size={18} />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div 
                className="flex justify-between items-center pb-3 border-b"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-sm text-gray-500">Today</div>
                <div className="font-medium text-emerald-500 flex items-center">
                  <ArrowUpRight size={16} className="mr-1" />
                  +$24.27
                </div>
              </motion.div>
              
              <motion.div 
                className="flex justify-between items-center pb-3 border-b"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-sm text-gray-500">This Week</div>
                <div className="font-medium text-emerald-500 flex items-center">
                  <ArrowUpRight size={16} className="mr-1" />
                  +$146.82
                </div>
              </motion.div>
              
              <motion.div 
                className="flex justify-between items-center pb-3 border-b"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-sm text-gray-500">This Month</div>
                <div className="font-medium text-emerald-500 flex items-center">
                  <ArrowUpRight size={16} className="mr-1" />
                  +$583.95
                </div>
              </motion.div>
              
              <motion.div 
                className="flex justify-between items-center pb-3 border-b"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="text-sm text-gray-500">All Time</div>
                <div className="font-medium text-emerald-500 flex items-center">
                  <ArrowUpRight size={16} className="mr-1" />
                  +$2,146.75
                </div>
              </motion.div>
              
              <motion.div 
                className="flex justify-between items-center pb-3 border-b"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="text-sm text-gray-500">Win Rate</div>
                <div className="font-medium">68%</div>
              </motion.div>
              
              <motion.div 
                className="flex justify-between items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="text-sm text-gray-500">Avg. Holding Time</div>
                <div className="font-medium">1.7 days</div>
              </motion.div>
              
              <motion.div 
                className="mt-6"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" className="w-full gap-2 group">
                  <span>Detailed Analytics</span>
                  <TrendingUp size={14} className="transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Trade History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History size={18} />
              Recent Trades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2 font-medium text-gray-500">Currency Pair</th>
                    <th className="text-left pb-2 font-medium text-gray-500">Type</th>
                    <th className="text-left pb-2 font-medium text-gray-500">Size</th>
                    <th className="text-left pb-2 font-medium text-gray-500">Price</th>
                    <th className="text-left pb-2 font-medium text-gray-500">Date & Time</th>
                    <th className="text-right pb-2 font-medium text-gray-500">Profit/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {tradeHistory.map((trade, index) => (
                    <motion.tr 
                      key={trade.id} 
                      className="border-b last:border-0 hover:bg-slate-50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <td className="py-3 font-medium">{trade.symbol}</td>
                      <td className="py-3">
                        <Badge variant="outline" className={trade.type === 'buy' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}>
                          {trade.type === 'buy' ? 'Buy' : 'Sell'}
                        </Badge>
                      </td>
                      <td className="py-3">{trade.amount}</td>
                      <td className="py-3">{trade.symbol.includes('/USD') ? '$' : ''}
                        {trade.price.toFixed(trade.symbol.includes('BTC') ? 2 : trade.symbol.includes('JPY') ? 3 : 4)}
                      </td>
                      <td className="py-3 text-gray-500">{trade.time}</td>
                      <td className="py-3 text-right">
                        {trade.profit === null ? (
                          <span className="text-gray-500">-</span>
                        ) : (
                          <motion.span 
                            className={trade.profit >= 0 ? 'text-emerald-500 flex items-center justify-end' : 'text-rose-500 flex items-center justify-end'}
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            {trade.profit >= 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                            ${Math.abs(trade.profit).toFixed(2)}
                          </motion.span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <motion.div 
              className="mt-4 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <Button variant="link" className="text-sm text-indigo-600 group">
                View All Trades <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Disclaimer */}
      <motion.div 
        className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <AlertTriangle className="text-amber-500 h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-medium mb-1">Trading Bot Disclaimer</p>
          <p className="text-amber-700">
            The trading bot uses AI algorithms to make decisions when trading currency pairs. Past performance is not indicative of future results. 
            Trading carries risk and you should only invest what you can afford to lose.
          </p>
        </div>
      </motion.div>
    </div>
  )
} 