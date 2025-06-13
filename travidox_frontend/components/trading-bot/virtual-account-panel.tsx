"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowUp, ArrowDown, RefreshCw, DollarSign, TrendingUp, Clock, RefreshCcw } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { PositionPrice } from './position-price'

interface VirtualAccount {
  balance: number
  equity: number
  margin: number
  free_margin: number
  floating_pnl: number
}

interface VirtualPosition {
  position_id: string
  symbol: string
  order_type: string
  volume: number
  open_price: number
  current_price?: number
  profit_loss?: number
  open_time: string
  status: string
}

export function VirtualAccountPanel() {
  const { user, getIdToken } = useAuth()
  const [account, setAccount] = useState<VirtualAccount | null>(null)
  const [positions, setPositions] = useState<VirtualPosition[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  
  // Fetch account data
  const fetchAccountData = async () => {
    if (!user) return
    
    setRefreshing(true)
    try {
      const token = await getIdToken()
      
      // Fetch account info
      const accountRes = await fetch('/api/virtual-account', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!accountRes.ok) {
        throw new Error('Failed to fetch account data')
      }
      
      const accountData = await accountRes.json()
      
      if (!accountData.success) {
        throw new Error(accountData.error || 'Failed to fetch account data')
      }
      
      setAccount(accountData.account || {
        balance: 1000,
        equity: 1000,
        margin: 0,
        free_margin: 1000,
        floating_pnl: 0
      })
      
      // Fetch positions
      const positionsRes = await fetch('/api/virtual-positions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!positionsRes.ok) {
        throw new Error('Failed to fetch positions')
      }
      
      const positionsData = await positionsRes.json()
      
      if (!positionsData.success) {
        throw new Error(positionsData.error || 'Failed to fetch positions')
      }
      
      // Ensure positions is always an array
      const positionsArray = Array.isArray(positionsData.positions) ? positionsData.positions : []
      setPositions(positionsArray.filter((p: any) => !p.closed))
      
      // Fetch history
      const historyRes = await fetch('/api/virtual-history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!historyRes.ok) {
        throw new Error('Failed to fetch trading history')
      }
      
      const historyData = await historyRes.json()
      
      if (!historyData.success) {
        throw new Error(historyData.error || 'Failed to fetch trading history')
      }
      
      // Ensure history is always an array
      setHistory(Array.isArray(historyData.history) ? historyData.history : [])
      
      setError(null)
    } catch (error: any) {
      console.error('Error fetching virtual account data:', error)
      setError(error.message || 'Failed to fetch account data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }
  
  // Reset positions to fix P&L calculation
  const resetPositions = async () => {
    if (!user) return
    
    try {
      const token = await getIdToken()
      
      // Show loading toast
      toast({
        title: "Resetting positions...",
        description: "Please wait while we recalculate your positions",
      });
      
      const response = await fetch('/api/reset-positions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to reset positions')
      }
      
      const data = await response.json()
      
      // Show success toast
      toast({
        title: "Positions reset successfully",
        description: data.message || "Your positions have been recalculated",
        variant: "default",
      });
      
      // Refresh data
      fetchAccountData()
    } catch (error: any) {
      console.error('Error resetting positions:', error)
      
      // Show error toast
      toast({
        title: "Failed to reset positions",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  }
  
  // Close position
  const closePosition = async (positionId: string) => {
    if (!user) return
    
    try {
      const token = await getIdToken()
      
      // Show loading toast
      toast({
        title: "Closing position...",
        description: "Please wait while we process your request",
      });
      
      const response = await fetch(`/api/virtual-position/close/${positionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to close position')
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to close position')
      }
      
      // Show success toast
      toast({
        title: "Position closed successfully",
        description: data.message || `Profit/Loss: ${formatCurrency(data.profit_loss || 0)}`,
        variant: "default",
      });
      
      // Refresh data
      fetchAccountData()
    } catch (error: any) {
      console.error('Error closing position:', error)
      
      // Show error toast
      toast({
        title: "Failed to close position",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  }
  
  // Update position with real-time data
  const updatePositionData = (positionId: string, currentPrice: number, profitLoss: number) => {
    setPositions(prev => prev.map(pos => {
      if (pos.position_id === positionId) {
        return {
          ...pos,
          current_price: currentPrice,
          profit_loss: profitLoss
        };
      }
      return pos;
    }));
    
    // Update floating P&L in account
    if (account) {
      const totalPnL = positions.reduce((sum, pos) => {
        // If this is the position we're updating, use the new value
        if (pos.position_id === positionId) {
          return sum + profitLoss;
        }
        // Otherwise use the existing value
        return sum + (pos.profit_loss || 0);
      }, 0);
      
      setAccount({
        ...account,
        floating_pnl: totalPnL,
        equity: account.balance + totalPnL
      });
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchAccountData()
    }
  }, [user])
  
  // Set up periodic refresh
  useEffect(() => {
    if (!user) return
    
    // Refresh every 10 seconds
    const interval = setInterval(() => {
      fetchAccountData()
    }, 10000)
    
    return () => clearInterval(interval)
  }, [user])
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Invalid Date"
    
    try {
      const date = new Date(dateString)
      return date.toLocaleString()
    } catch (e) {
      return "Invalid Date"
    }
  }
  
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p>Loading account data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col justify-center items-center h-40">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchAccountData}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Virtual Trading Account</CardTitle>
            <CardDescription>Practice trading with virtual funds</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetPositions}
              disabled={refreshing}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Reset P&L
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchAccountData} 
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {account && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="text-2xl font-bold">{formatCurrency(account.balance)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Your starting funds plus closed trades</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary opacity-80" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(account.equity)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Your balance + open positions value</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary opacity-80" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Profit/Loss</p>
                    <p className={`text-2xl font-bold ${account.floating_pnl > 0 ? 'text-green-600' : account.floating_pnl < 0 ? 'text-red-600' : ''}`}>
                      {formatCurrency(account.floating_pnl || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Unrealized gain/loss on open positions</p>
                  </div>
                  {account.floating_pnl > 0 ? (
                    <ArrowUp className="h-8 w-8 text-green-600" />
                  ) : account.floating_pnl < 0 ? (
                    <ArrowDown className="h-8 w-8 text-red-600" />
                  ) : (
                    <TrendingUp className="h-8 w-8 text-primary opacity-80" />
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Available Funds</p>
                    <p className="text-2xl font-bold">{formatCurrency(account.free_margin)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Money available for new trades</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <Tabs defaultValue="positions" className="mt-6">
          <TabsList className="mb-4 w-full max-w-md">
            <TabsTrigger value="positions" className="flex-1">Open Positions</TabsTrigger>
            <TabsTrigger value="history" className="flex-1">Trading History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="positions">
            {!positions || positions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
                <p className="text-lg">No open positions</p>
                <p className="text-sm mt-2">Use the trading panel to open positions</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Symbol</th>
                      <th className="text-left py-3 px-4 font-medium">Type</th>
                      <th className="text-left py-3 px-4 font-medium">Volume</th>
                      <th className="text-left py-3 px-4 font-medium">Open Price</th>
                      <th className="text-left py-3 px-4 font-medium">Current Price</th>
                      <th className="text-left py-3 px-4 font-medium">Profit/Loss</th>
                      <th className="text-left py-3 px-4 font-medium">Open Time</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((position) => (
                      <tr key={position.position_id} className="border-t hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">{position.symbol.length === 6 ? `${position.symbol.slice(0, 3)}/${position.symbol.slice(3, 6)}` : position.symbol}</td>
                        <td className="py-3 px-4">
                          <Badge variant={position.order_type === 'BUY' ? 'default' : 'destructive'}>
                            {position.order_type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{position.volume}</td>
                        <td className="py-3 px-4">{position.open_price?.toFixed(5) || '-'}</td>
                        <td className="py-3 px-4">
                          <PositionPrice 
                            symbol={position.symbol}
                            orderType={position.order_type as 'BUY' | 'SELL'}
                            openPrice={position.open_price}
                            volume={position.volume}
                            onPriceUpdate={(price, pnl) => 
                              updatePositionData(position.position_id, price, pnl)
                            }
                          />
                        </td>
                        <td className={`py-3 px-4 ${
                          (position.profit_loss || 0) > 0 ? 'text-green-600 font-medium' : 
                          (position.profit_loss || 0) < 0 ? 'text-red-600 font-medium' : ''
                        }`}>
                          {formatCurrency(position.profit_loss || 0)}
                        </td>
                        <td className="py-3 px-4">{formatDate(position.open_time)}</td>
                        <td className="py-3 px-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => closePosition(position.position_id)}
                          >
                            Close
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            {!history || history.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
                <p className="text-lg">No trading history</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Type</th>
                      <th className="text-left py-3 px-4 font-medium">Symbol</th>
                      <th className="text-left py-3 px-4 font-medium">Volume</th>
                      <th className="text-left py-3 px-4 font-medium">Price</th>
                      <th className="text-left py-3 px-4 font-medium">Profit/Loss</th>
                      <th className="text-left py-3 px-4 font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry) => (
                      <tr key={entry.id} className="border-t hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <Badge variant={entry.type === 'OPEN' ? 'outline' : 'secondary'}>
                            {entry.type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{entry.symbol.length === 6 ? `${entry.symbol.slice(0, 3)}/${entry.symbol.slice(3, 6)}` : entry.symbol}</td>
                        <td className="py-3 px-4">{entry.volume}</td>
                        <td className="py-3 px-4">{entry.price}</td>
                        <td className={`py-3 px-4 ${
                          (entry.profit_loss || 0) > 0 ? 'text-green-600' : 
                          (entry.profit_loss || 0) < 0 ? 'text-red-600' : ''
                        }`}>
                          {entry.profit_loss ? formatCurrency(entry.profit_loss) : '-'}
                        </td>
                        <td className="py-3 px-4">{formatDate(entry.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <p className="text-xs text-muted-foreground">
          <Clock className="h-3 w-3 inline mr-1" />
          Virtual trading account with $1,000 starting balance. All trades are simulated.
        </p>
      </CardFooter>
    </Card>
  )
}
