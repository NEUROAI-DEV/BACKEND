import {
  IWatchListAttributes,
  IWatchListCreationAttributes,
  WatchListModel
} from '../models/watchListModel'
import redisClient from '../configs/redis'
import { AppError } from '../utilities/errorHandler'
import { CoinMarketCacheService } from './CoinMarketCacheService'
import type { ICoinGeckoMarketItem } from './external/CoinGeckoService'

const WATCHLIST_CACHE_PREFIX = 'watchlist'
const WATCHLIST_CACHE_TTL_SECONDS = 60

export type GetWatchListParams = {
  watchListUserId: number
  vs_currency?: string
}

export class WatchListService {
  private static cacheKey(userId: number, vsCurrency: string): string {
    return `${WATCHLIST_CACHE_PREFIX}:${userId}:${vsCurrency}`
  }

  private static async invalidateCacheForUser(watchListUserId: number): Promise<void> {
    const pattern = `${WATCHLIST_CACHE_PREFIX}:${watchListUserId}:*`
    const keys = await redisClient.keys(pattern)
    if (keys.length > 0) {
      await redisClient.del(...keys)
    }
  }

  /**
   * Get watchlist coin data for a user. IDs are read from DB (watchlist record for watchListUserId).
   * Result is cached in Redis; cache is invalidated on create/update for that user.
   */
  static async getWatchList(params: GetWatchListParams): Promise<ICoinGeckoMarketItem[]> {
    const { watchListUserId, vs_currency = 'usd' } = params
    const key = WatchListService.cacheKey(watchListUserId, vs_currency)
    const cached = await redisClient.get(key)
    if (cached != null) {
      try {
        return JSON.parse(cached) as ICoinGeckoMarketItem[]
      } catch {
        await redisClient.del(key)
      }
    }

    const row = await WatchListModel.findOne({
      where: { watchListUserId },
      order: [['watchListId', 'DESC']],
      attributes: ['watchListCoinIds']
    })
    if (row == null || !row.watchListCoinIds?.trim()) {
      const empty: ICoinGeckoMarketItem[] = []
      await redisClient.set(key, JSON.stringify(empty), 'EX', WATCHLIST_CACHE_TTL_SECONDS)
      return empty
    }

    const rawIds = row.watchListCoinIds
    const ids = rawIds
      .split(',')
      .map((id) => id.trim().toLowerCase())
      .filter(Boolean)

    if (ids.length === 0) {
      const empty: ICoinGeckoMarketItem[] = []
      await redisClient.set(key, JSON.stringify(empty), 'EX', WATCHLIST_CACHE_TTL_SECONDS)
      return empty
    }

    const markets =
      (await CoinMarketCacheService.getCachedMarkets()) as ICoinGeckoMarketItem[]

    if (markets.length === 0) {
      const empty: ICoinGeckoMarketItem[] = []
      await redisClient.set(key, JSON.stringify(empty), 'EX', WATCHLIST_CACHE_TTL_SECONDS)
      return empty
    }

    const marketMap = new Map<string, ICoinGeckoMarketItem>()
    for (const coin of markets) {
      if (coin.id) {
        marketMap.set(String(coin.id).toLowerCase(), coin)
      }
    }

    const items: ICoinGeckoMarketItem[] = []
    for (const id of ids) {
      const coin = marketMap.get(id)
      if (coin) {
        items.push(coin)
      }
    }

    await redisClient.set(key, JSON.stringify(items), 'EX', WATCHLIST_CACHE_TTL_SECONDS)
    return items
  }

  static normalizeUniqueCoinIds(watchListCoinIds: string): string {
    let ids: string[]
    const trimmed = String(watchListCoinIds ?? '').trim()
    if (!trimmed) return ''
    try {
      const parsed = JSON.parse(trimmed)
      ids = Array.isArray(parsed)
        ? parsed.map((id: unknown) => String(id).trim()).filter(Boolean)
        : [trimmed]
    } catch {
      ids = trimmed
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
    }
    const unique = [...new Set(ids)]
    return unique.join(',')
  }

  /**
   * Create or update watchlist for user. If watchListUserId already has a record, merge and update; otherwise create.
   */
  static async createWatchList(
    params: IWatchListCreationAttributes
  ): Promise<IWatchListAttributes> {
    const { watchListUserId, watchListCoinIds } = params

    const existing = await WatchListModel.findOne({
      where: { watchListUserId }
    })

    const merged = existing?.watchListCoinIds?.trim()
      ? [existing.watchListCoinIds.trim(), watchListCoinIds].join(',')
      : watchListCoinIds
    const uniqueCoinIds = WatchListService.normalizeUniqueCoinIds(merged)

    if (existing != null) {
      await existing.update({ watchListCoinIds: uniqueCoinIds })
      await existing.reload()
      await WatchListService.invalidateCacheForUser(watchListUserId)
      return existing.get({ plain: true }) as IWatchListAttributes
    }

    const newWatchList = await WatchListModel.create({
      watchListUserId,
      watchListCoinIds: uniqueCoinIds
    })
    await WatchListService.invalidateCacheForUser(watchListUserId)
    return newWatchList
  }

  static async removeWatchList(
    watchListUserId: number,
    watchListCoinId: string
  ): Promise<void> {
    const watchList = await WatchListModel.findOne({
      where: { watchListUserId }
    })
    if (watchList == null) {
      throw AppError.notFound(`Watchlist not found with ID: ${watchListCoinId}`)
    }
    const watchListCoinIds = watchList.watchListCoinIds.split(',')
    const newWatchListCoinIds = watchListCoinIds.filter((id) => id !== watchListCoinId)
    await watchList.update({ watchListCoinIds: newWatchListCoinIds.join(',') })
    await WatchListService.invalidateCacheForUser(watchList.watchListUserId)
  }

  /**
   * Ensures all stored watchListCoinIds in the database are unique (no duplicate coin id per row).
   * Updates rows where the stored value differs from the normalized unique value.
   * Call once to fix existing data or run periodically.
   */
  static async ensureStoredCoinIdsUnique(): Promise<{ updated: number }> {
    const rows = await WatchListModel.findAll({
      attributes: ['watchListId', 'watchListCoinIds']
    })
    let updated = 0
    for (const row of rows) {
      const normalized = WatchListService.normalizeUniqueCoinIds(row.watchListCoinIds)
      if (normalized !== row.watchListCoinIds) {
        await WatchListModel.update(
          { watchListCoinIds: normalized },
          { where: { watchListId: row.watchListId } }
        )
        updated += 1
      }
    }
    return { updated }
  }
}
