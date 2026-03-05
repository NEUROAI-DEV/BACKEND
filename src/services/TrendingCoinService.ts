import { StatusCodes } from 'http-status-codes'
import logger from '../../logs'
import { AppError } from '../utilities/errorHandler'
import { CoinGeckoService } from './external/CoinGeckoService'
import { DexscreenerService } from './external/DexscreenerService'

export class TrendingCoinService {
  static async getCoinGeckoTrending() {
    return CoinGeckoService.getTrendingCoins()
  }

  static async getDexscreenerBoosted() {
    return DexscreenerService.getDexscreenerBoosted()
  }

  static mergeTrendingCoins(coingecko: any[], dexscreener: any[]) {
    const map = new Map<string, any>()

    // insert coingecko coins
    for (const coin of coingecko) {
      if (!coin.symbol) continue

      const key = coin.symbol.toLowerCase()

      map.set(key, coin)
    }

    // merge dex coins
    for (const token of dexscreener) {
      const key = token.symbol?.toLowerCase()

      if (!key) {
        // if no symbol just push unique by address
        map.set(token.tokenAddress, token)
        continue
      }

      if (map.has(key)) {
        const existing = map.get(key)

        existing.sources.push('dexscreener')

        map.set(key, existing)
      } else {
        map.set(key, token)
      }
    }

    return Array.from(map.values())
  }

  /**
   * Get merged trending coins
   */
  static async getTrendingCoins() {
    try {
      const [coingecko, dexscreener] = await Promise.all([
        this.getCoinGeckoTrending(),
        this.getDexscreenerBoosted()
      ])

      const merged = this.mergeTrendingCoins(coingecko, dexscreener)

      return merged
    } catch (error) {
      logger.error(`[TrendingCoinService] getTrendingCoins failed: ${String(error)}`)
      throw new AppError(
        'Failed to fetch trending coins',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }
}
