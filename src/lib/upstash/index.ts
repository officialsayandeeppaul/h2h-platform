import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let redis: Redis | null = null;
let ratelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    analytics: true,
    prefix: 'h2h-ratelimit',
  });
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  if (!ratelimit) {
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }

  try {
    const result = await ratelimit.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }
}

export async function checkBookingRateLimit(userId: string): Promise<RateLimitResult> {
  if (!redis) {
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }

  const bookingLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    analytics: true,
    prefix: 'h2h-booking',
  });

  try {
    const result = await bookingLimiter.limit(userId);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    console.error('Booking rate limit error:', error);
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }
}

export async function checkApiRateLimit(ip: string): Promise<RateLimitResult> {
  if (!redis) {
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }

  const apiLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
    prefix: 'h2h-api',
  });

  try {
    const result = await apiLimiter.limit(ip);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    console.error('API rate limit error:', error);
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  
  try {
    return await redis.get<T>(key);
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

export async function cacheSet(
  key: string, 
  value: unknown, 
  expirationSeconds: number = 3600
): Promise<boolean> {
  if (!redis) return false;
  
  try {
    await redis.set(key, value, { ex: expirationSeconds });
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
}

export async function cacheDelete(key: string): Promise<boolean> {
  if (!redis) return false;
  
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
}

export { redis };
