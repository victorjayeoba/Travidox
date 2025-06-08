import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { useTrading } from '@/hooks/useTrading';

interface TradingFormProps {
  onOrderPlaced?: () => void;
}

export function TradingForm({ onOrderPlaced }: TradingFormProps) {
  const { symbols, placeOrder, refreshPositions, loading } = useTrading();
  
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [volume, setVolume] = useState(0.01);
  const [stopLoss, setStopLoss] = useState(15);
  const [takeProfit, setTakeProfit] = useState(30);
  const [isPlacing, setIsPlacing] = useState(false);
  
  // Get symbol details
  const selectedSymbolDetails = symbols.find(s => s.name === selectedSymbol);
  
  // Filter for forex symbols only
  const forexSymbols = symbols.filter(s => 
    s.name.includes('USD') || 
    s.name.includes('EUR') || 
    s.name.includes('GBP') || 
    s.name.includes('JPY') || 
    s.name.includes('CAD') ||
    s.category === 'forex'
  );
  
  // Place order
  const handlePlaceOrder = async () => {
    try {
      setIsPlacing(true);
      
      // Get current price (normally would come from API)
      // This is a simplification - in a real app, you'd get the current price from the API
      const currentPrice = selectedSymbolDetails?.price || 1.0;
      const pipSize = selectedSymbolDetails?.tick_size || 0.0001;
      
      // Calculate stop loss and take profit prices
      const stopLossPrice = orderType === 'BUY'
        ? currentPrice - (stopLoss * pipSize)
        : currentPrice + (stopLoss * pipSize);
        
      const takeProfitPrice = orderType === 'BUY'
        ? currentPrice + (takeProfit * pipSize)
        : currentPrice - (takeProfit * pipSize);
      
      // Order data
      const orderData = {
        symbol: selectedSymbol,
        order_type: orderType,
        volume: volume,
        stop_loss: stopLoss > 0 ? stopLossPrice : null,
        take_profit: takeProfit > 0 ? takeProfitPrice : null,
      };
      
      console.log('Placing order:', orderData);
      
      // Place order
      await placeOrder(orderData);
      
      // Refresh positions
      await refreshPositions();
      
      // Call callback
      if (onOrderPlaced) {
        onOrderPlaced();
      }
      
      // Success message
      alert(`Order placed successfully: ${orderType} ${volume} ${selectedSymbol}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert(`Error placing order: ${error}`);
    } finally {
      setIsPlacing(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Trade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Symbol Selection */}
        <div className="space-y-2">
          <Label htmlFor="symbol">Symbol</Label>
          <Select 
            value={selectedSymbol} 
            onValueChange={setSelectedSymbol}
          >
            <SelectTrigger id="symbol">
              <SelectValue placeholder="Select symbol" />
            </SelectTrigger>
            <SelectContent>
              {forexSymbols.map((symbol) => (
                <SelectItem key={symbol.name} value={symbol.name}>
                  {symbol.name} - {symbol.description || 'Forex Pair'}
                </SelectItem>
              ))}
              {forexSymbols.length === 0 && (
                <SelectItem value="EURUSD">EURUSD - Euro vs US Dollar</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        {/* Order Type */}
        <div className="space-y-2">
          <Label>Order Type</Label>
          <RadioGroup 
            value={orderType} 
            onValueChange={(v) => setOrderType(v as 'BUY' | 'SELL')}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="BUY" id="buy" />
              <Label htmlFor="buy" className="flex items-center cursor-pointer">
                <Badge className="mr-2 bg-green-100 text-green-800">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  BUY
                </Badge>
                Long Position
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="SELL" id="sell" />
              <Label htmlFor="sell" className="flex items-center cursor-pointer">
                <Badge className="mr-2 bg-red-100 text-red-800">
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                  SELL
                </Badge>
                Short Position
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Volume */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="volume">Volume (Lot Size)</Label>
            <span className="text-sm font-medium">{volume.toFixed(2)}</span>
          </div>
          <Slider
            id="volume"
            min={0.01}
            max={1.00}
            step={0.01}
            value={[volume]}
            onValueChange={(v) => setVolume(v[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.01</span>
            <span>0.50</span>
            <span>1.00</span>
          </div>
        </div>
        
        {/* Stop Loss */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="stop-loss">Stop Loss (pips)</Label>
            <span className="text-sm font-medium">{stopLoss > 0 ? stopLoss : 'Off'}</span>
          </div>
          <Slider
            id="stop-loss"
            min={0}
            max={100}
            step={1}
            value={[stopLoss]}
            onValueChange={(v) => setStopLoss(v[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Off</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
        
        {/* Take Profit */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="take-profit">Take Profit (pips)</Label>
            <span className="text-sm font-medium">{takeProfit > 0 ? takeProfit : 'Off'}</span>
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
            <span>50</span>
            <span>100</span>
          </div>
        </div>
        
        {/* Submit Button */}
        <Button 
          onClick={handlePlaceOrder} 
          disabled={isPlacing || loading} 
          className="w-full mt-4"
        >
          {isPlacing ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Placing Order...
            </>
          ) : (
            <>
              <DollarSign className="h-4 w-4 mr-2" />
              Place {orderType} Order
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
} 