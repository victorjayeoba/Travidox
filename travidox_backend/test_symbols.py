"""
Test script for the symbols API endpoint.

This script tests the new /symbols endpoint and provides examples of filtering by category.
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API base URL
API_URL = "http://localhost:8000"

def print_response(response, limit=10):
    """Print the response details with a limit on number of items shown"""
    print(f"Status Code: {response.status_code}")
    try:
        data = response.json()
        if isinstance(data, list) and len(data) > limit:
            # Print just the first few items and a summary
            print(f"Total symbols: {len(data)}")
            print(f"First {limit} symbols:")
            print(json.dumps(data[:limit], indent=2))
            print(f"... and {len(data) - limit} more")
        else:
            print(f"Response: {json.dumps(data, indent=2)}")
    except:
        print(f"Response: {response.text}")
    print("-" * 50)

def test_all_symbols():
    """Test getting all symbols"""
    print("\n🔍 Testing get all symbols...")
    response = requests.get(f"{API_URL}/symbols")
    print_response(response)

def test_forex_symbols():
    """Test getting only forex symbols"""
    print("\n🔍 Testing get forex symbols...")
    response = requests.get(f"{API_URL}/symbols?category=forex")
    print_response(response)

def test_crypto_symbols():
    """Test getting only crypto symbols"""
    print("\n🔍 Testing get crypto symbols...")
    response = requests.get(f"{API_URL}/symbols?category=crypto")
    print_response(response)

def main():
    """Run all tests"""
    print("🚀 Testing symbols API endpoints")
    print("⚠️ Make sure the FastAPI server is running with DEV_MODE=true")
    print("⚠️ Make sure MetaTrader 5 is running and logged into your Exness account")
    
    test_all_symbols()
    test_forex_symbols()
    test_crypto_symbols()
    
    print("\n✅ Tests completed")

if __name__ == "__main__":
    main() 