'use client';

import { useState, useEffect, useCallback } from 'react';

export interface NewsItem {
  title: string;
  link: string;
  date: string;
  category: string;
  author: string;
  source: string;
}

interface NewsResponse {
  success: boolean;
  count: number;
  data: NewsItem[];
  source: string;
  timestamp: string;
  error?: string;
}

export const useNigeriaNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);

  // Function to fetch news that can be called on demand
  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      
      // Add cache busting in development
      const isDev = process.env.NODE_ENV === 'development';
      const cacheParam = isDev ? `?_t=${Date.now()}` : '';
      
      // Fetch news from our API route
      const response = await fetch(`/api/nigeria-news${cacheParam}`, {
        cache: isDev ? 'no-store' : 'force-cache', // No cache in dev, use cache in production
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const result: NewsResponse = await response.json();
      
      // Log for debugging
      console.log('Nigeria News API Response:', {
        success: result.success,
        count: result.count,
        source: result.source,
        timestamp: result.timestamp,
        firstItem: result.data?.[0]?.title
      });
      
      // Check if we got mock data
      if (result.source === "mock") {
        setIsMockData(true);
        if (result.error) {
          setError(result.error);
        }
      } else {
        setIsMockData(false);
        setError(null);
      }

      // Set news items
      if (result.success && result.data && Array.isArray(result.data)) {
        setNews(result.data);
        console.log(`✅ Loaded ${result.data.length} news articles`);
      } else {
        setNews([]);
        throw new Error('Invalid data format received');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching Nigeria news:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch news on mount
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);
  
  // Return the news, loading state, error, and a function to manually refresh
  return { 
    news, 
    loading, 
    error,
    isMockData,
    refresh: fetchNews
  };
}; 