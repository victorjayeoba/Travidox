"""
Trading Bot for Virtual Accounts using Firebase Firestore
"""

import time
from typing import Dict, Any, List, Optional
from datetime import datetime

# Import Firebase functions
from db import (
    get_virtual_account,
    update_virtual_account,
    get_virtual_positions,
    add_virtual_position,
    close_virtual_position,
    get_trading_history,
    add_trading_history,
    update_virtual_position
)

# Import market data provider
from market_data import get_market_data_provider

class TradingBot:
    def __init__(self):
        """Initialize the trading bot with Firebase Firestore for data storage"""
        print("Trading bot initialized with Firebase Firestore")
        self.market_data = get_market_data_provider()
    
    def get_account_info(self, user_id: str) -> Dict[str, Any]:
        """Get virtual account info for a user"""
        account = get_virtual_account(user_id)
        
        # Update account equity based on open positions
        positions = self.get_positions(user_id)
        floating_pnl = 0.0
        
        for position in positions:
            if position.get("profit_loss") is not None:
                floating_pnl += position.get("profit_loss", 0.0)
        
        # Update account
        account["floating_pnl"] = floating_pnl
        account["equity"] = account.get("balance", 1000.0) + floating_pnl
        
        # Convert any non-serializable objects to strings
        for key, value in list(account.items()):
            if not isinstance(value, (str, int, float, bool, list, dict)) or value is None:
                account[key] = str(value)
        
        # Save updated account
        update_virtual_account(user_id, account)
        
        return account
    
    def get_positions(self, user_id: str) -> List[Dict[str, Any]]:
        """Get virtual positions for a user and update their current prices"""
        positions = get_virtual_positions(user_id)
        updated_positions = []
        
        # Update current prices and profit/loss for each position
        for position in positions:
            if not position.get("closed", False):
                # Get current price
                symbol = position.get("symbol")
                order_type = position.get("order_type")
                
                try:
                    # Get real market price
                    quote = self.market_data.get_forex_quote(symbol)
                    
                    if "error" not in quote or not quote["error"]:
                        # Use appropriate price based on order type
                        current_price = quote["bid"] if order_type == "BUY" else quote["ask"]
                        
                        # Update position with current price
                        position["current_price"] = current_price
                        
                        # Calculate profit/loss
                        open_price = position.get("open_price", 0.0)
                        volume = position.get("volume", 0.0)
                        
                        # Calculate price difference based on order type
                        if order_type == "BUY":
                            price_diff = current_price - open_price
                        else:  # SELL
                            price_diff = open_price - current_price
                        
                        # Calculate profit/loss (volume in lots * price difference * 100)
                        # Using smaller multiplier for more reasonable P&L values in demo account
                        profit_loss = price_diff * volume * 100
                        position["profit_loss"] = round(profit_loss, 2)
                        
                        # Update position in database with current price and profit/loss
                        position_id = position.get("position_id")
                        if position_id:
                            update_data = {
                                "current_price": current_price,
                                "profit_loss": round(profit_loss, 2),
                                "last_updated": datetime.now().isoformat()
                            }
                            update_virtual_position(user_id, position_id, update_data)
                    else:
                        # Use existing price if available, or fallback to open price
                        current_price = position.get("current_price", position.get("open_price", 0.0))
                        position["current_price"] = current_price
                        
                        # Calculate profit/loss with existing price
                        open_price = position.get("open_price", 0.0)
                        volume = position.get("volume", 0.0)
                        
                        if order_type == "BUY":
                            price_diff = current_price - open_price
                        else:  # SELL
                            price_diff = open_price - current_price
                        
                        profit_loss = price_diff * volume * 100
                        position["profit_loss"] = round(profit_loss, 2)
                except Exception as e:
                    print(f"Error updating position price: {str(e)}")
                    # Keep existing values if there's an error
            
            # Convert any non-serializable objects to strings
            for key, value in list(position.items()):
                if not isinstance(value, (str, int, float, bool, list, dict)) or value is None:
                    position[key] = str(value)
            
            updated_positions.append(position)
        
        return updated_positions
    
    def get_trading_history(self, user_id: str) -> List[Dict[str, Any]]:
        """Get trading history for a user"""
        history = get_trading_history(user_id)
        return history
    
    def place_order(self, user_id: str, symbol: str, order_type: str, volume: float, 
                   stop_loss: Optional[float] = None, take_profit: Optional[float] = None) -> Dict[str, Any]:
        """Place a virtual order using real market prices"""
        try:
            # Get real market price from Alpha Vantage
            quote = self.market_data.get_forex_quote(symbol)
            
            if "error" in quote and quote["error"]:
                return {
                    "success": False,
                    "error": f"Failed to get market price: {quote['error']}"
                }
            
            # Use appropriate price based on order type
            current_price = quote["ask"] if order_type == "BUY" else quote["bid"]
            
            # Create position data
            position_data = {
                "symbol": symbol,
                "order_type": order_type.upper(),
                "volume": volume,
                "open_price": current_price,
                "current_price": current_price,
                "stop_loss": stop_loss,
                "take_profit": take_profit,
                "profit_loss": 0.0,
                "closed": False,
                "open_time": datetime.now().isoformat()
            }
            
            # Add to positions
            position_id = add_virtual_position(user_id, position_data)
            
            if not position_id:
                return {
                    "success": False,
                    "error": "Failed to create position"
                }
            
            # Update account margin
            account = get_virtual_account(user_id)
            margin_used = volume * current_price * 0.01  # Simplified margin calculation (1% margin)
            account["margin"] = account.get("margin", 0.0) + margin_used
            account["free_margin"] = account.get("balance", 1000.0) - account["margin"]
            
            update_virtual_account(user_id, account)
            
            return {
                "success": True,
                "position_id": position_id,
                "symbol": symbol,
                "order_type": order_type,
                "volume": volume,
                "price": current_price,
                "message": f"Order placed successfully: {order_type} {volume} {symbol} at {current_price}"
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Error placing order: {str(e)}"
            }
    
    def close_position(self, user_id: str, position_id: str) -> Dict[str, Any]:
        """Close a virtual position using real market prices"""
        # Get positions to find the one we want to close
        positions = get_virtual_positions(user_id)
        
        position = None
        for pos in positions:
            if pos.get("position_id") == position_id:
                position = pos
                break
        
        if position is None:
            return {"success": False, "error": "Position not found"}
        
        try:
            # Get real market price
            symbol = position["symbol"]
            order_type = position["order_type"]
            
            quote = self.market_data.get_forex_quote(symbol)
            
            if "error" in quote and quote["error"]:
                return {
                    "success": False,
                    "error": f"Failed to get market price: {quote['error']}"
                }
            
            # Use appropriate price based on order type (opposite of open)
            close_price = quote["bid"] if order_type == "BUY" else quote["ask"]
            
            # Calculate profit/loss
            open_price = position["open_price"]
            volume = position["volume"]
            
            # Calculate price difference based on order type
            if order_type == "BUY":
                price_diff = close_price - open_price
            else:  # SELL
                price_diff = open_price - close_price
            
            # Calculate profit/loss (volume in lots * price difference * 100)
            # Using smaller multiplier for more reasonable P&L values in demo account
            profit_loss = price_diff * volume * 100
            
            # Close the position in Firestore
            result = close_virtual_position(user_id, position_id, close_price, profit_loss)
            
            if not result:
                return {"success": False, "error": "Failed to close position"}
            
            # Update account balance
            account = get_virtual_account(user_id)
            account["balance"] = account.get("balance", 1000.0) + profit_loss
            account["margin"] = max(0, account.get("margin", 0.0) - (volume * open_price * 0.01))
            account["free_margin"] = account["balance"] - account["margin"]
            account["equity"] = account["balance"]
            
            update_virtual_account(user_id, account)
            
            return {
                "success": True,
                "position_id": position_id,
                "symbol": symbol,
                "close_price": close_price,
                "profit_loss": round(profit_loss, 2),
                "message": f"Position closed successfully with P&L: ${round(profit_loss, 2)}"
            }
        except Exception as e:
            return {"success": False, "error": f"Error closing position: {str(e)}"}

# Singleton instance
_trading_bot = None

def get_trading_bot():
    """Get or create a trading bot instance"""
    global _trading_bot
    if _trading_bot is None:
        _trading_bot = TradingBot()
    return _trading_bot 