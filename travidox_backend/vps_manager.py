import os
import paramiko
import json
import time
import logging
from typing import Dict, Any, Optional, List, Tuple

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class VPSManager:
    """
    Manages communication with the VPS running MetaTrader terminal.
    This class handles SSH connections and command execution on the VPS.
    """
    
    def __init__(self, 
                 host: str, 
                 username: str, 
                 password: Optional[str] = None, 
                 key_path: Optional[str] = None, 
                 port: int = 22):
        """
        Initialize the VPS manager with connection details.
        
        Args:
            host: VPS hostname or IP address
            username: SSH username
            password: SSH password (optional if key_path is provided)
            key_path: Path to SSH private key file (optional if password is provided)
            port: SSH port (default: 22)
        """
        self.host = host
        self.username = username
        self.password = password
        self.key_path = key_path
        self.port = port
        self.client = None
        self._connect()
    
    def _connect(self) -> None:
        """Establish SSH connection to the VPS"""
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
            logger.info(f"Successfully connected to VPS at {self.host}")
        except Exception as e:
            logger.error(f"Failed to connect to VPS: {str(e)}")
            raise
    
    def execute_command(self, command: str) -> Tuple[str, str]:
        """
        Execute a command on the VPS via SSH.
        
        Args:
            command: The command to execute
            
        Returns:
            Tuple of (stdout, stderr)
        """
        if not self.client:
            self._connect()
            
        try:
            stdin, stdout, stderr = self.client.exec_command(command)
            return stdout.read().decode('utf-8'), stderr.read().decode('utf-8')
        except Exception as e:
            logger.error(f"Failed to execute command '{command}': {str(e)}")
            raise
    
    def upload_file(self, local_path: str, remote_path: str) -> None:
        """
        Upload a file to the VPS.
        
        Args:
            local_path: Path to the local file
            remote_path: Destination path on the VPS
        """
        if not self.client:
            self._connect()
            
        try:
            sftp = self.client.open_sftp()
            sftp.put(local_path, remote_path)
            sftp.close()
            logger.info(f"Successfully uploaded {local_path} to {remote_path}")
        except Exception as e:
            logger.error(f"Failed to upload file: {str(e)}")
            raise
    
    def download_file(self, remote_path: str, local_path: str) -> None:
        """
        Download a file from the VPS.
        
        Args:
            remote_path: Path to the file on the VPS
            local_path: Destination path on the local machine
        """
        if not self.client:
            self._connect()
            
        try:
            sftp = self.client.open_sftp()
            sftp.get(remote_path, local_path)
            sftp.close()
            logger.info(f"Successfully downloaded {remote_path} to {local_path}")
        except Exception as e:
            logger.error(f"Failed to download file: {str(e)}")
            raise
    
    def close(self) -> None:
        """Close the SSH connection"""
        if self.client:
            self.client.close()
            self.client = None
            logger.info("SSH connection closed")
    
    def __del__(self) -> None:
        """Ensure connection is closed when object is garbage collected"""
        self.close()


