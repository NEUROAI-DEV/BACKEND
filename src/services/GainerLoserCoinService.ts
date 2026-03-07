import redisClient from '../configs/redis'

export type TopAveragesParams = {
  vs_currency?: string
  direction?: 'gainers' | 'losers'
  size?: number
  page?: number
  minVolume?: number
  minLiquidity?: number
  price_change_percentage?: '1h' | '24h' | '7d' | '14d' | '30d'
}

export class GainerLoserCoinService {
  static async getTopAverages(params: TopAveragesParams = {}) {
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
}
