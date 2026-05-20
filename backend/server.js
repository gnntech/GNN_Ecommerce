const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const { generalLimiter } = require("./middleware/rateLimitMiddleware");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Apply general rate limiting to all requests
app.use(generalLimiter);

// CORS Configuration - Allow all origins in production
app.use(cors({
    origin: true, // Reflects the request origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400 // 24 hours
}));

// Routes
app.get("/", (req, res) => {
    res.send("GNN E-commerce Backend is running");
});

// Health check endpoint - lightweight, no DB dependency
app.get("/api/ping", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is awake",
        timestamp: new Date().toISOString()
    });
});

// Import Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);

// Content Routes
const contentRoutes = require("./routes/contentRoutes");
app.use("/api/content", contentRoutes);

// Category Routes (drives Navbar dropdown dynamically)
const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes);

// Upload Routes
const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('=== BACKEND CODE VERSION: 2026-05-20-v2 ===');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('=== GLOBAL ERROR HANDLER ===');
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});
