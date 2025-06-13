from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, auth
import os
from dotenv import load_dotenv
from typing import Optional, Dict, Any, List
import json
from db import db, get_virtual_account, get_virtual_positions, get_trading_history  # Import the database module
from vps_manager import VPSManager, MetaTraderManager
import MetaTrader5 as mt5
from market_data import get_market_data_provider  # Import the market data provider

# Load environment variables
try:
    load_dotenv()
except Exception as e:
    print(f"Warning: Could not load .env file: {e}")

# Development mode flag - HARDCODED TO FALSE
DEV_MODE = False  # Hardcoded to False instead of using os.getenv
DEV_USER_ID = os.getenv("DEV_USER_ID", "dev-user-123")
DEV_USER_EMAIL = os.getenv("DEV_USER_EMAIL", "dev@example.com")
# MetaTrader development credentials (for local MT connection)
DEV_MT_LOGIN = os.getenv("DEV_MT_LOGIN", "81378629")
DEV_MT_PASSWORD = os.getenv("DEV_MT_PASSWORD", "Jayeoba@112")
DEV_MT_SERVER = os.getenv("DEV_MT_SERVER", "Exness-MT5Trial10")
DEV_MT_PLATFORM = os.getenv("DEV_MT_PLATFORM", "mt5")

# Initialize Firebase Admin SDK
cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-credentials.json")
try:
    if not firebase_admin._apps:  # Check if already initialized
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Failed to initialize Firebase: {str(e)}")
    # Continue without Firebase for development
    pass

# Initialize VPS connection or local MT connection
vps_manager = None
mt_manager = None

if DEV_MODE:
    # In development mode, use local MetaTrader API connection
    print("⚠️ DEVELOPMENT MODE: Using local MetaTrader connection ⚠️")
    
    # Check if MetaTrader development credentials are provided
    if not all([DEV_MT_LOGIN, DEV_MT_PASSWORD, DEV_MT_SERVER]):
        print("⚠️ WARNING: MetaTrader development credentials not fully provided.")
        print("Please set DEV_MT_LOGIN, DEV_MT_PASSWORD, and DEV_MT_SERVER in your .env file.")
    
    # Initialize MT5 connection
    if not mt5.initialize():
        print(f"⚠️ WARNING: Failed to initialize MT5: {mt5.last_error()}")
    else:
        print("✅ MT5 initialized successfully")
else:
    # Production mode - Connect to VPS
    VPS_HOST = os.getenv("VPS_HOST")
    VPS_USERNAME = os.getenv("VPS_USERNAME")
    VPS_PASSWORD = os.getenv("VPS_PASSWORD")
    VPS_KEY_PATH = os.getenv("VPS_KEY_PATH")
    VPS_MT_SCRIPTS_DIR = os.getenv("VPS_MT_SCRIPTS_DIR", "~/mt_scripts")

    if VPS_HOST and VPS_USERNAME and (VPS_PASSWORD or VPS_KEY_PATH):
        try:
            vps_manager = VPSManager(
                host=VPS_HOST,
                username=VPS_USERNAME,
                password=VPS_PASSWORD,
                key_path=VPS_KEY_PATH
            )
            mt_manager = MetaTraderManager(
                vps_manager=vps_manager,
                mt_scripts_dir=VPS_MT_SCRIPTS_DIR
            )
            print(f"Successfully connected to VPS at {VPS_HOST}")
        except Exception as e:
            print(f"Failed to connect to VPS: {str(e)}")

# Initialize trading bot for virtual accounts
try:
    from trading_bot import get_trading_bot
    
    # Create trading bot
    trading_bot = get_trading_bot()
    print("✅ Trading bot initialized successfully")
except Exception as e:
    print(f"⚠️ WARNING: Failed to initialize trading bot: {str(e)}")
    trading_bot = None