class MetaTraderManager:
    """
    Manages MetaTrader operations on the VPS.
    This class provides methods for account management and trading operations.
    """
    
    def __init__(self, vps_manager: VPSManager, mt_scripts_dir: str):
        """
        Initialize the MetaTrader manager.
        
        Args:
            vps_manager: VPSManager instance for VPS communication
            mt_scripts_dir: Directory on the VPS where MetaTrader scripts are located
        """
        self.vps = vps_manager
        self.mt_scripts_dir = mt_scripts_dir
    
    def connect_account(self, 
                       login: str, 
                       password: str, 
                       server: str, 
                       platform: str = "mt5") -> Dict[str, Any]:
        """
        Connect to a MetaTrader account on the VPS.
        
        Args:
            login: MetaTrader account login
            password: MetaTrader account password
            server: MetaTrader server name
            platform: MetaTrader platform version (mt4 or mt5)
            
        Returns:
            Dictionary with connection status and details
        """
        # Create a JSON config file for the account
        config = {
            "login": login,
            "password": password,
            "server": server,
            "platform": platform
        }
        
        config_json = json.dumps(config)
        
        # Create a temporary config file
        temp_config = f"/tmp/mt_config_{login}.json"
        
        try:
            # Save config to VPS
            command = f"echo '{config_json}' > {temp_config}"
            self.vps.execute_command(command)
            
            # Run the connection script
            script_path = f"{self.mt_scripts_dir}/connect_account.py"
            command = f"python {script_path} --config {temp_config}"
            stdout, stderr = self.vps.execute_command(command)
            
            if stderr:
                logger.error(f"Error connecting account: {stderr}")
                return {"success": False, "error": stderr}
            
            # Parse the output as JSON
            try:
                result = json.loads(stdout)
                return result
            except json.JSONDecodeError:
                logger.error(f"Failed to parse connection result: {stdout}")
                return {"success": False, "error": "Invalid response format", "raw_output": stdout}
                
        finally:
            # Clean up the temporary config file
            self.vps.execute_command(f"rm -f {temp_config}")
    
    def get_account_info(self, account_id: str) -> Dict[str, Any]:
        """
        Get information about a connected MetaTrader account.
        
        Args:
            account_id: The account identifier
            
        Returns:
            Dictionary with account information
        """
        script_path = f"{self.mt_scripts_dir}/get_account_info.py"
        command = f"python {script_path} --account_id {account_id}"
        stdout, stderr = self.vps.execute_command(command)
        
        if stderr:
            logger.error(f"Error getting account info: {stderr}")
            return {"success": False, "error": stderr}
        
        try:
            result = json.loads(stdout)
            return result
        except json.JSONDecodeError:
            logger.error(f"Failed to parse account info: {stdout}")
            return {"success": False, "error": "Invalid response format", "raw_output": stdout}
    
    def place_market_order(self, 
                          account_id: str, 
                          symbol: str, 
                          order_type: str, 
                          volume: float, 
                          stop_loss: Optional[float] = None, 
                          take_profit: Optional[float] = None) -> Dict[str, Any]:
        """
        Place a market order.
        
        Args:
            account_id: The account identifier
            symbol: The trading symbol (e.g., "EURUSD")
            order_type: Order type ("BUY" or "SELL")
            volume: Order volume in lots
            stop_loss: Optional stop loss price
            take_profit: Optional take profit price
            
        Returns:
            Dictionary with order result
        """
        # Create order parameters
        order_params = {
            "account_id": account_id,
            "symbol": symbol,
            "order_type": order_type,
            "volume": volume
        }
        
        if stop_loss is not None:
            order_params["stop_loss"] = stop_loss
            
        if take_profit is not None:
            order_params["take_profit"] = take_profit
        
        order_json = json.dumps(order_params)
        
        # Create a temporary order file
        temp_order = f"/tmp/mt_order_{account_id}_{int(time.time())}.json"
        
        try:
            # Save order to VPS
            command = f"echo '{order_json}' > {temp_order}"
            self.vps.execute_command(command)
            
            # Run the order placement script
            script_path = f"{self.mt_scripts_dir}/place_market_order.py"
            command = f"python {script_path} --order {temp_order}"
            stdout, stderr = self.vps.execute_command(command)
            
            if stderr:
                logger.error(f"Error placing order: {stderr}")
                return {"success": False, "error": stderr}
            
            try:
                result = json.loads(stdout)
                return result
            except json.JSONDecodeError:
                logger.error(f"Failed to parse order result: {stdout}")
                return {"success": False, "error": "Invalid response format", "raw_output": stdout}
                
        finally:
            # Clean up the temporary order file
            self.vps.execute_command(f"rm -f {temp_order}")
    
    def get_positions(self, account_id: str) -> Dict[str, Any]:
        """
        Get open positions for an account.
        
        Args:
            account_id: The account identifier
            
        Returns:
            Dictionary with positions information
        """
        script_path = f"{self.mt_scripts_dir}/get_positions.py"
        command = f"python {script_path} --account_id {account_id}"
        stdout, stderr = self.vps.execute_command(command)
        
        if stderr:
            logger.error(f"Error getting positions: {stderr}")
            return {"success": False, "error": stderr}
        
        try:
            result = json.loads(stdout)
            return result
        except json.JSONDecodeError:
            logger.error(f"Failed to parse positions: {stdout}")
            return {"success": False, "error": "Invalid response format", "raw_output": stdout}
    
    def close_position(self, account_id: str, position_id: int) -> Dict[str, Any]:
        """
        Close a specific position.
        
        Args:
            account_id: The account identifier
            position_id: The position identifier
            
        Returns:
            Dictionary with close operation result
        """
        script_path = f"{self.mt_scripts_dir}/close_position.py"
        command = f"python {script_path} --account_id {account_id} --position_id {position_id}"
        stdout, stderr = self.vps.execute_command(command)
        
        if stderr:
            logger.error(f"Error closing position: {stderr}")
            return {"success": False, "error": stderr}
        
        try:
            result = json.loads(stdout)
            return result
        except json.JSONDecodeError:
            logger.error(f"Failed to parse close result: {stdout}")
            return {"success": False, "error": "Invalid response format", "raw_output": stdout} 