# Travidox Backend

Backend API for the Travidox trading platform, connecting MetaTrader accounts to a web interface.

## Installation

### Prerequisites

- Python 3.9+
- MetaTrader 5 installed (for development mode)
- Firebase project (for production)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/travidox.git
   cd travidox/travidox_backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create environment file:
   ```bash
   cp env.example .env
   ```

5. Edit the `.env` file with your credentials

## Development Mode Setup

For local development without Firebase authentication:

1. Ensure MetaTrader 5 is installed and running on your machine

2. Add the following to your `.env` file:
   ```
   DEV_MODE=true
   DEV_USER_ID=dev-user-123
   DEV_USER_EMAIL=dev@example.com
   
   # Your Exness MetaTrader credentials
   DEV_MT_LOGIN=81378629
   DEV_MT_PASSWORD=Jayeoba@112
   DEV_MT_SERVER=Exness-MT5Trial10
   DEV_MT_PLATFORM=mt5
   ```

3. Run the development account setup script:
   ```bash
   python setup_dev_account.py
   ```

4. Install the MetaTrader5 Python package:
   ```bash
   pip install MetaTrader5
   ```

5. Update the local MetaTrader connection functions in `main.py` with the examples provided in `MT_INTEGRATION.md`

6. Start the server:
   ```bash
   python main.py
   ```

7. Test the API:
   ```bash
   python test_dev_client.py
   ```

## Production Setup

For production deployment:

1. Set up a VPS with MetaTrader instances

2. Create a Firebase project and generate credentials

3. Configure your `.env` file with VPS and Firebase credentials:
   ```
   DEV_MODE=false
   FIREBASE_CREDENTIALS_PATH=firebase-credentials.json
   VPS_HOST=your_vps_hostname_or_ip
   VPS_USERNAME=your_vps_username
   VPS_PASSWORD=your_vps_password
   VPS_MT_SCRIPTS_DIR=~/mt_scripts
   ```

4. Deploy the VPS scripts to your VPS

5. Start the server:
   ```bash
   python main.py
   ```

## API Endpoints

### Authentication

All endpoints require a Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

In development mode, this header is not required.

### Endpoints

- `GET /` - API root, returns a welcome message
- `POST /connect-account` - Connect a MetaTrader account
- `GET /account-info` - Get account information
- `POST /place-order` - Place a market order
- `GET /positions` - Get open positions
- `POST /close-position/{position_id}` - Close a specific position

## Development

See `DEV_MODE_SETUP.md` for detailed instructions on development mode.

## MetaTrader Integration

See `MT_INTEGRATION.md` for detailed instructions on MetaTrader integration. 