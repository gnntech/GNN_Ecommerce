
import React, { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

interface Review {
    id: number;
    name: string;
    role: string;
    image: string; // Placeholder for the overlay image
    videoUrl: string; // YouTube embed URL
}

const CelebrityReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/content/reviews')
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(err => console.error("Failed to fetch reviews", err));
    }, []);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        slidesToScroll: 1,
        loop: true,
    });

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    // Track which video is playing (by ID)
    const [playingId, setPlayingId] = useState<number | null>(null);

    const updateScrollButtons = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", updateScrollButtons);
        emblaApi.on("reInit", updateScrollButtons);
        updateScrollButtons();
    }, [emblaApi, updateScrollButtons]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const handlePlay = (id: number) => {
        setPlayingId(id);
    };

    return (
        <section className="py-24 bg-[#EFE6D5]"> {/* Matches FeaturedCollection bg */}
            <div className="container mx-auto px-4 max-w-[1440px]">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-2 font-medium tracking-tight">
                        Celebrity Reviews
                    </h2>
                </div>

                <div className="relative px-8 lg:px-12">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex -ml-6 pb-12">
                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="pl-6 flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
                                >
                                    <div className="bg-transparent relative rounded-lg overflow-hidden group">
                                        {/* Video Container */}
                                        <div className="w-full h-[300px] md:h-[400px] bg-black relative shadow-lg">
                                            {playingId === review.id ? (
                                                <iframe
                                                    className="w-full h-full"
                                                    src={`${review.videoUrl}&autoplay=1`}
                                                    title={`Review by ${review.name}`}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            ) : (
                                                <div
                                                    className="w-full h-full relative cursor-pointer"
                                                    onClick={() => handlePlay(review.id)}
                                                >
                                                    <img
                                                        src={review.image}
                                                        alt={review.name}
                                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300"
                                                    />
                                                    {/* Overlay Text (Top Left) mimicking the screenshot */}
                                                    <div className="absolute top-4 left-4">
                                                        {/* Use a small icon or badge if needed */}
                                                    </div>

                                                    {/* Play Button */}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                                            <Play className="w-8 h-8 text-maroon ml-1 fill-maroon" />
                                                        </div>
                                                    </div>

                                                    {/* Name Overlay (Bottom Right) mimicking screenshot */}
                                                    <div className="absolute bottom-4 right-4 text-right">
                                                        <h3 className="text-white text-xl font-bold font-sans uppercase leading-tight drop-shadow-md">
                                                            {review.name.split(" ")[0]} <br />
                                                            {review.name.split(" ").slice(1).join(" ")}
                                                        </h3>
                                                        <p className="text-white/90 text-sm font-medium drop-shadow-md">
                                                            {review.role}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons for Carousel */}
                    <button
                        onClick={scrollPrev}
                        disabled={!canScrollPrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center transition-all bg-transparent hover:scale-110 text-gray-500 hover:text-maroon disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    <button
                        onClick={scrollNext}
                        disabled={!canScrollNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center transition-all bg-transparent hover:scale-110 text-gray-500 hover:text-maroon disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    {/* Pagination Dots (Optional visually, but adds to the look) */}
                    <div className="flex justify-center gap-2 mt-[-20px]">
                        {reviews.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === 0 ? 'bg-maroon' : 'bg-maroon/30'}`} // Simplified active state logic for visual only
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CelebrityReviews;
