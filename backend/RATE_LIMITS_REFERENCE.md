# Rate Limits Quick Reference

## API Rate Limits Overview

| Endpoint | Limit | Window | Purpose |
|----------|-------|--------|---------|
| **All APIs** (Global) | 100 requests | 15 minutes | General protection |
| **Authentication** | 5 requests | 15 minutes | Prevent brute force |
| **Payment** | 10 requests | 1 hour | Prevent fraud |
| **Orders** | 20 requests | 1 hour | Prevent manipulation |
| **Upload** | 30 uploads | 1 hour | Prevent storage abuse |
| **Public Browsing** | 200 requests | 15 minutes | Allow generous browsing |

## Endpoint Details

### 🔐 Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/register-admin
```
**Limit**: 5 requests per 15 minutes
**Error**: "Too many login attempts from this IP, please try again after 15 minutes"

### 💳 Payment Endpoints
```
POST /api/payment/create-order
POST /api/payment/verify-payment
```
**Limit**: 10 requests per hour
**Error**: "Too many payment requests from this IP, please try again later"

### 📦 Order Endpoints
```
GET /api/orders (admin)
PUT /api/orders/:id/status (admin)
```
**Limit**: 20 requests per hour
**Error**: "Too many order requests from this IP, please try again later"

### 📤 Upload Endpoints
```
POST /api/upload
```
**Limit**: 30 uploads per hour
**Error**: "Too many upload requests from this IP, please try again later"

### 🛍️ Public Product Endpoints
```
GET /api/products/gemstones
GET /api/products/gemstones/:id
GET /api/products/trees
GET /api/products/trees/:id
GET /api/products/bracelets
GET /api/products/bracelets/:id
GET /api/products/search
```
**Limit**: 200 requests per 15 minutes
**Special**: Successful requests don't count toward limit
**Error**: "Too many requests, please slow down"

## Response Headers

Every API response includes rate limit information:

```http
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1234567890
```

## Testing Rate Limits

### Using curl
```bash
# Test authentication rate limit
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"test"}' \
    -i
done
```

### Using JavaScript/Axios
```javascript
// Check rate limit headers
const response = await axios.get('/api/products/gemstones');
console.log('Limit:', response.headers['ratelimit-limit']);
console.log('Remaining:', response.headers['ratelimit-remaining']);
console.log('Reset:', new Date(response.headers['ratelimit-reset'] * 1000));
```

## Adjusting Limits

Edit `backend/middleware/rateLimitMiddleware.js`:

```javascript
// Example: Increase payment limit
const paymentLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Changed from 10 to 20
    message: {
        error: 'Too many payment requests from this IP, please try again later'
    },
});
```

## Bypassing Rate Limits (Development Only)

To disable rate limiting during development, comment out in `server.js`:

```javascript
// app.use(generalLimiter); // Commented out for development
```

**⚠️ WARNING**: Never disable rate limiting in production!

## Production Recommendations

1. **Monitor rate limit hits**: Set up alerts for frequent 429 errors
2. **Adjust based on traffic**: Increase limits if legitimate users are blocked
3. **Use Redis**: For distributed systems, store counters in Redis
4. **IP Whitelisting**: Allow trusted IPs (admin, monitoring tools) to bypass limits
5. **User-based limits**: Different limits for authenticated vs anonymous users

## Troubleshooting

### Users getting blocked too quickly
- Increase the `max` value
- Increase the `windowMs` duration
- Enable `skipSuccessfulRequests` for read-only endpoints

### Rate limiting not working
- Check middleware order in server.js
- Verify middleware is imported in routes
- Test with different IPs or clear browser cache

### Need different limits per user type
Implement dynamic rate limiting:
```javascript
const dynamicLimiter = rateLimit({
    max: (req) => req.user?.isAdmin ? 1000 : 100,
    // ...
});
```
