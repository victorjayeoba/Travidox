import json
import os
from typing import Dict, Any, Optional

class SimpleDB:
    """
    A simple file-based database for storing user-MetaTrader account mappings.
    In a production environment, this should be replaced with a proper database.
    """
    
    def __init__(self, db_file: str = "user_accounts.json"):
        self.db_file = db_file
        self.data = self._load_data()
    
    def _load_data(self) -> Dict[str, Any]:
        """Load data from the database file"""
        if os.path.exists(self.db_file):
            try:
                with open(self.db_file, "r") as f:
                    return json.load(f)
            except json.JSONDecodeError:
                return {}
        return {}
    
    def _save_data(self) -> None:
        """Save data to the database file"""
        with open(self.db_file, "w") as f:
            json.dump(self.data, f, indent=2)
    
    def get_user_account(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get a user's MetaTrader account details"""
        return self.data.get(user_id)
    
    def set_user_account(self, user_id: str, account_data: Dict[str, Any]) -> None:
        """Set a user's MetaTrader account details"""
        self.data[user_id] = account_data
        self._save_data()
    
    def delete_user_account(self, user_id: str) -> bool:
        """Delete a user's MetaTrader account details"""
        if user_id in self.data:
            del self.data[user_id]
            self._save_data()
            return True
        return False
    
    def list_all_accounts(self) -> Dict[str, Any]:
        """List all user accounts (admin only)"""
        return self.data

# Create a singleton instance
db = SimpleDB() 