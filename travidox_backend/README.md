# Travidox Backend

A FastAPI backend that verifies Firebase Authentication tokens and connects to MetaTrader accounts via a VPS.

## Architecture

This backend uses a VPS (Virtual Private Server) to run MetaTrader terminals. The backend communicates with the VPS via SSH to:
1. Connect to MetaTrader accounts
2. Get account information
3. Place trades
4. Manage positions

The frontend handles user authentication via Firebase Auth, and the backend verifies the Firebase ID tokens.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up Firebase:
   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
   - Generate a private key file for your service account:
     - Go to Project Settings > Service Accounts
     - Click "Generate new private key"
     - Save the JSON file as `firebase-credentials.json` in the project root

3. Set up a VPS with MetaTrader:
   - Install MetaTrader 4 or 5 on the VPS
   - Set up Python on the VPS
   - Copy the scripts from the `vps_scripts` directory to the VPS (e.g., to `~/mt_scripts`)
   - Make the scripts executable: `chmod +x ~/mt_scripts/*.py`

4. Create a `.env` file:
```bash
cp env.example .env
```

5. Edit the `.env` file with your credentials:
```
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json

VPS_HOST=your_vps_hostname_or_ip
VPS_USERNAME=your_vps_username
VPS_PASSWORD=your_vps_password
# VPS_KEY_PATH=path/to/ssh/private/key  # Alternative to password
VPS_MT_SCRIPTS_DIR=~/mt_scripts
```

## Running the Server

Start the development server:

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

## API Documentation

API documentation is automatically generated and available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

- `GET /`: Health check endpoint

- `POST /connect-account`: Connect a MetaTrader account
  - Requires Firebase authentication token in the `Authorization: Bearer <token>` header
  - Request body:
    ```json
    {
      "login": "your_mt_login",
      "password": "your_mt_password",
      "server_name": "your_mt_server",
      "platform": "mt5"  // Optional, defaults to "mt5"
    }
    ```

- `GET /account-info`: Get the connected MetaTrader account information
  - Requires Firebase authentication token in the `Authorization: Bearer <token>` header
  - Returns account details including balance, equity, etc.

- `POST /place-order`: Place a market order
  - Requires Firebase authentication token in the `Authorization: Bearer <token>` header
  - Request body:
    ```json
    {
      "symbol": "EURUSD",
      "order_type": "BUY",  // or "SELL"
      "volume": 0.1,
      "stop_loss": 1.0800,  // Optional
      "take_profit": 1.1200  // Optional
    }
    ```

- `GET /positions`: Get open positions
  - Requires Firebase authentication token in the `Authorization: Bearer <token>` header
  - Returns a list of open positions

- `POST /close-position/{position_id}`: Close a specific position
  - Requires Firebase authentication token in the `Authorization: Bearer <token>` header
  - Path parameter: `position_id` - The ID of the position to close 