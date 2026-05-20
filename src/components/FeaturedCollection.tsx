import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Gem, TreePalm, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import GemstoneCard from "@/components/GemstoneCard";
import TreeCard from "@/components/TreeCard";
import BraceletCard from "@/components/BraceletCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import { Gemstone } from "@/data/gemstones";
import { Tree, Bracelet } from "@/types/collection";

interface FeaturedCollectionProps {
    gemstones: Gemstone[];
    trees: Tree[];
    bracelets: Bracelet[];
    loading?: boolean;
}

type Tab = "gemstones" | "trees" | "bracelets";

const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({
    gemstones,
    trees,
    bracelets,
    loading = false,
}) => {
    const [activeTab, setActiveTab] = useState<Tab>("gemstones");
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        slidesToScroll: 1,
        loop: false,
    }, [Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })]);

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    // Update scroll buttons when carousel scroll or active tab changes
    const updateScrollButtons = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.reInit();
        emblaApi.on("select", updateScrollButtons);
        emblaApi.on("reInit", updateScrollButtons);
        updateScrollButtons();
    }, [emblaApi, updateScrollButtons, activeTab]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    // Tab Configuration
    const tabs = [
        { id: "gemstones", label: "Gemstones", icon: Gem },
        { id: "trees", label: "Trees", icon: TreePalm }, // Using TreePalm as proxy for Tree
        { id: "bracelets", label: "Bracelets", icon: Sparkles }, // Using Sparkles as proxy for Jewellery/Bracelet
    ];

    // Side Image based on Active Tab
    const getSideImage = () => {
        switch (activeTab) {
            case "gemstones":
                return "/images/section2-bg.png"; // Use a lifestyle shot if available, or hero-new
            // Note: Ideally we want a vertical lifestyle shot like the reference. 
            // Using existing placeholders for now.
            case "trees":
                return "/images/Trees.png";
            case "bracelets":
                return "/images/S-TigerEye Bracelet.png";
            default:
                return "/images/section2-bg.png";
        }
    };

    // Get current products
    const getCurrentProducts = () => {
        switch (activeTab) {
            case "gemstones":
                return gemstones;
            case "trees":
                return trees;
            case "bracelets":
                return bracelets;
            default:
                return [];
        }
    };

    // Render Card
    const renderCard = (item: any) => {
        switch (activeTab) {
            case "gemstones":
                return <GemstoneCard gemstone={item} index={0} />;
            case "trees":
                return <TreeCard tree={item} />;
            case "bracelets":
                return <BraceletCard bracelet={item} />;
            default:
                return null;
        }
    };

    // View All Link
    const getViewAllLink = () => {
        switch (activeTab) {
            case "gemstones":
                return "/collection";
            case "trees":
                return "/trees";
            case "bracelets":
                return "/bracelets";
            default:
                return "/products";
        }
    };

    const currentProducts = getCurrentProducts();

    return (
        <section className="bg-[#EFE6D5] py-8">
            <div className="max-w-[1440px] mx-auto px-4">

                {/* Header Section (Title & Tabs) */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-6 font-medium tracking-tight">
                        Find what's meant to be yours
                    </h2>

                    {/* Tabs */}
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as Tab)}
                                    className={`flex items-center gap-2 text-sm md:text-base font-medium transition-colors duration-300 pb-2 border-b-2 ${isActive
                                        ? "text-maroon border-maroon"
                                        : "text-gray-500 border-transparent hover:text-maroon"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Split: Image & Carousel */}
                <div className="flex flex-col lg:flex-row h-full items-stretch shadow-xl rounded-lg overflow-hidden bg-white">

                    {/* Left Side - Image */}
                    <div className="w-full lg:w-[25%] relative min-h-[300px] lg:min-h-auto">
                        <img
                            src={getSideImage()}
                            alt={`${activeTab} lifestyle`}
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                        />
                    </div>

                    {/* Right Side - Carousel */}
                    <div className="w-full lg:w-[75%] p-6 flex flex-col justify-center bg-[#FDFBF7]">
                        <div className="relative px-8">

                            {/* Skeleton placeholders while loading */}
                            {loading || currentProducts.length === 0 ? (
                                <div className="flex gap-4 overflow-hidden">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="flex-[0_0_85%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] min-w-0"
                                        >
                                            <ProductSkeleton />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-hidden p-4 -m-4" ref={emblaRef}>
                                        <div className="flex -ml-4">
                                            {currentProducts.map((product: any) => (
                                                <div
                                                    key={product._id || product.id}
                                                    className="pl-4 flex-[0_0_85%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_33.33%] min-w-0"
                                                >
                                                    {renderCard(product)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={scrollPrev}
                                        disabled={!canScrollPrev}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-maroon text-maroon flex items-center justify-center transition-all hover:bg-maroon hover:text-white disabled:opacity-30 disabled:cursor-not-allowed bg-white/80 backdrop-blur-sm"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={scrollNext}
                                        disabled={!canScrollNext}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-maroon text-maroon flex items-center justify-center transition-all hover:bg-maroon hover:text-white disabled:opacity-30 disabled:cursor-not-allowed bg-white/80 backdrop-blur-sm"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Section (View All) */}
                <div className="text-center mt-8">
                    <Link
                        to={getViewAllLink()}
                        className="bg-maroon text-white px-8 py-3 rounded-md text-sm font-semibold uppercase tracking-wider hover:bg-maroon/90 transition-colors inline-block"
                        style={{ backgroundColor: "#9B2533" }}
                    >
                        View All
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default FeaturedCollection;
