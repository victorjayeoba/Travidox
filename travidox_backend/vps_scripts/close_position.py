#!/usr/bin/env python
"""
Script to close a position for a MetaTrader account.
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

def close_position(account_id, position_id):
    """
    Close a position for the specified account.
    
    Args:
        account_id: The account identifier
        position_id: The position identifier
        
    Returns:
        Dictionary with close operation result
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
            
            # Get position info
            position = mt5.positions_get(ticket=int(position_id))
            
            if not position:
                return {
                    "success": False,
                    "error": f"Position {position_id} not found"
                }
            
            position = position[0]._asdict()
            
            # Prepare close request
            request = {
                "action": mt5.TRADE_ACTION_DEAL,
                "symbol": position["symbol"],
                "volume": position["volume"],
                "type": mt5.ORDER_TYPE_SELL if position["type"] == 0 else mt5.ORDER_TYPE_BUY,  # Opposite direction
                "position": int(position_id),
                "price": position["price_current"],
                "deviation": 20,
                "magic": 12345,
                "comment": "Travidox close position",
                "type_time": mt5.ORDER_TIME_GTC,
                "type_filling": mt5.ORDER_FILLING_IOC,
            }
            
            # Send order
            result = mt5.order_send(request)
            
            if result.retcode != mt5.TRADE_RETCODE_DONE:
                return {
                    "success": False,
                    "error": f"Close position failed: {result.comment} (Code: {result.retcode})"
                }
            
            return {
                "success": True,
                "message": f"Position {position_id} closed successfully",
                "close_details": {
                    "order_id": result.order,
                    "position_id": position_id,
                    "symbol": position["symbol"],
                    "volume": position["volume"],
                    "price": result.price,
                    "time": datetime.now().isoformat()
                }
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
    parser = argparse.ArgumentParser(description="Close a position")
    parser.add_argument('--account_id', required=True, help='The account identifier')
    parser.add_argument('--position_id', required=True, help='The position identifier')
    args = parser.parse_args()
    
    result = close_position(args.account_id, args.position_id)
    print(json.dumps(result))

if __name__ == "__main__":
    main() 