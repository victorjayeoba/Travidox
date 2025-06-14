# Travidox - Trade with Intelligence

![Travidox Logo](/public/logo.png)

## Overview

Travidox is a comprehensive trading intelligence platform that seamlessly connects MetaTrader accounts to a modern web interface. It enables traders to monitor and execute trades from anywhere while leveraging AI-powered tools to enhance trading performance and decision-making.

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

## 🔧 Installation & Setup

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
