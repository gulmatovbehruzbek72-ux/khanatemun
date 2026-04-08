import Redis from 'ioredis'

const REDIS_URL = process.env.REDIS_URL || '';

if (!REDIS_URL) {
  console.warn('REDIS_URL environment variable is missing. Data will not persist globally.');
}

// In Next.js, we want to reuse the connection in development
const globalForRedis = global as unknown as { redis: Redis };

export const redis = globalForRedis.redis || new Redis(REDIS_URL);

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

export const DATA_KEY = 'khanatemun_data_v1';
