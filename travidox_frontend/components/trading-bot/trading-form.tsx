"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { ArrowUp, ArrowDown, TrendingUp, DollarSign } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'
import { formatCurrency } from '@/lib/utils'
import { useMarketData } from '@/hooks/useMarketData'

interface TradingFormProps {
  onOrderPlaced?: () => void;
}

export function TradingForm({ onOrderPlaced }: TradingFormProps) {
  const { user, getIdToken } = useAuth()
  const { toast } = useToast()
  
  const [symbols, setSymbols] = useState<string[]>([
    'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF', 'NZDUSD'
  ])
  const [selectedSymbol, setSelectedSymbol] = useState<string>('EURUSD')
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY')
  const [volume, setVolume] = useState<string>('0.01')
  const [stopLoss, setStopLoss] = useState<string>('')
  const [takeProfit, setTakeProfit] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  
  // Use our real-time market data hook
  const { bid, ask, loading: priceLoading, error: priceError } = useMarketData(selectedSymbol)
  
  // Place order
  const placeOrder = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to place orders",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedSymbol || !orderType || !volume) {
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
    
    setLoading(true);
    
    try {
      const token = await getIdToken();
      
      const orderData = {
        symbol: selectedSymbol,
        order_type: orderType,
        volume: volumeNum,
        stop_loss: stopLoss ? parseFloat(stopLoss) : null,
        take_profit: takeProfit ? parseFloat(takeProfit) : null,
      };
      
      const response = await fetch('/api/virtual-order', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }
      
      // Show success toast with more details
      toast({
        title: `${orderType} Order Placed Successfully`,
        description: `${volumeNum} lot of ${selectedSymbol} at ${data.price.toFixed(5)}`,
        variant: "default",
      });
      
      // Reset form
      setVolume('0.01');
      setStopLoss('');
      setTakeProfit('');
      
      // Notify parent component to refresh positions
      if (onOrderPlaced) {
        onOrderPlaced();
      }
      
      // Add a small delay then trigger another refresh
      setTimeout(() => {
        if (onOrderPlaced) {
          onOrderPlaced();
        }
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Failed to place order",
        description: error.message || "An unknown error occurred",
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
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>Place Order</CardTitle>
        <CardDescription>Trade virtual currency pairs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="space-y-3">
            <Label htmlFor="symbol">Symbol</Label>
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger id="symbol" className="h-11">
                <SelectValue placeholder="Select symbol" />
              </SelectTrigger>
              <SelectContent>
                {symbols.map((symbol) => (
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
                    <p className="text-sm font-medium text-muted-foreground">Bid</p>
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
                    <p className="text-sm font-medium text-muted-foreground">Ask</p>
                    <p className="text-lg font-bold">{ask.toFixed(5)}</p>
                  </div>
                  <ArrowUp className="h-5 w-5 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="volume">Volume (Lots)</Label>
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
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="stopLoss">Stop Loss (optional)</Label>
              <Input
                id="stopLoss"
                type="number"
                step="0.00001"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="h-11"
                placeholder="Price level"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="takeProfit">Take Profit (optional)</Label>
              <Input
                id="takeProfit"
                type="number"
                step="0.00001"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                className="h-11"
                placeholder="Price level"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 h-12 text-base"
              onClick={() => {
                setOrderType('BUY');
                placeOrder();
              }}
              disabled={loading}
            >
              <ArrowUp className="mr-2 h-5 w-5" />
              Buy
            </Button>
            
            <Button
              className="w-full bg-red-600 hover:bg-red-700 h-12 text-base"
              onClick={() => {
                setOrderType('SELL');
                placeOrder();
              }}
              disabled={loading}
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
