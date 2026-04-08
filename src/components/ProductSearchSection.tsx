import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductSearchSection = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState('All');
    const [intention, setIntention] = useState('');
    const [priceRange, setPriceRange] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (category && category !== 'Select Category' && category !== 'All') params.append('category', category);
        if (intention && intention !== 'Select Intention') params.append('query', intention);

        if (priceRange && priceRange !== 'Select Price') {
            if (priceRange === 'Below ₹5000') {
                params.append('maxPrice', '5000');
            } else if (priceRange === '₹5000 - ₹20000') {
                params.append('minPrice', '5000');
                params.append('maxPrice', '20000');
            } else if (priceRange === 'Above ₹20000') {
                params.append('minPrice', '20000');
            }
        }

        navigate(`/search?${params.toString()}`);
    };

    return (
        <section className="relative w-full py-16 md:py-28 bg-cover bg-center" style={{ backgroundImage: 'url("/images/section2-bg.webp")' }}>
            {/* Content Container */}
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex justify-end">

                    {/* Search Card */}
                    <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 w-full max-w-[500px]">
                        <h2
                            className="text-3xl md:text-4xl text-center text-[#1A1A1A] mb-8"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            Find the Right Product
                        </h2>

                        <form className="space-y-6" onSubmit={handleSearch}>
                            {/* Category */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#555] uppercase tracking-wide">Category</label>
                                <div className="relative">
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full p-4 pr-10 border border-gray-200 rounded-lg text-gray-500 appearance-none focus:outline-none focus:border-[#9B2533] transition-colors bg-white"
                                    >
                                        <option value="All">All Categories</option>
                                        <option value="Gemstones">Gemstones</option>
                                        <option value="Trees">Crystal Trees</option>
                                        <option value="Bracelets">Bracelets</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                </div>
                            </div>

                            {/* Intention (was Product Type) */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#555] uppercase tracking-wide">Intent / Benefit</label>
                                <div className="relative">
                                    <select
                                        value={intention}
                                        onChange={(e) => setIntention(e.target.value)}
                                        className="w-full p-4 pr-10 border border-gray-200 rounded-lg text-gray-500 appearance-none focus:outline-none focus:border-[#9B2533] transition-colors bg-white"
                                    >
                                        <option value="">Select Intention</option>
                                        <option value="Wealth">Wealth & Abundance</option>
                                        <option value="Love">Love & Relationships</option>
                                        <option value="Protection">Protection</option>
                                        <option value="Health">Health & Healing</option>
                                        <option value="Peace">Peace & Calm</option>
                                        <option value="Success">Career & Success</option>
                                        <option value="Confidence">Confidence</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#555] uppercase tracking-wide">Price Range</label>
                                <div className="relative">
                                    <select
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                        className="w-full p-4 pr-10 border border-gray-200 rounded-lg text-gray-500 appearance-none focus:outline-none focus:border-[#9B2533] transition-colors bg-white"
                                    >
                                        <option>Select Price</option>
                                        <option>Below ₹5000</option>
                                        <option>₹5000 - ₹20000</option>
                                        <option>Above ₹20000</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                </div>
                            </div>

                            {/* Search Button */}
                            <button
                                type="submit"
                                className="w-full bg-[#9B2533] text-white font-bold py-4 rounded-lg tracking-wider hover:bg-[#7a1c27] transition-colors mt-4"
                            >
                                SEARCH
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductSearchSection;