app = FastAPI(title="Travidox Backend API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MetaTraderAccount(BaseModel):
    login: str
    password: str
    server_name: str
    platform: str = "mt5"  # Default to MT5

class MarketOrder(BaseModel):
    symbol: str
    order_type: str  # BUY or SELL
    volume: float
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None

class Symbol(BaseModel):
    """Model for trading symbol information"""
    name: str
    description: str
    base_currency: str
    profit_currency: str
    digits: int
    trade_mode: str
    spread: float
    tick_size: float
    volume_min: float
    volume_max: float
    volume_step: float
    category: str  # 'forex', 'crypto', 'index', 'commodity', 'stock', 'other'

# Local MetaTrader connection functions
def connect_local_mt(login, password, server, platform="mt5"):
    """Connect to local MetaTrader terminal"""
    if not mt5.initialize():
        return {
            "success": False,
            "error": f"Failed to initialize MT5: {mt5.last_error()}"
        }
    
    # Connect to trading account
    authorized = mt5.login(
        login=int(login),
        password=password,
        server=server
    )
    
    if not authorized:
        mt5.shutdown()
        return {
            "success": False,
            "error": f"Failed to login: {mt5.last_error()}"
        }
    
    return {
        "success": True,
        "account_id": login,
        "message": "Connected to local MetaTrader terminal"
    }

def get_local_account_info(account_id):
    """Get account info from local MetaTrader terminal"""
    if not mt5.initialize():
        return {
            "success": False,
            "error": f"Failed to initialize MT5: {mt5.last_error()}"
        }
    
    # Get account information
    account_info = mt5.account_info()
    
    if not account_info:
        return {
            "success": False,
            "error": f"Failed to get account info: {mt5.last_error()}"
        }
    
    # Convert account info to dictionary
    info = {
        "login": account_info.login,
        "name": mt5.account_info()._asdict().get('name', 'Unknown'),
        "server": mt5.account_info()._asdict().get('server', 'Unknown'),
        "currency": account_info.currency,
        "leverage": f"1:{account_info.leverage}",
        "balance": account_info.balance,
        "equity": account_info.equity,
        "margin": account_info.margin,
        "free_margin": account_info.margin_free,
        "margin_level": account_info.margin_level,
    }
    
    return {
        "success": True,
        "account": info
    }

def get_local_symbols():
    """Get all available symbols from the local MetaTrader terminal"""
    if not mt5.initialize():
        return {
            "success": False,
            "error": f"Failed to initialize MT5: {mt5.last_error()}"
        }
    
    # Get all symbols
    symbols = mt5.symbols_get()
    
    if symbols is None:
        return {
            "success": True,
            "symbols": []
        }
    
    # Format symbols
    formatted_symbols = []
    for symbol in symbols:
        symbol_dict = symbol._asdict()
        
        # Determine category
        name = symbol_dict["name"]
        if any(pair in name for pair in ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD']):
            category = "forex"
        elif any(crypto in name for crypto in ['BTC', 'ETH', 'LTC', 'XRP', 'DOGE']):
            category = "crypto"
        elif any(index in name for index in ['SPX', 'NDX', 'DJI', 'UK100', 'DE30', 'JP225']):
            category = "index"
        elif any(commodity in name for commodity in ['GOLD', 'SILVER', 'OIL', 'GAS', 'XAU']):
            category = "commodity"
        elif 'Vol' in name or any(x in name for x in ['AAPL', 'MSFT', 'GOOGL', 'AMZN']):
            category = "stock"
        else:
            category = "other"
        
        # Add formatted symbol
        formatted_symbols.append({
            "name": symbol_dict["name"],
            "description": symbol_dict.get("description", ""),
            "base_currency": symbol_dict.get("currency_base", ""),
            "profit_currency": symbol_dict.get("currency_profit", ""),
            "digits": symbol_dict.get("digits", 0),
            "trade_mode": str(symbol_dict.get("trade_mode", 0)),
            "spread": symbol_dict.get("spread", 0),
            "tick_size": symbol_dict.get("trade_tick_size", 0),
            "volume_min": symbol_dict.get("volume_min", 0),
            "volume_max": symbol_dict.get("volume_max", 0),
            "volume_step": symbol_dict.get("volume_step", 0),
            "category": category
        })
    
    return {
        "success": True,
        "symbols": formatted_symbols
    }

def get_local_positions(account_id):
    """Get positions from local MetaTrader terminal"""
    if not mt5.initialize():
        return {
            "success": False,
            "error": f"Failed to initialize MT5: {mt5.last_error()}"
        }
    
    # Get all positions
    positions = mt5.positions_get()
    
    if positions is None:
        return {
            "success": True,
            "positions": []
        }
    
    # Format positions
    formatted_positions = []
    for position in positions:
        pos_dict = position._asdict()
        formatted_positions.append({
            "id": pos_dict["ticket"],
            "symbol": pos_dict["symbol"],
            "type": "BUY" if pos_dict["type"] == 0 else "SELL",
            "volume": pos_dict["volume"],
            "price_open": pos_dict["price_open"],
            "current_price": pos_dict["price_current"],
            "profit": pos_dict["profit"],
            "swap": pos_dict["swap"],
            "time_open": pos_dict["time"],
            "stop_loss": pos_dict["sl"],
            "take_profit": pos_dict["tp"]
        })
    
    return {
        "success": True,
        "positions": formatted_positions
    }

def place_local_order(account_id, symbol, order_type, volume, stop_loss=None, take_profit=None):
    """Place order using local MetaTrader terminal"""
    if not mt5.initialize():
        return {
            "success": False,
            "error": f"Failed to initialize MT5: {mt5.last_error()}"
        }
    
    # Prepare order request
    order_type_mt5 = mt5.ORDER_TYPE_BUY if order_type == "BUY" else mt5.ORDER_TYPE_SELL
    
    # Get current price
    symbol_info = mt5.symbol_info(symbol)
    if symbol_info is None:
        return {
            "success": False,
            "error": f"Symbol {symbol} not found"
        }
    
    price = symbol_info.ask if order_type == "BUY" else symbol_info.bid
    
    # Prepare request
    request = {
        "action": mt5.TRADE_ACTION_DEAL,
        "symbol": symbol,
        "volume": float(volume),
        "type": order_type_mt5,
        "price": price,
        "deviation": 20,  # Allow price deviation in points
        "magic": 12345,   # Expert Advisor ID
        "comment": "Travidox order",
        "type_time": mt5.ORDER_TIME_GTC,
        "type_filling": mt5.ORDER_FILLING_IOC,
    }
    
    # Add stop loss and take profit if provided
    if stop_loss:
        request["sl"] = float(stop_loss)
    if take_profit:
        request["tp"] = float(take_profit)
    
    # Send order
    result = mt5.order_send(request)
    
    if result.retcode != mt5.TRADE_RETCODE_DONE:
        return {
            "success": False,
            "error": f"Order failed: {result.comment} (Code: {result.retcode})"
        }
    
    # Get order details
    order_info = result._asdict()
    
    return {
        "success": True,
        "order": {
            "id": order_info["order"],
            "symbol": symbol,
            "type": order_type,
            "volume": volume,
            "price": price,
            "time": order_info["request"]["time"],
            "stop_loss": stop_loss,
            "take_profit": take_profit
        }
    }

def close_local_position(account_id, position_id):
    """Close position using local MetaTrader terminal"""
    if not mt5.initialize():
        return {
            "success": False,
            "error": f"Failed to initialize MT5: {mt5.last_error()}"
        }
    
    # Get position info
    position = mt5.positions_get(ticket=position_id)
    
    if not position:
        return {
            "success": False,
            "error": f"Position {position_id} not found"
        }
    
    position = position[0]._asdict()
    
    # Prepare close request
    request = {
        "action": mt5.TRADE_ACTION_DEAL,
        "symbol": position["symbol"],
        "volume": position["volume"],
        "type": mt5.ORDER_TYPE_SELL if position["type"] == 0 else mt5.ORDER_TYPE_BUY,  # Opposite direction
        "position": position_id,
        "price": position["price_current"],
        "deviation": 20,
        "magic": 12345,
        "comment": "Travidox close position",
        "type_time": mt5.ORDER_TIME_GTC,
        "type_filling": mt5.ORDER_FILLING_IOC,
    }
    
    # Send order
    result = mt5.order_send(request)
    
    if result.retcode != mt5.TRADE_RETCODE_DONE:
        return {
            "success": False,
            "error": f"Close position failed: {result.comment} (Code: {result.retcode})"
        }
    
    return {
        "success": True,
        "message": f"Position {position_id} closed successfully"
    }

async def verify_firebase_token(authorization: Optional[str] = Header(None)):
    """Verify Firebase ID token and return user info"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.split("Bearer ")[1]
    
    # For development, we can accept any token and use a fixed user ID
    if DEV_MODE:
        print("⚠️ DEVELOPMENT MODE: Using development user ID ⚠️")
        return {
            "uid": DEV_USER_ID,
            "email": DEV_USER_EMAIL,
        }
    
    # Normal authentication flow
    try:
        decoded_token = auth.verify_id_token(token)
        return {
            "uid": decoded_token["uid"],
            "email": decoded_token.get("email", ""),
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Travidox API is running"}

@app.get("/symbols")
async def get_symbols(user: dict = Depends(verify_firebase_token), category: Optional[str] = None):
    """Get all available trading symbols/pairs
    
    Parameters:
    - category (optional): Filter symbols by category (forex, crypto, index, commodity, stock, other)
    
    Returns a list of all available trading symbols with details.
    """
    if DEV_MODE:
        # Get symbols from local MetaTrader terminal
        result = get_local_symbols()
        
        if not result.get("success", False):
            raise HTTPException(
                status_code=500, 
                detail=result.get("error", "Failed to get symbols from local terminal")
            )
        
        symbols = result.get("symbols", [])
        
        # Filter by category if specified
        if category:
            symbols = [s for s in symbols if s["category"] == category.lower()]
        
        # Return symbols
        return symbols
    
    # Production mode
    if not mt_manager:
        raise HTTPException(status_code=500, detail="VPS connection not configured")
    
    try:
        # This would need to be implemented in the VPS_Manager class
        # For now, just return an empty list
        return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get symbols: {str(e)}")

@app.post("/connect-account")
async def connect_account(
    account: MetaTraderAccount, 
    user: dict = Depends(verify_firebase_token)
):
    if DEV_MODE:
        # Use provided account info or fallback to env variables
        login = account.login or DEV_MT_LOGIN
        password = account.password or DEV_MT_PASSWORD
        server = account.server_name or DEV_MT_SERVER
        platform = account.platform or DEV_MT_PLATFORM
        
        if not all([login, password, server]):
            raise HTTPException(
                status_code=400, 
                detail="Missing MetaTrader credentials. Provide in request or set in .env file."
            )
        
        # Connect to local MetaTrader terminal
        result = connect_local_mt(login, password, server, platform)
        
        if not result.get("success", False):
            raise HTTPException(
                status_code=500, 
                detail=result.get("error", "Failed to connect to local MetaTrader terminal")
            )
        
        # Store the mapping between Firebase user and MT account
        account_id = result["account_id"]
        db.set_user_account(user["uid"], {
            "account_id": account_id,
            "login": login,
            "server": server,
            "platform": platform,
            "status": "connected"
        })
        
        return {
            "success": True,
            "message": "MetaTrader account connected successfully (Local Terminal)",
            "account_id": account_id
        }
    
    # Production mode
    if not mt_manager:
        raise HTTPException(status_code=500, detail="VPS connection not configured")
    
    try:
        # Connect to MetaTrader account on the VPS
        result = mt_manager.connect_account(
            login=account.login,
            password=account.password,
            server=account.server_name,
            platform=account.platform
        )
        
        if not result.get("success", False):
            raise HTTPException(status_code=500, detail=result.get("error", "Failed to connect account"))
        
        # Store the mapping between Firebase user and MT account
        account_id = result["account_id"]
        db.set_user_account(user["uid"], {
            "account_id": account_id,
            "login": account.login,
            "server": account.server_name,
            "platform": account.platform
        })
        
        return {
            "success": True,
            "message": "MetaTrader account connected successfully",
            "account_id": account_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to connect account: {str(e)}")

@app.get("/account-info")
async def get_account_info(user: dict = Depends(verify_firebase_token)):
    """Get the connected MetaTrader account information for the authenticated user"""
    
    account_data = db.get_user_account(user["uid"])
    
    if not account_data:
        raise HTTPException(status_code=404, detail="No MetaTrader account connected for this user")
    
    if DEV_MODE:
        # Get account info from local MetaTrader terminal
        result = get_local_account_info(account_data["account_id"])
        
        if not result.get("success", False):
            raise HTTPException(
                status_code=500, 
                detail=result.get("error", "Failed to get account information from local terminal")
            )
        
        return result["account"]
    
    # Production mode
    if not mt_manager:
        raise HTTPException(status_code=500, detail="VPS connection not configured")
    
    try:
        # Get account information from the VPS
        result = mt_manager.get_account_info(account_data["account_id"])
        
        if not result.get("success", False):
            raise HTTPException(status_code=500, detail=result.get("error", "Failed to get account information"))
        
        return result["account"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get account information: {str(e)}")

@app.post("/place-order")
async def place_order(
    order: MarketOrder,
    user: dict = Depends(verify_firebase_token)
):
    """Place a market order for the authenticated user"""
    
    account_data = db.get_user_account(user["uid"])
    
    if not account_data:
        raise HTTPException(status_code=404, detail="No MetaTrader account connected for this user")
    
    if DEV_MODE:
        # Place order using local MetaTrader terminal
        result = place_local_order(
            account_id=account_data["account_id"],
            symbol=order.symbol,
            order_type=order.order_type,
            volume=order.volume,
            stop_loss=order.stop_loss,
            take_profit=order.take_profit
        )
        
        if not result.get("success", False):
            raise HTTPException(
                status_code=500, 
                detail=result.get("error", "Failed to place order with local terminal")
            )
        
        return result["order"]
    
    # Production mode
    if not mt_manager:
        raise HTTPException(status_code=500, detail="VPS connection not configured")
    
    try:
        # Place the order on the VPS
        result = mt_manager.place_market_order(
            account_id=account_data["account_id"],
            symbol=order.symbol,
            order_type=order.order_type,
            volume=order.volume,
            stop_loss=order.stop_loss,
            take_profit=order.take_profit
        )
        
        if not result.get("success", False):
            raise HTTPException(status_code=500, detail=result.get("error", "Failed to place order"))
        
        return result["order"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to place order: {str(e)}")

@app.get("/positions")
async def get_positions(user: dict = Depends(verify_firebase_token)):
    """Get open positions for the authenticated user"""
    
    account_data = db.get_user_account(user["uid"])
    
    if not account_data:
        raise HTTPException(status_code=404, detail="No MetaTrader account connected for this user")
    
    if DEV_MODE:
        # Get positions from local MetaTrader terminal
        result = get_local_positions(account_data["account_id"])
        
        if not result.get("success", False):
            raise HTTPException(
                status_code=500, 
                detail=result.get("error", "Failed to get positions from local terminal")
            )
        
        return result.get("positions", [])
    
    # Production mode
    if not mt_manager:
        raise HTTPException(status_code=500, detail="VPS connection not configured")
    
    try:
        # Get positions from the VPS
        result = mt_manager.get_positions(account_data["account_id"])
        
        if not result.get("success", False):
            raise HTTPException(status_code=500, detail=result.get("error", "Failed to get positions"))
        
        return result.get("positions", [])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get positions: {str(e)}")

@app.post("/close-position/{position_id}")
async def close_position(
    position_id: int,
    user: dict = Depends(verify_firebase_token)
):
    """Close a specific position for the authenticated user"""
    
    account_data = db.get_user_account(user["uid"])
    
    if not account_data:
        raise HTTPException(status_code=404, detail="No MetaTrader account connected for this user")
    
    if DEV_MODE:
        # Close position using local MetaTrader terminal
        result = close_local_position(account_data["account_id"], position_id)
        
        if not result.get("success", False):
            raise HTTPException(
                status_code=500, 
                detail=result.get("error", "Failed to close position with local terminal")
            )
        
        return {"success": True, "message": f"Position {position_id} closed successfully (Local Terminal)"}
    
    # Production mode
    if not mt_manager:
        raise HTTPException(status_code=500, detail="VPS connection not configured")
    
    try:
        # Close the position on the VPS
        result = mt_manager.close_position(
            account_id=account_data["account_id"],
            position_id=position_id
        )
        
        if not result.get("success", False):
            raise HTTPException(status_code=500, detail=result.get("error", "Failed to close position"))
        
        return {"success": True, "message": f"Position {position_id} closed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to close position: {str(e)}")

# Virtual Trading Endpoints

@app.get("/virtual-account")
async def get_virtual_account_info(user: dict = Depends(verify_firebase_token)):
    """Get virtual trading account information"""
    try:
        user_id = user["uid"]
        
        # Always create a trading bot instance if not available
        global trading_bot
        if not trading_bot:
            from trading_bot import get_trading_bot
            trading_bot = get_trading_bot()
        
        # Get account info from trading bot
        account_info = trading_bot.get_account_info(user_id)
        
        return {
            "success": True,
            "account": account_info
        }
    except Exception as e:
        print(f"Error getting virtual account info: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

@app.post("/virtual-order")
async def place_virtual_order(
    order: MarketOrder,
    user: dict = Depends(verify_firebase_token)
):
    """Place a virtual order using the trading bot"""
    user_id = user["uid"]
    
    # Always create a trading bot instance if not available
    global trading_bot
    if not trading_bot:
        from trading_bot import get_trading_bot
        trading_bot = get_trading_bot()
    
    try:
        result = trading_bot.place_order(
            user_id=user_id,
            symbol=order.symbol,
            order_type=order.order_type,
            volume=order.volume,
            stop_loss=order.stop_loss,
            take_profit=order.take_profit
        )
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["error"])
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/virtual-position/close/{position_id}")
async def close_virtual_position_endpoint(
    position_id: str,
    user: dict = Depends(verify_firebase_token)
):
    """Close a virtual position"""
    user_id = user["uid"]
    
    # Always create a trading bot instance if not available
    global trading_bot
    if not trading_bot:
        from trading_bot import get_trading_bot
        trading_bot = get_trading_bot()
    
    try:
        result = trading_bot.close_position(user_id, position_id)
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["error"])
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/virtual-positions")
async def get_virtual_positions_endpoint(user: dict = Depends(verify_firebase_token)):
    """Get user's virtual trading positions"""
    try:
        user_id = user["uid"]
        
        # Always create a trading bot instance if not available
        global trading_bot
        if not trading_bot:
            from trading_bot import get_trading_bot
            trading_bot = get_trading_bot()
        
        # Get positions from trading bot
        positions = trading_bot.get_positions(user_id)
        
        return {
            "success": True,
            "positions": positions
        }
    except Exception as e:
        print(f"Error getting virtual positions: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

@app.get("/virtual-history")
async def get_virtual_trading_history(user: dict = Depends(verify_firebase_token)):
    """Get user's virtual trading history"""
    try:
        user_id = user["uid"]
        
        # Always create a trading bot instance if not available
        global trading_bot
        if not trading_bot:
            from trading_bot import get_trading_bot
            trading_bot = get_trading_bot()
        
        # Get trading history from trading bot
        history = trading_bot.get_trading_history(user_id)
        
        return {
            "success": True,
            "history": history
        }
    except Exception as e:
        print(f"Error getting virtual trading history: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

@app.get("/market-price/{symbol}")
async def get_market_price(symbol: str, user: dict = Depends(verify_firebase_token)):
    """Get real-time market price for a symbol"""
    try:
        # Get market data provider
        market_data = get_market_data_provider()
        
        # Get forex quote
        quote = market_data.get_forex_quote(symbol)
        
        if "error" in quote and quote["error"]:
            raise HTTPException(status_code=400, detail=quote["error"])
        
        return {
            "success": True,
            "symbol": symbol,
            "bid": quote["bid"],
            "ask": quote["ask"],
            "last_updated": quote.get("last_updated", "")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/reset-positions")
async def reset_positions(user: dict = Depends(verify_firebase_token)):
    """Reset all positions P&L values to use the new calculation method"""
    try:
        user_id = user["uid"]
        
        # Always create a trading bot instance if not available
        global trading_bot
        if not trading_bot:
            from trading_bot import get_trading_bot
            trading_bot = get_trading_bot()
        
        # Force recalculation of all positions with new multiplier
        positions = trading_bot.get_positions(user_id)
        
        return {
            "success": True,
            "message": f"Successfully reset {len(positions)} positions"
        }
    except Exception as e:
        print(f"Error resetting positions: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 