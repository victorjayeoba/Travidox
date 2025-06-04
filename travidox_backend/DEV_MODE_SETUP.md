# Development Mode Setup Guide

This guide explains how to set up and run the Travidox backend in development mode, which bypasses Firebase authentication while still using your local MetaTrader installation.

## Step 1: Create your .env file

Copy the `env.example` file to create a new `.env` file:

```bash
cp env.example .env
```

## Step 2: Add development mode settings

Add the following lines to your `.env` file:

```
# Development mode settings
DEV_MODE=true
DEV_USER_ID=dev-user-123
DEV_USER_EMAIL=dev@example.com

# MetaTrader development credentials (for local connection)
DEV_MT_LOGIN=your_metatrader_login
DEV_MT_PASSWORD=your_metatrader_password
DEV_MT_SERVER=your_metatrader_server
DEV_MT_PLATFORM=mt5  # or mt4
```

Replace the MetaTrader credential values with your actual login details.

## Step 3: Set up a development account

Run the development account setup script:

```bash
python setup_dev_account.py
```

This will:
- Create a dummy MetaTrader account ID
- Link it to your development user ID
- Display the account information

## Step 4: Start the server

Start the FastAPI server with:

```bash
python main.py
```

You should see the following messages:
```
⚠️ DEVELOPMENT MODE: Bypassing authentication ⚠️
⚠️ DEVELOPMENT MODE: Using local MetaTrader connection ⚠️
```

## Step 5: Implement local MetaTrader connection

The current implementation has placeholder functions for connecting to your local MetaTrader. You need to replace these functions with actual MetaTrader API calls:

1. `connect_local_mt` - Connect to your local MT terminal
2. `get_local_account_info` - Get account information from local MT
3. `get_local_positions` - Get positions from local MT
4. `place_local_order` - Place an order using local MT
5. `close_local_position` - Close a position using local MT

You can use MetaTrader's Python API or another method to implement these functions.

## Step 6: Test the API

Run the test client to verify everything works:

```bash
python test_dev_client.py
```

## How it works

When `DEV_MODE=true` is set in your `.env` file:

1. Authentication:
   - The `verify_firebase_token` dependency will bypass token verification
   - All API requests will use the `DEV_USER_ID` as the authenticated user
   - You can make API calls without providing an authentication token

2. MetaTrader Connection:
   - Instead of connecting to the VPS, it uses your local MetaTrader installation
   - Your real MetaTrader account credentials are used
   - All trading operations use your actual trading account

This is useful for:
- Local development without Firebase setup
- Testing with your real MetaTrader account
- Frontend development with real trading data
- Testing the full trading flow locally

## Security Warning

**NEVER** enable development mode in production. This bypasses all authentication and would allow anyone to access any account.

Also, be careful with your MetaTrader credentials. Never commit them to version control. 