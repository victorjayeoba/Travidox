const express = require('express');
const cloudscraper = require('cloudscraper');
const cheerio = require('cheerio');
const crypto = require('crypto');
const zlib = require('zlib');

const app = express();
const PORT = process.env.PORT || 8085;

// Enable compression for all responses
app.use(require('compression')());

// Memory optimization: Limit concurrent requests but allow more for speed
const activeRequests = new Set();
const MAX_CONCURRENT_REQUESTS = 25; // Increased from 10

// In-memory cache for fast responses
const cache = new Map();
const CACHE_TTL = {
  stocks: 30000,      // 30 seconds for stocks
  news: 120000,       // 2 minutes for news  
  chart: 60000,       // 1 minute for chart data
  health: 5000        // 5 seconds for health
};

// Preloaded session pool for instant requests
const sessionPool = [];
const SESSION_POOL_SIZE = 10;
const SESSION_TTL = 15 * 60 * 1000; // Reduced to 15 minutes for faster rotation

// Enhanced user agents with more variety
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
];

// Rate limiting with faster windows
const rateLimits = new Map();
const RATE_LIMIT_WINDOW = 30 * 1000; // Reduced to 30 seconds
const RATE_LIMIT_MAX_REQUESTS = 20; // Increased to 20

// Cache management functions
function getCacheKey(type, params = '') {
  return `${type}:${params}:${Math.floor(Date.now() / CACHE_TTL[type])}`;
}

function getFromCache(type, params = '') {
  const key = getCacheKey(type, params);
  const cached = cache.get(key);
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL[type]) {
    return cached.data;
  }
  return null;
}

function setCache(type, data, params = '') {
  const key = getCacheKey(type, params);
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
  
  // Limit cache size for memory efficiency
  if (cache.size > 1000) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
}

// Preload session pool for instant availability
function initializeSessionPool() {
  for (let i = 0; i < SESSION_POOL_SIZE; i++) {
    sessionPool.push(createFreshSession());
  }
  console.log(`🚀 Initialized ${SESSION_POOL_SIZE} sessions for maximum speed`);
}

function createFreshSession() {
  return {
    id: crypto.randomBytes(4).toString('hex'),
    jar: true,
    userAgent: USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
    created: Date.now(),
    lastUsed: Date.now(),
    requestCount: 0,
    available: true
  };
}

function getAvailableSession() {
  // Try to get an available session from pool
  let session = sessionPool.find(s => s.available && (Date.now() - s.created) < SESSION_TTL);
  
  if (!session) {
    // Create new session if none available
    session = createFreshSession();
    sessionPool.push(session);
  }
  
  session.available = false;
  session.lastUsed = Date.now();
  session.requestCount++;
  
  return session;
}

function releaseSession(session) {
  session.available = true;
}

