import redisClient from '../../configs/redis'
import { BinanceService } from '../external/BinanceService'

const CACHE_KEY = 'top-signals'
const CACHE_TTL = 30 // seconds

export class TopSignalsService {
  static async getTopSignals(limit = 5) {
    const cached = await redisClient.get(CACHE_KEY)

    if (cached) {
      return JSON.parse(cached)
    }

    const tickers = await BinanceService.get24hTickers()

    const mapped = tickers
      .map((t) => ({
        symbol: t.symbol,
        changePercent: Number(t.priceChangePercent)
      }))
      .filter((t) => !Number.isNaN(t.changePercent))

    const gainers = [...mapped]
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, limit)

    const losers = [...mapped]
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, limit)

    const result = {
      gainers,
      losers,
      generatedAt: new Date().toISOString()
    }

    await redisClient.set(CACHE_KEY, JSON.stringify(result), 'EX', CACHE_TTL)

    return result
  }
}

// import redisClient from '../../configs/redis'
// import { CoinGeckoService } from '../external/CoinGeckoService'

// const CACHE_KEY = 'top-signals'
// const CACHE_TTL = 30 // seconds

// function mapToSignal(item: {
//   symbol: string
//   price_change_percentage_24h: number | null
//   image: string
// }) {
//   return {
//     symbol: item.symbol?.toUpperCase() ?? 'UNKNOWN',
//     changePercent: item.price_change_percentage_24h ?? 0,
//     icon: item.image ?? ''
//   }
// }

// export class TopSignalsService {
//   static async getTopSignals(limit = 10) {
//     const cached = await redisClient.get(CACHE_KEY)

//     if (cached) {
//       return JSON.parse(cached)
//     }

//     const [gainersResult, losersResult] = await Promise.all([
//       CoinGeckoService.getTopSignalMarkets(limit, 1),
//       CoinGeckoService.getCoinMarkets({
//         vs_currency: 'usd',
//         order: 'price_change_percentage_24h_asc',
//         per_page: limit,
//         page: 1,
//         price_change_percentage: '24h'
//       })
//     ])

//     const gainers = gainersResult.items.map(mapToSignal)
//     const losers = losersResult.items.map(mapToSignal)

//     const result = {
//       gainers,
//       losers,
//       generatedAt: new Date().toISOString()
//     }

//     await redisClient.set(CACHE_KEY, JSON.stringify(result), 'EX', CACHE_TTL)

//     return result
//   }
// }
