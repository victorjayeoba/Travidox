"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  BookOpen, Clock, CheckCircle, ChevronRight, 
  BarChart2, TrendingUp, DollarSign, BookText, 
  Layers, ArrowUpRight, Award, BookMarked
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/hooks/useAuth'
import { 
  fetchUserCourseProgress, 
  enrollInCourse,
  CourseProgress,
  getCompletedCourseCount
} from '@/lib/firebase-courses'
import { coursesData } from '@/lib/course-data'

// Interface for course modules
interface CourseModule {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  content?: { 
    id: string; 
    type: string; 
    title: string; 
    duration: string; 
    content: string;
    quiz?: any;
    assignment?: any;
  }[];
}

interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  estimatedHours: number;
  icon: string;
  modules: CourseModule[];
}

// Mock courses data
const mockCoursesData: Course[] = [
  {
    id: "course-1",
    title: "Stock Market Terminology",
    category: "Market Education",
    description: "Master the essential vocabulary and concepts that every stock market investor needs to understand before trading.",
    tags: ["Market Vocabulary", "Financial Terms", "Trading Jargon"],
    estimatedHours: 3,
    icon: "BookText",
    modules: [
      { 
        id: "m1-1", 
        title: "Basic Market Terminology", 
        duration: "30 min", 
        isCompleted: false,
        content: [
          {
            id: "c1-1-1",
            type: "video",
            title: "Introduction to Market Terms",
            duration: "10 min",
            content: "This video covers the most essential stock market terminology every beginner should know."
          },
          {
            id: "c1-1-2",
            type: "text",
            title: "Key Market Definitions",
            duration: "10 min",
            content: "A comprehensive glossary of the most important stock market terms with detailed explanations."
          },
          {
            id: "c1-1-3",
            type: "quiz",
            title: "Market Terminology Quiz",
            duration: "10 min",
            content: "Test your understanding of basic market terminology.",
            quiz: [
              {
                id: "q1-1-1",
                question: "What is a 'Bull Market'?",
                options: [
                  "When stock prices are falling",
                  "When stock prices are rising",
                  "When the market is volatile",
                  "When trading is suspended"
                ],
                correctAnswer: 1,
                explanation: "A Bull Market refers to a financial market in which prices are rising or expected to rise. It's typically characterized by optimism, investor confidence and expectations that strong results will continue."
              }
            ]
          }
        ]
      },
      { 
        id: "m1-2", 
        title: "Order Types Explained", 
        duration: "45 min", 
        isCompleted: false,
        content: [
          {
            id: "c1-2-1",
            type: "video",
            title: "Common Order Types",
            duration: "15 min",
            content: "This video explains market orders, limit orders, stop orders, and other common order types."
          },
          {
            id: "c1-2-2",
            type: "text",
            title: "Advanced Order Strategies",
            duration: "15 min",
            content: "Learn about advanced order types and when to use them for better trade execution."
          },
          {
            id: "c1-2-3",
            type: "quiz",
            title: "Order Types Quiz",
            duration: "15 min",
            content: "Test your understanding of different order types and their uses."
          }
        ]
      },
      { 
        id: "m1-3", 
        title: "Understanding Financial Statements", 
        duration: "60 min", 
        isCompleted: false,
        content: [
          {
            id: "c1-3-1",
            type: "video",
            title: "Financial Statement Basics",
            duration: "20 min",
            content: "This video covers the three main financial statements: income statement, balance sheet, and cash flow statement."
          },
          {
            id: "c1-3-2",
            type: "text",
            title: "Key Financial Ratios",
            duration: "20 min",
            content: "Learn about important financial ratios used to evaluate companies."
          },
          {
            id: "c1-3-3",
            type: "assignment",
            title: "Financial Analysis Exercise",
            duration: "20 min",
            content: "Analyze a sample company's financial statements.",
            assignment: {
              description: "Review the provided financial statements and calculate key ratios to determine the company's financial health.",
              submission: "text"
            }
          }
        ]
      },
      { 
        id: "m1-4", 
        title: "Market Indicators Overview", 
        duration: "45 min", 
        isCompleted: false,
        content: [
          {
            id: "c1-4-1",
            type: "video",
            title: "Common Market Indicators",
            duration: "15 min",
            content: "This video explains popular market indicators like RSI, MACD, and moving averages."
          },
          {
            id: "c1-4-2",
            type: "text",
            title: "Using Indicators Effectively",
            duration: "15 min",
            content: "Learn strategies for using market indicators in your trading decisions."
          },
          {
            id: "c1-4-3",
            type: "quiz",
            title: "Market Indicators Quiz",
            duration: "15 min",
            content: "Test your understanding of market indicators and their interpretations."
          }
        ]
      }
    ]
  },
  {
    id: "course-2",
    title: "Candlestick Pattern Recognition",
    category: "Chart Analysis",
    description: "Learn to identify and trade powerful Japanese candlestick patterns for better market timing.",
    tags: ["Reversal Patterns", "Continuation Patterns", "Multi-Candle Patterns"],
    estimatedHours: 5,
    icon: "BarChart2",
    modules: [
      { 
        id: "m2-1", 
        title: "Candlestick Basics", 
        duration: "40 min", 
        isCompleted: false,
        content: [
          {
            id: "c2-1-1",
            type: "video",
            title: "Introduction to Candlestick Charts",
            duration: "15 min",
            content: "This video explains the history and basics of Japanese candlestick charts."
          },
          {
            id: "c2-1-2",
            type: "text",
            title: "Candlestick Anatomy",
            duration: "15 min",
            content: "Learn how to read candlesticks and understand what they tell you about market psychology."
          },
          {
            id: "c2-1-3",
            type: "quiz",
            title: "Candlestick Basics Quiz",
            duration: "10 min",
            content: "Test your understanding of candlestick chart basics.",
            quiz: [
              {
                id: "q2-1-1",
                question: "What does a long upper shadow (wick) on a candlestick typically indicate?",
                options: [
                  "Strong buying pressure",
                  "Strong selling pressure at higher prices",
                  "Indecision in the market",
                  "Low trading volume"
                ],
                correctAnswer: 1,
                explanation: "A long upper shadow indicates that buyers pushed the price up during the period, but sellers later rejected the higher prices and pushed it back down, showing selling pressure at those higher levels."
              }
            ]
          }
        ]
      },
      { 
        id: "m2-2", 
        title: "Single Candlestick Patterns", 
        duration: "60 min", 
        isCompleted: false,
        content: [
          {
            id: "c2-2-1",
            type: "video",
            title: "Key Single Candlestick Patterns",
            duration: "20 min",
            content: "This video covers important single candlestick patterns like doji, hammer, and shooting star."
          },
          {
            id: "c2-2-2",
            type: "text",
            title: "Interpreting Single Patterns",
            duration: "20 min",
            content: "Learn how to properly interpret single candlestick patterns in different market contexts."
          },
          {
            id: "c2-2-3",
            type: "assignment",
            title: "Pattern Identification Exercise",
            duration: "20 min",
            content: "Practice identifying single candlestick patterns on actual charts.",
            assignment: {
              description: "Review the provided charts and identify all single candlestick patterns. Explain their potential implications for future price movement.",
              submission: "text"
            }
          }
        ]
      },
      { 
        id: "m2-3", 
        title: "Double Candlestick Patterns", 
        duration: "60 min", 
        isCompleted: false,
        content: [
          {
            id: "c2-3-1",
            type: "video",
            title: "Common Double Candlestick Patterns",
            duration: "20 min",
            content: "This video explains engulfing patterns, harami patterns, and other two-candle formations."
          },
          {
            id: "c2-3-2",
            type: "text",
            title: "Trading Double Patterns",
            duration: "20 min",
            content: "Learn effective strategies for trading based on double candlestick patterns."
          },
          {
            id: "c2-3-3",
            type: "quiz",
            title: "Double Pattern Quiz",
            duration: "20 min",
            content: "Test your knowledge of double candlestick patterns and their implications.",
            quiz: [
              {
                id: "q2-3-1",
                question: "What is a bullish engulfing pattern?",
                options: [
                  "When a small bearish candle is followed by a larger bullish candle that completely engulfs it",
                  "When a large bearish candle is followed by a smaller bullish candle",
                  "When two consecutive bullish candles appear with increasing size",
                  "When a doji appears after a long bullish candle"
                ],
                correctAnswer: 0,
                explanation: "A bullish engulfing pattern occurs when a smaller bearish (red/black) candle is followed by a larger bullish (green/white) candle that completely 'engulfs' the previous candle. This suggests a potential reversal from downtrend to uptrend."
              }
            ]
          }
        ]
      },
      { 
        id: "m2-4", 
        title: "Triple Candlestick Patterns", 
        duration: "60 min", 
        isCompleted: false,
        content: [
          {
            id: "c2-4-1",
            type: "video",
            title: "Major Three-Candle Patterns",
            duration: "20 min",
            content: "This video covers important three-candle patterns like morning/evening stars and three white soldiers."
          },
          {
            id: "c2-4-2",
            type: "text",
            title: "Complex Pattern Analysis",
            duration: "20 min",
            content: "Learn advanced techniques for analyzing triple candlestick patterns."
          },
          {
            id: "c2-4-3",
            type: "assignment",
            title: "Triple Pattern Trading Plan",
            duration: "20 min",
            content: "Create trading plans for different triple candlestick patterns.",
            assignment: {
              description: "Develop detailed trading plans for morning star, evening star, and three white soldiers patterns, including entry, stop-loss, and take-profit levels.",
              submission: "text"
            }
          }
        ]
      },
      { 
        id: "m2-5", 
        title: "Pattern Trading Strategies", 
        duration: "80 min", 
        isCompleted: false,
        content: [
          {
            id: "c2-5-1",
            type: "video",
            title: "Integrating Candlestick Patterns with Other Indicators",
            duration: "30 min",
            content: "This video explains how to combine candlestick pattern analysis with other technical indicators."
          },
          {
            id: "c2-5-2",
            type: "text",
            title: "Complete Candlestick Trading System",
            duration: "30 min",
            content: "Learn how to build a complete trading system based on candlestick patterns."
          },
          {
            id: "c2-5-3",
            type: "quiz",
            title: "Final Candlestick Strategy Quiz",
            duration: "20 min",
            content: "Test your comprehensive understanding of candlestick pattern trading strategies.",
            quiz: [
              {
                id: "q2-5-1",
                question: "Which of the following would best strengthen a candlestick reversal signal?",
                options: [
                  "The pattern appears in the middle of a trading range",
                  "The pattern appears on low volume",
                  "The pattern appears at a major support or resistance level",
                  "The pattern appears during a holiday when markets are thinly traded"
                ],
                correctAnswer: 2,
                explanation: "Candlestick reversal patterns are significantly more reliable when they appear at major support or resistance levels, as these price levels already represent areas where buying or selling pressure is likely to emerge."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "course-3",
    title: "Sector Rotation Strategies",
    category: "Market Dynamics",
    description: "Optimize portfolio performance by understanding market cycles and sector movements in different economic phases.",
    tags: ["Economic Cycles", "Sector Analysis", "Rotation Timing"],
    estimatedHours: 4,
    icon: "TrendingUp",
    modules: [
      { 
        id: "m3-1", 
        title: "Economic Cycle Fundamentals", 
        duration: "45 min", 
        isCompleted: false,
        content: [
          {
            id: "c3-1-1",
            type: "video",
            title: "Understanding Economic Cycles",
            duration: "15 min",
            content: "This video explains the four phases of the economic cycle: expansion, peak, contraction, and trough."
          },
          {
            id: "c3-1-2",
            type: "text",
            title: "Economic Indicators and Their Impact",
            duration: "15 min",
            content: "Learn about leading, coincident, and lagging economic indicators and how they affect market sectors."
          },
          {
            id: "c3-1-3",
            type: "quiz",
            title: "Economic Cycle Quiz",
            duration: "15 min",
            content: "Test your understanding of economic cycles and their effect on markets.",
            quiz: [
              {
                id: "q3-1-1",
                question: "Which sector typically performs best during the early expansion phase?",
                options: [
                  "Utilities",
                  "Consumer Staples",
                  "Technology",
                  "Energy"
                ],
                correctAnswer: 2,
                explanation: "Technology stocks typically outperform during the early expansion phase as companies invest in new equipment and innovation."
              }
            ]
          }
        ]
      },
      { 
        id: "m3-2", 
        title: "Sector Performance Analysis", 
        duration: "60 min", 
        isCompleted: false,
        content: [
          {
            id: "c3-2-1",
            type: "video",
            title: "Sector Performance Through Economic Cycles",
            duration: "20 min",
            content: "This video analyzes how different sectors perform during various economic phases."
          },
          {
            id: "c3-2-2",
            type: "text",
            title: "Historical Sector Performance Data",
            duration: "20 min",
            content: "Review historical data showing how sectors have performed in past economic cycles."
          },
          {
            id: "c3-2-3",
            type: "assignment",
            title: "Sector Analysis Exercise",
            duration: "20 min",
            content: "Complete an analysis of sector performance in the current economic environment.",
            assignment: {
              description: "Analyze the current performance of three major market sectors and explain their relationship to the current economic cycle phase.",
              submission: "text"
            }
          }
        ]
      },
      { 
        id: "m3-3", 
        title: "Identifying Rotation Signals", 
        duration: "45 min", 
        isCompleted: false,
        content: [
          {
            id: "c3-3-1",
            type: "video",
            title: "Key Signals for Sector Rotation",
            duration: "15 min",
            content: "Learn to identify signals that indicate a potential sector rotation is imminent."
          },
          {
            id: "c3-3-2",
            type: "text",
            title: "Technical Indicators for Rotation",
            duration: "15 min",
            content: "Explore technical indicators that can help predict sector rotations."
          },
          {
            id: "c3-3-3",
            type: "quiz",
            title: "Rotation Signals Quiz",
            duration: "15 min",
            content: "Test your knowledge of sector rotation signals."
          }
        ]
      },
      { 
        id: "m3-4", 
        title: "Building a Sector Rotation Portfolio", 
        duration: "90 min", 
        isCompleted: false,
        content: [
          {
            id: "c3-4-1",
            type: "video",
            title: "Portfolio Construction Principles",
            duration: "30 min",
            content: "Learn how to build a portfolio that can adapt to sector rotations."
          },
          {
            id: "c3-4-2",
            type: "text",
            title: "ETFs for Sector Rotation Strategies",
            duration: "30 min",
            content: "Explore the most effective ETFs for implementing sector rotation strategies."
          },
          {
            id: "c3-4-3",
            type: "assignment",
            title: "Create Your Rotation Strategy",
            duration: "30 min",
            content: "Design a complete sector rotation strategy for the current market environment.",
            assignment: {
              description: "Create a detailed sector rotation strategy including entry/exit signals and position sizing.",
              submission: "text"
            }
          }
        ]
      }
    ]
  },
  {
    id: "course-4",
    title: "Risk Management Essentials",
    category: "Trading Strategy",
    description: "Learn to protect your capital with proper position sizing, stop-loss strategies, and risk-reward optimization.",
    tags: ["Position Sizing", "Stop-Loss Techniques", "Risk-Reward Ratio"],
    estimatedHours: 3.5,
    icon: "Layers",
    modules: [
      { 
        id: "m4-1", 
        title: "Understanding Trading Risk", 
        duration: "40 min", 
        isCompleted: false,
        content: [
          {
            id: "c4-1-1",
            type: "video",
            title: "Types of Trading Risk",
            duration: "15 min",
            content: "This video covers the different types of risk traders face in the markets."
          },
          {
            id: "c4-1-2",
            type: "text",
            title: "Risk Assessment Framework",
            duration: "15 min",
            content: "Learn a comprehensive framework for assessing trading risks before entering positions."
          },
          {
            id: "c4-1-3",
            type: "quiz",
            title: "Risk Fundamentals Quiz",
            duration: "10 min",
            content: "Test your understanding of trading risk concepts.",
            quiz: [
              {
                id: "q4-1-1",
                question: "What is the recommended maximum risk per trade for most retail traders?",
                options: [
                  "1-2% of trading capital",
                  "5-10% of trading capital",
                  "25% of trading capital",
                  "50% of trading capital"
                ],
                correctAnswer: 0,
                explanation: "Most professional traders recommend risking no more than 1-2% of your trading capital on any single trade to ensure longevity."
              }
            ]
          }
        ]
      },
      { 
        id: "m4-2", 
        title: "Position Sizing Strategies", 
        duration: "50 min", 
        isCompleted: false,
        content: [
          {
            id: "c4-2-1",
            type: "video",
            title: "Position Sizing Formulas",
            duration: "20 min",
            content: "Learn various methods to calculate appropriate position sizes based on risk tolerance."
          },
          {
            id: "c4-2-2",
            type: "text",
            title: "Advanced Position Sizing Techniques",
            duration: "15 min",
            content: "Explore advanced techniques for optimizing position sizes across a portfolio."
          },
          {
            id: "c4-2-3",
            type: "assignment",
            title: "Position Sizing Calculator",
            duration: "15 min",
            content: "Create a position sizing calculator for your trading strategy.",
            assignment: {
              description: "Build a simple position sizing calculator based on your risk parameters and typical stop-loss distances.",
              submission: "text"
            }
          }
        ]
      },
      { 
        id: "m4-3", 
        title: "Effective Stop-Loss Placement", 
        duration: "45 min", 
        isCompleted: false,
        content: [
          {
            id: "c4-3-1",
            type: "video",
            title: "Stop-Loss Placement Techniques",
            duration: "20 min",
            content: "Learn different methods for placing effective stop-loss orders."
          },
          {
            id: "c4-3-2",
            type: "text",
            title: "Volatility-Based Stops",
            duration: "15 min",
            content: "Explore how to use volatility measurements to set more effective stop-loss levels."
          },
          {
            id: "c4-3-3",
            type: "quiz",
            title: "Stop-Loss Quiz",
            duration: "10 min",
            content: "Test your knowledge of stop-loss strategies.",
            quiz: [
              {
                id: "q4-3-1",
                question: "Which of the following is typically the WORST place to set a stop-loss?",
                options: [
                  "Below a support level",
                  "Based on a fixed percentage",
                  "At a round number (like $50.00)",
                  "Using Average True Range (ATR)"
                ],
                correctAnswer: 2,
                explanation: "Round numbers are typically where many traders place their stops, making them vulnerable to 'stop hunting' by larger players in the market."
              }
            ]
          }
        ]
      },
      { 
        id: "m4-4", 
        title: "Risk-Reward Optimization", 
        duration: "45 min", 
        isCompleted: false,
        content: [
          {
            id: "c4-4-1",
            type: "video",
            title: "Understanding Risk-Reward Ratios",
            duration: "15 min",
            content: "Learn how to calculate and apply risk-reward ratios to improve profitability."
          },
          {
            id: "c4-4-2",
            type: "text",
            title: "Optimizing Risk-Reward for Different Markets",
            duration: "15 min",
            content: "Explore how risk-reward considerations change across different market types."
          },
          {
            id: "c4-4-3",
            type: "assignment",
            title: "Risk-Reward Analysis",
            duration: "15 min",
            content: "Analyze the risk-reward profiles of several potential trades.",
            assignment: {
              description: "Identify three potential trades and analyze their risk-reward profiles. Explain which one you would take and why.",
              submission: "text"
            }
          }
        ]
      },
      { 
        id: "m4-5", 
        title: "Creating a Risk Management Plan", 
        duration: "30 min", 
        isCompleted: false,
        content: [
          {
            id: "c4-5-1",
            type: "video",
            title: "Comprehensive Risk Management",
            duration: "15 min",
            content: "Learn how to create a complete risk management plan for your trading."
          },
          {
            id: "c4-5-2",
            type: "text",
            title: "Implementing Your Risk Plan",
            duration: "10 min",
            content: "Practical steps for implementing your risk management plan consistently."
          },
          {
            id: "c4-5-3",
            type: "quiz",
            title: "Final Risk Management Quiz",
            duration: "5 min",
            content: "Test your overall understanding of risk management principles.",
            quiz: [
              {
                id: "q4-5-1",
                question: "What is the most important aspect of a trading risk management plan?",
                options: [
                  "Having sophisticated technical indicators",
                  "Using complex position sizing formulas",
                  "Consistency in application",
                  "Frequent adjustments based on emotions"
                ],
                correctAnswer: 2,
                explanation: "The most important aspect of any risk management plan is consistent application. Even a simple plan followed consistently will outperform a sophisticated plan that's applied inconsistently."
              }
            ]
          }
        ]
      }
    ]
  }
];

// Icon component mapper
const IconComponent = ({ name }: { name: string }) => {
  switch (name) {
    case "BookText":
      return <BookText className="h-10 w-10 text-blue-500" />;
    case "BarChart2":
      return <BarChart2 className="h-10 w-10 text-purple-500" />;
    case "TrendingUp":
      return <TrendingUp className="h-10 w-10 text-red-500" />;
    case "Layers":
      return <Layers className="h-10 w-10 text-green-500" />;
    default:
      return <BookMarked className="h-10 w-10 text-gray-500" />;
  }
};

export default function CertificationsPage() {
  const router = useRouter();
  const { user } = useAuth(); // Get current user from auth hook
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<CourseProgress[]>([]);
  
  // Function to load user progress
  const loadUserProgress = async () => {
    setLoading(true);
    try {
      // Fetch user progress if user is logged in
      if (user?.uid) {
        const progressData = await fetchUserCourseProgress(user.uid);
        
        // Get completed count for debugging
        const completedCount = await getCompletedCourseCount(user.uid);
        console.log('Completed courses count:', completedCount);
        
        setUserProgress(progressData);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Load user progress when component mounts or when user changes
  useEffect(() => {
    loadUserProgress();
  }, [user?.uid]);
  
  // Add focus event listener to refresh data when returning to this page
  useEffect(() => {
    const handleFocus = () => {
      if (window.location.pathname === '/dashboard/certifications') {
        console.log('Window focused, refreshing course data...');
        loadUserProgress();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  
  // Get unique categories for filter
  const categories = ["all", ...new Set(coursesData.map(course => course.category))];
  
  // Filter courses based on search, category, and status
  const filteredCourses = coursesData.filter(course => {
    // Search filter
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    // Category filter
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    
    // Status filter
    let matchesStatus = true;
    if (statusFilter !== "all") {
      const progress = userProgress.find(p => p.courseId === course.id);
      if (statusFilter === "not-started") {
        matchesStatus = !progress;
      } else if (statusFilter === "in-progress") {
        matchesStatus = !!progress && !progress.completedAt;
      } else if (statusFilter === "completed") {
        matchesStatus = !!progress && !!progress.completedAt;
      }
    }
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Get course status and progress
  const getCourseStatus = (courseId: string) => {
    const progress = userProgress.find(p => p.courseId === courseId);
    
    if (!progress) {
      return { status: "not-started", progress: 0, lastModule: null };
    }
    
    if (progress.completedAt) {
      return { status: "completed", progress: 100, lastModule: null };
    }
    
    return { 
      status: "in-progress", 
      progress: progress.percentComplete,
      lastModule: coursesData
        .find(c => c.id === courseId)?.modules
        .find(m => m.id === progress.lastModuleId)
    };
  };
  
  // Calculate totals for the stats cards
  const totalCourses = coursesData.length;
  const completedCourses = userProgress.filter(p => p.completedAt).length;
  const inProgressCourses = userProgress.filter(p => p.completedAt === undefined).length;
  const notStartedCourses = totalCourses - completedCourses - inProgressCourses;
  
  // Handle course action based on status
  const handleCourseAction = async (courseId: string) => {
    if (!user?.uid) {
      // If user is not logged in, redirect to login page
      router.push('/login?redirect=/dashboard/certifications');
      return;
    }
    
    const { status } = getCourseStatus(courseId);
    const course = coursesData.find(c => c.id === courseId);
    
    if (!course) return;
    
    if (status === "not-started") {
      try {
        setLoading(true);
        // Enroll in course - Make an API call to Firebase
        const firstModuleId = course.modules[0].id;
        // Get first content ID if available
        const firstContentId = course.modules[0].content?.[0]?.id || "";
        
        const success = await enrollInCourse(user.uid, courseId, firstModuleId, firstContentId);
        
        if (success) {
          // Refresh user progress after enrollment
          const progressData = await fetchUserCourseProgress(user.uid);
          setUserProgress(progressData);
          
          // Navigate to course detail page
          router.push(`/dashboard/certifications/${courseId}`);
        }
      } catch (error) {
        console.error('Error enrolling in course:', error);
      } finally {
        setLoading(false);
      }
    } else if (status === "in-progress") {
      // Continue course
      router.push(`/dashboard/certifications/${courseId}`);
    } else {
      // View certificate
      router.push(`/dashboard/certifications/${courseId}/certificate`);
    }
  };
  
  // Loading state
  if (loading && userProgress.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4" />
        <p className="text-muted-foreground">Loading courses...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stock Market Courses</h1>
        <p className="text-gray-500">Enhance your trading and investing knowledge with our expert-led courses</p>
      </div>
      
      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Courses</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex items-center justify-between">
            <span className="text-3xl font-bold">{totalCourses}</span>
            <BookOpen className="h-8 w-8 text-gray-400" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex items-center justify-between">
            <span className="text-3xl font-bold">{completedCourses}</span>
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex items-center justify-between">
            <span className="text-3xl font-bold">{inProgressCourses}</span>
            <Clock className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Not Started</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex items-center justify-between">
            <span className="text-3xl font-bold">{notStartedCourses}</span>
            <BookMarked className="h-8 w-8 text-blue-400" />
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="w-48">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const { status, progress, lastModule } = getCourseStatus(course.id);
          
          return (
            <Card key={course.id} className="overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-start space-y-0 space-x-4">
                <div className="bg-gray-50 p-2 rounded-md">
                  <IconComponent name={course.icon} />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold">{course.title}</CardTitle>
                  <CardDescription className="text-sm">{course.category}</CardDescription>
                </div>
                
                {/* Status Badge */}
                {status === "completed" && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 ml-auto">Completed</Badge>
                )}
                {status === "in-progress" && (
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 ml-auto">In Progress</Badge>
                )}
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                
                {/* Course Progress */}
                {status === "in-progress" && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="font-medium">Current module:</span> {lastModule?.title}
                    </p>
                  </div>
                )}
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {course.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {course.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{course.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between items-center border-t bg-gray-50 py-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.estimatedHours} hours
                </div>
                
                <Button 
                  variant={status === "completed" ? "outline" : "default"}
                  size="sm"
                  className={`gap-1 ${status === "completed" ? "text-green-600" : ""}`}
                  onClick={() => handleCourseAction(course.id)}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1" />
                  ) : status === "not-started" ? (
                    <>Enroll Now<ArrowUpRight className="h-4 w-4" /></>
                  ) : status === "in-progress" ? (
                    <>Continue Module {(() => {
                      // Find the next module to continue
                      const nextModuleId = lastModule?.id;
                      if (nextModuleId) {
                        const courseData = coursesData.find(c => c.id === course.id);
                        if (courseData) {
                          const moduleIndex = courseData.modules.findIndex(m => m.id === nextModuleId) + 1;
                          return moduleIndex || "";
                        }
                      }
                      return "";
                    })()}<ChevronRight className="h-4 w-4" /></>
                  ) : (
                    <>View Certificate<Award className="h-4 w-4" /></>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {/* Empty State */}
      {filteredCourses.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
} 