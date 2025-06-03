import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Base URL of the API
BASE_URL = "http://localhost:8000"

# This would typically come from your frontend after Firebase authentication
# For testing, you can generate a token using the Firebase Admin SDK or 
# by authenticating through the Firebase client SDK and extracting the token
FIREBASE_ID_TOKEN = os.getenv("TEST_FIREBASE_TOKEN", "your_firebase_id_token_here")

def test_health_check():
    """Test the health check endpoint"""
    response = requests.get(f"{BASE_URL}/")
    print(f"Health check response: {response.status_code}")
    print(response.json())
    return response.status_code == 200

def test_connect_account():
    """Test connecting a MetaTrader account"""
    headers = {
        "Authorization": f"Bearer {FIREBASE_ID_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Replace with your MetaTrader account details
    payload = {
        "login": "your_mt_login",
        "password": "your_mt_password",
        "server_name": "your_mt_server",
        "platform": "mt5"
    }
    
    response = requests.post(
        f"{BASE_URL}/connect-account", 
        headers=headers,
        data=json.dumps(payload)
    )
    
    print(f"Connect account response: {response.status_code}")
    if response.status_code == 200:
        print(response.json())
    else:
        print(f"Error: {response.text}")
    
    return response.status_code == 200

def test_account_info():
    """Test getting account information"""
    headers = {
        "Authorization": f"Bearer {FIREBASE_ID_TOKEN}"
    }
    
    response = requests.get(
        f"{BASE_URL}/account-info",
        headers=headers
    )
    
    print(f"Account info response: {response.status_code}")
    if response.status_code == 200:
        print(response.json())
    else:
        print(f"Error: {response.text}")
    
    return response.status_code == 200

def test_place_order():
    """Test placing a market order"""
    headers = {
        "Authorization": f"Bearer {FIREBASE_ID_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Replace with your order details
    payload = {
        "symbol": "EURUSD",
        "order_type": "BUY",
        "volume": 0.1,
        "stop_loss": 1.0800,
        "take_profit": 1.1200
    }
    
    response = requests.post(
        f"{BASE_URL}/place-order", 
        headers=headers,
        data=json.dumps(payload)
    )
    
    print(f"Place order response: {response.status_code}")
    if response.status_code == 200:
        print(response.json())
    else:
        print(f"Error: {response.text}")
    
    return response.status_code == 200

def test_positions():
    """Test getting open positions"""
    headers = {
        "Authorization": f"Bearer {FIREBASE_ID_TOKEN}"
    }
    
    response = requests.get(
        f"{BASE_URL}/positions",
        headers=headers
    )
    
    print(f"Positions response: {response.status_code}")
    if response.status_code == 200:
        print(response.json())
    else:
        print(f"Error: {response.text}")
    
    return response.status_code == 200

def test_close_position(position_id):
    """Test closing a position"""
    headers = {
        "Authorization": f"Bearer {FIREBASE_ID_TOKEN}"
    }
    
    response = requests.post(
        f"{BASE_URL}/close-position/{position_id}",
        headers=headers
    )
    
    print(f"Close position response: {response.status_code}")
    if response.status_code == 200:
        print(response.json())
    else:
        print(f"Error: {response.text}")
    
    return response.status_code == 200

if __name__ == "__main__":
    print("Testing API endpoints...")
    
    # Test health check
    health_ok = test_health_check()
    print(f"Health check test {'passed' if health_ok else 'failed'}")
    
    # Only test account connection if we have a valid token
    if FIREBASE_ID_TOKEN and FIREBASE_ID_TOKEN != "your_firebase_id_token_here":
        # Test connect account
        connect_ok = test_connect_account()
        print(f"Connect account test {'passed' if connect_ok else 'failed'}")
        
        # Test account info
        info_ok = test_account_info()
        print(f"Account info test {'passed' if info_ok else 'failed'}")
        
        # Test place order
        order_ok = test_place_order()
        print(f"Place order test {'passed' if order_ok else 'failed'}")
        
        # Test positions
        positions_ok = test_positions()
        print(f"Positions test {'passed' if positions_ok else 'failed'}")
        
        # If positions test passed and returned at least one position, test closing it
        if positions_ok:
            # For testing, we'll use position ID 123456
            # In a real implementation, you would get the position ID from the positions response
            position_id = 123456
            close_ok = test_close_position(position_id)
            print(f"Close position test {'passed' if close_ok else 'failed'}")
    else:
        print("Skipping account tests - no valid Firebase token provided")
        print("To test with a real token, set the TEST_FIREBASE_TOKEN environment variable") 