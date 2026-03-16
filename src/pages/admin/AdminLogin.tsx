import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login, user } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        // Clear any existing session when landing on login page
        // or if user is already an admin, redirect them
        if (user && user.isAdmin) {
            navigate("/admin/dashboard");
        } else {
            // Ensure any stale session is cleared
            sessionStorage.removeItem("adminUser");
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post("/auth/login", {
                username,
                password,
            });
            login(data);
            toast.success("Login successful");
            navigate("/admin/dashboard");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Invalid credentials"
            );
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center pt-24 pb-12 px-4">
                <div className="max-w-md w-full space-y-8 glass-card p-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-bold text-foreground font-display">
                            Admin Login
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className="mb-4">
                                <input
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-border placeholder-muted-foreground text-foreground rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-secondary/50"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-border placeholder-muted-foreground text-foreground rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-secondary/50"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminLogin;
