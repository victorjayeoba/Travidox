#!/usr/bin/env python
"""
VPS Scripts Setup

This script sets up the necessary directories and scripts on the VPS for MetaTrader integration.
"""

import os
import paramiko
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# VPS connection details
VPS_HOST = os.getenv("VPS_HOST")
VPS_USERNAME = os.getenv("VPS_USERNAME")
VPS_PASSWORD = os.getenv("VPS_PASSWORD")
VPS_KEY_PATH = os.getenv("VPS_KEY_PATH")
VPS_MT_SCRIPTS_DIR = os.getenv("VPS_MT_SCRIPTS_DIR", "~/mt_scripts")

class VPSManager:
    """Simple VPS connection manager"""
    
    def __init__(self, host, username, password=None, key_path=None, port=22):
        self.host = host
        self.username = username
        self.password = password
        self.key_path = key_path
        self.port = port
        self.client = None
        
    def connect(self):
        """Connect to the VPS"""
        try:
            self.client = paramiko.SSHClient()
            self.client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            
            if self.key_path:
                key = paramiko.RSAKey.from_private_key_file(self.key_path)
                self.client.connect(
                    hostname=self.host,
                    port=self.port,
                    username=self.username,
                    pkey=key
                )
            else:
                self.client.connect(
                    hostname=self.host,
                    port=self.port,
                    username=self.username,
                    password=self.password
                )
            print(f"✅ Successfully connected to VPS at {self.host}")
            return True
        except Exception as e:
            print(f"❌ Failed to connect to VPS: {str(e)}")
            return False
    
    def execute_command(self, command):
        """Execute a command on the VPS"""
        if not self.client:
            if not self.connect():
                return None, f"Not connected to VPS"
        
        try:
            stdin, stdout, stderr = self.client.exec_command(command)
            stdout_str = stdout.read().decode('utf-8')
            stderr_str = stderr.read().decode('utf-8')
            return stdout_str, stderr_str
        except Exception as e:
            return None, f"Command execution error: {str(e)}"
    
    def close(self):
        """Close the SSH connection"""
        if self.client:
            self.client.close()
            self.client = None
            print("SSH connection closed")

def setup_directories(vps):
    """Set up the necessary directories on the VPS"""
    print("\n🔧 Setting up directories...")
    
    # Create MetaTrader scripts directory
    stdout, stderr = vps.execute_command(f"mkdir -p {VPS_MT_SCRIPTS_DIR}")
    if stderr:
        print(f"❌ Error creating scripts directory: {stderr}")
        return False
    
    # Create accounts directory
    stdout, stderr = vps.execute_command("mkdir -p ~/mt_accounts")
    if stderr:
        print(f"❌ Error creating accounts directory: {stderr}")
        return False
    
    # Create orders directory
    stdout, stderr = vps.execute_command("mkdir -p ~/mt_orders")
    if stderr:
        print(f"❌ Error creating orders directory: {stderr}")
        return False
    
    print("✅ Directories created successfully")
    return True

def create_connect_account_script(vps):
    """Create the connect_account.py script on the VPS"""
    print("\n🔧 Creating connect_account.py script...")
    
    script_content = """#!/usr/bin/env python
\"\"\"
Script to connect to a MetaTrader account on the VPS.
This script is executed on the VPS by the backend server.
\"\"\"

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
    \"\"\"Ensure the accounts directory exists\"\"\"
    if not os.path.exists(ACCOUNTS_DIR):
        os.makedirs(ACCOUNTS_DIR)

def connect_account(config_file):
    \"\"\"
    Connect to a MetaTrader account using the provided configuration.
    
    Args:
        config_file: Path to the JSON configuration file
        
    Returns:
        Dictionary with connection result
    \"\"\"
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
    \"\"\"Main entry point\"\"\"
    parser = argparse.ArgumentParser(description="Connect to a MetaTrader account")
    parser.add_argument('--config', required=True, help='Path to the account configuration JSON file')
    args = parser.parse_args()
    
    result = connect_account(args.config)
    print(json.dumps(result))

if __name__ == "__main__":
    main()
"""
    
    script_path = f"{VPS_MT_SCRIPTS_DIR}/connect_account.py"
    stdout, stderr = vps.execute_command(f"cat > {script_path} << 'EOL'\n{script_content}\nEOL")
    
    if stderr:
        print(f"❌ Error creating connect_account.py: {stderr}")
        return False
    
    # Make the script executable
    stdout, stderr = vps.execute_command(f"chmod +x {script_path}")
    if stderr:
        print(f"❌ Error making script executable: {stderr}")
        return False
    
    print("✅ connect_account.py created successfully")
    return True

