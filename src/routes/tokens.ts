const express = require('express');
const router = express.Router();

const {aggregateTokens} = require('../aggregator.ts');

router.get('/token', async (req:any, res:any) => {
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

module.exports = router;

export {};


