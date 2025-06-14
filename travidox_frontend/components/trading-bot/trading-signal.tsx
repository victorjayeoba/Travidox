"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowUp, ArrowDown, Loader2, AlertCircle, RefreshCw, BarChart2, ChevronDown, TrendingUp } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/components/auth/auth-provider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from '@/components/ui/separator'
import { useTradingAccount } from '@/hooks/useTradingAccount'

interface TradingSignal {
  symbol: string;
  summary: {
    summary: string; // BUY, SELL, NEUTRAL
    moving_averages: string; // BUY, SELL, NEUTRAL
    oscillators: string; // BUY, SELL, NEUTRAL
  };
  moving_averages: {
    buy: number;
    sell: number;
    neutral: number;
  };
  oscillators: {
    buy: number;
    sell: number;
    neutral: number;
  };
  confidence: {
    level: number;
    direction: 'BUY' | 'SELL' | 'NEUTRAL';
    strength: 'STRONG' | 'MODERATE' | 'WEAK';
  };
  indicator_signals: {
    macd: string;
    rsi: string;
    ema: string;
    pivot?: string;
  };
  indicators_agreement: {
    buy: number;
    sell: number;
    neutral: number;
  };
  ma_data?: {
    trend_strength: string;
    key_levels: {
      sma50?: number;
      sma200?: number;
    };
  };
  pivot_data?: {
    pivot_point: string;
    resistance_levels: Array<{
      name: string;
      value: string;
    }>;
    support_levels: Array<{
      name: string;
      value: string;
    }>;
  };
  strategy_advice?: {
    action: string;
    reason: string;
    stop_loss?: string | null;
    take_profit?: string | null;
  };
}

interface TradingSignalProps {
  defaultSymbol?: string;
  defaultInterval?: string;
  onPlaceOrder?: (orderType: 'BUY' | 'SELL', symbol: string) => void;
}

// Available currency pairs
const availablePairs = [
  { value: "EURUSD", label: "EUR/USD" },
  { value: "GBPUSD", label: "GBP/USD" },
  { value: "USDJPY", label: "USD/JPY" },
  { value: "AUDUSD", label: "AUD/USD" },
];

// Client-side cache for storing signals
interface CacheItem {
  signal: TradingSignal;
  timestamp: number;
}
const signalCache = new Map<string, CacheItem>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache lifetime