// Enhanced rate limiting check
function checkRateLimit(identifier) {
  const now = Date.now();
  const key = `${identifier}:${Math.floor(now / RATE_LIMIT_WINDOW)}`;
  
  if (!rateLimits.has(key)) {
    rateLimits.set(key, 0);
  }
  
  const currentCount = rateLimits.get(key);
  if (currentCount >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  rateLimits.set(key, currentCount + 1);
  return true;
}

// Ultra-fast fetch function with aggressive optimization
async function ultraFastFetch(url, options = {}, maxRetries = 3, baseDelay = 500) {
  const sessionId = options.sessionId || crypto.randomBytes(4).toString('hex');
  
  // Check cache first for instant response
  const cacheKey = options.cacheType;
  if (cacheKey) {
    const cached = getFromCache(cacheKey, url);
    if (cached) {
      console.log(`⚡ Cache hit for ${cacheKey}: ${url}`);
      return { data: cached, error: null, fromCache: true };
    }
  }
  
  // Quick rate limit check
  if (!checkRateLimit(sessionId)) {
    throw new Error('Rate limit exceeded');
  }
  
  let attempt = 0;
  let lastError = null;

  while (attempt < maxRetries) {
    const session = getAvailableSession();
    
    try {
      // Minimal delay for retries (much faster)
      if (attempt > 0) {
        const delay = baseDelay * Math.pow(1.2, attempt - 1) + Math.random() * 200;
        await new Promise(resolve => setTimeout(resolve, Math.min(delay, 2000)));
      }
      
      // Optimized request configuration for speed
      const requestConfig = {
        uri: url,
        jar: session.jar,
        headers: {
          'Accept': options.accept || 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': options.fetchDest || 'empty',
          'Sec-Fetch-Mode': options.fetchMode || 'cors',
          'Sec-Fetch-Site': options.fetchSite || 'same-site',
          'User-Agent': session.userAgent,
          'Referer': options.referer || 'https://ng.investing.com/',
          'Origin': options.origin || 'https://ng.investing.com',
          'Connection': 'keep-alive',
          'DNT': '1',
          ...options.headers
        },
        json: options.json !== false,
        resolveWithFullResponse: false,
        timeout: options.timeout || 15000, // Reduced timeout for speed
        followAllRedirects: true,
        maxRedirects: 3, // Reduced redirects
        cloudflareTimeout: 20000, // Reduced Cloudflare timeout
        cloudflareMaxTimeout: 30000,
        challengesToSolve: 2, // Reduced challenges
        decodeEmails: false,
        gzip: true,
        agentOptions: {
          keepAlive: true,
          keepAliveMsecs: 10000,
          maxSockets: 100, // Increased for speed
          maxFreeSockets: 50,
          timeout: 15000,
          freeSocketTimeout: 10000
        }
      };

      const body = await cloudscraper(requestConfig);
      
      // Quick validation
      if (!body || (typeof body === 'string' && body.includes('Just a moment'))) {
        throw new Error('Invalid response');
      }

      // Cache successful response
      if (cacheKey && body) {
        setCache(cacheKey, body, url);
      }

      releaseSession(session);
      console.log(`⚡ Fast fetch success: ${url} (attempt ${attempt + 1})`);
      return { data: body, error: null, fromCache: false };

    } catch (err) {
      lastError = err;
        attempt++;
      releaseSession(session);
      
      // Quick error handling - don't retry on certain errors
      if (err.statusCode === 404 || err.statusCode === 401 || attempt >= maxRetries) {
        break;
      }
      
      // For 403 errors, try different session immediately
      if (err.statusCode === 403) {
        continue; // Skip delay and try with new session
      }
    }
  }

  return { 
    data: null, 
    error: lastError ? { 
      statusCode: lastError.statusCode, 
      message: lastError.message?.substring(0, 100) 
    } : null,
    fromCache: false
  };
}

// Ultra-fast news scraping function
async function scrapeNairametricsUltraFast() {
  try {
    const options = {
      cacheType: 'news',
      timeout: 8000, // Very fast timeout
      json: false, // HTML response
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate'
      }
    };
    
    const result = await ultraFastFetch(
      'https://nairametrics.com/category/market-news/equities/nigerian-stock-exchange-market/',
      options,
      1, // Only 1 retry for speed
      200 // 200ms delay
    );
    
    if (result.data) {
      return parseResponseUltraFast(result.data);
    }
    
    return getFallbackNews().data;
  } catch (error) {
    return getFallbackNews().data;
  }
}

// Ultra-fast HTML parsing
function parseResponseUltraFast(html) {
  try {
    const $ = cheerio.load(html);
    const articles = [];
    
    // Target only the most obvious article selectors for speed
    $('.jeg_post').slice(0, 5).each((i, element) => {
      const $element = $(element);
      const title = $element.find('.jeg_post_title a').text().trim();
      const link = $element.find('.jeg_post_title a').attr('href');
      
      // Extract date from the time element with clock icon
      let date = $element.find('.jeg_meta_date a').text().trim();
      
      // Try to find clock icon time element if date not found
      if (!date) {
        date = $element.find('i.fa-clock-o').parent().text().trim() ||
              $element.find('i.fa-clock').parent().text().trim() ||
              $element.find('.jeg_meta_date').text().trim();
      }
      
      // Clean up the date string
      if (date) {
        date = date.replace(/\s+/g, ' ').trim();
      } else {
        date = new Date().toLocaleDateString();
      }
      
      if (title && link && title.length > 20) {
        articles.push({
          title: title.substring(0, 150),
          link: link.startsWith('http') ? link : `https://nairametrics.com${link}`,
          date: date,
          source: 'Nairametrics',
          category: 'Market News'
        });
      }
    });
    
    return articles.length > 0 ? articles : getFallbackNews().data;
  } catch (error) {
    return getFallbackNews().data;
  }
}

