import redisClient from '../configs/redis'
import { CoinMarketCacheService } from './CoinMarketCacheService'
import { CoinGeckoService, ICoinGeckoMarketsParams } from './external/CoinGeckoService'
import { AppError } from '../utilities/errorHandler'
import logger from '../utilities/logger'
import { StatusCodes } from 'http-status-codes'

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
    try {
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
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[ScreenerService] getGainersOrLosers failed: ${String(error)}`)
      throw new AppError(
        'Failed to get gainers or losers',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async getTrendingCoins() {
    try {
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
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[ScreenerService] getTrendingCoins failed: ${String(error)}`)
      throw new AppError(
        'Failed to get trending coins',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  private static sortMarketsByOrder<
    T extends {
      market_cap?: number | null
      total_volume?: number | null
      id?: string
      price_change_percentage_24h?: number | null
      market_cap_rank?: number | null
    }
  >(items: T[], order: ICoinGeckoMarketsParams['order']): T[] {
    try {
      const arr = [...items]
      const cap = (c: T) => c.market_cap ?? 0
      const vol = (c: T) => c.total_volume ?? 0
      const pc = (c: T) => c.price_change_percentage_24h ?? 0
      const id = (c: T) => (c.id ?? '').toLowerCase()
      const rank = (c: T) => c.market_cap_rank ?? 1e9
      switch (order) {
        case 'market_cap_desc':
          return arr.sort((a, b) => cap(b) - cap(a))
        case 'market_cap_asc':
          return arr.sort((a, b) => cap(a) - cap(b))
        case 'volume_desc':
          return arr.sort((a, b) => vol(b) - vol(a))
        case 'volume_asc':
          return arr.sort((a, b) => vol(a) - vol(b))
        case 'id_asc':
          return arr.sort((a, b) => id(a).localeCompare(id(b)))
        case 'id_desc':
          return arr.sort((a, b) => id(b).localeCompare(id(a)))
        case 'gecko_desc':
          return arr.sort((a, b) => rank(a) - rank(b))
        case 'gecko_asc':
          return arr.sort((a, b) => rank(b) - rank(a))
        case 'price_change_percentage_24h_desc':
          return arr.sort((a, b) => pc(b) - pc(a))
        case 'price_change_percentage_24h_asc':
          return arr.sort((a, b) => pc(a) - pc(b))
        default:
          return arr.sort((a, b) => cap(b) - cap(a))
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[ScreenerService] sortMarketsByOrder failed: ${String(error)}`)
      throw new AppError(
        'Failed to sort markets by order',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async getCoinMarkets(params: ICoinGeckoMarketsParams = {}) {
    try {
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

      let list = await CoinMarketCacheService.getCachedMarkets()
      if (!Array.isArray(list)) list = []

      if (search && String(search).trim()) {
        const term = String(search).trim().toLowerCase()
        list = list.filter(
          (coin: any) =>
            coin.name?.toLowerCase().includes(term) ||
            coin.symbol?.toLowerCase().includes(term) ||
            coin.id?.toLowerCase().includes(term)
        )
      }

      list = ScreenerService.sortMarketsByOrder(list, order)
      const totalItems = list.length
      const start = (page - 1) * size
      const items = list.slice(start, start + size)

      const data = { totalItems, items }
      await redisClient.set(cacheKey, JSON.stringify(data), 'EX', this.CACHE_TTL_SECONDS)
      return data
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[ScreenerService] getCoinMarkets failed: ${String(error)}`)
      throw new AppError('Failed to get coin markets', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Get screener data by category: loser, gainers, markets, trending.
   */
  static async getByCategory(params: GetByCategoryParams) {
    try {
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
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[ScreenerService] getByCategory failed: ${String(error)}`)
      throw new AppError('Failed to get by category', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}
