'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data for the chart
const portfolioData = [
  { date: 'Jan', value: 9000 },
  { date: 'Feb', value: 9200 },
  { date: 'Mar', value: 9800 },
  { date: 'Apr', value: 9600 },
  { date: 'May', value: 10200 },
  { date: 'Jun', value: 10800 },
  { date: 'Jul', value: 11200 },
  { date: 'Aug', value: 11600 },
  { date: 'Sep', value: 12000 },
  { date: 'Oct', value: 12400 },
  { date: 'Nov', value: 12200 },
  { date: 'Dec', value: 12500 },
]

export default function PortfolioSummary() {
  const [timeRange, setTimeRange] = React.useState('1Y')
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>
              Your investment growth over time
            </CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant={timeRange === '1M' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeRange('1M')}
            >
              1M
            </Button>
            <Button 
              variant={timeRange === '3M' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeRange('3M')}
            >
              3M
            </Button>
            <Button 
              variant={timeRange === '6M' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeRange('6M')}
            >
              6M
            </Button>
            <Button 
              variant={timeRange === '1Y' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeRange('1Y')}
            >
              1Y
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={portfolioData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Value']}
                labelFormatter={(label) => `${label}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 