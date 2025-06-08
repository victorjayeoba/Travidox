"use client"

import { ReactNode, useState, useEffect } from 'react'
import { Sidebar } from './sidebar'
import { DashboardHeader } from './header'
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user && !loading) {
    // Redirect to login if no user is logged in
    router.push('/login')
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Mobile Hamburger Menu Button */}
      <Button
        id="hamburger-button"
        variant="ghost"
        size="icon"
        className={cn(
          "fixed top-4 left-4 z-50 lg:hidden",
          sidebarOpen ? "text-white" : "text-gray-700"
        )}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>
      
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - fixed on mobile, sticky on desktop */}
      <div 
        id="mobile-sidebar"
        className={cn(
          "lg:sticky lg:top-0 z-40",
          isMobile ? "fixed top-0 bottom-0 left-0 transition-transform duration-300 ease-in-out transform" : "",
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          showMobileMenu={isMobile} 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          isSidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-6xl px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 