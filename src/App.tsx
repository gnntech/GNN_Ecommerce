import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmoothScroll from "./components/SmoothScroll";
import Index from "./pages/Index";
import Collection from "./pages/Collection";
import GemstoneDetail from "./pages/GemstoneDetail";
import TreeDetail from "./pages/TreeDetail";
import BraceletDetail from "./pages/BraceletDetail";
import Cart from "./pages/Cart";
import Bracelets from "./pages/Bracelets";
import Trees from "./pages/Trees";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageGemstones from "./pages/admin/ManageGemstones";
import ManageTrees from "./pages/admin/ManageTrees";
import ManageBracelets from "./pages/admin/ManageBracelets";
import ManageSlider from "./pages/admin/ManageSlider";
import ManageReviews from "./pages/admin/ManageReviews";
import ManageCollections from "./pages/admin/ManageCollections";
import ManageCraftsmanship from "./pages/admin/ManageCraftsmanship";
import ManageGallery from "./pages/admin/ManageGallery";
import ManageMarquee from "./pages/admin/ManageMarquee";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageProducts from "./pages/admin/ManageProducts";
import CreateProduct from "./pages/admin/CreateProduct";
import EditProduct from "./pages/admin/EditProduct";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import SearchResults from "./pages/SearchResults";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import Contact from "./pages/Contact";
import Testimonials from "./pages/Testimonials";
import SkeletonDemo from "./pages/SkeletonDemo";
import { AuthProvider } from "./context/AuthContext";
import About from "./components/About";
import { CartProvider } from "./context/CartContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <SmoothScroll />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/gemstone/:id" element={<GemstoneDetail />} />
              <Route path="/tree/:id" element={<TreeDetail />} />
              <Route path="/bracelet/:id" element={<BraceletDetail />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/bracelets" element={<Bracelets />} />
              <Route path="/trees" element={<Trees />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/skeleton-demo" element={<SkeletonDemo />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/gemstones" element={<ManageGemstones />} />
              <Route path="/admin/trees" element={<ManageTrees />} />
              <Route path="/admin/bracelets" element={<ManageBracelets />} />

              {/* Content Management Admin Routes */}
              <Route path="/admin/slider" element={<ManageSlider />} />
              <Route path="/admin/reviews" element={<ManageReviews />} />
              <Route
                path="/admin/collections"
                element={<ManageCollections />}
              />
              <Route
                path="/admin/craftsmanship"
                element={<ManageCraftsmanship />}
              />
              <Route path="/admin/gallery" element={<ManageGallery />} />
              <Route path="/admin/marquee" element={<ManageMarquee />} />
              <Route path="/admin/orders" element={<ManageOrders />} />
              <Route path="/admin/categories" element={<ManageCategories />} />
              <Route path="/admin/products" element={<ManageProducts />} />
              <Route path="/admin/products/create" element={<CreateProduct />} />
              <Route path="/admin/products/edit/:id" element={<EditProduct />} />
              <Route path="/about" element={<About />} />
              
              {/* Dynamic Category Route - must be before catch-all */}
              <Route path="/:slug" element={<CategoryPage />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
