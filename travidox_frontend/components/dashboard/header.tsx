"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Bell, AlertTriangle, ChevronDown, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/components/auth/auth-provider'
import { useUserProfile } from '@/hooks/useUserProfile'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'
import { XpIndicator } from '@/components/ui/xp-indicator'

interface DashboardHeaderProps {
  showSearch?: boolean;
  showMobileMenu?: boolean;
  isSidebarOpen?: boolean;
  onMenuClick?: () => void;
}

export function DashboardHeader({ 
  showSearch = true,
  showMobileMenu = false,
  isSidebarOpen = false,
  onMenuClick
}: DashboardHeaderProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }
  
  const isVerified = user?.emailVerified || false

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }
  
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6">
      <div className="h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          {showMobileMenu && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          
          {/* Logo */}
          <Logo href="/dashboard" size="sm" />
        </div>
        
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          {showSearch && (
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search stocks, courses..."
                className="pl-9 bg-gray-50 border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          )}
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Verification status - hide on smallest screens */}
          {!isVerified && (
            <Button 
              variant="outline"
              className="hidden sm:flex text-yellow-700 border-yellow-300 hover:bg-yellow-50 gap-1 text-xs"
              onClick={() => router.push('/dashboard/verify-email')}
            >
              <AlertTriangle size={16} />
              <span className="hidden md:inline">Verify Now</span>
            </Button>
          )}
          
          {/* XP - desktop version */}
          <div className="hidden md:block">
            <XpIndicator />
          </div>
          
          {/* XP - mobile version */}
          <div className="md:hidden">
            <XpIndicator variant="compact" />
          </div>
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px]">
              <div className="px-4 py-3 font-medium border-b border-gray-100">
                Notifications
              </div>
              <div className="py-2">
                <DropdownMenuItem className="flex flex-col items-start px-4 py-2 cursor-pointer">
                  <div className="font-medium text-sm">New market update available</div>
                  <div className="text-xs text-gray-500 mt-1">5 minutes ago</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start px-4 py-2 cursor-pointer">
                  <div className="font-medium text-sm">Your watchlist is trending up</div>
                  <div className="text-xs text-gray-500 mt-1">1 hour ago</div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                  <AvatarFallback className="bg-green-100 text-green-800">
                    {user?.displayName ? getInitials(user.displayName) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2 border-b border-gray-100">
                <div className="flex flex-col space-y-1 leading-none">
                  {user?.displayName && (
                    <p className="font-medium">{user.displayName}</p>
                  )}
                  {user?.email && (
                    <p className="w-[200px] truncate text-sm text-gray-500">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => router.push('/dashboard/profile')}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => router.push('/dashboard/settings')}
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600 cursor-pointer" 
                onClick={() => router.push('/api/auth/logout')}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
} 