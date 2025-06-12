"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { Skeleton } from "@/components/ui/skeleton";

interface MarketIndex {
  name: string;
  value: number;
  change: number;
  country: string;
}

interface MarketData {
  ASI: number;
  DEALS: number;
  VOLUME: number;
  VALUE: number;
  CAP: number;
  BOND_CAP: number;
  Id: number;
  "$id": string;
  ETF_CAP: null;
  _dataSource?: string;
  _changes?: {
    ASI: number;
    CAP: number;
    VOLUME: number;
    DEALS: number;
  };
}

export default function MarketOverview() {
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
            country: "Nigeria",
          },
          {
            name: "Market Cap",
            value: data.CAP,
            change: changes.CAP,
            country: "Nigeria",
          },
          {
            name: "Daily Volume",
            value: data.VOLUME,
            change: changes.VOLUME,
            country: "Nigeria",
          },
          {
            name: "Deals Today",
            value: data.DEALS,
            change: changes.DEALS,
            country: "Nigeria",
          },
        ];

        setIndices(marketIndices);
      } catch (error) {
        console.error("Error fetching market data:", error);
        // Set some default data if fetching fails
        setIndices([
          {
            name: "NGX ASI",
            value: 114659.11,
            change: -0.34,
            country: "Nigeria",
          },
          {
            name: "Market Cap",
            value: 72302191967416.6,
            change: 0.22,
            country: "Nigeria",
          },
          {
            name: "Daily Volume",
            value: 471150678,
            change: 1.04,
            country: "Nigeria",
          },
          {
            name: "Deals Today",
            value: 20538,
            change: 0.15,
            country: "Nigeria",
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
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Market Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Today's performance of major market indices
          {!isLiveData && <span className="text-amber-500 ml-2">(Using cached data)</span>}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {isLoading ? (
            // Loading skeletons
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex justify-between items-center border-b border-gray-100 py-2">
                <div>
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-16 mt-1" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-5 w-20 ml-auto" />
                  <Skeleton className="h-4 w-12 mt-1 ml-auto" />
                </div>
              </div>
            ))
          ) : (
            // Actual data
            indices.map((index, i) => (
              <div key={i} className="flex justify-between items-center border-b border-gray-100 py-2 last:border-0">
                <div>
                  <h3 className="font-medium">{index.name}</h3>
                  <p className="text-sm text-muted-foreground">{index.country}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatNumber(index.value, i)}</p>
                  <div className={`flex items-center justify-end text-sm ${index.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {index.change >= 0 ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 mr-1" />
                    )}
                    <span>{formatPercentage(index.change)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 