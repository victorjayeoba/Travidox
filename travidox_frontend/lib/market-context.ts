// Market context utility for AI assistant
export interface MarketData {
  stocks: Array<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
  }>;
  indices: Array<{
    name: string;
    value: number;
    change: number;
    changePercent: number;
  }>;
  news: Array<{
    title: string;
    summary: string;
    timestamp: string;
  }>;
}

export async function getMarketContext(): Promise<string> {
  try {
    // Fetch market data from various endpoints
    const [stocksResponse, newsResponse] = await Promise.allSettled([
      fetch('/api/nigeria-stocks'),
      fetch('/api/nigeria-news')
    ]);

    let marketContext = "CURRENT MARKET DATA:\n\n";

    // Add stock data
    if (stocksResponse.status === 'fulfilled' && stocksResponse.value.ok) {
      const stocksData = await stocksResponse.value.json();
      if (stocksData.stocks && stocksData.stocks.length > 0) {
        marketContext += "TOP STOCKS:\n";
        stocksData.stocks.slice(0, 10).forEach((stock: any) => {
          const symbol = stock.symbol || stock.ticker || 'N/A';
          const name = stock.name || stock.companyName || 'N/A';
          const price = stock.price || stock.currentPrice || 0;
          const change = stock.change || stock.priceChange || 0;
          const changePercent = stock.changePercent || stock.percentChange || 0;
          
          marketContext += `- ${symbol} (${name}): ₦${price.toFixed(2)} `;
          marketContext += `${change >= 0 ? '+' : ''}${change.toFixed(2)} `;
          marketContext += `(${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)\n`;
        });
        marketContext += "\n";
      }
    }

    // Add news data
    if (newsResponse.status === 'fulfilled' && newsResponse.value.ok) {
      const newsData = await newsResponse.value.json();
      if (newsData.articles && newsData.articles.length > 0) {
        marketContext += "RECENT NEWS:\n";
        newsData.articles.slice(0, 5).forEach((article: any, index: number) => {
          marketContext += `${index + 1}. ${article.title || article.headline}\n`;
          if (article.summary || article.description) {
            marketContext += `   ${(article.summary || article.description).substring(0, 150)}...\n`;
          }
        });
        marketContext += "\n";
      }
    }

    // Add general market insights
    marketContext += "MARKET INSIGHTS:\n";
    marketContext += "- Nigerian Stock Exchange (NGX) is the primary stock exchange\n";
    marketContext += "- Major sectors include Banking, Oil & Gas, Consumer Goods, and Industrial\n";
    marketContext += "- Key indices: NGX All-Share Index, NGX 30 Index\n";
    marketContext += "- Currency: Nigerian Naira (₦)\n";
    marketContext += "- Trading hours: 10:00 AM - 2:30 PM WAT (Monday-Friday)\n\n";

    return marketContext;
  } catch (error) {
    console.error('Error fetching market context:', error);
    return `MARKET CONTEXT:\n
- Focus on Nigerian Stock Exchange (NGX) stocks
- Major Nigerian companies include Dangote Cement, GTBank, Zenith Bank, MTN Nigeria, BUA Cement
- Key sectors: Banking, Oil & Gas, Consumer Goods, Telecommunications
- Always encourage proper risk management and diversification
- Remind users that past performance doesn't guarantee future results\n\n`;
  }
}

export function getDefaultMarketContext(): string {
  return `NIGERIAN MARKET OVERVIEW:\n
TOP COMPANIES TO WATCH:
- DANGCEM (Dangote Cement): Nigeria's largest cement producer
- GTCO (GTBank): Leading commercial bank
- ZENITH (Zenith Bank): One of Nigeria's biggest banks
- MTNN (MTN Nigeria): Major telecommunications company
- BUACEMENT (BUA Cement): Major cement manufacturer
- NESTLNG (Nestle Nigeria): Consumer goods giant
- WAPCO (Lafarge Africa): Building materials company
- FBNH (FBN Holdings): Financial services conglomerate

MARKET SECTORS:
- Banking: Highly liquid, dividend-paying stocks
- Oil & Gas: Sensitive to crude oil prices
- Consumer Goods: Defensive stocks with steady demand
- Industrial: Infrastructure and manufacturing companies
- Agriculture: Food production and agribusiness

TRADING TIPS:
- Market opens 10:00 AM, closes 2:30 PM WAT
- Settlement is T+3 (trade date plus 3 business days)
- Minimum board lot varies by stock price
- Consider naira devaluation impact on investments
- Diversify across sectors for risk management\n\n`;
} 