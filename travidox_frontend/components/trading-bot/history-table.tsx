"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { useTradingAccount } from '@/hooks/useTradingAccount'
import { VirtualTradeHistory } from '@/lib/firebase-trading'
import { Loader2 } from 'lucide-react'

export function HistoryTable() {
  const { history, loading } = useTradingAccount()
  
  // Format symbol for display
  const formatSymbol = (symbol: string) => {
    if (symbol.length === 6) {
      return `${symbol.slice(0, 3)}/${symbol.slice(3, 6)}`
    }
    return symbol
  }
  
  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date)
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  
  if (history.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No trade history
      </div>
    )
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Open Price</TableHead>
            <TableHead>Close Price</TableHead>
            <TableHead>P/L</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((trade) => (
            <TableRow key={trade.trade_id}>
              <TableCell className="whitespace-nowrap">{formatDate(trade.close_time)}</TableCell>
              <TableCell className="font-medium">{formatSymbol(trade.symbol)}</TableCell>
              <TableCell>
                <Badge variant={trade.order_type === 'BUY' ? 'default' : 'destructive'}>
                  {trade.order_type}
                </Badge>
              </TableCell>
              <TableCell>{trade.volume.toFixed(2)}</TableCell>
              <TableCell>{trade.open_price.toFixed(5)}</TableCell>
              <TableCell>{trade.close_price.toFixed(5)}</TableCell>
              <TableCell className={trade.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatCurrency(trade.profit_loss)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 