export function TradingSignalComponent({ 
  defaultSymbol = "EURUSD",
  defaultInterval = "1h", // Changed default to 1h
  onPlaceOrder
}: TradingSignalProps) {
  const [symbol, setSymbol] = useState<string>(defaultSymbol);
  const interval = "1h"; // Fixed interval to 1h
  const [signal, setSignal] = useState<TradingSignal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isChangingPair, setIsChangingPair] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const { toast } = useToast();
  const { user } = useAuth();
  const { placeOrder, marketPrices, accountMetrics } = useTradingAccount();
  
  // Format symbol for display
  const getFormattedSymbol = (symbolStr: string) => {
    return symbolStr.length === 6 
      ? `${symbolStr.slice(0, 3)}/${symbolStr.slice(3, 6)}`
      : symbolStr;
  };
  
  // Fetch trading signals
  const fetchSignal = async (symbolToFetch: string, intervalToFetch: string) => {
    try {
      setLoading(true);
      setError(null);

      // Check if we have a valid cached response
      const cacheKey = `${symbolToFetch}-${intervalToFetch}`;
      if (signalCache.has(cacheKey)) {
        const cachedData = signalCache.get(cacheKey)!;
        if (cachedData.timestamp > Date.now() - CACHE_TTL) {
          console.log(`Using cached data for ${cacheKey}`);
          setSignal(cachedData.signal);
          setLoading(false);
          setIsRefreshing(false);
          setIsChangingPair(false);
          return;
        } else {
          // Cache expired, remove it
          signalCache.delete(cacheKey);
        }
      }
      
      // Check if we need to wait before making another request
      const now = Date.now();
      const timeSinceLastFetch = now - lastFetchTime;
      const minWaitTime = 5000; // 5 seconds minimum wait time
      
      if (timeSinceLastFetch < minWaitTime) {
        const waitTime = minWaitTime - timeSinceLastFetch;
        console.log(`Waiting ${waitTime}ms before fetching new data`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }

      const response = await fetch(`/api/trading-signals/${symbolToFetch}?interval=${intervalToFetch}`);
      
      // Update last fetch time
      setLastFetchTime(Date.now());
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch trading signals');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }
      
      // Set the signal data
      setSignal(data.signal);
      
      // Cache the signal data
      signalCache.set(cacheKey, {
        signal: data.signal,
        timestamp: Date.now()
      });
      
    } catch (error: any) {
      console.error('Error fetching trading signals:', error);
      setError(error.message || 'Failed to fetch trading signals');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      setIsChangingPair(false);
    }
  };
  
  // Handle symbol change
  const handleSymbolChange = (newSymbol: string) => {
    if (newSymbol === symbol) return;
    
    setIsChangingPair(true);
    setSymbol(newSymbol);
    // Fetch will be triggered by the useEffect
  };
  
  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSignal(symbol, interval);
  };
  
  // Place order using trading logic (not direct API)
  const handlePlaceOrder = async (orderType: 'BUY' | 'SELL') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to place orders",
        variant: "destructive",
      });
      return;
    }
    // Use current symbol and default volume
    const selectedSymbol = symbol;
    const volumeNum = 0.01;
    const currentPrice = marketPrices.get(selectedSymbol);
    const bid = currentPrice?.bid || 0;
    const ask = currentPrice?.ask || 0;
    // Margin check (same as TradingForm)
    const price = orderType === 'BUY' ? ask : bid;
    const standardLotSize = 100000;
    const contractValue = volumeNum * standardLotSize * price;
    const leverage = accountMetrics?.leverage || 100;
    const estimatedMargin = leverage > 0 ? contractValue / leverage : contractValue;
    if (accountMetrics && accountMetrics.freeMargin < estimatedMargin) {
      toast({
        title: "Insufficient margin",
        description: `You need approximately $${estimatedMargin.toFixed(2)} margin for this trade`,
        variant: "destructive",
        });
      return;
    }
    try {
      const positionId = await placeOrder(
        selectedSymbol,
        orderType,
        volumeNum,
        null,
        null
      );
      if (positionId) {
        toast({
          title: `${orderType} Order Placed Successfully`,
          description: `${volumeNum} lot of ${selectedSymbol} at ${price.toFixed(5)}`,
          variant: "default",
        });
        if (onPlaceOrder) onPlaceOrder(orderType, selectedSymbol);
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
        toast({
        title: "Failed to place order",
        description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive",
        });
    }
  };
  
  // Get confidence color
  const getConfidenceColor = (direction: string, strength: string) => {
    if (direction === 'BUY') {
      return strength === 'STRONG' ? 'bg-green-600' : 
             strength === 'MODERATE' ? 'bg-green-500' : 'bg-green-400';
    } else if (direction === 'SELL') {
      return strength === 'STRONG' ? 'bg-red-600' : 
             strength === 'MODERATE' ? 'bg-red-500' : 'bg-red-400';
    } else {
      return 'bg-gray-400';
    }
  };
  
  // Get indicator badge color
  const getIndicatorColor = (signal: string) => {
    switch (signal.toLowerCase()) {
      case 'buy': return 'bg-green-600';
      case 'sell': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };
  
  // Get action button style
  const getActionButtonStyle = (action: string) => {
    switch (action) {
      case 'BUY': return 'bg-green-600 hover:bg-green-700';
      case 'SELL': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  // Fetch signals when symbol changes or on component mount
  useEffect(() => {
    fetchSignal(symbol, interval);
    
    // Set up interval to refresh every 5 minutes
    const intervalId = setInterval(() => {
      fetchSignal(symbol, interval);
    }, CACHE_TTL); // 5 minutes
    
    return () => clearInterval(intervalId);
  }, [symbol]);
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle>Trading Signal</CardTitle>
            <Select value={symbol} onValueChange={handleSymbolChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select pair" />
              </SelectTrigger>
              <SelectContent>
                {availablePairs.map((pair) => (
                  <SelectItem key={pair.value} value={pair.value}>
                    {pair.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={loading || isRefreshing || isChangingPair}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {(loading && !signal) || isChangingPair ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">
              {isChangingPair ? "Changing pair..." : "Fetching trading signals..."}
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
            <p className="text-red-500 font-medium">Error loading signals</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        ) : signal ? (
          <div className="space-y-6">
            {/* Signal Summary */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Signal Summary</h3>
              </div>
              
              <div className="flex items-center justify-center w-full mt-2">
                <Badge 
                  className={`text-lg py-2 px-6 ${
                    signal.confidence.direction === 'BUY' ? 'bg-green-600 hover:bg-green-700' : 
                    signal.confidence.direction === 'SELL' ? 'bg-red-600 hover:bg-red-700' : 
                    'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {signal.confidence.direction}
                </Badge>
              </div>
              
              <div className="w-full mt-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Confidence Level</span>
                  <span className="text-sm font-medium">{signal.confidence.level}%</span>
                </div>
                <Progress 
                  value={signal.confidence.level} 
                  className={`h-2 ${getConfidenceColor(signal.confidence.direction, signal.confidence.strength)}`} 
                />
                <div className="flex justify-end mt-1">
                  <Badge variant="outline">{signal.confidence.strength}</Badge>
                </div>
              </div>
            </div>
            
            {/* Strategy Advice */}
            {signal.strategy_advice && (
              <div className="border rounded-md p-4 bg-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="text-md font-semibold">Strategy Advice</h3>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    className={getActionButtonStyle(signal.strategy_advice.action)}
                  >
                    {signal.strategy_advice.action}
                  </Badge>
                  <span className="text-sm">{signal.strategy_advice.reason}</span>
                </div>
                
                {(signal.strategy_advice.stop_loss || signal.strategy_advice.take_profit) && (
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    {signal.strategy_advice.stop_loss && (
                      <div>
                        <span className="font-medium text-red-600">Stop Loss:</span> {signal.strategy_advice.stop_loss}
                      </div>
                    )}
                    {signal.strategy_advice.take_profit && (
                      <div>
                        <span className="font-medium text-green-600">Take Profit:</span> {signal.strategy_advice.take_profit}
                      </div>
                    )}
                  </div>
                )}
                
                {signal.ma_data && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Trend Strength:</span> {signal.ma_data.trend_strength}
                    {signal.ma_data.key_levels.sma50 && (
                      <span className="ml-2">
                        <span className="font-medium">MA50:</span> {signal.ma_data.key_levels.sma50.toFixed(5)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Pivot Points */}
            {signal.pivot_data && (
              <div className="border rounded-md p-4 bg-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  <h3 className="text-md font-semibold">Pivot Points</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-center mb-2">
                    <Badge className="bg-purple-600">
                      PP: {signal.pivot_data.pivot_point}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-green-600 mb-1">Resistance Levels</p>
                      <div className="space-y-1">
                        {signal.pivot_data.resistance_levels.map((level) => (
                          <div key={level.name} className="flex justify-between text-xs">
                            <span className="font-medium">{level.name}:</span>
                            <span>{level.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-red-600 mb-1">Support Levels</p>
                      <div className="space-y-1">
                        {signal.pivot_data.support_levels.map((level) => (
                          <div key={level.name} className="flex justify-between text-xs">
                            <span className="font-medium">{level.name}:</span>
                            <span>{level.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Signal Details */}
            <Tabs defaultValue="indicators" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="indicators">Indicators</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              
              <TabsContent value="indicators" className="pt-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">MACD</span>
                    <Badge 
                      className={`mt-1 ${getIndicatorColor(signal.indicator_signals.macd)}`}
                    >
                      {signal.indicator_signals.macd.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">RSI</span>
                    <Badge 
                      className={`mt-1 ${getIndicatorColor(signal.indicator_signals.rsi)}`}
                    >
                      {signal.indicator_signals.rsi.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">EMA</span>
                    <Badge 
                      className={`mt-1 ${getIndicatorColor(signal.indicator_signals.ema)}`}
                    >
                      {signal.indicator_signals.ema.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {signal.indicator_signals.pivot && (
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-muted-foreground">Pivot</span>
                      <Badge 
                        className={`mt-1 ${getIndicatorColor(signal.indicator_signals.pivot)}`}
                      >
                        {signal.indicator_signals.pivot.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 border rounded-md p-3">
                  <p className="text-sm font-medium mb-2">Indicator Agreement</p>
                  <div className="flex justify-between text-sm">
                    <span>Buy: {signal.indicators_agreement.buy}</span>
                    <span>Sell: {signal.indicators_agreement.sell}</span>
                    <span>Neutral: {signal.indicators_agreement.neutral}</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="summary" className="pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">Overall</span>
                    <Badge 
                      className={`mt-1 ${
                        signal.summary.summary === 'BUY' ? 'bg-green-600' : 
                        signal.summary.summary === 'SELL' ? 'bg-red-600' : 
                        'bg-gray-600'
                      }`}
                    >
                      {signal.summary.summary}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">Moving Avg</span>
                    <Badge 
                      className={`mt-1 ${
                        signal.summary.moving_averages === 'BUY' ? 'bg-green-600' : 
                        signal.summary.moving_averages === 'SELL' ? 'bg-red-600' : 
                        'bg-gray-600'
                      }`}
                    >
                      {signal.summary.moving_averages}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">Oscillators</span>
                    <Badge 
                      className={`mt-1 ${
                        signal.summary.oscillators === 'BUY' ? 'bg-green-600' : 
                        signal.summary.oscillators === 'SELL' ? 'bg-red-600' : 
                        'bg-gray-600'
                      }`}
                    >
                      {signal.summary.oscillators}
                    </Badge>
                  </div>
                </div>
                
                {signal.moving_averages && (
                  <div className="mt-4 border rounded-md p-3">
                    <p className="text-sm font-medium mb-2">Moving Averages</p>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Buy:</span> {signal.moving_averages.buy}
                    </div>
                      <div>
                        <span className="font-medium">Sell:</span> {signal.moving_averages.sell}
                  </div>
                      <div>
                        <span className="font-medium">Neutral:</span> {signal.moving_averages.neutral}
                </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            {/* Action message instead of button */}
            <div className="pt-2">
              <div className="rounded bg-blue-50 text-blue-800 px-4 py-3 text-center text-sm font-medium">
                To place a trade, please go to the <span className="font-semibold">Trading</span> tab.
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
} 