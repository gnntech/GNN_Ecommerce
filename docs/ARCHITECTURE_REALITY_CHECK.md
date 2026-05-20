# GNN E-Commerce — Architecture Reality Check
> Based on actual code audit. Every ✅ / ❌ / ⚠️ is verified against your real files.

---

## SECTION 1 — PAYMENT INTEGRATION

### How Razorpay Works (Your Current Flow)

```
User clicks "Buy Now"
       │
       ▼
Frontend calls POST /api/payment/create-order
       │  { amount, products, user }
       ▼
Backend creates Razorpay order (razorpay.orders.create)
       │  Returns: { id, amount, currency }
       ▼
Frontend opens Razorpay checkout popup
       │  User pays via UPI / Card / NetBanking
       ▼
Razorpay returns to frontend:
       │  { razorpay_order_id, razorpay_payment_id, razorpay_signature }
       ▼
Frontend calls POST /api/payment/verify-payment
       │  Sends all 3 IDs + orderData
       ▼
Backend verifies HMAC-SHA256 signature
       │  sign = orderId + "|" + paymentId
       │  expected = HMAC(secret, sign)
       ▼
If valid → Save Order to MongoDB → Send email → Return orderId
If invalid → 400 "Invalid signature"
```

### What Is Done ✅

- ✅ Razorpay order creation (`paymentController.js` → `razorpay.orders.create`)
- ✅ HMAC-SHA256 signature verification (crypto module, correct implementation)
- ✅ Order saved to MongoDB after payment verified
- ✅ `isPaid: true` + `paidAt` timestamp set on success
- ✅ Order confirmation email via Nodemailer (Gmail)
- ✅ Rate limiting on payment endpoints (`paymentLimiter`)
- ✅ Razorpay keys stored in `.env` (not hardcoded)
- ✅ Amount converted to paise (`amount * 100`) correctly

### What Is Missing ❌

- ❌ **Refund flow** — No `/api/payment/refund` endpoint exists
- ❌ **Razorpay Webhook** — No webhook handler for async payment events
- ❌ **Payment failure handling** — Frontend gets no structured error if payment fails
- ❌ **Idempotency** — Double-clicking "Pay" can create duplicate Razorpay orders
- ❌ **Inventory check before payment** — Stock is never verified before charging
- ❌ **User linked to order** — `order.user` stores plain object, not a User `_id` ref
- ❌ **Price validation on backend** — Frontend sends `amount`; backend trusts it blindly

### How to Fix the Critical Gaps

**1. Add Razorpay Webhook (most important)**
```js
// backend/routes/paymentRoutes.js
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

// backend/controllers/paymentController.js
const handleWebhook = (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const body = req.body; // raw buffer
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  if (signature !== expected) return res.status(400).send("Invalid");

  const event = JSON.parse(body);
  if (event.event === "payment.captured") {
    // mark order as paid if not already
  }
  if (event.event === "refund.processed") {
    // update order status to Refunded
  }
  res.json({ received: true });
};
```

**2. Add Refund Endpoint**
```js
// POST /api/payment/refund
const refundPayment = asyncHandler(async (req, res) => {
  const { orderId, reason } = req.body;
  const order = await Order.findById(orderId);
  if (!order || !order.isPaid) throw new Error("Order not eligible for refund");

  const refund = await razorpay.payments.refund(order.paymentInfo.razorpayPaymentId, {
    amount: order.totalPrice * 100, // full refund
    notes: { reason }
  });

  order.status = "Refunded";
  order.refundInfo = { refundId: refund.id, refundedAt: Date.now() };
  await order.save();
  res.json({ success: true, refund });
});
```

**3. Validate price on backend (security)**
```js
// In verifyPayment, before saving order:
const expectedTotal = orderData.orderItems.reduce((sum, item) => {
  return sum + (item.price * item.qty);
}, 0);
if (Math.abs(expectedTotal - orderData.totalPrice) > 1) {
  return res.status(400).json({ error: "Price mismatch detected" });
}
```

---

## SECTION 2 — SHIPPING PARTNER INTEGRATION

### Current Status

