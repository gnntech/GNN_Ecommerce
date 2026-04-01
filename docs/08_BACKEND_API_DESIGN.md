# Backend API Design (CRUD Operations)

## API Architecture

### RESTful Principles
- **Resource-based URLs**: `/api/products/gemstones`
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: 200, 201, 400, 401, 404, 500
- **JSON Format**: Request and response bodies

### Base URL
```
Development: http://localhost:5000/api
Production: https://gnn-ecommerce-1.onrender.com/api
```

## Authentication Endpoints

### 1. Admin Login
```http
POST /api/auth/login
Content-Type: application/json

Request Body:
{
    "username": "admin",
    "password": "admin"
}

Response (200 OK):
{
    "_id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "isAdmin": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (401 Unauthorized):
{
    "message": "Invalid credentials"
}
```

### 2. Register Admin (Protected)
```http
POST /api/auth/register-admin
Content-Type: application/json

Request Body:
{
    "username": "newadmin",
    "password": "securepassword"
}

Response (201 Created):
{
    "_id": "507f1f77bcf86cd799439012",
    "username": "newadmin",
    "isAdmin": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Product Endpoints (Gemstones)

### 1. Get All Gemstones
```http
GET /api/products/gemstones

Response (200 OK):
[
    {
        "_id": "65f1234567890abcdef12345",
        "name": "Amethyst",
        "shortDescription": "Purple healing crystal",
        "meaning": "Spiritual protection and purification",
        "color": "Purple",
        "zodiac": "Pisces, Aquarius",
        "chakra": "Crown Chakra",
        "benefits": [
            "Enhances intuition",
            "Promotes calmness",
            "Aids in meditation"
        ],
        "whoShouldWear": [
            "People seeking spiritual growth",
            "Those with anxiety"
        ],
        "careInstructions": [
            "Cleanse under moonlight",
            "Avoid direct sunlight"
        ],
        "image": "https://res.cloudinary.com/.../amethyst.jpg",
        "price": "₹1,200",
        "buyLink": "/checkout",
        "createdAt": "2024-03-15T10:30:00.000Z",
        "updatedAt": "2024-03-15T10:30:00.000Z"
    }
]
```

### 2. Get Gemstone by ID
```http
GET /api/products/gemstones/:id

Response (200 OK):
{
    "_id": "65f1234567890abcdef12345",
    "name": "Amethyst",
    ...
}

Response (404 Not Found):
{
    "message": "Gemstone not found"
}
```

### 3. Create Gemstone (Admin Only)
```http
POST /api/products/gemstones
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

Request Body (FormData):
{
    "name": "Rose Quartz",
    "shortDescription": "Stone of love",
    "meaning": "Unconditional love and compassion",
    "color": "Pink",
    "zodiac": "Taurus, Libra",
    "chakra": "Heart Chakra",
    "benefits": ["Attracts love", "Heals emotional wounds"],
    "whoShouldWear": ["People seeking love"],
    "careInstructions": ["Cleanse with water"],
    "price": "₹1,500",
    "buyLink": "/checkout",
    "image": <File>
}

Response (201 Created):
{
    "_id": "65f1234567890abcdef12346",
    "name": "Rose Quartz",
    ...
}

Response (400 Bad Request):
{
    "message": "Please upload an image"
}

Response (401 Unauthorized):
{
    "message": "Not authorized"
}
```

### 4. Update Gemstone (Admin Only)
```http
PUT /api/products/gemstones/:id
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

Request Body (FormData):
{
    "name": "Rose Quartz Updated",
    "price": "₹1,600",
    "image": <File> (optional)
}

Response (200 OK):
{
    "_id": "65f1234567890abcdef12346",
    "name": "Rose Quartz Updated",
    "price": "₹1,600",
    ...
}

Response (404 Not Found):
{
    "message": "Gemstone not found"
}
```

### 5. Delete Gemstone (Admin Only)
```http
DELETE /api/products/gemstones/:id
Authorization: Bearer <JWT_TOKEN>

Response (200 OK):
{
    "message": "Gemstone removed"
}

