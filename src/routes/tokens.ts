import express from 'express';
import { aggregateTokens } from '../aggregator';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const rateLimiter = rateLimit({
    windowMs: 60 * 1000 *30,
    max: 10, 
    message: {
        success: false,
        message: "Too many requests, please try again later."
    }
})


router.get('/tokens',rateLimiter, async (req:any, res:any) => {
    try {
        const tokens = await aggregateTokens();
        return res.status(200).json({
            success: true,
            data: tokens
        })
    } catch (error) {
        console.error("Error aggregating tokens:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
})

export default router;