- ❌ **Zero shipping integration** — Your Order model has `isDelivered` and `deliveredAt` fields but no AWB, no tracking ID, no courier partner

### How Shiprocket Integration Works (What to Build)

```
Order Created (isPaid = true)
       │
       ▼
POST https://apiv2.shiprocket.in/v1/external/orders/create/adhoc
       │  { order_id, order_date, pickup_location, billing_*, shipping_*,
       │    order_items: [{ name, sku, units, selling_price }],
       │    payment_method: "Prepaid", sub_total, length, breadth, height, weight }
       ▼
Shiprocket returns: { shipment_id, awb_code, courier_name }
       │
       ▼
Save to Order: { awb, shipmentId, courierName, trackingUrl }
       │
       ▼
Shiprocket sends webhook on status change:
       │  "Picked Up" → "In Transit" → "Out for Delivery" → "Delivered"
       ▼
Your webhook updates order.status in MongoDB
       │
       ▼
Send SMS/Email to customer with tracking link
```

### Add to Order Model
```js
// Add these fields to orderSchema:
shipping: {
  awb:          { type: String },           // Air Waybill number
  shipmentId:   { type: String },           // Shiprocket shipment ID
  courierName:  { type: String },           // "Delhivery", "BlueDart" etc.
  trackingUrl:  { type: String },           // Public tracking link
  estimatedDelivery: { type: Date },
  shippedAt:    { type: Date },
},
```

### Shiprocket Auth (Token-based, expires every 24h)
```js
// backend/services/shiprocketService.js
const getShiprocketToken = async () => {
  const { data } = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    { email: process.env.SHIPROCKET_EMAIL, password: process.env.SHIPROCKET_PASSWORD }
  );
  return data.token; // Cache this in Redis or memory for 23h
};
```

### Shiprocket Webhook Handler
```js
// POST /api/shipping/webhook
router.post("/webhook", async (req, res) => {
  const { awb, current_status, order_id } = req.body;
  const order = await Order.findOne({ "shipping.awb": awb });
  if (order) {
    order.status = mapShiprocketStatus(current_status);
    if (current_status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    await order.save();
    // send customer notification
  }
  res.json({ received: true });
});
```

---

## SECTION 3 — COMPLETE ORDER WORKFLOW (CURRENT vs IDEAL)

### Current Flow (What Actually Happens)
```
1. User fills checkout form
2. Frontend calls POST /api/payment/create-order  → Razorpay order created
3. Razorpay popup opens → User pays
4. Frontend calls POST /api/payment/verify-payment
5. Backend verifies signature → Saves Order → Sends email
6. Frontend redirects to /payment-success
7. Admin manually updates order status in dashboard
8. Admin manually ships the order (no integration)
```

### Ideal Flow (What Should Happen)
```
1. User fills checkout form
2. Backend validates stock availability
3. POST /api/payment/create-order → Razorpay order created
4. Razorpay popup → User pays
5. POST /api/payment/verify-payment
6. Backend verifies signature
7. ── Atomic transaction ──
   a. Save Order (isPaid: true)
   b. Decrement stock for each item
   c. Create Shiprocket shipment → get AWB
   d. Save AWB to order
   e. Send confirmation email with tracking link
8. Razorpay webhook as backup (catches missed verifications)
9. Shiprocket webhook updates delivery status automatically
10. Customer gets SMS/email at each status change
```

---

## SECTION 4 — PRODUCT LISTING SYSTEM

### Current Schema Issues

You have 3 separate collections: `Gemstone`, `Tree`, `Bracelet`. This works now but breaks at scale.

**Problem 1 — Price stored as String**
```js
// Current (Bracelet.js):
price: { type: String }  // "₹1200" — can't sort, can't filter by range efficiently

// Should be:
price: { type: Number }  // 1200 — sort/filter works natively
currency: { type: String, default: "INR" }
```

**Problem 2 — No stock/inventory field**
```js
// None of your 3 models have:
stock: { type: Number, default: 0 }
// So you can't prevent overselling
```

