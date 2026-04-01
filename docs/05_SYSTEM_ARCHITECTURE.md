# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Mobile    │  │    Tablet    │      │
│  │  (Desktop)   │  │   Browser    │  │   Browser    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL CDN (Frontend)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React SPA (Vite Build)                  │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │   │
│  │  │   Pages    │  │ Components │  │   Context  │    │   │
│  │  │  (Routes)  │  │   (UI)     │  │  (State)   │    │   │
│  │  └────────────┘  └────────────┘  └────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────┬─────────────────────────────────┘
                             │ REST API (Axios)
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  RENDER (Backend Server)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Express.js Application                  │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │   │
│  │  │   Routes   │  │Controllers │  │ Middleware │    │   │
│  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘    │   │
│  │        │                │                │           │   │
│  │        └────────────────┼────────────────┘           │   │
│  │                         │                            │   │
│  │                    ┌────▼────┐                       │   │
│  │                    │ Models  │                       │   │
│  │                    └────┬────┘                       │   │
│  └─────────────────────────┼──────────────────────────────┘ │
└────────────────────────────┼─────────────────────────────────┘
                             │ Mongoose ODM
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   MongoDB Atlas (Database)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Products    │  │    Orders    │  │    Users     │      │
│  │ Collection   │  │  Collection  │  │  Collection  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Cloudinary  │  │   Razorpay   │  │   EmailJS    │      │
│  │  (Images)    │  │  (Payments)  │  │  (Contact)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Architecture (React)

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Navbar.tsx      # Navigation bar
│   ├── Footer.tsx      # Footer component
│   ├── ProductCard.tsx # Product display card
│   └── admin/          # Admin-specific components
│
├── pages/              # Route components
│   ├── Index.tsx       # Homepage
│   ├── Collection.tsx  # Product listing
│   ├── Cart.tsx        # Shopping cart
│   ├── Checkout.tsx    # Checkout flow
│   └── admin/          # Admin pages
│       ├── AdminLogin.tsx
│       ├── AdminDashboard.tsx
│       └── Manage*.tsx
│
├── context/            # React Context for state
│   ├── AuthContext.tsx # Authentication state
│   └── CartContext.tsx # Shopping cart state
│
├── lib/                # Utilities
│   ├── api.ts          # Axios instance
│   └── utils.ts        # Helper functions
│
└── App.tsx             # Root component with routing
```

### Backend Architecture (Express)

```
backend/
├── models/             # Mongoose schemas
│   ├── User.js
│   ├── Gemstone.js
│   ├── Tree.js
│   ├── Bracelet.js
│   └── Order.js
│
├── controllers/        # Business logic
│   ├── authController.js
│   ├── productController.js
│   ├── paymentController.js
│   └── contentController.js
│
├── routes/             # API endpoints
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── paymentRoutes.js
│   └── contentRoutes.js
│
├── middleware/         # Express middleware
│   ├── authMiddleware.js
│   └── uploadMiddleware.js
│
├── config/             # Configuration
│   ├── db.js           # MongoDB connection
│   └── cloudinary.js   # Cloudinary setup
│
└── server.js           # Entry point
```

## Data Flow Diagrams

### 1. User Browsing Products

```
User → Frontend → API Request → Backend → MongoDB
                                    ↓
User ← Frontend ← JSON Response ← Backend ← MongoDB
```

### 2. Admin Adding Product

```
Admin → Login → JWT Token → Upload Form → Multer
                                ↓
                          Cloudinary (Image)
                                ↓
                          MongoDB (Product Data)
                                ↓
                          Success Response
```

### 3. Checkout Flow

```
User → Cart → Checkout Form → Validation (Zod)
                    ↓
              Backend API (Create Order)
                    ↓
              Razorpay (Payment Gateway)
                    ↓
              Payment Success/Failure
                    ↓
              Verify Signature (Backend)
                    ↓
              Save Order (MongoDB)
                    ↓
              Confirmation Page
```

## Security Architecture

### Authentication Flow

```
1. Admin Login
   ├── Username + Password
   ├── bcrypt.compare() → Verify password
   ├── Generate JWT token
   └── Store in sessionStorage

2. Protected Routes
   ├── Extract token from Authorization header
   ├── jwt.verify() → Validate token
   ├── Attach user to req.user
   └── Proceed to controller

3. Token Expiry
   ├── Check exp claim in JWT
   ├── If expired → 401 Unauthorized
   └── Redirect to login
```

### Payment Security

```
1. Create Order
   ├── Backend generates Razorpay order
   └── Returns order_id

2. Payment
   ├── Frontend opens Razorpay modal
   ├── User completes payment
   └── Razorpay returns payment_id + signature

3. Verification
   ├── Backend receives payment details
   ├── Compute HMAC-SHA256 signature
   ├── Compare with Razorpay signature
   ├── If match → Save order
   └── If mismatch → Reject payment
```

## Scalability Considerations

### Horizontal Scaling
- Stateless backend (no session storage)
- JWT tokens (no server-side sessions)
- MongoDB sharding for large datasets
- Cloudinary CDN for images

### Caching Strategy
- Browser caching (static assets)
- CDN caching (Vercel, Cloudinary)
- MongoDB indexes for fast queries
- React Query for client-side caching

### Performance Optimization
- Code splitting by route
- Lazy loading images
- Debounced search
- Pagination for product lists
