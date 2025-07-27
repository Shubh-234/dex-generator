import cron from 'node-cron';
import { aggregateTokens } from './aggregator';
import redis from './rediConfig';
import { getIO } from './socketServer';

const CACHE_KEY = "aggregated_tokens";
const CACHE_TTL = 30; 

export default function startScheduler () {
    cron.schedule('*/30 * * * *', async () => {
        console.log("Refreshing aggregated tokens every 30 minutes");
        try {
            const tokens = await aggregateTokens();

            redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(tokens))
            .then( () => {
                console.log("Tokens cached in redis");
                const io = getIO();
                io.emit('tokens_updated', tokens);
            }).catch( (err) => {
                console.log("Error caching tokens in redis:", err);
            })

        } catch (error) {
            if(error instanceof Error) {
                console.error("Error during scheduled aggregation:", error.message);
            }
        }
        console.log("Scheduler ran at:", new Date().toLocaleTimeString());
    })
}