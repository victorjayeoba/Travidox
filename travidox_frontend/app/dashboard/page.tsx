"use client"

import React, { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorBoundary } from '@/components/ui/error-boundary'

// Lazy load heavy components
const DashboardOverview = React.lazy(() => import('@/components/dashboard/overview'))
const PortfolioSummary = React.lazy(() => import('@/components/dashboard/portfolio-summary'))
const RecentTransactions = React.lazy(() => import('@/components/dashboard/recent-transactions'))
const MarketTrends = React.lazy(() => import('@/components/dashboard/market-trends'))
const NewsAndInsights = React.lazy(() => import('@/components/dashboard/news-and-insights'))

// Loading fallbacks
const OverviewSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <Skeleton className="h-8 w-48 mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  </div>
)

const PortfolioSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <Skeleton className="h-8 w-48 mb-4" />
    <Skeleton className="h-[300px] w-full" />
  </div>
)

const TransactionsSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <Skeleton className="h-8 w-48 mb-4" />
    <div className="space-y-3">
      {Array(5).fill(0).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  </div>
)

const MarketTrendsSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <Skeleton className="h-8 w-48 mb-4" />
    <Skeleton className="h-[200px] w-full" />
  </div>
)

const NewsSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <Skeleton className="h-8 w-48 mb-4" />
    <div className="space-y-4">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-16 w-16 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push('/login')
    }
    
    // If this is first login, redirect to overview
    if (user && !localStorage.getItem('hasVisitedDashboard')) {
      localStorage.setItem('hasVisitedDashboard', 'true')
      router.push('/dashboard/overview')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Overview Cards */}
        <ErrorBoundary>
          <Suspense fallback={<OverviewSkeleton />}>
            <DashboardOverview />
          </Suspense>
        </ErrorBoundary>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio Summary */}
          <div className="lg:col-span-2">
            <ErrorBoundary>
              <Suspense fallback={<PortfolioSkeleton />}>
                <PortfolioSummary />
              </Suspense>
            </ErrorBoundary>
          </div>
          
          {/* Recent Transactions */}
          <div>
            <ErrorBoundary>
              <Suspense fallback={<TransactionsSkeleton />}>
                <RecentTransactions />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Trends */}
          <ErrorBoundary>
            <Suspense fallback={<MarketTrendsSkeleton />}>
              <MarketTrends />
            </Suspense>
          </ErrorBoundary>
          
          {/* News and Insights */}
          <ErrorBoundary>
            <Suspense fallback={<NewsSkeleton />}>
              <NewsAndInsights />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
} 