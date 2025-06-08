"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Bell, Star, AlertTriangle, ChevronDown, Menu, DollarSign } from 'lucide-react'
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
  const { profile, loading: profileLoading } = useUserProfile()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }
  
  const isVerified = user?.emailVerified || false
  // Use the XP from user profile, or fall back to 0
  const userXP = profile?.xp || 0
  // Account balance is the same as XP in this implementation
  const accountBalance = profile?.balance || 0

  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }
  
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6">
      <div className="flex items-center justify-between h-16">
        {/* Left section: Search or logo */}
        {showSearch ? (
          <form onSubmit={handleSearch} className="w-full max-w-md ml-auto md:ml-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search stocks, markets, news..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        ) : (
          <div className="ml-12 lg:ml-0">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Travidox</span>
              </div>
            </Link>
          </div>
        )}
        
        {/* Right section: User tools */}
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
          
          {/* XP - hide on mobile */}
          <div className="hidden md:flex items-center gap-1.5 text-yellow-700 bg-yellow-50 px-2.5 py-1 rounded-full">
            <Star size={16} className="fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-medium">{userXP} XP</span>
          </div>
          
          {/* Account Balance - hide on mobile */}
          <div className="hidden md:flex items-center gap-1.5 text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
            <DollarSign size={16} className="text-green-500" />
            <span className="text-sm font-medium">₦{accountBalance.toFixed(2)}</span>
          </div>
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2 font-medium border-b">Notifications</div>
              <div className="py-2 px-3 text-sm bg-blue-50 border-l-4 border-blue-500 m-2">
                <div className="font-medium">Welcome to Travidox!</div>
                <p className="text-gray-500">Start your investment journey today.</p>
              </div>
              <div className="py-2 px-3 border-b text-sm m-2">
                <div className="font-medium">Market update</div>
                <p className="text-gray-500">S&P 500 up by 1.2% today.</p>
              </div>
              <DropdownMenuItem className="justify-center text-sm text-blue-600">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                  <AvatarFallback className="bg-green-100 text-green-700 text-sm font-semibold">
                    {user?.displayName ? getInitials(user.displayName) : user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown size={16} className="text-gray-500 hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-3 py-2 text-sm">
                <div className="font-medium">{user?.displayName || user?.email?.split('@')[0]}</div>
                <div className="text-gray-500 truncate">{user?.email}</div>
              </div>
              <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/support')}>
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => router.push('/api/auth/logout')}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
} 