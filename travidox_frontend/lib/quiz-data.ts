// Quiz data structure
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xpReward: number;
  questions: QuizQuestion[];
  category: string;
  weekNumber?: number; // For weekly quizzes
  isWeekly?: boolean;
  publishedDate?: string;
}

// Nigerian Stock Questions Pool
const nigerianStockQuestions: QuizQuestion[] = [
  {
    id: 'ng-q1',
    question: 'Which of these is the main stock exchange in Nigeria?',
    options: [
      'Lagos Stock Market',
      'Nigerian Stock Exchange (NGX)',
      'Abuja Securities Market',
      'West African Stock Exchange'
    ],
    correctAnswer: 1,
    explanation: 'The Nigerian Exchange Group (NGX), formerly known as the Nigerian Stock Exchange (NSE), is the main stock exchange in Nigeria.'
  },
  {
    id: 'ng-q2',
    question: 'What is the regulatory body for the Nigerian stock market?',
    options: [
      'Central Bank of Nigeria (CBN)',
      'Nigerian Investment Promotion Commission (NIPC)',
      'Securities and Exchange Commission (SEC)',
      'Federal Ministry of Finance'
    ],
    correctAnswer: 2,
    explanation: 'The Securities and Exchange Commission (SEC) is the apex regulatory institution of the Nigerian capital market.'
  },
  {
    id: 'ng-q3',
    question: 'Which index tracks the performance of the top 30 companies on the Nigerian Exchange?',
    options: [
      'NGX-50',
      'NGX-ASI',
      'NGX-30',
      'NGX-Premium'
    ],
    correctAnswer: 2,
    explanation: 'The NGX-30 Index tracks the top 30 companies listed on the Nigerian Exchange in terms of market capitalization and liquidity.'
  },
  {
    id: 'ng-q4',
    question: 'Which of these is NOT a sector represented on the Nigerian Exchange?',
    options: [
      'Banking',
      'Oil and Gas',
      'Aerospace',
      'Consumer Goods'
    ],
    correctAnswer: 2,
    explanation: 'The Aerospace sector is not a major sector on the Nigerian Exchange. The main sectors include Banking, Oil and Gas, Consumer Goods, Industrial Goods, and Insurance among others.'
  },
  {
    id: 'ng-q5',
    question: 'What is the minimum amount you can invest in Nigerian stocks?',
    options: [
      'There is no minimum',
      '₦10,000',
      '₦50,000',
      '₦100,000'
    ],
    correctAnswer: 0,
    explanation: 'There is no official minimum amount required to invest in Nigerian stocks. You can start with whatever amount you can afford to buy at least one share.'
  },
  {
    id: 'ng-q6',
    question: 'Which of these Nigerian banks was the first to be listed on the Nigerian Stock Exchange?',
    options: [
      'First Bank of Nigeria',
      'Guaranty Trust Bank',
      'United Bank for Africa',
      'Zenith Bank'
    ],
    correctAnswer: 0,
    explanation: 'First Bank of Nigeria was the first Nigerian bank to be listed on the Nigerian Stock Exchange in 1971.'
  },
  {
    id: 'ng-q7',
    question: 'What is the main index that measures the performance of all listed equities on the Nigerian Exchange?',
    options: [
      'NGX-50',
      'NGX-ASI',
      'NGX-30',
      'NGX-Banking'
    ],
    correctAnswer: 1,
    explanation: 'The NGX All-Share Index (NGX-ASI) is the main index that measures the performance of all listed equities on the Nigerian Exchange.'
  },
  {
    id: 'ng-q8',
    question: 'Which of these is a requirement for a company to be listed on the Nigerian Exchange?',
    options: [
      'Must have been in operation for at least 10 years',
      'Must have a minimum of 500 shareholders',
      'Must have a minimum market capitalization',
      'Must be headquartered in Lagos'
    ],
    correctAnswer: 2,
    explanation: 'Companies seeking listing on the Nigerian Exchange must meet certain requirements including minimum market capitalization, years of operation, and financial performance criteria.'
  },
  {
    id: 'ng-q9',
    question: 'What is the trading hours for the Nigerian Exchange?',
    options: [
      '8:00 AM to 2:30 PM',
      '9:30 AM to 2:30 PM',
      '10:00 AM to 3:00 PM',
      '9:00 AM to 4:00 PM'
    ],
    correctAnswer: 1,
    explanation: 'The Nigerian Exchange operates from 9:30 AM to 2:30 PM, Monday to Friday, except on public holidays.'
  },
  {
    id: 'ng-q10',
    question: 'Which of these is the largest company by market capitalization on the Nigerian Exchange as of 2023?',
    options: [
      'Dangote Cement',
      'MTN Nigeria',
      'Airtel Africa',
      'BUA Cement'
    ],
    correctAnswer: 0,
    explanation: 'Dangote Cement is typically the largest company by market capitalization on the Nigerian Exchange.'
  },
  {
    id: 'ng-q11',
    question: 'What is a stockbroker in the Nigerian stock market?',
    options: [
      'A person who owns many stocks',
      'An employee of the Nigerian Exchange',
      'A licensed professional who buys and sells stocks on behalf of investors',
      'A financial analyst who recommends stocks'
    ],
    correctAnswer: 2,
    explanation: 'A stockbroker is a licensed professional who is authorized to buy and sell stocks on the Nigerian Exchange on behalf of investors.'
  },
  {
    id: 'ng-q12',
    question: 'What is a dividend in the context of Nigerian stocks?',
    options: [
      'The total value of a company',
      'A portion of a company\'s profit paid to shareholders',
      'The commission paid to stockbrokers',
      'The price at which a stock is bought'
    ],
    correctAnswer: 1,
    explanation: 'A dividend is a portion of a company\'s profit that is distributed to its shareholders as a reward for their investment.'
  },
  {
    id: 'ng-q13',
    question: 'What is the meaning of "Bull Market" in the Nigerian stock market?',
    options: [
      'A market where only agricultural stocks are traded',
      'A market dominated by falling prices',
      'A market dominated by rising prices',
      'A market with no price movement'
    ],
    correctAnswer: 2,
    explanation: 'A Bull Market refers to a market condition where stock prices are rising or expected to rise, indicating investor confidence.'
  },
  {
    id: 'ng-q14',
    question: 'What is the Central Securities Clearing System (CSCS) in Nigeria?',
    options: [
      'A government agency that regulates the stock market',
      'A depository for securities that facilitates the settlement of trades',
      'A bank that provides loans to stock investors',
      'A trading platform for buying and selling stocks'
    ],
    correctAnswer: 1,
    explanation: 'The CSCS is a depository for securities that facilitates the settlement of trades on the Nigerian Exchange and holds shares in electronic form.'
  },
  {
    id: 'ng-q15',
    question: 'What is a "Lot Size" in the Nigerian stock market?',
    options: [
      'The minimum number of shares you can buy in a single transaction',
      'The total number of shares a company has issued',
      'The maximum number of shares you can sell in a day',
      'The size of the trading floor'
    ],
    correctAnswer: 0,
    explanation: 'Lot Size refers to the minimum number of shares that can be bought or sold in a single transaction on the Nigerian Exchange.'
  },
  {
    id: 'ng-q16',
    question: 'What does "Market Capitalization" mean for a Nigerian listed company?',
    options: [
      'The total amount of money the company has in the bank',
      'The total value of a company\'s outstanding shares',
      'The company\'s annual profit',
      'The number of employees in the company'
    ],
    correctAnswer: 1,
    explanation: 'Market Capitalization is the total value of a company\'s outstanding shares, calculated by multiplying the current share price by the total number of outstanding shares.'
  },
  {
    id: 'ng-q17',
    question: 'What is an "IPO" in the Nigerian stock market?',
    options: [
      'International Portfolio Organization',
      'Investment Protection Order',
      'Initial Public Offering',
      'Integrated Profit Opportunity'
    ],
    correctAnswer: 2,
    explanation: 'An Initial Public Offering (IPO) is the process through which a private company offers its shares to the public for the first time on the stock exchange.'
  },
  {
    id: 'ng-q18',
    question: 'Which of these is a benefit of investing in the Nigerian stock market?',
    options: [
      'Guaranteed returns',
      'No risk of loss',
      'Potential for capital appreciation and dividend income',
      'Government insurance for all investments'
    ],
    correctAnswer: 2,
    explanation: 'Investing in the Nigerian stock market offers potential benefits such as capital appreciation, dividend income, and ownership in Nigerian companies.'
  },
  {
    id: 'ng-q19',
    question: 'What is a "Rights Issue" in the Nigerian stock market?',
    options: [
      'A legal dispute between shareholders',
      'An offer to existing shareholders to purchase additional shares at a discounted price',
      'The right to vote at a company\'s annual general meeting',
      'A guarantee of minimum returns on investment'
    ],
    correctAnswer: 1,
    explanation: 'A Rights Issue is an offer made by a company to its existing shareholders to purchase additional shares at a discounted price before offering them to the general public.'
  },
  {
    id: 'ng-q20',
    question: 'What is the meaning of "Blue Chip Stocks" in the Nigerian market?',
    options: [
      'Stocks of technology companies',
      'Stocks with blue-colored certificates',
      'Stocks of well-established, financially sound companies with a history of reliable performance',
      'Newly listed stocks with high growth potential'
    ],
    correctAnswer: 2,
    explanation: 'Blue Chip Stocks refer to shares of well-established, financially sound companies with a history of reliable performance and stable earnings.'
  },
  {
    id: 'ng-q21',
    question: 'What is a "Stockbroker\'s Account" in Nigeria?',
    options: [
      'A personal bank account owned by a stockbroker',
      'An account opened by an investor with a stockbroking firm to trade stocks',
      'An account that records all trades on the Nigerian Exchange',
      'A special account maintained by the Securities and Exchange Commission'
    ],
    correctAnswer: 1,
    explanation: 'A Stockbroker\'s Account is an account opened by an investor with a licensed stockbroking firm to facilitate trading on the Nigerian Exchange.'
  },
  {
    id: 'ng-q22',
    question: 'What is the "All-Share Index" on the Nigerian Exchange?',
    options: [
      'A list of all companies listed on the exchange',
      'A measure of the performance of all listed equities',
      'The total number of shares traded daily',
      'A directory of all stockbrokers'
    ],
    correctAnswer: 1,
    explanation: 'The All-Share Index is a statistical tool that measures the general price movement of all listed equities on the Nigerian Exchange, weighted by market capitalization.'
  },
  {
    id: 'ng-q23',
    question: 'Which of these documents is NOT typically issued to Nigerian stock investors?',
    options: [
      'Share certificate',
      'CSCS statement',
      'Contract note',
      'Stock ownership license'
    ],
    correctAnswer: 3,
    explanation: 'There is no such thing as a "Stock ownership license" in the Nigerian stock market. Investors typically receive share certificates (now mostly electronic via CSCS), CSCS statements, and contract notes.'
  },
  {
    id: 'ng-q24',
    question: 'What is a "Bonus Issue" in the Nigerian stock market?',
    options: [
      'Extra commission paid to stockbrokers',
      'Additional free shares given to existing shareholders',
      'A special dividend payment',
      'A government subsidy for stock investors'
    ],
    correctAnswer: 1,
    explanation: 'A Bonus Issue is the issuance of additional free shares to existing shareholders in proportion to their current shareholding.'
  },
  {
    id: 'ng-q25',
    question: 'What is the minimum age to invest in the Nigerian stock market?',
    options: [
      '16 years',
      '18 years',
      '21 years',
      'There is no minimum age'
    ],
    correctAnswer: 1,
    explanation: 'The minimum age to directly invest in the Nigerian stock market is 18 years, which is the legal age of majority in Nigeria.'
  },
  {
    id: 'ng-q26',
    question: 'What is the purpose of the Investors\' Protection Fund on the Nigerian Exchange?',
    options: [
      'To guarantee returns on investments',
      'To compensate investors who suffer losses due to the insolvency or bankruptcy of a dealing member firm',
      'To provide loans to investors',
      'To fund the operations of the Nigerian Exchange'
    ],
    correctAnswer: 1,
    explanation: 'The Investors\' Protection Fund is designed to compensate investors who suffer losses due to the insolvency, bankruptcy, or negligence of a dealing member firm of the Nigerian Exchange.'
  },
  {
    id: 'ng-q27',
    question: 'What is a "Limit Order" in the Nigerian stock market?',
    options: [
      'A restriction on the number of shares you can buy',
      'An order to buy or sell a stock at a specific price or better',
      'A limit on daily price movements of a stock',
      'An order that must be executed within a specific time limit'
    ],
    correctAnswer: 1,
    explanation: 'A Limit Order is an instruction to buy or sell a stock at a specified price or better, giving investors more control over the price at which their trades are executed.'
  },
  {
    id: 'ng-q28',
    question: 'Which of these sectors typically has the highest number of listed companies on the Nigerian Exchange?',
    options: [
      'Oil and Gas',
      'Financial Services',
      'Agriculture',
      'Healthcare'
    ],
    correctAnswer: 1,
    explanation: 'The Financial Services sector, which includes banks, insurance companies, and other financial institutions, typically has the highest number of listed companies on the Nigerian Exchange.'
  },
  {
    id: 'ng-q29',
    question: 'What is a "Bear Market" in the Nigerian stock market context?',
    options: [
      'A market where only mining stocks are traded',
      'A market dominated by rising prices',
      'A market dominated by falling prices',
      'A market with high trading volumes'
    ],
    correctAnswer: 2,
    explanation: 'A Bear Market refers to a market condition characterized by falling prices and pessimism about future market performance.'
  },
  {
    id: 'ng-q30',
    question: 'What document contains information about a company\'s financial performance and is important for stock investors?',
    options: [
      'Trading license',
      'Annual report',
      'Stock certificate',
      'Broker\'s note'
    ],
    correctAnswer: 1,
    explanation: 'An Annual Report is a comprehensive document that provides information about a company\'s financial performance, corporate governance, and future outlook, which is crucial for investors making investment decisions.'
  }
];

