# Homepage UI & Content Design

## Homepage Structure

### 1. Navigation Bar (Navbar)
```
┌─────────────────────────────────────────────────────────┐
│  [Logo]  Home  Products▼  About  Testimonials  Contact │
│                                    [Search] [Cart: 3]   │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Sticky navigation (stays on scroll)
- Dropdown for Products (Gemstones, Trees, Bracelets)
- Search icon with modal
- Cart icon with item count badge
- Responsive hamburger menu on mobile

**Implementation:**
```tsx
// src/components/Navbar.tsx
- Uses React Router Link for navigation
- Cart count from CartContext
- Framer Motion for smooth animations
- Tailwind for responsive design
```

### 2. Hero Section (Premium 3D Slider)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│         [← Previous Image]  [Next Image →]             │
│                                                         │
│     ╔═══════════════════════════════════════╗          │
│     ║                                       ║          │
│     ║      FEATURED PRODUCT IMAGE           ║          │
│     ║         (3D Carousel)                 ║          │
│     ║                                       ║          │
│     ╚═══════════════════════════════════════╝          │
│                                                         │
│         "Unlock Ancient Wisdom"                        │
│         "Discover Your Numerology Path"                │
│                                                         │
│              [Explore Collection]                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- 3D carousel with perspective effect
- Auto-play with 5-second intervals
- Manual navigation (prev/next buttons)
- Smooth transitions with Framer Motion
- Responsive images from Cloudinary

**Content:**
- 4-5 hero images showcasing products
- Overlay text with call-to-action
- Gradient overlays for text readability

### 3. Marquee Section

```
┌─────────────────────────────────────────────────────────┐
│ ✨ Free Shipping on Orders Above ₹999 | Authentic     │
│    Certified Gemstones | 100% Handcrafted Products ✨  │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Infinite scroll animation
- Customizable text from admin panel
- Eye-catching icons
- Smooth CSS animation

### 4. Featured Products Section

```
┌─────────────────────────────────────────────────────────┐
│                  Featured Collection                    │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  [Image] │  │  [Image] │  │  [Image] │            │
│  │          │  │          │  │          │            │
│  │ Amethyst │  │Rose Quartz│ │  Citrine │            │
│  │  ₹1,200  │  │  ₹1,500  │  │  ₹1,800  │            │
│  │ [View]   │  │ [View]   │  │ [View]   │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│                                                         │
│              [View All Products →]                     │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Grid layout (3 columns desktop, 1 mobile)
- Hover effects (scale, shadow)
- Quick view button
- Add to cart button
- Price display

**Implementation:**
```tsx
// src/components/FeaturedCollection.tsx
- Fetches top 6 products from API
- ProductCard component for each item
- Responsive grid with Tailwind
- Lazy loading images
```

### 5. About Section

```
┌─────────────────────────────────────────────────────────┐
│              About Gaurab Nerpagar                      │
│                                                         │
│  [Photo]     Master Numerologist & Spiritual Guide     │
│              With 15+ years of experience in           │
│              numerology and gemstone healing...        │
│                                                         │
│              [Learn More]                              │
└─────────────────────────────────────────────────────────┘
```

**Content:**
- Brief introduction
- Credentials and experience
- Mission statement
- CTA to About page

### 6. Celebrity Reviews Section

```
┌─────────────────────────────────────────────────────────┐
│              What Our Clients Say                       │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [Video Thumbnail]                              │   │
│  │                                                 │   │
│  │  "The gemstone changed my life..."             │   │
│  │  - Celebrity Name, Actor                       │   │
│  │  ⭐⭐⭐⭐⭐                                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [← Previous]  [Next →]                                │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Carousel with video testimonials
- Star ratings
- Client name and role
- Auto-play videos on click
- Responsive slider

### 7. Craftsmanship Section

```
┌─────────────────────────────────────────────────────────┐
│              Our Craftsmanship                          │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │              │  │              │                   │
│  │  [Video]     │  │  Handcrafted │                   │
│  │              │  │  by Expert   │                   │
│  │              │  │  Jewellers   │                   │
│  └──────────────┘  └──────────────┘                   │
│                                                         │
│  Every piece is crafted with precision and care...    │
└─────────────────────────────────────────────────────────┘
```

**Content:**
- Video showcasing craftsmanship
- Description of process
- Quality assurance message
- Editable from admin panel

### 8. Image Gallery (Infinite Scroll)

```
┌─────────────────────────────────────────────────────────┐
│                    Our Gallery                          │
│                                                         │
│  [Img1] [Img2] [Img3] [Img4] [Img5] [Img6] [Img7]...  │
│  ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Horizontal infinite scroll
- Auto-scroll animation
- Hover to pause
- Lightbox on click
- Responsive images

### 9. Footer

```
┌─────────────────────────────────────────────────────────┐
│  [Logo]                                                 │
│                                                         │
│  Quick Links        Products         Contact Us        │
│  - Home            - Gemstones       📧 Email          │
│  - About           - Trees           📞 Phone          │
│  - Contact         - Bracelets       📍 Address        │
│                                                         │
│  [LinkedIn] [Instagram] [Facebook] [Twitter]           │
│                                                         │
│  © 2024 GNN E-commerce. All rights reserved.           │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Three-column layout
- Social media links
- Newsletter signup (optional)
- Copyright notice
- Responsive stacking on mobile

## Color Scheme

```css
Primary: #800020 (Maroon)
Secondary: #FACC15 (Gold/Yellow)
Accent: #FE7028 (Orange)
Background: #FDFCF6 (Cream)
Text: #1F2937 (Dark Gray)
```

## Typography

```css
Headings: 'Playfair Display' (Serif)
Body: 'Inter' (Sans-serif)
Accent: 'Matter' (Custom)
```

## Responsive Breakpoints

```css
Mobile: 320px - 640px
Tablet: 641px - 1024px
Desktop: 1025px+
```
