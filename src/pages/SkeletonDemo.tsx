import { useState, useEffect } from "react";
import ProductGrid from "@/components/ProductGrid";
import ProductSkeletonGrid from "@/components/ProductSkeletonGrid";
import ProductCard, { Product } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

/**
 * Skeleton Loading Demo Page
 * 
 * This page demonstrates all skeleton loading patterns:
 * 1. Auto-loading detection
 * 2. Manual loading state
 * 3. Skeleton grid only
 * 4. Individual product cards
 * 
 * Use this as a reference for implementing skeleton loading
 * in your actual product pages.
 */

// Mock product data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Amazonite Bracelet",
    price: "₹2,499",
    image: "/images/S-Amazonite Bracelet.webp",
    description: "Calming energy stone for emotional balance and communication",
    type: "Bracelet"
  },
  {
    id: "2",
    name: "Rose Quartz Bracelet",
    price: "₹2,299",
    image: "/images/S-Rose Quartz Bracelet.webp",
    description: "Stone of unconditional love and infinite peace",
    type: "Bracelet"
  },
  {
    id: "3",
    name: "Amethyst Bracelet",
    price: "₹2,799",
    image: "/images/S-Amethyst Bracelet.webp",
    description: "Powerful protective stone with high spiritual vibration",
    type: "Bracelet"
  },
  {
    id: "4",
    name: "Tiger Eye Bracelet",
    price: "₹2,599",
    image: "/images/S-Tiger Eye Bracelet.webp",
    description: "Stone of protection, grounding, and personal power",
    type: "Bracelet"
  },
  {
    id: "5",
    name: "Black Tourmaline Bracelet",
    price: "₹2,899",
    image: "/images/S-Black Tourmaline Bracelet.webp",
    description: "Powerful protection stone against negative energy",
    type: "Bracelet"
  },
  {
    id: "6",
    name: "Citrine Bracelet",
    price: "₹2,699",
    image: "/images/S-Citrine Bracelet.webp",
    description: "Stone of abundance, manifestation, and prosperity",
    type: "Bracelet"
  },
];

const SkeletonDemo = () => {
  // Demo 1: Auto-loading detection
  const [autoProducts, setAutoProducts] = useState<Product[]>();

  // Demo 2: Manual loading state
  const [manualProducts, setManualProducts] = useState<Product[]>([]);
  const [manualLoading, setManualLoading] = useState(false);

  // Demo 3: Skeleton only
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Simulate API call for auto-loading demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setAutoProducts(mockProducts);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Manual load function
  const handleManualLoad = () => {
    setManualLoading(true);
    setManualProducts([]);

    setTimeout(() => {
      setManualProducts(mockProducts);
      setManualLoading(false);
    }, 2000);
  };

  // Toggle skeleton
  const toggleSkeleton = () => {
    setShowSkeleton(!showSkeleton);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Skeleton Loading Demo
          </h1>
          <p className="text-gray-600">
            Modern skeleton loading UI for e-commerce products
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16">
        
        {/* Demo 1: Auto-Loading Detection */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              1. Auto-Loading Detection
            </h2>
            <p className="text-gray-600 mb-4">
              Skeleton shows automatically when products is undefined. 
              Products load after 3 seconds.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <code className="text-sm text-blue-900">
                const [products, setProducts] = useState&lt;Product[]&gt;(); // undefined = loading
              </code>
            </div>
          </div>

          <ProductGrid 
            products={autoProducts}
            productType="Bracelet"
            skeletonCount={6}
          />
        </section>

        {/* Demo 2: Manual Loading State */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              2. Manual Loading State
            </h2>
            <p className="text-gray-600 mb-4">
              Explicit loading state control with button trigger.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <code className="text-sm text-blue-900">
                &lt;ProductGrid products=&#123;products&#125; loading=&#123;loading&#125; /&gt;
              </code>
            </div>
            <Button 
              onClick={handleManualLoad}
              disabled={manualLoading}
              className="bg-[#9B2533] hover:bg-[#7a1d28]"
            >
              {manualLoading ? "Loading..." : "Load Products"}
            </Button>
          </div>

          <ProductGrid 
            products={manualProducts}
            loading={manualLoading}
            productType="Bracelet"
            skeletonCount={6}
          />
        </section>

        {/* Demo 3: Skeleton Grid Only */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              3. Skeleton Grid Only
            </h2>
            <p className="text-gray-600 mb-4">
              Direct skeleton grid component for custom implementations.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <code className="text-sm text-blue-900">
                &#123;loading ? &lt;ProductSkeletonGrid count=&#123;6&#125; /&gt; : &lt;Products /&gt;&#125;
              </code>
            </div>
            <Button 
              onClick={toggleSkeleton}
              variant="outline"
              className="border-[#9B2533] text-[#9B2533] hover:bg-[#9B2533] hover:text-white"
            >
              {showSkeleton ? "Hide Skeleton" : "Show Skeleton"}
            </Button>
          </div>

          {showSkeleton && <ProductSkeletonGrid count={6} />}
        </section>

        {/* Demo 4: Individual Product Cards */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              4. Individual Product Cards
            </h2>
            <p className="text-gray-600 mb-4">
              Reusable ProductCard component with hover animations.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <code className="text-sm text-blue-900">
                &lt;ProductCard product=&#123;product&#125; productType="Bracelet" /&gt;
              </code>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {mockProducts.slice(0, 4).map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                productType="Bracelet"
              />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gradient-to-r from-[#9B2533] to-[#7a1d28] rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">✨ Premium Animations</h3>
              <p className="text-white/90">Smooth shimmer effect and staggered fade-in</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">📱 Responsive Design</h3>
              <p className="text-white/90">1/2/3/4 column layout based on screen size</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">🎯 Exact Match</h3>
              <p className="text-white/90">Skeleton matches product card layout perfectly</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">🔄 Auto-Detection</h3>
              <p className="text-white/90">Smart loading state detection</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">🛒 Cart Integration</h3>
              <p className="text-white/90">Add to cart and buy now functionality</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">⚡ Performance</h3>
              <p className="text-white/90">GPU-accelerated animations</p>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Quick Start Code
          </h2>
          
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-6 text-white overflow-x-auto">
              <p className="text-gray-400 mb-2">// Basic Usage</p>
              <pre className="text-sm">
{`import ProductGrid from "@/components/ProductGrid";

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>();

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <ProductGrid 
      products={products}
      productType="Bracelet"
    />
  );
}`}
              </pre>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 text-white overflow-x-auto">
              <p className="text-gray-400 mb-2">// With Loading State</p>
              <pre className="text-sm">
{`import ProductGrid from "@/components/ProductGrid";

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
}`}
              </pre>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default SkeletonDemo;
