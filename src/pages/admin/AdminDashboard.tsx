import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import {
    Gem,
    Trees as TreeIcon,
    Watch,
    LayoutTemplate,
    Star,
    Library,
    Hammer,
    Image as GalleryIcon,
    Type,
    LogOut,
    Store,
    MonitorPlay,
    Sparkles
} from "lucide-react";

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate("/admin");
        }
    }, [user, navigate]);

    const categories = [
        {
            title: "Inventory & Shop",
            icon: <Store className="w-6 h-6 text-[#FACC15]" />,
            description: "Manage your physical products and inventory",
            items: [
                { name: "Gemstones", path: "/admin/gemstones", icon: <Gem className="w-5 h-5" />, desc: "Certified healing stones" },
                { name: "Crystal Trees", path: "/admin/trees", icon: <TreeIcon className="w-5 h-5" />, desc: "Energy & balance trees" },
                { name: "Bracelets", path: "/admin/bracelets", icon: <Watch className="w-5 h-5" />, desc: "Handcrafted wristwear" },
            ]
        },
        {
            title: "Website Appearance",
            icon: <MonitorPlay className="w-6 h-6 text-[#FACC15]" />,
            description: "Control visual elements and visual storytelling",
            items: [
                { name: "Hero Slider", path: "/admin/slider", icon: <LayoutTemplate className="w-5 h-5" />, desc: "Top banner images" },
                { name: "Image Gallery", path: "/admin/gallery", icon: <GalleryIcon className="w-5 h-5" />, desc: "Infinity scroll photos" },
                { name: "Top Marquee", path: "/admin/marquee", icon: <Type className="w-5 h-5" />, desc: "Scrolling announcement" },
            ]
        },
        {
            title: "Content & Sections",
            icon: <Sparkles className="w-6 h-6 text-[#FACC15]" />,
            description: "Edit informational and social proof sections",
            items: [
                { name: "Celebrity Reviews", path: "/admin/reviews", icon: <Star className="w-5 h-5" />, desc: "Client testimonials" },
                { name: "Collections", path: "/admin/collections", icon: <Library className="w-5 h-5" />, desc: "Section groupings" },
                { name: "Craftsmanship", path: "/admin/craftsmanship", icon: <Hammer className="w-5 h-5" />, desc: "Process & quality" },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#FDFCF6]">
            <Navbar />
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 font-display flex items-center gap-3">
                            Control Panel
                        </h1>
                        <p className="text-gray-500 mt-2 text-lg">
                            Welcome back. What would you like to update today?
                        </p>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-md hover:shadow-lg font-medium"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>

                {/* Categorized Grid */}
                <div className="space-y-16">
                    {categories.map((category, catIdx) => (
                        <div key={catIdx} className="space-y-6">
                            <div className="flex items-center gap-4 pb-2 border-b border-gray-200">
                                <div className="p-2 bg-red-50 rounded-lg">
                                    {category.icon}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                                    <p className="text-gray-500 text-sm">{category.description}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.items.map((item, itemIdx) => (
                                    <div
                                        key={itemIdx}
                                        onClick={() => navigate(item.path)}
                                        className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 border-l-4 border-l-transparent hover:border-l-red-600"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-gray-50 group-hover:bg-red-50 rounded-xl text-gray-600 group-hover:text-red-600 transition-colors">
                                                {item.icon}
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-2 h-2 border-t-2 border-r-2 border-gray-400 rotate-45 transform"></div>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                                        <p className="text-gray-500 text-sm">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
