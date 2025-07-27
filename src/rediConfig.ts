const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (err: unknown) => {
  if(err instanceof Error){
    console.log("Redis error:", err.message);
  }
});

export default redis;