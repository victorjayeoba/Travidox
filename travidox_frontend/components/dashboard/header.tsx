"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Search, Bell, Star, AlertTriangle, ChevronDown, Menu, User, X } from 'lucide-react'
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
import { useUserProfile, XP_BALANCE_UPDATE_EVENT } from '@/hooks/useUserProfile'
import { useNigeriaStocks } from '@/hooks/useNigeriaStocks'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'
import { StockCard } from '@/components/dashboard/stock-card'

interface DashboardHeaderProps {
  showSearch?: boolean;
  onMenuClick?: () => void;
}

export function DashboardHeader({ 
  showSearch = true,
  onMenuClick
}: DashboardHeaderProps) {
  const { user } = useAuth()
  const { profile, loading: profileLoading } = useUserProfile()
  const { stocks } = useNigeriaStocks()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')
  const [xpValue, setXpValue] = useState(0)
  const [searchFocused, setSearchFocused] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  
  // Initialize search query from URL params
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
    }
  }, [searchParams])
  
  // Get current section title based on pathname - now reactive to route changes
  const getCurrentSectionTitle = () => {
    if (!pathname) return 'Travidox Dashboard';
    
    if (pathname.includes('/dashboard/markets')) {
      return 'Nigerian Markets';
    } else if (pathname.includes('/dashboard/trading-bot')) {
      return 'Trading Bot';
    } else if (pathname.includes('/dashboard/learn')) {
      return 'Learn & Earn';
    } else if (pathname.includes('/dashboard/certifications')) {
      return 'Certifications';
    } else if (pathname.includes('/dashboard/security')) {
      return 'Security Center';
    } else if (pathname.includes('/dashboard/profile')) {
      return 'My Profile';
    } else if (pathname.includes('/dashboard/settings')) {
      return 'Settings';
    } else if (pathname.includes('/dashboard/history')) {
      return 'Transaction History';
    } else if (pathname.includes('/dashboard/portfolio')) {
      return 'My Portfolio';
    } else if (pathname.includes('/dashboard/leaderboard')) {
      return 'Leaderboard';
    } else if (pathname.includes('/dashboard/news')) {
      return 'Market News';
    } else if (pathname === '/dashboard' || pathname === '/dashboard/overview') {
      return 'Dashboard Overview';
    }
    
    return 'Travidox Dashboard';
  }

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = stocks.filter(stock => {
        const symbol = stock.symbol || stock.Symbol || '';
        const name = stock.name || stock.Name || '';
        const query = searchQuery.toLowerCase();
        
        return symbol.toLowerCase().includes(query) || 
               name.toLowerCase().includes(query);
      }).slice(0, 5); // Limit to 5 results
      
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery, stocks]);
  
  // Initialize XP from profile and listen for updates
  useEffect(() => {
    if (profile && typeof profile.xp === 'number') {
      setXpValue(profile.xp)
    }
    
    const handleXpUpdate = () => {
      if (user) {
        const storedProfile = localStorage.getItem(`userProfile_${user.uid}`)
        if (storedProfile) {
          try {
          const parsedProfile = JSON.parse(storedProfile)
            if (parsedProfile && typeof parsedProfile.xp === 'number') {
          setXpValue(parsedProfile.xp)
            }
          } catch (error) {
            console.error('Error parsing stored profile:', error)
          }
        }
      }
    }
    
    window.addEventListener(XP_BALANCE_UPDATE_EVENT, handleXpUpdate)
    
    return () => {
      window.removeEventListener(XP_BALANCE_UPDATE_EVENT, handleXpUpdate)
    }
  }, [profile, user])
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/dashboard/markets?q=${encodeURIComponent(searchQuery)}`)
      setShowSearchResults(false)
    }
  }

  const handleStockSelect = (stock: any) => {
    const symbol = stock.symbol || stock.Symbol || '';
    setSearchQuery('')
    setShowSearchResults(false)
    router.push(`/dashboard/markets?stock=${encodeURIComponent(symbol)}`)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setShowSearchResults(false)
    router.push('/dashboard/markets')
  }
  
  const isVerified = user?.emailVerified || false

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }
  
  const animateXpChange = (oldValue: number, newValue: number) => {
    if (oldValue === newValue) return;
    
    const xpElement = document.getElementById('xp-display');
    if (xpElement) {
      xpElement.classList.add('xp-updated');
      
      setTimeout(() => {
        xpElement.classList.remove('xp-updated');
      }, 1500);
    }
  };
  
  useEffect(() => {
    if (profile && profile.xp !== xpValue && xpValue !== 0) {
      animateXpChange(xpValue, profile.xp);
    }
  }, [profile, xpValue]);
  
  return (
    <header className="relative z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200/50">
      <style jsx global>{`
        @keyframes xpPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); color: #f59e0b; }
          100% { transform: scale(1); }
        }
        
        .xp-updated {
          animation: xpPulse 1.5s ease;
        }
      `}</style>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Logo, hidden on larger screens */}
            <div className="lg:hidden">
              <Logo 
                href="/dashboard" 
                size="sm" 
                showText={false} // Only show icon
              />
            </div>
        
            {/* Page Title */}
            <div className="hidden lg:block">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {getCurrentSectionTitle()}
              </h1>
            </div>
          </div>
          
          {/* Enhanced Search bar with results dropdown */}
          <div className="flex-1 max-w-md mx-4 hidden sm:block relative">
            {showSearch && (
              <div className="relative">
              <form onSubmit={handleSearch} className="relative">
                  <Search className={cn(
                    "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors",
                    searchFocused ? "text-green-600" : "text-gray-500"
                  )} />
                <Input
                  type="text"
                    placeholder="Search stocks, companies..."
                    className={cn(
                      "pl-10 pr-10 py-2 bg-gray-50 border-gray-200 rounded-lg transition-all duration-200 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20",
                      searchFocused && "bg-white border-green-500"
                    )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => {
                      // Delay hiding results to allow clicking on them
                      setTimeout(() => {
                        setSearchFocused(false)
                        setShowSearchResults(false)
                      }, 200)
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
              </form>

                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] max-h-80 overflow-y-auto">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                      Search Results ({searchResults.length})
                    </div>
                    {searchResults.map((stock, index) => (
                      <div
                        key={index}
                        onClick={() => handleStockSelect(stock)}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors duration-150"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm text-gray-900">
                              {stock.symbol || stock.Symbol}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {stock.name || stock.Name}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              ₦{(stock.price || stock.Last || 0).toFixed(2)}
                            </div>
                            <div className={`text-xs font-medium ${
                              (stock.change || stock.Chg || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {(stock.change || stock.Chg || 0) >= 0 ? '+' : ''}
                              {(stock.change || stock.Chg || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
                      <button
                        onClick={() => handleSearch({ preventDefault: () => {} } as any)}
                        className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors duration-150"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  </div>
                )}

                {/* No Results Message */}
                {showSearchResults && searchQuery && searchResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999]">
                    <div className="px-3 py-4 text-center text-gray-500 text-sm">
                      No stocks found for "{searchQuery}"
                    </div>
                  </div>
                )}
              </div>
            )}
        </div>
        
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Mobile Search Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="sm:hidden hover:bg-gray-100"
              onClick={() => router.push('/dashboard/markets')}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            
            {!isVerified && (
              <Button 
                variant="outline"
                size="sm"
                className="hidden sm:flex text-amber-700 border-amber-300 hover:bg-amber-50 bg-amber-50/50 gap-1.5 text-xs font-medium"
                onClick={() => router.push('/dashboard/verify-email')}
              >
                <AlertTriangle size={14} />
                <span className="hidden md:inline">Verify Email</span>
            </Button>
          )}
          
          <div 
            id="xp-display"
              className="hidden sm:flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200"
          >
              <Star size={14} className="fill-amber-500 text-amber-500" />
              <span className="text-sm font-semibold">{(xpValue || 0).toFixed(0)} XP</span>
          </div>
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              </Button>
            </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                <div className="px-4 py-3 font-semibold border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span>Notifications</span>
                    <Badge variant="secondary" className="text-xs">3</Badge>
                  </div>
              </div>
              <div className="py-2">
                  <DropdownMenuItem className="flex flex-col items-start px-4 py-3 cursor-pointer hover:bg-gray-50">
                    <div className="font-medium text-sm text-gray-900">Market Update Available</div>
                    <div className="text-xs text-gray-500 mt-1">NGX ASI rose by 2.5% today</div>
                    <div className="text-xs text-gray-400 mt-1">5 minutes ago</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start px-4 py-3 cursor-pointer hover:bg-gray-50">
                    <div className="font-medium text-sm text-gray-900">Course Completed!</div>
                    <div className="text-xs text-gray-500 mt-1">You earned 50 XP from "Stock Analysis Basics"</div>
                    <div className="text-xs text-gray-400 mt-1">1 hour ago</div>
                </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start px-4 py-3 cursor-pointer hover:bg-gray-50">
                    <div className="font-medium text-sm text-gray-900">Portfolio Alert</div>
                    <div className="text-xs text-gray-500 mt-1">DANGOTE.COM is up 8% today</div>
                    <div className="text-xs text-gray-400 mt-1">2 hours ago</div>
                </DropdownMenuItem>
              </div>
                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                  <Button variant="ghost" className="w-full text-sm text-green-600 hover:text-green-700">
                    View All Notifications
                  </Button>
                </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
            {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 rounded-lg">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || undefined} />
                    <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                      {user?.displayName ? getInitials(user.displayName) : <User size={16} />}
                  </AvatarFallback>
                </Avatar>
                  <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {user?.displayName || 'User'}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </div>
                  {profile && (
                    <div className="flex items-center mt-1">
                      <Star size={12} className="fill-amber-500 text-amber-500 mr-1" />
                      <span className="text-xs text-amber-600 font-medium">
                        {(profile.xp || 0).toFixed(0)} XP
                      </span>
                    </div>
                  )}
                </div>
                <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                  My Profile
              </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                Settings
              </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/security')}>
                  Security
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/help')}>
                  Help & Support
                </DropdownMenuItem>
                <div className="border-t border-gray-100 my-1"></div>
              <DropdownMenuItem 
                  onClick={() => {
                    router.push('/login')
                  }}
                  className="text-red-600"
                >
                  Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
} 