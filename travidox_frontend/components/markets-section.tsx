"use client"

import { useState } from "react"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface MarketsSectionProps {
  id?: string;
}

// Mock market data for chart
const marketData = [
  { date: 'Jan', NASDAQ: 14000, S_P500: 4600, NGN: 1500 },
  { date: 'Feb', NASDAQ: 13800, S_P500: 4580, NGN: 1520 },
  { date: 'Mar', NASDAQ: 14100, S_P500: 4680, NGN: 1550 },
  { date: 'Apr', NASDAQ: 14500, S_P500: 4780, NGN: 1540 },
  { date: 'May', NASDAQ: 14300, S_P500: 4730, NGN: 1580 },
  { date: 'Jun', NASDAQ: 14900, S_P500: 4850, NGN: 1620 },
  { date: 'Jul', NASDAQ: 15200, S_P500: 4920, NGN: 1660 },
];

// Mock market news
const marketNews = [
  {
    title: "Nigerian Exchange Group gains on positive Q2 earnings",
    snippet: "Nigerian stocks rally as key players post better-than-expected quarterly results.",
    time: "2 hours ago",
    category: "NGN",
    isPositive: true
  },
  {
    title: "Tech sector sees moderate pullback amid global market tensions",
    snippet: "Major tech indices experience a slight correction following recent rally.",
    time: "5 hours ago",
    category: "NASDAQ",
    isPositive: false
  },
  {
    title: "S&P 500 stable despite inflation concerns",
    snippet: "The broader market remains resilient with investors closely watching upcoming Fed announcements.",
    time: "1 day ago",
    category: "S&P500",
    isPositive: true
  }
];

export function MarketsSection({ id }: MarketsSectionProps) {
  const [activeMarket, setActiveMarket] = useState('NGN');

  return (
    <Section id={id} className="bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Global Markets at a Glance</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track major markets and indices in real-time with comprehensive analysis and expert insights
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Markets Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-md">
            <div className="mb-6 border-b pb-3 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Market Performance</h3>
              <div className="flex space-x-2">
                <Button 
                  variant={activeMarket === 'NGN' ? 'default' : 'outline'}
                  className={activeMarket === 'NGN' ? 'bg-green-600 hover:bg-green-700' : ''}
                  size="sm"
                  onClick={() => setActiveMarket('NGN')}
                >
                  NGN
                </Button>
                <Button 
                  variant={activeMarket === 'NASDAQ' ? 'default' : 'outline'}
                  className={activeMarket === 'NASDAQ' ? 'bg-green-600 hover:bg-green-700' : ''}
                  size="sm"
                  onClick={() => setActiveMarket('NASDAQ')}
                >
                  NASDAQ
                </Button>
                <Button 
                  variant={activeMarket === 'S_P500' ? 'default' : 'outline'}
                  className={activeMarket === 'S_P500' ? 'bg-green-600 hover:bg-green-700' : ''}
                  size="sm"
                  onClick={() => setActiveMarket('S_P500')}
                >
                  S&P 500
                </Button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey={activeMarket} 
                    stroke="#16a34a"
                    strokeWidth={2} 
                    dot={{ strokeWidth: 2 }} 
                    activeDot={{ r: 7 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Market News */}
          <div className="bg-white p-6 rounded-3xl shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-5 border-b pb-3">Latest Market News</h3>
            <div className="space-y-5">
              {marketNews.map((news, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100">{news.category}</span>
                    <span className="text-xs text-gray-500">{news.time}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{news.title}</h4>
                  <p className="text-sm text-gray-600">{news.snippet}</p>
                  <div className="flex items-center mt-2">
                    <div className={`w-2 h-2 rounded-full ${news.isPositive ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                    <span className="text-xs font-medium">{news.isPositive ? 'Market Up' : 'Market Down'}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">View All Market News</Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
} 