def create_place_market_order_script(vps):
    """Create the place_market_order.py script on the VPS"""
    print("\n🔧 Creating place_market_order.py script...")
    
    script_content = """#!/usr/bin/env python
\"\"\"
Script to place a market order using a connected MetaTrader account.
This script is executed on the VPS by the backend server.
\"\"\"

import argparse
import json
import os
import sys
import time
import random
from datetime import datetime

# Path to store account information
ACCOUNTS_DIR = os.path.expanduser("~/mt_accounts")
# Path to store order information
ORDERS_DIR = os.path.expanduser("~/mt_orders")

def ensure_orders_dir():
    \"\"\"Ensure the orders directory exists\"\"\"
    if not os.path.exists(ORDERS_DIR):
        os.makedirs(ORDERS_DIR)

def place_market_order(order_file):
    \"\"\"
    Place a market order using the provided order parameters.
    
    Args:
        order_file: Path to the JSON order parameters file
        
    Returns:
        Dictionary with order result
    \"\"\"
    try:
        # Read the order parameters
        with open(order_file, 'r') as f:
            order_params = json.load(f)
        
        # Extract order details
        account_id = order_params.get('account_id')
        symbol = order_params.get('symbol')
        order_type = order_params.get('order_type')
        volume = order_params.get('volume')
        stop_loss = order_params.get('stop_loss')
        take_profit = order_params.get('take_profit')
        
        if not all([account_id, symbol, order_type, volume]):
            return {
                "success": False,
                "error": "Missing required parameters: account_id, symbol, order_type, or volume"
            }
        
        # Check if the account exists
        account_file = os.path.join(ACCOUNTS_DIR, f"{account_id}.json")
        if not os.path.exists(account_file):
            return {
                "success": False,
                "error": f"Account {account_id} not found"
            }
        
        # In a real implementation, this is where you would:
        # 1. Connect to the MetaTrader terminal
        # 2. Use the terminal's API to place the market order
        # 3. Get the order result
        
        # For this example, we'll simulate a successful order placement
        # Generate a random order ID
        order_id = random.randint(100000, 999999)
        
        # Simulate current market price
        price = 1.1000 if symbol.upper() == "EURUSD" else 1.3000
        
        # Create order result
        order_result = {
            "order_id": order_id,
            "account_id": account_id,
            "symbol": symbol,
            "type": order_type,
            "volume": volume,
            "price": price,
            "stop_loss": stop_loss,
            "take_profit": take_profit,
            "time": datetime.now().isoformat(),
            "status": "filled"
        }
        
        # Save the order information
        ensure_orders_dir()
        order_file = os.path.join(ORDERS_DIR, f"{order_id}.json")
        with open(order_file, 'w') as f:
            json.dump(order_result, f)
        
        return {
            "success": True,
            "order": order_result
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def main():
    \"\"\"Main entry point\"\"\"
    parser = argparse.ArgumentParser(description="Place a market order")
    parser.add_argument('--order', required=True, help='Path to the order parameters JSON file')
    args = parser.parse_args()
    
    result = place_market_order(args.order)
    print(json.dumps(result))

if __name__ == "__main__":
    main()
"""
    
    script_path = f"{VPS_MT_SCRIPTS_DIR}/place_market_order.py"
    stdout, stderr = vps.execute_command(f"cat > {script_path} << 'EOL'\n{script_content}\nEOL")
    
    if stderr:
        print(f"❌ Error creating place_market_order.py: {stderr}")
        return False
    
    # Make the script executable
    stdout, stderr = vps.execute_command(f"chmod +x {script_path}")
    if stderr:
        print(f"❌ Error making script executable: {stderr}")
        return False
    
    print("✅ place_market_order.py created successfully")
    return True

