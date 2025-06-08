/**
 * Course Data Module
 * 
 * This module defines the data structure and content for all courses in the Travidox platform.
 * It includes type definitions, mock course data, and helper functions for accessing courses.
 */

// Type Definitions
export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'code' | 'file';
  url: string;
  description: string;
}

export interface ModuleContent {
  id: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  title: string;
  duration: string;
  content: string;
  videoUrl?: string;
  quiz?: QuizQuestion[];
  resources?: Resource[];
  assignment?: {
    description: string;
    submission: 'text' | 'file' | 'link';
    dueDate?: string;
  };
}

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  isCompleted: boolean;
  content: ModuleContent[];
  order: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CoursePrerequisite {
  id: string;
  title: string;
  description: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  subcategory?: string;
  description: string;
  longDescription: string;
  tags: string[];
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  coverImage: string;
  instructor: Instructor;
  instructors?: Instructor[];
  lastUpdated: string;
  createdAt: string;
  language: string;
  modules: Module[];
  skills: string[];
  prerequisites: CoursePrerequisite[];
  reviews: Review[];
  price: number;
  discountPrice?: number;
  isFeatured?: boolean;
  averageRating?: number;
  totalStudents?: number;
  certificationIncluded: boolean;
}

// Sample instructors
const instructors: Instructor[] = [
  {
    id: "inst-1",
    name: "John Thompson",
    title: "Market Education Expert & Professional Trader",
    avatar: "/instructors/john.jpg",
    bio: "John Thompson is a seasoned trader with over 15 years of experience in the financial markets. He previously worked as a portfolio manager at Goldman Sachs and now dedicates his time to teaching aspiring traders."
  },
  {
    id: "inst-2",
    name: "Sarah Chen",
    title: "Technical Analysis Specialist",
    avatar: "/instructors/sarah.jpg",
    bio: "Sarah is a certified technical analyst with expertise in Japanese candlestick patterns and chart analysis. She has authored two books on technical trading strategies."
  },
  {
    id: "inst-3",
    name: "Michael Rodriguez",
    title: "Risk Management Professional",
    avatar: "/instructors/michael.jpg",
    bio: "Michael has worked with hedge funds for over a decade specializing in risk assessment and management. He holds a Ph.D. in Financial Mathematics from MIT."
  },
  {
    id: "inst-4",
    name: "Emma Wilson",
    title: "Sector Analysis Expert",
    avatar: "/instructors/emma.jpg",
    bio: "Emma is an experienced sector analyst who has helped institutional investors optimize their portfolios through strategic sector rotation. She previously worked at Blackrock's research division."
  }
];

/**
 * Course Data Repository
 * Contains all courses available on the platform
 */
