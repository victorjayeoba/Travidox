'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock market data
const marketData = [
  { name: 'S&P 500', value: 2.4 },
  { name: 'NASDAQ', value: 3.2 },
  { name: 'DOW', value: 1.8 },
  { name: 'Russell 2000', value: -0.7 },
  { name: 'FTSE 100', value: 1.2 },
  { name: 'Nikkei 225', value: 2.9 },
  { name: 'DAX', value: 0.8 },
]

export default function MarketTrends() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Market Performance</CardTitle>
        <CardDescription>
          Major indices performance (last 30 days)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={marketData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
              barSize={30}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Change']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar 
                dataKey="value" 
                fill={(data) => data.value >= 0 ? '#10B981' : '#EF4444'} 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 