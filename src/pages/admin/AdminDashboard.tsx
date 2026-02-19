import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate("/admin");
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground font-display">
                        Admin Dashboard
                    </h1>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-secondary text-foreground rounded-md hover:bg-muted transition-colors"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div onClick={() => navigate("/admin/gemstones")} className="glass-card p-6 cursor-pointer hover:shadow-lg transition-all">
                        <h3 className="text-xl font-bold mb-2">Manage Gemstones</h3>
                        <p className="text-muted-foreground">Add, edit, or delete gemstones.</p>
                    </div>
                    <div onClick={() => navigate("/admin/trees")} className="glass-card p-6 cursor-pointer hover:shadow-lg transition-all">
                        <h3 className="text-xl font-bold mb-2">Manage Trees</h3>
                        <p className="text-muted-foreground">Add, edit, or delete crystal trees.</p>
                    </div>
                    <div onClick={() => navigate("/admin/bracelets")} className="glass-card p-6 cursor-pointer hover:shadow-lg transition-all">
                        <h3 className="text-xl font-bold mb-2">Manage Bracelets</h3>
                        <p className="text-muted-foreground">Add, edit, or delete bracelets.</p>
                    </div>

                    {/* New Content Management Links */}
                    <div onClick={() => navigate("/admin/slider")} className="glass-card p-6 cursor-pointer hover:shadow-lg transition-all bg-blue-50/50">
                        <h3 className="text-xl font-bold mb-2">Manage Slider</h3>
                        <p className="text-muted-foreground">Update homepage hero slider.</p>
                    </div>
                    <div onClick={() => navigate("/admin/reviews")} className="glass-card p-6 cursor-pointer hover:shadow-lg transition-all bg-blue-50/50">
                        <h3 className="text-xl font-bold mb-2">Manage Reviews</h3>
                        <p className="text-muted-foreground">Update celebrity reviews & videos.</p>
                    </div>
                    <div onClick={() => navigate("/admin/collections")} className="glass-card p-6 cursor-pointer hover:shadow-lg transition-all bg-blue-50/50">
                        <h3 className="text-xl font-bold mb-2">Manage Collections</h3>
                        <p className="text-muted-foreground">Edit "Explore Our Collections".</p>
                    </div>
                    <div onClick={() => navigate("/admin/craftsmanship")} className="glass-card p-6 cursor-pointer hover:shadow-lg transition-all bg-blue-50/50">
                        <h3 className="text-xl font-bold mb-2">Manage Craftsmanship</h3>
                        <p className="text-muted-foreground">Edit craftsmanship section content.</p>
                    </div>
                    <div onClick={() => navigate("/admin/gallery")} className="glass-card p-6 cursor-pointer hover:shadow-lg transition-all bg-blue-50/50">
                        <h3 className="text-xl font-bold mb-2">Manage Gallery</h3>
                        <p className="text-muted-foreground">Edit infinity scroll image gallery.</p>
                    </div>
                    <div onClick={() => navigate("/admin/marquee")} className="glass-card p-6 cursor-pointer hover:shadow-lg transition-all bg-blue-50/50">
                        <h3 className="text-xl font-bold mb-2">Manage Marquee</h3>
                        <p className="text-muted-foreground">Edit top scrolling text.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
