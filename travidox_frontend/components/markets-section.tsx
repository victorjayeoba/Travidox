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
  const [activeChartType, setActiveChartType] = useState('line');

  return (
    <Section id={id} className="bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800">Nigerian Stock Market Live</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track major Nigerian stocks in real-time with comprehensive analysis and advanced charting tools
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Markets Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="mb-4 border-b pb-3 flex flex-wrap justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Stock Performance</h3>
              <div className="flex space-x-2 mt-2 sm:mt-0">
                <Button 
                  variant={activeMarket === 'DANGOTE' ? 'default' : 'outline'}
                  className={`transition-all duration-300 ${activeMarket === 'DANGOTE' ? 'bg-green-600 hover:bg-green-700 scale-105' : 'hover:text-green-700'}`}
                  size="sm"
                  onClick={() => setActiveMarket('DANGOTE')}
                >
                  Dangote
                </Button>
                <Button 
                  variant={activeMarket === 'FIRSTBANK' ? 'default' : 'outline'}
                  className={`transition-all duration-300 ${activeMarket === 'FIRSTBANK' ? 'bg-green-600 hover:bg-green-700 scale-105' : 'hover:text-green-700'}`}
                  size="sm"
                  onClick={() => setActiveMarket('FIRSTBANK')}
                >
                  FirstBank
                </Button>
                <Button 
                  variant={activeMarket === 'MTN' ? 'default' : 'outline'}
                  className={`transition-all duration-300 ${activeMarket === 'MTN' ? 'bg-green-600 hover:bg-green-700 scale-105' : 'hover:text-green-700'}`}
                  size="sm"
                  onClick={() => setActiveMarket('MTN')}
                >
                  MTN Nigeria
                </Button>
              </div>
            </div>
            
            <div className="h-96 mb-5 transition-all duration-500 ease-in-out">
              <ResponsiveContainer width="100%" height="100%">
                {activeChartType === 'line' ? (
                  <LineChart data={marketData} className="animate-fadeIn">
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="date" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: '#e5e7eb', 
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      itemStyle={{ color: '#16a34a' }}
                      cursor={{ stroke: '#9ca3af', strokeWidth: 1 }}
                      animationDuration={300}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={activeMarket === 'DANGOTE' ? 'NGN' : (activeMarket === 'FIRSTBANK' ? 'NASDAQ' : 'S_P500')} 
                      stroke="#16a34a"
                      strokeWidth={2} 
                      dot={{ strokeWidth: 2, fill: '#fff', stroke: '#16a34a' }} 
                      activeDot={{ r: 7, fill: '#16a34a', stroke: '#fff' }} 
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    />
                  </LineChart>
                ) : activeChartType === 'candlestick' ? (
                  <LineChart data={marketData} className="animate-fadeIn">
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="date" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey={activeMarket === 'DANGOTE' ? 'NGN' : (activeMarket === 'FIRSTBANK' ? 'NASDAQ' : 'S_P500')} 
                      stroke="#16a34a"
                      strokeWidth={3} 
                      dot={{ 
                        strokeWidth: 1, 
                        r: 4,
                        stroke: '#16a34a',
                        fill: '#16a34a' 
                      }}
                      animationDuration={1500}
                    />
                  </LineChart>
                ) : activeChartType === 'renko' ? (
                  <LineChart data={marketData} className="animate-fadeIn">
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="date" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip />
                    <Line 
                      type="stepAfter" 
                      dataKey={activeMarket === 'DANGOTE' ? 'NGN' : (activeMarket === 'FIRSTBANK' ? 'NASDAQ' : 'S_P500')} 
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={false}
                      animationDuration={1500}
                    />
                  </LineChart>
                ) : (
                  <LineChart data={marketData} className="animate-fadeIn">
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="date" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip />
                    <Line 
                      type="step" 
                      dataKey={activeMarket === 'DANGOTE' ? 'NGN' : (activeMarket === 'FIRSTBANK' ? 'NASDAQ' : 'S_P500')} 
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={{ stroke: '#16a34a', fill: '#fff' }}
                      animationDuration={1500}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Chart Type</h4>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={activeChartType === 'line' ? 'default' : 'outline'}
                  className={`transition-all duration-300 ${activeChartType === 'line' ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-50 hover:text-green-600'}`}
                  size="sm"
                  onClick={() => setActiveChartType('line')}
                >
                  Line Chart
                </Button>
                <Button 
                  variant={activeChartType === 'candlestick' ? 'default' : 'outline'}
                  className={`transition-all duration-300 ${activeChartType === 'candlestick' ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-50 hover:text-green-600'}`}
                  size="sm"
                  onClick={() => setActiveChartType('candlestick')}
                >
                  Candlestick
                </Button>
                <Button 
                  variant={activeChartType === 'renko' ? 'default' : 'outline'}
                  className={`transition-all duration-300 ${activeChartType === 'renko' ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-50 hover:text-green-600'}`}
                  size="sm"
                  onClick={() => setActiveChartType('renko')}
                >
                  Renko Chart
                </Button>
                <Button 
                  variant={activeChartType === 'pointfigure' ? 'default' : 'outline'}
                  className={`transition-all duration-300 ${activeChartType === 'pointfigure' ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-50 hover:text-green-600'}`}
                  size="sm"
                  onClick={() => setActiveChartType('pointfigure')}
                >
                  Point & Figure
                </Button>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-gray-500">Current: </span>
                    <span className="font-semibold text-green-600">₦{activeMarket === 'DANGOTE' ? '294.50' : (activeMarket === 'FIRSTBANK' ? '152.30' : '208.75')}</span>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${activeMarket === 'MTN' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {activeMarket === 'MTN' ? '▼ 1.2%' : '▲ 2.4%'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Market News */}
          <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-5 border-b pb-3">Latest Market News</h3>
            <div className="space-y-5 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
              {marketNews.map((news, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-700">{news.category}</span>
                    <span className="text-xs text-gray-500">{news.time}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1 hover:text-green-700 transition-colors duration-200 cursor-pointer">{news.title}</h4>
                  <p className="text-sm text-gray-600">{news.snippet}</p>
                  <div className="flex items-center mt-2">
                    <div className={`w-2 h-2 rounded-full ${news.isPositive ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                    <span className={`text-xs font-medium ${news.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {news.isPositive ? 'Market Up' : 'Market Down'}
                    </span>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all duration-300"
              >
                View All Market News
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
} 