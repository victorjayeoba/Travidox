# Travidox Enhanced Scraper API

A robust web scraping API for Nigerian financial data with advanced anti-bot protection and Cloudflare bypass capabilities.

## 🚀 Features

- **Advanced Anti-Bot Protection**: Rotating user agents, session management, and Cloudflare bypass
- **Intelligent Retry Logic**: Exponential backoff with jitter for failed requests
- **Rate Limiting Protection**: Built-in rate limiting to prevent API abuse
- **Fallback Data**: Provides cached data when live APIs are unavailable
- **Session Persistence**: Maintains sessions across requests for better success rates
- **Comprehensive Error Handling**: Detailed error responses with actionable suggestions

## 🛠️ Installation

```bash
cd Scarape_API
npm install
npm start
```

## 📡 API Endpoints

### Core Endpoints

#### 1. Nigeria Stocks Data
```
GET http://localhost:8085/nigeria-stocks
```
Returns current Nigerian stock market data with fallback support.

**Response Format:**
```json
{
  "success": true,
  "source": "live",
  "count": 150,
  "data": [...],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 2. Chart Data (GET)
```
GET http://localhost:8085/chart-data/{assetId}?interval=PT15M&pointscount=60
```

#### 3. Chart Data (POST)
```
POST http://localhost:8085/chart-data
Content-Type: application/json

{
  "assetId": "101672",
  "interval": "PT15M",
  "pointscount": "60"
}
```

#### 4. Nigeria News
```
GET http://localhost:8085/nigeria-news
```

### Monitoring & Debug Endpoints

#### Health Check
```
GET http://localhost:8085/health
```

#### Server Status
```
GET http://localhost:8085/status
```

#### API Testing
```
GET http://localhost:8085/test-api/stocks
GET http://localhost:8085/test-api/chart
```

## 🔧 Handling 403 Forbidden Errors

The API includes comprehensive measures to handle and prevent 403 errors:

### Automatic Handling
- ✅ **Rotating User Agents**: 8 different browser user agents
- ✅ **Session Management**: Persistent sessions with cookie jars
- ✅ **Progressive Delays**: Exponential backoff with randomization
- ✅ **Cloudflare Detection**: Automatic detection and retry logic
- ✅ **Alternative URLs**: Fallback to different API endpoints
- ✅ **Rate Limiting**: Built-in protection against rapid requests

### Manual Troubleshooting

If you encounter persistent 403 errors:

1. **Check API Status**:
   ```bash
   curl http://localhost:8085/health
   ```

2. **Test Specific Endpoints**:
   ```bash
   curl http://localhost:8085/test-api/stocks
   curl http://localhost:8085/test-api/chart
   ```

3. **Monitor Server Status**:
   ```bash
   curl http://localhost:8085/status
   ```

4. **Restart with Debug Mode**:
   ```bash
   npm run dev
   ```

### Error Response Format

When 403 errors occur, the API provides detailed information:

```json
{
  "success": false,
  "error": {
    "code": 403,
    "message": "Access denied - possible rate limiting",
    "details": "Primary API unavailable, using cached data"
  },
  "fallback": true,
  "data": [...],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔄 Retry Logic

The API implements sophisticated retry logic:

1. **Initial Request**: Standard request with session management
2. **403 Detection**: Automatic session rotation and user agent change
3. **Progressive Delays**: 2s → 3s → 4.5s → 6.8s → 10.2s → 15.3s → 22.9s
4. **Alternative URLs**: Try backup endpoints if primary fails
5. **Fallback Data**: Return cached data if all attempts fail

## 📊 Performance Monitoring

### Memory Management
- Automatic session cleanup (30-minute TTL)
- Rate limit window cleanup
- Memory usage monitoring in development mode

### Concurrency Control
- Maximum 10 concurrent requests
- Request queuing for overflow
- Automatic cleanup on connection close

## 🚨 Error Types & Solutions

| Error Code | Description | Automatic Action | Manual Solution |
|------------|-------------|------------------|-----------------|
| 403 | Forbidden/Cloudflare | Rotate session, new user agent | Wait 5-10 minutes |
| 429 | Rate Limited | Increase backoff delay | Reduce request frequency |
| 503 | Service Unavailable | Shorter retry delay | Check API status |
| 502 | Bad Gateway | Quick retry | Server may be down |
| Timeout | Request timeout | Progressive timeout increase | Check network |

## 🔒 Session Management

Sessions are automatically managed with:
- **TTL**: 30 minutes
- **Rotation**: On 403 errors
- **Cleanup**: Every minute
- **Tracking**: Request count and timing

## 🌐 Environment Variables

```bash
NODE_ENV=development  # Enable debug logging
PORT=8085            # Server port (optional)
```

## 📈 Rate Limiting

- **Window**: 60 seconds
- **Max Requests**: 10 per window per session
- **Automatic**: Rate limit checking before requests
- **Cleanup**: Old windows automatically removed

## 🆘 Emergency Fallback

If all APIs fail, the system provides:
- Cached Nigerian stock data
- Generic news articles
- Status information
- Detailed error explanations

## 🔍 Debugging

Enable debug mode for detailed logging:
```bash
npm run debug
```

Debug information includes:
- Request attempts and delays
- Session creation and rotation
- Cloudflare challenge detection
- Memory usage statistics
- Rate limiting decisions

## 📝 Logs

The API provides emoji-rich logging:
- 🔄 Request start
- ✅ Success
- ❌ Failure
- 🚫 403 Forbidden
- ⏰ Rate limited
- 🔧 Service issues
- ☁️ Cloudflare challenges
- 🧹 Cleanup operations
- 📊 Memory stats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Test with various scenarios
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Need Help?** Check the `/status` endpoint for real-time diagnostics or enable debug mode for detailed logging. 