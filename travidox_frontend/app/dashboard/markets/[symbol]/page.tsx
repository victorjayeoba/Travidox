"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts"
import { TrendingUp, TrendingDown, BarChart3, Activity, ArrowLeft, RefreshCw } from 'lucide-react'
import { getStockById, isValidStockSymbol } from "@/lib/stock-mapping"
import { getStandardSector, getSectorColor } from "@/lib/sector-mapping"
import { useNigeriaStocks, STOCK_PRICES_UPDATE_EVENT } from "@/hooks/useNigeriaStocks"
import { StockPurchaseModal } from "@/components/StockPurchaseModal"
import { usePortfolio, PORTFOLIO_UPDATE_EVENT } from "@/hooks/usePortfolio"

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

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent?: number;
  sector?: string;
}

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

export default function StockDetailPage() {
  const router = useRouter();
  const params = useParams();
  const symbol = params.symbol as string;
  
  const [activeChartType, setActiveChartType] = useState<'line' | 'area' | 'bar'>('area');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [currentStock, setCurrentStock] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  
  // Use hooks
  const { stocks, loading: stocksLoading, refresh: refreshStocks } = useNigeriaStocks();
  const { portfolio, loading: portfolioLoading } = usePortfolio();
  
  const [ownedQuantity, setOwnedQuantity] = useState(0);

  // Listen for real-time updates
  useEffect(() => {
    const handlePortfolioUpdate = () => {
      // Portfolio will be automatically refreshed by the hook
    };

    const handleStockUpdate = () => {
      // Stock data will be automatically refreshed by the hook
    };

    window.addEventListener(PORTFOLIO_UPDATE_EVENT, handlePortfolioUpdate);
    window.addEventListener(STOCK_PRICES_UPDATE_EVENT, handleStockUpdate);
    
    return () => {
      window.removeEventListener(PORTFOLIO_UPDATE_EVENT, handlePortfolioUpdate);
      window.removeEventListener(STOCK_PRICES_UPDATE_EVENT, handleStockUpdate);
    };
  }, []);

  // Memoize calculation for owned quantity
  useEffect(() => {
    if (!portfolioLoading && portfolio) {
      // Make symbol matching case-insensitive
      const ownedAsset = portfolio.assets.find(asset => 
        asset.symbol.toLowerCase() === symbol.toLowerCase()
      );
      
      setOwnedQuantity(ownedAsset ? ownedAsset.quantity : 0);
    }
  }, [portfolio, portfolioLoading, symbol]);
  
  // Check if symbol is valid
  if (!symbol || !isValidStockSymbol(symbol)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Stock Not Found</h1>
            <p className="text-gray-600 mb-4">
              The stock symbol "{symbol}" is not available or invalid.
            </p>
            <Button onClick={() => router.push('/dashboard/markets')}>
              Back to Markets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stockMapping = getStockById(symbol);
  
  // Find current stock data from Nigeria stocks API
  useEffect(() => {
    if (!stocksLoading && stocks.length > 0) {
      const foundStock = stocks.find(stock => 
        (stock.symbol || stock.Symbol) === symbol.toUpperCase()
      );
      
      if (foundStock) {
        const price = foundStock.price || foundStock.Last || 0;
        const change = foundStock.change || foundStock.Chg || 0;
        // Calculate percent if not provided directly
        let changePercent = foundStock.changePercent;
        if (!changePercent && price !== 0 && change !== 0) {
          // Calculate percent change based on current price and change
          const previousPrice = price - change;
          changePercent = previousPrice > 0 ? (change / previousPrice) * 100 : 0;
        }
        
        // Get company name for sector determination
        const companyName = foundStock.name || foundStock.Name || stockMapping?.name || '';
        
        // Get standardized sector
        const rawSector = foundStock.sector || foundStock.PairType || '';
        const standardSector = getStandardSector(symbol, rawSector, companyName);
        
        const normalizedStock: StockData = {
          symbol: foundStock.symbol || foundStock.Symbol || symbol,
          name: companyName,
          price: price,
          change: change,
          changePercent: changePercent || 0,
          sector: standardSector
        };
        setCurrentStock(normalizedStock);
      } else if (stockMapping) {
        // Fallback to mapping data
        // Get standardized sector even for fallback data
        const standardSector = getStandardSector(symbol, '', stockMapping.name);
        
        setCurrentStock({
          symbol: stockMapping.symbol,
          name: stockMapping.name,
          price: 0,
          change: 0,
          changePercent: 0,
          sector: standardSector
        });
      }
    }
  }, [stocks, stocksLoading, symbol, stockMapping]);

  // Fetch chart data
  const fetchChartData = async () => {
    if (!stockMapping) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/chart-data/${stockMapping.id}?interval=P1W&pointscount=160&period=P1Y`);
      const data: ApiResponse = await response.json();
      
      if (data.success && data.data && data.data.data) {
        const apiData = data.data.data;
        
        const transformedData: ChartDataPoint[] = apiData
          .map((item: number[]) => {
            const timestamp = item[0];
            const closePrice = item[4];
            const { shortDate, longDate } = formatChartDate(timestamp);
            
            return {
              date: shortDate,
              value: Math.round(closePrice * 100) / 100,
              timestamp: timestamp,
              formattedDate: longDate
            };
          })
          .sort((a, b) => a.timestamp - b.timestamp);
        
        setChartData(transformedData);
        
        // Update stock price if we have chart data but no live data
        if (transformedData.length > 0 && currentStock && currentStock.price === 0) {
          const latestPrice = transformedData[transformedData.length - 1].value;
          const previousPrice = transformedData.length > 1 ? transformedData[transformedData.length - 2].value : latestPrice;
          const change = latestPrice - previousPrice;
          const changePercent = previousPrice > 0 ? (change / previousPrice) * 100 : 0;
          
          setCurrentStock(prev => prev ? {
            ...prev,
            price: latestPrice,
            change: Math.round(change * 100) / 100,
            changePercent: Math.round(changePercent * 100) / 100
          } : null);
        }
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stockMapping) {
      fetchChartData();
    }
  }, [stockMapping]);

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 px-4 border border-gray-200 rounded-lg shadow-lg max-w-[200px] sm:max-w-[250px]">
          <p className="text-xs font-medium text-gray-900 mb-1">{data.formattedDate}</p>
          <p className="text-base sm:text-lg font-bold text-green-600">
            ₦{payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 truncate">{currentStock?.name || 'Stock Price'}</p>
        </div>
      );
    }
    return null;
  };

  // Format X-axis tick
  const formatXAxisTick = (tickItem: string, index: number) => {
    const dataLength = chartData.length;
    const showEveryNth = Math.ceil(dataLength / 8);
    
    if (index % showEveryNth === 0 || index === dataLength - 1) {
      return tickItem;
    }
    return '';
  };

  if (!currentStock) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        <span className="ml-3 text-lg">Loading stock data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - More responsive, stacks on mobile */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/dashboard/markets')}
            className="h-9 px-3 py-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="text-sm">Back</span>
          </Button>
          
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{currentStock.symbol}</h1>
            <p className="text-sm text-gray-600">{currentStock.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchChartData}
            disabled={loading}
            className="h-9"
          >
            <RefreshCw className={`w-4 h-4 mr-1 sm:mr-2 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </Button>
          
          <Button 
            onClick={() => setIsPurchaseModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 h-9"
          >
            <span className="text-sm">Trade</span>
          </Button>
        </div>
      </div>

      {/* Stock Info Cards - Optimized for mobile with 2-column grid on small screens */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-1 px-3 pt-3">
            <CardTitle className="text-xs sm:text-sm text-gray-500">Current Price</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              ₦{currentStock.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-1 px-3 pt-3">
            <CardTitle className="text-xs sm:text-sm text-gray-500">Daily Change</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-0">
            <div className={`text-lg sm:text-2xl font-bold flex flex-wrap items-center gap-1 ${
              currentStock.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {currentStock.change >= 0 ? (
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              ) : (
                <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              )}
              <span className="truncate">
                {currentStock.change >= 0 ? '+' : ''}₦{currentStock.change.toFixed(2)}
              </span>
            </div>
            <div className={`text-xs sm:text-sm ${currentStock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ({currentStock.change >= 0 ? '+' : ''}{(currentStock.changePercent || 0).toFixed(2)}%)
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-1 px-3 pt-3">
            <CardTitle className="text-xs sm:text-sm text-gray-500">Shares Owned</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-0">
            {portfolioLoading ? (
              <div className="h-10 flex items-center">
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{ownedQuantity}</div>
                <div className="text-xs sm:text-sm text-gray-500 truncate">
                  Value: ₦{(ownedQuantity * currentStock.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-1 px-3 pt-3">
            <CardTitle className="text-xs sm:text-sm text-gray-500">Sector</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-0">
            <Badge 
              variant="outline" 
              className={`text-xs sm:text-sm ${getSectorColor(currentStock.sector as any)}`}
            >
              {currentStock.sector || 'Uncategorized'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Chart - Optimized for mobile with better touch targets */}
      <Card className="overflow-hidden">
        <CardHeader className="px-3 sm:px-6 pt-3 pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <CardTitle className="text-lg sm:text-xl">Weekly Performance</CardTitle>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">52 weeks • Historical Data</p>
            </div>
            
            <div className="flex bg-gray-100 rounded-lg p-1 self-end sm:self-auto">
              {[
                { type: 'line' as const, icon: Activity, label: 'Line' },
                { type: 'area' as const, icon: TrendingUp, label: 'Area' },
                { type: 'bar' as const, icon: BarChart3, label: 'Bar' }
              ].map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => setActiveChartType(type)}
                  className={`p-2 sm:px-3 rounded-md transition-all duration-200 ${
                    activeChartType === type
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  aria-label={`Switch to ${label} chart`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-0 sm:px-6 pb-1">
          <div className="h-64 sm:h-80 md:h-96">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-full">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                <span className="ml-3 mt-2 text-xs sm:text-sm text-gray-600">Loading chart data...</span>
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-sm text-gray-500">No chart data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {(() => {
                  if (activeChartType === 'line') {
                    return (
                      <LineChart 
                        data={chartData} 
                        margin={{ top: 5, right: 10, left: 0, bottom: 25 }}
                        style={{ touchAction: 'pan-y' }} // Better touch handling
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#6b7280" 
                          fontSize={9}
                          angle={-45}
                          textAnchor="end"
                          height={50}
                          interval={0}
                          tickFormatter={formatXAxisTick}
                          tickMargin={5}
                        />
                        <YAxis 
                          stroke="#6b7280" 
                          fontSize={10}
                          width={40}
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
                      <AreaChart 
                        data={chartData} 
                        margin={{ top: 5, right: 10, left: 0, bottom: 25 }}
                        style={{ touchAction: 'pan-y' }}
                      >
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
                          fontSize={9}
                          angle={-45}
                          textAnchor="end"
                          height={50}
                          interval={0}
                          tickFormatter={formatXAxisTick}
                          tickMargin={5}
                        />
                        <YAxis 
                          stroke="#6b7280" 
                          fontSize={10}
                          width={40}
                          tickFormatter={(value) => `₦${value.toLocaleString('en-US', { notation: 'compact' })}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#16a34a"
                          fill="url(#colorGradient)"
                          strokeWidth={2}
                          activeDot={{ r: 6, stroke: '#16a34a', strokeWidth: 1 }}
                        />
                      </AreaChart>
                    );
                  } else {
                    return (
                      <BarChart 
                        data={chartData} 
                        margin={{ top: 5, right: 10, left: 0, bottom: 25 }}
                        style={{ touchAction: 'pan-y' }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#6b7280" 
                          fontSize={9}
                          angle={-45}
                          textAnchor="end"
                          height={50}
                          interval={0}
                          tickFormatter={formatXAxisTick}
                          tickMargin={5}
                        />
                        <YAxis 
                          stroke="#6b7280" 
                          fontSize={10}
                          width={40}
                          tickFormatter={(value) => `₦${value.toLocaleString('en-US', { notation: 'compact' })}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="value" 
                          fill="#16a34a" 
                          radius={[2, 2, 0, 0]}
                          maxBarSize={30}
                        />
                      </BarChart>
                    );
                  }
                })()}
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trading Modal */}
      <StockPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        stock={{ 
          symbol: currentStock.symbol, 
          name: currentStock.name, 
          price: currentStock.price, 
          change: currentStock.change 
        }}
        ownedQuantity={ownedQuantity}
      />
      
      {/* Fixed Buy/Sell Button for Mobile */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center md:hidden z-10 px-4">
        <Button 
          onClick={() => setIsPurchaseModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 w-full h-12 shadow-lg rounded-lg"
        >
          <span className="text-base font-medium">Trade {currentStock.symbol}</span>
        </Button>
      </div>
    </div>
  );
} 