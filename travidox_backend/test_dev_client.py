"""
Development Test Client

This script makes HTTP requests to test the API endpoints while in development mode.
No authentication token is needed when DEV_MODE=true is set in the .env file.
"""

import requests
import json
import os
from dotenv import load_dotenv
import MetaTrader5 as mt5

# Load environment variables
load_dotenv()

# API base URL
API_URL = "http://localhost:8000"

# Development MetaTrader credentials
DEV_MT_LOGIN = os.getenv("DEV_MT_LOGIN", "81378629")
DEV_MT_PASSWORD = os.getenv("DEV_MT_PASSWORD", "Jayeoba@112")
DEV_MT_SERVER = os.getenv("DEV_MT_SERVER", "Exness-MT5Trial10")

def print_response(response):
    """Print the response details"""
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")
    print("-" * 50)

def test_root():
    """Test the root endpoint"""
    print("\n🔍 Testing root endpoint...")
    response = requests.get(f"{API_URL}/")
    print_response(response)

def test_connect_account():
    """Test the connect account endpoint"""
    print("\n🔍 Testing connect account endpoint...")
    
    # Use the MetaTrader credentials from .env
    account_data = {
        "login": DEV_MT_LOGIN,
        "password": DEV_MT_PASSWORD,
        "server_name": DEV_MT_SERVER,
        "platform": "mt5"
    }
    
    response = requests.post(
        f"{API_URL}/connect-account",
        json=account_data
    )
    print_response(response)

def test_account_info():
    """Test the account info endpoint"""
    print("\n🔍 Testing account info endpoint...")
    response = requests.get(f"{API_URL}/account-info")
    print_response(response)

def test_positions():
    """Test the positions endpoint"""
    print("\n🔍 Testing positions endpoint...")
    response = requests.get(f"{API_URL}/positions")
    print_response(response)

def test_place_order():
    """Test the place order endpoint"""
    print("\n🔍 Testing place order endpoint...")
    
    # Initialize MT5 to get current prices
    if not mt5.initialize():
        print(f"Failed to initialize MT5: {mt5.last_error()}")
        return
    
    # Try different symbols
    symbols_to_try = ["EURUSD", "EURUSDz", "EUR/USD"]
    
    for symbol in symbols_to_try:
        print(f"\n🔍 Trying with symbol: {symbol}")
        
        # Get symbol info to calculate proper stop levels
        symbol_info = mt5.symbol_info(symbol)
        if symbol_info is None:
            print(f"Symbol {symbol} not found, trying next...")
            continue
        
        # Get current price
        current_bid = symbol_info.bid
        current_ask = symbol_info.ask
        
        # Get stop level in points
        stop_level = symbol_info.trade_stops_level
        
        # Calculate proper stop loss and take profit with broker's minimum distance
        # Convert stop level from points to price value
        point_value = symbol_info.point
        
        # If stop_level is 0, use a default minimum distance (50 points is usually safe)
        if stop_level == 0:
            print("⚠️ Broker reported stop level of 0, using default minimum distance of 50 points")
            stop_level = 50
        
        min_distance = stop_level * point_value
        
        # For BUY order
        price = current_ask
        stop_loss = round(price - (min_distance * 2), symbol_info.digits)  # Double the minimum distance
        take_profit = round(price + (min_distance * 3), symbol_info.digits)  # Triple the minimum distance
        
        print(f"Current price: {price}")
        print(f"Stop level (points): {stop_level}")
        print(f"Point value: {point_value}")
        print(f"Min distance: {min_distance}")
        print(f"Using SL: {stop_loss}, TP: {take_profit}")
        
        # Create order with proper stop levels
        order_data = {
            "symbol": symbol,
            "order_type": "BUY",
            "volume": 0.01,
            "stop_loss": stop_loss,
            "take_profit": take_profit
        }
        
        # Try placing the order
        try:
            response = requests.post(
                f"{API_URL}/place-order",
                json=order_data
            )
            print_response(response)
            
            if response.status_code == 200:
                print(f"✅ Order placed successfully with symbol {symbol}")
                break
        except Exception as e:
            print(f"Error placing order: {str(e)}")
    
    # Shut down MT5
    mt5.shutdown()

def main():
    """Run all tests"""
    print("🚀 Starting development mode API tests")
    print("⚠️ Make sure the FastAPI server is running with DEV_MODE=true")
    print("⚠️ Make sure MetaTrader 5 is running and logged into your Exness account")
    print("⚠️ Make sure AutoTrading is enabled in MetaTrader 5")
    
    test_root()
    test_connect_account()
    test_account_info()
    test_positions()
    test_place_order()
    
    print("\n✅ Tests completed")
    print("💡 If you're seeing symbol errors, run show_symbols.py to see available symbols")

if __name__ == "__main__":
    main() 