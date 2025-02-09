import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per window
    handler: (req, res) => {
        res.status(429).json({
            error: "Too many requests, please try again later."
        });
    },
    standardHeaders: 'draft-7', // draft-7: combined RateLimit header
    legacyHeaders: false // Disable X-RateLimit-* headers
});