// Basic quizzes (always available)
export const basicQuizzes: Quiz[] = [
  {
    id: 'investing-basics',
    title: 'Investing Basics',
    description: 'Test your knowledge on investment fundamentals and earn XP.',
    difficulty: 'Beginner',
    xpReward: 100,
    category: 'fundamentals',
    questions: [
      {
        id: 'q1',
        question: 'What is diversification in investing?',
        options: [
          'Putting all your money in one stock',
          'Spreading investments across various assets to reduce risk',
          'Only investing in cryptocurrency',
          'Investing only during market downturns'
        ],
        correctAnswer: 1,
        explanation: 'Diversification involves spreading investments across different asset classes to reduce risk.'
      },
      {
        id: 'q2',
        question: 'Which of these is considered the safest investment?',
        options: [
          'Penny stocks',
          'Cryptocurrency',
          'Government bonds',
          'Futures contracts'
        ],
        correctAnswer: 2,
        explanation: 'Government bonds are generally considered safer as they are backed by the government.'
      },
      {
        id: 'q3',
        question: 'What does P/E ratio stand for?',
        options: [
          'Price to Earnings',
          'Profit to Expense',
          'Potential to Earnings',
          'Performance to Expectations'
        ],
        correctAnswer: 0,
        explanation: 'P/E ratio (Price to Earnings) is a valuation ratio of a company\'s current share price compared to its earnings per share.'
      }
    ]
  },
  {
    id: 'stock-analysis',
    title: 'Stock Analysis',
    description: 'Challenge yourself with questions about analyzing stocks and market trends.',
    difficulty: 'Intermediate',
    xpReward: 200,
    category: 'analysis',
    questions: [
      {
        id: 'q1',
        question: 'What is a bull market?',
        options: [
          'A market dominated by falling prices',
          'A market dominated by rising prices',
          'A market with no price movement',
          'A market exclusively for agricultural commodities'
        ],
        correctAnswer: 1,
        explanation: 'A bull market is characterized by rising prices and investor optimism.'
      },
      {
        id: 'q2',
        question: 'Which indicator measures market volatility?',
        options: [
          'MACD',
          'RSI',
          'VIX',
          'EPS'
        ],
        correctAnswer: 2,
        explanation: 'VIX (Volatility Index) is designed to measure market volatility.'
      },
      {
        id: 'q3',
        question: 'What is a candlestick chart used for?',
        options: [
          'To track dividend payments',
          'To visualize price movements over time',
          'To calculate company debt',
          'To predict market crashes'
        ],
        correctAnswer: 1,
        explanation: 'Candlestick charts display price movements with colored bodies showing opening/closing prices and wicks showing highs/lows.'
      }
    ]
  },
  {
    id: 'portfolio-strategies',
    title: 'Portfolio Strategies',
    description: 'Advanced questions about portfolio management and investment strategies.',
    difficulty: 'Advanced',
    xpReward: 300,
    category: 'strategy',
    questions: [
      {
        id: 'q1',
        question: 'What is dollar-cost averaging?',
        options: [
          'Converting all investments to US dollars',
          'Investing a fixed amount at regular intervals regardless of price',
          'Buying stocks only when prices are low',
          'Calculating returns in dollar terms only'
        ],
        correctAnswer: 1,
        explanation: 'Dollar-cost averaging involves investing a fixed amount regularly, regardless of share price.'
      },
      {
        id: 'q2',
        question: 'Which portfolio allocation would typically be considered most aggressive?',
        options: [
          '80% bonds, 20% stocks',
          '50% bonds, 50% stocks',
          '20% bonds, 80% stocks',
          '100% cash'
        ],
        correctAnswer: 2,
        explanation: 'A portfolio with 80% stocks and 20% bonds is generally considered more aggressive due to higher stock allocation.'
      },
      {
        id: 'q3',
        question: 'What is rebalancing a portfolio?',
        options: [
          'Selling all investments and starting over',
          'Adjusting asset allocation back to target percentages',
          'Adding more money to your investments',
          'Changing your investment broker'
        ],
        correctAnswer: 1,
        explanation: 'Rebalancing involves periodically buying or selling assets to maintain your desired asset allocation.'
      }
    ]
  }
];