def create_list_symbols_script(vps):
    """Create the list_symbols.py script on the VPS"""
    print("\n🔧 Creating list_symbols.py script...")
    
    script_content = """#!/usr/bin/env python
\"\"\"
Script to list available trading symbols.
This script is executed on the VPS by the backend server.
\"\"\"

import json

# In a real implementation, this would connect to MetaTrader and get the actual symbols
# For this example, we'll use a sample list of symbols
symbols = [
    {"name": "EURUSDz", "description": "Euro vs US Dollar", "base_currency": "EUR", "profit_currency": "USD", "digits": 5, "category": "forex"},
    {"name": "USDJPYz", "description": "US Dollar vs Japanese Yen", "base_currency": "USD", "profit_currency": "JPY", "digits": 3, "category": "forex"},
    {"name": "GBPUSDz", "description": "Great Britain Pound vs US Dollar", "base_currency": "GBP", "profit_currency": "USD", "digits": 5, "category": "forex"},
    {"name": "USDCHFz", "description": "US Dollar vs Swiss Franc", "base_currency": "USD", "profit_currency": "CHF", "digits": 5, "category": "forex"},
    {"name": "EURJPYz", "description": "Euro vs Japanese Yen", "base_currency": "EUR", "profit_currency": "JPY", "digits": 3, "category": "forex"},
    {"name": "AUDUSDz", "description": "Australian Dollar vs US Dollar", "base_currency": "AUD", "profit_currency": "USD", "digits": 5, "category": "forex"},
    {"name": "NZDUSDz", "description": "New Zealand Dollar vs US Dollar", "base_currency": "NZD", "profit_currency": "USD", "digits": 5, "category": "forex"},
    {"name": "BTCUSDz", "description": "Bitcoin vs US Dollar", "base_currency": "BTC", "profit_currency": "USD", "digits": 2, "category": "crypto"},
    {"name": "ETHUSDz", "description": "Ethereum vs US Dollar", "base_currency": "ETH", "profit_currency": "USD", "digits": 2, "category": "crypto"},
    {"name": "XAUUSDz", "description": "Gold vs US Dollar", "base_currency": "XAU", "profit_currency": "USD", "digits": 3, "category": "commodity"}
]

# Print the symbols as JSON
print(json.dumps(symbols))
"""
    
    script_path = f"{VPS_MT_SCRIPTS_DIR}/list_symbols.py"
    stdout, stderr = vps.execute_command(f"cat > {script_path} << 'EOL'\n{script_content}\nEOL")
    
    if stderr:
        print(f"❌ Error creating list_symbols.py: {stderr}")
        return False
    
    # Make the script executable
    stdout, stderr = vps.execute_command(f"chmod +x {script_path}")
    if stderr:
        print(f"❌ Error making script executable: {stderr}")
        return False
    
    print("✅ list_symbols.py created successfully")
    return True

