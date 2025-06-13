import firebase_admin
from firebase_admin import credentials, firestore
import json
import os
import time
from typing import Dict, Any, List, Optional
from datetime import datetime

# Initialize Firebase Admin SDK if not already initialized
if not firebase_admin._apps:
    try:
        cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-credentials.json")
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        print("✅ Firebase Admin SDK initialized successfully")
    except Exception as e:
        print(f"⚠️ WARNING: Failed to initialize Firebase Admin SDK: {str(e)}")
        print("⚠️ Falling back to local JSON storage")

# Get Firestore client if Firebase is initialized
db = firestore.client() if firebase_admin._apps else None

# Collections
users_collection = "users"
virtual_accounts_collection = "virtual_accounts"
virtual_positions_collection = "virtual_positions"
trading_history_collection = "trading_history"

# Firebase Firestore database class
class FirestoreDB:
    """Firebase Firestore database for virtual trading"""
    
    def __init__(self):
        """Initialize FirestoreDB with Firestore client"""
        self.db = db
        self.fallback = SimpleDB()
    
    def get_virtual_account(self, user_id: str) -> Dict[str, Any]:
        """Get user's virtual trading account"""
        if not self.db:
            return self.fallback.get_virtual_account(user_id)
        
        try:
            account_ref = self.db.collection(virtual_accounts_collection).document(user_id)
            account_doc = account_ref.get()
            
            if account_doc.exists:
                account_data = account_doc.to_dict()
                # Convert any Sentinel objects to strings to make it JSON serializable
                for key, value in list(account_data.items()):
                    if not isinstance(value, (str, int, float, bool, list, dict)) or value is None:
                        account_data[key] = str(value)
                return account_data
            
            # Create default account with $1000 if it doesn't exist
            default_account = {
                "balance": 1000.0,
                "equity": 1000.0,
                "margin": 0.0,
                "free_margin": 1000.0,
                "margin_level": 0.0,
                "floating_pnl": 0.0,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            account_ref.set(default_account)
            return default_account
        except Exception as e:
            print(f"Error getting Firestore virtual account: {e}")
            return self.fallback.get_virtual_account(user_id)
    
    def update_virtual_account(self, user_id: str, data: Dict[str, Any]) -> bool:
        """Update user's virtual trading account"""
        if not self.db:
            return self.fallback.update_virtual_account(user_id, data)
        
        try:
            data["updated_at"] = datetime.now().isoformat()
            account_ref = self.db.collection(virtual_accounts_collection).document(user_id)
            account_ref.set(data, merge=True)
            return True
        except Exception as e:
            print(f"Error updating Firestore virtual account: {e}")
            return self.fallback.update_virtual_account(user_id, data)
    
    def add_virtual_position(self, user_id: str, position_data: Dict[str, Any]) -> str:
        """Add a new virtual position for a user"""
        if not self.db:
            return self.fallback.add_virtual_position(user_id, position_data)
        
        try:
            position_data["created_at"] = datetime.now().isoformat()
            position_data["updated_at"] = datetime.now().isoformat()
            position_data["user_id"] = user_id
            
            position_ref = self.db.collection(virtual_positions_collection).document()
            position_ref.set(position_data)
            
            # Store the Firestore document ID in the position data
            position_data["position_id"] = position_ref.id
            position_ref.update({"position_id": position_ref.id})
            
            return position_ref.id
        except Exception as e:
            print(f"Error adding Firestore virtual position: {e}")
            return self.fallback.add_virtual_position(user_id, position_data)
    
    def get_virtual_positions(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all virtual positions for a user"""
        if not self.db:
            return self.fallback.get_virtual_positions(user_id)
        
        try:
            positions_ref = self.db.collection(virtual_positions_collection).where("user_id", "==", user_id).where("closed", "==", False)
            positions = positions_ref.stream()
            
            result = []
            for pos in positions:
                pos_dict = pos.to_dict()
                # Convert any Sentinel objects to strings to make it JSON serializable
                for key, value in list(pos_dict.items()):
                    if not isinstance(value, (str, int, float, bool, list, dict)) or value is None:
                        pos_dict[key] = str(value)
                result.append(pos_dict)
            
            return result
        except Exception as e:
            print(f"Error getting Firestore virtual positions: {e}")
            return self.fallback.get_virtual_positions(user_id)
    
    def close_virtual_position(self, user_id: str, position_id: str, close_price: float, profit_loss: float) -> bool:
        """Close a virtual position and update account balance"""
        if not self.db:
            return self.fallback.close_virtual_position(user_id, position_id, close_price, profit_loss)
        
        try:
            # Get position
            position_ref = self.db.collection(virtual_positions_collection).document(position_id)
            position_doc = position_ref.get()
            
            if not position_doc.exists:
                # Try to find by position_id field
                positions_ref = self.db.collection(virtual_positions_collection).where("position_id", "==", position_id).limit(1)
                positions = positions_ref.stream()
                position_docs = list(positions)
                
                if not position_docs:
                    return False
                
                position_ref = position_docs[0].reference
                position = position_docs[0].to_dict()
            else:
                position = position_doc.to_dict()
            
            # Check if position belongs to user
            if position.get("user_id") != user_id:
                return False
            
            # Mark position as closed
            position_ref.update({
                "closed": True,
                "close_price": close_price,
                "profit_loss": profit_loss,
                "closed_at": datetime.now().isoformat()
            })
            
            # Add to history
            history_data = {
                "user_id": user_id,
                "position_id": position_id,
                "symbol": position.get("symbol"),
                "order_type": position.get("order_type"),
                "volume": position.get("volume"),
                "open_price": position.get("open_price"),
                "close_price": close_price,
                "profit_loss": profit_loss,
                "open_time": position.get("open_time") or position.get("created_at"),
                "close_time": datetime.now().isoformat()
            }
            
            self.add_trading_history(user_id, history_data)
            
            # Update account balance
            account = self.get_virtual_account(user_id)
            account["balance"] = account.get("balance", 1000.0) + profit_loss
            account["equity"] = account["balance"]
            account["margin"] = max(0, account.get("margin", 0.0) - (position.get("volume", 0.0) * position.get("open_price", 0.0) * 0.01))
            account["free_margin"] = account["balance"] - account["margin"]
            
            self.update_virtual_account(user_id, account)
            return True
        except Exception as e:
            print(f"Error closing Firestore virtual position: {e}")
            return self.fallback.close_virtual_position(user_id, position_id, close_price, profit_loss)
    
    def add_trading_history(self, user_id: str, history_data: Dict[str, Any]) -> str:
        """Add a new trading history entry for a user"""
        if not self.db:
            return self.fallback.add_trading_history(user_id, history_data)
        
        try:
            history_data["created_at"] = datetime.now().isoformat()
            history_data["user_id"] = user_id
            
            history_ref = self.db.collection(trading_history_collection).document()
            history_ref.set(history_data)
            return history_ref.id
        except Exception as e:
            print(f"Error adding Firestore trading history: {e}")
            return self.fallback.add_trading_history(user_id, history_data)
    
    def get_trading_history(self, user_id: str) -> List[Dict[str, Any]]:
        """Get trading history for a user"""
        if not self.db:
            return self.fallback.get_trading_history(user_id)
        
        try:
            history_ref = self.db.collection(trading_history_collection).where("user_id", "==", user_id).order_by("created_at", direction=firestore.Query.DESCENDING)
            history = history_ref.stream()
            return [hist.to_dict() for hist in history]
        except Exception as e:
            print(f"Error getting Firestore trading history: {e}")
            return self.fallback.get_trading_history(user_id)
    
    def update_virtual_position(self, user_id: str, position_id: str, data: Dict[str, Any]) -> bool:
        """Update a virtual position for a user"""
        if not self.db:
            return self.fallback.update_virtual_position(user_id, position_id, data)
        
        try:
            data["updated_at"] = firestore.SERVER_TIMESTAMP
            
            # Get position reference
            position_ref = self.db.collection(virtual_positions_collection).document(position_id)
            position_doc = position_ref.get()
            
            if not position_doc.exists:
                # Try to find by position_id field
                positions_ref = self.db.collection(virtual_positions_collection).where("position_id", "==", position_id).limit(1)
                positions = positions_ref.stream()
                position_docs = list(positions)
                
                if not position_docs:
                    return False
                
                position_ref = position_docs[0].reference
                position = position_docs[0].to_dict()
                
                # Check if position belongs to user
                if position.get("user_id") != user_id:
                    return False
            
            # Update position
            position_ref.update(data)
            return True
        except Exception as e:
            print(f"Error updating Firestore virtual position: {e}")
            return self.fallback.update_virtual_position(user_id, position_id, data)

# Simple local database class (used as fallback)
class SimpleDB:
    """Simple file-based database for development"""
    
    def __init__(self, db_file: str = None):
        """Initialize SimpleDB with database file"""
        self.accounts_file = "virtual_accounts.json"
        self.positions_file = "virtual_positions.json"
        self.history_file = "trading_history.json"
        
        # Ensure database files exist
        self._ensure_db_files()
    
    def _ensure_db_files(self):
        """Ensure database files exist"""
        for file_name in [self.accounts_file, self.positions_file, self.history_file]:
            if not os.path.exists(file_name):
                with open(file_name, 'w') as f:
                    json.dump({}, f)
    
    def _load_data(self, file_name: str) -> Dict[str, Any]:
        """Load data from file"""
        try:
            with open(file_name, 'r') as f:
                    return json.load(f)
        except:
        return {}
    
    def _save_data(self, file_name: str, data: Dict[str, Any]) -> None:
        """Save data to file"""
        with open(file_name, 'w') as f:
            json.dump(data, f, indent=2)
    
    def get_virtual_account(self, user_id: str) -> Dict[str, Any]:
        """Get user's virtual trading account"""
        accounts = self._load_data(self.accounts_file)
        
        # Create default account if it doesn't exist
        if user_id not in accounts:
            accounts[user_id] = {
                "balance": 1000.0,
                "equity": 1000.0,
                "margin": 0.0,
                "free_margin": 1000.0,
                "margin_level": 0.0,
                "floating_pnl": 0.0,
                "created_at": time.time(),
                "updated_at": time.time()
            }
            self._save_data(self.accounts_file, accounts)
        
        return accounts.get(user_id, {})
    
    def update_virtual_account(self, user_id: str, data: Dict[str, Any]) -> bool:
        """Update user's virtual trading account"""
        accounts = self._load_data(self.accounts_file)
        
        if user_id not in accounts:
            accounts[user_id] = {
                "balance": 1000.0,
                "equity": 1000.0,
                "margin": 0.0,
                "free_margin": 1000.0,
                "margin_level": 0.0,
                "floating_pnl": 0.0
            }
        
        accounts[user_id].update(data)
        accounts[user_id]["updated_at"] = time.time()
        
        self._save_data(self.accounts_file, accounts)
        return True
    
    def add_virtual_position(self, user_id: str, position_data: Dict[str, Any]) -> str:
        """Add a new virtual position for a user"""
        positions = self._load_data(self.positions_file)
        
        if user_id not in positions:
            positions[user_id] = []
        
        # Generate position ID
        position_id = f"pos_{len(positions[user_id]) + 1}"
        position_data["position_id"] = position_id
        position_data["created_at"] = time.time()
        position_data["updated_at"] = time.time()
        position_data["user_id"] = user_id
        
        positions[user_id].append(position_data)
        self._save_data(self.positions_file, positions)
        
        return position_id
    
    def get_virtual_positions(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all virtual positions for a user"""
        positions = self._load_data(self.positions_file)
        user_positions = positions.get(user_id, [])
        
        # Filter out closed positions
        return [pos for pos in user_positions if not pos.get("closed", False)]
    
    def close_virtual_position(self, user_id: str, position_id: str, close_price: float, profit_loss: float) -> bool:
        """Close a virtual position and update account balance"""
        positions = self._load_data(self.positions_file)
        user_positions = positions.get(user_id, [])
        
        position = None
        position_index = None
        
        for i, pos in enumerate(user_positions):
            if pos.get("position_id") == position_id:
                position = pos
                position_index = i
                break
        
        if position is None:
            return False
        
        # Mark position as closed
        position["closed"] = True
        position["close_price"] = close_price
        position["profit_loss"] = profit_loss
        position["closed_at"] = time.time()
        
        # Update positions file
        positions[user_id][position_index] = position
        self._save_data(self.positions_file, positions)
        
        # Add to history
        history_data = {
            "user_id": user_id,
            "position_id": position_id,
            "symbol": position.get("symbol"),
            "order_type": position.get("order_type"),
            "volume": position.get("volume"),
            "open_price": position.get("open_price"),
            "close_price": close_price,
            "profit_loss": profit_loss,
            "open_time": position.get("open_time") or position.get("created_at"),
            "close_time": time.time()
        }
        
        self.add_trading_history(user_id, history_data)
        
        # Update account balance
        account = self.get_virtual_account(user_id)
        account["balance"] = account.get("balance", 1000.0) + profit_loss
        account["equity"] = account["balance"]
        account["margin"] = max(0, account.get("margin", 0.0) - (position.get("volume", 0.0) * position.get("open_price", 0.0) * 0.01))
        account["free_margin"] = account["balance"] - account["margin"]
        
        self.update_virtual_account(user_id, account)
        return True
    
    def add_trading_history(self, user_id: str, history_data: Dict[str, Any]) -> str:
        """Add a new trading history entry for a user"""
        history = self._load_data(self.history_file)
        
        if user_id not in history:
            history[user_id] = []
        
        history_data["created_at"] = time.time()
        history[user_id].append(history_data)
        
        self._save_data(self.history_file, history)
        return "local_id"
    
    def get_trading_history(self, user_id: str) -> List[Dict[str, Any]]:
        """Get trading history for a user"""
        history = self._load_data(self.history_file)
        return history.get(user_id, [])
    
    def update_virtual_position(self, user_id: str, position_id: str, data: Dict[str, Any]) -> bool:
        """Update a virtual position for a user"""
        positions = self._load_data(self.positions_file)
        
        if user_id not in positions:
            return False
        
        user_positions = positions[user_id]
        
        # Find the position by ID
        for i, position in enumerate(user_positions):
            if position.get("position_id") == position_id:
                # Update position data
                positions[user_id][i].update(data)
                positions[user_id][i]["updated_at"] = time.time()
                
                # Save updated positions
                self._save_data(self.positions_file, positions)
                return True
        
        return False

# Create database instances
firestore_db = FirestoreDB()
simple_db = SimpleDB()

# Functions to use in other modules
def get_user_data(user_id: str) -> Dict[str, Any]:
    """Get user data from Firestore"""
    if not db:
        # Fallback to local JSON in development mode
        try:
            with open('user_accounts.json', 'r') as f:
                users = json.load(f)
                return users.get(user_id, {})
        except:
            return {}
    
    user_ref = db.collection(users_collection).document(user_id)
    user_doc = user_ref.get()
    
    if user_doc.exists:
        return user_doc.to_dict()
    return {}

def update_user_data(user_id: str, data: Dict[str, Any]) -> bool:
    """Update user data in Firestore"""
    if not db:
        # Fallback to local JSON in development mode
        try:
            with open('user_accounts.json', 'r') as f:
                users = json.load(f)
            
            if user_id not in users:
                users[user_id] = {}
            
            users[user_id].update(data)
            
            with open('user_accounts.json', 'w') as f:
                json.dump(users, f, indent=2)
            return True
        except Exception as e:
            print(f"Error updating local user data: {e}")
            return False
    
    try:
        user_ref = db.collection(users_collection).document(user_id)
        user_ref.set(data, merge=True)
        return True
    except Exception as e:
        print(f"Error updating Firestore user data: {e}")
        return False
    
# Virtual account functions that use FirestoreDB
def get_virtual_account(user_id: str) -> Dict[str, Any]:
    """Get user's virtual trading account"""
    return firestore_db.get_virtual_account(user_id)

def update_virtual_account(user_id: str, data: Dict[str, Any]) -> bool:
    """Update user's virtual trading account"""
    return firestore_db.update_virtual_account(user_id, data)

def add_virtual_position(user_id: str, position_data: Dict[str, Any]) -> str:
    """Add a new virtual position for a user"""
    return firestore_db.add_virtual_position(user_id, position_data)

def get_virtual_positions(user_id: str) -> List[Dict[str, Any]]:
    """Get all virtual positions for a user"""
    return firestore_db.get_virtual_positions(user_id)

def close_virtual_position(user_id: str, position_id: str, close_price: float, profit_loss: float) -> bool:
    """Close a virtual position and update account balance"""
    return firestore_db.close_virtual_position(user_id, position_id, close_price, profit_loss)

def add_trading_history(user_id: str, history_data: Dict[str, Any]) -> str:
    """Add a new trading history entry for a user"""
    return firestore_db.add_trading_history(user_id, history_data)

def get_trading_history(user_id: str) -> List[Dict[str, Any]]:
    """Get trading history for a user"""
    return firestore_db.get_trading_history(user_id)

def update_virtual_position(user_id: str, position_id: str, data: Dict[str, Any]) -> bool:
    """Update a virtual position"""
    return firestore_db.update_virtual_position(user_id, position_id, data) 