export const coursesData: Course[] = [
  {
    id: "course-1",
    title: "Stock Market Fundamentals",
    subtitle: "Master the essential concepts and terminology for successful trading",
    category: "Market Education",
    subcategory: "Market Basics",
    description: "Master the essential concepts and terminology that every stock market investor needs to understand before trading.",
    longDescription: `
This comprehensive course is designed to build a solid foundation for anyone looking to enter the stock market. You'll learn the core concepts, terminology, and principles that drive financial markets.

### What You'll Learn:
- Understand how stock markets function and their role in the economy
- Learn about different market participants and their impact
- Decode financial statements and key metrics
- Develop basic skills to evaluate investment opportunities
- Build a strategic mindset for long-term investing success

### Course Features:
- 8 modules with over 4 hours of video content
- Interactive quizzes to reinforce learning
- Downloadable resources and cheat sheets
- Real-world examples and case studies
- Certificate of completion

Whether you're a complete beginner or have some exposure to the markets, this course will provide the structured knowledge you need to confidently begin your investment journey.
    `,
    tags: ["Market Basics", "Trading Fundamentals", "Investment Strategy", "Financial Literacy"],
    estimatedHours: 4,
    difficulty: "beginner",
    icon: "BookText",
    coverImage: "/courses/stock-market-fundamentals.jpg",
    instructor: instructors[0],
    lastUpdated: "March 15, 2024",
    createdAt: "January 10, 2024",
    language: "English",
    modules: [
      { 
        id: "m1-1", 
        title: "Introduction to Stock Market", 
        description: "Learn the fundamental concepts of stock markets and how they function",
        duration: "45 min", 
        isCompleted: false,
        order: 1,
        content: [
          {
            id: "c1-1-1",
            type: "video",
            title: "What is the Stock Market?",
            duration: "15 min",
            videoUrl: "https://example.com/video1.mp4",
            content: "An introduction to the stock market and its role in the global economy."
          },
          {
            id: "c1-1-2",
            type: "text",
            title: "Understanding Market Basics",
            duration: "15 min",
            content: `# Understanding the Stock Market

## What is the Stock Market?
The stock market is a marketplace where shares of publicly traded companies are bought and sold. It serves several important functions:

1. Capital Formation: Companies raise money by selling shares to investors
2. Price Discovery: The market determines the value of companies through supply and demand
3. Liquidity: Investors can easily buy and sell their investments
4. Risk Management: Investors can diversify their portfolios

## Key Concepts

### Stocks and Shares
- A stock represents ownership in a company
- Each share represents a portion of the company's ownership
- Shareholders have voting rights and may receive dividends
- Stock prices reflect company performance and market sentiment`
          },
          {
            id: "c1-1-3",
            type: "quiz",
            title: "Market Basics Quiz",
            duration: "15 min",
            content: "Test your understanding of stock market fundamentals",
            quiz: [
              {
                id: "q1-1-1",
                question: "What does owning a share of stock represent?",
                options: [
                  "A loan to the company",
                  "Ownership in the company",
                  "A fixed interest payment",
                  "A government bond"
                ],
                correctAnswer: 1,
                explanation: "When you own a share of stock, you own a small piece of the company. This gives you certain rights, including potential dividends and voting on company matters."
              },
              {
                id: "q1-1-2",
                question: "Which of the following is NOT a function of the stock market?",
                options: [
                  "Price discovery",
                  "Capital formation",
                  "Creating money supply",
                  "Providing liquidity"
                ],
                correctAnswer: 2,
                explanation: "The stock market doesn't create money supply - that's the role of central banks and the banking system. The stock market facilitates capital formation, price discovery, and provides liquidity for investors."
              }
            ]
          },
          {
            id: "c1-1-4",
            type: "text",
            title: "Additional Resources",
            duration: "0 min",
            content: "Additional resources for further learning",
            resources: [
              {
                id: "r1-1-1",
                title: "Stock Market Basics PDF Guide",
                type: "pdf",
                url: "/resources/stock-market-basics.pdf",
                description: "A comprehensive guide to stock market basics"
              },
              {
                id: "r1-1-2",
                title: "SEC's Introduction to Markets",
                type: "link",
                url: "https://www.investor.gov/introduction-investing/basics/how-stock-markets-work",
                description: "Official SEC guide to how markets work"
              }
            ]
          }
        ]
      },
      { 
        id: "m1-2", 
        title: "Market Participants", 
        description: "Understand the different players in the market and their roles",
        duration: "45 min", 
        isCompleted: false,
        order: 2,
        content: [
          {
            id: "c1-2-1",
            type: "video",
            title: "Who Trades in the Market?",
            duration: "15 min",
            videoUrl: "https://example.com/video2.mp4",
            content: "Learn about different types of market participants and their roles."
          },
          {
            id: "c1-2-2",
            type: "text",
            title: "Types of Market Participants",
            duration: "15 min",
            content: `# Market Participants Guide

## Individual Investors
- Retail traders who invest for personal financial goals
- Typically trade with personal capital
- Usually have longer time horizons
- Growing segment due to commission-free trading

## Institutional Investors
- Professional asset managers
- Control large pools of capital
- Include mutual funds, pension funds, and insurance companies
- Often have strict investment mandates

## Market Makers
- Provide liquidity to markets
- Profit from bid-ask spreads
- Help maintain orderly markets
- Include specialized firms and bank trading desks`
          },
          {
            id: "c1-2-3",
            type: "quiz",
            title: "Market Participants Quiz",
            duration: "15 min",
            content: "Test your understanding of market participants",
            quiz: [
              {
                id: "q1-2-1",
                question: "Which market participant typically provides liquidity by maintaining bid and ask prices?",
                options: [
                  "Retail investors",
                  "Market makers",
                  "Mutual funds",
                  "Regulators"
                ],
                correctAnswer: 1,
                explanation: "Market makers provide liquidity by maintaining bid and ask prices, ensuring that other market participants can buy and sell securities easily."
              }
            ]
          }
        ]
      },
      {
        id: "m1-3",
        title: "Understanding Financial Statements",
        description: "Learn how to read and analyze company financial reports",
        duration: "60 min",
        isCompleted: false,
        order: 3,
        content: [
          {
            id: "c1-3-1",
            type: "video",
            title: "Introduction to Financial Statements",
            duration: "20 min",
            videoUrl: "https://example.com/video3.mp4",
            content: "Learn the basics of financial statements and why they matter to investors."
          },
          {
            id: "c1-3-2",
            type: "text",
            title: "Balance Sheet Fundamentals",
            duration: "20 min",
            content: `# Understanding the Balance Sheet

A balance sheet is a financial statement that reports a company's assets, liabilities, and shareholders' equity at a specific point in time.

## The Accounting Equation
Assets = Liabilities + Shareholders' Equity

This fundamental equation must always balance, hence the name "balance sheet."

## Key Components

### Assets
- Current Assets: Cash, inventory, accounts receivable
- Non-Current Assets: Property, equipment, intangible assets

### Liabilities
- Current Liabilities: Accounts payable, short-term debt
- Non-Current Liabilities: Long-term debt, deferred taxes

### Shareholders' Equity
- Common stock
- Retained earnings
- Additional paid-in capital`
          },
          {
            id: "c1-3-3",
            type: "assignment",
            title: "Financial Statement Analysis",
            duration: "20 min",
            content: "Practice analyzing a real company's financial statements",
            assignment: {
              description: "Download the attached financial statements for Company XYZ and answer the following questions:\n1. What is the company's current ratio?\n2. Has the company's debt increased or decreased over the past year?\n3. What percentage of assets are financed by debt?",
              submission: "text"
            }
          }
        ]
      }
    ],
    skills: [
      "Stock market literacy", 
      "Financial statement analysis", 
      "Investment basics", 
      "Risk assessment"
    ],
    prerequisites: [
      {
        id: "pre-1-1",
        title: "No prior knowledge required",
        description: "This course is designed for complete beginners."
      }
    ],
    reviews: [
      {
        id: "rev-1-1",
        userId: "user-1",
        userName: "Michael Smith",
        userAvatar: "/avatars/michael.jpg",
        rating: 5,
        comment: "Excellent introduction to the stock market. Very well explained and easy to follow.",
        date: "February 10, 2024"
      },
      {
        id: "rev-1-2",
        userId: "user-2",
        userName: "Jessica Williams",
        userAvatar: "/avatars/jessica.jpg",
        rating: 4,
        comment: "Great content, but I wish there were more practical examples.",
        date: "March 5, 2024"
      }
    ],
    price: 59.99,
    discountPrice: 39.99,
    isFeatured: true,
    averageRating: 4.7,
    totalStudents: 1243,
    certificationIncluded: true
  },
  {
    id: "course-2",
    title: "Candlestick Pattern Recognition",
    subtitle: "Master the art of Japanese candlestick analysis for better market timing",
    category: "Chart Analysis",
    subcategory: "Technical Analysis",
    description: "Learn to identify and trade powerful Japanese candlestick patterns for better market timing.",
    longDescription: `
Discover the ancient art of Japanese candlestick analysis adapted for modern markets. This course will transform the way you read price action and make trading decisions.

### What You'll Learn:
- The history and philosophy behind candlestick charting
- How to identify and interpret single, double and triple candlestick patterns
- Real-world pattern recognition across different timeframes
- High-probability trading strategies based on candlestick signals
- Combining candlestick analysis with other technical indicators

### Course Features:
- 12 modules with over 5 hours of expert instruction
- Interactive pattern recognition exercises
- Market replay sessions to practice in real conditions
- Downloadable pattern cheat sheets
- Trading plan templates

By the end of this course, you'll be able to confidently spot high-probability trading setups using candlestick patterns across any market.
    `,
    tags: ["Candlestick Patterns", "Technical Analysis", "Chart Reading", "Trading Signals"],
    estimatedHours: 5,
    difficulty: "intermediate",
    icon: "BarChart2",
    coverImage: "/courses/candlestick-patterns.jpg",
    instructor: instructors[1],
    lastUpdated: "April 20, 2024",
    createdAt: "December 15, 2023",
    language: "English",
    modules: [
      {
        id: "m2-1",
        title: "Candlestick Fundamentals",
        description: "Understand the basics of candlestick charts and their components",
        duration: "60 min",
        isCompleted: false,
        order: 1,
        content: [
          {
            id: "c2-1-1",
            type: "video",
            title: "Introduction to Candlestick Charts",
            duration: "20 min",
            videoUrl: "https://example.com/candlesticks-intro.mp4",
            content: "Learn the history and components of Japanese candlestick charts."
          },
          {
            id: "c2-1-2",
            type: "text",
            title: "Anatomy of a Candlestick",
            duration: "20 min",
            content: `# Anatomy of a Candlestick

A candlestick chart provides more information than a simple line chart by showing the open, high, low, and close (OHLC) prices for each time period.

## Basic Structure

Each candlestick consists of:

1. **The Body**: The rectangular part showing the opening and closing prices
   - If close > open: Body is typically green or white (bullish)
   - If close < open: Body is typically red or black (bearish)

2. **The Shadows/Wicks**: The thin lines extending from the body
   - Upper shadow: Shows the highest price reached during the period
   - Lower shadow: Shows the lowest price reached during the period

## What Candlesticks Tell Us

Candlesticks reveal the struggle between buyers and sellers:
- Long bodies indicate strong buying or selling pressure
- Long shadows show price rejection at extremes
- The relationship between open and close reveals who won the period (buyers or sellers)

## Timeframes

Candlesticks can represent any time period:
- 1 minute
- 5 minutes
- 15 minutes
- 1 hour
- 4 hours
- 1 day
- 1 week
- 1 month

The psychology behind the patterns remains the same regardless of timeframe.`
          },
          {
            id: "c2-1-3",
            type: "quiz",
            title: "Candlestick Basics Quiz",
            duration: "20 min",
            content: "Test your understanding of candlestick basics",
            quiz: [
              {
                id: "q2-1-1",
                question: "What does a green (or white) candlestick typically represent?",
                options: [
                  "The close price was lower than the open price",
                  "The close price was higher than the open price",
                  "The volume was unusually high",
                  "The price didn't change during the period"
                ],
                correctAnswer: 1,
                explanation: "A green (or white) candlestick typically indicates that the closing price was higher than the opening price, signifying buying pressure or bullish movement during that time period."
              },
              {
                id: "q2-1-2",
                question: "What is represented by the thin lines extending from the body of a candlestick?",
                options: [
                  "Trading volume",
                  "Market sentiment",
                  "Price highs and lows (shadows/wicks)",
                  "Moving averages"
                ],
                correctAnswer: 2,
                explanation: "The thin lines extending from the candlestick body are called shadows or wicks. They represent the highest and lowest prices reached during the trading period."
              }
            ]
          }
        ]
      }
    ],
    skills: [
      "Candlestick pattern recognition",
      "Technical analysis",
      "Price action trading",
      "Chart reading"
    ],
    prerequisites: [
      {
        id: "pre-2-1",
        title: "Basic market knowledge",
        description: "You should understand basic market concepts and terminology."
      },
      {
        id: "pre-2-2",
        title: "Chart basics",
        description: "Familiarity with reading price charts is helpful but not required."
      }
    ],
    reviews: [
      {
        id: "rev-2-1",
        userId: "user-3",
        userName: "Robert Johnson",
        userAvatar: "/avatars/robert.jpg",
        rating: 5,
        comment: "This course has completely changed how I view charts. The pattern recognition techniques are invaluable.",
        date: "January 25, 2024"
      }
    ],
    price: 79.99,
    discountPrice: 49.99,
    averageRating: 4.8,
    totalStudents: 876,
    certificationIncluded: true
  },
  {
    id: "course-3",
    title: "Sector Rotation Strategies",
    subtitle: "Optimize portfolio performance through strategic sector allocation",
    category: "Market Dynamics",
    subcategory: "Portfolio Strategy",
    description: "Optimize portfolio performance by understanding market cycles and sector movements in different economic phases.",
    longDescription: `
Master the art of sector rotation to enhance your portfolio returns and reduce risk. This comprehensive course teaches you how to identify economic cycles and position your investments in the right sectors at the right time.

### What You'll Learn:
- Understand the stages of economic cycles and their impact on different market sectors
- Identify key economic indicators that signal transitions between cycle phases
- Analyze sector performance characteristics during each phase of the economic cycle
- Develop strategies for rotating between sectors to maximize returns
- Build a complete sector rotation investment plan with risk management guidelines

### Course Features:
- 4 modules with over 4 hours of expert instruction
- Economic cycle tracking tools and templates
- Sector performance historical analysis
- Interactive sector rotation exercises
- Real-world portfolio construction guidelines

By mastering sector rotation strategies, you'll gain a significant edge in positioning your investments to benefit from economic cycles rather than being at their mercy.
    `,
    tags: ["Economic Cycles", "Sector Analysis", "Rotation Timing", "Portfolio Strategy"],
    estimatedHours: 4,
    difficulty: "intermediate",
    icon: "TrendingUp",
    coverImage: "/courses/sector-rotation.jpg",
    instructor: instructors[3],
    lastUpdated: "May 12, 2024",
    createdAt: "February 5, 2024",
    language: "English",
    modules: [
      {
        id: "m3-1",
        title: "Economic Cycle Fundamentals",
        description: "Learn the fundamental concepts of economic cycles and their impact on different market sectors",
        duration: "45 min",
        isCompleted: false,
        order: 1,
        content: [
          {
            id: "c3-1-1",
            type: "video",
            title: "Introduction to Economic Cycles",
            duration: "12 min",
            videoUrl: "https://example.com/economic-cycles-intro.mp4",
            content: "An overview of economic cycles and why they matter for sector rotation strategies."
          },
          {
            id: "c3-1-2",
            type: "text",
            title: "Understanding the Business Cycle",
            duration: "15 min",
            content: `# Economic Cycle Fundamentals

## What is an Economic Cycle?

An economic cycle (also called a business cycle) refers to the natural fluctuation of the economy between periods of expansion and contraction. Understanding these cycles is crucial for effective sector rotation investing.

## The Four Phases of the Economic Cycle

### 1. Expansion (Recovery)
- **Characteristics**: Accelerating economic growth, increasing corporate profits, rising consumer confidence
- **Economic Indicators**: Increasing GDP, falling unemployment, rising retail sales
- **Market Behavior**: Bull market conditions, risk assets perform well
- **Leading Sectors**: Consumer discretionary, technology, industrials

### 2. Peak
- **Characteristics**: Maximum economic output, high inflation pressures, tight labor markets
- **Economic Indicators**: High GDP growth, low unemployment, rising interest rates, flattening yield curve
- **Market Behavior**: Late-stage bull market, increased volatility
- **Leading Sectors**: Energy, materials, financials

### 3. Contraction (Recession)
- **Characteristics**: Declining economic activity, falling corporate profits, reduced consumer spending
- **Economic Indicators**: Negative GDP growth, rising unemployment, declining manufacturing output
- **Market Behavior**: Bear market conditions, flight to safety
- **Leading Sectors**: Consumer staples, utilities, healthcare

### 4. Trough
- **Characteristics**: Economic activity bottoms, policy stimulus enacted, sentiment begins to improve
- **Economic Indicators**: Stabilizing GDP, slowing job losses, easing credit conditions
- **Market Behavior**: Early stage of new bull market, high volatility with upward bias
- **Leading Sectors**: Financials, consumer discretionary (early-cycle)

## Cycle Duration and Variability

Economic cycles don't follow a strict timeline:
- Average full cycle: 5-7 years
- Expansion phases: Typically longer (3-5 years)
- Contraction phases: Usually shorter (6-18 months)
- Modern cycles show increasing intervention by central banks

## Why Cycles Matter for Investors

Understanding where we are in the economic cycle helps investors:
1. Allocate capital to sectors most likely to outperform
2. Reduce exposure to vulnerable sectors
3. Adjust overall risk levels appropriately
4. Set realistic return expectations`
          },
          {
            id: "c3-1-3",
            type: "quiz",
            title: "Economic Cycle Quiz",
            duration: "10 min",
            content: "Test your understanding of economic cycles and their phases",
            quiz: [
              {
                id: "q3-1-1",
                question: "Which economic cycle phase typically follows a recession?",
                options: [
                  "Peak",
                  "Trough",
                  "Recovery/Expansion",
                  "Stagflation"
                ],
                correctAnswer: 2,
                explanation: "After a recession (contraction), the economy reaches a trough and then begins the recovery/expansion phase. This is when economic growth turns positive again and begins to accelerate."
              },
              {
                id: "q3-1-2",
                question: "Which sectors typically outperform during the contraction phase of the economic cycle?",
                options: [
                  "Technology and Consumer Discretionary",
                  "Energy and Materials",
                  "Consumer Staples, Utilities, and Healthcare",
                  "Financials and Real Estate"
                ],
                correctAnswer: 2,
                explanation: "During contractions (recessions), defensive sectors like Consumer Staples, Utilities, and Healthcare typically outperform as they provide essential goods and services that remain in demand regardless of economic conditions."
              },
              {
                id: "q3-1-3",
                question: "Which economic indicator is often considered a reliable predictor of economic cycles?",
                options: [
                  "Stock market prices",
                  "Unemployment rate",
                  "Yield curve inversion",
                  "Housing prices"
                ],
                correctAnswer: 2,
                explanation: "A yield curve inversion (when short-term interest rates exceed long-term rates) has historically been a reliable predictor of recessions, often preceding them by 12-18 months."
              }
            ]
          },
          {
            id: "c3-1-4",
            type: "text",
            title: "Key Economic Indicators",
            duration: "15 min",
            content: `# Key Economic Indicators for Cycle Analysis

To effectively identify economic cycle phases, investors should monitor these critical economic indicators:

## Leading Indicators (Predict Future Changes)

### 1. Yield Curve
- **What it measures**: The difference between long-term and short-term interest rates
- **Cycle significance**: Inversion (short-term rates exceeding long-term rates) often precedes recessions
- **Where to find it**: Federal Reserve Economic Data (FRED)

### 2. Purchasing Managers' Index (PMI)
- **What it measures**: Manufacturing and service sector activity
- **Cycle significance**: Readings below 50 indicate contraction; above 50 indicate expansion
- **Where to find it**: Institute for Supply Management (ISM)

### 3. Building Permits and Housing Starts
- **What it measures**: Future construction activity
- **Cycle significance**: Declines often precede broader economic slowdowns
- **Where to find it**: U.S. Census Bureau

### 4. Stock Market Performance
- **What it measures**: Collective expectations about future corporate profits
- **Cycle significance**: Often turns down before recessions and up before recoveries
- **Where to find it**: Major indices (S&P 500, Dow Jones, etc.)

## Coincident Indicators (Show Current State)

### 1. Gross Domestic Product (GDP)
- **What it measures**: Total value of goods and services produced
- **Cycle significance**: Negative growth for two consecutive quarters indicates recession
- **Where to find it**: Bureau of Economic Analysis (BEA)

### 2. Employment Data
- **What it measures**: Job growth, unemployment rate
- **Cycle significance**: Rising unemployment indicates contraction; falling indicates expansion
- **Where to find it**: Bureau of Labor Statistics (BLS)

### 3. Industrial Production
- **What it measures**: Output of manufacturing, mining, and utilities
- **Cycle significance**: Directly reflects economic activity
- **Where to find it**: Federal Reserve

## Lagging Indicators (Confirm Trends)

### 1. Unemployment Rate
- **What it measures**: Percentage of workforce without jobs
- **Cycle significance**: Peaks after recessions end; falls after expansions are well established
- **Where to find it**: Bureau of Labor Statistics (BLS)

### 2. Consumer Price Index (CPI)
- **What it measures**: Inflation at the consumer level
- **Cycle significance**: Often rises late in expansion, falls during contraction
- **Where to find it**: Bureau of Labor Statistics (BLS)

### 3. Corporate Profits
- **What it measures**: Business earnings
- **Cycle significance**: Confirm economic conditions after they've occurred
- **Where to find it**: Bureau of Economic Analysis (BEA)

## Using Indicators Together

No single indicator is perfect. For robust cycle analysis:
1. Monitor a basket of indicators across categories
2. Look for confirmation across multiple indicators
3. Pay special attention when leading indicators change direction
4. Consider the rate of change, not just absolute levels`
          },
          {
            id: "c3-1-5",
            type: "assignment",
            title: "Economic Cycle Analysis",
            duration: "15 min",
            content: "Apply your knowledge by analyzing current economic indicators",
            assignment: {
              description: "Research and identify which phase of the economic cycle you believe we are currently in. Support your conclusion with at least three specific economic indicators and explain your reasoning. Include your expectations for which market sectors should perform well in the coming 6-12 months based on your cycle analysis.",
              submission: "text"
            },
            resources: [
              {
                id: "r3-1-1",
                title: "Economic Indicators Dashboard",
                type: "link",
                url: "https://fred.stlouisfed.org/",
                description: "Federal Reserve Economic Data (FRED) - comprehensive source for economic indicators"
              },
              {
                id: "r3-1-2",
                title: "Economic Cycle Cheat Sheet",
                type: "pdf",
                url: "/resources/economic-cycle-cheatsheet.pdf",
                description: "A printable reference guide to economic cycle phases and corresponding sector performance"
              }
            ]
          }
        ]
      },
      {
        id: "m3-2",
        title: "Sector Performance Analysis",
        description: "Learn how to analyze sector performance across different economic phases",
        duration: "60 min",
        isCompleted: false,
        order: 2,
        content: [
          {
            id: "c3-2-1",
            type: "video",
            title: "Sector Classification Systems",
            duration: "12 min",
            videoUrl: "https://example.com/sector-classification.mp4",
            content: "An overview of sector classification systems like GICS and how they organize the market."
          },
          {
            id: "c3-2-2",
            type: "text",
            title: "Sector Performance Across Cycle Phases",
            duration: "20 min",
            content: `# Sector Performance Analysis

## Understanding Market Sectors

The stock market is divided into sectors - groups of companies that operate in similar business areas. The most widely used classification system is the Global Industry Classification Standard (GICS), which organizes the market into 11 primary sectors:

1. **Information Technology**
2. **Healthcare**
3. **Financials**
4. **Consumer Discretionary**
5. **Communication Services**
6. **Industrials**
7. **Consumer Staples**
8. **Energy**
9. **Utilities**
10. **Real Estate**
11. **Materials**

## Sector Characteristics

Each sector has unique characteristics that influence how it performs during different economic conditions:

### Cyclical Sectors
- **Highly sensitive to economic cycles**
- **Examples**: Consumer Discretionary, Financials, Industrials, Materials
- **Performance**: Outperform during expansions, underperform during contractions
- **Drivers**: Consumer spending, business investment, credit growth

### Defensive Sectors
- **Less sensitive to economic cycles**
- **Examples**: Consumer Staples, Healthcare, Utilities
- **Performance**: Outperform during contractions, often underperform during strong expansions
- **Drivers**: Essential products/services, steady demand regardless of economic conditions

### Interest Rate Sensitive Sectors
- **Heavily influenced by changes in interest rates**
- **Examples**: Utilities, Real Estate, Financials
- **Performance**: React strongly to Federal Reserve policy changes
- **Drivers**: Borrowing costs, yield competition, financing structures

### Growth Sectors
- **Focused on revenue and earnings growth**
- **Examples**: Technology, Communication Services
- **Performance**: Can outperform in both late contraction and early expansion phases
- **Drivers**: Innovation, market share gains, changing consumer behavior

## Historical Sector Performance By Cycle Phase

### Early Cycle (Recovery)
- **Top Performers**: Consumer Discretionary, Financials, Industrials, Technology
- **Characteristics**: 
  - Economy emerges from recession
  - Interest rates remain low
  - Consumer confidence improves
  - Business investment begins to recover
- **Why These Sectors Lead**: Benefit from improved credit conditions, increased spending on previously delayed purchases, and renewed business investment

### Mid Cycle (Expansion)
- **Top Performers**: Technology, Industrials, Energy, Materials
- **Characteristics**:
  - Steady economic growth
  - Rising corporate profits
  - Increasing employment
  - Moderate inflation
- **Why These Sectors Lead**: Benefit from broad economic growth, increased capital expenditures, and rising commodity prices

### Late Cycle (Peak)
- **Top Performers**: Energy, Materials, Healthcare, Consumer Staples
- **Characteristics**:
  - Economic growth begins to slow
  - Inflation accelerates
  - Interest rates rise
  - Wage pressures increase
- **Why These Sectors Lead**: Benefit from inflation (commodities), while defensive sectors begin to attract investment as growth concerns emerge

### Recession (Contraction)
- **Top Performers**: Consumer Staples, Healthcare, Utilities
- **Characteristics**:
  - Negative economic growth
  - Rising unemployment
  - Declining corporate profits
  - Monetary/fiscal stimulus often initiated
- **Why These Sectors Lead**: Provide essential products/services with stable demand regardless of economic conditions

## Sector Rotation Performance Data

Historical data shows distinct performance patterns:

| Sector | Early Cycle | Mid Cycle | Late Cycle | Recession | Full Cycle Avg |
|--------|------------|-----------|-----------|-----------|---------------|
| Technology | +32.8% | +18.5% | +5.2% | -21.6% | +8.7% |
| Financials | +28.4% | +12.3% | -2.6% | -18.8% | +4.8% |
| Consumer Disc. | +29.5% | +15.1% | +1.8% | -17.5% | +7.2% |
| Industrials | +27.2% | +16.7% | +4.3% | -15.9% | +8.1% |
| Materials | +22.5% | +17.4% | +8.6% | -19.3% | +7.3% |
| Energy | +18.3% | +19.8% | +12.4% | -14.7% | +9.0% |
| Healthcare | +11.6% | +14.3% | +9.7% | -7.4% | +7.1% |
| Consumer Staples | +8.2% | +11.7% | +8.9% | -6.8% | +5.5% |
| Utilities | +6.5% | +9.2% | +7.5% | -8.1% | +3.8% |
| Real Estate | +14.8% | +10.6% | -3.2% | -16.3% | +1.5% |
| Comm. Services | +19.7% | +12.8% | +4.1% | -12.5% | +6.0% |

*Note: Figures represent average performance during each phase based on data from the last 5 economic cycles. Past performance does not guarantee future results.*`
          },
          {
            id: "c3-2-3",
            type: "video",
            title: "Factor Analysis in Sector Performance",
            duration: "15 min",
            videoUrl: "https://example.com/factor-analysis.mp4",
            content: "Understanding how different factors like growth, value, quality and momentum affect sector performance."
          },
          {
            id: "c3-2-4",
            type: "quiz",
            title: "Sector Performance Quiz",
            duration: "10 min",
            content: "Test your understanding of sector performance across economic cycles",
            quiz: [
              {
                id: "q3-2-1",
                question: "Which sectors typically perform best during the early cycle (recovery) phase?",
                options: [
                  "Utilities and Consumer Staples",
                  "Energy and Materials",
                  "Financials and Consumer Discretionary",
                  "Healthcare and Real Estate"
                ],
                correctAnswer: 2,
                explanation: "Financials and Consumer Discretionary sectors typically lead in the early cycle phase as they benefit from improving credit conditions, low interest rates, and consumers beginning to increase their discretionary spending after a recession."
              },
              {
                id: "q3-2-2",
                question: "Why do defensive sectors like Consumer Staples often outperform during recessions?",
                options: [
                  "They have the highest growth rates during economic contractions",
                  "They provide essential products with relatively stable demand regardless of economic conditions",
                  "They benefit from government stimulus programs during recessions",
                  "They have the lowest debt levels of all sectors"
                ],
                correctAnswer: 1,
                explanation: "Defensive sectors like Consumer Staples outperform during recessions because they provide essential products (food, beverages, household items) that consumers need regardless of economic conditions, resulting in more stable earnings during downturns."
              },
              {
                id: "q3-2-3",
                question: "Which sector is typically most sensitive to interest rate changes?",
                options: [
                  "Technology",
                  "Utilities",
                  "Energy",
                  "Materials"
                ],
                correctAnswer: 1,
                explanation: "Utilities is typically the most interest rate sensitive sector. As bond proxies with high dividend yields, utility stocks often decline when interest rates rise (as bonds become more competitive) and rise when interest rates fall."
              }
            ]
          }
        ]
      },
      {
        id: "m3-3",
        title: "Identifying Rotation Signals",
        description: "Master the techniques for identifying optimal sector rotation timing",
        duration: "45 min",
        isCompleted: false,
        order: 3,
        content: [
          {
            id: "c3-3-1",
            type: "video",
            title: "Economic Indicators for Sector Rotation",
            duration: "15 min",
            videoUrl: "https://example.com/rotation-indicators.mp4",
            content: "A comprehensive overview of the key economic indicators that signal sector rotation opportunities."
          },
          {
            id: "c3-3-2",
            type: "text",
            title: "Technical Analysis for Sector Rotation",
            duration: "20 min",
            content: `# Identifying Sector Rotation Signals

## Key Indicators for Sector Rotation Timing

Successfully timing sector rotations requires monitoring a combination of economic, fundamental, and technical indicators. The following framework will help you identify potential rotation points:

## 1. Economic Cycle Indicators

### Leading Economic Indicators
- **Yield Curve**: Watch for flattening/steepening trends
  - **Steepening Curve**: Often signals early cycle → favor Financials, Consumer Discretionary
  - **Flattening/Inverting Curve**: Often signals late cycle → begin rotating to defensive sectors

### Interest Rate Environment
- **Fed Policy Shifts**: Monitor Federal Reserve statements and dot plots
  - **Beginning Rate Cuts**: Often bullish for Consumer Discretionary, Real Estate
  - **Beginning Rate Hikes**: Often benefits Financials initially, then defensive sectors

### Inflation Indicators
- **CPI, PPI, PCE Data**: Track trends in inflation metrics
  - **Rising Inflation**: Often benefits Energy, Materials, Real Estate
  - **Falling Inflation**: Often benefits Technology, Consumer Discretionary

### Manufacturing Data
- **PMI Readings**: Purchase Managers Index trends
  - **PMI Rising Above 50**: Bullish for Industrials, Materials
  - **PMI Falling Below 50**: Rotate toward defensive sectors

## 2. Relative Strength Analysis

### Relative Performance Charts
- **Sector/S&P 500 Ratio Charts**: Track each sector's performance relative to the broad market
  - **Rising Line**: Sector outperforming the market
  - **Falling Line**: Sector underperforming the market
  - **Look for**: Reversal points after extended trends in either direction

### Relative Strength Ranking
- **RS Rating Method**: Rank sectors by their 3/6/12-month relative performance
  - **Momentum Strategy**: Overweight top 3 sectors, underweight bottom 3
  - **Mean Reversion Strategy**: Look for historically extreme readings as contrarian signals

## 3. Fundamental Metrics

### Earnings Revision Trends
- **Analyst Estimate Changes**: Monitor sectors experiencing positive/negative revisions
  - **Positive Revisions Accelerating**: Often precedes sector outperformance
  - **Negative Revisions Accelerating**: Often precedes sector underperformance

### Valuation Metrics By Sector
- **P/E, P/B, P/S Ratios**: Compare current metrics to historical ranges
  - **Low Relative Valuations + Improving Fundamentals**: Potential rotation opportunity
  - **Extended Valuations + Deteriorating Fundamentals**: Potential exit signal

## 4. Technical Analysis Signals

### Moving Average Relationships
- **50-day vs. 200-day MAs**: Monitor sector ETFs for golden/death crosses
  - **Golden Cross (50 crosses above 200)**: Bullish signal for a sector
  - **Death Cross (50 crosses below 200)**: Bearish signal for a sector

### Volume Analysis
- **Volume Trends**: Look for unusual volume during sector moves
  - **High Volume Breakouts**: Often confirms sustainable sector rotation
  - **Low Volume Moves**: May indicate false rotation signals

### Breadth Indicators
- **Advance/Decline Lines**: Monitor industry-specific breadth
  - **Rising A/D Line**: Healthy participation within a sector
  - **Falling A/D Line with Rising Prices**: Potential warning sign

## 5. Sentiment and Positioning Data

### Fund Flows
- **Sector ETF Flows**: Track money moving into/out of sector funds
  - **Substantial Inflows**: Potential crowded trade (contrarian signal)
  - **Substantial Outflows**: Potential oversold condition (opportunity)

### Institutional Positioning
- **13F Filings**: Monitor how large institutions are adjusting sector allocations
  - **Early Adopters**: Some institutions consistently lead profitable rotations

## Putting It All Together: A Systematic Approach

For optimal sector rotation timing:

1. **Establish Economic Context**: Determine current cycle phase
2. **Monitor Leading Indicators**: Watch for signals of phase transitions
3. **Analyze Relative Strength**: Identify sectors gaining/losing momentum
4. **Confirm with Fundamentals**: Verify that earnings and valuations support the rotation
5. **Use Technical Triggers**: Execute rotation when technical signals confirm

Remember that no single indicator is perfect. Using multiple signals across these categories provides the most reliable rotation framework.`
          },
          {
            id: "c3-3-3",
            type: "quiz",
            title: "Rotation Signals Quiz",
            duration: "10 min",
            content: "Test your understanding of sector rotation timing signals",
            quiz: [
              {
                id: "q3-3-1",
                question: "Which economic indicator is often considered most useful for identifying transitions between economic cycle phases?",
                options: [
                  "Consumer Price Index (CPI)",
                  "Unemployment rate",
                  "Yield curve movements",
                  "GDP growth rate"
                ],
                correctAnswer: 2,
                explanation: "Yield curve movements (particularly inversions when short-term rates exceed long-term rates) have historically been reliable indicators of economic cycle transitions, often predicting recessions 12-18 months in advance, making them valuable for sector rotation timing."
              },
              {
                id: "q3-3-2",
                question: "What does a 'golden cross' technical signal indicate for a sector ETF?",
                options: [
                  "The sector is becoming overvalued",
                  "A potentially bullish trend is developing",
                  "The sector is likely to underperform",
                  "Trading volume is decreasing"
                ],
                correctAnswer: 1,
                explanation: "A 'golden cross' occurs when a shorter-term moving average (typically the 50-day) crosses above a longer-term moving average (typically the 200-day). This is generally considered a bullish technical signal that may indicate the beginning of a stronger uptrend for the sector."
              },
              {
                id: "q3-3-3",
                question: "What type of analysis involves comparing a sector's performance to the broader market?",
                options: [
                  "Fundamental analysis",
                  "Sentiment analysis",
                  "Volume analysis",
                  "Relative strength analysis"
                ],
                correctAnswer: 3,
                explanation: "Relative strength analysis involves comparing a sector's performance to a benchmark (typically the S&P 500). This helps identify sectors that are outperforming or underperforming the broader market, which is crucial for sector rotation strategies."
              }
            ]
          }
        ]
      },
      {
        id: "m3-4",
        title: "Building a Sector Rotation Portfolio",
        description: "Learn how to construct and manage a sector rotation-based investment portfolio",
        duration: "90 min",
        isCompleted: false,
        order: 4,
        content: [
          {
            id: "c3-4-1",
            type: "video",
            title: "Sector ETFs and Investment Vehicles",
            duration: "15 min",
            videoUrl: "https://example.com/sector-etfs.mp4",
            content: "An overview of the various investment vehicles for implementing sector rotation strategies."
          },
          {
            id: "c3-4-2",
            type: "text",
            title: "Portfolio Construction Principles",
            duration: "25 min",
            content: `# Building a Sector Rotation Portfolio

## Investment Vehicles for Sector Rotation

To implement sector rotation strategies, investors typically use these vehicles:

### Sector ETFs
- **SPDR Sector ETFs**: The most liquid sector funds (XLK, XLF, XLV, etc.)
- **Vanguard Sector ETFs**: Lower expense ratios (VGT, VFH, VHT, etc.)
- **iShares Sector ETFs**: Additional options with various exposures
- **Advantages**: Liquid, transparent, tax-efficient, precise exposure
- **Considerations**: Still contain multiple industries within each sector

### Industry ETFs
- **More targeted than sector ETFs**
- **Examples**: Biotech (IBB, XBI), Regional Banks (KRE), Semiconductors (SMH, SOXX)
- **Advantages**: More precise exposure to specific industries within sectors
- **Considerations**: Higher volatility, less diversification

### Sector Mutual Funds
- **Actively managed sector funds**
- **Advantages**: Professional management, may outperform in inefficient sectors
- **Considerations**: Higher fees, less tax efficiency, end-of-day pricing

### Individual Stocks
- **Selecting leaders within favored sectors**
- **Advantages**: No management fees, potential to outperform sector
- **Considerations**: Requires deeper analysis, company-specific risk

## Portfolio Construction Approaches

### 1. Core-Satellite Approach
- **Core (60-70%)**: Broad market ETFs or index funds for long-term exposure
- **Satellite (30-40%)**: Sector rotation component for tactical adjustments
- **Advantages**: Reduces tracking error risk while allowing tactical opportunities
- **Implementation**:
  - Maintain core positions consistently
  - Rotate satellite sector positions based on cycle analysis
  - Rebalance core-satellite ratio periodically

### 2. Full Sector Rotation
- **Entire portfolio allocated among sectors**
- **Aggressive approach**: Potentially higher returns with higher risk
- **Implementation Options**:
  - Equal-weight baseline with overweight/underweight adjustments
  - Full tactical allocation with significant concentration in favored sectors
  - Zero exposure to least-favored sectors

### 3. Factor-Based Sector Approach
- **Combine factor and sector analysis**
- **Example**: Overweight value factor + value-oriented sectors during recovery
- **Implementation**:
  - Identify which factors typically work in current cycle phase
  - Select sectors with highest exposure to those factors
  - Consider both sector and factor ETFs

## Position Sizing and Risk Management

### Position Sizing Methods
- **Equal Weight**: Same allocation to each selected sector
- **Conviction Weighting**: Higher allocation to strongest opportunities
- **Volatility Adjustment**: Inverse volatility weighting (less to more volatile sectors)
- **Recommended**: Start with equal weight until developing expertise

### Risk Management Techniques
- **Maximum Sector Allocation**: Typically 20-25% to any single sector
- **Stop-Loss Strategy**: Exit positions that underperform by predetermined threshold
- **Correlation Analysis**: Ensure diversification across selected sectors
- **Hedge Positions**: Consider adding defensive positions during late-cycle phases

## Implementation Steps

### 1. Establish Baseline Allocations
- Define neutral sector weights (often based on S&P 500 sector weights)
- Determine maximum overweight/underweight deviations

### 2. Determine Current Cycle Phase
- Analyze economic indicators discussed in previous modules
- Identify which phase has the highest probability

### 3. Select Target Sectors
- Overweight sectors likely to outperform in current/upcoming phase
- Underweight sectors likely to underperform
- Maintain market weight for sectors with unclear outlook

### 4. Set Entry/Exit Triggers
- Define specific conditions for initiating positions
- Establish rules for exiting or reducing positions
- Document these rules to avoid emotional decisions

### 5. Regular Review Process
- Establish consistent review schedule (monthly/quarterly)
- Track performance of each sector allocation
- Document reasoning behind each rotation decision

## Practical Portfolio Examples

### Conservative Sector Rotation
- 70% Core (Total market ETF)
- 30% Tactical (2-3 sector ETFs)
- Rotation Frequency: Quarterly reviews, changes only when clear signals emerge
- Risk Management: Maximum 15% to any sector

### Moderate Sector Rotation
- 50% Core (Total market ETF)
- 50% Tactical (3-5 sector ETFs)
- Rotation Frequency: Monthly reviews with partial rotations
- Risk Management: Maximum 20% to any sector

### Aggressive Sector Rotation
- 100% Tactical (5-7 sector ETFs)
- Rotation Frequency: Monthly or signal-based
- Risk Management: Maximum 25% to any sector, strict stop-losses`
          },
          {
            id: "c3-4-3",
            type: "video",
            title: "Risk Management in Sector Rotation",
            duration: "15 min",
            videoUrl: "https://example.com/rotation-risk.mp4",
            content: "Learn effective risk management techniques for sector rotation strategies."
          },
          {
            id: "c3-4-4",
            type: "assignment",
            title: "Create Your Sector Rotation Plan",
            duration: "30 min",
            content: "Develop your own sector rotation investment strategy",
            assignment: {
              description: "Design a complete sector rotation strategy tailored to your investment goals. Your plan should include:\n\n1. Your assessment of the current economic cycle phase with supporting evidence\n2. Identification of 3-5 sectors you would overweight and 2-3 sectors you would underweight\n3. Specific ETFs or investment vehicles you would use for each sector\n4. Position sizing for each component\n5. Entry and exit criteria\n6. Risk management rules\n7. Review and adjustment process\n\nInclude a 6-month outlook with specific triggers that would cause you to adjust your allocations.",
              submission: "text"
            },
            resources: [
              {
                id: "r3-4-1",
                title: "Sector ETF List",
                type: "pdf",
                url: "/resources/sector-etf-list.pdf",
                description: "Comprehensive list of sector ETFs with expense ratios and historical performance"
              },
              {
                id: "r3-4-2",
                title: "Portfolio Construction Template",
                type: "file",
                url: "/resources/sector-rotation-template.xlsx",
                description: "Excel template for building and tracking a sector rotation portfolio"
              }
            ]
          },
          {
            id: "c3-4-5",
            type: "quiz",
            title: "Portfolio Construction Quiz",
            duration: "10 min",
            content: "Test your understanding of sector rotation portfolio construction",
            quiz: [
              {
                id: "q3-4-1",
                question: "What is the primary advantage of using sector ETFs for rotation strategies compared to individual stocks?",
                options: [
                  "Higher potential returns",
                  "Lower volatility through diversification within the sector",
                  "Guaranteed outperformance",
                  "Access to private markets"
                ],
                correctAnswer: 1,
                explanation: "Sector ETFs provide diversification across multiple companies within a sector, reducing individual stock risk while still allowing targeted exposure to the desired sector. This lowers volatility compared to picking individual stocks."
              },
              {
                id: "q3-4-2",
                question: "In a Core-Satellite approach to sector rotation, what typically comprises the 'Core' portion?",
                options: [
                  "Individual high-conviction stocks",
                  "Options and derivatives",
                  "Broad market ETFs or index funds",
                  "Cash and short-term bonds"
                ],
                correctAnswer: 2,
                explanation: "In a Core-Satellite approach, the 'Core' typically consists of broad market ETFs or index funds that provide diversified, long-term market exposure. This serves as the portfolio's foundation while the 'Satellite' portion contains the tactical sector allocations."
              },
              {
                id: "q3-4-3",
                question: "What is a recommended maximum allocation to any single sector in a moderate sector rotation strategy?",
                options: [
                  "5-10%",
                  "15-20%",
                  "30-40%",
                  "50-60%"
                ],
                correctAnswer: 1,
                explanation: "For a moderate sector rotation strategy, a maximum allocation of 15-20% to any single sector is typically recommended. This provides enough exposure to benefit from sector outperformance while limiting concentration risk."
              }
            ]
          }
        ]
      }
    ],
    skills: [
      "Economic cycle analysis",
      "Sector performance evaluation",
      "Portfolio construction",
      "Market timing"
    ],
    prerequisites: [
      {
        id: "pre-3-1",
        title: "Basic market knowledge",
        description: "Understanding of stock market fundamentals and terminology"
      },
      {
        id: "pre-3-2",
        title: "Economic indicators",
        description: "Familiarity with major economic indicators and their significance"
      }
    ],
    reviews: [
      {
        id: "rev-3-1",
        userId: "user-5",
        userName: "David Chen",
        userAvatar: "/avatars/david.jpg",
        rating: 5,
        comment: "This course transformed my investment approach. The sector rotation strategy has helped me outperform the market consistently.",
        date: "April 2, 2024"
      },
      {
        id: "rev-3-2",
        userId: "user-6",
        userName: "Amanda Wilson",
        userAvatar: "/avatars/amanda.jpg",
        rating: 4,
        comment: "Excellent content on economic cycles and their impact on sectors. Would like more case studies, but overall very valuable.",
        date: "March 15, 2024"
      }
    ],
    price: 89.99,
    discountPrice: 59.99,
    averageRating: 4.6,
    totalStudents: 542,
    certificationIncluded: true
  },
  {
    id: "course-4",
    title: "Risk Management Essentials",
    subtitle: "Master position sizing and risk control techniques",
    category: "Trading Strategy",
    subcategory: "Risk Management",
    description: "Learn to protect your capital with proper position sizing, stop-loss strategies, and risk-reward optimization.",
    longDescription: `
Risk management is the cornerstone of successful trading. This practical course teaches you how to preserve capital while maximizing returns through proven risk management techniques.

### What You'll Learn:
- Calculate optimal position sizes based on account size and risk tolerance
- Implement effective stop-loss strategies for different market conditions
- Balance risk and reward to create a sustainable edge
- Develop a comprehensive risk management plan for your trading
- Apply volatility-based adjustments to your position sizing

### Course Features:
- 5 modules with over 3.5 hours of expert instruction
- Position sizing calculators and templates
- Stop-loss placement techniques
- Risk management plan framework
- Real-world trade examples with risk analysis

By mastering these essential risk management skills, you'll significantly improve your chances of long-term trading success and avoid the common pitfalls that lead to account blowups.
    `,
    tags: ["Position Sizing", "Stop-Loss Techniques", "Risk-Reward Ratio", "Capital Preservation"],
    estimatedHours: 3.5,
    difficulty: "intermediate",
    icon: "Layers",
    coverImage: "/courses/risk-management.jpg",
    instructor: instructors[2],
    lastUpdated: "April 8, 2024",
    createdAt: "January 20, 2024",
    language: "English",
    modules: [
      { 
        id: "m4-1", 
        title: "Understanding Trading Risk", 
        description: "Learn about different types of risk in trading and how to assess them",
        duration: "40 min", 
        isCompleted: false,
        order: 1,
        content: [
          {
            id: "c4-1-1",
            type: "video",
            title: "Introduction to Trading Risk",
            duration: "10 min",
            videoUrl: "https://example.com/risk-intro.mp4",
            content: "An overview of the different types of risk traders face and why risk management is essential."
          },
          {
            id: "c4-1-2",
            type: "text",
            title: "Types of Trading Risk",
            duration: "15 min",
            content: `# Understanding Trading Risk

## What is Trading Risk?

Trading risk refers to the possibility of losing capital when trading financial markets. Effective risk management is the key differentiator between successful and unsuccessful traders.

## Types of Trading Risk

### 1. Market Risk
- **Definition**: The risk of losses due to movements in market prices
- **Examples**: Price gaps, trending markets, volatility
- **Management**: Position sizing, stop-losses, diversification

### 2. Leverage Risk
- **Definition**: The amplification of gains and losses through borrowed capital
- **Examples**: Margin trading, futures, options
- **Management**: Appropriate leverage ratios, stress testing

### 3. Liquidity Risk
- **Definition**: The risk of not being able to exit positions at desired prices
- **Examples**: Illiquid stocks, wide bid-ask spreads, market crashes
- **Management**: Trading liquid markets, avoiding oversize positions

### 4. Operational Risk
- **Definition**: Losses due to failed processes, systems or external events
- **Examples**: Platform outages, order entry errors, connectivity issues
- **Management**: Redundant systems, checklists, practice

### 5. Psychological Risk
- **Definition**: Losses due to emotional decision-making
- **Examples**: Revenge trading, overconfidence, fear
- **Management**: Trading plan, rules-based approach, journaling

## The Risk Management Hierarchy

The most effective approach to risk management follows this hierarchy:

1. **Risk Avoidance**: Avoid unnecessary risks altogether
2. **Risk Reduction**: Reduce the impact of unavoidable risks
3. **Risk Transfer**: Hedge or insure against certain risks
4. **Risk Acceptance**: Accept small, calculated risks

## Why Most Traders Fail

Research shows that 80-90% of retail traders lose money. The primary reason is poor risk management:

- Excessive position sizing
- No stop-loss discipline
- Inadequate capitalization
- Emotional decision-making
- Failure to understand risk/reward`
          },
          {
            id: "c4-1-3",
            type: "quiz",
            title: "Trading Risk Quiz",
            duration: "15 min",
            content: "Test your understanding of trading risk concepts",
            quiz: [
              {
                id: "q4-1-1",
                question: "Which of the following is NOT a common type of trading risk?",
                options: [
                  "Market risk",
                  "Liquidity risk",
                  "Performance risk",
                  "Psychological risk"
                ],
                correctAnswer: 2,
                explanation: "Performance risk is not a standard category of trading risk. The main risk categories include market risk, liquidity risk, leverage risk, operational risk, and psychological risk."
              },
              {
                id: "q4-1-2",
                question: "What is the primary reason most retail traders fail?",
                options: [
                  "Lack of technical analysis skills",
                  "Poor risk management",
                  "Not having the right indicators",
                  "Trading the wrong markets"
                ],
                correctAnswer: 1,
                explanation: "Poor risk management is the primary reason most retail traders fail. Even traders with good analysis skills will eventually blow up their accounts without proper risk management."
              }
            ]
          }
        ]
      },
      { 
        id: "m4-2", 
        title: "Position Sizing Strategies", 
        description: "Learn different approaches to determine optimal position sizes",
        duration: "50 min", 
        isCompleted: false,
        order: 2,
        content: []
      },
      { 
        id: "m4-3", 
        title: "Effective Stop-Loss Placement", 
        description: "Master techniques for placing stop-losses to protect capital",
        duration: "45 min", 
        isCompleted: false,
        order: 3,
        content: []
      },
      { 
        id: "m4-4", 
        title: "Risk-Reward Optimization", 
        description: "Learn how to balance risk and potential reward for optimal returns",
        duration: "45 min", 
        isCompleted: false,
        order: 4,
        content: []
      },
      { 
        id: "m4-5", 
        title: "Creating a Risk Management Plan", 
        description: "Develop a comprehensive risk management framework for your trading",
        duration: "30 min", 
        isCompleted: false,
        order: 5,
        content: []
      }
    ],
    skills: [
      "Position sizing",
      "Stop-loss strategy",
      "Risk-reward analysis",
      "Capital preservation"
    ],
    prerequisites: [
      {
        id: "pre-4-1",
        title: "Basic trading knowledge",
        description: "Understanding of market mechanics and order types"
      },
      {
        id: "pre-4-2",
        title: "Trading experience",
        description: "Some exposure to live or simulated trading is helpful"
      }
    ],
    reviews: [
      {
        id: "rev-4-1",
        userId: "user-7",
        userName: "Thomas Lee",
        userAvatar: "/avatars/thomas.jpg",
        rating: 5,
        comment: "This course completely changed my trading. The position sizing strategies alone were worth ten times what I paid.",
        date: "March 10, 2024"
      },
      {
        id: "rev-4-2",
        userId: "user-8",
        userName: "Sarah Johnson",
        userAvatar: "/avatars/sarah.jpg",
        rating: 5,
        comment: "Finally, a course that focuses on what really matters. My win rate didn't change, but my profitability increased dramatically.",
        date: "February 22, 2024"
      }
    ],
    price: 69.99,
    discountPrice: 49.99,
    averageRating: 4.9,
    totalStudents: 724,
    certificationIncluded: true
  }
];