def create_get_positions_script(vps):
    """Create the get_positions.py script on the VPS"""
    print("\n🔧 Creating get_positions.py script...")
    
    script_content = """#!/usr/bin/env python
\"\"\"
Script to get open positions for a MetaTrader account.
This script is executed on the VPS by the backend server.
\"\"\"

import argparse
import json
import os
import sys
import random
from datetime import datetime, timedelta

# Path to store account information
ACCOUNTS_DIR = os.path.expanduser("~/mt_accounts")

def get_positions(account_id):
    \"\"\"
    Get open positions for the specified account.
    
    Args:
        account_id: The account identifier
        
    Returns:
        Dictionary with positions information
    \"\"\"
    try:
        # Check if the account exists
        account_file = os.path.join(ACCOUNTS_DIR, f"{account_id}.json")
        if not os.path.exists(account_file):
            return {
                "success": False,
                "error": f"Account {account_id} not found"
            }
        
        # In a real implementation, this is where you would:
        # 1. Connect to the MetaTrader terminal
        # 2. Use the terminal's API to get the open positions
        
        # For this example, we'll simulate some open positions
        positions = []
        
        # Generate 0-3 random positions
        num_positions = random.randint(0, 3)
        
        symbols = ["EURUSDz", "USDJPYz", "GBPUSDz", "XAUUSDz"]
        
        for i in range(num_positions):
            # Random position details
            symbol = random.choice(symbols)
            position_type = random.choice(["BUY", "SELL"])
            volume = round(random.uniform(0.01, 1.0), 2)
            
            # Random open time in the last 24 hours
            open_time = datetime.now() - timedelta(hours=random.randint(1, 24))
            
            # Random price based on symbol
            if symbol == "EURUSDz":
                price = round(random.uniform(1.05, 1.15), 5)
            elif symbol == "USDJPYz":
                price = round(random.uniform(140.0, 150.0), 3)
            elif symbol == "GBPUSDz":
                price = round(random.uniform(1.25, 1.35), 5)
            elif symbol == "XAUUSDz":
                price = round(random.uniform(1800.0, 2000.0), 2)
            else:
                price = round(random.uniform(1.0, 2.0), 5)
            
            # Random profit/loss
            profit = round(random.uniform(-100.0, 100.0), 2)
            
            position = {
                "position_id": random.randint(100000, 999999),
                "symbol": symbol,
                "type": position_type,
                "volume": volume,
                "open_price": price,
                "current_price": price + (0.001 * random.uniform(-1.0, 1.0)),
                "open_time": open_time.isoformat(),
                "profit": profit,
                "stop_loss": None if random.random() > 0.5 else price * (0.99 if position_type == "BUY" else 1.01),
                "take_profit": None if random.random() > 0.5 else price * (1.01 if position_type == "BUY" else 0.99)
            }
            
            positions.append(position)
        
        return {
            "success": True,
            "positions": positions
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def main():
    \"\"\"Main entry point\"\"\"
    parser = argparse.ArgumentParser(description="Get open positions")
    parser.add_argument('--account_id', required=True, help='The account identifier')
    args = parser.parse_args()
    
    result = get_positions(args.account_id)
    print(json.dumps(result))

if __name__ == "__main__":
    main()
"""
    
    script_path = f"{VPS_MT_SCRIPTS_DIR}/get_positions.py"
    stdout, stderr = vps.execute_command(f"cat > {script_path} << 'EOL'\n{script_content}\nEOL")
    
    if stderr:
        print(f"❌ Error creating get_positions.py: {stderr}")
        return False
    
    # Make the script executable
    stdout, stderr = vps.execute_command(f"chmod +x {script_path}")
    if stderr:
        print(f"❌ Error making script executable: {stderr}")
        return False
    
    print("✅ get_positions.py created successfully")
    return True