// Weekly quizzes
export const weeklyQuizzes: Quiz[] = [
  {
    id: 'week-1-nigerian-stocks',
    title: 'Nigerian Stock Market Basics',
    description: 'Learn the fundamentals of the Nigerian stock market and popular Nigerian stocks.',
    difficulty: 'Beginner',
    xpReward: 500,
    category: 'nigeria',
    isWeekly: true,
    weekNumber: 1,
    publishedDate: '2023-08-01',
    questions: nigerianStockQuestions.slice(0, 10) // Use first 10 questions
  },
  {
    id: 'week-1-nigerian-stocks-advanced',
    title: 'Nigerian Stock Market Advanced',
    description: 'Deepen your knowledge about Nigerian stocks and trading strategies.',
    difficulty: 'Intermediate',
    xpReward: 750,
    category: 'nigeria',
    isWeekly: true,
    weekNumber: 1,
    publishedDate: '2023-08-01',
    questions: nigerianStockQuestions.slice(10, 20) // Use next 10 questions
  },
  {
    id: 'week-1-nigerian-stocks-pro',
    title: 'Nigerian Stock Market Pro',
    description: 'Expert-level questions about Nigerian stock market mechanics and investment strategies.',
    difficulty: 'Advanced',
    xpReward: 1000,
    category: 'nigeria',
    isWeekly: true,
    weekNumber: 1,
    publishedDate: '2023-08-01',
    questions: nigerianStockQuestions.slice(20, 30) // Use last 10 questions
  },
  {
    id: 'week-32-forex-trading',
    title: 'Forex Trading Essentials',
    description: 'Test your knowledge about currency trading fundamentals.',
    difficulty: 'Intermediate',
    xpReward: 250,
    category: 'forex',
    isWeekly: true,
    weekNumber: 32,
    publishedDate: '2023-08-07',
    questions: [
      {
        id: 'q1',
        question: 'What is a pip in forex trading?',
        options: [
          'A type of currency',
          'The smallest price movement in a currency pair',
          'A trading platform',
          'A type of forex broker'
        ],
        correctAnswer: 1,
        explanation: 'A pip is the smallest price movement in a currency pair, usually the fourth decimal place (0.0001).'
      },
      {
        id: 'q2',
        question: 'What does the term "going long" mean in forex?',
        options: [
          'Trading for a long period of time',
          'Buying a currency pair expecting it to rise in value',
          'Using high leverage',
          'Trading multiple currency pairs simultaneously'
        ],
        correctAnswer: 1,
        explanation: '"Going long" means buying a currency pair with the expectation that its value will increase.'
      },
      {
        id: 'q3',
        question: 'Which of these is NOT a major currency pair?',
        options: [
          'EUR/USD',
          'USD/JPY',
          'GBP/USD',
          'USD/ZAR'
        ],
        correctAnswer: 3,
        explanation: 'USD/ZAR (US Dollar/South African Rand) is considered an exotic pair, not a major currency pair.'
      },
      {
        id: 'q4',
        question: 'What is the purpose of a stop-loss order?',
        options: [
          'To automatically close a position when it reaches a certain profit level',
          'To prevent a trader from opening too many positions',
          'To limit potential losses on a trade',
          'To increase leverage on a position'
        ],
        correctAnswer: 2,
        explanation: 'A stop-loss order is designed to limit potential losses by automatically closing a position when the price reaches a predetermined level.'
      }
    ]
  },
  {
    id: 'week-33-crypto-markets',
    title: 'Cryptocurrency Markets',
    description: 'Learn about blockchain technology and crypto trading.',
    difficulty: 'Intermediate',
    xpReward: 275,
    category: 'crypto',
    isWeekly: true,
    weekNumber: 33,
    publishedDate: '2023-08-14',
    questions: [
      {
        id: 'q1',
        question: 'What is a blockchain?',
        options: [
          'A type of cryptocurrency',
          'A distributed digital ledger',
          'A trading platform for cryptocurrencies',
          'A hardware wallet'
        ],
        correctAnswer: 1,
        explanation: 'A blockchain is a distributed digital ledger that records transactions across many computers.'
      },
      {
        id: 'q2',
        question: 'What is a smart contract?',
        options: [
          'A legal agreement between crypto traders',
          'Self-executing code stored on a blockchain',
          'A type of crypto wallet',
          'An agreement between miners'
        ],
        correctAnswer: 1,
        explanation: 'Smart contracts are self-executing contracts with the terms directly written into code on a blockchain.'
      },
      {
        id: 'q3',
        question: 'What is a "gas fee" in cryptocurrency transactions?',
        options: [
          'A tax on crypto profits',
          'The cost to process and validate transactions on a blockchain',
          'A subscription fee for crypto exchanges',
          'The price of converting between cryptocurrencies'
        ],
        correctAnswer: 1,
        explanation: 'Gas fees are payments made by users to compensate for the computing energy required to process and validate transactions on a blockchain.'
      },
      {
        id: 'q4',
        question: 'What is "HODL" in crypto terminology?',
        options: [
          'A type of blockchain consensus mechanism',
          'A misspelling of "hold" that became a strategy to hold long-term',
          'High-Opportunity Direct Lending',
          'A type of crypto wallet'
        ],
        correctAnswer: 1,
        explanation: 'HODL originated as a misspelling of "hold" in a forum post and became a term for holding onto cryptocurrencies for the long term regardless of market volatility.'
      }
    ]
  },
  {
    id: 'week-34-technical-analysis',
    title: 'Technical Analysis Mastery',
    description: 'Sharpen your chart reading and pattern recognition skills.',
    difficulty: 'Advanced',
    xpReward: 325,
    category: 'analysis',
    isWeekly: true,
    weekNumber: 34,
    publishedDate: '2023-08-21',
    questions: [
      {
        id: 'q1',
        question: 'What is a "head and shoulders" pattern?',
        options: [
          'A personal hygiene routine for traders',
          'A chart pattern indicating a potential reversal',
          'A type of trading algorithm',
          'A position sizing strategy'
        ],
        correctAnswer: 1,
        explanation: 'The head and shoulders pattern is a chart formation indicating a potential reversal from bullish to bearish market sentiment.'
      },
      {
        id: 'q2',
        question: 'What does the MACD indicator measure?',
        options: [
          'Market volatility',
          'Trading volume',
          'Momentum and trend direction',
          'Market capitalization changes'
        ],
        correctAnswer: 2,
        explanation: 'The Moving Average Convergence Divergence (MACD) measures momentum and trend direction by comparing two moving averages.'
      },
      {
        id: 'q3',
        question: 'What is a "golden cross"?',
        options: [
          'When a stock price crosses its all-time high',
          'When a shorter-term moving average crosses above a longer-term moving average',
          'A religious symbol used by trading cults',
          'The intersection of support and resistance lines'
        ],
        correctAnswer: 1,
        explanation: 'A golden cross occurs when a shorter-term moving average crosses above a longer-term moving average, often signaling a bullish market sentiment.'
      },
      {
        id: 'q4',
        question: 'What is the Relative Strength Index (RSI) used for?',
        options: [
          'Measuring a company\'s financial strength relative to competitors',
          'Comparing different market sectors',
          'Identifying overbought or oversold conditions',
          'Calculating dividend yields'
        ],
        correctAnswer: 2,
        explanation: 'RSI is a momentum oscillator that measures the speed and change of price movements, typically used to identify overbought or oversold conditions.'
      },
      {
        id: 'q5',
        question: 'What does a "doji" candlestick indicate?',
        options: [
          'A strong bullish trend',
          'A strong bearish trend',
          'Market indecision or potential reversal',
          'High trading volume'
        ],
        correctAnswer: 2,
        explanation: 'A doji candlestick has a very small body (opening and closing prices are very close), indicating market indecision and a potential trend reversal.'
      }
    ]
  }
];

// Function to get current week number
export function getCurrentWeekNumber(): number {
  // For the purpose of this app, we'll always return week 1
  return 1;
}

// Function to get current week's quizzes
export function getCurrentWeekQuizzes(): Quiz[] {
  // Always return week 1 quizzes
  return weeklyQuizzes.filter(quiz => quiz.weekNumber === 1);
}

// Function to get all available quizzes (basic + weekly)
export function getAllQuizzes(): Quiz[] {
  return [...basicQuizzes, ...weeklyQuizzes];
}

// Function to get quiz by ID
export function getQuizById(quizId: string): Quiz | undefined {
  return getAllQuizzes().find(quiz => quiz.id === quizId);
} 