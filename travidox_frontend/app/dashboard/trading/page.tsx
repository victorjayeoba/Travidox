"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TradingForm } from '@/components/dashboard/trading-form';
import { TradingPositions } from '@/components/dashboard/trading-positions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useTradingAccount } from '@/hooks/useTradingAccount';
import { Skeleton } from '@/components/ui/skeleton';

export default function TradingPage() {
  const { user } = useAuth();
  const { account, loading } = useTradingAccount();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to access the trading platform.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trading Platform</h1>
          <p className="text-muted-foreground">
            Practice trading with virtual funds. Your balance: 
            {loading ? (
              <Skeleton className="h-4 w-24 inline-block ml-2" />
            ) : (
              <span className="font-medium ml-2">${account?.balance.toFixed(2) || '1,000.00'}</span>
            )}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Trading Form */}
        <div className="md:col-span-1">
          <TradingForm />
        </div>
        
        {/* Trading Positions and History */}
        <div className="md:col-span-2">
          <TradingPositions />
        </div>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Trading Information</CardTitle>
            <CardDescription>
              Important information about virtual trading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="about">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="rules">Trading Rules</TabsTrigger>
                <TabsTrigger value="tips">Trading Tips</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Virtual Trading Platform</h3>
                  <p className="text-muted-foreground">
                    This is a virtual trading platform where you can practice trading with $1,000 of virtual money.
                    All trades are simulated and no real money is involved.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Real-Time Data</h3>
                  <p className="text-muted-foreground">
                    The platform uses real-time market data to simulate trading conditions as close to reality as possible.
                    Prices are updated every few seconds to reflect actual market movements.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="rules" className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Margin Requirements</h3>
                  <p className="text-muted-foreground">
                    Each trade requires a margin of 1% of the position value. For example, a trade with a volume of 0.1 lots
                    on EURUSD at a price of 1.0850 would require a margin of approximately $1.09.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Stop Loss and Take Profit</h3>
                  <p className="text-muted-foreground">
                    You can set stop loss and take profit levels for your trades. These are executed automatically
                    when the price reaches the specified level.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Position Sizing</h3>
                  <p className="text-muted-foreground">
                    The minimum position size is 0.01 lots and the maximum is 1.00 lot. Each lot represents 100,000 units
                    of the base currency.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="tips" className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Risk Management</h3>
                  <p className="text-muted-foreground">
                    Never risk more than 1-2% of your account on a single trade. This helps preserve your capital
                    for future trading opportunities.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Use Stop Losses</h3>
                  <p className="text-muted-foreground">
                    Always use stop losses to protect your account from unexpected market movements. This is
                    one of the most important rules in trading.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Keep a Trading Journal</h3>
                  <p className="text-muted-foreground">
                    Track your trades and analyze your performance. This helps you identify patterns and improve
                    your trading strategy over time.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 