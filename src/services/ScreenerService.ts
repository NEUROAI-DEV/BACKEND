import redisClient from '../configs/redis'
import { CoinGeckoService, ICoinGeckoMarketsParams } from './external/CoinGeckoService'

export type ScreenerCategory = 'losers' | 'gainers' | 'markets' | 'trending'

export type GetByCategoryParams = {
  category: ScreenerCategory
  page?: number
  size?: number
  minVolume?: number
  minLiquidity?: number
  vs_currency?: string
  order?: ICoinGeckoMarketsParams['order']
  search?: string
}

export type IGainerOrLosers = {
  vs_currency?: string
  direction?: 'gainers' | 'losers'
  size?: number
  page?: number
  minVolume?: number
  minLiquidity?: number
  price_change_percentage?: '1h' | '24h' | '7d' | '14d' | '30d'
}

export class ScreenerService {
  private static readonly CACHE_TTL_SECONDS = 60 // 1 minute

  static async getGainersOrLosers(params: IGainerOrLosers = {}) {
    const {
      direction = 'gainers',
      size = 10,
      page = 1,
      minVolume = 0,
      minLiquidity = 0
    } = params

    /**
     * Redis key
     */
    const cacheKey = direction === 'gainers' ? 'coins:gainers' : 'coins:losers'

    const cached = await redisClient.get(cacheKey)

    if (!cached) {
      return {
        totalItems: 0,
        items: []
      }
    }

    /**
     * Parse cached data
     */
    let items: any[] = JSON.parse(cached)

    /**
     * Filter volume & liquidity
     */
    items = items.filter((coin) => {
      const volume = coin.total_volume ?? 0
      const liquidity = coin.market_cap ?? 0

      return volume >= minVolume && liquidity >= minLiquidity
    })

    /**
     * Manual pagination
     */
    const totalItems = items.length
    const start = (page - 1) * size
    const paginated = items.slice(start, start + size)

    return {
      totalItems,
      items: paginated
    }
  }

  static async getTrendingCoins() {
    const cacheKey = 'screener:trending'
    const cached = await redisClient.get(cacheKey)
    if (cached) {
      const parsed = JSON.parse(cached) as { totalItems: number; items: unknown[] }
      return parsed
    }

    const result = await CoinGeckoService.getTrendingCoins()
    const data = {
      totalItems: result.length,
      items: result
    }
    await redisClient.set(cacheKey, JSON.stringify(data), 'EX', this.CACHE_TTL_SECONDS)
    return data
  }

  static async getCoinMarkets(params: ICoinGeckoMarketsParams = {}) {
    const {
      vs_currency = 'usd',
      order = 'market_cap_desc',
      size = 20,
      page = 1,
      search = ''
    } = params

    const cacheKey = `screener:markets:${vs_currency}:${order}:${size}:${page}:${String(search ?? '')}`
    const cached = await redisClient.get(cacheKey)
    if (cached) {
      const parsed = JSON.parse(cached) as { totalItems: number; items: unknown[] }
      return parsed
    }

    const result = await CoinGeckoService.getCoinMarkets({
      vs_currency,
      order,
      size,
      page,
      search
    })

    const data = {
      totalItems: result.total,
      items: result.items
    }
    await redisClient.set(cacheKey, JSON.stringify(data), 'EX', this.CACHE_TTL_SECONDS)
    return data
  }

  /**
   * Get screener data by category: loser, gainers, markets, trending.
   */
  static async getByCategory(params: GetByCategoryParams) {
    const {
      category,
      page = 1,
      size = 10,
      minVolume = 0,
      minLiquidity = 0,
      vs_currency = 'usd',
      order = 'market_cap_desc',
      search = ''
    } = params

    if (category === 'gainers') {
      return this.getGainersOrLosers({
        direction: 'gainers',
        size,
        page,
        minVolume,
        minLiquidity
      })
    }

    if (category === 'losers') {
      return this.getGainersOrLosers({
        direction: 'losers',
        size,
        page,
        minVolume,
        minLiquidity
      })
    }

    if (category === 'markets') {
      return this.getCoinMarkets({
        vs_currency,
        order,
        size,
        page,
        search
      })
    }

    if (category === 'trending') {
      const result = await this.getTrendingCoins()
      const totalItems = result.items.length
      const start = (page - 1) * size
      const items = result.items.slice(start, start + size)
      return { totalItems, items }
    }

    return { totalItems: 0, items: [] }
  }
}