/**
 * Helper Functions
 */

/**
 * Gets a course by its ID
 * @param id Course ID
 * @returns Course object or undefined if not found
 */
export const getCourseById = (id: string): Course | undefined => {
  return coursesData.find(course => course.id === id);
};

/**
 * Gets all available courses
 * @returns Array of Course objects
 */
export const getAllCourses = (): Course[] => {
  return coursesData;
};

/**
 * Gets all courses in a specific category
 * @param category Category name
 * @returns Array of Course objects in the specified category
 */
export const getCoursesByCategory = (category: string): Course[] => {
  return coursesData.filter(course => course.category === category);
};

/**
 * Gets featured courses
 * @param limit Maximum number of courses to return
 * @returns Array of featured Course objects
 */
export const getFeaturedCourses = (limit?: number): Course[] => {
  const featured = coursesData.filter(course => course.isFeatured);
  return limit ? featured.slice(0, limit) : featured;
};

/**
 * Gets courses taught by a specific instructor
 * @param instructorId Instructor ID
 * @returns Array of Course objects taught by the instructor
 */
export const getCoursesByInstructor = (instructorId: string): Course[] => {
  return coursesData.filter(course => 
    course.instructor.id === instructorId || 
    course.instructors?.some(inst => inst.id === instructorId)
  );
};

/**
 * Gets related courses based on category and tags
 * @param courseId Current course ID
 * @param limit Maximum number of related courses to return
 * @returns Array of related Course objects
 */
export const getRelatedCourses = (courseId: string, limit: number = 3): Course[] => {
  const currentCourse = getCourseById(courseId);
  if (!currentCourse) return [];
  
  // Filter courses in the same category or with matching tags
  const related = coursesData.filter(course => 
    course.id !== courseId && (
      course.category === currentCourse.category ||
      course.tags.some(tag => currentCourse.tags.includes(tag))
    )
  );
  
  return related.slice(0, limit);
};