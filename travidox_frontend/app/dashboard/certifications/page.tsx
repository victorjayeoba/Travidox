"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Award, BookOpen, Search, Filter, GraduationCap, 
  CheckCircle2, Clock, ChevronRight, Grid, List,
  BarChart2, LineChart, PieChart, TrendingUp, DollarSign,
  BookMarked, Briefcase, Activity, BarChart, PieChart2
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Course status badges
const statusBadges: Record<string, string> = {
  'ongoing': 'bg-yellow-100 text-yellow-600 border-yellow-200',
  'done': 'bg-green-100 text-green-600 border-green-200',
  'paused': 'bg-gray-100 text-gray-600 border-gray-200',
};

// Course category colors
const categoryColors: Record<string, string> = {
  'fundamental': 'bg-blue-100 text-blue-700',
  'technical': 'bg-purple-100 text-purple-700',
  'strategy': 'bg-amber-100 text-amber-700',
  'analysis': 'bg-emerald-100 text-emerald-700',
  'trading': 'bg-green-100 text-green-700',
};

// Course icons by type
const courseIcons: Record<string, any> = {
  'fundamental': <BookMarked className="w-5 h-5 text-blue-600" />,
  'technical': <LineChart className="w-5 h-5 text-purple-600" />,
  'strategy': <TrendingUp className="w-5 h-5 text-amber-600" />,
  'analysis': <PieChart className="w-5 h-5 text-emerald-600" />,
  'trading': <BarChart2 className="w-5 h-5 text-green-600" />,
  'investment': <DollarSign className="w-5 h-5 text-indigo-600" />,
  'market': <Activity className="w-5 h-5 text-red-600" />,
  'portfolio': <Briefcase className="w-5 h-5 text-teal-600" />,
};

// Certification Card Component
interface CertificationCardProps {
  title: string
  description: string
  category: string
  type: string
  estimatedHours: number
  progress?: number
  status: 'ongoing' | 'done' | 'paused'
  instructor: {
    name: string
    avatar?: string
  }
  skills: string[]
  slug: string
}

