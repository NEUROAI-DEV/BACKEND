import redisClient from '../configs/redis'
import { CoinGeckoService, ICoinGeckoMarketsParams } from './external/CoinGeckoService'

export type ScreenerCategory = 'loser' | 'gainers' | 'markets' | 'trending'

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
        total: 0,
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
    const total = items.length
    const start = (page - 1) * size
    const paginated = items.slice(start, start + size)

    /**
     * Format response
     */
    const coins = paginated.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol?.toUpperCase(),
      image: coin.image ?? null,
      price: coin.current_price ?? 0,
      priceChange24h: coin.price_change_percentage_24h ?? 0,
      marketCap: coin.market_cap ?? 0,
      marketCapRank: coin.market_cap_rank ?? null,
      volume24h: coin.total_volume ?? 0,
      high24h: coin.high_24h ?? 0,
      low24h: coin.low_24h ?? 0
    }))

    return {
      total,
      items: coins
    }
  }

  static async getTrendingCoins() {
    const result = await CoinGeckoService.getTrendingCoins()

    return {
      total: result.length,
      items: result
    }
  }

  static async getCoinMarkets(params: ICoinGeckoMarketsParams = {}) {
    const {
      vs_currency = 'usd',
      order = 'market_cap_desc',
      size = 20,
      page = 1,
      search = ''
    } = params

    const result = await CoinGeckoService.getCoinMarkets({
      vs_currency,
      order,
      size,
      page,
      search
    })

    return {
      total: result.total,
      items: result.items
    }
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

    if (category === 'loser') {
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
      const total = result.items.length
      const start = (page - 1) * size
      const items = result.items.slice(start, start + size)
      return { total, items }
    }

    return { total: 0, items: [] }
  }
}