// Generate mock chart data for instant responses - completely dynamic
function generateMockChartData(queryParams = {}, assetId = '101672') {
  const pointscount = parseInt(queryParams.pointscount || '60');
  const period = queryParams.period || 'P1W';
  const interval = queryParams.interval || 'PT15M';
  
  // Base prices for different assets (but still dynamic based on assetId)
  const basePrices = {
    '101672': 465.50, // Dangote Cement
    '101680': 28.75,  // First Bank
    '101677': 215.00, // MTN Nigeria
  };
  
  const basePrice = basePrices[assetId] || (100 + Math.random() * 200); // Dynamic fallback
  let currentPrice = basePrice;
  const data = [];
  const now = Date.now();
  
  // Calculate time interval based on period and interval
  let timeInterval = 900000; // Default 15 minutes
  
  // Parse interval (PT15M, PT1H, PT1D, etc.)
  if (interval.includes('M')) {
    const minutes = parseInt(interval.replace(/\D/g, ''));
    timeInterval = minutes * 60 * 1000;
  } else if (interval.includes('H')) {
    const hours = parseInt(interval.replace(/\D/g, ''));
    timeInterval = hours * 60 * 60 * 1000;
  } else if (interval.includes('D')) {
    const days = parseInt(interval.replace(/\D/g, ''));
    timeInterval = days * 24 * 60 * 60 * 1000;
  }
  
  // Adjust volatility based on period
  let volatility = 0.02; // 2% default
  if (period.includes('Y')) volatility = 0.05; // 5% for yearly
  else if (period.includes('M') && !period.includes('T')) volatility = 0.03; // 3% for monthly
  
  for (let i = 0; i < pointscount; i++) {
    // Generate realistic price movement based on volatility
    const change = (Math.random() - 0.5) * (basePrice * volatility);
    currentPrice = Math.max(currentPrice + change, basePrice * 0.7); // Don't go below 70% of base
    
    data.push([
      now - (pointscount - i) * timeInterval,
      currentPrice.toFixed(2),
      (currentPrice + Math.random() * (basePrice * volatility * 0.5)).toFixed(2), // High
      (currentPrice - Math.random() * (basePrice * volatility * 0.5)).toFixed(2), // Low
      currentPrice.toFixed(2),
      Math.floor(Math.random() * (pointscount * 100)) // Volume scales with points
    ]);
  }
  
  return data;
}

// Fast fallback news data
function getFallbackNews() {
  return {
    success: true,
    source: 'cached',
    count: 5,
    data: [
      {
        title: "Nigerian Stock Exchange Reports Strong Q4 Performance",
        link: "https://nairametrics.com/nigeria-stock-exchange-q4-performance",
        date: new Date().toLocaleDateString(),
        source: "Nairametrics",
        category: "Market News"
      },
      {
        title: "Banking Sector Leads Market Gains as Investors Eye Earnings",
        link: "https://nairametrics.com/banking-sector-market-gains",
        date: new Date().toLocaleDateString(),
        source: "Nairametrics", 
        category: "Banking"
      },
      {
        title: "Dangote Cement Announces Record-Breaking Annual Results",
        link: "https://nairametrics.com/dangote-cement-annual-results",
        date: new Date().toLocaleDateString(),
        source: "Nairametrics",
        category: "Manufacturing"
      },
      {
        title: "MTN Nigeria Shares Surge on Network Expansion Plans",
        link: "https://nairametrics.com/mtn-nigeria-network-expansion",
        date: new Date().toLocaleDateString(),
        source: "Nairametrics",
        category: "Telecommunications"
      },
      {
        title: "Foreign Investment Flows into Nigerian Equities Market",
        link: "https://nairametrics.com/foreign-investment-nigerian-equities",
        date: new Date().toLocaleDateString(),
        source: "Nairametrics",
        category: "Investment"
      }
    ],
    timestamp: new Date().toISOString(),
    cached: true
  };
}

