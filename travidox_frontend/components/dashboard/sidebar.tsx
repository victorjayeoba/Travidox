"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, BookOpen, Shield, Bot, PieChart, 
  DollarSign, School, ListChecks, Heart, Clock, Settings, ChevronRight,
  X, LogOut, Trophy, GraduationCap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/auth-provider'
import { Logo } from '@/components/ui/logo'

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
  isNew?: boolean
  onClick?: () => void
}

const SidebarItem = ({ icon, label, href, active, isNew, onClick }: SidebarItemProps) => (
  <Link href={href} className="w-full" onClick={onClick}>
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 font-normal px-3 py-2 h-10",
        active ? "bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800" : 
        "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      )}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {isNew && (
        <span className="px-1.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
          New
        </span>
      )}
    </Button>
  </Link>
)

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [balance] = useState("₦0")
  const [isMobile, setIsMobile] = useState(false)
  
  // Check if screen is mobile
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
  
  const closeMenuOnMobile = () => {
    // Only do something if we're on mobile
    if (isMobile && window.innerWidth < 1024) {
      // Try to find parent layout and close sidebar
      const layoutComponent = document.getElementById('mobile-sidebar')
      if (layoutComponent) {
        layoutComponent.classList.add('-translate-x-full')
        
        // Find and click the hamburger button to update state
        const hamburgerButton = document.getElementById('hamburger-button')
        if (hamburgerButton) {
          hamburgerButton.click()
        }
      }
    }
  }

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await logout()
      closeMenuOnMobile()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <aside className="w-64 border-r border-gray-200 h-screen flex flex-col bg-white overflow-y-auto">
      {/* Logo - visible on desktop with badge */}
      <div className="px-4 py-4 lg:flex hidden items-center justify-between">
        <Logo href="/" size="md" />
        <div className="ml-2">
          <div className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded-full">
            Pro
          </div>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b">
        <Logo href="/" size="md" />
        <div className="ml-2">
          <div className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded-full">
            Pro
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <SidebarItem 
          icon={<LayoutDashboard size={18} />} 
          label="Dashboard" 
          href="/dashboard" 
          active={pathname === '/dashboard'}
          onClick={closeMenuOnMobile}
        />
        
        
        <SidebarItem 
          icon={<DollarSign size={18} />} 
          label="Stocks" 
          href="/dashboard/markets" 
          active={pathname.startsWith('/dashboard/markets')}
          onClick={closeMenuOnMobile}
        />

        <SidebarItem 
          icon={<Bot size={18} />} 
          label="Trading Bot" 
          href="/dashboard/trading-bot" 
          active={pathname.startsWith('/dashboard/trading-bot')}
          onClick={closeMenuOnMobile}
        />
        
        <SidebarItem 
          icon={<BookOpen size={18} />} 
          label="Learn & Earn" 
          href="/dashboard/learn" 
          active={pathname.startsWith('/dashboard/learn')}
          onClick={closeMenuOnMobile}
        />
        
        <SidebarItem 
          icon={<Trophy size={18} />} 
          label="Leaderboard" 
          href="/dashboard/leaderboard" 
          active={pathname.startsWith('/dashboard/leaderboard')}
          onClick={closeMenuOnMobile}
        />
        
        <SidebarItem 
          icon={<School size={18} />} 
          label="Certifications" 
          href="/dashboard/certifications" 
          active={pathname.startsWith('/dashboard/certifications')}
          onClick={closeMenuOnMobile}
        />
        
        <SidebarItem 
          icon={<Shield size={18} />} 
          label="Security" 
          href="/dashboard/security" 
          active={pathname.startsWith('/dashboard/security')}
          onClick={closeMenuOnMobile}
        />
        
        <SidebarItem 
          icon={<Clock size={18} />} 
          label="History" 
          href="/dashboard/history" 
          active={pathname.startsWith('/dashboard/history')}
          isNew
          onClick={closeMenuOnMobile}
        />

        <SidebarItem 
          icon={<Settings size={18} />} 
          label="Settings" 
          href="/dashboard/settings" 
          active={pathname.startsWith('/dashboard/settings')}
          onClick={closeMenuOnMobile}
        />
      </nav>

      {/* User Account */}
      <div className="p-3 border-t border-gray-200">
        <Link href="/dashboard/profile" onClick={closeMenuOnMobile}>
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.displayName || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs font-medium text-gray-500">{balance}</p>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </Link>
        
        {/* Logout Button */}
        <Button 
          variant="ghost" 
          className="w-full mt-2 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 justify-start"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  )
} 