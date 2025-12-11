import { Redis } from 'ioredis';

export const redisConnection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redisConnection.on('error', (error) => {
  console.error('Redis connection error:', error);
});

redisConnection.on('connect', () => {
  console.log('✅ Redis connected');
});

