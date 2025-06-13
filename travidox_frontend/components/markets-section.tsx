"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Newspaper, RefreshCw, Loader2, AlertTriangle } from 'lucide-react'
import { useNigeriaNews } from '@/hooks/useNigeriaNews'

// Types defined locally to avoid import issues
interface NewsItem {
  title: string;
  link: string;
  date: string;
  source: string;
}

interface MarketsSectionProps {
  id?: string;
}

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
}

const stocksData: Record<StockKey, Omit<StockInfo, 'currentPrice' | 'change' | 'changePercent'>> = {
  "Dangote": { id: "101672", name: "Dangote Cement", symbol: "DANGCEM" },
  "FirstBank": { id: "101682", name: "First Bank", symbol: "FBNH" },
  "MTN Nigeria": { id: "1131263", name: "MTN Nigeria", symbol: "MTNN" }
};

const formatChartDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: timestamp < Date.now() - (6 * 30 * 24 * 60 * 60 * 1000) ? '2-digit' : undefined 
  });
};

export function MarketsSection({ id }: MarketsSectionProps) {
  const router = useRouter();
  const [activeMarket, setActiveMarket] = useState<StockKey>('Dangote');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [currentStock, setCurrentStock] = useState<StockInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { news, loading: newsLoading, error: newsError, refresh } = useNigeriaNews();

  const fetchChartData = useCallback(async (stockSymbol: StockKey) => {
    const stockInfo = stocksData[stockSymbol];
    if (!stockInfo) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/chart-data/${stockInfo.id}?interval=P1W&pointscount=160&period=P1Y`);
      if (!response.ok) throw new Error(`Failed to fetch chart data: ${response.statusText}`);
      const data = await response.json();
      
      // Handle both direct array data and nested data structure
      let chartDataArray: any[] = [];
      if (data.success) {
        if (Array.isArray(data.data)) {
          chartDataArray = data.data;
        } else if (data.data && Array.isArray(data.data.data)) {
          chartDataArray = data.data.data;
        }
      }
      
      if (chartDataArray.length > 0) {
        const transformedData: ChartDataPoint[] = chartDataArray
          .map((item: any[]) => ({
            timestamp: item[0],
            date: formatChartDate(item[0]),
            value: parseFloat(item[4]),
          }))
          .sort((a: any, b: any) => a.timestamp - b.timestamp);
        
        setChartData(transformedData);
        
        if (transformedData.length >= 2) {
          const latest = transformedData[transformedData.length - 1];
          const previous = transformedData[transformedData.length - 2];
          const change = latest.value - previous.value;
          const changePercent = (change / previous.value) * 100;
          
          setCurrentStock({
            ...stockInfo,
            currentPrice: latest.value,
            change: parseFloat(change.toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2))
          });
        }
      } else {
        throw new Error('Invalid API response for chart data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching chart data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
      fetchChartData(activeMarket);
  }, [activeMarket, fetchChartData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-grey-heading">{label}</p>
          <p className="text-lg font-bold text-brand-green">
            ₦{value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Section id={id} className="bg-white py-20 lg:py-28">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-grey-heading mb-4">Live Nigerian Stock Market</h2>
        <p className="text-xl text-grey-text max-w-3xl mx-auto">Track major Nigerian stocks with weekly data from the past year, alongside the latest financial news.</p>
        </div>
        
      <Card className="bg-lemon-green-milk/50 border-gray-200/80 rounded-2xl md:rounded-3xl p-4 md:p-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-gray-200/50 rounded-lg p-1">
                {Object.keys(stocksData).map((market) => (
                  <Button 
                    key={market}
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveMarket(market as StockKey)}
                    className={`px-3 py-2 sm:py-1 text-sm font-semibold transition-colors rounded-md whitespace-nowrap ${activeMarket === market ? 'bg-white text-brand-green shadow-sm' : 'text-grey-text hover:bg-white/70'}`}
                  >
                    {stocksData[market as StockKey].name}
                  </Button>
                ))}
              </div>
              {currentStock && (
                <div className="text-right">
                  <div className="text-xl font-bold text-grey-heading mb-1">
                    ₦{currentStock.currentPrice.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`flex items-center justify-end gap-1 text-sm font-semibold ${currentStock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currentStock.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span>₦{Math.abs(currentStock.change).toFixed(2)} ({currentStock.changePercent.toFixed(2)}%)</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-64 sm:h-80 lg:h-96 relative">
              {loading && <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg"><Loader2 className="w-8 h-8 animate-spin text-brand-green"/></div>}
              {error && !loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50/50 rounded-lg text-red-600">
                  <AlertTriangle className="w-8 h-8 mb-2"/>
                  <p className="font-semibold">Could not load chart data.</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}
              {!loading && !error && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1DB954" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#1DB954" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip content={<CustomTooltip />} />
                    <XAxis 
                      dataKey="date" 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#4B5563', fontSize: 11 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      orientation="right" 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `₦${value >= 1000 ? (value/1000).toFixed(0)+'K' : value}`} 
                      tick={{ fill: '#4B5563', fontSize: 11 }}
                      domain={['dataMin - 10', 'dataMax + 10']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#1DB954" 
                      strokeWidth={2} 
                      fill="url(#chart-gradient)" 
                      dot={false}
                      activeDot={{ r: 4, fill: '#1DB954' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-grey-heading flex items-center gap-2">
                <Newspaper size={22} />
                Financial News
              </h3>
              <Button size="sm" variant="ghost" className="text-grey-text" onClick={refresh}>
                <RefreshCw size={16} className={newsLoading ? 'animate-spin' : ''} />
              </Button>
            </div>
            <div className="space-y-4 max-h-[28rem] lg:max-h-[26rem] overflow-y-auto pr-2">
              {newsLoading && !news.length && <div className="flex items-center justify-center h-48"><Loader2 className="w-6 h-6 animate-spin text-brand-green"/></div>}
              {newsError && <div className="text-red-600 text-sm">Failed to load news.</div>}
              {!newsLoading && !newsError && news.map((item: NewsItem, index: number) => (
                <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-white/80 hover:bg-white transition-colors group">
                  <p className="font-semibold text-grey-heading mb-1 group-hover:text-brand-green transition-colors text-sm leading-tight">{item.title}</p>
                  <p className="text-xs text-grey-text">{item.source} · {new Date(item.date).toLocaleDateString()}</p>
                </a>
              ))}
              </div>
          </div>
        </div>
      </Card>
    </Section>
  )
} 