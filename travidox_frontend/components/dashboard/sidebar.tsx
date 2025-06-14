"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, BookOpen, Shield, Bot, PieChart, 
  DollarSign, School, ListChecks, Heart, Clock, Settings, ChevronRight,
  X, LogOut, Trophy, GraduationCap, User, MessageCircle, Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/auth-provider'
import { Logo } from '@/components/ui/logo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { XpIndicator } from '@/components/ui/xp-indicator'

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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
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

      {/* User info - visible on mobile */}
      <div className="lg:hidden px-4 py-3 border-b flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
          <AvatarFallback className="bg-green-100 text-green-800">
            {user?.displayName ? getInitials(user.displayName) : 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user?.displayName || 'User'}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user?.email || ''}
          </p>
        </div>
      </div>

      {/* XP indicator - visible on mobile */}
      <div className="lg:hidden px-4 py-3 border-b">
        <XpIndicator />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {/* Main Section */}
        <div className="mb-2">
          <div className="px-2 py-1 text-xs font-semibold uppercase text-gray-400 tracking-wider">Main</div>
          <SidebarItem 
            icon={<LayoutDashboard size={18} />} 
            label="Dashboard" 
            href="/dashboard" 
            active={pathname === '/dashboard'}
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
            icon={<BookOpen size={18} />} 
            label="Learn & Earn" 
            href="/dashboard/learn" 
            active={pathname.startsWith('/dashboard/learn')}
            onClick={closeMenuOnMobile}
          />
        </div>
        {/* Trading Section */}
        <div className="mb-2">
          <div className="px-2 py-1 text-xs font-semibold uppercase text-gray-400 tracking-wider">Trading</div>
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
            icon={<Sparkles size={18} />} 
            label="AI Assistant" 
            href="/dashboard/ai-assistant" 
            active={pathname.startsWith('/dashboard/ai-assistant')}
            isNew
            onClick={closeMenuOnMobile}
          />
        </div>
        {/* Engagement Section */}
        <div className="mb-2">
          <div className="px-2 py-1 text-xs font-semibold uppercase text-gray-400 tracking-wider">Engagement</div>
          <SidebarItem 
            icon={<Trophy size={18} />} 
            label="Leaderboard" 
            href="/dashboard/leaderboard" 
            active={pathname.startsWith('/dashboard/leaderboard')}
            onClick={closeMenuOnMobile}
          />
        </div>
        {/* Settings Section */}
        <div className="mb-2">
          <div className="px-2 py-1 text-xs font-semibold uppercase text-gray-400 tracking-wider">Settings</div>
          <SidebarItem 
            icon={<User size={18} />} 
            label="Profile" 
            href="/dashboard/profile" 
            active={pathname.startsWith('/dashboard/profile')}
            onClick={closeMenuOnMobile}
          />
          <SidebarItem 
            icon={<Shield size={18} />} 
            label="Security" 
            href="/dashboard/security" 
            active={pathname.startsWith('/dashboard/security')}
            onClick={closeMenuOnMobile}
          />
          <a 
            href="#" 
            onClick={handleLogout}
            className="flex items-center px-3 py-2.5 rounded-md text-red-600 hover:bg-red-50 transition-colors"
          >
            <span className="mr-3"><LogOut size={18} /></span>
            <span>Logout</span>
          </a>
        </div>
      </nav>
    </aside>
  )
} 