"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { Skeleton } from "@/components/ui/skeleton";

interface MarketIndex {
  name: string;
  value: number;
  change: number;
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

export default function MarketOverviewHorizontal() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveData, setIsLiveData] = useState(false);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);
        // Use our own API route to avoid CORS issues
        const response = await fetch("/api/nigeria-stocks/market-indices");

        if (!response.ok) {
          throw new Error("Failed to fetch market data");
        }

        const data: MarketData = await response.json();
        
        // Check if we're using live data or fallback
        setIsLiveData(data._dataSource === "live");
        
        // Get percentage changes from API or use defaults
        const changes = data._changes || {
          ASI: -0.34,
          CAP: 0.22,
          VOLUME: 1.04,
          DEALS: 0.15
        };

        // Create market indices from the data
        const marketIndices: MarketIndex[] = [
          {
            name: "NGX ASI",
            value: data.ASI,
            change: changes.ASI,
          },
          {
            name: "Market Cap",
            value: data.CAP,
            change: changes.CAP,
          },
          {
            name: "Volume",
            value: data.VOLUME,
            change: changes.VOLUME,
          },
          {
            name: "Deals",
            value: data.DEALS,
            change: changes.DEALS,
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
            change: -0.34,
          },
          {
            name: "Market Cap",
            value: 72302191967416.6,
            change: 0.22,
          },
          {
            name: "Volume",
            value: 471150678,
            change: 1.04,
          },
          {
            name: "Deals",
            value: 20538,
            change: 0.15,
          },
        ]);
        setIsLiveData(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, []);

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

  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Market Overview</h2>
        {!isLiveData && <span className="text-xs text-amber-500">(Using cached data)</span>}
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col">
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-6 w-24 mb-1" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {indices.map((index, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-sm text-gray-500">{index.name}</span>
              <span className="text-lg font-bold">{formatNumber(index.value, i)}</span>
              <div className={`flex items-center text-sm ${index.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {index.change >= 0 ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                <span>{formatPercentage(index.change)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 