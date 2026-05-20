# Skeleton Loading UI - Implementation Guide

## Overview

Modern skeleton loading UI for the Products section with smooth shimmer animations and responsive design.

## Components Created

### 1. **ProductSkeleton.tsx** ✅
- Single skeleton card component
- Matches exact product card layout
- Premium shimmer animation
- Responsive design

### 2. **ProductSkeletonGrid.tsx** ✅
- Grid of skeleton cards
- Staggered fade-in animation
- Configurable count (default: 6)
- Responsive grid layout

### 3. **ProductCard.tsx** ✅
- Reusable product card component
- Hover animations
- Add to cart functionality
- Buy now navigation
- Matches skeleton layout exactly

### 4. **ProductGrid.tsx** ✅
- Smart grid with automatic loading states
- Conditional rendering (skeleton ↔ products)
- Empty state handling
- Smooth transitions

---

## Usage Examples

### Basic Usage - Auto Loading Detection

```tsx
import ProductGrid from "@/components/ProductGrid";

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>();

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Products</h1>
      
      {/* Auto-detects loading when products is undefined */}
      <ProductGrid 
        products={products}
        productType="Bracelet"
      />
    </div>
  );
}
```

### Explicit Loading State

```tsx
import ProductGrid from "@/components/ProductGrid";

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProductGrid 
      products={products}
      loading={loading}
      productType="Bracelet"
      skeletonCount={8}
    />
  );
}
```

### Manual Skeleton Grid

```tsx
import ProductSkeletonGrid from "@/components/ProductSkeletonGrid";
import ProductCard from "@/components/ProductCard";

function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <ProductSkeletonGrid count={6} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {products.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              productType="Bracelet"
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

### With API Integration

```tsx
import { useState, useEffect } from "react";
import ProductGrid from "@/components/ProductGrid";
import axios from "axios";

function BraceletsPage() {
  const [bracelets, setBracelets] = useState<Product[]>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBracelets = async () => {
      try {
        const response = await axios.get("/api/products/bracelets");
        setBracelets(response.data);
      } catch (err) {
        setError("Failed to load products");
        setBracelets([]); // Stop loading
      }
    };

    fetchBracelets();
  }, []);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">
        Sacred Bracelets Collection
      </h1>
      
      <ProductGrid 
        products={bracelets}
        productType="Bracelet"
        skeletonCount={8}
      />
    </div>
  );
}
```

### Different Product Types

```tsx
// Bracelets
<ProductGrid 
  products={bracelets}
  productType="Bracelet"
/>

// Gemstones
<ProductGrid 
  products={gemstones}
  productType="Gemstone"
/>

// Trees
<ProductGrid 
  products={trees}
  productType="Tree"
/>

// Generic Products
<ProductGrid 
  products={products}
  productType="Product"
/>
```

---

## Component Props

### ProductGrid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `products` | `Product[]` | `undefined` | Array of products to display |
| `productType` | `"Bracelet" \| "Gemstone" \| "Tree" \| "Product"` | `"Product"` | Type of products |
| `loading` | `boolean` | auto-detect | Loading state |
| `skeletonCount` | `number` | `6` | Number of skeleton cards |
| `className` | `string` | `""` | Additional CSS classes |
| `onProductClick` | `(product: Product) => void` | `undefined` | Click handler |

### ProductCard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `product` | `Product` | required | Product data |
| `productType` | `"Bracelet" \| "Gemstone" \| "Tree" \| "Product"` | `"Product"` | Type of product |
| `onOpenPreview` | `(product: Product) => void` | `undefined` | Preview handler |

### ProductSkeletonGrid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | `6` | Number of skeleton cards |
| `className` | `string` | `""` | Additional CSS classes |

---

## Product Interface

```typescript
export interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: string | number;
  image?: string;
  description?: string;
  numerology?: string;
  type?: string;
}
```

---

## Features

### ✅ Skeleton Loading
- Smooth shimmer animation
- Matches product card layout exactly
- Staggered fade-in effect
- Responsive grid

### ✅ Product Card
- Hover animations with framer-motion
- Add to cart functionality
- Buy now navigation
- Image fallback handling
- Premium UI design

### ✅ Smart Grid
- Auto-detect loading state
- Conditional rendering
- Empty state handling
- Responsive layout (1/2/3/4 columns)

### ✅ Animations
- Shimmer effect on skeleton
- Staggered fade-in on load
- Hover scale and shadow
- Smooth transitions

---

## Responsive Breakpoints

```css
/* Mobile: 1 column */
grid-cols-1

