"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { useTradingAccount } from '@/hooks/useTradingAccount'
import { RefreshCw, DollarSign, TrendingUp, Percent } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export function AccountPanel() {
  const { account, positions, refreshData, loading } = useTradingAccount()
  
  // Calculate total profit/loss
  const totalProfitLoss = positions.reduce((total, position) => {
    return total + position.profit_loss
  }, 0)
  
  // Calculate margin used
  const marginUsed = positions.reduce((total, position) => {
    return total + position.margin
  }, 0)
  
  // Calculate equity
  const equity = account ? account.balance + totalProfitLoss : 0
  
  // Calculate margin level
  const marginLevel = marginUsed > 0 ? (equity / marginUsed) * 100 : 0
  
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Virtual Account</CardTitle>
          <CardDescription>Your trading account details</CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={refreshData}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              Balance
            </p>
            {loading || !account ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <p className="text-2xl font-bold">{formatCurrency(account.balance)}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              Equity
            </p>
            {loading || !account ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <p className="text-2xl font-bold">{formatCurrency(equity)}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Margin Used</p>
            {loading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <p className="text-xl font-semibold">{formatCurrency(marginUsed)}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center">
              <Percent className="h-4 w-4 mr-1" />
              Margin Level
            </p>
            {loading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <p className="text-xl font-semibold">
                {marginLevel === 0 ? '∞' : `${marginLevel.toFixed(2)}%`}
              </p>
            )}
          </div>
          
          <div className="col-span-2 space-y-1 pt-2">
            <p className="text-sm font-medium text-muted-foreground">Open P/L</p>
            {loading ? (
              <Skeleton className="h-7 w-28" />
            ) : (
              <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalProfitLoss)}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 