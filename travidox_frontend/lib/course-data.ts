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
    title: "Nigerian Financial Literacy Expert",
    avatar: "/instructors/john.jpg",
    bio: "John Thompson is a certified financial educator with over 15 years of experience teaching Nigerians how to build wealth through strategic investments in local markets."
  },
  {
    id: "inst-2",
    name: "Sarah Chen",
    title: "Nigerian Stock Market Specialist",
    avatar: "/instructors/sarah.jpg",
    bio: "Sarah is a certified technical analyst specializing in the Nigerian Stock Exchange with expertise in local market patterns and Nigerian economic indicators."
  },
  {
    id: "inst-3",
    name: "Michael Rodriguez",
    title: "Forex Trading Professional",
    avatar: "/instructors/michael.jpg",
    bio: "Michael has worked with Nigerian traders for over a decade, specializing in forex risk management strategies tailored to the unique challenges of the Nigerian market."
  },
  {
    id: "inst-4",
    name: "Emma Wilson",
    title: "Nigerian Investment Strategist",
    avatar: "/instructors/emma.jpg",
    bio: "Emma is an experienced Nigerian investment advisor who has helped thousands of local investors optimize their portfolios through strategic asset allocation."
  }
];

/**
 * Course Data Repository
 * Contains all courses available on the platform
 */
