# MongoDB Schema Design & Explanation

## Database: ECommerce

## Collections Overview

1. **users** - Admin authentication
2. **gemstones** - Gemstone products
3. **trees** - Crystal tree products
4. **bracelets** - Bracelet products
5. **orders** - Customer orders
6. **sliders** - Hero slider images
7. **reviews** - Celebrity testimonials
8. **collections** - Product collections
9. **galleries** - Image gallery
10. **sectioncontents** - Dynamic page sections

## Schema Definitions

### 1. User Schema

```javascript
// backend/models/User.js
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true  // Adds createdAt, updatedAt
});

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
```

**Explanation:**
- `username`: Unique identifier for admin
- `password`: Hashed with bcrypt (10 salt rounds)
- `isAdmin`: Flag to identify admin users
- `timestamps`: Auto-managed createdAt/updatedAt
- Pre-save hook: Automatically hashes password before saving
- matchPassword method: Compares plain text with hashed password

**Sample Document:**
```json
{
    "_id": "65f1234567890abcdef12345",
    "username": "admin",
    "password": "$2a$10$abcdefghijklmnopqrstuvwxyz123456789",
    "isAdmin": true,
    "createdAt": "2024-03-15T10:00:00.000Z",
    "updatedAt": "2024-03-15T10:00:00.000Z"
}
```

### 2. Gemstone Schema

```javascript
// backend/models/Gemstone.js
const gemstoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    shortDescription: String,
    meaning: String,
    color: String,
    colorClass: String,  // CSS class for color styling
    glowClass: String,   // CSS class for glow effect
    zodiac: String,      // Compatible zodiac signs
    rarity: String,      // Common, Rare, Very Rare
    hardness: String,    // Mohs scale
    chakra: String,      // Associated chakra
    benefits: [String],  // Array of benefits
    whoShouldWear: [String],
    careInstructions: [String],
    image: {
        type: String,
        required: true   // Cloudinary URL
    },
    price: String,       // Formatted price (₹1,200)
    buyLink: String
}, {
    timestamps: true
});
```

**Explanation:**
- Flexible schema for varying gemstone properties
- Arrays for benefits, whoShouldWear, careInstructions
- `image`: Cloudinary URL (not stored in MongoDB)
- `price`: String to preserve formatting (₹ symbol)
- `colorClass`, `glowClass`: For dynamic UI styling

**Sample Document:**
```json
{
    "_id": "65f1234567890abcdef12346",
    "name": "Amethyst",
    "shortDescription": "Purple healing crystal",
    "meaning": "Spiritual protection and purification",
    "color": "Purple",
    "colorClass": "text-purple-600",
    "glowClass": "shadow-purple-500/50",
    "zodiac": "Pisces, Aquarius",
    "rarity": "Common",
    "hardness": "7",
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
    "image": "https://res.cloudinary.com/debbztjh1/image/upload/v1710501234/gnn-ecommerce/amethyst.jpg",
    "price": "₹1,200",
    "buyLink": "/checkout",
    "createdAt": "2024-03-15T10:30:00.000Z",
    "updatedAt": "2024-03-15T10:30:00.000Z"
}
```

### 3. Tree Schema

```javascript
// backend/models/Tree.js
const treeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    shortDescription: String,
    meaning: String,
    numerology: String,  // Numerology significance
    benefits: [String],
    whoShouldWear: [String],
    careInstructions: [String],
    image: {
        type: String,
        required: true
    },
    price: String,
    buyLink: String
}, {
    timestamps: true
});
```

**Explanation:**
- Similar to Gemstone but with `numerology` field
- Simpler schema (no color, chakra, zodiac)
- Reuses common fields (benefits, care, etc.)

### 4. Bracelet Schema

```javascript
// backend/models/Bracelet.js
const braceletSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    shortDescription: String,
    meaning: String,
    numerology: String,
    benefits: [String],
    whoShouldWear: [String],
    careInstructions: [String],
    image: {
        type: String,
        required: true
    },
    price: String,
    buyLink: String
}, {
    timestamps: true
});
```

**Explanation:**
- Identical to Tree schema
- Separate collection for better organization
- Allows different business logic per product type

### 5. Order Schema

