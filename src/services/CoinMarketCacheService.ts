import redisClient from '../configs/redis'
import { CoinGeckoService } from './external/CoinGeckoService'
import logger from '../utilities/logger'

const COIN_MARKET_CACHE_KEY = 'coins:markets'
const COIN_MARKET_CACHE_TTL_SECONDS = 60

const PER_PAGE = 250

export class CoinMarketCacheService {
  private static currentPage = 1
  private static isRunning = false

  private static async fetchMarketsPage(page: number) {
    return CoinGeckoService.getMarkets({
      vs_currency: 'usd',
      per_page: PER_PAGE,
      page
    })
  }

  private static async saveMarketsToCache(markets: any[]) {
    const existing = await redisClient.get(COIN_MARKET_CACHE_KEY)

    let merged: any[] = []

    if (existing) {
      try {
        merged = JSON.parse(existing)
      } catch {
        merged = []
      }
    }

    const map = new Map<string, any>()

    for (const coin of [...merged, ...markets]) {
      map.set(coin.id, coin)
    }

    const result = [...map.values()]

    await redisClient.set(
      COIN_MARKET_CACHE_KEY,
      JSON.stringify(result),
      'EX',
      COIN_MARKET_CACHE_TTL_SECONDS
    )
  }

  static async runScheduler(): Promise<void> {
    if (this.isRunning) {
      logger.warn('[CoinMarketSchedulerService] Scheduler skipped (already running)')
      return
    }

    this.isRunning = true

    try {
      const markets = await this.fetchMarketsPage(this.currentPage)

      await this.saveMarketsToCache(markets)

      logger.info(
        `[CoinMarketSchedulerService] Coin market synced page ${this.currentPage}`
      )

      this.currentPage++

      if (this.currentPage > 2) {
        this.currentPage = 1
      }
    } catch (error) {
      logger.error('[CoinMarketSchedulerService] Scheduler error', error)
    } finally {
      this.isRunning = false
    }
  }

  static async getCachedMarkets(): Promise<any[]> {
    const cached = await redisClient.get(COIN_MARKET_CACHE_KEY)

    if (!cached) return []

    try {
      return JSON.parse(cached)
    } catch {
      return []
    }
  }
}
