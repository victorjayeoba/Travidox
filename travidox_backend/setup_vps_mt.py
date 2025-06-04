#!/usr/bin/env python
"""
Setup script for MetaTrader integration on the VPS.
This script installs the required Python packages and sets up the directory structure.
"""

import os
import sys
import argparse
import paramiko
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# VPS connection details
VPS_HOST = os.getenv("VPS_HOST")
VPS_USERNAME = os.getenv("VPS_USERNAME")
VPS_PASSWORD = os.getenv("VPS_PASSWORD")
VPS_KEY_PATH = os.getenv("VPS_KEY_PATH")

# MetaTrader path
MT_TERMINAL_PATH = os.getenv("MT_TERMINAL_PATH", "/home/your-user/.wine/drive_c/Program Files/MetaTrader 5")

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

def check_python_installation(vps):
    """Check if Python is installed on the VPS"""
    print("\n🔍 Checking Python installation...")
    
    stdout, stderr = vps.execute_command("which python3")
    if stdout:
        print(f"✅ Python found at: {stdout.strip()}")
        
        # Check Python version
        stdout, stderr = vps.execute_command("python3 --version")
        if stdout:
            print(f"✅ {stdout.strip()}")
        
        return True
    else:
        print("❌ Python not found")
        return False

def install_python(vps):
    """Install Python on the VPS"""
    print("\n🔧 Installing Python...")
    
    # Try to detect the OS
    stdout, stderr = vps.execute_command("cat /etc/os-release | grep -E '^ID=' | cut -d= -f2")
    os_id = stdout.strip().replace('"', '')
    
    if os_id in ["ubuntu", "debian"]:
        print(f"✅ Detected {os_id} system")
        
        # Update package lists
        print("Updating package lists...")
        vps.execute_command("apt update -y")
        
        # Install Python and pip
        print("Installing Python and pip...")
        stdout, stderr = vps.execute_command("apt install -y python3 python3-pip")
        
        if stderr and "E:" in stderr:
            print(f"❌ Error installing Python: {stderr}")
            return False
        
        # Create symlink for python command
        vps.execute_command("ln -sf /usr/bin/python3 /usr/bin/python")
        
        print("✅ Python installed successfully")
        return True
    elif os_id in ["centos", "rhel", "fedora"]:
        print(f"✅ Detected {os_id} system")
        
        # Install Python and pip
        print("Installing Python and pip...")
        stdout, stderr = vps.execute_command("yum install -y python3 python3-pip")
        
        if stderr and "Error:" in stderr:
            print(f"❌ Error installing Python: {stderr}")
            return False
        
        # Create symlink for python command
        vps.execute_command("ln -sf /usr/bin/python3 /usr/bin/python")
        
        print("✅ Python installed successfully")
        return True
    else:
        print(f"❓ Unknown OS: {os_id}")
        print("Please install Python manually on your VPS")
        return False

def install_metatrader_package(vps):
    """Install the MetaTrader5 Python package"""
    print("\n🔧 Installing MetaTrader5 Python package...")
    
    # Install MetaTrader5 package
    stdout, stderr = vps.execute_command("pip3 install MetaTrader5")
    
    if stderr and "ERROR:" in stderr:
        print(f"❌ Error installing MetaTrader5 package: {stderr}")
        
        # On Linux, we might need to install wine and additional packages
        print("Trying to install wine and additional dependencies...")
        
        # Check if we're on a Debian-based system
        stdout, stderr = vps.execute_command("cat /etc/os-release | grep -E '^ID=' | cut -d= -f2")
        os_id = stdout.strip().replace('"', '')
        
        if os_id in ["ubuntu", "debian"]:
            # Install wine
            vps.execute_command("apt install -y wine winetricks")
            
            # Try installing the package again
            stdout, stderr = vps.execute_command("pip3 install MetaTrader5")
            
            if stderr and "ERROR:" in stderr:
                print(f"❌ Error installing MetaTrader5 package: {stderr}")
                print("Note: The MetaTrader5 Python package might not work on Linux.")
                print("You may need to use a Windows VPS or a different approach.")
                return False
        else:
            print("Note: The MetaTrader5 Python package might not work on Linux.")
            print("You may need to use a Windows VPS or a different approach.")
            return False
    
    print("✅ MetaTrader5 package installed successfully")
    
    # Install other required packages
    print("Installing other required packages...")
    vps.execute_command("pip3 install paramiko")
    
    return True

def setup_directories(vps):
    """Set up the necessary directories on the VPS"""
    print("\n🔧 Setting up directories...")
    
    # Create scripts directory
    vps.execute_command("mkdir -p ~/mt_scripts")
    
    # Create accounts directory
    vps.execute_command("mkdir -p ~/mt_accounts")
    
    # Create orders directory
    vps.execute_command("mkdir -p ~/mt_orders")
    
    print("✅ Directories created successfully")
    return True

