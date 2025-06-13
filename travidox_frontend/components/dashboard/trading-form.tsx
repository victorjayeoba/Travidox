import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { useTradingAccount } from '@/hooks/useTradingAccount';
import { FOREX_SYMBOLS } from '@/lib/market-data';

interface TradingFormProps {
  onOrderPlaced?: () => void;
}

export function TradingForm({ onOrderPlaced }: TradingFormProps) {
  const { placeOrder, marketPrices, loading } = useTradingAccount();
  
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [volume, setVolume] = useState(0.01);
  const [stopLoss, setStopLoss] = useState(15);
  const [takeProfit, setTakeProfit] = useState(30);
  const [isPlacing, setIsPlacing] = useState(false);
  
  // Get current price for the selected symbol
  const currentPrice = marketPrices.get(selectedSymbol);
  const pipSize = 0.0001; // Standard pip size for forex
  
  // Place order
  const handlePlaceOrder = async () => {
    try {
      if (!currentPrice) {
        alert('Cannot place order: Market price not available');
        return;
      }
      
      setIsPlacing(true);
      
      // Calculate stop loss and take profit prices
      const stopLossPrice = orderType === 'BUY'
        ? (currentPrice.bid - (stopLoss * pipSize))
        : (currentPrice.ask + (stopLoss * pipSize));
        
      const takeProfitPrice = orderType === 'BUY'
        ? (currentPrice.ask + (takeProfit * pipSize))
        : (currentPrice.bid - (takeProfit * pipSize));
      
      // Place order
      const positionId = await placeOrder(
        selectedSymbol,
        orderType,
        volume,
        stopLoss > 0 ? stopLossPrice : null,
        takeProfit > 0 ? takeProfitPrice : null
      );
      
      if (positionId) {
        // Call callback
        if (onOrderPlaced) {
          onOrderPlaced();
        }
        
        // Success message
        alert(`Order placed successfully: ${orderType} ${volume} ${selectedSymbol}`);
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert(`Error placing order: ${error instanceof Error ? error.message : String(error)}`);
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
              {FOREX_SYMBOLS.map((symbol) => (
                <SelectItem key={symbol} value={symbol}>
                  {symbol} - Forex Pair
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Current Price Display */}
          {currentPrice && (
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-muted-foreground">Current Price:</span>
              <div>
                <span className="font-medium text-green-600 mr-2">Bid: {currentPrice.bid.toFixed(5)}</span>
                <span className="font-medium text-red-600">Ask: {currentPrice.ask.toFixed(5)}</span>
              </div>
            </div>
          )}
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
          disabled={isPlacing || loading || !currentPrice} 
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