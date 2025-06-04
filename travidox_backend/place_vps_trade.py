#!/usr/bin/env python
"""
VPS Trade Placer

This script places a trade using the VPS connection.
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API base URL (adjust if your server runs on a different port)
API_URL = "http://localhost:8000"

# Check if we're in development mode
DEV_MODE = os.getenv("DEV_MODE", "false").lower() == "true"

# Firebase token for authentication (only needed in production mode)
FIREBASE_TOKEN = os.getenv("TEST_FIREBASE_TOKEN", "")

def get_headers():
    """Get request headers based on mode"""
    headers = {"Content-Type": "application/json"}
    
    # In production mode, add the Firebase token
    if not DEV_MODE and FIREBASE_TOKEN:
        headers["Authorization"] = f"Bearer {FIREBASE_TOKEN}"
        
    return headers

def print_response(response):
    """Print the response details"""
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")
    print("-" * 50)

def get_available_symbols():
    """Get available trading symbols"""
    print("\n🔍 Getting available symbols...")
    response = requests.get(f"{API_URL}/symbols", headers=get_headers())
    if response.status_code == 200:
        print("Available symbols:")
        symbols = response.json()
        for symbol in symbols:
            print(f"- {symbol}")
    else:
        print("Failed to get symbols")
        print_response(response)
    return response.status_code == 200

def place_trade(symbol, order_type, volume, stop_loss=None, take_profit=None):
    """Place a trade with the specified parameters"""
    print(f"\n🔍 Placing {order_type} order for {symbol}...")
    
    order_data = {
        "symbol": symbol,
        "order_type": order_type,  # "BUY" or "SELL"
        "volume": volume,
        "stop_loss": stop_loss,
        "take_profit": take_profit
    }
    
    # Remove None values
    order_data = {k: v for k, v in order_data.items() if v is not None}
    
    try:
        response = requests.post(
            f"{API_URL}/place-order",
            headers=get_headers(),
            json=order_data
        )
        print_response(response)
        
        if response.status_code == 200:
            print(f"✅ Order placed successfully")
            return True
        else:
            print(f"❌ Failed to place order")
            
            # Check for specific error codes
            if response.status_code == 500:
                try:
                    error_detail = response.json().get("detail", "")
                    if "No money" in error_detail:
                        print("ERROR: Insufficient funds in the trading account.")
                        print("Try using a smaller volume or adding funds to your account.")
                    elif "Symbol not found" in error_detail:
                        print("ERROR: The symbol you entered was not found.")
                        print("Make sure you're using the exact symbol name from the symbols list.")
                    else:
                        print(f"Error details: {error_detail}")
                except:
                    pass
            
            return False
    except Exception as e:
        print(f"Error placing order: {str(e)}")
        return False

def main():
    """Main function"""
    print("🚀 VPS Trade Placer")
    
    # Show current mode
    mode = "DEVELOPMENT" if DEV_MODE else "PRODUCTION"
    print(f"Running in {mode} mode")
    
    if not DEV_MODE and not FIREBASE_TOKEN:
        print("⚠️ WARNING: Running in production mode without a Firebase token")
        print("Either:")
        print("1. Set DEV_MODE=true in your .env file and restart the server")
        print("2. Set TEST_FIREBASE_TOKEN in your .env file with a valid token")
        return
    
    # Get available symbols first
    get_available_symbols()
    
    # Ask for trade parameters
    symbol = input("Enter symbol (e.g. EURUSDz): ").strip()
    order_type = input("Enter order type (BUY or SELL): ").strip().upper()
    
    # Validate order type
    if order_type not in ["BUY", "SELL"]:
        print("Invalid order type. Must be BUY or SELL.")
        return
    
    try:
        volume = float(input("Enter volume (default: 0.001, recommended range: 0.001-0.01): ").strip() or "0.001")
    except ValueError:
        print("Invalid volume. Using default of 0.001.")
        volume = 0.001
    
    # Stop loss and take profit are optional
    stop_loss_input = input("Enter stop loss price (optional, press Enter to skip): ").strip()
    take_profit_input = input("Enter take profit price (optional, press Enter to skip): ").strip()
    
    stop_loss = float(stop_loss_input) if stop_loss_input else None
    take_profit = float(take_profit_input) if take_profit_input else None
    
    # Place the trade
    place_trade(symbol, order_type, volume, stop_loss, take_profit)

if __name__ == "__main__":
    main() 