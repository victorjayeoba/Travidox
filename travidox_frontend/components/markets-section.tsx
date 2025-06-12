"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts"
import { TrendingUp, TrendingDown, BarChart3, Activity, ArrowUpRight, RefreshCw } from 'lucide-react'
import { useNigeriaNews } from '@/hooks/useNigeriaNews'

interface MarketsSectionProps {
  id?: string;
}

// Nigerian stocks configuration with proper typing
type StockKey = 'Dangote' | 'FirstBank' | 'MTN Nigeria';

interface StockInfo {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
}

interface ChartDataPoint {
  date: string;
  value: number;
  timestamp: number;
  formattedDate: string;
}

interface ApiResponse {
  success: boolean;
  source: string;
  assetId: string;
  data: {
    data: number[][];
    events: any;
  };
}

const stocksData: Record<StockKey, Omit<StockInfo, 'currentPrice' | 'change' | 'changePercent'>> = {
  "Dangote": {
    id: "101672",
    name: "Dangote Cement",
    symbol: "DANGCEM"
  },
  "FirstBank": {
    id: "101682", 
    name: "First Bank",
    symbol: "FIRSTBANK"
  },
  "MTN Nigeria": {
    id: "1131263",
    name: "MTN Nigeria",
    symbol: "MTNN"
  }
};

// Function to get relative time
const getRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  } catch {
    return dateString;
  }
};

// Function to get category color
const getCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'equities':
      return 'bg-green-50 text-green-700';
    case 'energy':
      return 'bg-blue-50 text-blue-700';
    case 'banking':
      return 'bg-purple-50 text-purple-700';
    case 'commodities':
      return 'bg-orange-50 text-orange-700';
    default:
      return 'bg-gray-50 text-gray-700';
  }
};

// Function to format date for chart display
const formatChartDate = (timestamp: number): { shortDate: string, longDate: string } => {
  const date = new Date(timestamp);
  const shortDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const longDate = date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  return { shortDate, longDate };
};

