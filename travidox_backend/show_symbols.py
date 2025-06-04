"""
Script to show all available symbols in your MetaTrader 5 terminal.
This helps identify the correct symbol names to use with Exness.
"""

import MetaTrader5 as mt5
import pandas as pd
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# MetaTrader development credentials
DEV_MT_LOGIN = os.getenv("DEV_MT_LOGIN", "81378629")
DEV_MT_PASSWORD = os.getenv("DEV_MT_PASSWORD", "Jayeoba@112")
DEV_MT_SERVER = os.getenv("DEV_MT_SERVER", "Exness-MT5Trial10")

def main():
    """Show all available symbols in your MetaTrader terminal"""
    
    # Initialize MT5
    print("Initializing MetaTrader 5...")
    if not mt5.initialize():
        print(f"Failed to initialize MT5: {mt5.last_error()}")
        return
    
    # Login to account
    print(f"Logging in to {DEV_MT_SERVER} with account {DEV_MT_LOGIN}...")
    authorized = mt5.login(
        login=int(DEV_MT_LOGIN),
        password=DEV_MT_PASSWORD,
        server=DEV_MT_SERVER
    )
    
    if not authorized:
        print(f"Failed to login: {mt5.last_error()}")
        mt5.shutdown()
        return
    
    print(f"Login successful: {authorized}")
    
    # Get all symbols
    print("Getting available symbols...")
    symbols = mt5.symbols_get()
    
    if not symbols:
        print(f"No symbols found: {mt5.last_error()}")
        mt5.shutdown()
        return
    
    # Convert to DataFrame for better display
    symbols_df = pd.DataFrame(
        list(map(lambda x: x._asdict(), symbols)),
        columns=['name', 'currency_base', 'currency_profit', 'description']
    )
    
    # Print symbols
    print(f"\n=== AVAILABLE SYMBOLS ({len(symbols)}) ===")
    
    # Create categories of symbols
    forex = symbols_df[symbols_df['name'].str.contains('USD|EUR|GBP|JPY|AUD|CAD|CHF|NZD')]
    crypto = symbols_df[symbols_df['name'].str.contains('BTC|ETH|LTC|XRP')]
    
    # Print forex symbols
    print("\n--- FOREX SYMBOLS ---")
    for name in forex['name'].sort_values():
        print(name)
    
    # Print crypto symbols
    print("\n--- CRYPTO SYMBOLS ---")
    for name in crypto['name'].sort_values():
        print(name)
    
    # Print other symbols
    print("\n--- OTHER SYMBOLS ---")
    other = symbols_df[~symbols_df['name'].isin(forex['name']) & ~symbols_df['name'].isin(crypto['name'])]
    for name in other['name'].sort_values():
        print(name)
    
    # Close connection
    mt5.shutdown()
    
    print("\nUse these exact symbol names in your orders.")

if __name__ == "__main__":
    main() 