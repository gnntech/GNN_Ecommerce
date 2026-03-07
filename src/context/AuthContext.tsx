import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface User {
    _id: string;
    username: string;
    isAdmin: boolean;
    token: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("adminUser");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const decoded: any = jwtDecode(parsedUser.token);

                // Check if token is expired (exp is in seconds, Date.now() in ms)
                if (decoded.exp * 1000 < Date.now()) {
                    sessionStorage.removeItem("adminUser");
                    setUser(null);
                } else {
                    setUser(parsedUser);
                }
            } catch (error) {
                // If decoding fails, invalid token
                sessionStorage.removeItem("adminUser");
                setUser(null);
            }
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User) => {
        sessionStorage.setItem("adminUser", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        sessionStorage.removeItem("adminUser");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
