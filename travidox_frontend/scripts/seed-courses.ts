/**
 * NOTE: This script is no longer necessary as the application now uses mock data
 * directly in the certifications page. User progress is still stored in Firebase,
 * but course definitions are defined in the page component itself.
 * 
 * This file is kept for reference purposes only.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import app from '../lib/firebase'; // Import the firebase app instance directly

// Initialize Firestore
const db = getFirestore(app);

// Sample course data to seed
const coursesData = [
  {
    id: "course-1",
    title: "Stock Market Terminology",
    category: "Market Education",
    description: "Master the essential vocabulary and concepts that every stock market investor needs to understand before trading.",
    tags: ["Market Vocabulary", "Financial Terms", "Trading Jargon"],
    estimatedHours: 3,
    icon: "BookText",
    prerequisites: ["No prior experience required"],
    learningObjectives: [
      "Understand key financial terms and market concepts",
      "Learn to read and interpret market data",
      "Master order types and their applications",
      "Grasp fundamental financial statement analysis"
    ],
    modules: [
      { 
        id: "m1-1", 
        title: "Basic Market Terminology", 
        duration: "30 min", 
        isCompleted: false,
        content: {
          topics: [
            "Market Basics: Bull vs Bear Markets",
            "Understanding Market Indices",
            "Key Financial Ratios",
            "Common Trading Terms"
          ],
          resources: [
            "Interactive Glossary",
            "Practice Quiz",
            "Market Terms Cheat Sheet"
          ]
        }
      },
      { 
        id: "m1-2", 
        title: "Order Types Explained", 
        duration: "45 min", 
        isCompleted: false,
        content: {
          topics: [
            "Market Orders",
            "Limit Orders",
            "Stop Orders",
            "Trailing Stops"
          ],
          resources: [
            "Order Type Comparison Chart",
            "Interactive Order Simulator",
            "Order Type Quiz"
          ]
        }
      },
      { 
        id: "m1-3", 
        title: "Understanding Financial Statements", 
        duration: "60 min", 
        isCompleted: false,
        content: {
          topics: [
            "Balance Sheet Analysis",
            "Income Statement Components",
            "Cash Flow Statement",
            "Key Financial Metrics"
          ],
          resources: [
            "Sample Financial Statements",
            "Financial Analysis Tools",
            "Case Study: Apple Inc."
          ]
        }
      },
      { 
        id: "m1-4", 
        title: "Market Indicators Overview", 
        duration: "45 min", 
        isCompleted: false,
        content: {
          topics: [
            "Technical Indicators",
            "Volume Analysis",
            "Market Breadth Indicators",
            "Sentiment Indicators"
          ],
          resources: [
            "Indicator Reference Guide",
            "Real-time Market Data",
            "Indicator Strategy Examples"
          ]
        }
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
    prerequisites: ["Basic understanding of price charts", "Familiarity with market terminology"],
    learningObjectives: [
      "Identify key candlestick patterns",
      "Understand pattern psychology",
      "Apply patterns in trading decisions",
      "Combine patterns with other technical indicators"
    ],
    modules: [
      { 
        id: "m2-1", 
        title: "Candlestick Basics", 
        duration: "40 min", 
        isCompleted: false,
        content: {
          topics: [
            "Candlestick Anatomy",
            "Bullish vs Bearish Candles",
            "Doji Patterns",
            "Spinning Tops"
          ],
          resources: [
            "Interactive Candlestick Builder",
            "Pattern Recognition Game",
            "Basic Pattern Quiz"
          ]
        }
      },
      { 
        id: "m2-2", 
        title: "Single Candlestick Patterns", 
        duration: "60 min", 
        isCompleted: false,
        content: {
          topics: [
            "Hammer and Hanging Man",
            "Shooting Star",
            "Inverted Hammer",
            "Engulfing Patterns"
          ],
          resources: [
            "Pattern Recognition Exercises",
            "Real Chart Examples",
            "Pattern Trading Simulator"
          ]
        }
      },
      { 
        id: "m2-3", 
        title: "Double Candlestick Patterns", 
        duration: "60 min", 
        isCompleted: false,
        content: {
          topics: [
            "Harami Patterns",
            "Dark Cloud Cover",
            "Piercing Pattern",
            "Morning and Evening Stars"
          ],
          resources: [
            "Advanced Pattern Guide",
            "Pattern Confirmation Tools",
            "Case Studies"
          ]
        }
      },
      { 
        id: "m2-4", 
        title: "Triple Candlestick Patterns", 
        duration: "60 min", 
        isCompleted: false,
        content: {
          topics: [
            "Three White Soldiers",
            "Three Black Crows",
            "Three Inside Up/Down",
            "Three Outside Up/Down"
          ],
          resources: [
            "Complex Pattern Analysis",
            "Pattern Reliability Studies",
            "Advanced Trading Strategies"
          ]
        }
      },
      { 
        id: "m2-5", 
        title: "Pattern Trading Strategies", 
        duration: "80 min", 
        isCompleted: false,
        content: {
          topics: [
            "Pattern Confirmation Methods",
            "Risk Management with Patterns",
            "Entry and Exit Strategies",
            "Pattern Failure Analysis"
          ],
          resources: [
            "Strategy Backtesting Tool",
            "Pattern Success Rate Database",
            "Live Trading Examples"
          ]
        }
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
    prerequisites: ["Basic market knowledge", "Understanding of economic indicators"],
    learningObjectives: [
      "Identify economic cycle phases",
      "Analyze sector performance",
      "Implement rotation strategies",
      "Build diversified sector portfolios"
    ],
    modules: [
      { 
        id: "m3-1", 
        title: "Economic Cycle Fundamentals", 
        duration: "45 min", 
        isCompleted: false,
        content: {
          topics: [
            "Business Cycle Phases",
            "Economic Indicators",
            "Market Cycle Analysis",
            "Leading vs Lagging Indicators"
          ],
          resources: [
            "Economic Cycle Timeline",
            "Indicator Dashboard",
            "Cycle Analysis Tools"
          ]
        }
      },
      { 
        id: "m3-2", 
        title: "Sector Performance Analysis", 
        duration: "60 min", 
        isCompleted: false,
        content: {
          topics: [
            "Sector Classification",
            "Performance Metrics",
            "Relative Strength Analysis",
            "Sector Correlations"
          ],
          resources: [
            "Sector Performance Tracker",
            "Correlation Matrix",
            "Sector Analysis Reports"
          ]
        }
      },
      { 
        id: "m3-3", 
        title: "Identifying Rotation Signals", 
        duration: "45 min", 
        isCompleted: false,
        content: {
          topics: [
            "Rotation Indicators",
            "Momentum Analysis",
            "Volume Analysis",
            "Trend Confirmation"
          ],
          resources: [
            "Rotation Signal Scanner",
            "Momentum Indicators",
            "Signal Validation Tools"
          ]
        }
      },
      { 
        id: "m3-4", 
        title: "Building a Sector Rotation Portfolio", 
        duration: "90 min", 
        isCompleted: false,
        content: {
          topics: [
            "Portfolio Construction",
            "Risk Management",
            "Rebalancing Strategies",
            "Performance Monitoring"
          ],
          resources: [
            "Portfolio Builder Tool",
            "Rebalancing Calculator",
            "Performance Analytics"
          ]
        }
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
    prerequisites: ["Basic trading knowledge", "Understanding of market mechanics"],
    learningObjectives: [
      "Calculate optimal position sizes",
      "Implement effective stop-loss strategies",
      "Manage portfolio risk",
      "Create comprehensive risk management plans"
    ],
    modules: [
      { 
        id: "m4-1", 
        title: "Understanding Trading Risk", 
        duration: "40 min", 
        isCompleted: false,
        content: {
          topics: [
            "Types of Trading Risk",
            "Risk Assessment",
            "Volatility Analysis",
            "Market Risk Factors"
          ],
          resources: [
            "Risk Assessment Tool",
            "Volatility Calculator",
            "Risk Analysis Templates"
          ]
        }
      },
      { 
        id: "m4-2", 
        title: "Position Sizing Strategies", 
        duration: "50 min", 
        isCompleted: false,
        content: {
          topics: [
            "Fixed Position Sizing",
            "Percentage Risk Method",
            "Kelly Criterion",
            "Portfolio-Based Sizing"
          ],
          resources: [
            "Position Size Calculator",
            "Risk Calculator",
            "Sizing Strategy Guide"
          ]
        }
      },
      { 
        id: "m4-3", 
        title: "Effective Stop-Loss Placement", 
        duration: "45 min", 
        isCompleted: false,
        content: {
          topics: [
            "Technical Stop-Losses",
            "Volatility-Based Stops",
            "Time-Based Stops",
            "Trailing Stops"
          ],
          resources: [
            "Stop-Loss Calculator",
            "Stop Placement Guide",
            "Stop-Loss Strategy Examples"
          ]
        }
      },
      { 
        id: "m4-4", 
        title: "Risk-Reward Optimization", 
        duration: "45 min", 
        isCompleted: false,
        content: {
          topics: [
            "Risk-Reward Ratios",
            "Profit Targets",
            "Multiple Timeframe Analysis",
            "Trade Management"
          ],
          resources: [
            "Risk-Reward Calculator",
            "Trade Management Tools",
            "Optimization Strategies"
          ]
        }
      },
      { 
        id: "m4-5", 
        title: "Creating a Risk Management Plan", 
        duration: "30 min", 
        isCompleted: false,
        content: {
          topics: [
            "Plan Components",
            "Risk Tolerance Assessment",
            "Implementation Guidelines",
            "Review and Adjustment"
          ],
          resources: [
            "Risk Management Template",
            "Plan Builder Tool",
            "Review Checklist"
          ]
        }
      }
    ]
  }
];

/**
 * Seeds the courses collection in Firestore
 * NOTE: This function is no longer needed as we use mock course data directly in the UI.
 */
async function seedCourses() {
  try {
    console.log('🌱 Starting course data seeding...');
    console.log('⚠️ WARNING: This script is no longer necessary as course data is now mocked in the UI.');
    
    const coursesRef = collection(db, 'courses');
    
    for (const course of coursesData) {
      console.log(`Seeding course: ${course.title}`);
      await setDoc(doc(coursesRef, course.id), course);
    }
    
    console.log('✅ Course data seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding course data:', error);
  }
}

// Run the seed function
if (process.argv.includes('--force')) {
  seedCourses()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error during seeding:', error);
      process.exit(1);
    });
} else {
  console.log('⚠️ This script is no longer necessary as course data is now mocked in the UI.');
  console.log('If you still want to run it, use the --force flag: `ts-node seed-courses.ts --force`');
  process.exit(0);
} 