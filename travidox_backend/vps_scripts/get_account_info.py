#!/usr/bin/env python
"""
Script to get information about a connected MetaTrader account.
This script is executed on the VPS by the backend server.
"""

import argparse
import json
import os
import sys

# Path to store account information
ACCOUNTS_DIR = os.path.expanduser("~/mt_accounts")

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
        
        # Read the account information
        with open(account_file, 'r') as f:
            account_info = json.load(f)
        
        # In a real implementation, this is where you would:
        # 1. Connect to the MetaTrader terminal
        # 2. Use the terminal's API to get up-to-date account information
        # 3. Update the stored account information
        
        # For this example, we'll just return the stored information
        # plus some simulated account metrics
        account_info.update({
            "balance": 10000.0,
            "equity": 10050.0,
            "margin": 500.0,
            "free_margin": 9550.0,
            "margin_level": 2010.0,
            "leverage": 100,
            "currency": "USD"
        })
        
        return {
            "success": True,
            "account": account_info
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Get MetaTrader account information")
    parser.add_argument('--account_id', required=True, help='Account identifier')
    args = parser.parse_args()
    
    result = get_account_info(args.account_id)
    print(json.dumps(result))

if __name__ == "__main__":
    main() 