**Problem 3 — No pagination on product endpoints**
```js
// Current (productController.js):
const gemstones = await Gemstone.find({});  // fetches ALL documents every time

// Should be:
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 12;
const skip = (page - 1) * limit;
const gemstones = await Gemstone.find(q).skip(skip).limit(limit);
const total = await Gemstone.countDocuments(q);
res.json({ products: gemstones, total, page, pages: Math.ceil(total / limit) });
```

**Problem 4 — Search runs 3 separate DB queries**
```js
// Current searchProducts() does:
await Gemstone.find(q)   // query 1
await Tree.find(q)       // query 2
await Bracelet.find(q)   // query 3
// Then merges in memory — slow at scale
```

### What Is Done ✅
- ✅ Text indexes on name, shortDescription, meaning (Bracelet model)
- ✅ Basic regex search across categories
- ✅ Price range filtering (string parsing)
- ✅ Category filter in search

### What Is Missing ❌
- ❌ Pagination on all product list endpoints
- ❌ Stock/inventory field on all models
- ❌ Price as Number (stored as String currently)
- ❌ Product variants (size, color, bead count)
- ❌ Unified Product collection (3 separate collections = 3x maintenance)
- ❌ Sort by price, newest, popularity
- ❌ Product status (active/inactive/out-of-stock)

### Recommended Unified Product Schema (Future-Proof)
```js
const productSchema = new mongoose.Schema({
  name:             { type: String, required: true, index: true },
  slug:             { type: String, unique: true },  // URL-friendly
  category:         { type: String, enum: ["Gemstone","Bracelet","Tree"], index: true },
  subcategory:      { type: String },
  shortDescription: { type: String },
  description:      { type: String },
  price:            { type: Number, required: true },  // Always Number
  comparePrice:     { type: Number },                  // Original price for "sale"
  currency:         { type: String, default: "INR" },
  stock:            { type: Number, default: 0 },
  images:           [{ type: String }],                // Array of Cloudinary URLs
  tags:             [{ type: String }],
  benefits:         [{ type: String }],
  zodiac:           { type: String },
  chakra:           { type: String },
  isActive:         { type: Boolean, default: true },
  isFeatured:       { type: Boolean, default: false },
  soldCount:        { type: Number, default: 0 },      // For "popular" sorting
  rating:           { type: Number, default: 0 },
  numReviews:       { type: Number, default: 0 },
}, { timestamps: true });

// Compound indexes
productSchema.index({ category: 1, price: 1 });
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ name: "text", description: "text", tags: "text" });
```

---

## SECTION 5 — SCALABILITY ROADMAP

### Stage 1: Current (Startup) — Where You Are Now
```
Traffic:    < 100 users/day
Products:   < 500
Stack:      Single Node.js server + MongoDB Atlas free tier
Hosting:    Render / Railway (single instance)
Issues:     No caching, no pagination, no CDN, prices as strings
```

### Stage 2: Growth (1K–10K users/day) — What to Add Next

**Add Redis Caching**
```js
// Install: npm install ioredis
const redis = new Redis(process.env.REDIS_URL);

// Cache product list for 5 minutes
const getGemstones = asyncHandler(async (req, res) => {
  const cacheKey = `gemstones:page:${req.query.page || 1}`;
  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const gemstones = await Gemstone.find({}).limit(12).skip(...);
  await redis.setex(cacheKey, 300, JSON.stringify(gemstones)); // 5 min TTL
  res.json(gemstones);
});

// Invalidate cache when admin adds/updates product
await redis.del("gemstones:*");
```

**Add CDN for Images**
```
Current:  Images served from Cloudinary (already good!)
Improve:  Use Cloudinary transformations for auto-resize/WebP
          f_auto,q_auto,w_400 in the URL = automatic optimization
Example:  https://res.cloudinary.com/your-cloud/image/upload/f_auto,q_auto,w_400/v1/product.jpg
```

