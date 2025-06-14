"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  BookOpen, Clock, CheckCircle, ChevronRight, 
  BarChart2, TrendingUp, DollarSign, BookText, 
  Layers, ArrowUpRight, Award, BookMarked,
  Shield, Activity, Briefcase
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
  difficulty?: string;
}

// Mock courses data with focus on Nigerian stocks and forex
const mockCoursesData: Course[] = [
  {
    id: "course-1",
    title: "Nigerian Stock Market Fundamentals",
    category: "Nigerian Market Education",
    description: "Master the essential concepts and fundamentals of the Nigerian Stock Exchange (NGX) and learn how to analyze Nigerian stocks effectively.",
    tags: ["NGX", "Nigerian Stocks", "Market Analysis"],
    estimatedHours: 4,
    icon: "BookText",
    modules: [
      { 
        id: "m1-1", 
        title: "Introduction to the Nigerian Stock Exchange", 
        duration: "45 min", 
        isCompleted: false,
        content: [
          {
            id: "c1-1-1",
            type: "video",
            title: "Overview of the Nigerian Stock Exchange (NGX)",
            duration: "15 min",
            content: "https://www.youtube.com/embed/pZDRC07SABQ"
          },
          {
            id: "c1-1-2",
            type: "text",
            title: "History and Evolution of the Nigerian Stock Market",
            duration: "15 min",
            content: "This lesson covers the founding of the Nigerian Stock Exchange in 1960, its transformation into NGX Group in 2021, and the key milestones in its development over the decades. You'll learn about the regulatory framework under the Securities and Exchange Commission (SEC) and how the market has evolved to become one of Africa's most important stock exchanges."
          },
          {
            id: "c1-1-3",
            type: "quiz",
            title: "NGX Basics Quiz",
            duration: "15 min",
            content: "Test your understanding of the Nigerian Stock Exchange.",
            quiz: [
              {
                id: "q1-1-1",
                question: "When was the Nigerian Stock Exchange founded?",
                options: [
                  "1950",
                  "1960",
                  "1975",
                  "1999"
                ],
                correctAnswer: 1,
                explanation: "The Nigerian Stock Exchange was established in 1960, the same year Nigeria gained independence."
              }
            ]
          }
        ]
      },
      { 
        id: "m1-2", 
        title: "Key Nigerian Stock Market Indices", 
        duration: "60 min", 
        isCompleted: false,
        content: [
          {
            id: "c1-2-1",
            type: "video",
            title: "Understanding the NGX All-Share Index",
            duration: "20 min",
            content: "https://www.youtube.com/embed/MbMh6KJLpQ8"
          },
          {
            id: "c1-2-2",
            type: "text",
            title: "Sector Indices in the Nigerian Market",
            duration: "20 min",
            content: "This lesson explores the various sector indices on the Nigerian Stock Exchange, including the NGX Banking Index, NGX Insurance Index, NGX Consumer Goods Index, NGX Oil & Gas Index, and NGX Industrial Index. You'll learn how these indices are calculated, what they represent, and how investors use them to track specific sectors of the Nigerian economy."
          },
          {
            id: "c1-2-3",
            type: "quiz",
            title: "Nigerian Market Indices Quiz",
            duration: "20 min",
            content: "Test your understanding of Nigerian stock market indices and their importance."
          }
        ]
      },
      { 
        id: "m1-3", 
        title: "Top Companies on the Nigerian Exchange", 
        duration: "75 min", 
        isCompleted: false,
        content: [
          {
            id: "c1-3-1",
            type: "video",
            title: "Overview of Blue-Chip Nigerian Stocks",
            duration: "25 min",
            content: "https://www.youtube.com/embed/xW8KVL3vUks"
          },
          {
            id: "c1-3-2",
            type: "text",
            title: "Analyzing Nigerian Financial Sector Stocks",
            duration: "25 min",
            content: "This lesson focuses on major Nigerian financial sector stocks including Guaranty Trust Holding Company (GTCO), Zenith Bank, Access Holdings, United Bank for Africa (UBA), and FBN Holdings. You'll learn about their business models, financial performance metrics, dividend history, and key factors that drive their stock prices in the Nigerian market."
          },
          {
            id: "c1-3-3",
            type: "assignment",
            title: "Nigerian Stock Analysis Exercise",
            duration: "25 min",
            content: "Analyze a major Nigerian company's financial reports and stock performance.",
            assignment: {
              description: "Select one of the top 10 companies on the NGX and conduct a fundamental analysis using their latest annual report and financial statements. Identify key financial ratios and assess the company's investment potential.",
              submission: "text"
            }
          }
        ]
      }
    ]
  },
  {
    id: "course-2",
    title: "Forex Trading for Nigerian Investors",
    category: "Currency Trading",
    description: "Learn the fundamentals of forex trading with a specific focus on the Naira and strategies for Nigerian traders.",
    tags: ["Forex", "USD/NGN", "Currency Pairs"],
    estimatedHours: 5,
    icon: "TrendingUp",
    modules: [
      { 
        id: "m2-1", 
        title: "Forex Basics for Nigerian Traders", 
        duration: "60 min", 
        isCompleted: false,
        content: [
          {
            id: "c2-1-1",
            type: "video",
            title: "Introduction to Forex Trading in Nigeria",
            duration: "20 min",
            content: "https://www.youtube.com/embed/J69B5hGchUE"
          },
          {
            id: "c2-1-2",
            type: "text",
            title: "Understanding Currency Pairs and the Naira",
            duration: "20 min",
            content: "This lesson covers the fundamentals of currency pairs in forex trading with special attention to Naira-based pairs such as USD/NGN and EUR/NGN. You'll learn about the factors that influence the Naira's value, how the Nigerian foreign exchange market operates, and the role of the Central Bank of Nigeria in managing the currency."
          },
          {
            id: "c2-1-3",
            type: "quiz",
            title: "Forex Fundamentals Quiz",
            duration: "20 min",
            content: "Test your understanding of forex basics and Naira currency pairs.",
            quiz: [
              {
                id: "q2-1-1",
                question: "Which of these institutions regulates the foreign exchange market in Nigeria?",
                options: [
                  "Nigerian Stock Exchange (NGX)",
                  "Securities and Exchange Commission (SEC)",
                  "Central Bank of Nigeria (CBN)",
                  "Nigerian Investment Promotion Commission (NIPC)"
                ],
                correctAnswer: 2,
                explanation: "The Central Bank of Nigeria (CBN) is responsible for regulating the foreign exchange market in Nigeria and implements policies that affect the Naira's value."
              }
            ]
          }
        ]
      },
      { 
        id: "m2-2", 
        title: "Technical Analysis for Forex Trading", 
        duration: "90 min", 
        isCompleted: false,
        content: [
          {
            id: "c2-2-1",
            type: "video",
            title: "Key Technical Indicators for Forex Trading",
            duration: "30 min",
            content: "https://www.youtube.com/embed/lYfZaFVzDuI"
          },
          {
            id: "c2-2-2",
            type: "text",
            title: "Chart Patterns for Currency Trading",
            duration: "30 min",
            content: "This lesson explores essential chart patterns for forex traders, including head and shoulders, double tops and bottoms, triangles, flags, and pennants. You'll learn how to identify these patterns on currency charts, understand what they indicate about potential price movements, and how Nigerian traders can apply these insights to their trading strategies."
          },
          {
            id: "c2-2-3",
            type: "quiz",
            title: "Technical Analysis Quiz",
            duration: "30 min",
            content: "Test your understanding of technical analysis methods for forex trading."
          }
        ]
      },
      { 
        id: "m2-3", 
        title: "Risk Management for Nigerian Forex Traders", 
        duration: "75 min", 
        isCompleted: false,
        content: [
          {
            id: "c2-3-1",
            type: "video",
            title: "Managing Risk in Volatile Currency Markets",
            duration: "25 min",
            content: "https://www.youtube.com/embed/v6ciLT8YEzU"
          },
          {
            id: "c2-3-2",
            type: "text",
            title: "Position Sizing and Risk-to-Reward Ratios",
            duration: "25 min",
            content: "This lesson covers essential risk management techniques for forex traders, with special consideration for the high volatility often seen in emerging market currencies like the Naira. You'll learn about proper position sizing based on your account size, setting appropriate stop-loss and take-profit levels, calculating risk-to-reward ratios, and managing risk during major Nigerian and global economic events."
          },
          {
            id: "c2-3-3",
            type: "assignment",
            title: "Risk Management Plan Development",
            duration: "25 min",
            content: "Develop a comprehensive risk management plan for forex trading.",
            assignment: {
              description: "Create a detailed risk management plan for trading the USD/NGN currency pair, including position sizing rules, maximum risk per trade, daily loss limits, and strategies for managing risk during high-impact Nigerian economic events.",
              submission: "text"
            }
          }
        ]
      }
    ]
  },
  {
    id: "course-3",
    title: "Nigerian Stock Market Technical Analysis",
    category: "Chart Analysis",
    description: "Master technical analysis techniques specifically adapted for the Nigerian stock market and local trading conditions.",
    tags: ["Technical Analysis", "Chart Patterns", "Trading Strategies"],
    estimatedHours: 6,
    icon: "BarChart2",
    modules: [
      { 
        id: "m3-1", 
        title: "Technical Analysis Fundamentals", 
        duration: "60 min", 
        isCompleted: false,
        content: [
          {
            id: "c3-1-1",
            type: "video",
            title: "Technical Analysis Principles for Nigerian Stocks",
            duration: "20 min",
            content: "https://www.youtube.com/embed/08R_TJhAOGo"
          },
          {
            id: "c3-1-2",
            type: "text",
            title: "Adapting Technical Analysis to Nigerian Market Conditions",
            duration: "20 min",
            content: "This lesson explores how to adapt standard technical analysis approaches to the unique characteristics of the Nigerian stock market. You'll learn about adjusting for lower liquidity, dealing with price gaps common in Nigerian stocks, accounting for market manipulation risks, and how to interpret technical signals in the context of the Nigerian regulatory environment and market structure."
          },
          {
            id: "c3-1-3",
            type: "quiz",
            title: "Technical Analysis Basics Quiz",
            duration: "20 min",
            content: "Test your understanding of technical analysis principles as applied to Nigerian stocks."
          }
        ]
      },
      { 
        id: "m3-2", 
        title: "Chart Patterns in Nigerian Stocks", 
        duration: "90 min", 
        isCompleted: false,
        content: [
          {
            id: "c3-2-1",
            type: "video",
            title: "Identifying Chart Patterns on Nigerian Stock Charts",
            duration: "30 min",
            content: "https://www.youtube.com/embed/TmKT8daJJJw"
          },
          {
            id: "c3-2-2",
            type: "text",
            title: "Case Studies: Chart Patterns in Top Nigerian Stocks",
            duration: "30 min",
            content: "This lesson examines real-world chart pattern examples from major Nigerian stocks like Dangote Cement, MTN Nigeria, Nestle Nigeria, and Airtel Africa. You'll analyze historical chart patterns that formed in these stocks, understand how they played out, and learn to identify similar patterns in current market conditions. The lesson also covers pattern reliability statistics specific to the Nigerian market."
          },
          {
            id: "c3-2-3",
            type: "quiz",
            title: "Chart Patterns Quiz",
            duration: "30 min",
            content: "Test your ability to identify and interpret chart patterns in Nigerian stocks."
          }
        ]
      },
      { 
        id: "m3-3", 
        title: "Technical Indicators for Nigerian Market Timing", 
        duration: "75 min", 
        isCompleted: false,
        content: [
          {
            id: "c3-3-1",
            type: "video",
            title: "Optimal Technical Indicators for Nigerian Stocks",
            duration: "25 min",
            content: "https://www.youtube.com/embed/NQHOM2i8BuA"
          },
          {
            id: "c3-3-2",
            type: "text",
            title: "Creating a Technical Analysis System for Nigerian Trading",
            duration: "25 min",
            content: "This lesson guides you through developing a complete technical analysis system tailored to Nigerian market conditions. You'll learn which indicators work best for Nigerian stocks, how to combine multiple indicators for confirmation, creating a systematic approach to technical analysis, and establishing objective entry and exit criteria based on technical signals in the Nigerian market context."
          },
          {
            id: "c3-3-3",
            type: "assignment",
            title: "Nigerian Stock Technical Analysis Project",
            duration: "25 min",
            content: "Conduct a complete technical analysis of a Nigerian stock.",
            assignment: {
              description: "Select a liquid stock from the NGX-30 index and perform a comprehensive technical analysis. Identify key support/resistance levels, relevant chart patterns, and apply at least three technical indicators. Based on your analysis, create a trading plan with specific entry points, stop-loss levels, and profit targets.",
              submission: "text"
            }
          }
        ]
      }
    ]
  },
  {
    id: "course-4",
    title: "Risk Management Essentials for Nigerian Investors",
    category: "Trading Strategy",
    description: "Learn to protect your capital with proper position sizing, stop-loss strategies, and risk management techniques adapted for Nigerian market conditions.",
    tags: ["Position Sizing", "Stop-Loss Strategies", "Risk-Reward Ratio"],
    estimatedHours: 4,
    icon: "Layers",
    modules: [
      { 
        id: "m4-1", 
        title: "Risk Management Fundamentals", 
        duration: "60 min", 
        isCompleted: false,
        content: [
          {
            id: "c4-1-1",
            type: "video",
            title: "Introduction to Risk Management for Nigerian Investors",
            duration: "20 min",
            content: "https://www.youtube.com/embed/uBBge9v9eXQ"
          },
          {
            id: "c4-1-2",
            type: "text",
            title: "Nigeria-Specific Investment Risks",
            duration: "20 min",
            content: "This lesson explores the unique risk factors in the Nigerian investment landscape, including currency risk and the impact of Naira fluctuations, political and regulatory risks specific to Nigeria, liquidity risk in the Nigerian market, and infrastructure and operational risks. You'll learn practical approaches to assessing and mitigating these Nigeria-specific investment challenges."
          },
          {
            id: "c4-1-3",
            type: "quiz",
            title: "Risk Management Basics Quiz",
            duration: "20 min",
            content: "Test your understanding of risk management principles for Nigerian investing."
          }
        ]
      },
      { 
        id: "m4-2", 
        title: "Position Sizing for Nigerian Stocks", 
        duration: "60 min", 
        isCompleted: false,
        content: [
          {
            id: "c4-2-1",
            type: "video",
            title: "Optimal Position Sizing Methods",
            duration: "20 min",
            content: "https://www.youtube.com/embed/vLGPVGSDYlc"
          },
          {
            id: "c4-2-2",
            type: "text",
            title: "Position Sizing Formulas and Calculations",
            duration: "20 min",
            content: "This lesson provides practical formulas and calculations for determining appropriate position sizes when trading Nigerian stocks and other assets. You'll learn about fixed percentage risk models, volatility-based position sizing using Average True Range (ATR), adjusting position size based on correlation with other holdings, and maintaining proper diversification across Nigerian market sectors."
          },
          {
            id: "c4-2-3",
            type: "quiz",
            title: "Position Sizing Quiz",
            duration: "20 min",
            content: "Test your ability to calculate appropriate position sizes for different scenarios."
          }
        ]
      },
      { 
        id: "m4-3", 
        title: "Stop-Loss Strategies for Nigerian Market Volatility", 
        duration: "60 min", 
        isCompleted: false,
        content: [
          {
            id: "c4-3-1",
            type: "video",
            title: "Effective Stop-Loss Placement in Volatile Markets",
            duration: "20 min",
            content: "https://www.youtube.com/embed/lk-SLJcvkXA"
          },
          {
            id: "c4-3-2",
            type: "text",
            title: "Advanced Stop-Loss Techniques",
            duration: "20 min",
            content: "This lesson covers sophisticated stop-loss strategies adapted for the volatility characteristics of Nigerian financial markets. You'll learn about volatility-based stops using ATR for Nigerian stocks, time-based stops for limiting exposure during uncertain periods, trailing stops to protect profits in trending Nigerian stocks, and psychological aspects of maintaining stop-loss discipline in the Nigerian trading environment."
          },
          {
            id: "c4-3-3",
            type: "assignment",
            title: "Risk Management Plan Development",
            duration: "20 min",
            content: "Create a comprehensive risk management plan for Nigerian investing.",
            assignment: {
              description: "Develop a detailed risk management plan for a portfolio of Nigerian stocks. Include position sizing rules, stop-loss strategies, maximum risk per trade and per sector, drawdown limits, and a plan for regular risk assessment reviews.",
              submission: "text"
            }
              }
            ]
          }
        ]
      },
      { 
    id: "course-5",
    title: "Fundamental Analysis of Nigerian Stocks",
    category: "Investment Analysis",
    description: "Learn to evaluate Nigerian companies using financial statements, valuation metrics, and economic indicators specific to the Nigerian market.",
    tags: ["Financial Analysis", "Valuation Methods", "Nigerian Equities"],
    estimatedHours: 5,
    icon: "BookText",
    modules: [
      { 
        id: "m5-1", 
        title: "Nigerian Financial Statement Analysis", 
        duration: "75 min", 
        isCompleted: false,
        content: [
          {
            id: "c5-1-1",
            type: "video",
            title: "Reading Nigerian Company Financial Reports",
            duration: "25 min",
            content: "https://www.youtube.com/embed/zlrMz0tFVGo"
          },
          {
            id: "c5-1-2",
            type: "text",
            title: "Key Financial Ratios for Nigerian Stocks",
            duration: "25 min",
            content: "This lesson examines the most important financial ratios for analyzing Nigerian stocks, with appropriate benchmarks for the local market. You'll learn about profitability ratios (ROE, ROA, Net Margin) in the Nigerian context, liquidity and solvency metrics with Nigerian industry standards, efficiency ratios and what they reveal about management quality, and dividend metrics including yield and payout ratios for Nigerian companies."
          },
          {
            id: "c5-1-3",
            type: "quiz",
            title: "Financial Analysis Quiz",
            duration: "25 min",
            content: "Test your ability to analyze Nigerian company financial statements."
          }
        ]
      },
      { 
        id: "m5-2", 
        title: "Valuation Methods for Nigerian Equities", 
        duration: "90 min", 
        isCompleted: false,
        content: [
          {
            id: "c5-2-1",
            type: "video",
            title: "Stock Valuation Techniques for Nigerian Companies",
            duration: "30 min",
            content: "https://www.youtube.com/embed/PAtJIhWZ0oc"
          },
          {
            id: "c5-2-2",
            type: "text",
            title: "Appropriate Valuation Multiples for Nigerian Sectors",
            duration: "30 min",
            content: "This lesson provides sector-specific guidance on selecting appropriate valuation multiples for Nigerian companies. You'll learn about typical P/E, P/B, and EV/EBITDA ranges for banking and financial services in Nigeria, valuation standards for Nigerian consumer goods and retail companies, metrics for industrial, oil & gas, and telecommunications sectors, and adjusting valuation expectations for Nigerian market risk premiums."
          },
          {
            id: "c5-2-3",
            type: "quiz",
            title: "Valuation Methods Quiz",
            duration: "30 min",
            content: "Test your understanding of valuation techniques for Nigerian stocks."
          }
        ]
      },
      { 
        id: "m5-3", 
        title: "Economic Indicators and Nigerian Stocks", 
        duration: "75 min", 
        isCompleted: false,
        content: [
          {
            id: "c5-3-1",
            type: "video",
            title: "Key Economic Indicators Affecting Nigerian Equities",
            duration: "25 min",
            content: "https://www.youtube.com/embed/p3D4M8RUP-4"
          },
          {
            id: "c5-3-2",
            type: "text",
            title: "Sector Sensitivity to Economic Factors",
            duration: "25 min",
            content: "This lesson analyzes how different sectors of the Nigerian stock market respond to various economic indicators. You'll examine banking sector sensitivity to interest rates and monetary policy, consumer goods correlation with inflation and consumer spending data, oil & gas stock relationships with crude prices and exchange rates, and how infrastructure and industrial stocks react to government spending and policy changes."
          },
          {
            id: "c5-3-3",
            type: "assignment",
            title: "Nigerian Stock Fundamental Analysis Project",
            duration: "25 min",
            content: "Conduct a comprehensive fundamental analysis of a Nigerian company.",
            assignment: {
              description: "Select a company from the NGX-30 index and perform a complete fundamental analysis. Analyze three years of financial statements, calculate key ratios, determine an appropriate valuation using multiple methods, and assess how major Nigerian economic indicators affect the company's outlook.",
              submission: "text"
            }
          }
        ]
      }
    ]
  }
];

