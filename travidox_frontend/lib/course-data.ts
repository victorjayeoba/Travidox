// Course data types
export interface Instructor {
  name: string;
  title: string;
  avatar: string;
}

export interface ModuleContent {
  id: string;
  type: 'video' | 'text' | 'quiz';
  title: string;
  duration: string;
  content: string;
  videoUrl?: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface Module {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  content: ModuleContent[];
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  estimatedHours: number;
  icon: string;
  instructor: Instructor;
  lastUpdated: string;
  modules: Module[];
  skills: string[];
}

// Course data
export const coursesData: Course[] = [
  {
    id: "course-1",
    title: "Stock Market Fundamentals",
    category: "Market Education",
    description: "Master the essential concepts and terminology that every stock market investor needs to understand before trading.",
    tags: ["Market Basics", "Trading Fundamentals", "Investment Strategy"],
    estimatedHours: 4,
    icon: "BookText",
    instructor: {
      name: "John Thompson",
      title: "Market Education Expert",
      avatar: "/instructors/john.jpg"
    },
    lastUpdated: "March 2024",
    modules: [
      { 
        id: "m1-1", 
        title: "Introduction to Stock Market", 
        duration: "45 min", 
        isCompleted: false,
        content: [
          {
            id: "c1-1",
            type: "video",
            title: "What is the Stock Market?",
            duration: "15 min",
            videoUrl: "https://example.com/video1.mp4",
            content: "An introduction to the stock market and its role in the global economy."
          },
          {
            id: "c1-2",
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
- Stock prices reflect company performance and market sentiment

### Market Indices
Market indices track overall market performance:
- S&P 500: 500 largest US companies
- Dow Jones: 30 major US companies
- NASDAQ: Technology-focused companies
- Russell 2000: Small-cap companies

### Market Participants
1. Individual Investors
   - Retail traders
   - Long-term investors
   - Day traders

2. Institutional Investors
   - Mutual funds
   - Pension funds
   - Hedge funds
   - Insurance companies

3. Market Makers
   - Provide liquidity
   - Maintain orderly markets
   - Profit from bid-ask spreads

## How the Market Works

### Trading Hours
- Regular trading: 9:30 AM - 4:00 PM EST
- Pre-market: 4:00 AM - 9:30 AM EST
- After-hours: 4:00 PM - 8:00 PM EST

### Price Discovery
- Bid: Highest price buyers are willing to pay
- Ask: Lowest price sellers are willing to accept
- Spread: Difference between bid and ask prices

### Market Orders
1. Market Orders
   - Execute immediately at current price
   - No price guarantee
   - Best for liquid stocks

2. Limit Orders
   - Execute at specified price or better
   - Price protection
   - May not execute if price doesn't reach limit

## Market Analysis

### Fundamental Analysis
- Company financials
- Business model
- Industry trends
- Management team

### Technical Analysis
- Price patterns
- Trading volume
- Technical indicators
- Support/resistance levels

## Getting Started

### Steps to Begin Trading
1. Open a brokerage account
2. Fund your account
3. Research stocks
4. Place your first trade
5. Monitor your positions

### Important Considerations
- Start with paper trading
- Understand your risk tolerance
- Diversify your portfolio
- Keep learning and adapting

## Common Terms

### Basic Terms
- Bull Market: Rising market
- Bear Market: Falling market
- Dividend: Company profit sharing
- IPO: Initial Public Offering
- Volume: Number of shares traded

### Advanced Terms
- P/E Ratio: Price to Earnings
- Market Cap: Company value
- Beta: Stock volatility
- EPS: Earnings Per Share
- ROI: Return on Investment`
          },
          {
            id: "c1-3",
            type: "quiz",
            title: "Market Basics Quiz",
            duration: "15 min",
            content: "Test your understanding of stock market fundamentals",
            quiz: [
              {
                question: "What does owning a share of stock represent?",
                options: [
                  "A loan to the company",
                  "Ownership in the company",
                  "A fixed interest payment",
                  "A government bond"
                ],
                correctAnswer: 1
              }
            ]
          }
        ]
      },
      { 
        id: "m1-2", 
        title: "Market Participants", 
        duration: "45 min", 
        isCompleted: false,
        content: [
          {
            id: "c2-1",
            type: "video",
            title: "Who Trades in the Market?",
            duration: "15 min",
            videoUrl: "https://example.com/video2.mp4",
            content: "Learn about different types of market participants and their roles."
          },
          {
            id: "c2-2",
            type: "text",
            title: "Types of Market Participants",
            duration: "15 min",
            content: `# Market Participants Guide

## Individual Investors

### Retail Traders
- Individual investors trading for personal accounts
- Typically trade smaller positions
- May use online brokerage platforms
- Often focus on long-term investing

### Day Traders
- Trade multiple times per day
- Close all positions by end of day
- Use technical analysis
- Require significant capital

### Long-term Investors
- Buy and hold strategy
- Focus on fundamental analysis
- Less frequent trading
- Dividend-focused approach

## Institutional Investors

### Mutual Funds
- Pool money from multiple investors
- Professional management
- Diversified portfolios
- Various investment strategies

### Pension Funds
- Manage retirement assets
- Long-term investment focus
- Conservative approach
- Regular income generation

### Hedge Funds
- Sophisticated investment strategies
- Higher risk tolerance
- Use of leverage
- Alternative investments

### Insurance Companies
- Manage policyholder funds
- Balance risk and return
- Long-term investment horizon
- Regulatory requirements

## Market Makers

### Role and Responsibilities
- Provide liquidity
- Maintain orderly markets
- Reduce bid-ask spreads
- Execute trades efficiently

### Trading Strategies
- Inventory management
- Risk management
- Arbitrage opportunities
- Market making algorithms

## Brokers

### Full-Service Brokers
- Personalized investment advice
- Research and analysis
- Portfolio management
- Higher fees

### Discount Brokers
- Self-directed trading
- Lower fees
- Online platforms
- Basic research tools

## Regulators

### SEC (Securities and Exchange Commission)
- Enforce securities laws
- Protect investors
- Maintain fair markets
- Require company disclosures

### FINRA (Financial Industry Regulatory Authority)
- Regulate broker-dealers
- Protect investors
- Ensure market integrity
- Enforce trading rules

## Market Impact

### Liquidity Providers
- Market makers
- High-frequency traders
- Arbitrage traders
- Market participants

### Price Discovery
- Supply and demand
- Market efficiency
- Price transparency
- Fair value determination

## Trading Strategies

### Common Approaches
1. Value Investing
   - Find undervalued stocks
   - Long-term holding
   - Fundamental analysis
   - Margin of safety

2. Growth Investing
   - High-growth companies
   - Future potential
   - Higher risk
   - Capital appreciation

3. Technical Trading
   - Price patterns
   - Technical indicators
   - Short-term focus
   - Market timing

## Risk Management

### Key Considerations
- Position sizing
- Stop-loss orders
- Portfolio diversification
- Risk-reward ratio

### Best Practices
1. Set clear objectives
2. Define risk tolerance
3. Use proper position sizing
4. Monitor positions regularly
5. Review and adjust strategy`
          },
          {
            id: "c2-3",
            type: "quiz",
            title: "Market Participants Quiz",
            duration: "15 min",
            content: "Test your knowledge of market participants",
            quiz: [
              {
                question: "Which participant is responsible for providing liquidity in the market?",
                options: [
                  "Retail investors",
                  "Market makers",
                  "Regulators",
                  "Brokers"
                ],
                correctAnswer: 1
              }
            ]
          }
        ]
      }
    ],
    skills: ["Market Basics", "Order Types", "Market Analysis", "Trading Fundamentals"]
  }
];

// Helper function to get course by ID
export const getCourseById = (id: string): Course | undefined => {
  return coursesData.find(course => course.id === id);
};

// Helper function to get all courses
export const getAllCourses = (): Course[] => {
  return coursesData;
}; 