"use client"

import { ReactNode, useState, useEffect } from 'react'
import { Sidebar } from './sidebar'
import { DashboardHeader } from './header'
import HeaderMarketSwiper from './header-market-swiper'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if window width is mobile on mount and when resized
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    // Set initial value
    checkIfMobile()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar')
      const hamburgerButton = document.getElementById('hamburger-button')
      
      if (sidebarOpen && sidebar && !sidebar.contains(event.target as Node) && 
          hamburgerButton && !hamburgerButton.contains(event.target as Node)) {
        setSidebarOpen(false)
      }
    }
    
    if (isMobile) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [sidebarOpen, isMobile])

  // Protect dashboard routes
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-green-300 opacity-20"></div>
        </div>
      </div>
    )
  }

  if (!user && !loading) {
    // Redirect to login if no user is logged in
    router.push('/login')
    return null
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div 
        id="mobile-sidebar"
        className={cn(
          "h-screen",
          isMobile ? "fixed top-0 bottom-0 left-0 transition-transform duration-300 ease-in-out transform z-50" : "sticky top-0",
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <Sidebar />
      </div>
      
      {/* Mobile-specific elements */}
      {isMobile && (
        <>
          {/* Hamburger Menu Button */}
          <Button
            id="hamburger-button"
            variant="ghost"
            size="icon"
            className={cn(
              "fixed top-4 right-4 z-[60] shadow-lg bg-white/80 backdrop-blur-md border border-white/20 hover:bg-white/95 transition-all duration-200",
              sidebarOpen ? "text-gray-700" : "text-gray-700"
            )}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
      
          {/* Sidebar Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Sticky Header Container */}
        <div className="sticky top-0 z-30 flex-shrink-0 bg-slate-50/50 backdrop-blur-lg border-b border-slate-200/50">
          <DashboardHeader 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <HeaderMarketSwiper />
        </div>
        
        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <div className="space-y-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 