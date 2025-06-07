"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, BookOpen, Shield, Bot, PieChart, 
  DollarSign, School, ListChecks, Heart, Clock, Settings, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/auth-provider'

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
  isNew?: boolean
}

const SidebarItem = ({ icon, label, href, active, isNew }: SidebarItemProps) => (
  <Link href={href} className="w-full">
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
  const { user } = useAuth()
  const [balance] = useState("$0")

  return (
    <aside className="w-64 border-r border-gray-200 h-screen sticky top-0 flex flex-col bg-white">
      {/* Logo */}
      <div className="px-4 py-4">
        <Link href="/">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Travidox</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        <SidebarItem 
          icon={<PieChart size={18} />} 
          label="My Portfolio" 
          href="/dashboard" 
          active={pathname === '/dashboard'}
        />
        
        <SidebarItem 
          icon={<LayoutDashboard size={18} />} 
          label="Dashboard" 
          href="/dashboard/overview" 
          active={pathname === '/dashboard/overview'}
        />
        
        <SidebarItem 
          icon={<DollarSign size={18} />} 
          label="Stocks" 
          href="/dashboard/markets" 
          active={pathname.startsWith('/dashboard/markets')}
        />

        <SidebarItem 
          icon={<Bot size={18} />} 
          label="Trading Bot" 
          href="/dashboard/trading-bot" 
          active={pathname.startsWith('/dashboard/trading-bot')}
        />
        
        <SidebarItem 
          icon={<BookOpen size={18} />} 
          label="Learn & Earn" 
          href="/dashboard/learn" 
          active={pathname.startsWith('/dashboard/learn')}
        />
        
        <SidebarItem 
          icon={<School size={18} />} 
          label="Certifications" 
          href="/dashboard/certifications" 
          active={pathname.startsWith('/dashboard/certifications')}
        />
        
        <SidebarItem 
          icon={<Shield size={18} />} 
          label="Security" 
          href="/dashboard/security" 
          active={pathname.startsWith('/dashboard/security')}
        />
        
        <SidebarItem 
          icon={<Clock size={18} />} 
          label="History" 
          href="/dashboard/history" 
          active={pathname.startsWith('/dashboard/history')}
          isNew
        />

        <SidebarItem 
          icon={<Settings size={18} />} 
          label="Settings" 
          href="/dashboard/settings" 
          active={pathname.startsWith('/dashboard/settings')}
        />
      </nav>

      {/* User Account */}
      <div className="p-3 border-t border-gray-200">
        <Link href="/dashboard/profile">
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
      </div>
    </aside>
  )
} 