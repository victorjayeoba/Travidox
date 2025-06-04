"""
Development Account Setup

This script creates a test MetaTrader account mapping for development use.
It uses your actual MetaTrader credentials from the .env file.
"""

import os
import uuid
from dotenv import load_dotenv
from db import db

# Load environment variables
load_dotenv()

# Get development user ID from environment variables
DEV_USER_ID = os.getenv("DEV_USER_ID", "dev-user-123")
DEV_USER_EMAIL = os.getenv("DEV_USER_EMAIL", "dev@example.com")

# Get MetaTrader credentials from environment variables
DEV_MT_LOGIN = os.getenv("DEV_MT_LOGIN", "81378629")
DEV_MT_PASSWORD = os.getenv("DEV_MT_PASSWORD", "Jayeoba@112")
DEV_MT_SERVER = os.getenv("DEV_MT_SERVER", "Exness-MT5Trial10")
DEV_MT_PLATFORM = os.getenv("DEV_MT_PLATFORM", "mt5")

# Use MT login as the account_id
account_id = str(DEV_MT_LOGIN)

# Create account mapping
account_data = {
    "account_id": account_id,
    "login": DEV_MT_LOGIN,
    "server": DEV_MT_SERVER,
    "platform": DEV_MT_PLATFORM,
    "status": "connected"
}

# Store in database
db.set_user_account(DEV_USER_ID, account_data)

print(f"""
✅ Development Account Created Successfully

User ID: {DEV_USER_ID}
Email: {DEV_USER_EMAIL}

MetaTrader Account:
Login: {DEV_MT_LOGIN}
Server: {DEV_MT_SERVER}
Platform: {DEV_MT_PLATFORM}

Your development account is now set up and ready for testing.
Make sure DEV_MODE=true is set in your .env file.
""") 