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
import MetaTrader5 as mt5

# Import configuration
from config import MT_TERMINAL_PATH, ACCOUNTS_DIR, ensure_directories

def connect_account(config_file):
    """
    Connect to a MetaTrader account using the provided configuration.
    
    Args:
        config_file: Path to the JSON configuration file
        
    Returns:
        Dictionary with connection result
    """
    try:
        # Ensure directories exist
        ensure_directories()
        
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
        
        # Initialize MetaTrader
        if not mt5.initialize(path=MT_TERMINAL_PATH):
            return {
                "success": False,
                "error": f"Failed to initialize MetaTrader: {mt5.last_error()}"
            }
        
        # Connect to trading account
        authorized = mt5.login(
            login=int(login),
            password=password,
            server=server
        )
        
        if not authorized:
            error = mt5.last_error()
            mt5.shutdown()
            return {
                "success": False,
                "error": f"Failed to login: {error}"
            }
        
        # Get account information
        account_info = mt5.account_info()
        if not account_info:
            mt5.shutdown()
            return {
                "success": False,
                "error": f"Failed to get account info: {mt5.last_error()}"
            }
        
        # Convert account info to dictionary
        account_info_dict = account_info._asdict()
        
        # Create account info to save
        account_info = {
            "id": account_id,
            "login": login,
            "server": server,
            "platform": platform,
            "name": account_info_dict.get('name', 'Unknown'),
            "currency": account_info_dict.get('currency', 'USD'),
            "leverage": account_info_dict.get('leverage', 100),
            "balance": account_info_dict.get('balance', 0.0),
            "equity": account_info_dict.get('equity', 0.0),
            "margin": account_info_dict.get('margin', 0.0),
            "free_margin": account_info_dict.get('margin_free', 0.0),
            "margin_level": account_info_dict.get('margin_level', 0.0),
            "connected_at": datetime.now().isoformat(),
            "status": "connected"
        }
        
        # Save the account information (excluding the password)
        account_file = os.path.join(ACCOUNTS_DIR, f"{account_id}.json")
        with open(account_file, 'w') as f:
            json.dump(account_info, f)
        
        # Shutdown MetaTrader
        mt5.shutdown()
        
        # Return success response
        return {
            "success": True,
            "account_id": account_id,
            "login": login,
            "server": server,
            "platform": platform
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
    parser = argparse.ArgumentParser(description="Connect to a MetaTrader account")
    parser.add_argument('--config', required=True, help='Path to the account configuration JSON file')
    args = parser.parse_args()
    
    result = connect_account(args.config)
    print(json.dumps(result))

if __name__ == "__main__":
    main() 