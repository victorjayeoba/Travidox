const express = require('express');
const cloudscraper = require('cloudscraper');

const app = express();
const PORT = 8085;

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
      await new Promise(resolve => setTimeout(resolve, delay || baseDelay + Math.floor(Math.random() * 500)));
    }
  }

  // Ensure we're not returning large error objects
  if (lastError) {
    const { statusCode, statusMessage, message } = lastError;
    lastError = { statusCode, statusMessage, message };
  }

  return { data: null, error: lastError };
}

app.get('/nigeria-stocks', async (req, res) => {
  const url = "https://api.investing.com/api/financialdata/assets/equitiesByIndices/101797?fields-list=id%2Cname%2Csymbol%2CisCFD%2Chigh%2Clow%2Clast%2ClastPairDecimal%2Cchange%2CchangePercent%2Cvolume%2Ctime%2CisOpen%2Curl%2Cflag%2CcountryNameTranslated%2CexchangeId%2CperformanceDay%2CperformanceWeek%2CperformanceMonth%2CperformanceYtd%2CperformanceYear%2Cperformance3Year%2CtechnicalHour%2CtechnicalDay%2CtechnicalWeek%2CtechnicalMonth%2CavgVolume%2CfundamentalMarketCap%2CfundamentalRevenue%2CfundamentalRatio%2CfundamentalBeta%2CpairType&country-id=20&filter-domain=&page=0&page-size=0&limit=0&include-additional-indices=false&include-major-indices=false&include-other-indices=false&include-primary-sectors=false&include-market-overview=false"; // your full url here

  try {
    // Add a timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 60000)
    );
    
    const fetchPromise = fetchWithRetries(url, 7, 1500);
    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

    if (data) {
      // Send the response and explicitly clean up large objects
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

// Handle graceful shutdown to prevent memory leaks
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