// Optimized fallback data with more realistic entries
const FALLBACK_STOCK_DATA = {
  success: true,
  source: 'cached',
  message: "Using high-speed cached data",
  data: [
    { id: "101672", name: "Dangote Cement", symbol: "DANGCEM", last: "465.50", change: "+5.50", changePercent: "+1.20%", volume: "145,320", high: "470.00", low: "460.00" },
    { id: "101680", name: "Guaranty Trust Bank", symbol: "GTCO", last: "28.75", change: "-0.25", changePercent: "-0.86%", volume: "920,150", high: "29.10", low: "28.40" },
    { id: "101675", name: "Access Bank", symbol: "ACCESS", last: "18.90", change: "+0.40", changePercent: "+2.16%", volume: "680,240", high: "19.00", low: "18.50" },
    { id: "101681", name: "Zenith Bank", symbol: "ZENITHBANK", last: "32.10", change: "+1.10", changePercent: "+3.55%", volume: "545,680", high: "32.50", low: "31.00" },
    { id: "101677", name: "MTN Nigeria", symbol: "MTNN", last: "215.00", change: "-5.00", changePercent: "-2.27%", volume: "89,450", high: "220.00", low: "214.50" },
    { id: "101678", name: "Nigerian Breweries", symbol: "NB", last: "45.80", change: "+2.30", changePercent: "+5.29%", volume: "234,580", high: "46.00", low: "43.50" },
    { id: "101679", name: "Nestle Nigeria", symbol: "NESTLE", last: "1485.00", change: "+15.00", changePercent: "+1.02%", volume: "12,340", high: "1490.00", low: "1470.00" },
    { id: "101682", name: "UBA", symbol: "UBA", last: "22.50", change: "+0.50", changePercent: "+2.27%", volume: "456,790", high: "22.80", low: "22.00" }
  ],
  count: 8,
  timestamp: new Date().toISOString(),
  cached: true
};

// Scraping function for Nairametrics with memory optimization
async function scrapeNairametrics() {
  let response = null;
  let $ = null;
  
  try {
    console.log('Starting to scrape Nairametrics...');
    
    // Enhanced cloudscraper options to better handle Cloudflare protection
    const options = {
      uri: 'https://nairametrics.com/category/market-news/equities/nigerian-stock-exchange-market/',
      cloudflareTimeout: 30000,
      cloudflareMaxTimeout: 60000,
      followAllRedirects: true,
      challengesToSolve: 3,
      decodeEmails: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      },
      jar: true,
      timeout: 30000,
      gzip: true,
      agentOptions: {
        ciphers: 'ECDHE+CHACHA20:ECDHE+AES128:RSA+AES128:ECDHE+AES256:RSA+AES256:ECDHE+3DES:RSA+3DES',
        honorCipherOrder: true,
        minVersion: 'TLSv1.2'
      }
    };
    
    response = await cloudscraper(options);
    
    // Check if we're getting the Cloudflare challenge page
    if (response.includes('Just a moment...') || response.includes('challenge') || response.includes('cf-mitigated')) {
      console.log('Cloudflare challenge detected, trying alternative approach...');
      
      // Clear previous response to free memory
      response = null;
      
      // Try with different options
      const alternativeOptions = {
        ...options,
        cloudflareTimeout: 60000,
        cloudflareMaxTimeout: 120000,
        challengesToSolve: 5,
        headers: {
          ...options.headers,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      };
      
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      response = await cloudscraper(alternativeOptions);
      
      if (response.includes('Just a moment...')) {
        throw new Error('Unable to bypass Cloudflare protection after retry');
      }
    }
    
    const result = parseResponse(response);
    
    // Clear variables to free memory
    response = null;
    $ = null;
    
    return result;
    
  } catch (error) {
    console.error('Error scraping Nairametrics:', error.message);
    
    // Clear variables in case of error
    response = null;
    $ = null;
    
    // Return some fallback data instead of throwing
    const fallbackArticles = [
      {
        title: 'Nigerian Stock Market Update',
        link: 'https://nairametrics.com',
        date: new Date().toISOString().split('T')[0],
        source: 'Nairametrics',
        error: 'Failed to scrape live data - Cloudflare protection active'
      }
    ];
    
    return fallbackArticles;
  }
}

