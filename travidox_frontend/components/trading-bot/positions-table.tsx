"use client"

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { formatCurrency } from '@/lib/utils'
import { useTradingAccount } from '@/hooks/useTradingAccount'
import { VirtualPosition } from '@/lib/firebase-trading'
import { Loader2 } from 'lucide-react'

export function PositionsTable() {
  const { toast } = useToast()
  const { positions, closePosition, loading, marketPrices } = useTradingAccount()
  const [closingPositions, setClosingPositions] = useState<Set<string>>(new Set())
  
  // Handle position close
  const handleClosePosition = async (positionId: string) => {
    setClosingPositions(prev => new Set([...prev, positionId]))
    
    try {
      // Close position directly with Firebase
      const success = await closePosition(positionId)
      
      if (success) {
        toast({
          title: "Position Closed",
          description: "Position was closed successfully",
          variant: "default",
        })
      } else {
        throw new Error('Failed to close position')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to close position",
        variant: "destructive",
      })
    } finally {
      setClosingPositions(prev => {
        const updated = new Set([...prev])
        updated.delete(positionId)
        return updated
      })
    }
  }
  
  // Format symbol for display
  const formatSymbol = (symbol: string) => {
    if (symbol.length === 6) {
      return `${symbol.slice(0, 3)}/${symbol.slice(3, 6)}`
    }
    return symbol
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  
  if (positions.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No open positions
      </div>
    )
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Open Price</TableHead>
            <TableHead>Current Price</TableHead>
            <TableHead>P/L</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((position) => (
            <TableRow key={position.position_id}>
              <TableCell className="font-medium">{formatSymbol(position.symbol)}</TableCell>
              <TableCell>
                <Badge variant={position.order_type === 'BUY' ? 'default' : 'destructive'}>
                  {position.order_type}
                </Badge>
              </TableCell>
              <TableCell>{position.volume.toFixed(2)}</TableCell>
              <TableCell>{position.open_price.toFixed(5)}</TableCell>
              <TableCell>{position.current_price.toFixed(5)}</TableCell>
              <TableCell className={position.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatCurrency(position.profit_loss)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleClosePosition(position.position_id)}
                  disabled={closingPositions.has(position.position_id)}
                >
                  {closingPositions.has(position.position_id) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Closing...
                    </>
                  ) : (
                    'Close'
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 