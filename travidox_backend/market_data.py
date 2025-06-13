"""
Market Data Provider using Alpha Vantage API
"""

import requests
import os
import time
from typing import Dict, Any, Optional
from datetime import datetime

# Alpha Vantage API endpoint
ALPHA_VANTAGE_URL = "https://www.alphavantage.co/query"

# Cache to store market data and reduce API calls
# Format: {"symbol": {"bid": 1.1234, "ask": 1.1236, "timestamp": 1234567890}}
price_cache = {}
CACHE_EXPIRY = 60  # Cache expiry in seconds

class AlphaVantageProvider:
    """Alpha Vantage API provider for forex data"""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize with API key"""
        self.api_key = api_key or os.getenv("ALPHA_VANTAGE_API_KEY", "RDJ0NL7BHOPIA44E")
    
    def get_forex_quote(self, symbol: str) -> Dict[str, Any]:
        """
        Get real-time forex quote for a symbol
        
        Args:
            symbol: Forex symbol (e.g., "EURUSD")
        
        Returns:
            Dict with bid, ask prices and timestamp
        """
        # Check cache first
        now = time.time()
        if symbol in price_cache and (now - price_cache[symbol]["timestamp"]) < CACHE_EXPIRY:
            return price_cache[symbol]
        
        # Parse symbol for Alpha Vantage format (EURUSD -> EUR/USD)
        if len(symbol) == 6 and "/" not in symbol:
            from_currency = symbol[:3]
            to_currency = symbol[3:]
        else:
            parts = symbol.split("/")
            if len(parts) == 2:
                from_currency, to_currency = parts
            else:
                return {
                    "error": f"Invalid symbol format: {symbol}",
                    "bid": None,
                    "ask": None
                }
        
        # Make API request
        params = {
            "function": "CURRENCY_EXCHANGE_RATE",
            "from_currency": from_currency,
            "to_currency": to_currency,
            "apikey": self.api_key
        }
        
        try:
            response = requests.get(ALPHA_VANTAGE_URL, params=params)
            data = response.json()
            
            if "Realtime Currency Exchange Rate" in data:
                exchange_rate = float(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"])
                
                # Alpha Vantage doesn't provide bid/ask directly, so we simulate a spread
                spread = exchange_rate * 0.0002  # 2 pips spread (0.02%)
                bid = exchange_rate - (spread / 2)
                ask = exchange_rate + (spread / 2)
                
                # Format the result
                result = {
                    "bid": round(bid, 5),
                    "ask": round(ask, 5),
                    "timestamp": now,
                    "last_updated": data["Realtime Currency Exchange Rate"]["6. Last Refreshed"]
                }
                
                # Update cache
                price_cache[symbol] = result
                
                return result
            else:
                # Check for error messages
                if "Error Message" in data:
                    return {
                        "error": data["Error Message"],
                        "bid": None,
                        "ask": None
                    }
                elif "Information" in data:
                    return {
                        "error": f"API limit reached: {data['Information']}",
                        "bid": None,
                        "ask": None
                    }
                else:
                    return {
                        "error": "Unknown error from Alpha Vantage API",
                        "bid": None,
                        "ask": None
                    }
                
        except Exception as e:
            return {
                "error": f"Error fetching forex data: {str(e)}",
                "bid": None,
                "ask": None
            }

# Create a singleton instance
_alpha_vantage = None

def get_market_data_provider() -> AlphaVantageProvider:
    """Get or create an Alpha Vantage provider instance"""
    global _alpha_vantage
    if _alpha_vantage is None:
        _alpha_vantage = AlphaVantageProvider()
    return _alpha_vantage 