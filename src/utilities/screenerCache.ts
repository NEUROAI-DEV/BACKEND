import redisClient from '../configs/redis'

export const SCREENER_LIST_CACHE_PREFIX = 'screener:list'

/**
 * Delete all Redis keys for a user's screener list cache.
 * Call this after create or remove screener so findAllScreener returns fresh data.
 */
export async function invalidateScreenerCacheForUser(userId: number): Promise<void> {
  const pattern = `${SCREENER_LIST_CACHE_PREFIX}:${userId}:*`
  const keys = await redisClient.keys(pattern)
  if (keys.length > 0) {
    await redisClient.del(...keys)
  }
}