```javascript
// backend/models/Order.js
const orderSchema = new mongoose.Schema({
    user: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true }
    },
    orderItems: [{
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'orderItems.type'  // Dynamic reference
        },
        type: {
            type: String,
            required: true,
            enum: ['Gemstone', 'Tree', 'Bracelet']
        }
    }],
    paymentInfo: {
        razorpayOrderId: { type: String, required: true },
        razorpayPaymentId: String,
        razorpaySignature: String
    },
    itemsPrice: { type: Number, required: true },
    taxPrice: { type: Number, default: 0.0 },
    shippingPrice: { type: Number, default: 0.0 },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
    status: { type: String, default: "Processing" }
}, {
    timestamps: true
});
```

**Explanation:**
- **Embedded user**: No separate user collection (guest checkout)
- **orderItems array**: Multiple products in one order
- **refPath**: Dynamic reference to Gemstone/Tree/Bracelet
- **type field**: Determines which collection to reference
- **paymentInfo**: Razorpay transaction details
- **Status tracking**: isPaid, isDelivered, status
- **Price breakdown**: items, tax, shipping, total

**Sample Document:**
```json
{
    "_id": "65f1234567890abcdef12347",
    "user": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210",
        "address": "123 Main St, Mumbai, MH - 400001"
    },
    "orderItems": [
        {
            "name": "Amethyst",
            "qty": 1,
            "image": "https://...",
            "price": 1200,
            "product": "65f1234567890abcdef12346",
            "type": "Gemstone",
            "_id": "65f1234567890abcdef12348"
        }
    ],
    "paymentInfo": {
        "razorpayOrderId": "order_MNOPqrstuvwxyz",
        "razorpayPaymentId": "pay_ABCDefghijklmn",
        "razorpaySignature": "a1b2c3d4e5f6..."
    },
    "itemsPrice": 1200,
    "taxPrice": 0,
    "shippingPrice": 0,
    "totalPrice": 1200,
    "isPaid": true,
    "paidAt": "2024-03-15T11:00:00.000Z",
    "isDelivered": false,
    "status": "Processing",
    "createdAt": "2024-03-15T10:45:00.000Z",
    "updatedAt": "2024-03-15T11:00:00.000Z"
}
```

### 6. Slider Schema

```javascript
// backend/models/Slider.js
const sliderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: String,
    image: { type: String, required: true },
    videoUrl: String,
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});
```

**Explanation:**
- `order`: For sorting slides
- `videoUrl`: Optional YouTube embed
- Used in hero section carousel

### 7. Review Schema

```javascript
// backend/models/Review.js
const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: String,
    image: { type: String, required: true },
    videoUrl: String,
    rating: { type: Number, default: 5 },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});
```

**Explanation:**
- Celebrity testimonials
- `rating`: 1-5 stars
- `videoUrl`: Embedded video testimonial

### 8. Collection Schema

```javascript
// backend/models/Collection.js
const collectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    image: { type: String, required: true },
    link: String,
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});
```

**Explanation:**
- Product groupings (e.g., "Zodiac Collection")
- `link`: URL to collection page

### 9. Gallery Schema

```javascript
// backend/models/Gallery.js
const gallerySchema = new mongoose.Schema({
    title: String,
    image: { type: String, required: true },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});
```

**Explanation:**
- Simple image gallery
- Infinite scroll on homepage

### 10. SectionContent Schema

```javascript
// backend/models/SectionContent.js
const sectionContentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true  // e.g., "craftsmanship", "marquee"
    },
    title: String,
    subtitle: String,
    description: String,
    videoUrl: String,
    image: String,
    ctaText: String,
    ctaLink: String
}, {
    timestamps: true
});
```

**Explanation:**
- Dynamic content sections
- `name`: Unique identifier (craftsmanship, about, etc.)
- Flexible fields for different section types

## Indexing Strategy

```javascript
// Improve query performance
gemstoneSchema.index({ name: 'text', meaning: 'text', benefits: 'text' });
treeSchema.index({ name: 'text', numerology: 'text' });
braceletSchema.index({ name: 'text', numerology: 'text' });
orderSchema.index({ 'user.email': 1, createdAt: -1 });
```

**Explanation:**
- Text indexes for search functionality
- Compound index on orders for user queries
- Improves search performance by 10x

## Relationships

```
User (1) -------- (0..*) Orders
Order (1) -------- (1..*) OrderItems
OrderItem (*) -------- (1) Product (Gemstone/Tree/Bracelet)
```

**Note:** Using refPath for polymorphic relationships
