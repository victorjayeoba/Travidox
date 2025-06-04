"""
Development Test Client

This script makes HTTP requests to test the API endpoints while in development mode.
No authentication token is needed when DEV_MODE=true is set in the .env file.
"""

import requests
import json
import os
from dotenv import load_dotenv

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
    
    # Create a sample order for Exness - try with standard EURUSD
    order_data = {
        "symbol": "EURUSD",  # Standard symbol format - try this first
        "order_type": "BUY",
        "volume": 0.01,
        "stop_loss": 1.08,
        "take_profit": 1.10
    }
    
    response = requests.post(
        f"{API_URL}/place-order",
        json=order_data
    )
    print_response(response)
    
    # If the first attempt fails, try with other common Exness symbol formats
    if response.status_code != 200:
        print("\n🔍 First symbol attempt failed, trying with EURUSDz...")
        order_data["symbol"] = "EURUSDz"  # Micro account format
        response = requests.post(
            f"{API_URL}/place-order",
            json=order_data
        )
        print_response(response)
        
    if response.status_code != 200:
        print("\n🔍 Second symbol attempt failed, trying with EUR/USD...")
        order_data["symbol"] = "EUR/USD"  # Alternative format
        response = requests.post(
            f"{API_URL}/place-order",
            json=order_data
        )
        print_response(response)

def main():
    """Run all tests"""
    print("🚀 Starting development mode API tests")
    print("⚠️ Make sure the FastAPI server is running with DEV_MODE=true")
    print("⚠️ Make sure MetaTrader 5 is running and logged into your Exness account")
    
    test_root()
    test_connect_account()
    test_account_info()
    test_positions()
    test_place_order()
    
    print("\n✅ Tests completed")
    print("💡 If you're seeing symbol errors, run show_symbols.py to see available symbols")

if __name__ == "__main__":
    main() 