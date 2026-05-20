# Skeleton Loading - Quick Reference Card

## 🚀 Quick Start (Copy & Paste)

### Option 1: Smart Grid (Recommended)
```tsx
import ProductGrid from "@/components/ProductGrid";

const [products, setProducts] = useState<Product[]>();

<ProductGrid products={products} productType="Bracelet" />
```

### Option 2: Manual Control
```tsx
import ProductGrid from "@/components/ProductGrid";

const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);

<ProductGrid 
  products={products} 
  loading={loading}
  productType="Bracelet"
  skeletonCount={8}
/>
```

### Option 3: Conditional Rendering
```tsx
import ProductSkeletonGrid from "@/components/ProductSkeletonGrid";

{loading ? (
  <ProductSkeletonGrid count={6} />
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
    {products.map(product => (
      <ProductCard key={product.id} product={product} productType="Bracelet" />
    ))}
  </div>
)}
```

---

## 📦 Components

| Component | Purpose | Import |
|-----------|---------|--------|
| `ProductGrid` | Smart grid with auto-loading | `@/components/ProductGrid` |
| `ProductCard` | Single product card | `@/components/ProductCard` |
| `ProductSkeleton` | Single skeleton card | `@/components/ProductSkeleton` |
| `ProductSkeletonGrid` | Grid of skeletons | `@/components/ProductSkeletonGrid` |

---

## 🎯 Props Cheat Sheet

### ProductGrid
```tsx
<ProductGrid 
  products={products}           // Product[] | undefined
  productType="Bracelet"        // "Bracelet" | "Gemstone" | "Tree" | "Product"
  loading={false}               // boolean (optional, auto-detect)
  skeletonCount={6}             // number (default: 6)
  className=""                  // string (optional)
  onProductClick={handleClick}  // (product: Product) => void (optional)
/>
```

### ProductCard
```tsx
<ProductCard 
  product={product}             // Product (required)
  productType="Bracelet"        // "Bracelet" | "Gemstone" | "Tree" | "Product"
  onOpenPreview={handlePreview} // (product: Product) => void (optional)
/>
```

### ProductSkeletonGrid
```tsx
<ProductSkeletonGrid 
  count={6}                     // number (default: 6)
  className=""                  // string (optional)
/>
```

---

## 🔧 Product Interface

```typescript
interface Product {
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

## 💡 Common Patterns

### Pattern 1: API Fetch
```tsx
const [products, setProducts] = useState<Product[]>();

useEffect(() => {
  axios.get("/api/products")
    .then(res => setProducts(res.data))
    .catch(() => setProducts([])); // Stop loading on error
}, []);

return <ProductGrid products={products} productType="Bracelet" />;
```

### Pattern 2: Search/Filter
```tsx
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(false);

const handleSearch = async (query: string) => {
  setLoading(true);
  const results = await searchProducts(query);
  setProducts(results);
  setLoading(false);
};

return <ProductGrid products={products} loading={loading} />;
```

### Pattern 3: Pagination
```tsx
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(false);

const loadMore = async () => {
  setLoading(true);
  const newProducts = await fetchPage(page);
  setProducts([...products, ...newProducts]);
  setLoading(false);
};

return (
  <>
    <ProductGrid products={products} loading={false} />
    {loading && <ProductSkeletonGrid count={4} />}
  </>
);
```

---

## 🎨 Customization

### Change Skeleton Count
```tsx
<ProductGrid skeletonCount={8} />
```

### Custom Grid Classes
```tsx
<ProductGrid className="gap-4 lg:gap-6" />
```

### Different Product Types
```tsx
<ProductGrid productType="Gemstone" />  // Gemstones
<ProductGrid productType="Tree" />      // Trees
<ProductGrid productType="Product" />   // Generic
```

---

## ⚡ Performance Tips

1. **Use undefined for initial state**
   ```tsx
   const [products, setProducts] = useState<Product[]>(); // ✅ Shows skeleton
   const [products, setProducts] = useState<Product[]>([]); // ❌ Shows empty
   ```

2. **Match skeleton count to expected products**
   ```tsx
   <ProductGrid skeletonCount={8} /> // If you expect ~8 products
   ```

3. **Stop loading on error**
   ```tsx
   .catch(() => setProducts([])); // Empty array stops skeleton
   ```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Skeleton not showing | Use `undefined` not `[]` for initial state |
| Animation not smooth | Check Tailwind config has `shimmer` animation |
| Cards don't match | Both use `minHeight: "420px"` and `rounded-3xl` |
| Images not loading | Check image paths and fallback handling |

---

## 📱 Responsive Grid

```
Mobile (< 640px):    1 column
Tablet (640px+):     2 columns
Desktop (1024px+):   3 columns
Large (1280px+):     4 columns
```

---

## 🎬 Demo Page

Test all patterns:
```tsx
import SkeletonDemo from "@/pages/SkeletonDemo";
```

Navigate to `/skeleton-demo` to see live examples.

---

## 📚 Full Documentation

See `SKELETON_LOADING_GUIDE.md` for:
- Detailed usage examples
- API integration
- Advanced patterns
- Animation details
- Best practices

---

## ✅ Checklist

- [ ] Import ProductGrid component
- [ ] Set products state to undefined initially
- [ ] Fetch products from API
- [ ] Set productType prop
- [ ] Test loading state
- [ ] Test with real data
- [ ] Verify responsive layout
- [ ] Check animations

---

## 🎯 One-Liner Solutions

**Show skeleton while loading:**
```tsx
<ProductGrid products={products} productType="Bracelet" />
```

**Manual loading control:**
```tsx
<ProductGrid products={products} loading={loading} />
```

**Just the skeleton:**
```tsx
<ProductSkeletonGrid count={6} />
```

**Just the card:**
```tsx
<ProductCard product={product} productType="Bracelet" />
```

---

**Need help?** Check `SKELETON_LOADING_GUIDE.md` for detailed examples.