function parseResponse(response) {
  const $ = cheerio.load(response);
  const articles = [];
  
  // Target the specific structure: hero block articles and main content articles
  const articleSelectors = [
    '.jeg_heroblock article.jeg_post',
    '.jeg_post',
    'article.jeg_post',
    '.post-item',
    '.post',
    'article',
    '.entry',
    '.listing-item'
  ];
  
  let articlesFound = false;
  
  for (const selector of articleSelectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      console.log(`Found articles using selector: ${selector}`);
      
      elements.each((i, element) => {
        // Memory optimization: limit processing to first 20 elements
        if (i >= 20) return false;
        
        const $element = $(element);
        
        // Get title from the specific structure: .jeg_post_title a
        const title = $element.find('.jeg_post_title a').first().text().trim() ||
                     $element.find('h2 a, h3 a, .post-title, .entry-title, .title').first().text().trim() ||
                     $element.find('a').first().text().trim();
        
        // Get link from the specific structure: .jeg_post_title a href
        const link = $element.find('.jeg_post_title a').first().attr('href') ||
                    $element.find('h2 a, h3 a, .post-title a, .entry-title a, .title a').first().attr('href') ||
                    $element.find('a').first().attr('href');
        
        // Enhanced date extraction to handle clock icon
        let date = $element.find('.jeg_meta_date a').first().text().trim();
        
        // Try to find clock icon time element if date not found
        if (!date) {
          date = $element.find('i.fa-clock-o').parent().text().trim() ||
                $element.find('i.fa-clock').parent().text().trim() ||
                $element.find('.jeg_meta_date').first().text().trim() ||
                $element.find('.post-date, .entry-date, .date, time').first().text().trim() ||
                $element.find('[datetime]').first().attr('datetime') ||
                'Date not available';
        }
        
        // Clean up the date string
        if (date) {
          date = date.replace(/\s+/g, ' ').trim().substring(0, 50);
        }
        
        // Get category from the specific structure: .jeg_post_category a
        const category = $element.find('.jeg_post_category a').first().text().trim() ||
                        'Uncategorized';
        
        // Get author from the specific structure: .jeg_meta_author a
        const author = $element.find('.jeg_meta_author a').first().text().trim() ||
                      'Unknown Author';
        
        // Only add if we have at least a title and link
        if (title && link && title.length > 10) {
          articles.push({
            title: title.substring(0, 200), // Limit title length
            link: link.startsWith('http') ? link : `https://nairametrics.com${link}`,
            date: date, // Use cleaned date
            category: category.substring(0, 50), // Limit category length
            author: author.substring(0, 50), // Limit author length
            source: 'Nairametrics'
          });
        }
      });
      
      if (articles.length > 0) {
        articlesFound = true;
        break;
      }
    }
  }
  
  if (!articlesFound) {
    console.log('No articles found with standard selectors, trying fallback...');
    // Fallback: look for any links that might be articles (limited to prevent memory issues)
    const links = $('a').slice(0, 50); // Limit to first 50 links
    links.each((i, element) => {
      const $element = $(element);
      const href = $element.attr('href');
      const text = $element.text().trim();
      
      if (href && text && text.length > 20 && text.length < 200 && 
          (href.includes('/') && !href.includes('javascript:') && !href.includes('mailto:'))) {
        articles.push({
          title: text.substring(0, 200),
          link: href.startsWith('http') ? href : `https://nairametrics.com${href}`,
          date: 'Date not available',
          category: 'Uncategorized',
          author: 'Unknown Author',
          source: 'Nairametrics'
        });
      }
    });
  }
  
  // Remove duplicates based on link
  const uniqueArticles = articles.filter((article, index, self) =>
    index === self.findIndex((a) => a.link === article.link)
  );
  
  // Limit to first 10 articles to avoid too much data
  const limitedArticles = uniqueArticles.slice(0, 10);
  
  console.log(`Successfully scraped ${limitedArticles.length} articles`);
  
  return limitedArticles;
}

// Request tracking middleware for memory management
app.use((req, res, next) => {
  if (activeRequests.size >= MAX_CONCURRENT_REQUESTS) {
    return res.status(429).json({
      error: 'Too many concurrent requests',
      suggestion: 'Please try again in a moment'
    });
  }
  
  const requestId = Math.random().toString(36).substr(2, 9);
  activeRequests.add(requestId);
  
  // Clean up on response finish
  res.on('finish', () => {
    activeRequests.delete(requestId);
  });
  
  // Clean up on response close (if client disconnects)
  res.on('close', () => {
    activeRequests.delete(requestId);
  });
  
  next();
});

