#!/usr/bin/env python
"""
Script to get open positions for a MetaTrader account.
This script is executed on the VPS by the backend server.
"""

import argparse
import json
import os
import sys
import MetaTrader5 as mt5
from datetime import datetime

# Import configuration
from config import MT_TERMINAL_PATH, ACCOUNTS_DIR

def get_positions(account_id):
    """
    Get open positions for the specified account.
    
    Args:
        account_id: The account identifier
        
    Returns:
        Dictionary with positions information
    """
    try:
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
        
        try:
            # Login to the account
            authorized = mt5.login(
                login=int(login),
                server=server
            )
            
            if not authorized:
                return {
                    "success": False,
                    "error": f"Failed to login: {mt5.last_error()}"
                }
            
            # Get all positions
            positions = mt5.positions_get()
            
            if positions is None:
                return {
                    "success": True,
                    "positions": []
                }
            
            # Format positions
            formatted_positions = []
            for position in positions:
                pos_dict = position._asdict()
                
                # Convert timestamp to ISO format
                time_open = datetime.fromtimestamp(pos_dict["time"]).isoformat() if pos_dict["time"] else None
                
                formatted_positions.append({
                    "position_id": pos_dict["ticket"],
                    "symbol": pos_dict["symbol"],
                    "type": "BUY" if pos_dict["type"] == 0 else "SELL",
                    "volume": pos_dict["volume"],
                    "open_price": pos_dict["price_open"],
                    "current_price": pos_dict["price_current"],
                    "open_time": time_open,
                    "profit": pos_dict["profit"],
                    "swap": pos_dict["swap"],
                    "stop_loss": pos_dict["sl"],
                    "take_profit": pos_dict["tp"]
                })
            
            return {
                "success": True,
                "positions": formatted_positions
            }
            
        finally:
            # Always shutdown MetaTrader
            mt5.shutdown()
        
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
    parser = argparse.ArgumentParser(description="Get open positions")
    parser.add_argument('--account_id', required=True, help='The account identifier')
    args = parser.parse_args()
    
    result = get_positions(args.account_id)
    print(json.dumps(result))

if __name__ == "__main__":
    main() 