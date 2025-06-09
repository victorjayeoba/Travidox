'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'

// Mock transaction data
const transactions = [
  { 
    id: 1, 
    type: 'buy', 
    symbol: 'AAPL', 
    amount: 5, 
    price: 182.63, 
    date: '2023-12-15' 
  },
  { 
    id: 2, 
    type: 'sell', 
    symbol: 'MSFT', 
    amount: 2, 
    price: 337.42, 
    date: '2023-12-12' 
  },
  { 
    id: 3, 
    type: 'buy', 
    symbol: 'TSLA', 
    amount: 3, 
    price: 239.29, 
    date: '2023-12-10' 
  },
  { 
    id: 4, 
    type: 'buy', 
    symbol: 'AMZN', 
    amount: 1, 
    price: 145.89, 
    date: '2023-12-05' 
  },
  { 
    id: 5, 
    type: 'sell', 
    symbol: 'NVDA', 
    amount: 2, 
    price: 465.74, 
    date: '2023-12-01' 
  },
]

export default function RecentTransactions() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  transaction.type === 'buy' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'buy' ? (
                    <ArrowDownLeft className={`h-4 w-4 text-green-600`} />
                  ) : (
                    <ArrowUpRight className={`h-4 w-4 text-red-600`} />
                  )}
                </div>
                <div>
                  <div className="font-medium">
                    {transaction.type === 'buy' ? 'Bought' : 'Sold'} {transaction.symbol}
                  </div>
                  <div className="text-sm text-gray-500">
                    {transaction.amount} shares @ ${transaction.price}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-medium ${
                  transaction.type === 'buy' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {transaction.type === 'buy' ? '-' : '+'} 
                  ${(transaction.amount * transaction.price).toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 