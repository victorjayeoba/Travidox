#!/usr/bin/env python
"""
Script to list available trading symbols.
This script is executed on the VPS by the backend server.
"""

import json
import os
import sys
import MetaTrader5 as mt5

# Import configuration
from config import MT_TERMINAL_PATH

def get_symbols():
    """
    Get available trading symbols from MetaTrader.
    
    Returns:
        List of symbols with details
    """
    try:
        # Initialize MetaTrader
        if not mt5.initialize(path=MT_TERMINAL_PATH):
            print(json.dumps({
                "success": False,
                "error": f"Failed to initialize MetaTrader: {mt5.last_error()}"
            }))
            return []
        
        try:
            # Get all symbols
            all_symbols = mt5.symbols_get()
            
            if not all_symbols:
                return []
            
            # Format symbols
            formatted_symbols = []
            for symbol_info in all_symbols:
                symbol_dict = symbol_info._asdict()
                
                # Skip symbols that are not tradable
                if not symbol_dict.get('trade_mode', 0):
                    continue
                
                # Determine category based on symbol name
                category = "other"
                name = symbol_dict.get('name', '').upper()
                
                if any(pair in name for pair in ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'NZD', 'CAD', 'CHF']):
                    category = "forex"
                elif any(crypto in name for crypto in ['BTC', 'ETH', 'LTC', 'XRP']):
                    category = "crypto"
                elif any(metal in name for metal in ['GOLD', 'SILVER', 'XAU', 'XAG']):
                    category = "commodity"
                elif any(index in name for index in ['SPX', 'NDX', 'DJI', 'DAX', 'FTSE']):
                    category = "index"
                
                # Extract base and profit currencies if available
                base_currency = symbol_dict.get('currency_base', '')
                profit_currency = symbol_dict.get('currency_profit', '')
                
                # If base/profit not available, try to extract from name for forex pairs
                if category == "forex" and (not base_currency or not profit_currency):
                    if len(name) == 6:
                        base_currency = name[:3]
                        profit_currency = name[3:]
                
                formatted_symbol = {
                    "name": symbol_dict.get('name', ''),
                    "description": symbol_dict.get('description', symbol_dict.get('name', '')),
                    "base_currency": base_currency,
                    "profit_currency": profit_currency,
                    "digits": symbol_dict.get('digits', 5),
                    "trade_mode": symbol_dict.get('trade_mode', 0),
                    "spread": symbol_dict.get('spread', 0),
                    "tick_size": symbol_dict.get('trade_tick_size', 0.0001),
                    "volume_min": symbol_dict.get('volume_min', 0.01),
                    "volume_max": symbol_dict.get('volume_max', 100),
                    "volume_step": symbol_dict.get('volume_step', 0.01),
                    "category": category
                }
                
                formatted_symbols.append(formatted_symbol)
            
            return formatted_symbols
            
        finally:
            # Always shutdown MetaTrader
            mt5.shutdown()
            
    except Exception as e:
        # Make sure to shutdown MetaTrader if there was an error
        try:
            mt5.shutdown()
        except:
            pass
            
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))
        return []

if __name__ == "__main__":
    # Get symbols and print as JSON
    symbols = get_symbols()
    print(json.dumps(symbols)) 