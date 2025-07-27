import express from 'express';
import { aggregateTokens } from '../aggregator';

const router = express.Router();


router.get('/tokens', async (req:any, res:any) => {
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