function CertificationCard({
  title,
  description,
  category,
  type,
  estimatedHours,
  progress = 0,
  status,
  instructor,
  skills,
  slug
}: CertificationCardProps) {
  const isDone = status === 'done';
  const courseIcon = courseIcons[type] || <BookOpen className="w-5 h-5 text-gray-600" />;
  
  return (
    <Card className="transition-all duration-300 hover:shadow-md overflow-hidden h-full flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Course icon */}
        <div className="p-5 pb-4">
          <div className="flex justify-between items-start mb-2">
            <div className="w-12 h-12 rounded-md bg-gray-50 flex items-center justify-center mb-3">
              <div className="w-10 h-10 rounded-md flex items-center justify-center">
                {courseIcon}
              </div>
            </div>
            
            <Badge className={statusBadges[status] || 'bg-gray-100 text-gray-600'}>
              {status === 'done' ? 'Completed' : status === 'ongoing' ? 'In Progress' : 'Not Started'}
            </Badge>
          </div>
          
          <h3 className="text-lg font-semibold mb-1 text-gray-900">{title}</h3>
          
          <div className="text-sm text-gray-500 mb-2">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </div>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700 text-xs">
                {skill}
              </Badge>
            ))}
            {skills.length > 3 && (
              <Badge variant="outline" className="bg-gray-50 text-gray-700 text-xs">
                +{skills.length - 3}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        {status !== 'done' && (
          <div className="px-5 mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">{progress}% complete</span>
              <span className="text-gray-500">{estimatedHours} hours</span>
            </div>
            <Progress 
              value={progress} 
              className="h-1.5 bg-gray-100" 
              indicatorClassName={`${status === 'paused' ? 'bg-gray-400' : status === 'ongoing' ? 'bg-yellow-500' : 'bg-green-500'}`}
            />
          </div>
        )}
        
        {/* Action button */}
        <div className="mt-auto border-t p-4">
          <Link href={`/dashboard/certifications/${slug}`} className="w-full">
            <Button 
              variant={isDone ? "outline" : "default"}
              size="sm"
              className={cn(
                "w-full justify-center",
                isDone ? "border-green-500 text-green-600 hover:bg-green-50" : 
                status === 'ongoing' ? "bg-yellow-500 hover:bg-yellow-600 text-white" : 
                "bg-gray-500 hover:bg-gray-600 text-white"
              )}
            >
              {isDone ? 'View Certificate' : progress > 0 ? 'Continue Learning' : 'Start Course'}
              <ChevronRight size={14} className="ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

// Mock certification data with updated format
const certifications = [
  {
    title: "Stock Market Fundamentals",
    description: "Learn the essential concepts, terminology, and mechanics of how the stock market works.",
    category: "Market Basics",
    type: "fundamental",
    estimatedHours: 8,
    progress: 35,
    status: "ongoing",
    instructor: {
      name: "Brad Traversy",
      avatar: "/instructors/brad.jpg"
    },
    skills: ["Market Mechanics", "Stock Indices", "Market Participants", "Order Types"],
    slug: "stock-market-fundamentals"
  },
  {
    title: "Technical Analysis Essentials",
    description: "Master chart reading, pattern recognition, and technical indicators for better trade timing.",
    category: "Chart Analysis",
    type: "technical",
    estimatedHours: 12,
    progress: 100,
    status: "done",
    instructor: {
      name: "InsideCode M",
      avatar: "/instructors/inside.jpg"
    },
    skills: ["Chart Patterns", "Indicators", "Trend Analysis", "Support/Resistance"],
    slug: "technical-analysis-essentials"
  },
  {
    title: "Value Investing Masterclass",
    description: "Learn Warren Buffett's approach to finding undervalued companies with strong fundamentals.",
    category: "Investment Strategy",
    type: "strategy",
    estimatedHours: 10,
    progress: 22,
    status: "ongoing",
    instructor: {
      name: "JustD McQuil",
      avatar: "/instructors/justd.jpg"
    },
    skills: ["Financial Analysis", "Company Valuation", "Competitive Advantage", "Margin of Safety"],
    slug: "value-investing-masterclass"
  },
  {
    title: "Swing Trading Strategies",
    description: "Capture medium-term market moves with proven swing trading tactics and risk management.",
    category: "Trading Tactics",
    type: "trading",
    estimatedHours: 14,
    progress: 5,
    status: "ongoing",
    instructor: {
      name: "Anthony Alicea",
      avatar: "/instructors/anthony.jpg"
    },
    skills: ["Entry/Exit Tactics", "Position Sizing", "Profit Targets", "Stop Placement"],
    slug: "swing-trading-strategies"
  },
  {
    title: "Options Trading Fundamentals",
    description: "Understand call and put options, option pricing, and basic strategies for income and leverage.",
    category: "Derivatives",
    type: "fundamental",
    estimatedHours: 8,
    progress: 65,
    status: "ongoing",
    instructor: {
      name: "Joseph Angelo",
      avatar: "/instructors/joseph.jpg"
    },
    skills: ["Options Basics", "Greeks", "Covered Calls", "Protective Puts"],
    slug: "options-trading-fundamentals"
  },
  {
    title: "Dividend Growth Investing",
    description: "Build wealth through dividend-paying stocks with focus on companies that increase payouts.",
    category: "Income Strategy",
    type: "investment",
    estimatedHours: 6,
    progress: 100,
    status: "done",
    instructor: {
      name: "Janice Carroll",
      avatar: "/instructors/janice.jpg"
    },
    skills: ["Dividend Analysis", "Payout Ratios", "Income Portfolio", "DRIP Strategies"],
    slug: "dividend-growth-investing"
  },
  {
    title: "ETF Portfolio Building",
    description: "Construct a diversified portfolio using ETFs for long-term growth with lower fees and risk.",
    category: "Portfolio Management",
    type: "portfolio",
    estimatedHours: 12,
    progress: 100,
    status: "done",
    instructor: {
      name: "Sara Perkins",
      avatar: "/instructors/sara.jpg"
    },
    skills: ["Asset Allocation", "ETF Selection", "Portfolio Rebalancing", "Tax Efficiency"],
    slug: "etf-portfolio-building"
  },
  {
    title: "Trading Psychology Mastery",
    description: "Overcome emotional biases and develop the mindset needed for consistent trading success.",
    category: "Trader Mindset",
    type: "fundamental",
    estimatedHours: 4,
    progress: 82,
    status: "ongoing",
    instructor: {
      name: "Sara Perkins",
      avatar: "/instructors/sara.jpg"
    },
    skills: ["Emotional Control", "Discipline", "Risk Tolerance", "Decision Making"],
    slug: "trading-psychology-mastery"
  },
  {
    title: "IPO Investment Strategies",
    description: "Learn to analyze and invest in Initial Public Offerings for potential growth opportunities.",
    category: "Special Situations",
    type: "strategy",
    estimatedHours: 5,
    progress: 0,
    status: "paused",
    instructor: {
      name: "Wayne Patel",
      avatar: "/instructors/wayne.jpg"
    },
    skills: ["IPO Analysis", "Valuation Methods", "Market Timing", "Post-IPO Trading"],
    slug: "ipo-investment-strategies"
  },
  {
    title: "Stock Screening Masterclass",
    description: "Find winning stocks faster with powerful screening techniques and custom filter creation.",
    category: "Research Tools",
    type: "analysis",
    estimatedHours: 7,
    progress: 0,
    status: "paused",
    instructor: {
      name: "Joshua Burton",
      avatar: "/instructors/joshua.jpg"
    },
    skills: ["Screen Building", "Fundamental Filters", "Technical Filters", "Screen Testing"],
    slug: "stock-screening-masterclass"
  },
  {
    title: "Day Trading Foundations",
    description: "Learn professional day trading setups, strategies and risk management techniques.",
    category: "Active Trading",
    type: "trading",
    estimatedHours: 16,
    progress: 45,
    status: "ongoing",
    instructor: {
      name: "Debra Oliver",
      avatar: "/instructors/debra.jpg"
    },
    skills: ["Intraday Setups", "Scalping", "Momentum Trading", "Risk Management"],
    slug: "day-trading-foundations"
  },
  {
    title: "Financial Statement Analysis",
    description: "Develop skills to read company reports and extract key insights for better investment decisions.",
    category: "Fundamental Analysis",
    type: "analysis",
    estimatedHours: 10,
    progress: 18,
    status: "ongoing",
    instructor: {
      name: "Deborah Pena",
      avatar: "/instructors/deborah.jpg"
    },
    skills: ["Income Statements", "Balance Sheets", "Cash Flow Analysis", "Financial Ratios"],
    slug: "financial-statement-analysis"
  }
];

// Trading specific courses
const tradingCourses = [
  {
    title: "Stock Market Terminology",
    description: "Master the essential vocabulary and concepts that every stock market investor needs to know.",
    category: "Market Education",
    type: "fundamental",
    estimatedHours: 3,
    progress: 100,
    status: "done",
    instructor: {
      name: "Michael Thompson",
      avatar: "/instructors/michael.jpg"
    },
    skills: ["Market Vocabulary", "Financial Terms", "Trading Jargon", "Investor Language"],
    slug: "stock-market-terminology"
  },
  {
    title: "Candlestick Pattern Recognition",
    description: "Learn to identify and trade powerful Japanese candlestick patterns for better market timing.",
    category: "Chart Analysis",
    type: "technical",
    estimatedHours: 5,
    progress: 60,
    status: "ongoing",
    instructor: {
      name: "Jane Smith",
      avatar: "/instructors/jane.jpg"
    },
    skills: ["Reversal Patterns", "Continuation Patterns", "Multi-Candle Patterns", "Signal Strength"],
    slug: "candlestick-pattern-recognition"
  },
  {
    title: "Sector Rotation Strategies",
    description: "Optimize portfolio performance by understanding market cycles and sector rotation principles.",
    category: "Market Dynamics",
    type: "market",
    estimatedHours: 4,
    progress: 25,
    status: "ongoing",
    instructor: {
      name: "Robert Chen",
      avatar: "/instructors/robert.jpg"
    },
    skills: ["Economic Cycles", "Sector Analysis", "Rotation Timing", "Sector ETFs"],
    slug: "sector-rotation-strategies"
  },
  {
    title: "Algorithmic Trading Basics",
    description: "Introduction to creating and implementing rules-based trading systems for consistent results.",
    category: "Automated Trading",
    type: "trading",
    estimatedHours: 12,
    progress: 0,
    status: "paused",
    instructor: {
      name: "Alex Johnson",
      avatar: "/instructors/alex.jpg"
    },
    skills: ["Trading Algorithms", "Backtesting", "Strategy Automation", "System Development"],
    slug: "algorithmic-trading-basics"
  }
];

// Combine all courses for the full list
const allCourses = [...tradingCourses, ...certifications];

export default function CertificationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [viewMode, setViewMode] = useState("grid") // grid or list
  
  // Filter courses based on search query and category
  const filterCourses = (courses: any[]) => {
    let filtered = courses;
    
    if (searchQuery) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (categoryFilter !== "All Categories") {
      filtered = filtered.filter(course => 
        course.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }
    
    return filtered;
  }
  
  // Count total and completed courses
  const totalCourses = allCourses.length;
  const completedCourses = allCourses.filter(course => course.status === 'done').length;
  
  // Get unique categories for filter
  const categories = ["All Categories", ...new Set(allCourses.map(course => 
    course.category
  ))];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stock Market Courses</h1>
        <p className="text-gray-500 mt-1">Enhance your trading and investing knowledge with our expert-led courses</p>
      </div>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Courses</p>
                <h3 className="text-2xl font-bold text-gray-900">{totalCourses}</h3>
              </div>
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <h3 className="text-2xl font-bold text-green-600">{completedCourses}</h3>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <h3 className="text-2xl font-bold text-yellow-600">
                  {allCourses.filter(course => course.status === 'ongoing').length}
                </h3>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Not Started</p>
                <h3 className="text-2xl font-bold text-gray-600">
                  {allCourses.filter(course => course.status === 'paused').length}
                </h3>
              </div>
              <BookMarked className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters and View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">Filter By:</div>
          
          <div className="relative">
            <select 
              className="border rounded-md py-1.5 pl-3 pr-8 text-sm appearance-none bg-white"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <ChevronRight size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400" />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search courses..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className={viewMode === 'list' ? 'bg-gray-100' : ''}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className={viewMode === 'grid' ? 'bg-gray-100' : ''}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Course Grid */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {filterCourses(allCourses).length > 0 ? (
          filterCourses(allCourses).map((course) => (
            <CertificationCard key={course.slug} {...course} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No courses found matching your search.
          </div>
        )}
      </div>
    </div>
  )
} 