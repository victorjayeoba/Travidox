const express = require('express');
const cloudscraper = require('cloudscraper');
const cheerio = require('cheerio');

const app = express();
const PORT = 8085;

// Memory optimization: Limit concurrent requests
const activeRequests = new Set();
const MAX_CONCURRENT_REQUESTS = 10;

// Helper function to fetch data with retries using cloudscraper
async function fetchWithRetries(url, maxRetries = 5, baseDelay = 1000) {
  let attempt = 0;
  let lastError = null;

  while (attempt < maxRetries) {
    try {
      const body = await cloudscraper.get({
        uri: url,
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.investing.com/',
          'Origin': 'https://www.investing.com',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        },
        json: true, // auto parse JSON response
        resolveWithFullResponse: false, // Don't keep the full response object
        timeout: 30000 // Set a timeout to prevent hanging connections
      });

      return { data: body, error: null };
    } catch (err) {
      lastError = err;
      // Check for Cloudflare specific errors or rate limiting and retry with exponential backoff
      if (
        (err.statusCode === 429) ||
        (err.statusCode === 403 && err.message && err.message.includes('Just a moment'))
      ) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.floor(Math.random() * 500);
        await new Promise(resolve => setTimeout(resolve, delay));
        attempt++;
        continue;
      }
      // Other errors: retry a few times, then give up
      attempt++;
      const delay = baseDelay + Math.floor(Math.random() * 500);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Ensure we're not returning large error objects
  if (lastError) {
    const { statusCode, statusMessage, message } = lastError;
    lastError = { statusCode, statusMessage, message };
  }

  return { data: null, error: lastError };
}

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
        
        // Get date from the specific structure: .jeg_meta_date a
        const date = $element.find('.jeg_meta_date a').first().text().trim() ||
                    $element.find('.post-date, .entry-date, .date, time').first().text().trim() ||
                    $element.find('[datetime]').first().attr('datetime') ||
                    'Date not available';
        
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
            date: date.replace(/\s+/g, ' ').trim().substring(0, 50), // Limit date length
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
  const url = "https://api.investing.com/api/financialdata/assets/equitiesByIndices/101797?fields-list=id%2Cname%2Csymbol%2CisCFD%2Chigh%2Clow%2Clast%2ClastPairDecimal%2Cchange%2CchangePercent%2Cvolume%2Ctime%2CisOpen%2Curl%2Cflag%2CcountryNameTranslated%2CexchangeId%2CperformanceDay%2CperformanceWeek%2CperformanceMonth%2CperformanceYtd%2CperformanceYear%2Cperformance3Year%2CtechnicalHour%2CtechnicalDay%2CtechnicalWeek%2CtechnicalMonth%2CavgVolume%2CfundamentalMarketCap%2CfundamentalRevenue%2CfundamentalRatio%2CfundamentalBeta%2CpairType&country-id=20&filter-domain=&page=0&page-size=0&limit=0&include-additional-indices=false&include-major-indices=false&include-other-indices=false&include-primary-sectors=false&include-market-overview=false";

  let data = null;
  let error = null;

  try {
    // Add a timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 60000)
    );
    
    const fetchPromise = fetchWithRetries(url, 7, 1500);
    const result = await Promise.race([fetchPromise, timeoutPromise]);
    
    data = result.data;
    error = result.error;

    if (data) {
      // Send the response
      res.json(data);
    } else {
      res.status(503).json({
        error: "Unable to fetch data after multiple attempts due to rate limiting or anti-bot protection.",
        status: (error && error.statusCode) || 503,
        statusText: (error && error.statusMessage) || "Service Unavailable",
        suggestion: "Please try again later."
      });
    }
  } catch (e) {
    console.error('Unexpected error:', e.message || e);
    res.status(500).json({ 
      error: "Internal server error", 
      details: e.message || String(e).substring(0, 200) // Limit error message size
    });
  } finally {
    // Explicitly clear variables to help garbage collection
    data = null;
    error = null;
  }
});

app.get('/nigeria-news', async (req, res) => {
  let articles = null;
  
  try {
    console.log('Fetching Nigeria market news...');
    
    // Add a timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 120000)
    );
    
    const scrapePromise = scrapeNairametrics();
    articles = await Promise.race([scrapePromise, timeoutPromise]);

    if (articles && articles.length > 0) {
      res.json({
        success: true,
        count: articles.length,
        data: articles,
        source: 'Nairametrics',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        success: false,
        error: "No articles found or unable to scrape data",
        suggestion: "Please try again later.",
        timestamp: new Date().toISOString()
      });
    }
  } catch (e) {
    console.error('Error fetching Nigeria news:', e.message || e);
    res.status(500).json({ 
      success: false,
      error: "Internal server error", 
      details: e.message || String(e).substring(0, 200),
      timestamp: new Date().toISOString()
    });
  } finally {
    // Explicitly clear variables to help garbage collection
    articles = null;
  }
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message || 'Unknown error'
  });
});

// Set a reasonable timeout for the server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

server.timeout = 120000; // 2 minute timeout

// Memory monitoring (optional - can be enabled for debugging)
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const memUsage = process.memoryUsage();
    console.log(`Memory Usage: RSS: ${Math.round(memUsage.rss / 1024 / 1024)}MB, Heap: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
  }, 60000); // Log every minute
}

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
