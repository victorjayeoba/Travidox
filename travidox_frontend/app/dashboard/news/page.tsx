"use client"

import { useState } from 'react'
import { useNigeriaNews } from '@/hooks/useNigeriaNews'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RefreshCcw, AlertCircle, CalendarIcon, Search } from 'lucide-react'
import Link from 'next/link'
import MockDataNotice from '@/components/dashboard/MockDataNotice'

export default function NewsPage() {
  const { news, loading, error, isMockData, refresh } = useNigeriaNews()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  // Extract unique categories from news
  const categories = news && news.length > 0 
    ? Array.from(new Set(news.map(item => item.category)))
    : []
  
  // Filter news based on search query and selected category
  const filteredNews = news.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })
  
  // Format relative time for news items
  const getRelativeTime = (dateString: string) => {
    try {
      const now = new Date()
      const date = new Date(dateString)
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
      
      if (isNaN(diffInHours)) return dateString // Fallback to the original string
      
      if (diffInHours < 1) return 'Just now'
      if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
      if (diffInHours < 48) return 'Yesterday'
      if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`
      
      // Format date for older news
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return dateString // In case of parsing errors, return the original string
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Nigerian Market News</h1>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={refresh}
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          ) : (
            <RefreshCcw size={16} />
          )}
          Refresh
        </Button>
      </div>
      
      {/* Show mock data notice if using mock data */}
      {isMockData && (
        <MockDataNotice message="Using demo news data - external news API is unavailable" />
      )}
      
      {/* Error display */}
      {error && !isMockData && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search news..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant="outline" 
            className={!selectedCategory ? "bg-gray-100" : ""}
            onClick={() => setSelectedCategory(null)}
            style={{ cursor: 'pointer' }}
          >
            All
          </Badge>
          
          {categories.map((category) => (
            <Badge 
              key={category}
              variant="outline" 
              className={selectedCategory === category ? "bg-gray-100" : ""}
              onClick={() => setSelectedCategory(category)}
              style={{ cursor: 'pointer' }}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* News articles */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          <span className="ml-3 text-lg">Loading news...</span>
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="space-y-6">
          {filteredNews.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="outline" className="mt-1">
                    {item.category}
                  </Badge>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <CalendarIcon size={14} />
                    <span>{getRelativeTime(item.date)}</span>
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold mb-2 hover:text-green-600">
                  <Link href={item.link} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </Link>
                </h2>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div>
                    {item.author && item.author !== "Unknown Author" ? (
                      <span>By {item.author}</span>
                    ) : (
                      <span>{item.source}</span>
                    )}
                  </div>
                  
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={item.link} target="_blank" rel="noopener noreferrer">
                      Read Full Story
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <div className="text-lg font-medium mb-2">No news articles found</div>
          <p>Try adjusting your search criteria or check back later for updates.</p>
        </div>
      )}
    </div>
  )
} 