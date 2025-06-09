'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

// Mock news data
const newsItems = [
  {
    id: 1,
    title: 'Federal Reserve Holds Interest Rates Steady',
    summary: 'The Federal Reserve announced it will keep interest rates unchanged following its latest meeting.',
    source: 'Financial Times',
    date: '2023-12-14',
    image: '/images/news/fed.jpg',
    url: '#'
  },
  {
    id: 2,
    title: 'Tech Stocks Rally on AI Advancements',
    summary: 'Major technology stocks saw gains as companies announced new artificial intelligence capabilities.',
    source: 'Bloomberg',
    date: '2023-12-12',
    image: '/images/news/tech.jpg',
    url: '#'
  },
  {
    id: 3,
    title: 'Oil Prices Drop Amid Supply Concerns',
    summary: 'Crude oil prices fell as OPEC+ members discussed potential increases in production quotas.',
    source: 'Reuters',
    date: '2023-12-10',
    image: '/images/news/oil.jpg',
    url: '#'
  }
]

export default function NewsAndInsights() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Market News</CardTitle>
            <CardDescription>
              Latest financial news and insights
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newsItems.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden">
                {/* Placeholder for image */}
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">
                  Image
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.summary}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-400">{item.source} • {new Date(item.date).toLocaleDateString()}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 