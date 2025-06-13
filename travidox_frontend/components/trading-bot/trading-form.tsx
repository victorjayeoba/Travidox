"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency } from '@/lib/utils'
import { useTradingAccount } from '@/hooks/useTradingAccount'
import { FOREX_SYMBOLS } from '@/lib/market-data'
import { TooltipInfo } from '@/components/ui/tooltip-info'

interface TradingFormProps {
  onOrderPlaced?: () => void;
}

export function TradingForm({ onOrderPlaced }: TradingFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const { placeOrder, marketPrices, loading: tradingLoading, accountMetrics } = useTradingAccount()
  
  const [selectedSymbol, setSelectedSymbol] = useState<string>('EURUSD')
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY')
  const [volume, setVolume] = useState<string>('0.01')
  const [stopLoss, setStopLoss] = useState<string>('')
  const [takeProfit, setTakeProfit] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  
  // Get current price for the selected symbol
  const currentPrice = marketPrices.get(selectedSymbol);
  const bid = currentPrice?.bid || 0;
  const ask = currentPrice?.ask || 0;
  const priceLoading = !currentPrice;
  
  // Calculate estimated margin for the trade
  const calculateEstimatedMargin = () => {
    if (!accountMetrics || !volume || isNaN(parseFloat(volume))) return 0;
    
    const volumeValue = parseFloat(volume);
    if (volumeValue <= 0) return 0;
    
    const price = orderType === 'BUY' ? ask : bid;
    if (!price || isNaN(price) || price <= 0) return 0;
    
    const standardLotSize = 100000; // Standard lot size for forex
    
    // Contract value = volume (in lots) * standard lot size * price
    const contractValue = volumeValue * standardLotSize * price;
    
    // Required margin = contract value / leverage
    const leverage = accountMetrics.leverage || 100;
    if (leverage <= 0) return contractValue; // Prevent division by zero
    
    return contractValue / leverage;
  };
  
  // Check if there's enough free margin
  const hasEnoughMargin = () => {
    if (!accountMetrics) return true;
    const estimatedMargin = calculateEstimatedMargin();
    return !isNaN(estimatedMargin) && accountMetrics.freeMargin >= estimatedMargin;
  };
  
  // Place order
  const handlePlaceOrder = async (type: 'BUY' | 'SELL') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to place orders",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedSymbol || !volume) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Validate volume
    const volumeNum = parseFloat(volume);
    if (isNaN(volumeNum) || volumeNum <= 0 || volumeNum > 100) {
      toast({
        title: "Invalid volume",
        description: "Volume must be between 0.01 and 100",
        variant: "destructive",
      });
      return;
    }
    
    // Check if there's enough margin
    if (!hasEnoughMargin()) {
      toast({
        title: "Insufficient margin",
        description: `You need approximately ${formatCurrency(calculateEstimatedMargin())} margin for this trade`,
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Calculate stop loss and take profit prices if provided
      const pipSize = 0.0001; // Standard pip size for forex
      let stopLossPrice: number | null = null;
      let takeProfitPrice: number | null = null;
      
      // If stop loss is provided as pips
      if (stopLoss && !isNaN(parseFloat(stopLoss))) {
        const pips = parseFloat(stopLoss);
        stopLossPrice = type === 'BUY'
          ? bid - (pips * pipSize)
          : ask + (pips * pipSize);
      }
      
      // If take profit is provided as pips
      if (takeProfit && !isNaN(parseFloat(takeProfit))) {
        const pips = parseFloat(takeProfit);
        takeProfitPrice = type === 'BUY'
          ? ask + (pips * pipSize)
          : bid - (pips * pipSize);
      }
      
      // Place order using Firebase directly
      const positionId = await placeOrder(
        selectedSymbol,
        type,
        volumeNum,
        stopLossPrice,
        takeProfitPrice
      );
      
      if (positionId) {
        // Show success toast with more details
        toast({
          title: `${type} Order Placed Successfully`,
          description: `${volumeNum} lot of ${selectedSymbol} at ${type === 'BUY' ? ask.toFixed(5) : bid.toFixed(5)}`,
          variant: "default",
          duration: 5000, // Show for 5 seconds
          action: (
            <div className="flex flex-col gap-1">
              <div className={`text-xs font-medium ${type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                Est. Margin: {formatCurrency(calculateEstimatedMargin())}
              </div>
              {stopLossPrice && (
                <div className="text-xs">SL: {stopLossPrice.toFixed(5)}</div>
              )}
              {takeProfitPrice && (
                <div className="text-xs">TP: {takeProfitPrice.toFixed(5)}</div>
              )}
            </div>
          ),
        });
        
        // Reset form
        setVolume('0.01');
        setStopLoss('');
        setTakeProfit('');
        
        // Notify parent component to refresh positions
        if (onOrderPlaced) {
          onOrderPlaced();
        }
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      toast({
        title: "Failed to place order",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Format symbol for display
  const formatSymbol = (symbol: string) => {
    if (symbol.length === 6) {
      return `${symbol.slice(0, 3)}/${symbol.slice(3, 6)}`;
    }
    return symbol;
  };
  
  // Calculate estimated margin
  const estimatedMargin = calculateEstimatedMargin();
  const marginWarning = !hasEnoughMargin();
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>Place Order</CardTitle>
        <CardDescription>Trade virtual currency pairs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {/* Account summary */}
          <div className="grid grid-cols-2 gap-2 text-sm pb-2">
            <div>
              <span className="text-muted-foreground">Balance:</span>
              <span className="font-medium ml-1">{formatCurrency(accountMetrics?.balance || 0)}</span>
              <TooltipInfo term="Balance" description="" />
            </div>
            <div>
              <span className="text-muted-foreground">Leverage:</span>
              <span className="font-medium ml-1">1:{accountMetrics?.leverage || 100}</span>
              <TooltipInfo term="Leverage" description="" />
            </div>
            <div>
              <span className="text-muted-foreground">Free Margin:</span>
              <span className="font-medium ml-1">{formatCurrency(accountMetrics?.freeMargin || 0)}</span>
              <TooltipInfo term="Free Margin" description="" />
            </div>
            <div>
              <span className="text-muted-foreground">Margin Level:</span>
              <span className={`font-medium ml-1 ${
                accountMetrics?.marginLevelStatus === 'DANGER' ? 'text-red-600' :
                accountMetrics?.marginLevelStatus === 'WARNING' ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {accountMetrics?.marginLevel === Infinity ? 'No Risk' : `${accountMetrics?.marginLevel.toFixed(2) || 0}%`}
              </span>
              <TooltipInfo term="Margin Level" description="" />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="symbol">Symbol</Label>
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger id="symbol" className="h-11">
                <SelectValue placeholder="Select symbol" />
              </SelectTrigger>
              <SelectContent>
                {FOREX_SYMBOLS.map((symbol) => (
                  <SelectItem key={symbol} value={symbol}>{formatSymbol(symbol)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-muted/50 border-0">
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium text-muted-foreground">Bid</p>
                      <TooltipInfo term="Bid" description="" />
                    </div>
                    <p className="text-lg font-bold">{bid.toFixed(5)}</p>
                  </div>
                  <ArrowDown className="h-5 w-5 text-red-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50 border-0">
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium text-muted-foreground">Ask</p>
                      <TooltipInfo term="Ask" description="" />
                    </div>
                    <p className="text-lg font-bold">{ask.toFixed(5)}</p>
                  </div>
                  <ArrowUp className="h-5 w-5 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Spread information */}
          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <span>Spread: {((ask - bid) * 10000).toFixed(1)} pips</span>
            <TooltipInfo term="Spread" description="" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-1">
              <Label htmlFor="volume">Volume (Lots)</Label>
              <TooltipInfo term="Lot" description="" />
            </div>
            <Input
              id="volume"
              type="number"
              min="0.01"
              max="100"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="h-11"
            />
            <div className="text-sm text-muted-foreground flex items-center">
              <span>Est. Margin Required: {
                isNaN(estimatedMargin) 
                  ? 'Calculating...' 
                  : formatCurrency(estimatedMargin)
              }</span>
              <TooltipInfo term="Margin Used" description="" side="bottom" />
              {marginWarning && estimatedMargin > 0 && (
                <div className="ml-2 flex items-center text-red-500">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span>Insufficient margin</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                <Label htmlFor="stopLoss">Stop Loss (pips)</Label>
                <TooltipInfo term="Stop Loss" description="" />
                <TooltipInfo term="Pip" description="" />
              </div>
              <Input
                id="stopLoss"
                type="number"
                min="0"
                step="1"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="h-11"
                placeholder="e.g., 15"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                <Label htmlFor="takeProfit">Take Profit (pips)</Label>
                <TooltipInfo term="Take Profit" description="" />
              </div>
              <Input
                id="takeProfit"
                type="number"
                min="0"
                step="1"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                className="h-11"
                placeholder="e.g., 30"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 h-12 text-base"
              onClick={() => handlePlaceOrder('BUY')}
              disabled={loading || priceLoading || tradingLoading || marginWarning}
            >
              <ArrowUp className="mr-2 h-5 w-5" />
              Buy
            </Button>
            
            <Button
              className="w-full bg-red-600 hover:bg-red-700 h-12 text-base"
              onClick={() => handlePlaceOrder('SELL')}
              disabled={loading || priceLoading || tradingLoading || marginWarning}
            >
              <ArrowDown className="mr-2 h-5 w-5" />
              Sell
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <p className="text-xs text-muted-foreground">
          <DollarSign className="h-3 w-3 inline mr-1" />
          All trades are executed with virtual funds. No real money is at risk.
        </p>
      </CardFooter>
    </Card>
  );
}