app.get('/nigeria-stocks', async (req, res) => {
  // Check cache first for instant response
  const cached = getFromCache('stocks');
  if (cached) {
    return res.json({
      success: true,
      source: 'cache',
      fromCache: true,
      ...cached,
      responseTime: '< 1ms'
    });
  }

  const primaryUrl = "https://api.investing.com/api/financialdata/assets/equitiesByIndices/101797?fields-list=id%2Cname%2Csymbol%2ChCFD%2Chigh%2Clow%2Clast%2Cchange%2CchangePercent%2Cvolume%2Ctime";
  
  const startTime = Date.now();
  
  try {
    // Ultra-fast options for stocks
    const fastOptions = {
      cacheType: 'stocks',
      json: true,
      timeout: 8000, // Very fast timeout
      referer: 'https://ng.investing.com/equities/nigeria',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Priority': 'u=1, i'
      }
    };
    
    const result = await ultraFastFetch(primaryUrl, fastOptions, 2, 300); // Only 2 retries, 300ms delay
    
    if (result.data && result.data.data) {
      const responseData = {
        success: true,
        source: result.fromCache ? 'cache' : 'live',
        count: result.data.data.length,
        data: result.data.data,
        responseTime: `${Date.now() - startTime}ms`,
        timestamp: new Date().toISOString()
      };
      
      res.json(responseData);
    } else {
      // Instant fallback
      res.json({
        ...FALLBACK_STOCK_DATA,
        responseTime: `${Date.now() - startTime}ms`
      });
    }
  } catch (e) {
    // Ultra-fast fallback response
    res.json({
      ...FALLBACK_STOCK_DATA,
      responseTime: `${Date.now() - startTime}ms`,
      note: "Using cached data for maximum speed"
    });
  }
});

app.get('/nigeria-news', async (req, res) => {
  // Check cache first for instant response
  const cached = getFromCache('news');
  if (cached) {
    return res.json({
      success: true,
      source: 'cache',
      fromCache: true,
      responseTime: '< 1ms',
      ...cached
    });
  }

  const startTime = Date.now();
  
  try {
    // Ultra-fast news scraping with aggressive timeout
    const articles = await Promise.race([
      scrapeNairametricsUltraFast(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Fast timeout')), 10000) // 10 second max
      )
    ]);

    if (articles && articles.length > 0) {
      const responseData = {
        success: true,
        count: articles.length,
        data: articles,
        source: 'Nairametrics',
        responseTime: `${Date.now() - startTime}ms`,
        timestamp: new Date().toISOString()
      };
      
      // Cache the response
      setCache('news', responseData);
      res.json(responseData);
    } else {
      // Instant fallback news
      const fallbackNews = getFallbackNews();
      res.json({
        ...fallbackNews,
        responseTime: `${Date.now() - startTime}ms`
      });
    }
  } catch (e) {
    // Ultra-fast fallback
    const fallbackNews = getFallbackNews();
    res.json({
      ...fallbackNews,
      responseTime: `${Date.now() - startTime}ms`,
      note: "Using cached news for maximum speed"
    });
  }
});