**Add Pagination to All Endpoints**
```js
// GET /api/products/bracelets?page=1&limit=12&sort=price&order=asc
const getBracelets = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, sort = "createdAt", order = "desc", minPrice, maxPrice } = req.query;
  const query = {};
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  const sortObj = { [sort]: order === "asc" ? 1 : -1 };
  const [bracelets, total] = await Promise.all([
    Bracelet.find(query).sort(sortObj).skip((page-1)*limit).limit(Number(limit)),
    Bracelet.countDocuments(query)
  ]);
  res.json({ products: bracelets, total, page: Number(page), pages: Math.ceil(total/limit) });
});
```

### Stage 3: Scale (10K–100K users/day)

**MongoDB Atlas Scaling**
```
- Upgrade to M10+ cluster (dedicated)
- Enable Atlas Search (Lucene-based, replaces regex search)
- Add read replicas for product listing queries
- Enable auto-scaling on Atlas
```

**Atlas Search (replaces your regex search)**
```js
// Much faster than regex, supports fuzzy matching, typo tolerance
const results = await Gemstone.aggregate([
  {
    $search: {
      index: "product_search",
      text: {
        query: req.query.q,
        path: ["name", "description", "tags"],
        fuzzy: { maxEdits: 1 }  // handles typos
      }
    }
  },
  { $limit: 20 }
]);
```

**Load Balancing with PM2 (immediate win, no Docker needed)**
```bash
# Use all CPU cores on your server
npm install -g pm2
pm2 start server.js -i max   # spawns one process per CPU core
pm2 save
pm2 startup
```

**Horizontal Scaling with Docker + Nginx**
```nginx
# nginx.conf — load balance across 3 Node instances
upstream backend {
  server node_app_1:5000;
  server node_app_2:5000;
  server node_app_3:5000;
}
server {
  location /api/ {
    proxy_pass http://backend;
  }
  location / {
    root /usr/share/nginx/html;  # serve React build
    try_files $uri /index.html;
  }
}
```

### Stage 4: Enterprise (100K+ users/day) — Microservices

```
Current monolith → Split into services:

┌─────────────────────────────────────────────────────┐
│                    API Gateway                       │
│              (Nginx / AWS API Gateway)               │
└──────┬──────────┬──────────┬──────────┬─────────────┘
       │          │          │          │
  Product     Order       Payment   Notification
  Service     Service     Service    Service
  :3001       :3002       :3003      :3004
       │          │          │          │
  MongoDB    MongoDB    MongoDB     Redis +
  Products   Orders     Payments    Email/SMS
```

**When to split:** Only when a single service becomes a bottleneck.
Real rule: Don't microservice prematurely. Split when you have 2+ teams or one service crashes others.

---

## SECTION 6 — FUTURE-PROOF ARCHITECTURE DECISIONS

### Adding New Categories (Current Problem)

Right now adding "Necklaces" means:
1. Create `Necklace.js` model
2. Create `necklaceController.js` (copy-paste of braceletController)
3. Add routes to `productRoutes.js`
4. Update `searchProducts()` to include 4th query
5. Update `Order.js` enum to add "Necklace"
6. Update frontend grids

That's 5+ file changes for one new category. With a unified Product model:
```js
// Adding "Necklaces" = zero backend changes
// Just POST /api/products with { category: "Necklace", ... }
// The enum in the schema is the only change needed
```

### Category Management Collection
```js
// models/Category.js
const categorySchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true },
  slug:        { type: String, unique: true },
  description: { type: String },
  image:       { type: String },
  parent:      { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // subcategories
  isActive:    { type: Boolean, default: true },
  sortOrder:   { type: Number, default: 0 },
});
// This lets admin add categories from dashboard without code changes
```

### Environment-Based Config (Already Partially Done)
```
✅ .env for secrets
✅ RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET
✅ EMAIL_USER / EMAIL_PASS
❌ REDIS_URL (not yet)
❌ SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD (not yet)
❌ WEBHOOK_SECRET for Razorpay (not yet)
```

---

## MASTER CHECKLIST — WHAT'S DONE vs REMAINING