Response (404 Not Found):
{
    "message": "Gemstone not found"
}
```

## Product Endpoints (Trees & Bracelets)

Similar CRUD operations for:
- `/api/products/trees`
- `/api/products/bracelets`

Same structure as gemstones with slight schema differences.

## Search Endpoint

```http
GET /api/products/search?query=amethyst&category=Gemstones&minPrice=1000&maxPrice=2000

Query Parameters:
- query: Search term (searches name, meaning, benefits)
- category: "All" | "Gemstones" | "Trees" | "Bracelets"
- minPrice: Minimum price (number)
- maxPrice: Maximum price (number)

Response (200 OK):
[
    {
        "_id": "65f1234567890abcdef12345",
        "name": "Amethyst",
        "type": "gemstone",
        ...
    },
    {
        "_id": "65f1234567890abcdef12347",
        "name": "Amethyst Bracelet",
        "type": "bracelet",
        ...
    }
]
```

## Payment Endpoints

### 1. Create Order
```http
POST /api/payment/create-order
Content-Type: application/json

Request Body:
{
    "amount": 1200,
    "products": [
        {
            "product": "65f1234567890abcdef12345",
            "name": "Amethyst",
            "qty": 1,
            "image": "https://...",
            "price": 1200,
            "type": "Gemstone"
        }
    ],
    "user": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210",
        "address": "123 Main St, Mumbai, MH - 400001"
    }
}

Response (200 OK):
{
    "success": true,
    "order": {
        "id": "order_MNOPqrstuvwxyz",
        "amount": 120000,
        "currency": "INR",
        "receipt": "receipt_1710501234567"
    }
}

Response (400 Bad Request):
{
    "message": "Please fill all the fields"
}

Response (500 Internal Server Error):
{
    "message": "Something went wrong with Razorpay"
}
```

### 2. Verify Payment
```http
POST /api/payment/verify-payment
Content-Type: application/json

Request Body:
{
    "razorpayOrderId": "order_MNOPqrstuvwxyz",
    "razorpayPaymentId": "pay_ABCDefghijklmn",
    "razorpaySignature": "a1b2c3d4e5f6...",
    "orderData": {
        "user": {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "9876543210",
            "address": "123 Main St, Mumbai, MH - 400001"
        },
        "orderItems": [...],
        "itemsPrice": 1200,
        "totalPrice": 1200
    }
}

Response (200 OK):
{
    "success": true,
    "message": "Payment verified successfully",
    "orderId": "65f1234567890abcdef12348"
}

Response (400 Bad Request):
{
    "message": "Invalid signature sent!"
}
```

## Content Management Endpoints

### 1. Slider Management
```http
GET /api/content/slider
POST /api/content/slider (Admin)
PUT /api/content/slider/:id (Admin)
DELETE /api/content/slider/:id (Admin)
```

### 2. Reviews Management
```http
GET /api/content/reviews
POST /api/content/reviews (Admin)
PUT /api/content/reviews/:id (Admin)
DELETE /api/content/reviews/:id (Admin)
```

### 3. Collections Management
```http
GET /api/content/collections
POST /api/content/collections (Admin)
PUT /api/content/collections/:id (Admin)
DELETE /api/content/collections/:id (Admin)
```

### 4. Gallery Management
```http
GET /api/content/gallery
POST /api/content/gallery (Admin)
PUT /api/content/gallery/:id (Admin)
DELETE /api/content/gallery/:id (Admin)
```

### 5. Section Content
```http
GET /api/content/sections/:name
PUT /api/content/sections/:name (Admin)

Example: GET /api/content/sections/craftsmanship
```

## Error Handling

### Standard Error Response
```json
{
    "message": "Error description",
    "stack": "Error stack trace (development only)"
}
```

### HTTP Status Codes
- **200 OK**: Successful GET, PUT
- **201 Created**: Successful POST
- **400 Bad Request**: Validation error
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Not authorized (not admin)
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## Middleware

### 1. Authentication Middleware
```javascript
// backend/middleware/authMiddleware.js
const protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } else {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
};
```

### 2. Admin Middleware
```javascript
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error("Not authorized as an admin");
    }
};
```

### 3. Upload Middleware
```javascript
// backend/middleware/uploadMiddleware.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "gnn-ecommerce",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});

const upload = multer({ storage });
module.exports = upload;
```

## API Rate Limiting (Future Enhancement)

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api/", limiter);
```
