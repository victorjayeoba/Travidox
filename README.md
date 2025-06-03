# Travidox - Trade with Intelligence

A comprehensive trading platform that connects MetaTrader accounts to a modern web interface, allowing users to monitor and execute trades from anywhere with intelligent tools to enhance trading performance.

## Features

- **Firebase Authentication**: Secure user authentication and management
- **MetaTrader Integration**: Connect to MT4/MT5 accounts through a VPS
- **Real-time Trading**: Execute trades directly from the web interface
- **Account Monitoring**: View account balance, equity, and other metrics
- **Position Management**: Open, modify, and close trading positions
- **Trade History**: View and analyze past trading activity
- **AI-Powered Trading Signals**: Receive intelligent trade recommendations
- **Trading Leaderboards**: Compare performance with other traders
- **AI Chat Assistant**: Get trading advice and platform help 24/7
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Architecture

Travidox uses a modern, scalable architecture:

- **Frontend**: React-based web application with a responsive UI
- **Backend**: FastAPI-based RESTful API service
- **Authentication**: Firebase Auth for secure user management
- **AI Integration**: Advanced algorithms for trading signals and chat assistance
- **Trading**: VPS-hosted MetaTrader terminals for reliable connectivity
- **Communication**: Secure API calls with token-based authentication

## Requirements

### Backend
- Python 3.9+
- FastAPI and dependencies
- Firebase Admin SDK
- Paramiko (for SSH)
- Machine Learning libraries for AI features
- VPS with MetaTrader installed

### Frontend
- Node.js 16+
- React 17+
- Firebase JS SDK
- Real-time data visualization libraries
- Modern web browser

## Installation

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/Travidox.git
cd Travidox/travidox_backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
cp env.example .env
# Edit .env with your actual credentials
```

5. Set up Firebase:
   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
   - Generate a private key file for your service account
   - Save it as `firebase-credentials.json` (or update the path in your .env file)

6. Set up VPS and MetaTrader:
   - Install MetaTrader on your VPS
   - Copy the scripts from `vps_scripts/` to your VPS
   - Configure the VPS connection details in your .env file

7. Run the backend:
```bash
python main.py
```
   The API will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../travidox_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a `.env.local` file with your Firebase web configuration
   - Set up Firebase Authentication in the Firebase Console

4. Start the development server:
```bash
npm start
```
   The frontend will be available at http://localhost:3000

## Usage

1. Create an account or log in using the web interface
2. Connect your MetaTrader account by providing your login credentials
3. View your account information, including balance and open positions
4. Place trades through the intuitive trading interface
5. Monitor and manage your positions in real-time

## Security

- All sensitive communications are encrypted
- Firebase Authentication provides secure user management
- MetaTrader credentials are never stored permanently
- API requests are authenticated using Firebase ID tokens
- VPS communications use secure SSH connections

## Development

### Testing

Backend:
```bash
cd travidox_backend
pytest
```

Frontend:
```bash
cd travidox_frontend
npm test
```

### Code Style

- Backend follows PEP 8 Python style guidelines
- Frontend follows ESLint with Airbnb configuration

## Deployment

### Backend Deployment

1. Set up a server with Python installed
2. Configure environment variables securely
3. Set up a production ASGI server (e.g., Uvicorn behind Nginx)
4. Use a process manager like Supervisor or systemd
5. Set up SSL for secure communications

### Frontend Deployment

1. Build the production version:
```bash
npm run build
```
2. Deploy to a static hosting service (Firebase Hosting, Vercel, Netlify, etc.)
3. Configure environment variables for production

## License

[Specify your license here]

## Contact

[+2348079458596]

## Acknowledgments

- MetaTrader for the trading platform
- Firebase for authentication services
- FastAPI for the efficient backend framework
- React for the responsive frontend framework 