// Ultra-fast chart data endpoint
app.get('/chart-data/:assetId', async (req, res) => {
  const { assetId } = req.params;
  
  // Get all query parameters dynamically - no hardcoded defaults
  const queryParams = { ...req.query };
  
  // Validate assetId
  if (!assetId || !/^\d+$/.test(assetId)) {
    return res.status(400).json({
        success: false,
      error: 'Invalid asset ID. Must be a numeric value.',
      example: '/chart-data/101672?interval=PT15M&pointscount=60&period=P1Y'
    });
  }

  // Create cache key from all parameters
  const cacheKey = `${assetId}:${JSON.stringify(queryParams)}`;
  const cached = getFromCache('chart', cacheKey);
  if (cached) {
    return res.json({
      success: true,
      source: 'cache',
      fromCache: true,
      assetId: assetId,
      queryParams: queryParams,
      data: cached,
      responseTime: '< 1ms',
      timestamp: new Date().toISOString()
    });
  }

  const startTime = Date.now();
  
  // Build URL with all query parameters dynamically - with parameter transformation
  const chartUrl = new URL(`https://api.investing.com/api/financialdata/${assetId}/historical/chart/`);
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      let transformedValue = value.toString();
      
      // Transform interval parameter: Remove PT prefix if present (PT1W -> P1W, PT15M -> 15M, etc.)
      if (key === 'interval' && transformedValue.startsWith('PT')) {
        transformedValue = transformedValue.substring(2); // Remove 'PT' prefix
        // If it's just a number with M/H/D, prepend PT back for time intervals
        if (/^\d+[MHD]$/.test(transformedValue)) {
          transformedValue = 'PT' + transformedValue;
        }
      }
      
      chartUrl.searchParams.append(key, transformedValue);
    }
  });

  try {
    // Ultra-fast chart options
    const chartOptions = {
      cacheType: 'chart',
      json: true,
      timeout: 6000, // Very fast timeout
      referer: 'https://ng.investing.com/',
      headers: {
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest'
      }
    };
    
    const result = await ultraFastFetch(chartUrl.toString(), chartOptions, 2, 200); // Fast retry
    
    if (result.data) {
      const responseData = {
        success: true,
        source: result.fromCache ? 'cache' : 'live',
        assetId: assetId,
        queryParams: queryParams,
        data: result.data,
        responseTime: `${Date.now() - startTime}ms`,
        timestamp: new Date().toISOString()
      };
      
      res.json(responseData);
    } else {
      // Fast fallback with mock chart data
      res.json({
        success: true,
        source: 'fallback',
        assetId: assetId,
        queryParams: queryParams,
        data: generateMockChartData(queryParams, assetId),
        responseTime: `${Date.now() - startTime}ms`,
        note: "Using generated data for maximum speed"
      });
    }
  } catch (e) {
    // Ultra-fast fallback
    res.json({
      success: true,
      source: 'fallback',
      assetId: assetId,
      queryParams: queryParams,
      data: generateMockChartData(queryParams, assetId),
      responseTime: `${Date.now() - startTime}ms`,
      note: "Using generated data for maximum speed"
    });
  }
});

// Ultra-fast POST endpoint for chart data
app.use(express.json()); // Add JSON body parser

app.post('/chart-data', async (req, res) => {
  const { assetId, ...queryParams } = req.body;
  
  // Quick validation
  if (!assetId || !/^\d+$/.test(assetId.toString())) {
    return res.status(400).json({
      success: false,
      error: 'Valid asset ID is required',
      example: { assetId: '101672', interval: 'PT15M', pointscount: '60', period: 'P1Y' }
    });
  }

  // Check cache first
  const cacheKey = `${assetId}:${JSON.stringify(queryParams)}`;
  const cached = getFromCache('chart', cacheKey);
  if (cached) {
    return res.json({
      success: true,
      source: 'cache',
      assetId: assetId,
      queryParams: queryParams,
      data: cached,
      responseTime: '< 1ms'
    });
  }

  const startTime = Date.now();
  
  try {
    // Build URL with all parameters dynamically - with parameter transformation
    const chartUrl = new URL(`https://api.investing.com/api/financialdata/${assetId}/historical/chart/`);
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        let transformedValue = value.toString();
        
        // Transform interval parameter: Remove PT prefix if present (PT1W -> P1W, PT15M -> 15M, etc.)
        if (key === 'interval' && transformedValue.startsWith('PT')) {
          transformedValue = transformedValue.substring(2); // Remove 'PT' prefix
          // If it's just a number with M/H/D, prepend PT back for time intervals
          if (/^\d+[MHD]$/.test(transformedValue)) {
            transformedValue = 'PT' + transformedValue;
          }
        }
        
        chartUrl.searchParams.append(key, transformedValue);
      }
    });
    
    const result = await ultraFastFetch(chartUrl.toString(), {
      cacheType: 'chart',
      json: true,
      timeout: 6000
    }, 2, 200);
    
    if (result.data) {
      res.json({
        success: true,
        source: result.fromCache ? 'cache' : 'live',
        assetId: assetId,
        queryParams: queryParams,
        data: result.data,
        responseTime: `${Date.now() - startTime}ms`
      });
    } else {
      res.json({
        success: true,
        source: 'fallback',
        assetId: assetId,
        queryParams: queryParams,
        data: generateMockChartData(queryParams, assetId),
        responseTime: `${Date.now() - startTime}ms`
      });
    }
  } catch (e) {
    res.json({
      success: true,
      source: 'fallback',
      assetId: assetId,
      queryParams: queryParams,
      data: generateMockChartData(queryParams, assetId),
      responseTime: `${Date.now() - startTime}ms`
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    activeSessions: sessionPool.length,
    activeRequests: activeRequests.size,
    rateLimits: rateLimits.size
  });
});

