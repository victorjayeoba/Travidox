const cloudscraper = require('cloudscraper');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

async function scrapeNairametrics() {
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
    
    const response = await cloudscraper(options);
    
    // Check if we're getting the Cloudflare challenge page
    if (response.includes('Just a moment...') || response.includes('challenge') || response.includes('cf-mitigated')) {
      console.log('Cloudflare challenge detected, trying alternative approach...');
      
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
      
      const retryResponse = await cloudscraper(alternativeOptions);
      
      if (retryResponse.includes('Just a moment...')) {
        throw new Error('Unable to bypass Cloudflare protection after retry');
      }
      
      return parseResponse(retryResponse);
    }
    
    return parseResponse(response);
    
  } catch (error) {
    console.error('Error scraping Nairametrics:', error.message);
    
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
    
    // Write fallback data
    try {
      const outputPath = path.join(__dirname, 'f.json');
      await fs.writeFile(outputPath, JSON.stringify(fallbackArticles, null, 2));
    } catch (writeError) {
      console.error('Error writing fallback data:', writeError.message);
    }
    
    return fallbackArticles;
  }
}

async function parseResponse(response) {
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
    if ($(selector).length > 0) {
      console.log(`Found articles using selector: ${selector}`);
      
      $(selector).each((i, element) => {
        // Get title from the specific structure: .jeg_post_title a
        const title = $(element).find('.jeg_post_title a').first().text().trim() ||
                     $(element).find('h2 a, h3 a, .post-title, .entry-title, .title').first().text().trim() ||
                     $(element).find('a').first().text().trim();
        
        // Get link from the specific structure: .jeg_post_title a href
        const link = $(element).find('.jeg_post_title a').first().attr('href') ||
                    $(element).find('h2 a, h3 a, .post-title a, .entry-title a, .title a').first().attr('href') ||
                    $(element).find('a').first().attr('href');
        
        // Get date from the specific structure: .jeg_meta_date a
        const date = $(element).find('.jeg_meta_date a').first().text().trim() ||
                    $(element).find('.post-date, .entry-date, .date, time').first().text().trim() ||
                    $(element).find('[datetime]').first().attr('datetime') ||
                    'Date not available';
        
        // Get category from the specific structure: .jeg_post_category a
        const category = $(element).find('.jeg_post_category a').first().text().trim() ||
                        'Uncategorized';
        
        // Get author from the specific structure: .jeg_meta_author a
        const author = $(element).find('.jeg_meta_author a').first().text().trim() ||
                      'Unknown Author';
        
        // Only add if we have at least a title and link
        if (title && link && title.length > 10) {
          articles.push({
            title,
            link: link.startsWith('http') ? link : `https://nairametrics.com${link}`,
            date: date.replace(/\s+/g, ' ').trim(),
            category,
            author,
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
    // Fallback: look for any links that might be articles
    $('a').each((i, element) => {
      const href = $(element).attr('href');
      const text = $(element).text().trim();
      
      if (href && text && text.length > 20 && 
          (href.includes('/') && !href.includes('javascript:') && !href.includes('mailto:'))) {
        articles.push({
          title: text,
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
  
  // Ensure directory exists
  const outputPath = path.join(__dirname, 'f.json');
  
  // Write articles to f.json
  await fs.writeFile(outputPath, JSON.stringify(limitedArticles, null, 2));
  
  // Log the contents of f.json
  const fileContents = await fs.readFile(outputPath, 'utf8');
  console.log('Contents of f.json:', fileContents);
  console.log(`Successfully scraped ${limitedArticles.length} articles`);
  
  return limitedArticles;
}

// Only run if this file is executed directly
if (require.main === module) {
  scrapeNairametrics()
    .then(articles => {
      console.log('Scraping completed successfully');
    })
    .catch(error => {
      console.error('Scraping failed:', error.message);
      process.exit(1);
    });
}

module.exports = scrapeNairametrics;