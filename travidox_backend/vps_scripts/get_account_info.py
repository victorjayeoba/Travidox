#!/usr/bin/env python
"""
Script to get information about a connected MetaTrader account.
This script is executed on the VPS by the backend server.
"""

import argparse
import json
import os
import sys
import MetaTrader5 as mt5

# Import configuration
from config import MT_TERMINAL_PATH, ACCOUNTS_DIR

def get_account_info(account_id):
    """
    Get information about a connected MetaTrader account.
    
    Args:
        account_id: The account identifier
        
    Returns:
        Dictionary with account information
    """
    try:
        # Check if the account exists
        account_file = os.path.join(ACCOUNTS_DIR, f"{account_id}.json")
        if not os.path.exists(account_file):
            return {
                "success": False,
                "error": f"Account {account_id} not found"
            }
        
        # Read the account information from file
        with open(account_file, 'r') as f:
            stored_account_info = json.load(f)
        
        login = stored_account_info.get('login')
        server = stored_account_info.get('server')
        
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
            
            # Get account information
            account_info = mt5.account_info()
            
            if not account_info:
                return {
                    "success": False,
                    "error": f"Failed to get account info: {mt5.last_error()}"
                }
            
            # Convert account info to dictionary
            account_info_dict = account_info._asdict()
            
            # Update the stored account info with the latest data
            updated_account_info = {
                "id": account_id,
                "login": login,
                "server": server,
                "platform": stored_account_info.get('platform', 'mt5'),
                "name": account_info_dict.get('name', stored_account_info.get('name', 'Unknown')),
                "currency": account_info_dict.get('currency', stored_account_info.get('currency', 'USD')),
                "leverage": account_info_dict.get('leverage', stored_account_info.get('leverage', 100)),
                "balance": account_info_dict.get('balance', 0.0),
                "equity": account_info_dict.get('equity', 0.0),
                "margin": account_info_dict.get('margin', 0.0),
                "free_margin": account_info_dict.get('margin_free', 0.0),
                "margin_level": account_info_dict.get('margin_level', 0.0),
                "connected_at": stored_account_info.get('connected_at'),
                "status": "connected"
            }
            
            # Save the updated account information
            with open(account_file, 'w') as f:
                json.dump(updated_account_info, f)
            
            return {
                "success": True,
                "account": updated_account_info
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
    parser = argparse.ArgumentParser(description="Get account information")
    parser.add_argument('--account_id', required=True, help='The account identifier')
    args = parser.parse_args()
    
    result = get_account_info(args.account_id)
    print(json.dumps(result))

if __name__ == "__main__":
    main() 