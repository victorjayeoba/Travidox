"use client";

import React, { useEffect, useState, useRef } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketIndex {
  name: string;
  value: number;
  change?: number; // Made optional since not all metrics will have change data
}

interface MarketData {
  ASI: number;
  DEALS: number;
  VOLUME: number;
  VALUE: number;
  CAP: number;
  BOND_CAP: number;
  _dataSource?: string;
  _changes?: {
    ASI: number;
    CAP: number;
    VOLUME: number;
    DEALS: number;
  };
}

interface ASIData {
  currentPrice: number;
  changePercentage: number;
  currentDateTime: string;
}

export default function HeaderMarketSwiper() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch ASI data with real change percentage via our proxy API
        let asiData: ASIData | null = null;
        try {
          const asiResponse = await fetch("/api/ngx-asi", {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(15000)
          });
          
          if (asiResponse.ok) {
            asiData = await asiResponse.json();
          } else {
            console.warn('ASI proxy API responded with status:', asiResponse.status);
          }
        } catch (asiError) {
          console.warn('Failed to fetch ASI data via proxy, using fallback:', asiError);
          // Continue with fallback data
        }

        // Fetch other market data
        const response = await fetch("/api/nigeria-stocks/market-indices");
        let data: MarketData;

        if (!response.ok) {
          throw new Error("Failed to fetch market data");
        }

        data = await response.json();
        
        const marketIndices: MarketIndex[] = [
          {
            name: "NGX ASI",
            value: asiData?.currentPrice || data.ASI,
            change: asiData?.changePercentage || undefined, // Use real change percentage from ASI API
          },
          {
            name: "Market Cap",
            value: data.CAP,
            // No change percentage - we don't have reliable data for this
          },
          {
            name: "Volume",
            value: data.VOLUME,
            // No change percentage - we don't have reliable data for this
          },
          {
            name: "Deals",
            value: data.DEALS,
            // No change percentage - we don't have reliable data for this
          },
        ];

        setIndices(marketIndices);
      } catch (error) {
        console.error("Error fetching market data:", error);
        // Set default data if fetch fails
        setIndices([
          {
            name: "NGX ASI",
            value: 114659.11,
            change: 0.56, // Use a reasonable default
          },
          {
            name: "Market Cap",
            value: 72302191967416.6,
            // No change percentage
          },
          {
            name: "Volume",
            value: 471150678,
            // No change percentage
          },
          {
            name: "Deals",
            value: 20538,
            // No change percentage
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, []);
  
  // Set up automatic rotation
  useEffect(() => {
    if (indices.length > 0 && !isPaused) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % indices.length);
      }, 4000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [indices, isPaused]);

  const formatNumber = (num: number, index: number) => {
    if (index === 0) { // ASI - 2 decimal places
      return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2,
      }).format(num);
    } else if (index === 1) { // Market Cap - trillions with 2 decimal places
      return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2,
        style: "currency",
        currency: "NGN",
        notation: "compact",
        compactDisplay: "short",
      }).format(num);
    } else if (index === 2) { // Volume - millions with no decimal places
      return new Intl.NumberFormat("en-US", {
        notation: "compact",
        compactDisplay: "short",
      }).format(num);
    } else { // Deals - just formatted with commas
      return new Intl.NumberFormat("en-US").format(num);
    }
  };

  const formatPercentage = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      signDisplay: "exceptZero",
    }).format(num) + "%";
  };

  const handleManualNavigation = (index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
    
    // Resume auto-rotation after 10 seconds
    setTimeout(() => {
      setIsPaused(false);
    }, 10000);
  };

  return (
    <div className="relative bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-white">
      {/* Mobile View */}
      <div className="block md:hidden">
        <div className="h-12 flex items-center px-4">
          <div className="w-full relative overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center w-full">
                <Skeleton className="h-4 w-40 bg-white/20" />
              </div>
            ) : (
              <div className="relative h-8 overflow-hidden">
                {indices.map((index, i) => (
                  <div
                    key={i}
                    className={`absolute w-full transition-all duration-700 ease-in-out flex justify-center items-center ${
                      i === activeIndex ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-center">
                      <span className="font-semibold text-sm">{index.name}</span>
                      <span className="font-bold text-sm">{formatNumber(index.value, i)}</span>
                      {/* Only show change percentage for ASI (index 0) */}
                      {i === 0 && typeof index.change === 'number' && (
                        <div className={`flex items-center text-xs ${
                          index.change >= 0 ? 'text-green-200' : 'text-red-200'
                        }`}>
                          {index.change >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          <span>{formatPercentage(index.change)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation Dots */}
        <div className="flex justify-center space-x-1 pb-2">
          {indices.map((_, i) => (
            <button
              key={i}
              onClick={() => handleManualNavigation(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'bg-white' : 'bg-white/40'
              }`}
              aria-label={`View ${indices[i]?.name || `index ${i + 1}`}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="h-10 flex items-center px-6">
          {isLoading ? (
            <div className="flex items-center justify-center w-full">
              <Skeleton className="h-4 w-full bg-white/20" />
            </div>
          ) : (
            <div className="w-full flex items-center justify-between">
              {indices.map((index, i) => (
                <div 
                  key={i} 
                  className={`flex items-center gap-3 transition-all duration-500 cursor-pointer hover:bg-white/10 px-3 py-1 rounded-lg ${
                    i === activeIndex ? 'bg-white/15 scale-105' : 'opacity-75 hover:opacity-100'
                  }`}
                  onClick={() => handleManualNavigation(i)}
                >
                  <div className="text-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-green-100">{index.name}</span>
                      <span className="font-bold text-sm text-white">{formatNumber(index.value, i)}</span>
                      {/* Only show change percentage for ASI (index 0) */}
                      {i === 0 && typeof index.change === 'number' && (
                        <div className={`flex items-center text-xs ${
                          index.change >= 0 ? 'text-green-200' : 'text-red-200'
                        }`}>
                          {index.change >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          <span className="font-medium">{formatPercentage(index.change)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Visual indicator for active item */}
                  {i === activeIndex && (
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar for auto-rotation */}
      {!isPaused && !isLoading && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-white/30">
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{
              width: `${((activeIndex + 1) / indices.length) * 100}%`
            }}
          />
        </div>
      )}
    </div>
  );
} 