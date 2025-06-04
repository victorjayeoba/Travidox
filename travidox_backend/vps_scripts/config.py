#!/usr/bin/env python
"""
Configuration file for VPS scripts.
This file contains paths and settings for the MetaTrader terminal.
"""

import os

# Path to MetaTrader terminal (can be overridden by environment variable)
MT_TERMINAL_PATH = os.getenv("MT_TERMINAL_PATH", "/home/your-user/.wine/drive_c/Program Files/MetaTrader 5")

# Path to store account information
ACCOUNTS_DIR = os.path.expanduser("~/mt_accounts")

# Path to store order information
ORDERS_DIR = os.path.expanduser("~/mt_orders")

# Ensure directories exist
def ensure_directories():
    """Ensure required directories exist"""
    for directory in [ACCOUNTS_DIR, ORDERS_DIR]:
        if not os.path.exists(directory):
            os.makedirs(directory) 