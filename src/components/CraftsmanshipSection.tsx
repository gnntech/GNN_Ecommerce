
import React, { useState, useEffect } from 'react';

const CraftsmanshipSection = () => {
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/content/sections/craftsmanship')
            .then(res => res.json())
            .then(data => setContent(data))
            .catch(err => console.error(err));
    }, []);

    if (!content) return null; // Or skeleton

    return (
        <section className="bg-[#FAF7F2] py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Column - Image/Video Placeholder */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="aspect-video w-full overflow-hidden shadow-2xl relative group rounded-lg">
                            <iframe
                                className="w-full h-full object-cover"
                                src={content.videoUrl}
                                title={content.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>

                    {/* Right Column - Text Content */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
                        <h2 className="text-3xl md:text-5xl font-serif text-gray-900 leading-tight font-medium tracking-tight">
                            {content.title}
                        </h2>

                        <p className="text-xl md:text-2xl font-serif italic text-gray-700" style={{ fontFamily: 'Georgia, serif' }}>
                            {content.subtitle}
                        </p>

                        <div className="w-16 h-[2px] bg-maroon/30 mx-auto lg:mx-0 my-6"></div>

                        <p className="text-gray-600 leading-relaxed text-base md:text-lg max-w-xl mx-auto lg:mx-0">
                            {content.description}
                        </p>

                        {/* Optional CTA matching the style */}
                        <div className="pt-4">
                            <button className="text-maroon border-b border-maroon pb-1 hover:text-maroon/80 transition-colors text-sm uppercase tracking-widest font-semibold cursor-pointer">
                                {content.ctaText}
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default CraftsmanshipSection;
