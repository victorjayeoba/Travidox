#!/usr/bin/env python
"""
Script to place a market order using a connected MetaTrader account.
This script is executed on the VPS by the backend server.
"""

import argparse
import json
import os
import sys
import time
import random
from datetime import datetime
import MetaTrader5 as mt5

# Import configuration
from config import MT_TERMINAL_PATH, ACCOUNTS_DIR, ORDERS_DIR, ensure_directories

def place_market_order(order_file):
    """
    Place a market order using the provided order parameters.
    
    Args:
        order_file: Path to the JSON order parameters file
        
    Returns:
        Dictionary with order result
    """
    try:
        # Ensure directories exist
        ensure_directories()
        
        # Read the order parameters
        with open(order_file, 'r') as f:
            order_params = json.load(f)
        
        # Extract order details
        account_id = order_params.get('account_id')
        symbol = order_params.get('symbol')
        order_type = order_params.get('order_type')
        volume = order_params.get('volume')
        stop_loss = order_params.get('stop_loss')
        take_profit = order_params.get('take_profit')
        
        if not all([account_id, symbol, order_type, volume]):
            return {
                "success": False,
                "error": "Missing required parameters: account_id, symbol, order_type, or volume"
            }
        
        # Check if the account exists
        account_file = os.path.join(ACCOUNTS_DIR, f"{account_id}.json")
        if not os.path.exists(account_file):
            return {
                "success": False,
                "error": f"Account {account_id} not found"
            }
            
        # Read account information
        with open(account_file, 'r') as f:
            account_info = json.load(f)
            
        login = account_info.get('login')
        server = account_info.get('server')
        
        # Initialize MetaTrader
        if not mt5.initialize(path=MT_TERMINAL_PATH):
            return {
                "success": False,
                "error": f"Failed to initialize MetaTrader: {mt5.last_error()}"
            }
            
        # Login to the account
        authorized = mt5.login(
            login=int(login),
            server=server
        )
        
        if not authorized:
            error = mt5.last_error()
            mt5.shutdown()
            return {
                "success": False,
                "error": f"Failed to login: {error}"
            }
            
        # Prepare order request
        order_type_mt5 = mt5.ORDER_TYPE_BUY if order_type == "BUY" else mt5.ORDER_TYPE_SELL
        
        # Get current price
        symbol_info = mt5.symbol_info(symbol)
        if symbol_info is None:
            mt5.shutdown()
            return {
                "success": False,
                "error": f"Symbol {symbol} not found"
            }
            
        # Make sure the symbol is selected in Market Watch
        if not symbol_info.visible:
            if not mt5.symbol_select(symbol, True):
                mt5.shutdown()
                return {
                    "success": False,
                    "error": f"Failed to select symbol {symbol}"
                }
                
        price = symbol_info.ask if order_type == "BUY" else symbol_info.bid
        
        # Prepare request
        request = {
            "action": mt5.TRADE_ACTION_DEAL,
            "symbol": symbol,
            "volume": float(volume),
            "type": order_type_mt5,
            "price": price,
            "deviation": 20,  # Allow price deviation in points
            "magic": 12345,   # Expert Advisor ID
            "comment": "Travidox order",
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": mt5.ORDER_FILLING_IOC,
        }
        
        # Add stop loss and take profit if provided
        if stop_loss:
            request["sl"] = float(stop_loss)
        if take_profit:
            request["tp"] = float(take_profit)
            
        # Send order
        result = mt5.order_send(request)
        
        if result.retcode != mt5.TRADE_RETCODE_DONE:
            mt5.shutdown()
            return {
                "success": False,
                "error": f"Order failed: {result.comment} (Code: {result.retcode})"
            }
            
        # Get order details
        order_info = result._asdict()
        
        # Create order result
        order_result = {
            "order_id": order_info["order"],
            "account_id": account_id,
            "symbol": symbol,
            "type": order_type,
            "volume": volume,
            "price": price,
            "stop_loss": stop_loss,
            "take_profit": take_profit,
            "time": datetime.now().isoformat(),
            "status": "filled"
        }
        
        # Save the order information
        order_file = os.path.join(ORDERS_DIR, f"{order_info['order']}.json")
        with open(order_file, 'w') as f:
            json.dump(order_result, f)
            
        # Shutdown MetaTrader
        mt5.shutdown()
        
        return {
            "success": True,
            "order": order_result
        }
        
    except Exception as e:
        # Make sure to shutdown MetaTrader if there was an error
        try:
            mt5.shutdown()
        except:
            pass
            
        return {
            "success": False,
            "error": str(e)
        }

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Place a market order")
    parser.add_argument('--order', required=True, help='Path to the order parameters JSON file')
    args = parser.parse_args()
    
    result = place_market_order(args.order)
    print(json.dumps(result))

if __name__ == "__main__":
    main() 