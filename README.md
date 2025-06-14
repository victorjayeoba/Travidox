# Travidox - Trade with Intelligence

![Travidox Logo](/public/logo.png)

## Overview

Travidox is a comprehensive trading intelligence platform that seamlessly connects MetaTrader accounts to a modern web interface. It enables traders to monitor and execute trades from anywhere while leveraging AI-powered tools to enhance trading performance and decision-making.

## 📋 Hackathon Setup Guide (Quick Start)

This guide helps hackathon judges and reviewers quickly set up and test Travidox on their local machine.

### Prerequisites
- Node.js 16+ ([Download](https://nodejs.org/))
- Python 3.9+ ([Download](https://www.python.org/downloads/))
- Git ([Download](https://git-scm.com/downloads))
- Firebase account (free tier is sufficient) ([Create Account](https://firebase.google.com/))

### Frontend Setup (5 minutes)

1. Clone the repository:
```bash
git clone https://github.com/victorjayeoba/Travidox.git
cd Travidox
```

2. Install frontend dependencies:
```bash
cd travidox_frontend
npm install
```

3. Create a `.env.local` file in the frontend directory:
```bash
# Sample content for .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```
   The frontend will be available at http://localhost:3000

### Backend Setup (Optional - 5 minutes)

1. Navigate to the backend directory:
```bash
cd ../travidox_backend
```

2. Create and activate a virtual environment:
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory:
```
# Sample content for .env
DEBUG=True
SECRET_KEY=your-secret-key
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json
```

5. Start the backend server:
```bash
python main.py
```
   The API will be available at http://localhost:8000

### Firebase Setup (10 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Set up Authentication with Email/Password provider
4. In Project Settings > General > Your Apps, create a new Web App
5. Copy the Firebase configuration to your `.env.local` file
6. For backend auth setup, go to Project Settings > Service Accounts > Generate new private key
7. Save the JSON file as `firebase-credentials.json` in the backend directory

### Demo Mode

For hackathon evaluation, the application can run in demo mode without backend connectivity. Simply access the frontend at http://localhost:3000 and use these credentials:

- Email: demo@travidox.com
- Password: demo1234

## 🔍 Troubleshooting

### Common Issues

1. **Node.js Version Error**: If you encounter errors related to Node.js versions:
```bash
nvm install 16
nvm use 16
# Then reinstall dependencies
```

2. **Python Package Errors**: If you encounter package compatibility issues:
```bash
pip install -r requirements.txt --upgrade
```

3. **Firebase Configuration Errors**:
   - Ensure your Firebase project has Authentication enabled
   - Verify that your `.env.local` contains the correct Firebase configuration values
   - Check that the Email/Password authentication method is enabled in Firebase console

4. **Port Already in Use**:
```bash
# Frontend (change port to 3001)
npm run dev -- -p 3001

# Backend (change port to 8001)
# Edit main.py to change the port number
```

5. **Build Fails**: Clear cache and node modules:
```bash
rm -rf .next node_modules
npm install
```

For additional help, contact us at hellotravidox@gmail.com or create an issue on GitHub.

## 🚀 Key Features

### Trading & Analysis
- **MetaTrader Integration**: Connect to MT4/MT5 accounts through a secure connection
- **Real-time Trading**: Execute trades directly from an intuitive web interface
- **Position Management**: Open, modify, and close positions with advanced risk parameters
- **Market Analysis**: Access real-time charts, indicators, and market data

### AI & Intelligence Tools
- **AI-Powered Trading Signals**: Receive intelligent trade recommendations with success probability
- **Trading Chatbot Assistant**: Get 24/7 trading advice and platform assistance
- **Market Sentiment Analysis**: AI-processed market sentiment data from multiple sources

### User Experience
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Account Monitoring**: View account balance, equity, and performance metrics
- **Trading History & Analysis**: Review and analyze past trading activity with visual insights
- **Trading Leaderboards**: Compare performance with other traders and follow top performers

### Security
- **Firebase Authentication**: Secure user authentication with multi-factor options
- **End-to-End Encryption**: All sensitive data and communications are encrypted
- **Secure API Connections**: Protected MetaTrader access via encrypted connections

## 📊 System Architecture

Travidox implements a modern, scalable architecture:

```
┌─────────────────┐     ┌────────────────┐     ┌───────────────────┐
│  React Frontend │────▶│ FastAPI Backend │────▶│ MetaTrader API   │
└─────────────────┘     └────────────────┘     └───────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐     ┌────────────────┐     ┌───────────────────┐
│  Firebase Auth  │     │  AI Services   │     │ Market Data Feeds │
└─────────────────┘     └────────────────┘     └───────────────────┘
```

### Frontend (Next.js & React)
- Modern React application with Next.js framework
- Tailwind CSS for responsive design
- Real-time data visualization with Recharts
- Firebase integration for authentication and real-time features

### Backend (FastAPI)
- High-performance Python FastAPI server
- Secure API endpoints with JWT authentication
- Integration with MetaTrader via direct API access
- AI models for trading signals and market analysis

### Infrastructure
- Firebase for authentication and database
- Modern cloud deployment with scalability support

## 💻 Technical Requirements

### Backend Requirements
- Python 3.9+
- FastAPI 0.104.1+
- Firebase Admin SDK 6.2.0+
- Additional dependencies in `requirements.txt`

### Frontend Requirements
- Node.js 16+
- Next.js 15.2.4+
- React 19+
- Firebase JS SDK 11.9.0+
- See `package.json` for complete dependency list

### Infrastructure Requirements
- Firebase project with Authentication enabled
- Modern web browser for client access

## 🔧 Full Installation & Setup

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/victorjayeoba/Travidox.git
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
# Edit .env with your credentials and configuration
```

5. Setup Firebase:
   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
   - Generate a private key for your service account
   - Save it as `firebase-credentials.json` in the backend directory

6. Start the backend server:
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

3. Configure environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your Firebase and API configuration
```

4. Start the development server:
```bash
npm run dev
```
   The frontend will be available at http://localhost:3000

5. For production build:
```bash
npm run build
npm start
```

## 🔐 Security Measures

Travidox implements comprehensive security measures:

- **Authentication**: Firebase Authentication with email/password and optional MFA
- **Authorization**: Role-based access control for all API endpoints
- **Data Encryption**: All sensitive data encrypted at rest and in transit
- **API Security**: JWT token authentication for all API requests
- **Credential Management**: MetaTrader credentials never stored permanently
- **Audit Logging**: Comprehensive logging of all security-relevant events

## 🧪 Testing

### Backend Testing
```bash
cd travidox_backend
pytest
```

### Frontend Testing
```bash
cd travidox_frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Provision a server with Python 3.9+
2. Set up environment variables securely
3. Install production ASGI server (e.g., Uvicorn with Gunicorn)
4. Configure process management with Supervisor or systemd
5. Set up reverse proxy (Nginx) with SSL/TLS

### Frontend Deployment
1. Build the production version:
```bash
npm run build
```
2. Deploy to a static hosting service:
   - Vercel (recommended for Next.js)
   - Netlify
   - Firebase Hosting
   - AWS Amplify

## 📝 Documentation

Additional documentation:
- [Backend API Documentation](travidox_backend/README.md)
- [MetaTrader Integration Guide](travidox_backend/MT_INTEGRATION.md)
- [Development Mode Setup](travidox_backend/DEV_MODE_SETUP.md)
- [AWS Deployment Guide](travidox_frontend/README-AWS-SETUP.md)
- [Password Reset Implementation](travidox_frontend/FORGOT_PASSWORD_README.md)
- [AI Assistant Integration](travidox_frontend/AI_ASSISTANT_PAGE_README.md)

## 📜 License

[MIT License](LICENSE) - Copyright (c) 2025 Travidox

## 📞 Contact & Support

- Website: [https://travidox.vercel.app](https://travidox.vercel.app)
- Email: hellotravidox@gmail.com
- Phone: +2348089032359

## 🙏 Acknowledgments

- MetaTrader for the robust trading platform
- Firebase for authentication and database services
- FastAPI for the efficient backend framework
- Next.js and React for the responsive frontend framework
- The open-source community for various libraries and tools