def create_close_position_script(vps):
    """Create the close_position.py script on the VPS"""
    print("\n🔧 Creating close_position.py script...")
    
    script_content = """#!/usr/bin/env python
\"\"\"
Script to close a position for a MetaTrader account.
This script is executed on the VPS by the backend server.
\"\"\"

import argparse
import json
import os
import sys
import random
from datetime import datetime

# Path to store account information
ACCOUNTS_DIR = os.path.expanduser("~/mt_accounts")

def close_position(account_id, position_id):
    \"\"\"
    Close a position for the specified account.
    
    Args:
        account_id: The account identifier
        position_id: The position identifier
        
    Returns:
        Dictionary with close operation result
    \"\"\"
    try:
        # Check if the account exists
        account_file = os.path.join(ACCOUNTS_DIR, f"{account_id}.json")
        if not os.path.exists(account_file):
            return {
                "success": False,
                "error": f"Account {account_id} not found"
            }
        
        # In a real implementation, this is where you would:
        # 1. Connect to the MetaTrader terminal
        # 2. Use the terminal's API to close the position
        
        # For this example, we'll simulate a successful close operation
        return {
            "success": True,
            "message": f"Position {position_id} closed successfully"
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def main():
    \"\"\"Main entry point\"\"\"
    parser = argparse.ArgumentParser(description="Close a position")
    parser.add_argument('--account_id', required=True, help='The account identifier')
    parser.add_argument('--position_id', required=True, help='The position identifier')
    args = parser.parse_args()
    
    result = close_position(args.account_id, args.position_id)
    print(json.dumps(result))

if __name__ == "__main__":
    main()
"""
    
    script_path = f"{VPS_MT_SCRIPTS_DIR}/close_position.py"
    stdout, stderr = vps.execute_command(f"cat > {script_path} << 'EOL'\n{script_content}\nEOL")
    
    if stderr:
        print(f"❌ Error creating close_position.py: {stderr}")
        return False
    
    # Make the script executable
    stdout, stderr = vps.execute_command(f"chmod +x {script_path}")
    if stderr:
        print(f"❌ Error making script executable: {stderr}")
        return False
    
    print("✅ close_position.py created successfully")
    return True

def verify_setup(vps):
    """Verify that the setup was successful"""
    print("\n🔍 Verifying setup...")
    
    # Check if the scripts directory exists
    stdout, stderr = vps.execute_command(f"ls -la {VPS_MT_SCRIPTS_DIR}")
    if stderr:
        print(f"❌ Scripts directory not found: {stderr}")
        return False
    
    print("✅ Scripts directory exists")
    print(stdout)
    
    # Check if the scripts are executable
    stdout, stderr = vps.execute_command(f"ls -la {VPS_MT_SCRIPTS_DIR}/*.py")
    if stderr:
        print(f"❌ Scripts not found: {stderr}")
        return False
    
    print("✅ Scripts are present and executable")
    print(stdout)
    
    return True

def main():
    """Main function"""
    print("🚀 VPS Scripts Setup")
    
    if not all([VPS_HOST, VPS_USERNAME]) or not (VPS_PASSWORD or VPS_KEY_PATH):
        print("❌ Missing VPS connection details in .env file")
        print("Please set VPS_HOST, VPS_USERNAME, and either VPS_PASSWORD or VPS_KEY_PATH")
        return
    
    print(f"VPS Host: {VPS_HOST}")
    print(f"VPS Username: {VPS_USERNAME}")
    print(f"VPS Scripts Directory: {VPS_MT_SCRIPTS_DIR}")
    
    # Connect to VPS
    vps = VPSManager(VPS_HOST, VPS_USERNAME, VPS_PASSWORD, VPS_KEY_PATH)
    if not vps.connect():
        return
    
    try:
        # Set up directories
        if not setup_directories(vps):
            return
        
        # Create scripts
        if not create_connect_account_script(vps):
            return
        
        if not create_place_market_order_script(vps):
            return
        
        if not create_list_symbols_script(vps):
            return
        
        if not create_get_positions_script(vps):
            return
        
        if not create_close_position_script(vps):
            return
        
        # Verify setup
        if not verify_setup(vps):
            return
        
        print("\n✅ VPS scripts setup completed successfully!")
        print("You can now run test_vps_mt.py to test the MetaTrader integration.")
        
    finally:
        vps.close()

if __name__ == "__main__":
    main() 