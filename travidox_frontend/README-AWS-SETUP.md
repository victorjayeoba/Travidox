# AWS EC2 Backend Connection Setup

This guide explains how to connect the Travidox frontend to the backend running on an AWS EC2 Windows instance.

## Prerequisites

1. AWS EC2 Windows instance running with MetaTrader and the Travidox backend installed
2. Public IP address of your EC2 instance
3. Security group configured to allow inbound traffic on port 8000

## Configuration Steps

### 1. Create a `.env.local` file

Create a `.env.local` file in the root of your `travidox_frontend` directory with the following content:

```
# API Configuration
NEXT_PUBLIC_API_URL=http://your-ec2-ip-address:8000

# Firebase Configuration (if using Firebase Auth)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

Replace `your-ec2-ip-address` with the actual public IP address of your AWS EC2 instance.

### 2. Update API Configuration

The API connection is automatically configured using the `NEXT_PUBLIC_API_URL` environment variable. If you need to manually set it, you can edit the `lib/config.ts` file:

```typescript
// Backend API configuration
export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://your-ec2-ip-address:8000',
  // other configuration...
};
```

### 3. Configure CORS on the Backend

Ensure that your backend's CORS settings allow requests from your frontend's origin. In the EC2 instance, check that the FastAPI CORS middleware is properly configured in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development. In production, use specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

For production, update the `allow_origins` to include only your frontend's domain.

### 4. Security Group Configuration

Make sure your AWS EC2 security group allows inbound traffic on port 8000 (or whatever port your backend uses):

1. Open the AWS EC2 console
2. Select your instance and go to the "Security" tab
3. Click on the security group
4. Add an inbound rule:
   - Type: Custom TCP
   - Port range: 8000
   - Source: For development, you can use your IP address or 0.0.0.0/0 (open to all)
   - Description: Travidox Backend API

### 5. Start the Backend on EC2

Make sure your backend is running on the EC2 instance:

1. Connect to your EC2 instance using RDP
2. Navigate to the `travidox_backend` directory
3. Start the FastAPI server:
   ```
   python main.py
   ```

### 6. Test the Connection

Start your frontend application:

```
npm run dev
```

The frontend should now be able to connect to your backend running on the EC2 instance.

## Troubleshooting

If you encounter issues connecting to the backend:

1. **Check if the backend is running**: Connect to the EC2 instance and verify the FastAPI server is running
2. **Test the API directly**: Use a tool like Postman to test if the API is accessible at `http://your-ec2-ip-address:8000`
3. **Check security groups**: Ensure the EC2 security group allows inbound traffic on port 8000
4. **Check CORS**: Look for CORS errors in the browser console
5. **Network issues**: Make sure there are no network restrictions preventing access to the EC2 instance

If you still encounter issues, check the logs of both the frontend and backend applications for more detailed error messages. 