// Icon component mapper
const IconComponent = ({ name, className = "" }: { name: string, className?: string }) => {
  // Use the provided className or default to neutral color
  const baseClassName = className || "h-5 w-5 text-gray-500";
  
  switch (name) {
    case "BookText":
      return <BookText className={baseClassName} />;
    case "BarChart2":
      return <BarChart2 className={baseClassName} />;
    case "TrendingUp":
      return <TrendingUp className={baseClassName} />;
    case "Layers":
      return <Layers className={baseClassName} />;
    case "DollarSign":
      return <DollarSign className={baseClassName} />;
    case "Shield":
      return <Shield className={baseClassName} />;
    case "Activity":
      return <Activity className={baseClassName} />;
    case "Briefcase":
      return <Briefcase className={baseClassName} />;
    default:
      return <BookMarked className={baseClassName} />;
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
        <h1 className="text-3xl font-bold text-gray-900">Nigerian Financial Education</h1>
        <p className="text-gray-500">Master Nigerian stock market trading, forex, and financial literacy with our specialized courses</p>
      </div>
      
      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Courses</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex items-center justify-between">
            <span className="text-3xl font-bold">{totalCourses}</span>
            <BookOpen className="h-8 w-8 text-green-600" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex items-center justify-between">
            <span className="text-3xl font-bold">{completedCourses}</span>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex items-center justify-between">
            <span className="text-3xl font-bold">{inProgressCourses}</span>
            <Clock className="h-8 w-8 text-green-600" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Not Started</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex items-center justify-between">
            <span className="text-3xl font-bold">{notStartedCourses}</span>
            <BookMarked className="h-8 w-8 text-green-600" />
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
          
          // Determine difficulty level based on course properties or default to beginner
          const difficulty = course.difficulty || (
            course.category?.includes('Advanced') ? 'advanced' : 
            course.category?.includes('Intermediate') ? 'intermediate' : 
            'beginner'
          );
          
          // Determine difficulty label
          const difficultyLabel = {
            beginner: 'Beginner',
            intermediate: 'Intermediate',
            advanced: 'Advanced'
          }[difficulty];
          
          const statusColors = {
            completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
            "in-progress": "bg-green-50 text-green-700 border-green-200",
            "not-started": "bg-gray-50 text-gray-600 border-gray-200"
          };
          
          return (
            <Card 
              key={course.id} 
              className="overflow-hidden border hover:shadow-md transition-all duration-300 flex flex-col h-full"
              onClick={() => handleCourseAction(course.id)}
            >
              <div className="h-2 w-full bg-green-500"></div>
              
              <div className="p-5 flex flex-col h-full">
                <div className="flex items-start gap-3 mb-3">
                  <div className="rounded-full p-2.5 bg-green-50">
                    <IconComponent 
                      name={course.icon} 
                      className="h-5 w-5 text-green-600"
                    />
                </div>
                  
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900 mb-0.5 line-clamp-2">
                        {course.title}
                      </h3>
                      <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-0.5 ml-2">
                        {difficultyLabel}
                      </Badge>
                </div>
                    <p className="text-xs text-gray-500 mb-1">{course.category}</p>
                    
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>{course.estimatedHours} hours</span>
                      
                      <Badge 
                        className={`ml-auto text-xs px-1.5 py-0 ${
                          status === "completed" ? statusColors["completed"] : 
                          status === "in-progress" ? statusColors["in-progress"] : 
                          statusColors["not-started"]
                        }`}
                      >
                        {status === "completed" ? "Completed" : 
                         status === "in-progress" ? `${progress}% Complete` : 
                         "Not Started"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">{course.description}</p>
                </div>
                
                {/* Course Progress */}
                {status === "in-progress" && (
                  <div className="space-y-1 mb-3">
                    <Progress value={progress} className="h-1.5 bg-gray-100">
                      <div className="bg-green-600 h-full w-[var(--value%)]" />
                    </Progress>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      <span className="font-medium">Current:</span> {lastModule?.title}
                    </p>
                  </div>
                )}
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {course.tags?.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="mt-auto">
                <Button 
                  variant={status === "completed" ? "outline" : "default"}
                    className={`w-full gap-1 ${
                      status === "completed" ? "border-green-200 text-green-700 hover:bg-green-50" : 
                      "bg-green-600 hover:bg-green-700"
                    }`}
                  size="sm"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1" />
                  ) : status === "not-started" ? (
                      <>Start Learning<ArrowUpRight className="h-4 w-4" /></>
                  ) : status === "in-progress" ? (
                      <>Continue Learning<ChevronRight className="h-4 w-4" /></>
                  ) : (
                    <>View Certificate<Award className="h-4 w-4" /></>
                  )}
                </Button>
                </div>
              </div>
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