import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTradingAccount } from '@/hooks/useTradingAccount';
import { VirtualPosition, VirtualTradeHistory } from '@/lib/firebase-trading';
import { ArrowUpRight, ArrowDownRight, X, RefreshCw } from 'lucide-react';
import { TooltipInfo } from '@/components/ui/tooltip-info'
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function TradingPositions() {
  const { user } = useAuth();
  const { 
    positions, 
    history, 
    account, 
    closePosition, 
    loading,
    refreshData
  } = useTradingAccount();
  const [closingPositionId, setClosingPositionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('positions');
  const { toast } = useToast();
  const isMobileQuery = useMediaQuery('(max-width: 640px)');
  const [isMobile, setIsMobile] = useState(false);
  
  // Update isMobile state after client-side hydration
  useEffect(() => {
    setIsMobile(isMobileQuery);
  }, [isMobileQuery]);
  
  // Handle closing a position
  const handleClosePosition = async (positionId: string) => {
    try {
      setClosingPositionId(positionId);
      await closePosition(positionId);
    } catch (error) {
      console.error('Error closing position:', error);
      toast({
        title: "Error closing position",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
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
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Trading Activity</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="positions">Open Positions</TabsTrigger>
            <TabsTrigger value="history">Trading History</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="positions" className="flex-1 flex flex-col">
          <CardContent className="flex-1 overflow-auto p-0">
            {positions.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No open positions. Place a trade to get started.
              </div>
            ) : (
              <div className="w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Type <TooltipInfo term="Order Type" description="BUY (long) positions profit when price rises. SELL (short) positions profit when price falls." />
                        </div>
                      </TableHead>
                      {!isMobile && (
                        <TableHead className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            Volume <TooltipInfo term="Lot" description="" />
                          </div>
                        </TableHead>
                      )}
                      {!isMobile && (
                        <TableHead className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            Open Price <TooltipInfo term="Open Price" description="The price at which the position was opened." />
                          </div>
                        </TableHead>
                      )}
                      <TableHead className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          Current <TooltipInfo term="Current Price" description="The current market price used to calculate profit/loss." />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          P/L <TooltipInfo term="Open P/L" description="" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positions.map((position) => (
                      <TableRow key={position.position_id}>
                        <TableCell className="font-medium">{position.symbol}</TableCell>
                        <TableCell>
                          {position.order_type === 'BUY' ? (
                            <Badge className="bg-green-100 text-green-800">
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                              BUY
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                              SELL
                            </Badge>
                          )}
                        </TableCell>
                        {!isMobile && (
                          <TableCell className="text-right">{position.volume.toFixed(2)}</TableCell>
                        )}
                        {!isMobile && (
                          <TableCell className="text-right">{position.open_price.toFixed(5)}</TableCell>
                        )}
                        <TableCell className="text-right">{position.current_price?.toFixed(5) || 'N/A'}</TableCell>
                        <TableCell className={`text-right ${
                          position.profit_loss && position.profit_loss > 0 
                            ? 'text-green-600' 
                            : position.profit_loss && position.profit_loss < 0 
                              ? 'text-red-600' 
                              : ''
                        }`}>
                          {position.profit_loss?.toFixed(2) || '0.00'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleClosePosition(position.position_id)}
                            disabled={closingPositionId === position.position_id}
                          >
                            {closingPositionId === position.position_id ? (
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            ) : isMobile ? (
                              <X className="h-4 w-4" />
                            ) : (
                              <>
                                <X className="h-4 w-4 mr-1" />
                                Close
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          
          {account && (
            <CardFooter className="border-t flex flex-wrap justify-between">
              <div className="mb-2 sm:mb-0">
                <span className="text-sm text-muted-foreground mr-2">Balance:</span>
                <span className="font-medium">${account.balance.toFixed(2)}</span>
              </div>
              <div className="mb-2 sm:mb-0">
                <span className="text-sm text-muted-foreground mr-2">Equity:</span>
                <span className="font-medium">${account.equity.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground mr-2">Open P/L:</span>
                <span className={`font-medium ${account.equity > account.balance ? 'text-green-600' : account.equity < account.balance ? 'text-red-600' : ''}`}>
                  ${(account.equity - account.balance).toFixed(2)}
                </span>
              </div>
            </CardFooter>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="flex-1 flex flex-col">
          <CardContent className="flex-1 overflow-auto p-0">
            {history.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No trading history yet. Close a position to see it here.
              </div>
            ) : (
              <div className="w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Type</TableHead>
                      {!isMobile && <TableHead className="text-right">Volume</TableHead>}
                      {!isMobile && <TableHead className="text-right">Open Price</TableHead>}
                      {!isMobile && <TableHead className="text-right">Close Price</TableHead>}
                      <TableHead className="text-right">P/L</TableHead>
                      {!isMobile && <TableHead className="text-right">Closed At</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((trade) => (
                      <TableRow key={trade.trade_id}>
                        <TableCell className="font-medium">{trade.symbol}</TableCell>
                        <TableCell>
                          {trade.order_type === 'BUY' ? (
                            <Badge className="bg-green-100 text-green-800">
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                              BUY
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                              SELL
                            </Badge>
                          )}
                        </TableCell>
                        {!isMobile && <TableCell className="text-right">{trade.volume.toFixed(2)}</TableCell>}
                        {!isMobile && <TableCell className="text-right">{trade.open_price.toFixed(5)}</TableCell>}
                        {!isMobile && <TableCell className="text-right">{trade.close_price.toFixed(5)}</TableCell>}
                        <TableCell className={`text-right ${
                          trade.profit_loss > 0 
                            ? 'text-green-600' 
                            : trade.profit_loss < 0 
                              ? 'text-red-600' 
                              : ''
                        }`}>
                          {trade.profit_loss.toFixed(2)}
                        </TableCell>
                        {!isMobile && (
                          <TableCell className="text-right">
                            {formatDate(trade.close_time)}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
} 