def create_config_file(vps, mt_path):
    """Create the configuration file on the VPS"""
    print("\n🔧 Creating configuration file...")
    
    config_content = f"""#!/usr/bin/env python
\"\"\"
Configuration file for VPS scripts.
This file contains paths and settings for the MetaTrader terminal.
\"\"\"

import os

# Path to MetaTrader terminal (can be overridden by environment variable)
MT_TERMINAL_PATH = os.getenv("MT_TERMINAL_PATH", "{mt_path}")

# Path to store account information
ACCOUNTS_DIR = os.path.expanduser("~/mt_accounts")

# Path to store order information
ORDERS_DIR = os.path.expanduser("~/mt_orders")

# Ensure directories exist
def ensure_directories():
    \"\"\"Ensure required directories exist\"\"\"
    for directory in [ACCOUNTS_DIR, ORDERS_DIR]:
        if not os.path.exists(directory):
            os.makedirs(directory)
"""
    
    # Save the config file to a temporary location
    temp_file = "temp_config.py"
    with open(temp_file, "w") as f:
        f.write(config_content)
    
    # Upload the file to the VPS
    sftp = vps.client.open_sftp()
    sftp.put(temp_file, "~/mt_scripts/config.py")
    sftp.close()
    
    # Remove the temporary file
    os.remove(temp_file)
    
    # Make the config file executable
    vps.execute_command("chmod +x ~/mt_scripts/config.py")
    
    print("✅ Configuration file created successfully")
    return True

def upload_scripts(vps):
    """Upload the MetaTrader scripts to the VPS"""
    print("\n🔧 Uploading MetaTrader scripts...")
    
    # Get the list of script files
    script_files = [
        "connect_account.py",
        "place_market_order.py",
        "list_symbols.py",
        "get_positions.py",
        "close_position.py",
        "get_account_info.py"
    ]
    
    # Upload each script
    sftp = vps.client.open_sftp()
    for script in script_files:
        local_path = f"vps_scripts/{script}"
        remote_path = f"~/mt_scripts/{script}"
        
        try:
            sftp.put(local_path, remote_path)
            print(f"✅ Uploaded {script}")
        except Exception as e:
            print(f"❌ Error uploading {script}: {str(e)}")
    
    sftp.close()
    
    # Make the scripts executable
    vps.execute_command("chmod +x ~/mt_scripts/*.py")
    
    print("✅ Scripts uploaded successfully")
    return True

def test_metatrader_connection(vps, mt_path):
    """Test the MetaTrader connection"""
    print("\n🔧 Testing MetaTrader connection...")
    
    # Check if MetaTrader is installed
    stdout, stderr = vps.execute_command(f"ls -la '{mt_path}' 2>/dev/null")
    
    if stderr and "No such file or directory" in stderr:
        print(f"❌ MetaTrader not found at {mt_path}")
        print("Please check the path and make sure MetaTrader is installed.")
        return False
    
    print(f"✅ MetaTrader found at {mt_path}")
    
    # Test the MetaTrader5 Python package
    test_script = """
import sys
try:
    import MetaTrader5 as mt5
    print("MetaTrader5 package imported successfully")
    
    # Try to initialize
    if mt5.initialize():
        print("MetaTrader initialized successfully")
        
        # Get terminal info
        info = mt5.terminal_info()
        if info is not None:
            print(f"Terminal path: {info.path}")
            print(f"Connected: {info.connected}")
            print(f"Community account: {info.community_account}")
            print(f"Community balance: {info.community_balance}")
        else:
            print("Failed to get terminal info")
        
        # Shutdown
        mt5.shutdown()
    else:
        print(f"Failed to initialize MetaTrader: {mt5.last_error()}")
except Exception as e:
    print(f"Error: {str(e)}")
    sys.exit(1)
"""
    
    # Save the test script to a temporary file
    temp_file = "temp_test.py"
    with open(temp_file, "w") as f:
        f.write(test_script)
    
    # Upload the file to the VPS
    sftp = vps.client.open_sftp()
    sftp.put(temp_file, "~/mt_test.py")
    sftp.close()
    
    # Remove the temporary file
    os.remove(temp_file)
    
    # Run the test script
    stdout, stderr = vps.execute_command(f"python3 ~/mt_test.py")
    
    if stderr:
        print(f"❌ Error testing MetaTrader connection: {stderr}")
        return False
    
    print(stdout)
    
    if "MetaTrader initialized successfully" in stdout:
        print("✅ MetaTrader connection test passed")
        return True
    else:
        print("❌ MetaTrader connection test failed")
        return False

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="Setup MetaTrader integration on the VPS")
    parser.add_argument("--mt-path", help="Path to MetaTrader terminal on the VPS", default=MT_TERMINAL_PATH)
    args = parser.parse_args()
    
    mt_path = args.mt_path
    
    print("🚀 MetaTrader VPS Setup")
    print(f"VPS Host: {VPS_HOST}")
    print(f"VPS Username: {VPS_USERNAME}")
    print(f"MetaTrader Path: {mt_path}")
    
    # Connect to VPS
    vps = VPSManager(VPS_HOST, VPS_USERNAME, VPS_PASSWORD, VPS_KEY_PATH)
    if not vps.connect():
        return
    
    try:
        # Check if Python is installed
        if not check_python_installation(vps):
            # Install Python
            if not install_python(vps):
                print("❌ Failed to install Python. Please install it manually.")
                return
        
        # Install MetaTrader5 package
        if not install_metatrader_package(vps):
            print("❌ Failed to install MetaTrader5 package.")
            print("Note: The MetaTrader5 Python package might not work on Linux.")
            print("You may need to use a Windows VPS or a different approach.")
        
        # Set up directories
        setup_directories(vps)
        
        # Create configuration file
        create_config_file(vps, mt_path)
        
        # Upload scripts
        upload_scripts(vps)
        
        # Test MetaTrader connection
        test_metatrader_connection(vps, mt_path)
        
        print("\n✅ Setup completed!")
        print("You can now use the Travidox backend with your MetaTrader terminal on the VPS.")
        
    finally:
        vps.close()

if __name__ == "__main__":
    main() 