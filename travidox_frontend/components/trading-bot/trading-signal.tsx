"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowUp, ArrowDown, Loader2, AlertCircle, RefreshCw, BarChart2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/components/auth/auth-provider'

interface TradingSignal {
  symbol: string;
  interval: string;
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
}

interface TradingSignalProps {
  symbol: string;
  interval?: string;
  onPlaceOrder?: (orderType: 'BUY' | 'SELL', symbol: string) => void;
}

export function TradingSignalComponent({ 
  symbol, 
  interval = '1h',
  onPlaceOrder
}: TradingSignalProps) {
  const [signal, setSignal] = useState<TradingSignal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Format symbol for display
  const formattedSymbol = symbol.length === 6 
    ? `${symbol.slice(0, 3)}/${symbol.slice(3, 6)}`
    : symbol;
  
  // Fetch trading signals
  const fetchSignal = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/trading-signals/${symbol}?interval=${interval}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch trading signals');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }
      
      // Combine signal data with confidence
      const signalWithConfidence: TradingSignal = {
        ...data.signal,
        confidence: data.confidence
      };
      
      setSignal(signalWithConfidence);
    } catch (error: any) {
      console.error('Error fetching trading signals:', error);
      setError(error.message || 'Failed to fetch trading signals');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSignal();
    setIsRefreshing(false);
  };
  
  // Handle place order
  const handlePlaceOrder = (orderType: 'BUY' | 'SELL') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to place orders",
        variant: "destructive",
      });
      return;
    }
    
    if (onPlaceOrder) {
      onPlaceOrder(orderType, symbol);
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
  
  // Fetch signals on component mount
  useEffect(() => {
    fetchSignal();
    
    // Set up interval to refresh every 5 minutes
    const intervalId = setInterval(() => {
      fetchSignal();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [symbol, interval]);
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle>Trading Signal</CardTitle>
            <Badge variant="outline">{formattedSymbol}</Badge>
            <Badge variant="secondary">{interval}</Badge>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={loading || isRefreshing}
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
        {loading && !signal ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Fetching trading signals...</p>
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
            
            {/* Signal Details */}
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="ma">Moving Avg</TabsTrigger>
                <TabsTrigger value="osc">Oscillators</TabsTrigger>
              </TabsList>
              
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
              </TabsContent>
              
              <TabsContent value="ma" className="pt-4">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">Buy</span>
                    <span className="font-bold text-green-600">{signal.moving_averages.buy}</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">Neutral</span>
                    <span className="font-bold">{signal.moving_averages.neutral}</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">Sell</span>
                    <span className="font-bold text-red-600">{signal.moving_averages.sell}</span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="flex h-2.5 rounded-full">
                      <div 
                        className="bg-green-600 rounded-l-full" 
                        style={{ width: `${signal.moving_averages.buy / (signal.moving_averages.buy + signal.moving_averages.neutral + signal.moving_averages.sell) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-gray-400" 
                        style={{ width: `${signal.moving_averages.neutral / (signal.moving_averages.buy + signal.moving_averages.neutral + signal.moving_averages.sell) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-red-600 rounded-r-full" 
                        style={{ width: `${signal.moving_averages.sell / (signal.moving_averages.buy + signal.moving_averages.neutral + signal.moving_averages.sell) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="osc" className="pt-4">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">Buy</span>
                    <span className="font-bold text-green-600">{signal.oscillators.buy}</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">Neutral</span>
                    <span className="font-bold">{signal.oscillators.neutral}</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">Sell</span>
                    <span className="font-bold text-red-600">{signal.oscillators.sell}</span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="flex h-2.5 rounded-full">
                      <div 
                        className="bg-green-600 rounded-l-full" 
                        style={{ width: `${signal.oscillators.buy / (signal.oscillators.buy + signal.oscillators.neutral + signal.oscillators.sell) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-gray-400" 
                        style={{ width: `${signal.oscillators.neutral / (signal.oscillators.buy + signal.oscillators.neutral + signal.oscillators.sell) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-red-600 rounded-r-full" 
                        style={{ width: `${signal.oscillators.sell / (signal.oscillators.buy + signal.oscillators.neutral + signal.oscillators.sell) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : null}
      </CardContent>
      
      {signal && (
        <CardFooter className="flex gap-2 pt-2">
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 h-12 text-base"
            onClick={() => handlePlaceOrder('BUY')}
            disabled={loading || isRefreshing}
          >
            <ArrowUp className="mr-2 h-5 w-5" />
            Buy {formattedSymbol}
          </Button>
          
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700 h-12 text-base"
            onClick={() => handlePlaceOrder('SELL')}
            disabled={loading || isRefreshing}
          >
            <ArrowDown className="mr-2 h-5 w-5" />
            Sell {formattedSymbol}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 