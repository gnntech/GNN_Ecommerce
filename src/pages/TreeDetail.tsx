import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Shield, Users, TreeDeciduous } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface TreeProduct {
    _id: string;
    name: string;
    shortDescription?: string;
    meaning?: string;
    numerology?: string;
    image: string;
    price?: string;
    buyLink?: string;
    benefits?: string[];
    whoShouldWear?: string[];
    careInstructions?: string[];
}

const TreeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [tree, setTree] = useState<TreeProduct | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTree = async () => {
            try {
                const { data } = await api.get(`/products/trees/${id}`);
                setTree(data);
            } catch (error) {
                console.error("Failed to fetch tree", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTree();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!tree) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="font-display text-4xl text-foreground mb-4">
                        Tree Not Found
                    </h1>
                    <Link to="/trees" className="text-primary hover:underline">
                        Return to Collection
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Back button */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        onClick={() => navigate("/trees")}
                        className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 mb-8"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                        <span className="text-sm font-medium">Back to Trees</span>
                    </motion.button>

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                        {/* Left Column: Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative sticky top-32"
                        >
                            <div className="glass-card p-4 overflow-hidden transition-all duration-500 hover:shadow-xl">
                                <div className="aspect-[4/3] rounded-xl overflow-hidden">
                                    <img
                                        src={tree.image || "/images/Trees.webp"}
                                        alt={tree.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/images/Trees.webp";
                                        }}
                                    />
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
                        </motion.div>

                        {/* Right Column: Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-8"
                        >
                            {/* Branding / Tags */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium tracking-wider text-primary uppercase">
                                    Natural Crystal Tree
                                </span>
                                <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-foreground">
                                    Premium
                                </span>
                            </div>

                            {/* Title & Description */}
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                    {tree.name}
                                </h1>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    {tree.meaning || tree.shortDescription}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="border-t border-b border-border py-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-foreground">
                                        {tree.price}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        (Inclusive of all taxes)
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate("/checkout", { state: { product: tree, type: 'Tree' } })}
                                    className="flex-1 px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium text-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform active:scale-[0.98]"
                                >
                                    Buy Now
                                </button>
                                <button
                                    onClick={() => {
                                        if (!tree) return;
                                        const price = Number(tree.price?.toString().replace(/[^0-9]/g, '') || 0);
                                        addToCart({
                                            id: tree._id || tree.name, // Fallback to name if id is missing in specific case
                                            name: tree.name,
                                            image: tree.image,
                                            price: price,
                                            type: 'Tree',
                                            qty: 1
                                        });
                                        toast.success("Added to cart");
                                    }}
                                    className="flex-1 px-8 py-4 rounded-full bg-secondary border border-border text-foreground font-medium text-lg hover:bg-muted transition-all duration-300 transform active:scale-[0.98]"
                                >
                                    Add to Cart
                                </button>
                            </div>

                            {/* Standardized Product Details Grid */}
                            <div className="bg-secondary/30 rounded-2xl p-6 backdrop-blur-sm border border-border/50">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    Product Specifications
                                </h3>
                                <div className="grid grid-cols-1 gap-y-4">
                                    {/* NUMEROLOGY */}
                                    <div className="grid grid-cols-3 gap-4 items-center border-b border-border/50 pb-3 last:border-0 last:pb-0">
                                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                            Numerology
                                        </span>
                                        <span className="col-span-2 font-medium text-foreground">
                                            {tree.numerology || "N/A"}
                                        </span>
                                    </div>
                                    {/* Base */}
                                    <div className="grid grid-cols-3 gap-4 items-center border-b border-border/50 pb-3 last:border-0 last:pb-0">
                                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                            Base
                                        </span>
                                        <span className="col-span-2 font-medium text-foreground">
                                            Natural Wood/Stone
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-4 pt-4">
                                <div className="text-center p-3 rounded-xl bg-secondary/20">
                                    <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                                    <span className="text-xs font-medium block">Certified Authentic</span>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-secondary/20">
                                    <TreeDeciduous className="w-6 h-6 text-primary mx-auto mb-2" />
                                    <span className="text-xs font-medium block">Natural Materials</span>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-secondary/20">
                                    <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
                                    <span className="text-xs font-medium block">Handcrafted</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Details Sections */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Benefits */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="glass-card p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 rounded-lg bg-primary/10">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">
                                    Benefits
                                </h3>
                            </div>
                            <ul className="space-y-3">
                                {tree.benefits?.map((benefit, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-3 text-foreground text-base leading-relaxed"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                                        {benefit}
                                    </li>
                                )) || (
                                        <li className="text-muted-foreground italic">No specific benefits listed.</li>
                                    )}
                            </ul>
                        </motion.div>

                        {/* Who Should Wear */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="glass-card p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 rounded-lg bg-primary/10">
                                    <Users className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">
                                    Who Should Wear
                                </h3>
                            </div>
                            <ul className="space-y-3">
                                {tree.whoShouldWear?.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-3 text-foreground text-base leading-relaxed"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                                        {item}
                                    </li>
                                )) || (
                                        <li className="text-muted-foreground italic">No specific recommendations listed.</li>
                                    )}
                            </ul>
                        </motion.div>

                        {/* Care Instructions */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="glass-card p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 rounded-lg bg-primary/10">
                                    <Shield className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">
                                    Care Instructions
                                </h3>
                            </div>
                            <ul className="space-y-3">
                                {tree.careInstructions?.map((instruction, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-3 text-foreground text-base leading-relaxed"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                                        {instruction}
                                    </li>
                                )) || (
                                        <li className="text-muted-foreground italic">Handle with care. Avoid direct sunlight for prolonged periods.</li>
                                    )}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default TreeDetail;
