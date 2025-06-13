"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowUp, ArrowDown, RefreshCw, DollarSign, TrendingUp, Clock, RefreshCcw, AlertTriangle, Shield } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { useTradingAccount } from '@/hooks/useTradingAccount'
import { PositionPrice } from './position-price'
import { TooltipInfo } from '@/components/ui/tooltip-info'

export function VirtualAccountPanel() {
  const { user } = useAuth()
  const { 
    account, 
    positions, 
    history, 
    loading, 
    closePosition,
    refreshData,
    accountMetrics
  } = useTradingAccount()
  const [activeTab, setActiveTab] = useState('positions')
  const [closingPositionId, setClosingPositionId] = useState<string | null>(null)
  const { toast } = useToast()
  
  // Handle refresh
  const handleRefresh = async () => {
    try {
      await refreshData();
      
      toast({
        title: "Data refreshed",
        description: "Your trading data has been updated",
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: "Refresh failed",
        description: "Failed to refresh trading data",
        variant: "destructive",
      });
    }
  };
  
  // Handle close position
  const handleClosePosition = async (positionId: string) => {
    if (!user) return;
    
    try {
      setClosingPositionId(positionId);
      
      // Show loading toast
      toast({
        title: "Closing position...",
        description: "Please wait while we process your request",
      });
      
      // Close position using Firebase
      const success = await closePosition(positionId);
      
      if (success) {
        // Show success toast
        toast({
          title: "Position closed successfully",
          description: "Your position has been closed",
          variant: "default",
        });
      } else {
        throw new Error('Failed to close position');
      }
    } catch (error: any) {
      console.error('Error closing position:', error);
      
      // Show error toast
      toast({
        title: "Failed to close position",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setClosingPositionId(null);
    }
  };
  
  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    const date = timestamp instanceof Date 
      ? timestamp 
      : new Date(typeof timestamp === 'object' && 'seconds' in timestamp 
          ? timestamp.seconds * 1000 
          : timestamp);
    
    return date.toLocaleString();
  };
  
  // Get margin level status color
  const getMarginLevelStatusColor = () => {
    if (!accountMetrics) return 'bg-gray-200';
    
    if (accountMetrics.marginLevelStatus === 'DANGER') {
      return 'bg-red-500';
    } else if (accountMetrics.marginLevelStatus === 'WARNING') {
      return 'bg-yellow-500';
    } else {
      return 'bg-green-500';
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Virtual Trading Account</CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Practice trading with virtual funds
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Account Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x border-b">
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              Balance <TooltipInfo term="Balance" description="" />
            </p>
            <p className="text-xl font-bold">
              {loading ? '...' : formatCurrency(accountMetrics?.balance || 0)}
            </p>
          </div>
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              Equity <TooltipInfo term="Equity" description="" />
            </p>
            <p className="text-xl font-bold">
              {loading ? '...' : formatCurrency(Math.min(accountMetrics?.equity || 0, (accountMetrics?.balance || 0) + 1000))}
            </p>
          </div>
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              Margin Used <TooltipInfo term="Margin Used" description="" />
            </p>
            <p className="text-xl font-bold">
              {loading ? '...' : formatCurrency(accountMetrics?.marginUsed || 0)}
            </p>
          </div>
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              Free Margin <TooltipInfo term="Free Margin" description="" />
            </p>
            <p className="text-xl font-bold">
              {loading ? '...' : formatCurrency(accountMetrics?.freeMargin || 0)}
            </p>
          </div>
        </div>
        
        {/* Additional Account Info */}
        <div className="grid grid-cols-3 divide-x border-b">
          <div className="p-3 text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              Leverage <TooltipInfo term="Leverage" description="" />
            </p>
            <p className="text-lg font-semibold">
              {loading ? '...' : `1:${accountMetrics?.leverage || 100}`}
            </p>
          </div>
          <div className="p-3 text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              Open P/L <TooltipInfo term="Open P/L" description="" />
            </p>
            <p className={`text-lg font-semibold ${
              accountMetrics?.openPL && accountMetrics.openPL > 0 
                ? 'text-green-600' 
                : accountMetrics?.openPL && accountMetrics.openPL < 0 
                  ? 'text-red-600' 
                  : ''
            }`}>
              {loading ? '...' : formatCurrency(Math.min(Math.abs(accountMetrics?.openPL || 0), 1000) * (accountMetrics?.openPL && accountMetrics.openPL < 0 ? -1 : 1))}
            </p>
          </div>
          <div className="p-3 text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center">
              <AlertTriangle className={`h-4 w-4 mr-1 ${
                accountMetrics?.marginLevelStatus === 'DANGER' ? 'text-red-500' :
                accountMetrics?.marginLevelStatus === 'WARNING' ? 'text-yellow-500' : 'text-green-500'
              }`} />
              Margin Level <TooltipInfo term="Margin Level" description="" />
            </p>
            <div className="flex items-center justify-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${getMarginLevelStatusColor()}`}></div>
              <span className={`font-medium ml-1 ${
                accountMetrics?.marginLevelStatus === 'DANGER' ? 'text-red-600' :
                accountMetrics?.marginLevelStatus === 'WARNING' ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {loading ? '...' : accountMetrics?.marginLevel === Infinity ? 'No Risk' : `${accountMetrics?.marginLevel.toFixed(2)}%`}
              </span>
            </div>
          </div>
        </div>
        
        {/* Positions and History Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="positions">Open Positions</TabsTrigger>
              <TabsTrigger value="history">Trading History</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="positions" className="p-0">
            <div className="max-h-[400px] overflow-auto">
              {loading ? (
                <div className="p-6 text-center">
                  <p>Loading positions...</p>
                </div>
              ) : positions.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <p>No open positions. Place a trade to get started.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-2 pl-6">Symbol</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-right p-2">Volume</th>
                      <th className="text-right p-2">Open Price</th>
                      <th className="text-right p-2">Current</th>
                      <th className="text-right p-2">P/L</th>
                      <th className="text-right p-2 pr-6">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((position) => (
                      <tr key={position.position_id} className="border-b hover:bg-muted/30">
                        <td className="p-2 pl-6">{position.symbol}</td>
                        <td className="p-2">
                          {position.order_type === 'BUY' ? (
                            <Badge className="bg-green-100 text-green-800">
                              <ArrowUp className="mr-1 h-3 w-3" />
                              BUY
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              <ArrowDown className="mr-1 h-3 w-3" />
                              SELL
                            </Badge>
                          )}
                        </td>
                        <td className="p-2 text-right">{position.volume.toFixed(2)}</td>
                        <td className="p-2 text-right">{position.open_price.toFixed(5)}</td>
                        <td className="p-2 text-right">
                          {position.current_price?.toFixed(5) || 'N/A'}
                        </td>
                        <td className={`p-2 text-right ${
                          position.profit_loss && position.profit_loss > 0 
                            ? 'text-green-600' 
                            : position.profit_loss && position.profit_loss < 0 
                              ? 'text-red-600' 
                              : ''
                        }`}>
                          {position.profit_loss?.toFixed(2) || '0.00'}
                        </td>
                        <td className="p-2 pr-6 text-right">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleClosePosition(position.position_id)}
                            disabled={closingPositionId === position.position_id}
                          >
                            {closingPositionId === position.position_id ? (
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                              'Close'
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="p-0">
            <div className="max-h-[400px] overflow-auto">
              {loading ? (
                <div className="p-6 text-center">
                  <p>Loading history...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <p>No trading history yet. Close a position to see it here.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-2 pl-6">Symbol</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-right p-2">Volume</th>
                      <th className="text-right p-2">Open Price</th>
                      <th className="text-right p-2">Close Price</th>
                      <th className="text-right p-2">P/L</th>
                      <th className="text-right p-2 pr-6">Closed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((trade) => (
                      <tr key={trade.trade_id} className="border-b hover:bg-muted/30">
                        <td className="p-2 pl-6">{trade.symbol}</td>
                        <td className="p-2">
                          {trade.order_type === 'BUY' ? (
                            <Badge className="bg-green-100 text-green-800">
                              <ArrowUp className="mr-1 h-3 w-3" />
                              BUY
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              <ArrowDown className="mr-1 h-3 w-3" />
                              SELL
                            </Badge>
                          )}
                        </td>
                        <td className="p-2 text-right">{trade.volume.toFixed(2)}</td>
                        <td className="p-2 text-right">{trade.open_price.toFixed(5)}</td>
                        <td className="p-2 text-right">{trade.close_price.toFixed(5)}</td>
                        <td className={`p-2 text-right ${
                          trade.profit_loss > 0 
                            ? 'text-green-600' 
                            : trade.profit_loss < 0 
                              ? 'text-red-600' 
                              : ''
                        }`}>
                          {trade.profit_loss.toFixed(2)}
                        </td>
                        <td className="p-2 pr-6 text-right">
                          {formatDate(trade.close_time)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t p-4 flex justify-between">
        <div className="flex items-center">
          <Shield className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Margin Level: 
            <span className={`font-medium ml-1 ${
              accountMetrics?.marginLevelStatus === 'DANGER' ? 'text-red-600' :
              accountMetrics?.marginLevelStatus === 'WARNING' ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {loading ? '...' : accountMetrics?.marginLevel === Infinity ? 'No Risk' : `${accountMetrics?.marginLevel.toFixed(2)}%`}
            </span>
          </span>
        </div>
        
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
