import React from "react";
import { Link } from "react-router-dom";

interface GalleryItem {
    id: number;
    image: string;
    title: string;
    link: string;
}

const ImageGalleryScroll = () => {
    const [galleryItems, setGalleryItems] = React.useState<GalleryItem[]>([]);
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => {
        fetch('http://localhost:5000/api/content/gallery')
            .then(res => res.json())
            .then(data => setGalleryItems(data))
            .catch(err => console.error(err));
    }, []);

    // Duplicate items for seamless scrolling
    const scrollItems = [...galleryItems, ...galleryItems];

    if (galleryItems.length === 0) return null;

    return (
        <section className="py-12 bg-white overflow-hidden">
            <div
                className="relative w-full marquee-container"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                <div
                    className="flex w-max animate-scroll-left"
                    style={{ animationPlayState: isHovered ? 'paused' : 'running' }}
                >
                    {scrollItems.map((item, index) => (
                        <div
                            key={`${item.id || index}-${index}`}
                            className="relative w-[300px] h-[350px] mx-4 rounded-xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Overlay with Text */}
                            <Link
                                to={item.link}
                                className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]"
                            >
                                <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <span className="text-white text-lg font-serif font-medium tracking-wide border-b border-white/50 pb-1">
                                        {item.title}
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
        .marquee-container:hover .animate-scroll-left {
          animation-play-state: paused;
        }
      `}</style>
        </section>
    );
};

export default ImageGalleryScroll;