/* Tablet: 2 columns */
sm:grid-cols-2  /* 640px+ */

/* Desktop: 3 columns */
lg:grid-cols-3  /* 1024px+ */

/* Large Desktop: 4 columns */
xl:grid-cols-4  /* 1280px+ */
```

---

## Styling

### Colors
- Primary: `#9B2533` (Maroon)
- Background: White
- Skeleton: Gray gradients
- Text: Gray-900, Gray-500

### Spacing
- Card padding: `p-5`
- Grid gap: `gap-6 lg:gap-8`
- Min height: `420px`

### Border Radius
- Cards: `rounded-3xl`
- Images: `rounded-lg`
- Buttons: `rounded-full`

### Shadows
- Default: `shadow-lg`
- Hover: Enhanced shadow with motion

---

## Animation Details

### Shimmer Animation
```css
@keyframes shimmer {
  0% { background-position: -200% 0 }
  100% { background-position: 200% 0 }
}
```

### Fade In Animation
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Stagger Delay
Each card delays by `0.1s * index` for smooth sequential appearance.

---

## Integration with Existing Components

### Replace BraceletGrid

```tsx
// Before
import BraceletGrid from "@/components/BraceletGrid";

// After
import ProductGrid from "@/components/ProductGrid";

<ProductGrid 
  products={bracelets}
  productType="Bracelet"
/>
```

### Replace GemstoneGrid

```tsx
// Before
import GemstoneGrid from "@/components/GemstoneGrid";

// After
import ProductGrid from "@/components/ProductGrid";

<ProductGrid 
  products={gemstones}
  productType="Gemstone"
/>
```

---

## Best Practices

1. **Always show skeleton during initial load**
   ```tsx
   const [products, setProducts] = useState<Product[]>(); // undefined = loading
   ```

2. **Use appropriate skeleton count**
   ```tsx
   <ProductGrid skeletonCount={8} /> // Match expected product count
   ```

3. **Handle errors gracefully**
   ```tsx
   if (error) return <ErrorMessage />;
   return <ProductGrid products={products} />;
   ```

4. **Optimize images**
   - Use WebP format
   - Provide fallback images
   - Lazy load when possible

5. **Maintain consistent spacing**
   - Use same grid gaps
   - Match card dimensions
   - Keep padding consistent

---

## Performance Tips

- Skeleton renders instantly (no API calls)
- Framer Motion animations are GPU-accelerated
- Images lazy load automatically
- Grid uses CSS Grid for optimal performance
- Staggered animations prevent layout shift

---

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers
- ✅ Tailwind CSS animations
- ✅ Framer Motion

---

## Troubleshooting

### Skeleton not showing
```tsx
// Make sure products is undefined during loading
const [products, setProducts] = useState<Product[]>(); // ✅ undefined
const [products, setProducts] = useState<Product[]>([]); // ❌ empty array
```

### Animation not working
```tsx
// Ensure Tailwind config has shimmer animation
// Check tailwind.config.ts for:
animation: {
  shimmer: "shimmer 2s infinite linear",
}
```

### Cards not matching
```tsx
// Both ProductCard and ProductSkeleton use:
// - minHeight: "420px"
// - rounded-3xl
// - p-5
// - Same grid layout
```

---

## Next Steps

1. ✅ Components created and ready to use
2. 🔄 Replace existing grid components with ProductGrid
3. 🔄 Test with real API data
4. 🔄 Add to your product pages
5. 🔄 Customize colors/spacing if needed

---

## Support

For issues or questions:
1. Check this guide
2. Review component props
3. Test with example code
4. Verify Tailwind config

---

**Created:** Modern skeleton loading UI with premium animations
**Status:** ✅ Ready to use
**Components:** 4 new components + updated 2 existing
**Documentation:** Complete with examples