export const coursesData: Course[] = [
  // 🟢 BEGINNER LEVEL COURSES
  {
    id: "course-b1",
    title: "Money Moves 101: Introduction to Financial Literacy",
    subtitle: "Master the basics of money management for Nigerians",
    category: "Financial Literacy",
    subcategory: "Beginner",
    description: "Learn the fundamentals of money management, savings, budgeting and debt management tailored for Nigerians.",
    longDescription: `
This comprehensive course is designed to build a solid foundation for anyone looking to improve their financial literacy in Nigeria. You'll learn the core concepts, terminology, and principles of effective money management.

### What You'll Learn:
- Understand the basics of personal finance and money management
- Develop effective budgeting strategies for the Nigerian context
- Learn smart ways to save money despite inflation challenges
- Master debt management techniques that work in Nigeria
- Build a strategic mindset for long-term financial success

### Course Features:
- 8 modules with over 4 hours of video content
- Interactive budget templates and financial calculators
- Downloadable resources adapted for the Nigerian economy
- Real-world examples of successful Nigerian savers
- Certificate of completion

Whether you're just starting your financial journey or want to improve your money habits, this course provides the structured knowledge you need to take control of your finances in Nigeria.
    `,
    tags: ["Financial Literacy", "Budgeting", "Savings", "Debt Management"],
    estimatedHours: 4,
    difficulty: "beginner",
    icon: "BookText",
    coverImage: "/courses/financial-literacy.jpg",
    instructor: instructors[0],
    lastUpdated: "May 15, 2024",
    createdAt: "January 10, 2024",
    language: "English",
    modules: [
      { 
        id: "m-b1-1", 
        title: "Financial Literacy Fundamentals", 
        description: "Learn the basic concepts of financial literacy and why they matter",
        duration: "45 min", 
        isCompleted: false,
        order: 1,
        content: [
          {
            id: "c-b1-1-1",
            type: "video",
            title: "Introduction to Financial Literacy in Nigeria",
            duration: "15 min",
            videoUrl: "https://www.youtube.com/embed/ZXH5oMvbp-E?si=PEXhvE261vLgTWbT",
            content: "An introduction to financial literacy and its importance in the Nigerian context."
          },
          {
            id: "c-b1-1-2",
            type: "text",
            title: "Financial Literacy Basics for Nigerians",
            duration: "15 min",
            content: `# Financial Literacy Basics for Nigerians

## What is Financial Literacy?
Financial literacy refers to the knowledge and skills needed to make effective and informed money management decisions. In Nigeria, having strong financial literacy skills is crucial due to the unique economic challenges we face:

1. **High Inflation Rates**: Understanding how to preserve purchasing power
2. **Currency Fluctuations**: Managing the effects of Naira volatility
3. **Diverse Investment Options**: Navigating between traditional savings, stocks, and alternative investments
4. **Economic Uncertainty**: Building financial resilience in an unpredictable environment

## Why Financial Literacy Matters in Nigeria

- Helps you make better financial decisions despite economic challenges
- Enables you to build wealth even in high-inflation environments
- Provides tools to avoid common financial mistakes and scams
- Creates a pathway to financial independence and security
- Empowers you to teach good money habits to your family and community`
          },
          {
            id: "c-b1-1-3",
            type: "quiz",
            title: "Financial Literacy Fundamentals Quiz",
            duration: "15 min",
            content: "Test your understanding of financial literacy basics",
            quiz: [
              {
                id: "q-b1-1-1",
                question: "Which of these is NOT a key component of financial literacy?",
                options: [
                  "Budgeting",
                  "Saving",
                  "Gambling",
                  "Investing"
                ],
                correctAnswer: 2,
                explanation: "Gambling is not a component of financial literacy. Financial literacy focuses on responsible money management through budgeting, saving, investing, and managing debt."
              },
              {
                id: "q-b1-1-2",
                question: "Why is financial literacy particularly important in Nigeria?",
                options: [
                  "Because Nigeria has no financial challenges",
                  "Due to high inflation and currency fluctuations",
                  "Because banks manage all financial decisions for Nigerians",
                  "Because financial literacy is only important for the wealthy"
                ],
                correctAnswer: 1,
                explanation: "Financial literacy is particularly important in Nigeria due to challenges like high inflation rates and currency fluctuations, which require specific knowledge to navigate effectively."
              }
            ]
          }
        ]
      }
    ],
    skills: [
      "Budgeting", 
      "Saving", 
      "Debt management", 
      "Financial planning"
    ],
    prerequisites: [
      {
        id: "pre-b1-1",
        title: "No prior knowledge required",
        description: "This course is designed for complete beginners."
      }
    ],
    reviews: [
      {
        id: "rev-b1-1",
        userId: "user-1",
        userName: "Chioma Eze",
        userAvatar: "/avatars/chioma.jpg",
        rating: 5,
        comment: "This course completely changed how I manage my money as a Nigerian. The budget templates are so practical!",
        date: "February 10, 2024"
      }
    ],
    price: 9999,
    discountPrice: 7999,
    isFeatured: true,
    averageRating: 4.7,
    totalStudents: 1243,
    certificationIncluded: true
  },
  {
    id: "course-b2",
    title: "Naija Stock Market for Starters",
    subtitle: "A beginner-friendly guide to investing in the Nigerian Stock Exchange",
    category: "Stock Market",
    subcategory: "Beginner",
    description: "Master the basics of the Nigerian Stock Exchange (NGX) with a practical, jargon-free approach designed for first-time investors.",
    longDescription: `
This beginner-friendly course provides a comprehensive introduction to the Nigerian Stock Exchange for first-time investors. You'll learn how the NGX works, how to start investing, and the fundamentals of making smart investment decisions in the Nigerian market.

### What You'll Learn:
- Understand how the Nigerian Stock Exchange functions and its role in the economy
- Learn the step-by-step process to open a brokerage account in Nigeria
- Discover how to research and select Nigerian stocks with good potential
- Master the basics of stock orders, timing, and market tracking
- Build a starter portfolio suitable for the Nigerian economic environment

### Course Features:
- 6 modules with over 3 hours of video content
- Interactive demos of Nigerian trading platforms
- Downloadable NGX stock analysis templates
- Real examples using current Nigerian companies
- Certificate of completion

This course bridges the gap between complete novice and confident beginner investor, focusing specifically on the unique aspects of the Nigerian market.
    `,
    tags: ["NGX", "Nigerian Stocks", "Beginner Investing", "Stock Market"],
    estimatedHours: 3,
    difficulty: "beginner",
    icon: "TrendingUp",
    coverImage: "/courses/nigerian-stock-market.jpg",
    instructor: instructors[1],
    lastUpdated: "April 18, 2024",
    createdAt: "February 5, 2024",
    language: "English",
    modules: [
      {
        id: "m-b2-1", 
        title: "Introduction to the Nigerian Stock Exchange", 
        description: "Learn the fundamental concepts of the Nigerian Stock Exchange and how it works",
        duration: "45 min", 
        isCompleted: false,
        order: 1,
        content: [
          {
            id: "c-b2-1-1",
            type: "video",
            title: "Introduction to the Nigerian Stock Exchange (NGX)",
            duration: "15 min",
            videoUrl: "https://www.youtube.com/embed/-n7xAKUijjQ?si=BJ2oT3RtunPfUNxU",
            content: "An introduction to the Nigerian Stock Exchange, its history, and its role in the economy."
          },
          {
            id: "c-b2-1-2",
            type: "text",
            title: "NGX Basics: What Every Nigerian Investor Should Know",
            duration: "15 min",
            content: `# NGX Basics: What Every Nigerian Investor Should Know

## What is the Nigerian Stock Exchange (NGX)?
The Nigerian Exchange Group (NGX), formerly known as the Nigerian Stock Exchange, is the primary stock exchange in Nigeria. It provides a platform where shares, bonds, and other securities are bought and sold.

## Key Facts About the NGX:
- Founded in 1960, initially as the Lagos Stock Exchange
- Renamed Nigerian Stock Exchange in 1977
- Became Nigerian Exchange Group (NGX) after demutualization in 2021
- Located in Lagos, with branches in major cities across Nigeria
- Lists over 160 companies across various sectors

## Why Invest in the NGX?
- Ownership in Nigerian companies
- Potential for capital appreciation
- Dividend income opportunities
- Portfolio diversification
- Participation in Nigeria's economic growth`
          },
          {
            id: "c-b2-1-3",
            type: "quiz",
            title: "Nigerian Stock Exchange Basics Quiz",
            duration: "15 min",
            content: "Test your understanding of the Nigerian Stock Exchange basics",
            quiz: [
              {
                id: "q-b2-1-1",
                question: "When was the Nigerian Stock Exchange founded?",
                options: [
                  "1950",
                  "1960",
                  "1977",
                  "2001"
                ],
                correctAnswer: 1,
                explanation: "The Nigerian Stock Exchange was founded in 1960 as the Lagos Stock Exchange before being renamed in 1977."
              },
              {
                id: "q-b2-1-2",
                question: "What is the current name of Nigeria's main stock exchange?",
                options: [
                  "Lagos Stock Exchange",
                  "Nigerian Stock Exchange (NSE)",
                  "Nigerian Exchange Group (NGX)",
                  "Nigerian Capital Market (NCM)"
                ],
                correctAnswer: 2,
                explanation: "After demutualization in 2021, the Nigerian Stock Exchange became the Nigerian Exchange Group (NGX)."
              }
            ]
          }
        ]
      }
    ],
    skills: [
      "Stock market basics", 
      "Investment fundamentals", 
      "Nigerian market analysis", 
      "Portfolio creation"
    ],
    prerequisites: [
      {
        id: "pre-b2-1",
        title: "No prior investment knowledge required",
        description: "This course is designed for complete beginners to the stock market."
      }
    ],
    reviews: [],
    price: 12999,
    discountPrice: 9999,
    isFeatured: true,
    averageRating: 4.8,
    totalStudents: 876,
    certificationIncluded: true
  },
  {
    id: "course-b3",
    title: "Forex for Freshers: What You Must Know Before You Trade",
    subtitle: "Essential foundations for Nigerians interested in currency trading",
    category: "Forex Trading",
    subcategory: "Beginner",
    description: "Learn the fundamentals of forex trading, currency pairs, market mechanics, and essential risk management before you start trading.",
    longDescription: `
This introductory course covers everything Nigerian beginners need to know before starting forex trading. With a focus on fundamentals and risk management, you'll learn how the forex market works and how to approach it safely as a Nigerian trader.

### What You'll Learn:
- Understand forex markets and how they function globally and in Nigeria
- Master the basics of currency pairs with focus on NGN-related trading
- Learn to read forex charts and understand basic price movements
- Discover the impact of Nigerian and global economic events on forex
- Develop essential risk management skills to protect your capital

### Course Features:
- 7 modules with over 3.5 hours of video content
- Interactive demos of forex trading platforms
- Risk management calculator templates
- Practice exercises with real market examples
- Certificate of completion

This course focuses on building a solid foundation before actual trading, helping Nigerians avoid the common pitfalls that cause new traders to lose money.
    `,
    tags: ["Forex", "Currency Trading", "Risk Management", "Beginner"],
    estimatedHours: 3.5,
    difficulty: "beginner",
    icon: "DollarSign",
    coverImage: "/courses/forex-basics.jpg",
    instructor: instructors[2],
    lastUpdated: "May 1, 2024",
    createdAt: "March 10, 2024",
    language: "English",
    modules: [
            { 
        id: "m-b3-1", 
        title: "Understanding the Forex Market", 
        description: "Learn what forex trading is and how the global currency market works",
        duration: "45 min",
        isCompleted: false,
        order: 1,
        content: [
          {
            id: "c-b3-1-1",
            type: "video",
            title: "Introduction to Forex Trading for Nigerians",
            duration: "15 min",
            videoUrl: "https://www.youtube.com/embed/RuBx4xg2yUY?si=Evj-6eNvmp7LagnL",
            content: "An introduction to forex trading basics and how Nigerians can participate in the global currency market."
          },
          {
            id: "c-b3-1-2",
            type: "text",
            title: "Forex Fundamentals for Nigerian Traders",
            duration: "15 min",
            content: `# Forex Fundamentals for Nigerian Traders

## What is Forex Trading?
Forex (Foreign Exchange) trading is the buying and selling of currencies on the global marketplace. For Nigerian traders, forex offers opportunities to profit from currency price movements, including those involving the Naira (NGN).

## Key Forex Concepts for Nigerian Beginners:
- **Currency Pairs**: Currencies are always traded in pairs (e.g., USD/NGN, EUR/USD)
- **Pips**: The smallest price movement in a currency pair
- **Leverage**: Borrowing money to control larger positions (regulated differently in Nigeria)
- **Spreads**: The difference between buy and sell prices
- **Lots**: Standardized trade sizes in forex

## The Nigerian Forex Perspective:
- Trading hours and how they align with Nigerian time zones
- Impact of Nigerian economic news on forex pairs involving NGN
- Regulatory considerations for Nigerian forex traders
- Common challenges facing Nigerian forex traders and how to overcome them`
          },
          {
            id: "c-b3-1-3",
            type: "quiz",
            title: "Forex Fundamentals Quiz",
            duration: "15 min",
            content: "Test your understanding of forex trading basics",
            quiz: [
              {
                id: "q-b3-1-1",
                question: "What does the term 'pip' refer to in forex trading?",
                options: [
                  "A type of forex broker",
                  "The smallest price movement in a currency pair",
                  "A trading platform for Nigerian traders",
                  "The minimum deposit required to start trading"
                ],
                correctAnswer: 1,
                explanation: "A pip is the smallest price movement in a currency pair. For most currency pairs, a pip is a movement of 0.0001 in the exchange rate."
              },
              {
                id: "q-b3-1-2",
                question: "Which of these is a valid currency pair involving the Nigerian Naira?",
                options: [
                  "NGN/USD",
                  "EUR/NGN",
                  "NGN/NGN",
                  "NGN/JPY/USD"
                ],
                correctAnswer: 0,
                explanation: "NGN/USD is a valid currency pair that represents the exchange rate between the Nigerian Naira and the US Dollar."
              }
            ]
          }
        ]
      }
    ],
    skills: [
      "Forex fundamentals", 
      "Currency pairs", 
      "Market analysis", 
      "Risk management"
    ],
    prerequisites: [
      {
        id: "pre-b3-1",
        title: "No prior trading experience required",
        description: "This course is designed for complete beginners to forex trading."
      }
    ],
    reviews: [],
    price: 14999,
    discountPrice: 11999,
    isFeatured: false,
    averageRating: 4.6,
    totalStudents: 543,
    certificationIncluded: true
  },
  
  // 🟡 INTERMEDIATE LEVEL COURSES
  {
    id: "course-i1",
    title: "How to Read Stock Charts & Market Trends (Made Simple)",
    subtitle: "Master technical analysis techniques for Nigerian stocks",
    category: "Technical Analysis",
    subcategory: "Intermediate",
    description: "Learn practical technical analysis techniques to read stock charts and identify profitable trends in the Nigerian market.",
    longDescription: `
This intermediate-level course teaches you how to apply technical analysis to Nigerian stocks in a practical, straightforward way. You'll learn to identify chart patterns, use indicators, and make more informed trading decisions based on price action.

### What You'll Learn:
- Master the art of reading candlestick charts for Nigerian stocks
- Identify key support and resistance levels in the Nigerian market
- Use trend lines and chart patterns to predict price movements
- Apply technical indicators effectively to NGX-listed companies
- Develop a technical trading strategy adapted for Nigerian market conditions

### Course Features:
- 8 modules with over 5 hours of detailed video instruction
- Practice exercises using real Nigerian stock charts
- Technical analysis templates and checklists
- Case studies of successful technical trades in the NGX
- Certificate of completion

This course bridges the gap between basic chart reading and advanced technical analysis, with all examples specifically using Nigerian stocks and market scenarios.
    `,
    tags: ["Technical Analysis", "Chart Patterns", "Stock Trading", "NGX"],
    estimatedHours: 5,
    difficulty: "intermediate",
    icon: "BarChart2",
    coverImage: "/courses/technical-charts.jpg",
    instructor: instructors[1],
    lastUpdated: "April 28, 2024",
    createdAt: "January 15, 2024",
    language: "English",
    modules: [
      { 
        id: "m-i1-1", 
        title: "Introduction to Technical Analysis", 
        description: "Learn the fundamental concepts of technical analysis and why it works",
        duration: "60 min",
        isCompleted: false,
        order: 1,
        content: [
          {
            id: "c-i1-1-1",
            type: "video",
            title: "Introduction to Technical Analysis for Nigerian Stocks",
            duration: "20 min",
            videoUrl: "https://www.youtube.com/embed/0vZnZhN-1EA?si=PuWWLP6eQ0UEJMWI",
            content: "An introduction to technical analysis and its application to the Nigerian stock market."
          },
          {
            id: "c-i1-1-2",
            type: "text",
            title: "Introduction to Technical Analysis for Nigerian Stocks",
            duration: "20 min",
            content: `# Introduction to Technical Analysis for Nigerian Stocks

## What is Technical Analysis?
Technical analysis is the study of historical price movements and patterns to forecast future price movements. Unlike fundamental analysis, which looks at a company's financial health, technical analysis focuses solely on price action and trading volume.

## Why Technical Analysis Works for Nigerian Stocks
- Markets tend to move in trends (upward, downward, or sideways)
- History often repeats itself in market patterns
- Price action reflects all available market information
- Nigerian market participants often react similarly to certain price patterns

## Core Technical Analysis Concepts for Nigerian Traders:
1. **Price Charts**: Visual representations of price movements over time
2. **Support and Resistance**: Price levels where stocks tend to stop falling or rising
3. **Trends**: The general direction of market movement
4. **Volume**: The number of shares traded (indicates conviction behind price moves)
5. **Chart Patterns**: Recognizable formations that suggest potential price movements

## Types of Charts Used in Nigerian Stock Analysis:
- **Line Charts**: Simple view of closing prices
- **Bar Charts**: Show open, high, low, and close prices
- **Candlestick Charts**: Japanese method showing price movement with colored bodies
- **Point and Figure**: Focus on significant price movements without time consideration

## Applying Technical Analysis to Nigerian Stocks
Technical analysis can be particularly effective for Nigerian stocks due to the market's emerging nature and sometimes lower liquidity, which can create clearer pattern formations.`
          },
          {
            id: "c-i1-1-3",
            type: "quiz",
            title: "Technical Analysis Basics Quiz",
            duration: "20 min",
            content: "Test your understanding of technical analysis fundamentals",
            quiz: [
              {
                id: "q-i1-1-1",
                question: "Which of these is NOT a key principle of technical analysis?",
                options: [
                  "Price discounts everything",
                  "Prices move in trends",
                  "Company fundamentals determine price",
                  "History tends to repeat"
                ],
                correctAnswer: 2,
                explanation: "Technical analysis focuses on price action and chart patterns rather than company fundamentals. The belief that 'company fundamentals determine price' is actually a principle of fundamental analysis, not technical analysis."
              },
              {
                id: "q-i1-1-2",
                question: "Why is technical analysis particularly useful in the Nigerian stock market?",
                options: [
                  "Because Nigerian stocks don't follow fundamentals at all",
                  "Because it helps identify entry/exit points in markets with information asymmetry",
                  "Because technical analysis only works in emerging markets",
                  "Because Nigerian investors don't use technical analysis"
                ],
                correctAnswer: 1,
                explanation: "Technical analysis is particularly useful in markets like Nigeria's where information asymmetry exists and perfect information is not always available to all market participants. It helps traders identify better entry and exit points despite these challenges."
              },
              {
                id: "q-i1-1-3",
                question: "What adjustment might be necessary when applying technical analysis to Nigerian stocks?",
                options: [
                  "Ignoring all chart patterns",
                  "Only using fundamental analysis instead",
                  "Accounting for lower liquidity in some NGX stocks",
                  "Assuming prices will always go up"
                ],
                correctAnswer: 2,
                explanation: "When applying technical analysis to Nigerian stocks, traders often need to account for lower liquidity in some NGX stocks, which can affect the reliability of certain patterns and indicators."
              }
            ]
          }
        ]
      },
      {
        id: "m-i1-2",
        title: "Understanding Chart Types and Patterns",
        description: "Learn to read different chart types and identify key patterns",
        duration: "75 min",
        isCompleted: false,
        order: 2,
        content: [
          {
            id: "c-i1-2-1",
            type: "video",
            title: "Chart Types and Their Applications",
            duration: "25 min",
            videoUrl: "https://www.youtube.com/embed/WbMnfiknBoc?si=dbcGq2aE3wCd7ttB",
            content: "Learn about line charts, bar charts, and candlestick charts and when to use each type."
          },
          {
            id: "c-i1-2-2",
            type: "text",
            title: "Mastering Candlestick Patterns",
            duration: "25 min",
            content: `# Mastering Candlestick Patterns for Nigerian Stocks

## Introduction to Candlestick Charts
Candlestick charts originated in Japan in the 1700s and have become the most popular chart type for technical analysis. Each candlestick represents four key price points: open, close, high, and low.

## Basic Candlestick Components:
- **Body**: The rectangular area between opening and closing prices
- **Wicks/Shadows**: The thin lines extending from the body
- **Bullish Candle**: Typically green or white, close higher than open
- **Bearish Candle**: Typically red or black, close lower than open

## Essential Candlestick Patterns for Nigerian Markets:

### Reversal Patterns:
1. **Doji**: When open and close are virtually equal, indicating indecision
2. **Hammer/Hanging Man**: Small body with long lower shadow, potential reversal
3. **Engulfing Patterns**: When current candle completely engulfs previous candle
4. **Morning Star/Evening Star**: Three-candle reversal patterns

### Continuation Patterns:
1. **Marubozu**: Candles with no or very small shadows
2. **Spinning Tops**: Small bodies with upper and lower shadows
3. **Rising/Falling Windows**: Gaps in Japanese candlestick terminology

## Reading Candlestick Patterns in NGX Stocks:
- How to spot valid patterns in less liquid Nigerian stocks
- Confirmation techniques to verify pattern reliability
- Volume considerations when trading based on candlestick patterns
- Real examples from top NGX stocks like Dangote Cement and GTBank`
          },
          {
            id: "c-i1-2-3",
            type: "quiz",
            title: "Chart Patterns Quiz",
            duration: "25 min",
            content: "Test your understanding of chart types and candlestick patterns",
            quiz: [
              {
                id: "q-i1-2-1",
                question: "What does a Doji candlestick pattern indicate?",
                options: [
                  "Strong bullish trend",
                  "Strong bearish trend",
                  "Market indecision or equilibrium between buyers and sellers",
                  "Market is closed for the day"
                ],
                correctAnswer: 2,
                explanation: "A Doji forms when the opening and closing prices are virtually equal, creating a candlestick with almost no body. This pattern indicates indecision in the market, with equilibrium between buying and selling pressure."
              },
              {
                id: "q-i1-2-2",
                question: "In candlestick charts, what is the 'body' of the candlestick?",
                options: [
                  "The entire candlestick including shadows",
                  "The rectangular area between opening and closing prices",
                  "Only the shadows/wicks",
                  "The volume indicator below the candlestick"
                ],
                correctAnswer: 1,
                explanation: "The body of a candlestick is the rectangular area between the opening and closing prices. The thin lines extending from the body are called shadows or wicks."
              },
              {
                id: "q-i1-2-3",
                question: "What is a bullish engulfing pattern?",
                options: [
                  "A small candlestick followed by a larger candlestick that completely engulfs the previous one",
                  "A candlestick with no shadows",
                  "A candlestick with a very long upper shadow",
                  "Two identical candlesticks in a row"
                ],
                correctAnswer: 0,
                explanation: "A bullish engulfing pattern occurs when a smaller bearish (down) candlestick is followed by a larger bullish (up) candlestick that completely engulfs or covers the previous candle. This pattern often signals a potential reversal from a downtrend to an uptrend."
              }
            ]
          }
        ]
      }
    ],
    skills: [
      "Chart reading", 
      "Pattern recognition", 
      "Technical indicators", 
      "Trend analysis"
    ],
    prerequisites: [
      {
        id: "pre-i1-1",
        title: "Basic stock market knowledge",
        description: "You should understand the basics of how the stock market works before taking this course."
      }
    ],
    reviews: [],
    price: 19999,
    discountPrice: 15999,
    isFeatured: true,
    averageRating: 4.8,
    totalStudents: 423,
    certificationIncluded: true
  },
  {
    id: "course-i2",
    title: "Trading the News: Forex Strategies for Volatile Markets",
    subtitle: "Learn to leverage economic events for profitable forex trades",
    category: "Forex Trading",
    subcategory: "Intermediate",
    description: "Master strategies for trading forex based on economic news, central bank announcements, and market-moving events affecting the Naira.",
    longDescription: `
This specialized course teaches Nigerian forex traders how to capitalize on market volatility caused by economic news and events. You'll learn to interpret news releases, understand their impact on currency pairs, and develop strategies to trade these high-impact situations.

### What You'll Learn:
- Understand how economic news affects forex markets, particularly NGN pairs
- Master the use of economic calendars to prepare for market-moving events
- Develop specific entry and exit strategies for news-based trading
- Manage risk effectively during high-volatility market conditions
- Analyze Central Bank of Nigeria policies and their impact on currency values

### Course Features:
- 6 modules with over 4 hours of focused video content
- Real case studies of major economic events and their market impact
- News trading strategy templates and risk calculators
- Live examples of trades based on Nigerian and international news
- Certificate of completion

This intermediate course is ideal for forex traders who understand the basics and want to develop more sophisticated strategies for volatile market conditions.
    `,
    tags: ["Forex News Trading", "Market Volatility", "Economic Events", "Trading Strategies"],
    estimatedHours: 4,
    difficulty: "intermediate",
    icon: "TrendingUp",
    coverImage: "/courses/forex-news-trading.jpg",
    instructor: instructors[2],
    lastUpdated: "May 10, 2024",
    createdAt: "February 20, 2024",
    language: "English",
    modules: [
      { 
        id: "m-i2-1", 
        title: "The Impact of News on Forex Markets", 
        description: "Understand how and why news events create trading opportunities",
        duration: "45 min", 
        isCompleted: false,
        order: 1,
        content: [
          {
            id: "c-i2-1-1",
            type: "video",
            title: "How News Events Impact Forex Markets",
            duration: "15 min",
            videoUrl: "https://www.youtube.com/embed/UBp56lAQEI4?si=g5vk1bK5JNi1Yjes",
            content: "Learn how economic news and events affect currency prices and create trading opportunities."
          },
          {
            id: "c-i2-1-2",
            type: "text",
            title: "How News Impacts Currency Markets",
            duration: "20 min",
            content: `# How News Impacts Currency Markets

## The News-Forex Connection
News events and economic data releases are among the most powerful forces driving forex market movements. For Nigerian traders, understanding how both local and international news affects currency pairs is essential for successful trading.

## Key Economic Indicators That Move the Forex Market:
1. **Interest Rate Decisions**: Central bank decisions (CBN, Fed, ECB)
2. **GDP Data**: Measure of economic output and growth
3. **Inflation Reports**: Consumer Price Index (CPI) and inflation rates
4. **Employment Data**: Job creation and unemployment rates
5. **Trade Balance**: Import vs. export data
6. **Oil Prices**: Particularly important for the Naira

## Nigeria-Specific News Events That Impact Forex:
- **CBN Policy Announcements**: Monetary policy changes, intervention efforts
- **Crude Oil Production/Prices**: Nigeria's main export and foreign exchange earner
- **Political Developments**: Elections, policy changes, governance issues
- **Foreign Reserve Levels**: Indicate Nigeria's ability to defend the Naira
- **Security Situations**: Can impact economic activity and foreign investment

## How to Prepare for High-Impact News Events:
1. **Economic Calendars**: Track upcoming news releases
2. **Volatility Expectations**: Anticipate larger price movements
3. **Position Sizing**: Adjust trading size based on news volatility
4. **Risk Management**: Set appropriate stop losses for news events
5. **Post-News Analysis**: Study market reactions for future reference`
          },
          {
            id: "c-i2-1-3",
            type: "quiz",
            title: "News Impact on Forex Quiz",
            duration: "15 min",
            content: "Test your understanding of how news affects forex markets",
            quiz: [
              {
                id: "q-i2-1-1",
                question: "Which of the following is NOT a typical market-moving news event?",
                options: [
                  "Interest rate decisions by the Central Bank of Nigeria",
                  "Quarterly GDP reports",
                  "Celebrity endorsements of currencies",
                  "Major oil supply disruptions"
                ],
                correctAnswer: 2,
                explanation: "Celebrity endorsements of currencies are not typical market-moving news events. Forex markets are primarily influenced by economic data, central bank decisions, geopolitical events, and market sentiment rather than celebrity opinions."
              },
              {
                id: "q-i2-1-2",
                question: "What typically happens to currency spreads during major news releases?",
                options: [
                  "They remain exactly the same",
                  "They narrow significantly",
                  "They widen due to increased volatility",
                  "They disappear completely"
                ],
                correctAnswer: 2,
                explanation: "During major news releases, currency spreads typically widen due to increased volatility and uncertainty. Brokers increase the spread to protect themselves against rapid price movements."
              },
              {
                id: "q-i2-1-3",
                question: "Which statement best describes the Nigerian Naira's reaction to Central Bank of Nigeria policy announcements?",
                options: [
                  "CBN announcements have no effect on the Naira",
                  "The Naira is highly sensitive to CBN interest rate decisions and policy statements",
                  "Only international news affects the Naira",
                  "The Naira only reacts to oil price changes"
                ],
                correctAnswer: 1,
                explanation: "The Nigerian Naira is highly sensitive to Central Bank of Nigeria interest rate decisions and policy statements. As the national monetary authority, CBN's actions directly impact Naira valuation and forex policy."
              }
            ]
          }
        ]
      },
      {
        id: "m-i2-2", 
        title: "Using Economic Calendars for Trading", 
        description: "Learn how to effectively use economic calendars to prepare for trading opportunities",
        duration: "60 min", 
        isCompleted: false,
        order: 2,
        content: [
          {
            id: "c-i2-2-1",
            type: "video",
            title: "Mastering the Economic Calendar",
            duration: "20 min",
            videoUrl: "https://www.youtube.com/embed/JNECO2MQ8Ac?si=Y3Tkd1p9YNWc2snx",
            content: "Learn how to read and interpret economic calendars to prepare for trading events."
          },
          {
            id: "c-i2-2-2",
            type: "text",
            title: "Economic Calendar Strategies for Nigerian Traders",
            duration: "20 min",
            content: `# Economic Calendar Strategies for Nigerian Traders

## What is an Economic Calendar?
An economic calendar is a schedule of economic events and indicators that are likely to impact financial markets, including forex. For Nigerian traders, understanding how to use these calendars is essential for planning trades around high-impact events.

## Key Components of Economic Calendars:
- **Date and Time**: When the event will occur (adjust for Nigerian time zone)
- **Event/Indicator**: The specific economic release or announcement
- **Importance/Impact**: Usually rated as low, medium, or high impact
- **Previous Value**: Last period's result
- **Forecast**: Market expectations
- **Actual Result**: The released figure (populated after the event)

## How to Use Economic Calendars Effectively:
1. **Filter for High-Impact Events**: Focus on events rated as high-impact
2. **Watch Currency-Specific News**: Pay special attention to events affecting currencies you trade
3. **Note Time in Nigerian Time Zone**: Convert event times to your local time
4. **Plan Around Major Releases**: Consider avoiding open positions during volatile news events
5. **Watch for Deviation**: The difference between forecast and actual result often determines market reaction

## Nigerian-Relevant Calendar Events:
- Central Bank of Nigeria (CBN) interest rate decisions
- Nigerian inflation data (CPI)
- Nigerian GDP reports
- Crude oil inventory and production data
- Major trading partner announcements (US, EU, China)

## Pre-Event Trading Strategies:
- Identifying potential breakout levels before news
- Setting up pending orders to catch volatility
- Risk management techniques for news trading
- When to stay out of the market entirely`
          },
          {
            id: "c-i2-2-3",
            type: "quiz",
            title: "Economic Calendar Quiz",
            duration: "20 min",
            content: "Test your understanding of economic calendars and their use in forex trading",
            quiz: [
              {
                id: "q-i2-2-1",
                question: "What typically causes the biggest market movement when an economic indicator is released?",
                options: [
                  "The release time",
                  "The country releasing the data",
                  "The significant deviation from forecast values",
                  "The color of the announcement on the calendar"
                ],
                correctAnswer: 2,
                explanation: "The most significant market movement typically occurs when there is a large deviation between the actual released value and the forecast value. This surprise element often drives strong price reactions."
              },
              {
                id: "q-i2-2-2",
                question: "Why should Nigerian forex traders pay attention to US Federal Reserve announcements?",
                options: [
                  "They have no relevance to Nigerian traders",
                  "They directly impact USD-based pairs, which affect global forex markets including NGN",
                  "Only because they're colored red on economic calendars",
                  "Only Nigerian announcements matter to Nigerian traders"
                ],
                correctAnswer: 1,
                explanation: "Nigerian forex traders should pay attention to US Federal Reserve announcements because they directly impact USD-based pairs, which in turn affect global forex markets including the Naira. The USD is the world's reserve currency and has widespread influence."
              },
              {
                id: "q-i2-2-3",
                question: "What is a sensible approach to trading during major news releases?",
                options: [
                  "Always place large trades right before the news",
                  "Ignore the news completely",
                  "Consider reducing position sizes or staying out of the market during highly volatile releases",
                  "Only trade minor currency pairs during news"
                ],
                correctAnswer: 2,
                explanation: "A sensible approach to trading during major news releases is to consider reducing position sizes or staying out of the market entirely during highly volatile releases. This helps manage risk during unpredictable price movements."
              }
            ]
          }
        ]
      }
    ],
    skills: [
      "News analysis", 
      "Volatility trading", 
      "Economic calendar use", 
      "Event-based strategies"
    ],
    prerequisites: [
      {
        id: "pre-i2-1",
        title: "Basic forex knowledge required",
        description: "You should understand forex basics including currency pairs, pips, and basic order types."
      }
    ],
    reviews: [],
    price: 24999,
    discountPrice: 19999,
    isFeatured: false,
    averageRating: 4.7,
    totalStudents: 312,
    certificationIncluded: true
  },
  
  // 🔴 ADVANCED LEVEL COURSES
  {
    id: "course-a1",
    title: "Build Your Trading Plan: Risk, Psychology & Consistency",
    subtitle: "Develop a professional trading approach for long-term success",
    category: "Trading Psychology",
    subcategory: "Advanced",
    description: "Master the psychological aspects of trading with a focus on risk management, emotional discipline, and developing a consistent trading plan.",
    longDescription: `
This advanced course goes beyond technical skills to focus on the psychological and strategic elements that separate successful traders from the rest. You'll learn to build a comprehensive trading plan tailored to Nigerian markets, with robust risk management and mental discipline.

### What You'll Learn:
- Develop a complete, personalized trading plan for Nigerian markets
- Master advanced risk management techniques to preserve capital
- Understand and overcome the psychological biases affecting your trading
- Build routines and habits that support consistent trading performance
- Implement position sizing strategies based on market conditions

### Course Features:
- 8 modules with over 6 hours of in-depth content
- Trading journal templates and risk management calculators
- Psychological assessment tools to identify your trading weaknesses
- Case studies of successful Nigerian traders and their approaches
- Certificate of completion

This course is designed for serious traders who want to elevate their performance by mastering the mental game and strategic planning aspects of trading.
    `,
    tags: ["Trading Psychology", "Risk Management", "Trading Plan", "Consistency"],
    estimatedHours: 6,
    difficulty: "advanced",
    icon: "Layers",
    coverImage: "/courses/trading-psychology.jpg",
    instructor: instructors[3],
    lastUpdated: "May 5, 2024",
    createdAt: "January 25, 2024",
    language: "English",
    modules: [
      { 
        id: "m-a1-1", 
        title: "The Foundations of a Trading Plan", 
        description: "Learn why having a structured trading plan is essential for success",
        duration: "60 min", 
        isCompleted: false,
        order: 1,
        content: [
          {
            id: "c-a1-1-1",
            type: "video",
            title: "Why Every Trader Needs a Trading Plan",
            duration: "20 min",
            videoUrl: "https://www.youtube.com/embed/aWx30SgWbUI?si=f28VNv34Ng9s0Lw8",
            content: "Learn why a structured trading plan is critical for consistent success in the Nigerian markets."
          },
          {
            id: "c-a1-1-2",
            type: "text",
            title: "Trading Psychology Fundamentals",
            duration: "20 min",
            content: `# Trading Psychology Fundamentals

## Why Psychology Matters in Trading
The greatest trading systems in the world are worthless if you can't follow them consistently. Your mindset and emotional control are often the difference between success and failure in the markets.

## Common Psychological Challenges for Nigerian Traders:
1. **Fear**: Hesitation to enter trades, cutting winners too early
2. **Greed**: Overleveraging, holding losers too long
3. **Revenge Trading**: Trying to recover losses with risky trades
4. **Overconfidence**: Ignoring risk management after winning streaks
5. **Analysis Paralysis**: Overthinking decisions, unable to pull the trigger
6. **FOMO (Fear of Missing Out)**: Entering trades based on others' success stories

## Nigeria-Specific Psychological Factors:
- Pressure from economic hardship and desire for quick wealth
- Cultural expectations and family responsibilities
- Skepticism from past investment scams common in Nigeria
- Limited access to quality information and analysis tools
- Currency volatility creating additional stress

## Building Mental Resilience as a Nigerian Trader:
1. **Accept Market Realities**: Markets are probabilistic, not deterministic
2. **Develop Emotional Awareness**: Recognize your emotional triggers
3. **Implement Trading Rules**: Create and follow a trading plan religiously
4. **Practice Patience**: Good trades come to those who wait
5. **Separate Self-Worth from Results**: Your trading results don't define you
6. **Build Support Systems**: Connect with other disciplined traders`
          },
          {
            id: "c-a1-1-3",
            type: "quiz",
            title: "Trading Plan Fundamentals Quiz",
            duration: "20 min",
            content: "Test your understanding of trading plan fundamentals",
            quiz: [
              {
                id: "q-a1-1-1",
                question: "Why is having a trading plan particularly important for Nigerian traders?",
                options: [
                  "Because Nigerian traders don't need technical analysis",
                  "Because trading plans are only useful in emerging markets",
                  "Because of the volatility and unique challenges of local markets",
                  "Because trading plans are required by Nigerian regulations"
                ],
                correctAnswer: 2,
                explanation: "Having a clear trading plan is particularly important for Nigerian traders due to the volatility and unique challenges of local markets. A well-structured plan helps navigate these challenges with discipline and consistency."
              },
              {
                id: "q-a1-1-2",
                question: "What is a reasonable maximum risk per trade in the Nigerian market context?",
                options: [
                  "10-15% of account",
                  "1-2% of account",
                  "25% of account",
                  "50% of account"
                ],
                correctAnswer: 1,
                explanation: "A reasonable maximum risk per trade is 1-2% of your account value. This conservative approach helps preserve capital through inevitable losing streaks, especially important in volatile markets like Nigeria's."
              },
              {
                id: "q-a1-1-3",
                question: "Which of these is NOT a core component of an effective trading plan?",
                options: [
                  "Risk management rules",
                  "Market analysis framework",
                  "Guarantees of specific profit percentages",
                  "Psychological framework"
                ],
                correctAnswer: 2,
                explanation: "Guarantees of specific profit percentages are NOT a core component of an effective trading plan. Markets are inherently uncertain, and no legitimate trading plan can guarantee specific returns. Instead, plans focus on process, risk management, and consistent approach."
              }
            ]
          }
        ]
      },
      {
        id: "m-a1-2", 
        title: "Advanced Risk Management Techniques", 
        description: "Master sophisticated risk management strategies to protect your capital",
        duration: "75 min", 
        isCompleted: false,
        order: 2,
        content: [
          {
            id: "c-a1-2-1",
            type: "video",
            title: "Advanced Risk Management for Nigerian Traders",
            duration: "25 min",
            videoUrl: "https://www.youtube.com/embed/v3RFx1P-j5w?si=7kK5UuXTEj9LIeI5",
            content: "Learn sophisticated risk management techniques specifically tailored for Nigerian market conditions."
          },
          {
            id: "c-a1-2-2",
            type: "text",
            title: "Professional Risk Management Systems",
            duration: "25 min",
            content: `# Professional Risk Management Systems

## Beyond Basic Risk Management
While beginners focus on simple risk principles like fixed stop losses, professional traders employ sophisticated risk management systems that adapt to market conditions and account performance. These advanced techniques are particularly valuable in the Nigerian market environment.

## Position Sizing Methodologies:

### 1. Percent Risk Model
- Calculate position size based on stop distance and percent risk
- Formula: Position Size = (Account × Risk%) ÷ (Entry - Stop)
- Nigerian application: Using tighter risk percentages (0.5-1%) during high volatility periods

### 2. Volatility-Based Sizing
- Adjust position size based on market volatility
- Using Average True Range (ATR) to determine appropriate risk
- Reducing exposure during abnormal volatility in Nigerian markets

### 3. Kelly Criterion and Optimal f
- Mathematical approaches to optimize position sizing
- Accounting for win rate and risk:reward ratio
- Modified Kelly for more conservative sizing

## Portfolio-Level Risk Management:

### 1. Correlation Management
- Understanding sector correlations in the Nigerian market
- Avoiding overexposure to correlated assets (e.g., banking stocks, oil-dependent sectors)
- Creating genuinely diversified positions

### 2. Exposure Limits
- Maximum sector exposure percentages
- Currency exposure considerations (Naira vs. USD)
- Overall market exposure during uncertain periods

### 3. Drawdown Management
- Predetermined equity thresholds for reducing risk
- Scaling position sizes after losses
- Recovery strategies that don't involve increasing risk

## Advanced Hedging Techniques:
- Using NGX derivatives and options when available
- Cross-asset hedging strategies
- Macro hedges for Nigerian market-specific risks

## Risk Management Technology:
- Risk calculators and position sizing tools
- Portfolio stress testing for Nigerian market scenarios
- Automated risk monitoring systems

## Creating Your Risk Management Framework:
- Documenting your complete risk rules
- Regular review and improvement process
- Building risk management into daily routines`
          },
          {
            id: "c-a1-2-3",
            type: "quiz",
            title: "Advanced Risk Management Quiz",
            duration: "25 min",
            content: "Test your understanding of advanced risk management concepts",
            quiz: [
              {
                id: "q-a1-2-1",
                question: "What is the Percent Risk Model formula for calculating position size?",
                options: [
                  "Position Size = (Entry - Stop) × (Account × Risk%)",
                  "Position Size = (Account × Risk%) ÷ (Entry - Stop)",
                  "Position Size = Account × Risk% × (Entry - Stop)",
                  "Position Size = Stop Loss × Account Size"
                ],
                correctAnswer: 1,
                explanation: "The Percent Risk Model formula is: Position Size = (Account × Risk%) ÷ (Entry - Stop). This ensures that if your stop loss is hit, you'll lose exactly the percentage of your account that you've predetermined as your acceptable risk."
              },
              {
                id: "q-a1-2-2",
                question: "Why is correlation management particularly important in the Nigerian market?",
                options: [
                  "Because Nigerian stocks are never correlated",
                  "To avoid overexposure to related sectors like banking or oil-dependent companies",
                  "Because correlation doesn't matter in emerging markets",
                  "Because Nigerian regulations require it"
                ],
                correctAnswer: 1,
                explanation: "Correlation management is particularly important in the Nigerian market to avoid overexposure to related sectors like banking or oil-dependent companies. Many Nigerian stocks and sectors move together due to common economic factors, so diversification requires careful correlation analysis."
              },
              {
                id: "q-a1-2-3",
                question: "What should a trader do with their position sizing after experiencing a series of losses?",
                options: [
                  "Increase position size to recover losses faster",
                  "Maintain the same position size regardless of losses",
                  "Reduce position size temporarily to preserve capital",
                  "Stop trading completely for a month"
                ],
                correctAnswer: 2,
                explanation: "After experiencing a series of losses, a trader should reduce position size temporarily to preserve capital. This drawdown management technique helps protect the remaining account balance during potential losing streaks or periods when a trader's strategy may be out of sync with the market."
              }
            ]
          }
        ]
      }
    ],
    skills: [
      "Trading psychology", 
      "Risk management", 
      "Strategic planning", 
      "Emotional discipline"
    ],
    prerequisites: [
      {
        id: "pre-a1-1",
        title: "Trading experience required",
        description: "This course is designed for traders who already understand the basics of either stock or forex trading."
      }
    ],
    reviews: [],
    price: 34999,
    discountPrice: 29999,
    isFeatured: true,
    averageRating: 4.9,
    totalStudents: 187,
    certificationIncluded: true
  },
  {
    id: "course-a2",
    title: "Technical Analysis Masterclass (Naija-Focused)",
    subtitle: "Advanced chart analysis techniques for Nigerian markets",
    category: "Technical Analysis",
    subcategory: "Advanced",
    description: "Master advanced technical analysis methods including complex chart patterns, Fibonacci levels, Elliott Wave theory, and intermarket analysis for Nigerian stocks and forex.",
    longDescription: `
This comprehensive masterclass takes your technical analysis skills to professional levels with advanced concepts and techniques. Focused specifically on Nigerian market applications, you'll learn sophisticated methods to analyze price action and make high-probability trading decisions.

### What You'll Learn:
- Master advanced candlestick patterns and their reliability in Nigerian markets
- Apply Fibonacci retracements and extensions to predict price targets
- Understand Elliott Wave theory and how to count waves in Nigerian stocks
- Use multiple timeframe analysis for more accurate trading decisions
- Implement volume profile and market structure concepts in your analysis

### Course Features:
- 10 modules with over 8 hours of expert-level instruction
- Advanced chart analysis exercises using Nigerian market data
- Professional-grade technical analysis templates
- Case studies of complex trades in Nigerian stocks and USD/NGN
- Certificate of completion

This course is designed for serious traders who want to develop professional-level technical analysis skills specifically adapted for Nigerian market conditions.
    `,
    tags: ["Advanced Charts", "Fibonacci", "Elliott Wave", "Market Structure"],
    estimatedHours: 8,
    difficulty: "advanced",
    icon: "Activity",
    coverImage: "/courses/advanced-technical.jpg",
    instructor: instructors[1],
    lastUpdated: "April 15, 2024",
    createdAt: "December 10, 2023",
    language: "English",
    modules: [
      { 
        id: "m-a2-1", 
        title: "Advanced Chart Patterns", 
        description: "Master complex chart patterns and their applications in Nigerian markets",
        duration: "75 min", 
        isCompleted: false,
        order: 1,
        content: [
          {
            id: "c-a2-1-1",
            type: "video",
            title: "Advanced Chart Patterns for Nigerian Markets",
            duration: "25 min",
            videoUrl: "https://www.youtube.com/embed/WbMnfiknBoc?si=zjueqFQ5B4Nm0-jV",
            content: "Learn complex chart patterns and how to identify them in Nigerian stock charts."
          },
          {
            id: "c-a2-1-2",
            type: "text",
            title: "Advanced Candlestick Patterns for Nigerian Markets",
            duration: "25 min",
            content: `# Advanced Candlestick Patterns for Nigerian Markets

## Beyond Basic Candlesticks
While basic candlestick patterns provide valuable insights, advanced patterns can offer more precise entry and exit signals, especially in the sometimes volatile Nigerian market environment.

## High-Reliability Reversal Patterns for Nigerian Stocks:
1. **Three Black Crows**: A bearish reversal pattern showing three consecutive long red candles with lower closes
2. **Three White Soldiers**: A bullish reversal pattern showing three consecutive long green candles with higher closes
3. **Morning Star**: A bullish reversal pattern at the bottom of a downtrend (especially effective for Nigerian bank stocks)
4. **Evening Star**: A bearish reversal pattern at the top of an uptrend
5. **Abandoned Baby**: Rare but highly reliable reversal pattern with gaps on both sides

## Continuation Patterns That Work Well in Nigerian Markets:
1. **Rising Three Methods**: Bullish continuation pattern during uptrends
2. **Falling Three Methods**: Bearish continuation pattern during downtrends
3. **Tasuki Gaps**: Indicate temporary pullbacks before trend continuation
4. **Separating Lines**: Show decisive continuation after temporary opposition

## Nigerian Market Applications:
- **Financial Sector Focus**: These patterns work particularly well with Nigerian bank stocks like GTBank, Zenith, and Access Bank
- **Consumer Goods Timing**: Helpful for timing entries/exits in Nigerian consumer stocks like Nestle and Nigerian Breweries
- **Oil & Gas Precision**: Useful for trading volatile oil-related stocks like Seplat and Oando

## Confirmation Techniques:
- Always confirm candlestick signals with supporting indicators
- Look for volume confirmation with pattern completion
- Consider market context and sector trends specific to Nigeria
- Use multiple timeframe analysis for stronger signals`
          },
          {
            id: "c-a2-1-3",
            type: "quiz",
            title: "Advanced Chart Patterns Quiz",
            duration: "25 min",
            content: "Test your understanding of advanced chart patterns",
            quiz: [
              {
                id: "q-a2-1-1",
                question: "What defines a Gartley harmonic pattern?",
                options: [
                  "A simple head and shoulders formation",
                  "A pattern that uses specific Fibonacci retracement and extension levels",
                  "Any chart pattern that forms over exactly 22 days",
                  "A pattern only found in American markets"
                ],
                correctAnswer: 1,
                explanation: "A Gartley harmonic pattern is defined by specific Fibonacci retracement and extension levels between its points. It follows precise mathematical relationships, with point D typically at a .786 retracement of the XA leg."
              },
              {
                id: "q-a2-1-2",
                question: "How should complex chart patterns be adapted for the Nigerian stock market?",
                options: [
                  "They can't be used in Nigerian markets",
                  "They should be used exactly as in developed markets with no modifications",
                  "They should be adjusted for lower liquidity and combined with volume analysis",
                  "They only work on 5-minute charts in Nigerian markets"
                ],
                correctAnswer: 2,
                explanation: "When applying complex chart patterns to the Nigerian stock market, they should be adjusted for lower liquidity and combined with volume analysis for confirmation. Nigerian market-specific filters may also help reduce false signals in the local market context."
              },
              {
                id: "q-a2-1-3",
                question: "What is pattern stacking in technical analysis?",
                options: [
                  "Drawing multiple patterns on top of each other randomly",
                  "Using outdated chart patterns",
                  "Identifying multiple patterns that converge to the same conclusion",
                  "A pattern that forms only in bear markets"
                ],
                correctAnswer: 2,
                explanation: "Pattern stacking refers to identifying multiple patterns that converge to the same conclusion, creating a stronger signal. This technique is used by professional technical analysts to find high-probability trading opportunities with confluent pattern signals."
              }
            ]
          }
        ]
      },
      {
        id: "m-a2-2", 
        title: "Fibonacci Analysis and Wave Theory", 
        description: "Master Fibonacci tools and Elliott Wave theory for Nigerian markets",
        duration: "90 min", 
        isCompleted: false,
        order: 2,
        content: [
          {
            id: "c-a2-2-1",
            type: "video",
            title: "Fibonacci and Elliott Wave Applications",
            duration: "30 min",
            videoUrl: "https://www.youtube.com/embed/tWTxqfWhU5k?si=JI9pgGpwzjSWVRAm",
            content: "Learn how to apply Fibonacci tools and Elliott Wave theory to Nigerian stocks and forex pairs."
          },
          {
            id: "c-a2-2-2",
            type: "text",
            title: "Advanced Fibonacci and Wave Analysis",
            duration: "30 min",
            content: `# Advanced Fibonacci and Wave Analysis for Nigerian Markets

## Fibonacci Analysis Mastery
Fibonacci analysis is based on the mathematical sequence discovered by Leonardo Fibonacci. In trading, these ratios (primarily 23.6%, 38.2%, 50%, 61.8%, and 78.6%) help identify potential support/resistance levels and price targets.

## Advanced Fibonacci Applications:

### 1. Multiple Timeframe Fibonacci Analysis
- Identifying Fibonacci confluences across different timeframes
- Major timeframe levels have stronger influence on Nigerian stocks
- Creating Fibonacci confluence maps for key NGX stocks

### 2. Fibonacci Extensions for Price Targets
- Using 127.2%, 161.8%, 261.8% extensions for profit targets
- Extension clusters as strong reversal zones
- Nigerian case studies showing extension accuracy

### 3. Fibonacci Time Analysis
- Projecting potential reversal dates using Fibonacci time ratios
- Correlating with important Nigerian economic events
- Combining price and time Fibonacci for higher accuracy

### 4. Fibonacci Retracement Channels
- Drawing channels based on Fibonacci relationships
- Trading within the channel structure
- Applications to trending Nigerian blue-chip stocks

## Elliott Wave Theory for Nigerian Markets:

### 1. Elliott Wave Basics
- The 5-3 wave pattern structure
- Impulse and corrective waves
- Adapting wave counting to Nigerian market conditions

### 2. Wave Personality and Characteristics
- Identifying wave patterns by their unique characteristics
- Volume patterns associated with different waves
- Psychological market phases in the Nigerian context

### 3. Wave Counting Techniques
- Rules vs. guidelines in wave counting
- Common wave counting mistakes to avoid
- Starting with larger timeframes for Nigerian stocks

### 4. Nested Waves and Degrees
- Understanding wave degrees from Grand Supercycle to Minuette
- Practical wave counting at different degrees
- Finding trading opportunities within the wave structure

### 5. Combining Elliott Wave with Other Analysis
- Wave counts with Fibonacci retracements
- Using oscillators to confirm wave patterns
- Integration with fundamental analysis for Nigerian stocks

## Nigerian Market Applications:
- Case studies of Elliott Wave patterns in major NGX indices
- Wave analysis of USD/NGN forex pair
- Sector-specific wave characteristics in the Nigerian market
- Adjusting for Nigerian market anomalies and limitations`
          },
          {
            id: "c-a2-2-3",
            type: "quiz",
            title: "Fibonacci and Elliott Wave Quiz",
            duration: "30 min",
            content: "Test your understanding of Fibonacci analysis and Elliott Wave theory",
            quiz: [
              {
                id: "q-a2-2-1",
                question: "Which of these is NOT a primary Fibonacci retracement level used in technical analysis?",
                options: [
                  "38.2%",
                  "50%",
                  "61.8%",
                  "75%"
                ],
                correctAnswer: 3,
                explanation: "75% is not a primary Fibonacci retracement level used in technical analysis. The main Fibonacci retracement levels are 23.6%, 38.2%, 50% (not actually a Fibonacci number but commonly used), 61.8%, and 78.6%."
              },
              {
                id: "q-a2-2-2",
                question: "What is the basic structure of an Elliott Wave pattern?",
                options: [
                  "3 waves up, 5 waves down",
                  "5 waves in the direction of the main trend, 3 waves in the correction",
                  "8 waves in total, regardless of direction",
                  "2 impulse waves separated by 1 corrective wave"
                ],
                correctAnswer: 1,
                explanation: "The basic structure of an Elliott Wave pattern consists of 5 waves in the direction of the main trend (numbered 1-5), followed by 3 corrective waves in the opposite direction (labeled A-B-C). This 5-3 pattern is the foundation of Elliott Wave theory."
              },
              {
                id: "q-a2-2-3",
                question: "How should Fibonacci analysis be adapted for Nigerian markets?",
                options: [
                  "It cannot be used in Nigerian markets at all",
                  "Use only 50% retracement levels in Nigerian markets",
                  "Identify Fibonacci confluences across timeframes and correlate with Nigerian economic events",
                  "Use exactly the same approach as in American markets"
                ],
                correctAnswer: 2,
                explanation: "For Nigerian markets, Fibonacci analysis should be adapted by identifying Fibonacci confluences across different timeframes and correlating them with important Nigerian economic events. This approach recognizes the unique characteristics of the Nigerian market while applying universal Fibonacci principles."
              }
            ]
          }
        ]
      }
    ],
    skills: [
      "Advanced patterns", 
      "Fibonacci analysis", 
      "Elliott Wave theory", 
      "Volume analysis"
    ],
    prerequisites: [
      {
        id: "pre-a2-1",
        title: "Technical analysis experience required",
        description: "You should already be familiar with basic technical analysis concepts and chart patterns."
      }
    ],
    reviews: [],
    price: 39999,
    discountPrice: 34999,
    isFeatured: false,
    averageRating: 4.8,
    totalStudents: 142,
    certificationIncluded: true
  },
  
  // 💡 FINANCIAL SENSE / PERSONAL GROWTH COURSES
  {
    id: "course-f1",
    title: "Get Your Bag: Side Hustles & Online Income in Nigeria",
    subtitle: "Practical strategies to build multiple income streams",
    category: "Financial Growth",
    subcategory: "Personal Development",
    description: "Discover practical, legitimate ways to create additional income streams in Nigeria through side hustles, online work, and passive income opportunities.",
    longDescription: `
This practical course shows Nigerians how to build multiple income streams beyond a traditional 9-5 job. You'll learn about realistic, legitimate side hustles and online opportunities that work in the Nigerian context, with step-by-step guidance to get started.

### What You'll Learn:
- Discover 15+ proven side hustle options that work for Nigerians
- Learn how to monetize your existing skills in the digital economy
- Build passive income streams through various investment vehicles
- Understand how to balance your time between multiple income sources
- Master the legal and tax considerations for multiple income streams

### Course Features:
- 7 modules with over 5 hours of practical video content
- Side hustle evaluation framework and planning templates
- Step-by-step guides for setting up online income streams
- Real success stories from Nigerian side hustlers
- Certificate of completion

This course bridges the gap between financial education and practical income generation, focusing on opportunities that are accessible to Nigerians regardless of location.
    `,
    tags: ["Side Hustles", "Multiple Income", "Online Business", "Passive Income"],
    estimatedHours: 5,
    difficulty: "beginner",
    icon: "Briefcase",
    coverImage: "/courses/side-hustles.jpg",
    instructor: instructors[0],
    lastUpdated: "May 2, 2024",
    createdAt: "February 1, 2024",
    language: "English",
    modules: [
      { 
        id: "m-f1-1", 
        title: "The Multiple Income Mindset", 
        description: "Why relying on one income source is risky in today's Nigerian economy",
        duration: "45 min", 
        isCompleted: false,
        order: 1,
        content: [
          {
            id: "c-f1-1-1",
            type: "video",
            title: "Why You Need Multiple Income Streams in Nigeria",
            duration: "15 min",
            videoUrl: "https://www.youtube.com/embed/lZovQ9_oWXs?si=Lyn4fQe2uSogQtvp",
            content: "Learn why relying on a single income source is increasingly risky in the Nigerian economy."
          },
          {
            id: "c-f1-1-2",
            type: "text",
            title: "Nigerian Side Hustle Landscape",
            duration: "20 min",
            content: `# Nigerian Side Hustle Landscape

## The Rise of Side Hustles in Nigeria
In today's Nigerian economy, having multiple income streams isn't just smart—it's becoming necessary. A side hustle can provide financial stability, help build wealth, and even develop into a full-time business.

## Why Side Hustles Are Booming in Nigeria:
1. **Economic Necessity**: Inflation and cost of living pressures
2. **Technological Access**: Widespread smartphone and internet adoption
3. **Gig Economy Growth**: Platforms connecting freelancers with clients
4. **Reduced Barriers**: Lower startup costs for many digital businesses
5. **Success Stories**: Visible examples of successful entrepreneurs

## Most Viable Side Hustles for Nigerians in 2024:
1. **Digital Skills Marketing**:
   - Content writing
   - Graphic design
   - Web development
   - Social media management
   - Virtual assistance

2. **E-commerce Opportunities**:
   - Dropshipping Nigerian products
   - Print-on-demand services
   - Handmade crafts and cultural items
   - Food production and delivery

3. **Knowledge Monetization**:
   - Online courses in your area of expertise
   - E-books and digital products
   - Consulting and coaching
   - Tutoring (academic or skills-based)

4. **Tech-Based Services**:
   - App development
   - Software-as-a-Service (SaaS)
   - Tech support and troubleshooting
   - Data analysis and research

5. **Creative Industries**:
   - Photography and videography
   - Music production
   - Animation and illustration
   - Voiceover work

## Evaluating Side Hustle Potential:
- **Skill-Market Alignment**: Match your skills with market demand
- **Time Commitment**: Realistic hours alongside primary job
- **Startup Costs**: Initial investment required
- **Scalability**: Potential for growth beyond solo operation
- **Passion Factor**: Sustainability based on your interest`
          },
          {
            id: "c-f1-1-3",
            type: "quiz",
            title: "Multiple Income Mindset Quiz",
            duration: "15 min",
            content: "Test your understanding of the multiple income mindset",
            quiz: [
              {
                id: "q-f1-1-1",
                question: "Why is having multiple income streams particularly important in Nigeria?",
                options: [
                  "Because Nigerian law requires citizens to have multiple jobs",
                  "Because Nigerians don't need to save money",
                  "Because of economic factors like high inflation, currency fluctuations, and job insecurity",
                  "Because it's easier to get multiple jobs in Nigeria than in other countries"
                ],
                correctAnswer: 2,
                explanation: "Having multiple income streams is particularly important in Nigeria due to economic factors including high inflation (often over 20%), currency fluctuations affecting the Naira's value, limited salary growth compared to rising costs, and general job insecurity in many sectors."
              },
              {
                id: "q-f1-1-2",
                question: "Which of these is NOT considered a type of income in the multiple income spectrum?",
                options: [
                  "Active income",
                  "Semi-passive income",
                  "Lottery income",
                  "Portfolio income"
                ],
                correctAnswer: 2,
                explanation: "Lottery income is not considered a legitimate category in the multiple income spectrum. The main types are active income (trading time for money), semi-passive income (requiring some ongoing effort), passive income (minimal time investment after setup), and portfolio income (from investments)."
              },
              {
                id: "q-f1-1-3",
                question: "What mindset shift is most important when developing multiple income streams?",
                options: [
                  "Believing that get-rich-quick schemes are the best approach",
                  "Shifting from employee thinking to entrepreneurial thinking",
                  "Assuming you need to quit your main job immediately",
                  "Focusing only on passive income options"
                ],
                correctAnswer: 1,
                explanation: "The most important mindset shift when developing multiple income streams is moving from employee thinking to entrepreneurial thinking. This involves viewing your skills as monetizable assets, recognizing opportunities in problems, becoming comfortable with calculated risks, and prioritizing long-term growth over immediate gains."
              }
            ]
          }
        ]
      },
      {
        id: "m-f1-2", 
        title: "Digital Side Hustles for Nigerians", 
        description: "Explore online income opportunities that work well in the Nigerian context",
        duration: "60 min", 
        isCompleted: false,
        order: 2,
        content: [
          {
            id: "c-f1-2-1",
            type: "video",
            title: "Top Digital Side Hustles for Nigerians",
            duration: "20 min",
            videoUrl: "https://www.youtube.com/embed/UBIIr30jSi4?si=f6bfEkSM-CXOijXw",
            content: "Discover the most accessible and profitable online income opportunities for Nigerians."
          },
          {
            id: "c-f1-2-2",
            type: "text",
            title: "Digital Side Hustles That Work in Nigeria",
            duration: "20 min",
            content: `# Digital Side Hustles That Work in Nigeria

## Online Income Opportunities for Nigerians
The digital economy has opened up numerous opportunities for Nigerians to earn additional income online. These digital side hustles are particularly valuable because they often require minimal startup capital, can be done from anywhere with internet access, and have global earning potential.

## Top Digital Side Hustles for Nigerians:

### 1. Freelance Services
- **Content Writing**: Blog posts, articles, website copy for businesses
- **Virtual Assistance**: Administrative support for global clients
- **Social Media Management**: Running accounts for businesses
- **Graphic Design**: Creating logos, social media graphics, marketing materials
- **Web Development**: Building websites for local and international clients
- **Translation Services**: English-Yoruba, English-Igbo, English-Hausa translations
- **Nigerian Platforms**: Fiverr, Upwork, Workchop, Selar

### 2. Digital Product Creation
- **E-books**: Self-publishing guides on Nigerian-specific topics
- **Online Courses**: Teaching skills in your area of expertise
- **Templates & Printables**: Creating resources others can purchase and use
- **Stock Photos**: Capturing authentic Nigerian imagery for global usage
- **Mobile Apps**: Developing solutions for local problems
- **Nigerian Platforms**: Selar, Paystack Storefront, Flutterwave Store

### 3. Content Creation & Monetization
- **YouTube Channels**: Creating Nigerian-focused content
- **Blogging**: Niche websites monetized with AdSense and affiliate marketing
- **Podcasting**: Audio content with sponsorships
- **Instagram/TikTok**: Building audiences and partnering with brands
- **Nigerian Considerations**: Local content performs well, payment challenges

### 4. Online Trading & Investments
- **Stock Trading**: Nigerian Exchange Group (NGX) investing
- **Forex Trading**: Currency trading (with proper education)
- **Cryptocurrency**: Trading and staking digital assets
- **Nigerian Platforms**: Bamboo, Trove, Risevest, Piggyvest, Buycoins

### 5. E-commerce & Dropshipping
- **Online Stores**: Selling physical products online
- **Print-on-Demand**: Custom merchandise without inventory
- **Dropshipping**: Selling products without handling inventory
- **Nigerian Platforms**: Jumia, Konga, Instagram shops, WhatsApp Business

## Getting Started Successfully:
- **Skills Assessment**: Identify your existing marketable skills
- **Market Research**: Understand demand for your service/product
- **Platform Selection**: Choose the right platforms for your offering
- **Initial Investment**: Understand startup costs (often minimal)
- **Time Commitment**: Realistic planning of your available hours
- **Payment Solutions**: Setting up reliable payment methods

## Overcoming Nigerian-Specific Challenges:
- **Internet Reliability**: Backup solutions for power and connectivity
- **Payment Processing**: Navigating international payment options
- **Trust Building**: Establishing credibility with global clients
- **Exchange Rates**: Managing currency conversion considerations
- **Standing Out**: Differentiating yourself in competitive markets`
          },
          {
            id: "c-f1-2-3",
            type: "quiz",
            title: "Digital Side Hustles Quiz",
            duration: "20 min",
            content: "Test your understanding of digital side hustles for Nigerians",
            quiz: [
              {
                id: "q-f1-2-1",
                question: "Which of these platforms is specifically Nigerian-focused for selling digital products?",
                options: [
                  "Amazon",
                  "Etsy",
                  "Selar",
                  "eBay"
                ],
                correctAnswer: 2,
                explanation: "Selar is a Nigerian-focused platform specifically designed for selling digital products like ebooks, courses, and other digital content. It's optimized for Nigerian creators with local payment integration and understanding of the Nigerian market."
              },
              {
                id: "q-f1-2-2",
                question: "What is a key advantage of digital side hustles for Nigerians?",
                options: [
                  "They always pay in dollars",
                  "They require minimal startup capital and can be done from anywhere with internet",
                  "They have no competition",
                  "The Nigerian government provides grants for all digital entrepreneurs"
                ],
                correctAnswer: 1,
                explanation: "A key advantage of digital side hustles for Nigerians is that they typically require minimal startup capital and can be done from anywhere with internet access. This low barrier to entry makes them accessible to many Nigerians despite economic challenges."
              },
              {
                id: "q-f1-2-3",
                question: "Which Nigerian-specific challenge do digital entrepreneurs commonly face?",
                options: [
                  "Too much demand for their services",
                  "Internet reliability and payment processing issues",
                  "Government restrictions on all online businesses",
                  "Inability to access international platforms"
                ],
                correctAnswer: 1,
                explanation: "Nigerian digital entrepreneurs commonly face challenges related to internet reliability (including power outages) and payment processing issues. International payment platforms sometimes have restrictions or complications for Nigerian users, and reliable internet connectivity can be challenging in some areas."
              }
            ]
          }
        ]
      }
    ],
    skills: [
      "Income diversification", 
      "Online business", 
      "Passive income", 
      "Time management"
    ],
    prerequisites: [
      {
        id: "pre-f1-1",
        title: "No special prerequisites",
        description: "This course is designed for anyone looking to increase their income."
      }
    ],
    reviews: [],
    price: 17999,
    discountPrice: 14999,
    isFeatured: true,
    averageRating: 4.8,
    totalStudents: 768,
    certificationIncluded: true
  },
  {
    id: "course-f2",
    title: "How to Spot & Avoid Scammy Investments in Nigeria",
    subtitle: "Protect yourself from financial fraud and investment scams",
    category: "Financial Protection",
    subcategory: "Risk Management",
    description: "Learn to identify and avoid investment scams, Ponzi schemes, and fraudulent financial opportunities common in the Nigerian market.",
    longDescription: `
This essential course teaches Nigerians how to protect themselves from the growing number of investment scams and financial fraud schemes. You'll learn the warning signs of fraudulent opportunities and develop a framework for evaluating any investment before committing your money.

### What You'll Learn:
- Identify the common red flags of investment scams in Nigeria
- Understand the mechanics of Ponzi schemes and why they always collapse
- Learn how to verify the legitimacy of investment companies and opportunities
- Develop a framework for evaluating any investment opportunity
- Know what to do if you've already fallen victim to financial fraud

### Course Features:
- 6 modules with over 4 hours of practical content
- Investment verification checklist and evaluation tools
- Case studies of major Nigerian investment scams
- Interviews with fraud prevention experts and scam survivors
- Certificate of completion

This course is essential for any Nigerian who wants to invest safely in an environment where fraudulent schemes have become increasingly sophisticated.
    `,
    tags: ["Scam Prevention", "Investment Safety", "Financial Protection", "Fraud Awareness"],
    estimatedHours: 4,
    difficulty: "beginner",
    icon: "Shield",
    coverImage: "/courses/scam-prevention.jpg",
    instructor: instructors[3],
    lastUpdated: "April 25, 2024",
    createdAt: "March 1, 2024",
    language: "English",
    modules: [
      { 
        id: "m-f2-1", 
        title: "The Landscape of Financial Fraud in Nigeria", 
        description: "Understanding the scope and types of investment scams in Nigeria",
        duration: "45 min", 
        isCompleted: false,
        order: 1,
        content: [
          {
            id: "c-f2-1-1",
            type: "video",
            title: "The State of Financial Fraud in Nigeria",
            duration: "15 min",
            videoUrl: "https://www.youtube.com/embed/oCJG45OJJXk?si=CdweI9TMtT20cT5U",
            content: "An overview of common investment scams and financial fraud schemes in Nigeria."
          },
          {
            id: "c-f2-1-2",
            type: "text",
            title: "Common Investment Scams in Nigeria",
            duration: "25 min",
            content: `# Common Investment Scams in Nigeria

## The Scam Landscape in Nigeria
Investment scams have unfortunately become prevalent in Nigeria, costing investors billions of naira annually. Learning to identify these schemes is crucial for protecting your financial future.

## Most Common Investment Scams in Nigeria:

### 1. Ponzi and Pyramid Schemes
- **How They Work**: Promise high returns paid from new investor funds rather than legitimate profits
- **Red Flags**: Guaranteed returns, pressure to recruit others, mysterious investment strategies
- **Famous Examples**: MMM, Loom, MBA Trading, Imagine Global
- **Protection Tip**: Remember that sustainable investments cannot consistently pay 10%+ monthly returns

### 2. Fake Forex Trading Platforms
- **How They Work**: Claim to trade foreign exchange with "proprietary systems" guaranteeing profits
- **Red Flags**: Unregistered platforms, offshore operations, too-good-to-be-true returns
- **Protection Tip**: Only use forex brokers regulated by the SEC or with international regulation

### 3. Cryptocurrency Scams
- **How They Work**: False crypto investment opportunities, pump-and-dump schemes, fake exchanges
- **Red Flags**: New/unknown coins, promises of guaranteed returns, heavy marketing without clear technology
- **Protection Tip**: Research thoroughly, stick to established cryptocurrencies and exchanges

### 4. Real Estate Investment Fraud
- **How They Work**: Selling nonexistent properties or collecting multiple payments for the same property
- **Red Flags**: No site visits allowed, pressure to pay quickly, lack of proper documentation
- **Protection Tip**: Always verify land titles with government registries and physically inspect properties

### 5. "Double Your Money" Schemes
- **How They Work**: Promise to multiply your investment in a short time through secret methods
- **Red Flags**: Vague explanations about investment methods, claims of inside connections
- **Protection Tip**: Understand that legitimate wealth building takes time; quick doubling is almost always fraudulent

## Warning Signs of Investment Scams:
1. **Guaranteed Returns**: No legitimate investment can guarantee specific returns
2. **Pressure Tactics**: Being rushed to invest before "opportunity closes"
3. **Exclusive Opportunity**: Claims that you're specially selected or it's limited to a few people
4. **Complicated or Secret**: Investment strategies that can't be clearly explained
5. **Difficulty Withdrawing**: Problems, delays or fees when trying to access your money
6. **Unregistered Investments**: Not registered with SEC or other appropriate regulators`
          },
          {
            id: "c-f2-1-3",
            type: "quiz",
            title: "Financial Fraud Awareness Quiz",
            duration: "15 min",
            content: "Test your understanding of investment scams in Nigeria",
            quiz: [
              {
                id: "q-f2-1-1",
                question: "Why do Ponzi schemes always eventually collapse?",
                options: [
                  "Because the government always shuts them down quickly",
                  "Because they're mathematically unsustainable when new recruitment slows",
                  "Because they only target wealthy individuals",
                  "Because banks refuse to work with them"
                ],
                correctAnswer: 1,
                explanation: "Ponzi schemes always eventually collapse because they are mathematically unsustainable. They use new investor funds to pay returns to existing investors rather than generating legitimate profits. When recruitment of new investors inevitably slows down, there isn't enough money to pay promised returns, leading to collapse."
              },
              {
                id: "q-f2-1-2",
                question: "What is 'affinity fraud' in the Nigerian context?",
                options: [
                  "Scams that only target family members",
                  "Fraud that uses romantic relationships",
                  "Scams targeting specific communities using trusted insiders",
                  "Scams that only occur in rural areas"
                ],
                correctAnswer: 2,
                explanation: "Affinity fraud in the Nigerian context refers to scams that target specific communities (religious, ethnic, professional) using trusted insiders. These schemes often spread through church networks, alumni associations, or community groups, exploiting existing trust relationships to appear legitimate."
              },
              {
                id: "q-f2-1-3",
                question: "Which of these is NOT a common red flag for investment scams in Nigeria?",
                options: [
                  "Guaranteed unusually high returns (like 40%+ monthly)",
                  "Pressure to recruit others or invest quickly",
                  "Detailed documentation and transparent business operations",
                  "Requests for direct transfers to personal accounts"
                ],
                correctAnswer: 2,
                explanation: "Detailed documentation and transparent business operations are NOT red flags for investment scams - in fact, they're signs of legitimate investments. Common red flags include guaranteed unusually high returns, pressure tactics, unclear business models, and requests for direct transfers to personal accounts rather than corporate accounts."
              }
            ]
          }
        ]
      },
      {
        id: "m-f2-2", 
        title: "Red Flags and Warning Signs", 
        description: "Learn to identify the warning signs of fraudulent investment schemes",
        duration: "60 min", 
        isCompleted: false,
        order: 2,
        content: [
          {
            id: "c-f2-2-1",
            type: "video",
            title: "Investment Scam Red Flags",
            duration: "20 min",
            videoUrl: "https://www.youtube.com/embed/xPCrGLFYMmo?si=l2vbh7X2QxgHKJ0h",
            content: "Learn the key warning signs that an investment opportunity might be fraudulent."
          },
          {
            id: "c-f2-2-2",
            type: "text",
            title: "The Major Red Flags of Financial Scams",
            duration: "20 min",
            content: `# The Major Red Flags of Financial Scams

## Developing Your Scam Detection Skills
Learning to spot the warning signs of investment scams is a critical financial skill for Nigerians. These red flags appear consistently across different types of financial fraud and can help you identify potential scams before losing your money.

## Universal Red Flags for Investment Scams:

### 1. Promises of Guaranteed High Returns
- **The Promise**: Guaranteed returns of 10%+ monthly or 50%+ annually
- **The Reality**: All investments involve risk; guaranteed high returns are impossible
- **Examples**: "Guaranteed 15% monthly returns on forex trading"
- **Legitimate Alternative**: Realistic returns vary by investment type (stocks: 10-15% annually)

### 2. Pressure Tactics and Artificial Urgency
- **The Tactics**: Limited time offers, "only 5 spots left," countdown timers
- **The Psychology**: Creating FOMO (fear of missing out) to bypass rational thinking
- **Examples**: "Offer closes tonight," "Price increases tomorrow"
- **Protection Strategy**: Any legitimate investment will give you time to research

### 3. Unclear or Complicated Business Models
- **The Approach**: Vague explanations, excessive jargon, "proprietary systems"
- **The Reality**: If you can't clearly understand how it makes money, it's likely a scam
- **Examples**: "Our AI trading algorithm guarantees profits"
- **Protection Strategy**: If they can't explain it simply, walk away

### 4. Unregistered/Unregulated Investments
- **The Issue**: Operating without proper licensing or regulatory oversight
- **How to Check**: Verify with SEC Nigeria, CBN, or relevant regulatory bodies
- **Examples**: Unregistered investment companies, unauthorized forex platforms
- **Protection Strategy**: Only invest with properly registered entities

### 5. Poor or Non-Existent Documentation
- **The Red Flag**: No proper prospectus, contract, or terms and conditions
- **The Excuse**: "We're a new company," "Our lawyers are finalizing the documents"
- **What to Demand**: Proper investment documentation, audited financial statements
- **Protection Strategy**: No documentation = no investment

### 6. Unsolicited Investment Offers
- **The Approach**: Cold calls, random WhatsApp messages, unsolicited emails
- **The Psychology**: Creating artificial familiarity and trust
- **Examples**: "I found you through a mutual friend," "I'm contacting selected individuals"
- **Protection Strategy**: Be extremely cautious of any investment you didn't seek out

### 7. Request for Direct Transfers to Personal Accounts
- **The Red Flag**: Asking for payments to personal accounts rather than business accounts
- **The Excuse**: "For faster processing," "Our company account is being updated"
- **Protection Strategy**: Only transfer to properly verified corporate accounts

### 8. Lack of Physical Address or False Credentials
- **The Issue**: Virtual-only presence, fake office addresses, unverifiable credentials
- **How to Check**: Physical verification, credential checking with claimed institutions
- **Examples**: False claims of Harvard degrees, non-existent office locations
- **Protection Strategy**: Verify all claimed credentials and physical locations

## Psychological Manipulation Tactics:
- **Social Proof**: Showing testimonials (often fake) from "successful" investors
- **Authority Exploitation**: Claiming endorsements from respected figures or institutions
- **Scarcity**: Creating false impression of limited availability
- **Reciprocity**: Offering small gifts or "free training" to create obligation

## When Multiple Red Flags Appear:
Remember that most scams will display several of these warning signs simultaneously. The more red flags you spot, the more likely the "opportunity" is fraudulent.`
          },
          {
            id: "c-f2-2-3",
            type: "quiz",
            title: "Red Flags Quiz",
            duration: "20 min",
            content: "Test your ability to identify investment scam warning signs",
            quiz: [
              {
                id: "q-f2-2-1",
                question: "Which return claim is MOST likely to indicate a scam?",
                options: [
                  "7-10% annual returns on a diversified stock portfolio",
                  "2-3% annual interest on a fixed deposit",
                  "Guaranteed 20% monthly returns on forex trading",
                  "Variable 8-12% annual yield on corporate bonds"
                ],
                correctAnswer: 2,
                explanation: "Guaranteed 20% monthly returns on forex trading is the most obvious scam signal. This would translate to over 790% annual returns, which is unrealistic and impossible to guarantee. Legitimate investments typically offer more modest returns with clear disclosure of risks."
              },
              {
                id: "q-f2-2-2",
                question: "What should you do if an investment company asks you to transfer funds to a personal account?",
                options: [
                  "Transfer a small amount first to test if it's legitimate",
                  "Ask for a discount if you transfer immediately",
                  "Transfer the money if they promise higher returns",
                  "Consider it a major red flag and decline to invest"
                ],
                correctAnswer: 3,
                explanation: "You should consider it a major red flag and decline to invest if an investment company asks you to transfer funds to a personal account. Legitimate investment companies use proper corporate accounts for client funds, with appropriate documentation and receipts."
              },
              {
                id: "q-f2-2-3",
                question: "Which statement about investment documentation is TRUE?",
                options: [
                  "Documentation isn't necessary for small investments",
                  "Verbal agreements are sufficient if you trust the person",
                  "Proper documentation is essential for any legitimate investment",
                  "New companies don't need documentation when starting out"
                ],
                correctAnswer: 2,
                explanation: "Proper documentation is essential for any legitimate investment, regardless of size or company age. Legitimate investments always provide clear documentation including terms and conditions, risk disclosures, and receipts for funds. The absence of proper documentation is a major red flag."
              }
            ]
          }
        ]
      }
    ],
    skills: [
      "Scam identification", 
      "Due diligence", 
      "Investment verification", 
      "Risk assessment"
    ],
    prerequisites: [
      {
        id: "pre-f2-1",
        title: "No special prerequisites",
        description: "This course is designed for anyone who wants to protect their finances."
      }
    ],
    reviews: [],
    price: 14999,
    discountPrice: 11999,
    isFeatured: false,
    averageRating: 4.9,
    totalStudents: 892,
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