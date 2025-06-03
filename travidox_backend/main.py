from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, auth
import os
from dotenv import load_dotenv
from typing import Optional, Dict, Any
import json
from db import db  # Import the database module
from vps_manager import VPSManager, MetaTraderManager

# Load environment variables
load_dotenv()

# Initialize Firebase Admin SDK
cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-credentials.json")
try:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Failed to initialize Firebase: {e}")
    # Continue without Firebase for development, but it will fail in production
    pass

# Initialize VPS connection
VPS_HOST = os.getenv("VPS_HOST")
VPS_USERNAME = os.getenv("VPS_USERNAME")
VPS_PASSWORD = os.getenv("VPS_PASSWORD")
VPS_KEY_PATH = os.getenv("VPS_KEY_PATH")
VPS_MT_SCRIPTS_DIR = os.getenv("VPS_MT_SCRIPTS_DIR", "~/mt_scripts")

# Initialize VPS manager if credentials are provided
vps_manager = None
mt_manager = None

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
        # Continue without VPS connection for development

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

async def verify_firebase_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.split("Bearer ")[1]
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

@app.post("/connect-account")
async def connect_account(
    account: MetaTraderAccount, 
    user: dict = Depends(verify_firebase_token)
):
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
    if not mt_manager:
        raise HTTPException(status_code=500, detail="VPS connection not configured")
    
    account_data = db.get_user_account(user["uid"])
    
    if not account_data:
        raise HTTPException(status_code=404, detail="No MetaTrader account connected for this user")
    
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
    if not mt_manager:
        raise HTTPException(status_code=500, detail="VPS connection not configured")
    
    account_data = db.get_user_account(user["uid"])
    
    if not account_data:
        raise HTTPException(status_code=404, detail="No MetaTrader account connected for this user")
    
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
    if not mt_manager:
        raise HTTPException(status_code=500, detail="VPS connection not configured")
    
    account_data = db.get_user_account(user["uid"])
    
    if not account_data:
        raise HTTPException(status_code=404, detail="No MetaTrader account connected for this user")
    
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
    if not mt_manager:
        raise HTTPException(status_code=500, detail="VPS connection not configured")
    
    account_data = db.get_user_account(user["uid"])
    
    if not account_data:
        raise HTTPException(status_code=404, detail="No MetaTrader account connected for this user")
    
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 