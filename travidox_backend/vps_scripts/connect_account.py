#!/usr/bin/env python
"""
Script to connect to a MetaTrader account on the VPS.
This script is executed on the VPS by the backend server.
"""

import argparse
import json
import sys
import os
import time
import uuid
from datetime import datetime

# Path to store account information
ACCOUNTS_DIR = os.path.expanduser("~/mt_accounts")

def ensure_accounts_dir():
    """Ensure the accounts directory exists"""
    if not os.path.exists(ACCOUNTS_DIR):
        os.makedirs(ACCOUNTS_DIR)

def connect_account(config_file):
    """
    Connect to a MetaTrader account using the provided configuration.
    
    Args:
        config_file: Path to the JSON configuration file
        
    Returns:
        Dictionary with connection result
    """
    try:
        # Read the configuration file
        with open(config_file, 'r') as f:
            config = json.load(f)
        
        # Extract account details
        login = config.get('login')
        password = config.get('password')
        server = config.get('server')
        platform = config.get('platform', 'mt5')
        
        if not all([login, password, server]):
            return {
                "success": False,
                "error": "Missing required parameters: login, password, or server"
            }
        
        # Generate a unique account ID
        account_id = str(uuid.uuid4())
        
        # In a real implementation, this is where you would:
        # 1. Launch the MetaTrader terminal if not already running
        # 2. Use the terminal's API to log in with the provided credentials
        # 3. Verify the connection was successful
        
        # For this example, we'll simulate a successful connection
        account_info = {
            "id": account_id,
            "login": login,
            "server": server,
            "platform": platform,
            "connected_at": datetime.now().isoformat(),
            "status": "connected"
        }
        
        # Save the account information (excluding the password)
        ensure_accounts_dir()
        account_file = os.path.join(ACCOUNTS_DIR, f"{account_id}.json")
        with open(account_file, 'w') as f:
            json.dump(account_info, f)
        
        # Return success response
        return {
            "success": True,
            "account_id": account_id,
            "login": login,
            "server": server,
            "platform": platform
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Connect to a MetaTrader account")
    parser.add_argument('--config', required=True, help='Path to the account configuration JSON file')
    args = parser.parse_args()
    
    result = connect_account(args.config)
    print(json.dumps(result))

if __name__ == "__main__":
    main() 