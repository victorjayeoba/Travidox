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

# Path to store account information
ACCOUNTS_DIR = os.path.expanduser("~/mt_accounts")
# Path to store order information
ORDERS_DIR = os.path.expanduser("~/mt_orders")

def ensure_orders_dir():
    """Ensure the orders directory exists"""
    if not os.path.exists(ORDERS_DIR):
        os.makedirs(ORDERS_DIR)

def place_market_order(order_file):
    """
    Place a market order using the provided order parameters.
    
    Args:
        order_file: Path to the JSON order parameters file
        
    Returns:
        Dictionary with order result
    """
    try:
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
        
        # In a real implementation, this is where you would:
        # 1. Connect to the MetaTrader terminal
        # 2. Use the terminal's API to place the market order
        # 3. Get the order result
        
        # For this example, we'll simulate a successful order placement
        # Generate a random order ID
        order_id = random.randint(100000, 999999)
        
        # Simulate current market price
        price = 1.1000 if symbol.upper() == "EURUSD" else 1.3000
        
        # Create order result
        order_result = {
            "order_id": order_id,
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
        ensure_orders_dir()
        order_file = os.path.join(ORDERS_DIR, f"{order_id}.json")
        with open(order_file, 'w') as f:
            json.dump(order_result, f)
        
        return {
            "success": True,
            "order": order_result
        }
        
    except Exception as e:
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