### PAYMENT
| Feature | Status | Priority |
|---------|--------|----------|
| Razorpay order creation | ✅ Done | — |
| HMAC signature verification | ✅ Done | — |
| Order saved after payment | ✅ Done | — |
| Confirmation email | ✅ Done | — |
| Rate limiting on payment | ✅ Done | — |
| Razorpay Webhook handler | ❌ Missing | 🔴 High |
| Refund endpoint | ❌ Missing | 🔴 High |
| Backend price validation | ❌ Missing | 🔴 High |
| Idempotency (no duplicate orders) | ❌ Missing | 🟡 Medium |
| Payment failure structured response | ❌ Missing | 🟡 Medium |

### SHIPPING
| Feature | Status | Priority |
|---------|--------|----------|
| Shiprocket integration | ❌ Missing | 🔴 High |
| AWB field in Order model | ❌ Missing | 🔴 High |
| Shipping webhook handler | ❌ Missing | 🔴 High |
| Tracking URL in email | ❌ Missing | 🟡 Medium |
| Return/refund logistics | ❌ Missing | 🟡 Medium |
| Delivery status auto-update | ❌ Missing | 🟡 Medium |

### PRODUCT SYSTEM
| Feature | Status | Priority |
|---------|--------|----------|
| Product CRUD (3 types) | ✅ Done | — |
| Text search with regex | ✅ Done | — |
| Category filter in search | ✅ Done | — |
| Price range filter | ✅ Done | — |
| MongoDB text indexes | ✅ Done | — |
| Pagination on list endpoints | ❌ Missing | 🔴 High |
| Stock/inventory field | ❌ Missing | 🔴 High |
| Price as Number (not String) | ❌ Missing | 🔴 High |
| Sort by price/newest/popular | ❌ Missing | 🟡 Medium |
| Product variants | ❌ Missing | 🟢 Low |
| Unified Product collection | ❌ Missing | 🟢 Low |

### SCALABILITY
| Feature | Status | Priority |
|---------|--------|----------|
| MongoDB indexes on Order | ✅ Done | — |
| MongoDB indexes on Bracelet | ✅ Done | — |
| Rate limiting (express-rate-limit) | ✅ Done | — |
| Cloudinary for images | ✅ Done | — |
| Redis caching | ❌ Missing | 🟡 Medium |
| CDN optimization (Cloudinary transforms) | ❌ Missing | 🟡 Medium |
| Pagination (prevents full-table scans) | ❌ Missing | 🔴 High |
| PM2 cluster mode | ❌ Missing | 🟡 Medium |
| Atlas Search | ❌ Missing | 🟢 Low |
| Docker / Kubernetes | ❌ Missing | 🟢 Low |

---

## RECOMMENDED IMPLEMENTATION ORDER

### Week 1 — Fix Critical Security & Data Issues
1. Add price validation in `verifyPayment` (prevent price manipulation)
2. Add `stock` field to all 3 product models
3. Change `price` from String to Number in all models + migration script
4. Add Razorpay webhook handler

### Week 2 — Add Pagination & Search Improvements
5. Add pagination to `getGemstones`, `getTrees`, `getBracelets`
6. Add sort parameter to all list endpoints
7. Update frontend grids to handle paginated response

### Week 3 — Shipping Integration
8. Create `shiprocketService.js` with auth + order creation
9. Add `shipping` object to Order model
10. Add shipping webhook route
11. Update confirmation email to include tracking link

### Week 4 — Performance
12. Add Redis caching for product lists
13. Enable Cloudinary auto-format (`f_auto,q_auto`) on all image URLs
14. Add PM2 cluster mode to production deployment

---

## REAL-WORLD COMPARISON

| Your System | Amazon/Flipkart |
|-------------|-----------------|
| Single Node.js process | 1000s of microservices |
| MongoDB Atlas free | Distributed DB clusters |
| No caching | Redis + CDN everywhere |
| Manual shipping | Auto-integrated with 10+ couriers |
| Email only | Email + SMS + Push + WhatsApp |
| No stock management | Real-time inventory across warehouses |
| Regex search | Elasticsearch / OpenSearch |

The gap is not about technology — it's about **adding features incrementally**.
Every large system started exactly where you are. The key is building the right foundations now
(pagination, stock, price as number, webhooks) so you don't have to rewrite later.
