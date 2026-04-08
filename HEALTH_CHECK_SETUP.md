# Health Check Endpoint - Keep Server Awake

## Overview
The `/api/ping` endpoint is a lightweight health-check that prevents your Render free-tier backend from sleeping due to inactivity.

## Endpoint Details

### GET /api/ping

**Response:**
```json
{
  "status": "ok",
  "message": "Server is awake",
  "timestamp": "2026-04-02T06:30:00.000Z"
}
```

**Status Code:** 200 OK

**Features:**
- ⚡ Ultra-fast response (no database calls)
- 🔄 Returns current server timestamp
- 💪 Keeps server active on free hosting tiers
- 🎯 Simple status monitoring

## Testing the Endpoint

### Using cURL
```bash
curl https://gnn-ecommerce-1.onrender.com/api/ping
```

### Using Browser
Simply visit:
```
https://gnn-ecommerce-1.onrender.com/api/ping
```

### Using JavaScript (fetch)
```javascript
fetch('https://gnn-ecommerce-1.onrender.com/api/ping')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Using Axios
```javascript
import axios from 'axios';

axios.get('https://gnn-ecommerce-1.onrender.com/api/ping')
  .then(response => console.log(response.data));
```

### Using Postman
1. Method: GET
2. URL: `https://gnn-ecommerce-1.onrender.com/api/ping`
3. Click Send

## Setting Up Cron Job (Keep Server Awake)

### Why Use Cron Jobs?
Render's free tier spins down services after 15 minutes of inactivity. A cron job pings your server every 10-14 minutes to keep it active.

### Option 1: cron-job.org (Recommended)

1. **Go to:** https://cron-job.org/
2. **Sign up** for a free account
3. **Create New Cron Job:**
   - **Title:** GNN Ecommerce Keep Alive
   - **URL:** `https://gnn-ecommerce-1.onrender.com/api/ping`
   - **Schedule:** Every 10 minutes
   - **Request Method:** GET
   - **Execution:** Enabled

**Cron Expression:** `*/10 * * * *` (every 10 minutes)

**Direct URL for cron-job.org:**
```
https://cron-job.org/en/members/jobs/add/
```

### Option 2: UptimeRobot

1. **Go to:** https://uptimerobot.com/
2. **Sign up** for free
3. **Add New Monitor:**
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** GNN Ecommerce Backend
   - **URL:** `https://gnn-ecommerce-1.onrender.com/api/ping`
   - **Monitoring Interval:** 5 minutes (free tier)

### Option 3: EasyCron

1. **Go to:** https://www.easycron.com/
2. **Sign up** for free
3. **Create Cron Job:**
   - **URL:** `https://gnn-ecommerce-1.onrender.com/api/ping`
   - **Cron Expression:** `*/10 * * * *`

### Option 4: GitHub Actions (Free)

Create `.github/workflows/keep-alive.yml`:

```yaml
name: Keep Backend Alive

on:
  schedule:
    - cron: '*/10 * * * *'  # Every 10 minutes
  workflow_dispatch:  # Manual trigger

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Backend
        run: |
          curl -f https://gnn-ecommerce-1.onrender.com/api/ping || exit 1
      - name: Log Response
        run: echo "Backend is alive!"
```

## Cron Schedule Examples

| Schedule | Cron Expression | Description |
|----------|----------------|-------------|
| Every 5 minutes | `*/5 * * * *` | Most aggressive (may hit rate limits) |
| Every 10 minutes | `*/10 * * * *` | Recommended for free tier |
| Every 14 minutes | `*/14 * * * *` | Safe margin before 15-min timeout |
| Every 30 minutes | `*/30 * * * *` | Less frequent (server may sleep) |

## Best Practices

### 1. Optimal Ping Frequency
- **Recommended:** Every 10-12 minutes
- **Why:** Render free tier sleeps after 15 minutes
- **Avoid:** More frequent than every 5 minutes (unnecessary load)

### 2. Multiple Monitoring Services
Use 2-3 services for redundancy:
- Primary: cron-job.org
- Backup: UptimeRobot
- Tertiary: GitHub Actions

### 3. Monitor Response Time
Set up alerts if response time exceeds 5 seconds (indicates server issues)

### 4. Check Logs
Periodically review Render logs to ensure pings are working

## Troubleshooting

### Server Still Sleeping
- Verify cron job is running (check service dashboard)
- Ensure URL is correct (include https://)
- Check if cron service is active
- Verify Render service is not suspended

### Slow Response
- Check Render service status
- Verify MongoDB connection is stable
- Review server logs for errors

### 429 Too Many Requests
- Reduce ping frequency
- Use only one monitoring service
- Check rate limits on your hosting

## Cost Considerations

### Free Tier Limits
- **Render Free:** 750 hours/month (enough for 24/7 with keep-alive)
- **cron-job.org Free:** Unlimited jobs, 1-minute minimum interval
- **UptimeRobot Free:** 50 monitors, 5-minute intervals
- **GitHub Actions Free:** 2,000 minutes/month

### Paid Alternatives
If you need guaranteed uptime:
- **Render Starter:** $7/month (no sleep)
- **Heroku Hobby:** $7/month (no sleep)
- **Railway:** $5/month (no sleep)

## Implementation Code

### Full server.js Example
```javascript
const express = require("express");
const app = express();

// Health check endpoint
app.get("/api/ping", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is awake",
        timestamp: new Date().toISOString()
    });
});

// Other routes...
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### With Logging (Optional)
```javascript
app.get("/api/ping", (req, res) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Health check ping received`);
    
    res.status(200).json({
        status: "ok",
        message: "Server is awake",
        timestamp: timestamp
    });
});
```

### With Uptime Tracking (Advanced)
```javascript
const startTime = Date.now();

app.get("/api/ping", (req, res) => {
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    
    res.status(200).json({
        status: "ok",
        message: "Server is awake",
        timestamp: new Date().toISOString(),
        uptime: `${uptime} seconds`
    });
});
```

## Testing Your Setup

### 1. Manual Test
```bash
curl https://gnn-ecommerce-1.onrender.com/api/ping
```

Expected output:
```json
{"status":"ok","message":"Server is awake","timestamp":"2026-04-02T06:30:00.000Z"}
```

### 2. Verify Cron Job
- Wait 10-15 minutes
- Check cron service dashboard for successful executions
- Check Render logs for incoming requests

### 3. Monitor Uptime
- Use UptimeRobot to track uptime percentage
- Aim for 99%+ uptime

## Security Notes

- ✅ No authentication required (public endpoint)
- ✅ No sensitive data exposed
- ✅ No database queries (fast & safe)
- ✅ Rate limiting recommended (optional)

## Additional Resources

- Render Free Tier Docs: https://render.com/docs/free
- Cron Expression Generator: https://crontab.guru/
- HTTP Status Codes: https://httpstatuses.com/

## Summary

Your backend now has a `/api/ping` endpoint that:
1. Responds instantly without database calls
2. Returns server status and timestamp
3. Can be pinged by cron jobs to prevent sleep
4. Helps maintain 24/7 availability on free tier

**Next Steps:**
1. Deploy backend to Render
2. Test endpoint: `https://gnn-ecommerce-1.onrender.com/api/ping`
3. Set up cron job on cron-job.org
4. Monitor uptime with UptimeRobot
