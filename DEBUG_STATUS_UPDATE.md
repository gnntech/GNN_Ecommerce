# Debug: Product Status Update Not Working

## Issue
When clicking "Mark Out of Stock" button in admin panel, the database is not updating.

## Changes Made

### 1. Removed Product Count Display ✅
Removed the "18 bracelets found" text from all product grids:
- BraceletGrid.tsx
- TreeGrid.tsx
- GemstoneGrid.tsx

### 2. Added Better Error Handling ✅
Added console logging and error alerts to ProductDashboard:
- `handleStatusUpdate` - logs request and response
- `handleBulkStatusUpdate` - logs bulk operations
- Shows alert with error message if update fails

## How to Debug

### Step 1: Check if You're Logged In as Admin
1. Open browser console (F12)
2. Go to Application tab → Session Storage
3. Look for `adminUser` key
4. Verify it has a `token` field

**If no token found:**
- You need to login as admin first
- Go to `/admin` and login
- Then try updating products

### Step 2: Test the Status Update
1. Open admin panel: `http://localhost:8081/admin/products`
2. Open browser console (F12)
3. Click "Mark Out of Stock" on any product
4. Check console for logs:
   ```
   Updating product status: { productId: "...", status: "out-of-stock" }
   Status update response: { message: "...", product: {...} }
   ```

### Step 3: Check for Errors
If you see an error in console:

**401 Unauthorized:**
- You're not logged in as admin
- Login at `/admin` first

**404 Not Found:**
- Product ID is invalid
- Check the productId in console log

**400 Bad Request:**
- Invalid status value
- Check the status being sent

**500 Server Error:**
- Backend issue
- Check backend logs in terminal

### Step 4: Check Backend Logs
In the terminal where backend is running, look for:
```
Error: ...
```

If you see errors, they will tell you what's wrong.

### Step 5: Test API Directly
Test the endpoint with curl (replace ID with actual product ID):

```powershell
# Get a product ID first
curl -UseBasicParsing http://localhost:5000/api/products | ConvertFrom-Json | Select-Object -ExpandProperty products | Select-Object -First 1 _id,name,status

# Try to update status (will fail without auth token)
$headers = @{
    "Content-Type" = "application/json"
}
$body = @{
    status = "out-of-stock"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/products/YOUR_PRODUCT_ID/status" -Method PATCH -Headers $headers -Body $body
```

## Common Issues & Solutions

### Issue 1: Not Logged In
**Symptom:** 401 Unauthorized error  
**Solution:** Login as admin at `/admin`

### Issue 2: Wrong API URL
**Symptom:** Network error or timeout  
**Solution:** Check `src/lib/api.ts` - should use `http://localhost:5000/api` for local development

### Issue 3: CORS Error
**Symptom:** CORS policy error in console  
**Solution:** Check backend CORS configuration in `server.js`

### Issue 4: Product ID Not Found
**Symptom:** 404 error  
**Solution:** Verify product exists in database

### Issue 5: Database Connection Lost
**Symptom:** 500 error, "MongoDB not connected"  
**Solution:** Restart backend server

## Testing Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 8081
- [ ] MongoDB connected (check backend logs)
- [ ] Logged in as admin (check sessionStorage)
- [ ] Browser console open to see logs
- [ ] Click "Mark Out of Stock" button
- [ ] Check console for request/response logs
- [ ] Check if error alert appears
- [ ] Refresh product list to see if status changed
- [ ] Check MongoDB directly to verify update

## Expected Behavior

### When Update Works:
1. Click "Mark Out of Stock"
2. Console shows: `Updating product status: {...}`
3. Console shows: `Status update response: {...}`
4. Product list refreshes automatically
5. Product now shows "Out of Stock" badge
6. No error alerts

### When Update Fails:
1. Click "Mark Out of Stock"
2. Console shows: `Updating product status: {...}`
3. Console shows: `Failed to update product status: ...`
4. Alert appears with error message
5. Product status unchanged

## Next Steps

1. **Open browser console** (F12)
2. **Go to admin panel** (`/admin/products`)
3. **Click "Mark Out of Stock"** on any product
4. **Check console logs** - copy and share any errors you see
5. **Check backend terminal** - copy and share any errors

## Quick Fix: Force Update via MongoDB

If the API isn't working, you can update directly in MongoDB:

```javascript
// In MongoDB Compass or shell
db.products.updateOne(
  { _id: ObjectId("YOUR_PRODUCT_ID") },
  { $set: { status: "out-of-stock" } }
)
```

Then refresh the frontend to see the change.

---

**Status**: Debugging in progress  
**Date**: May 20, 2026  
**Files Modified**: 
- ProductDashboard.tsx (added error logging)
- BraceletGrid.tsx (removed count display)
- TreeGrid.tsx (removed count display)
- GemstoneGrid.tsx (removed count display)