export function MarketsSection({ id }: MarketsSectionProps) {
  const router = useRouter();
  const [activeMarket, setActiveMarket] = useState<StockKey>('Dangote');
  const [activeChartType, setActiveChartType] = useState<'line' | 'area' | 'bar'>('area');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [currentStock, setCurrentStock] = useState<StockInfo | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Use the Nigeria news hook
  const { news, loading: newsLoading, error: newsError, isMockData, refresh } = useNigeriaNews();

  // Fetch live chart data from your API with weekly intervals over 1 year
  const fetchChartData = async (stockSymbol: StockKey) => {
    const stockInfo = stocksData[stockSymbol];
    if (!stockInfo) return;

    setLoading(true);
    try {
      // Fetch weekly data for 1 year (160 data points)
      const response = await fetch(`/api/chart-data/${stockInfo.id}?interval=P1W&pointscount=160&period=P1Y`);
      const data: ApiResponse = await response.json();
      
      if (data.success && data.data && data.data.data) {
        const apiData = data.data.data;
        
        // Transform the weekly data for chart display - ensure chronological order
        const transformedData: ChartDataPoint[] = apiData
          .map((item: number[], index: number) => {
            const timestamp = item[0];
            const closePrice = item[4]; // Close price is at index 4
            const { shortDate, longDate } = formatChartDate(timestamp);
            
            return {
              date: shortDate,
              value: Math.round(closePrice * 100) / 100, // Round to 2 decimal places
              timestamp: timestamp,
              formattedDate: longDate
            };
          })
          .sort((a, b) => a.timestamp - b.timestamp); // Sort chronologically (oldest to newest)
        
        setChartData(transformedData);
        
        // Calculate current price and change from the latest data (last two data points)
        if (transformedData.length >= 2) {
          const latestData = transformedData[transformedData.length - 1];
          const previousData = transformedData[transformedData.length - 2];
          const currentPrice = latestData.value;
          const previousPrice = previousData.value;
          const change = currentPrice - previousPrice;
          const changePercent = (change / previousPrice) * 100;
          
          setCurrentStock({
            ...stockInfo,
            currentPrice: currentPrice,
            change: Math.round(change * 100) / 100,
            changePercent: Math.round(changePercent * 100) / 100
          });
        }
      } else {
        console.error('Invalid API response:', data);
        setCurrentStock({
          ...stockInfo,
          currentPrice: 0,
          change: 0,
          changePercent: 0
        });
        setChartData([]);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setCurrentStock({
        ...stockInfo,
        currentPrice: 0,
        change: 0,
        changePercent: 0
      });
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Update chart data when market selection changes
  useEffect(() => {
    if (activeMarket && stocksData[activeMarket]) {
      fetchChartData(activeMarket);
    }
  }, [activeMarket]);

  // Navigate to specific stock page or dashboard
  const handleStockClick = (stockSymbol: string) => {
    router.push(`/dashboard/markets?stock=${stockSymbol}`);
  };

  // Custom tooltip for better data visualization
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-1">{data.formattedDate}</p>
          <p className="text-lg font-bold text-green-600">
            ₦{payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500">{currentStock?.name || 'Stock Price'}</p>
        </div>
      );
    }
    return null;
  };

  // Custom X-axis tick formatter to show dates properly
  const formatXAxisTick = (tickItem: string, index: number) => {
    // Show only selected ticks to avoid overcrowding
    const dataLength = chartData.length;
    const showEveryNth = Math.ceil(dataLength / 8); // Show approximately 8 ticks
    
    if (index % showEveryNth === 0 || index === dataLength - 1) {
      return tickItem;
    }
    return '';
  };

  return (
    <Section id={id} className="bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800">
              Nigerian Stock Market Live
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track major Nigerian stocks with weekly intervals over the past year - comprehensive analysis and advanced charting
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Markets Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Weekly Stock Performance</h3>
                <p className="text-sm text-gray-500 mt-1">52 weeks • Historical Data</p>
              </div>
              
              <div className="flex gap-2">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {(Object.keys(stocksData) as StockKey[]).map((market) => (
                    <button
                      key={market}
                      onClick={() => setActiveMarket(market)}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                        activeMarket === market
                          ? 'bg-white text-green-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {market}
                    </button>
                  ))}
                </div>
                
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {[
                    { type: 'line' as const, icon: Activity },
                    { type: 'area' as const, icon: TrendingUp },
                    { type: 'bar' as const, icon: BarChart3 }
                  ].map(({ type, icon: Icon }) => (
                    <button
                      key={type}
                      onClick={() => setActiveChartType(type)}
                      className={`p-1 rounded-md transition-all duration-200 ${
                        activeChartType === type
                          ? 'bg-white text-green-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="h-96">
              {loading ? (
                <div className="flex flex-col justify-center items-center h-full">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                  <span className="ml-3 mt-2 text-gray-600">Loading weekly chart data...</span>
                </div>
              ) : chartData.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">No chart data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {(() => {
                    if (activeChartType === 'line') {
                      return (
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 35 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#6b7280" 
                            fontSize={10}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval={0}
                            tickFormatter={formatXAxisTick}
                          />
                          <YAxis 
                            stroke="#6b7280" 
                            fontSize={11}
                            tickFormatter={(value) => `₦${value.toLocaleString('en-US', { notation: 'compact' })}`}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#16a34a"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5, stroke: '#16a34a', strokeWidth: 2 }}
                          />
                        </LineChart>
                      );
                    } else if (activeChartType === 'area') {
                      return (
                        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 35 }}>
                          <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#16a34a" stopOpacity={0.05}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#6b7280" 
                            fontSize={10}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval={0}
                            tickFormatter={formatXAxisTick}
                          />
                          <YAxis 
                            stroke="#6b7280" 
                            fontSize={11}
                            tickFormatter={(value) => `₦${value.toLocaleString('en-US', { notation: 'compact' })}`}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#16a34a"
                            fill="url(#colorGradient)"
                            strokeWidth={2} 
                          />
                        </AreaChart>
                      );
                    } else {
                      return (
                        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 35 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#6b7280" 
                            fontSize={10}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval={0}
                            tickFormatter={formatXAxisTick}
                          />
                          <YAxis 
                            stroke="#6b7280" 
                            fontSize={11}
                            tickFormatter={(value) => `₦${value.toLocaleString('en-US', { notation: 'compact' })}`}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="value" 
                            fill="#16a34a" 
                            radius={[2, 2, 0, 0]}
                          />
                        </BarChart>
                      );
                    }
                  })()}
                </ResponsiveContainer>
              )}
            </div>
            
            {currentStock && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="text-center sm:text-left">
                    <span className="text-gray-500 block">Current Price</span>
                    <span className="font-bold text-lg text-green-600">
                      ₦{currentStock.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-500 block">Weekly Change</span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      currentStock.change < 0 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {currentStock.change < 0 ? '▼' : '▲'} 
                      ₦{Math.abs(currentStock.change).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      ({Math.abs(currentStock.changePercent).toFixed(2)}%)
                    </span>
                  </div>
                  <div className="text-center sm:text-right">
                    <button
                      onClick={() => handleStockClick(currentStock.symbol)}
                      className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium hover:underline transition-colors duration-200"
                    >
                      View Details
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Market News */}
          <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-5 border-b pb-3">
              <h3 className="text-xl font-bold text-gray-900">Latest Market News</h3>
              <button
                onClick={refresh}
                disabled={newsLoading}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                title="Refresh news"
              >
                <RefreshCw className={`w-4 h-4 ${newsLoading ? 'animate-spin' : ''}`} />
                {newsLoading ? 'Updating...' : 'Refresh'}
              </button>
            </div>
            
            {/* Loading state */}
            {newsLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-green-600 border-t-transparent rounded-full mr-2" />
                <span className="text-gray-600">Loading news...</span>
              </div>
            )}
            
            {/* Error state */}
            {newsError && !newsLoading && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">{newsError}</p>
              </div>
            )}
            
            {/* News content */}
            {!newsLoading && !newsError && (
              <div className="space-y-5 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
                {news.length > 0 ? (
                  <>
                    {news.slice(0, 6).map((item, index) => (
                      <article key={index} className="border-b border-gray-100 pb-4 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200 group">
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                          <span className="text-xs text-gray-500">{getRelativeTime(item.date)}</span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1 hover:text-green-700 transition-colors duration-200 cursor-pointer group-hover:text-green-600">
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="line-clamp-2"
                          >
                            {item.title}
                          </a>
                        </h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{item.source}</span>
                          <ArrowUpRight className="w-3 h-3 text-gray-400 group-hover:text-green-600 transition-colors duration-200" />
                        </div>
                      </article>
                    ))}
                    
                    {/* Last updated indicator */}
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-400 text-center">
                        Last updated: {new Date().toLocaleTimeString()}
                        {isMockData && ' (Demo data)'}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No news articles available</p>
                  </div>
                )}
                
                {/* Show mock data indicator if using mock data */}
                {isMockData && news.length > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-700 text-center">
                      📰 Demo news data - external news API unavailable
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  )
} 