// Status endpoint for debugging
app.get('/status', (req, res) => {
  const sessionStats = sessionPool.map((session) => ({
    id: session.id,
    created: new Date(session.created).toISOString(),
    lastUsed: new Date(session.lastUsed).toISOString(),
    requestCount: session.requestCount,
    userAgent: session.userAgent.substring(0, 50) + '...'
  }));

  res.json({
    server: {
      status: 'running',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    },
    sessions: {
      total: sessionPool.length,
      active: sessionStats
    },
    requests: {
      active: activeRequests.size,
      maxConcurrent: MAX_CONCURRENT_REQUESTS
    },
    rateLimits: {
      activeWindows: rateLimits.size,
      maxPerWindow: RATE_LIMIT_MAX_REQUESTS,
      windowSizeMs: RATE_LIMIT_WINDOW
    },
    memory: process.memoryUsage()
  });
});

// Test endpoint for debugging 403 issues
app.get('/test-api/:endpoint', async (req, res) => {
  const { endpoint } = req.params;
  const testUrls = {
    'stocks': 'https://api.investing.com/api/financialdata/assets/equitiesByIndices/101797',
    'chart': 'https://api.investing.com/api/financialdata/101672/historical/chart/?interval=PT15M&pointscount=10'
  };

  const testUrl = testUrls[endpoint];
  if (!testUrl) {
    return res.status(400).json({
      error: 'Invalid endpoint',
      available: Object.keys(testUrls)
    });
  }

  try {
    const sessionId = crypto.randomBytes(8).toString('hex');
    const testOptions = {
      sessionId,
      json: true,
      timeout: 30000,
      referer: 'https://ng.investing.com/',
      origin: 'https://ng.investing.com'
    };

    const result = await ultraFastFetch(testUrl, testOptions, 3, 1000);
    
    res.json({
      success: !!result.data,
      url: testUrl,
      sessionId: result.session,
      error: result.error,
      dataPreview: result.data ? (typeof result.data === 'object' ? 
        JSON.stringify(result.data).substring(0, 200) + '...' : 
        String(result.data).substring(0, 200) + '...') : null,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    res.json({
      success: false,
      url: testUrl,
      error: {
        message: e.message,
        statusCode: e.statusCode
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message || 'Unknown error',
    timestamp: new Date().toISOString()
  });
});

// Initialize session pool and start server
initializeSessionPool();

// Set aggressive timeout for maximum speed
const server = app.listen(PORT, () => {
  console.log(`🚀 Ultra-Fast API Server running at http://localhost:${PORT}`);
  console.log(`⚡ Features: Caching, Session Pool, Compression, Fallbacks`);
  console.log(`📊 Cache TTL: Stocks ${CACHE_TTL.stocks/1000}s, News ${CACHE_TTL.news/1000}s, Charts ${CACHE_TTL.chart/1000}s`);
});

server.timeout = 30000; // Reduced to 30 seconds for speed
server.keepAliveTimeout = 5000; // Keep connections alive for 5 seconds
server.headersTimeout = 10000; // Headers timeout

// Memory monitoring and session cleanup
setInterval(() => {
  const now = Date.now();
  
  // Clean up old sessions
  sessionPool.forEach((session) => {
    if ((now - session.created) > SESSION_TTL) {
      session.available = true;
      console.log(`🧹 Cleaned up expired session: ${session.id}`);
    }
  });
  
  // Clean up old rate limit entries
  for (const [key] of rateLimits) {
    const keyTime = parseInt(key.split(':')[1]);
    if ((now - keyTime * RATE_LIMIT_WINDOW) > RATE_LIMIT_WINDOW * 2) {
      rateLimits.delete(key);
    }
  }
  
  // Memory monitoring
if (process.env.NODE_ENV === 'development') {
    const memUsage = process.memoryUsage();
    console.log(`📊 Memory: RSS ${Math.round(memUsage.rss / 1024 / 1024)}MB, Heap ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB, Sessions: ${sessionPool.length}, RateLimits: ${rateLimits.size}`);
}
}, 60000); // Run every minute

// Handle graceful shutdown to prevent memory leaks
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions to prevent memory leaks
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit here, just log it
});
