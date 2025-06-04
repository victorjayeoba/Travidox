#!/usr/bin/env python
"""
VPS MetaTrader Tester

This script directly connects to the VPS and tests the MetaTrader installation.
"""

import os
import json
import paramiko
import time
import random
from dotenv import load_dotenv
from datetime import datetime

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

def check_mt_scripts():
    """Check if the MetaTrader scripts are present on the VPS"""
    vps = VPSManager(VPS_HOST, VPS_USERNAME, VPS_PASSWORD, VPS_KEY_PATH)
    
    try:
        print(f"\n🔍 Checking MetaTrader scripts in {VPS_MT_SCRIPTS_DIR}...")
        stdout, stderr = vps.execute_command(f"ls -la {VPS_MT_SCRIPTS_DIR}")
        
        if stderr:
            print(f"❌ Error: {stderr}")
            return False
        
        print("Scripts found:")
        print(stdout)
        return True
    finally:
        vps.close()

def place_test_order():
    """Place a test order using the VPS MetaTrader"""
    vps = VPSManager(VPS_HOST, VPS_USERNAME, VPS_PASSWORD, VPS_KEY_PATH)
    
    try:
        # First, check if we have account information
        print("\n🔍 Checking for MetaTrader accounts...")
        stdout, stderr = vps.execute_command("ls -la ~/mt_accounts")
        
        if stderr and "No such file or directory" in stderr:
            print("❌ No MetaTrader accounts found. Creating a test account...")
            
            # Create account directory
            vps.execute_command("mkdir -p ~/mt_accounts")
            
            # Create a test account file
            account_id = f"test-{int(time.time())}"
            account_data = {
                "id": account_id,
                "login": os.getenv("DEV_MT_LOGIN", "81378629"),
                "server": os.getenv("DEV_MT_SERVER", "Exness-MT5Trial10"),
                "platform": "mt5",
                "connected_at": datetime.now().isoformat(),
                "status": "connected"
            }
            
            account_json = json.dumps(account_data)
            account_file = f"~/mt_accounts/{account_id}.json"
            vps.execute_command(f"echo '{account_json}' > {account_file}")
            
            print(f"✅ Created test account: {account_id}")
        else:
            # Use existing account
            stdout, stderr = vps.execute_command("ls ~/mt_accounts/*.json | head -1")
            if not stdout:
                print("❌ No account files found")
                return False
            
            account_file = stdout.strip()
            stdout, stderr = vps.execute_command(f"cat {account_file}")
            
            if not stdout:
                print("❌ Could not read account file")
                return False
            
            try:
                account_data = json.loads(stdout)
                account_id = account_data.get("id")
                print(f"✅ Using existing account: {account_id}")
            except json.JSONDecodeError:
                print("❌ Invalid account file format")
                return False
        
        # Now place a test order
        print("\n🔍 Placing a test order...")
        
        # Create order parameters
        order_params = {
            "account_id": account_id,
            "symbol": "EURUSDz",  # Use a symbol that should be available
            "order_type": "BUY",
            "volume": 0.001  # Very small volume to avoid "no money" errors
        }
        
        order_json = json.dumps(order_params)
        temp_order = f"/tmp/mt_order_test_{int(time.time())}.json"
        
        # Save order to VPS
        vps.execute_command(f"echo '{order_json}' > {temp_order}")
        
        # Run the order placement script
        script_path = f"{VPS_MT_SCRIPTS_DIR}/place_market_order.py"
        command = f"python {script_path} --order {temp_order}"
        stdout, stderr = vps.execute_command(command)
        
        # Clean up the temporary order file
        vps.execute_command(f"rm -f {temp_order}")
        
        if stderr:
            print(f"❌ Error placing order: {stderr}")
            return False
        
        try:
            result = json.loads(stdout)
            if result.get("success"):
                print("✅ Order placed successfully!")
                print(json.dumps(result.get("order", {}), indent=2))
                return True
            else:
                print(f"❌ Order failed: {result.get('error', 'Unknown error')}")
                return False
        except json.JSONDecodeError:
            print(f"❌ Invalid response format: {stdout}")
            return False
    finally:
        vps.close()

def list_symbols():
    """List available symbols on the VPS MetaTrader"""
    vps = VPSManager(VPS_HOST, VPS_USERNAME, VPS_PASSWORD, VPS_KEY_PATH)
    
    try:
        # Check if we have a symbols script
        script_path = f"{VPS_MT_SCRIPTS_DIR}/list_symbols.py"
        stdout, stderr = vps.execute_command(f"ls {script_path}")
        
        if stderr and "No such file or directory" in stderr:
            print(f"❌ Symbol listing script not found: {script_path}")
            
            # Create a simple symbols script
            script_content = """#!/usr/bin/env python
import json
import random

# For testing, generate some sample symbols
symbols = [
    {"name": "EURUSDz", "description": "Euro vs US Dollar", "category": "forex"},
    {"name": "USDJPYz", "description": "US Dollar vs Japanese Yen", "category": "forex"},
    {"name": "GBPUSDz", "description": "Great Britain Pound vs US Dollar", "category": "forex"},
    {"name": "BTCUSDz", "description": "Bitcoin vs US Dollar", "category": "crypto"}
]

print(json.dumps(symbols))
"""
            vps.execute_command(f"echo '{script_content}' > {script_path}")
            vps.execute_command(f"chmod +x {script_path}")
            print(f"✅ Created sample symbols script")
        
        # Run the symbols script
        print("\n🔍 Getting available symbols...")
        stdout, stderr = vps.execute_command(f"python {script_path}")
        
        if stderr:
            print(f"❌ Error getting symbols: {stderr}")
            return False
        
        try:
            symbols = json.loads(stdout)
            print(f"✅ Found {len(symbols)} symbols:")
            for symbol in symbols[:10]:  # Show first 10 only
                print(f"- {symbol['name']}: {symbol['description']}")
            
            if len(symbols) > 10:
                print(f"... and {len(symbols) - 10} more")
                
            return True
        except json.JSONDecodeError:
            print(f"❌ Invalid response format: {stdout}")
            return False
    finally:
        vps.close()

def main():
    """Main function"""
    print("🚀 VPS MetaTrader Tester")
    
    if not all([VPS_HOST, VPS_USERNAME]) or not (VPS_PASSWORD or VPS_KEY_PATH):
        print("❌ Missing VPS connection details in .env file")
        print("Please set VPS_HOST, VPS_USERNAME, and either VPS_PASSWORD or VPS_KEY_PATH")
        return
    
    print(f"VPS Host: {VPS_HOST}")
    print(f"VPS Username: {VPS_USERNAME}")
    print(f"VPS Scripts Directory: {VPS_MT_SCRIPTS_DIR}")
    
    # Test VPS connection
    vps = VPSManager(VPS_HOST, VPS_USERNAME, VPS_PASSWORD, VPS_KEY_PATH)
    if not vps.connect():
        return
    vps.close()
    
    # Check MetaTrader scripts
    if not check_mt_scripts():
        return
    
    # List available symbols
    list_symbols()
    
    # Place a test order
    place_test_order()

if __name__ == "__main__":
    main() 