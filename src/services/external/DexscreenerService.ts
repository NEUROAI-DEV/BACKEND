import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../utilities/errorHandler'
import logger from '../../../logs'

export class DexscreenerService {
  static async getDexscreenerBoosted() {
    try {
      const url = 'https://api.dexscreener.com/token-boosts/top/v1'

      const response = await axios.get(url)

      const tokens = response.data.map((t: any) => ({
        id: null,
        name: null,
        symbol: null,
        marketCapRank: null,
        thumb: null,
        chainId: t.chainId ?? null,
        tokenAddress: t.tokenAddress ?? null,
        boostAmount: t.amount ?? 0,
        totalBoost: t.totalAmount ?? 0,
        url: t.url ?? null,
        sources: ['dexscreener']
      }))

      return tokens
    } catch (error) {
      logger.error(`[TrendingCoinService] getDexscreenerBoosted failed: ${String(error)}`)
      throw new AppError(
        'Failed to fetch Dexscreener boosted tokens',
        StatusCodes.BAD_GATEWAY
      )
    }
  }
}
