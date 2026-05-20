const rateLimit = require('express-rate-limit');

// General API rate limiter - 500 requests per 15 minutes
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Increased limit for both dev and production
    message: {
        error: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Skip rate limiting for successful requests (optional)
    skipSuccessfulRequests: false,
    // Skip rate limiting for failed requests (optional)
    skipFailedRequests: false,
});

// Strict rate limiter for authentication endpoints - 5 requests per 15 minutes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: {
        error: 'Too many login attempts from this IP, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false, // Count successful logins
    skipFailedRequests: false, // Count failed logins
});

// Payment rate limiter - 10 requests per hour (more restrictive)
const paymentLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 payment requests per hour
    message: {
        error: 'Too many payment requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Order creation rate limiter - 20 requests per hour
const orderLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 order requests per hour
    message: {
        error: 'Too many order requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Upload rate limiter - 30 uploads per hour
const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 30, // Limit each IP to 30 uploads per hour
    message: {
        error: 'Too many upload requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Lenient rate limiter for public product browsing - 200 requests per 15 minutes
const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Higher limit for browsing products
    message: {
        error: 'Too many requests, please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
});

module.exports = {
    generalLimiter,
    authLimiter,
    paymentLimiter,
    orderLimiter,
    uploadLimiter,
    publicLimiter,
};
