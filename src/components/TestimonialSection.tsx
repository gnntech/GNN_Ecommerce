import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface Testimonial {
    _id: string;
    name: string;
    role: string;
    image: string;
    videoUrl: string;
    quote: string;
    location: string;
    isVideoTestimonial: boolean;
}

const TestimonialSection: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [currentVideo, setCurrentVideo] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        api.get('/content/reviews')
            .then(res => setTestimonials(res.data))
            .catch(err => console.error("Failed to fetch testimonials", err));
    }, []);

    const textTestimonials = testimonials.filter(t => !t.isVideoTestimonial) || [];
    const videoTestimonials = testimonials.filter(t => t.isVideoTestimonial) || [];

    // Auto-slide testimonial cards every 4 seconds
    useEffect(() => {
        if (textTestimonials.length === 0) return;
        const interval = setInterval(() => {
            setActiveCardIndex((prev) => (prev + 1) % textTestimonials.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [textTestimonials.length]);

    // Reset activeCardIndex if it's out of bounds
    useEffect(() => {
        if (textTestimonials.length > 0 && activeCardIndex >= textTestimonials.length) {
            setActiveCardIndex(0);
        }
    }, [textTestimonials.length, activeCardIndex]);

    const handlePrevVideo = () => {
        setCurrentVideo((prev) => (prev === 0 ? videoTestimonials.length - 1 : prev - 1));
        setIsPlaying(false);
    };

    const handleNextVideo = () => {
        setCurrentVideo((prev) => (prev === videoTestimonials.length - 1 ? 0 : prev + 1));
        setIsPlaying(false);
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Get visible cards (3 cards with middle one being active/maroon)
    const getVisibleCards = () => {
        if (textTestimonials.length === 0) return [];
        if (textTestimonials.length === 1) return [{ ...textTestimonials[0], position: 'center' }];
        if (textTestimonials.length === 2) {
            return [
                { ...textTestimonials[activeCardIndex], position: 'center' },
                { ...textTestimonials[(activeCardIndex + 1) % 2], position: 'right' }
            ];
        }
        const prevIndex = (activeCardIndex - 1 + textTestimonials.length) % textTestimonials.length;
        const nextIndex = (activeCardIndex + 1) % textTestimonials.length;
        return [
            { ...textTestimonials[prevIndex], position: 'left' },
            { ...textTestimonials[activeCardIndex], position: 'center' },
            { ...textTestimonials[nextIndex], position: 'right' },
        ];
    };

    const visibleCards = getVisibleCards();

    if (testimonials.length === 0) {
        return null;
    }

    return (
        <section
            className="pt-4 pb-12 sm:pb-16 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/Testimonial_bg.png)', backgroundColor: '#FDFCF6' }}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl p-6 sm:p-10 lg:p-14 shadow-xl border border-gray-100">
                    {/* Top Section - Title, Description & Video */}
                    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 mb-12 items-center">
                        {/* Left - Title & Description */}
                        <div className="lg:text-left">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bebas uppercase tracking-widest leading-loose text-gray-900">
                                <span className="block">Words from Those</span>
                                <span className="block">Who've Experienced</span>
                                <span className="block text-maroon">The Journey</span>
                            </h2>
                            <p
                                className="text-base sm:text-lg leading-relaxed text-gray-600 font-matter max-w-xl mx-auto lg:mx-0 mt-6"
                                style={{ lineHeight: '1.6' }}
                            >
                                Real experiences shared by clients who discovered clarity, balance, and renewed confidence
                                through thoughtful, supportive numerology guidance. These stories reflect meaningful journeys,
                                personal growth, and moments of insight.
                            </p>
                        </div>

                        {/* Right - Video Area */}
                        <div className="flex flex-col items-center lg:items-end">
                            {videoTestimonials.length > 0 && (
                                <>
                                    {/* Video Box */}
                                    <div
                                        className="relative rounded-xl overflow-hidden shadow-lg w-full max-w-[280px] sm:max-w-[340px] cursor-pointer group"
                                        style={{ aspectRatio: '1 / 1' }}
                                        onClick={togglePlay}
                                    >
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={currentVideo}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="w-full h-full"
                                            >
                                                {videoTestimonials[currentVideo].videoUrl.includes('youtube.com') ? (
                                                    <iframe
                                                        src={`${videoTestimonials[currentVideo].videoUrl}${videoTestimonials[currentVideo].videoUrl.includes('?') ? '&' : '?'}autoplay=${isPlaying ? 1 : 0}&mute=0`}
                                                        className="w-full h-full border-0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                ) : (
                                                    <video
                                                        ref={videoRef}
                                                        src={videoTestimonials[currentVideo].videoUrl}
                                                        className="w-full h-full object-cover"
                                                        loop
                                                        playsInline
                                                        muted={false}
                                                    />
                                                )}

                                                {!isPlaying && !videoTestimonials[currentVideo].videoUrl.includes('youtube.com') && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                        <motion.button
                                                            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/90 shadow-lg"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <svg className="w-5 h-5 ml-1 text-maroon" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M8 5v14l11-7z" />
                                                            </svg>
                                                        </motion.button>
                                                    </div>
                                                )}

                                                {/* Overlay with Name for Video */}
                                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                                                    <p className="text-white font-bold text-sm">{videoTestimonials[currentVideo].name}</p>
                                                    <p className="text-white/80 text-[10px]">{videoTestimonials[currentVideo].location}</p>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>

                                    {/* Video Navigation */}
                                    <div className="flex items-center justify-between w-full max-w-[280px] sm:max-w-[340px] mt-4">
                                        <button
                                            onClick={handlePrevVideo}
                                            className="w-8 h-8 rounded-full border-2 flex items-center justify-center hover:scale-105 transition-transform border-maroon text-maroon"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>

                                        <div className="flex gap-1">
                                            {videoTestimonials.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => { setCurrentVideo(index); setIsPlaying(false); }}
                                                    className={`h-1.5 rounded-full transition-all ${index === currentVideo ? 'w-4 bg-maroon' : 'w-1.5 bg-gray-300'}`}
                                                />
                                            ))}
                                        </div>

                                        <button
                                            onClick={handleNextVideo}
                                            className="w-8 h-8 rounded-full flex items-center justify-center hover:scale-105 transition-transform bg-maroon text-white"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Bottom - Auto-sliding Testimonial Cards */}
                    <div className="relative overflow-hidden pt-8">
                        {/* Mobile - Single Card */}
                        <div className="sm:hidden">
                            {textTestimonials.length > 0 && textTestimonials[activeCardIndex] && (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeCardIndex}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.4 }}
                                        className="rounded-xl p-6 flex flex-col shadow-lg mx-auto bg-maroon text-white"
                                        style={{ minHeight: '200px' }}
                                    >
                                        <div className="text-3xl font-serif mb-2 text-white/50">"</div>
                                        <p className="text-sm italic mb-4 leading-relaxed flex-1 font-matter">
                                            {textTestimonials[activeCardIndex].quote}
                                        </p>
                                        <div className="mt-auto border-t border-white/20 pt-3">
                                            <p className="font-bold text-sm font-matter">
                                                {textTestimonials[activeCardIndex].name}
                                            </p>
                                            <p className="text-xs text-white/70 font-matter">
                                                {textTestimonials[activeCardIndex].location}
                                            </p>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Desktop - 3 Cards */}
                        <div className="hidden sm:flex gap-4 justify-center items-stretch">
                            {visibleCards.length > 0 && (
                                <AnimatePresence mode="popLayout">
                                    {visibleCards.map((card) => {
                                        const isCenter = card.position === 'center';
                                        return (
                                            <motion.div
                                                key={`${card._id}-${card.position}`}
                                                layout
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: isCenter ? 1 : 0.9 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                                className={`flex-shrink-0 relative rounded-xl p-6 flex flex-col transition-all duration-500 ${isCenter ? 'z-10 shadow-2xl scale-100' : 'z-0 shadow-sm opacity-60 scale-90'
                                                    }`}
                                                style={{
                                                    width: 'calc(33.333% - 11px)',
                                                    minHeight: '220px',
                                                    background: isCenter ? '#9B2533' : '#FFFFFF',
                                                    color: isCenter ? '#FFFFFF' : '#2F2F2F',
                                                    border: isCenter ? 'none' : '1px solid #E5E7EB',
                                                }}
                                            >
                                                <div
                                                    className={`text-3xl font-serif mb-2 ${isCenter ? 'text-white/30' : 'text-maroon/30'}`}
                                                >
                                                    "
                                                </div>
                                                <p
                                                    className="text-sm italic mb-4 leading-relaxed flex-1 font-matter"
                                                >
                                                    {card.quote}
                                                </p>
                                                <div className={`mt-auto pt-3 border-t ${isCenter ? 'border-white/20' : 'border-gray-100'}`}>
                                                    <p className="font-bold text-sm font-matter">
                                                        {card.name}
                                                    </p>
                                                    <p className={`text-xs font-matter ${isCenter ? 'text-white/70' : 'text-gray-500'}`}>
                                                        {card.location}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Dots indicator */}
                        <div className="flex justify-center items-center gap-1.5 mt-8">
                            {textTestimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveCardIndex(index)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${index === activeCardIndex ? 'w-6 bg-maroon' : 'w-1.5 bg-gray-300'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;
