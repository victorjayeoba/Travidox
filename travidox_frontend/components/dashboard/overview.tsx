'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, BarChart3, Wallet } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'

export default function DashboardOverview() {
  const { user } = useAuth()
  
  // Mock data for the overview
  const portfolioValue = 12485.32
  const portfolioChange = 324.56
  const percentChange = (portfolioChange / (portfolioValue - portfolioChange)) * 100
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Welcome back, {user?.displayName || 'Investor'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${portfolioValue.toFixed(2)}
            </div>
            <div className={`flex items-center text-sm mt-1 ${portfolioChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <ArrowUpRight className={`h-4 w-4 ${portfolioChange < 0 ? 'rotate-180' : ''}`} />
              <span>${Math.abs(portfolioChange).toFixed(2)} ({percentChange.toFixed(2)}%)</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">Performance</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <BarChart3 className="h-9 w-9 text-blue-500 mr-3" />
            <div>
              <div className="text-2xl font-bold">Good</div>
              <div className="text-sm text-gray-500">Outperforming the market</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">Available Cash</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Wallet className="h-9 w-9 text-green-500 mr-3" />
            <div>
              <div className="text-2xl font-bold">$245.32</div>
              <div className="text-sm text-gray-500">Available to invest</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 