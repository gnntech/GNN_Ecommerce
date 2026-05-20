import { useState, useEffect } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import ProductSearchSection from "@/components/ProductSearchSection";
import Footer from "@/components/Footer";
import CollectionCard from "@/components/CollectionCard";
import ImageGalleryScroll from "@/components/ImageGalleryScroll";
import { Gemstone } from "@/types/collection";
import { Tree, Bracelet } from "@/types/collection";
import CraftsmanshipSection from "@/components/CraftsmanshipSection";
import CelebrityReviews from "@/components/CelebrityReviews";

const Index = () => {
  const [gemstones, setGemstones] = useState<Gemstone[]>([]);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [bracelets, setBracelets] = useState<Bracelet[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    api.get('/content/collections')
      .then(res => setCollections(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setProductsLoading(true);
      try {
        const [gemstonesRes, treesRes, braceletsRes] = await Promise.all([
          api.get("/products/gemstones?all=true"),
          api.get("/products/trees?all=true"),
          api.get("/products/bracelets?all=true"),
        ]);
        setGemstones(gemstonesRes.data);
        setTrees(treesRes.data);
        setBracelets(braceletsRes.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSlider />
      <ProductSearchSection />

      {/* ====== Explore Collections Section ====== */}
      <section className="py-10 px-2 sm:px-4 md:px-6 lg:px-8 bg-cream/30">
        <div className="max-w-7xl mx-auto text-center mb-8 sm:mb-12">
          <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-3 sm:mb-4 font-medium tracking-tight">
            Explore Our Collections
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Discover our range of gemstones, bracelets, and spiritual trees.
          </p>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8 max-w-7xl mx-auto">
          {collections.map((col: any, index) => (
            <CollectionCard
              key={index}
              title={col.title}
              image={col.image}
              description={col.description}
              link={col.link}
            />
          ))}
        </div>
      </section>



      {/* ====== Craftsmanship Section ====== */}
      <CraftsmanshipSection />

      {/* ====== Celebrity Reviews Section ====== */}
      <CelebrityReviews />

      {/* ====== Infinity Scroll Image Gallery ====== */}
      <ImageGalleryScroll />

      <Footer />
    </div>
  );
};

export default Index;
