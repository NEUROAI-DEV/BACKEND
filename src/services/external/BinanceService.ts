import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import logger from '../../../logs'
import { AppError } from '../../errors/AppError'
import { appConfigs } from '../../configs'
import redisClient from '../../configs/redis'

/**
 * ===============================
 * TYPES
 * ===============================
 */

export interface BinanceTicker24h {
  symbol: string
  priceChangePercent: string
  lastPrice: string
  highPrice: string
  lowPrice: string
}

export interface BinanceExchangeSymbol {
  symbol: string
  status: 'TRADING' | 'BREAK'
  baseAsset: string
  quoteAsset: string
}

interface BinanceExchangeInfoResponse {
  symbols: BinanceExchangeSymbol[]
}

/**
 * ===============================
 * SERVICE
 * ===============================
 */
export class BinanceService {
  private static baseUrl = appConfigs?.binance?.baseUrl

  /**
   * Get all 24h tickers
   * Used for: top gainers / losers
   */
  static async get24hTickers(): Promise<BinanceTicker24h[]> {
    try {
      const { data } = await axios.get<BinanceTicker24h[]>(
        `${this.baseUrl}/api/v3/ticker/24hr`
      )

      return data
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        logger.error(
          `[BinanceService] get24hTickers failed: ${error.response?.status} - ${error.message}`
        )
        throw new AppError(
          'Failed to fetch 24h tickers from Binance',
          StatusCodes.BAD_GATEWAY
        )
      }

      logger.error(`[BinanceService] get24hTickers unexpected error: ${String(error)}`)
      throw new AppError('Failed to fetch 24h tickers from Binance')
    }
  }

  /**
   * Get 24h ticker by symbol
   * Used for: prediction / AI signals
   */
  static async getTickerBySymbol(symbol: string) {
    try {
      const { data } = await axios.get<BinanceTicker24h>(
        `${this.baseUrl}/api/v3/ticker/24hr`,
        { params: { symbol: 'USDT' + symbol.toUpperCase() } }
      )

      return {
        lastPrice: Number(data.lastPrice),
        highPrice: Number(data.highPrice),
        lowPrice: Number(data.lowPrice),
        priceChangePercent: Number(data.priceChangePercent)
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status

        if (status === StatusCodes.NOT_FOUND || status === StatusCodes.BAD_REQUEST) {
          logger.warn(
            `[BinanceService] getTickerBySymbol invalid symbol ${symbol}: ${status}`
          )
          throw AppError.badRequest(`Invalid symbol: ${symbol}`)
        }

        logger.error(
          `[BinanceService] getTickerBySymbol failed: ${status} - ${error.message}`
        )
        throw new AppError('Failed to fetch ticker from Binance', StatusCodes.BAD_GATEWAY)
      }

      logger.error(
        `[BinanceService] getTickerBySymbol unexpected error for ${symbol}: ${String(error)}`
      )
      throw new AppError('Failed to fetch ticker from Binance')
    }
  }

  /**
   * Get all trading symbols from Binance
   * Used for: dropdown, training, validation
   */
  static async getAllSymbols(): Promise<BinanceExchangeSymbol[]> {
    try {
      const { data } = await axios.get<BinanceExchangeInfoResponse>(
        `${this.baseUrl}/api/v3/exchangeInfo`
      )

      return data.symbols
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        logger.error(
          `[BinanceService] getAllSymbols failed: ${error.response?.status} - ${error.message}`
        )
        throw new AppError(
          'Failed to fetch symbols from Binance',
          StatusCodes.BAD_GATEWAY
        )
      }

      logger.error(`[BinanceService] getAllSymbols unexpected error: ${String(error)}`)
      throw new AppError('Failed to fetch symbols from Binance')
    }
  }

  /**
   * Get all USDT trading pairs (recommended)
   * Cached in Redis for 24 hours.
   */
  static async getUsdtSymbols(): Promise<{ symbol: string; baseAsset: string }[]> {
    const CACHE_KEY = 'binance:all-symbols'
    const CACHE_TTL = 86400 // 24 hours in seconds

    try {
      const cached = await redisClient.get(CACHE_KEY)
      if (cached) {
        return JSON.parse(cached)
      }

      const symbols = await this.getAllSymbols()
      const result = symbols
        .filter((s) => s.status === 'TRADING')
        .map((s) => ({
          symbol: s.symbol,
          baseAsset: s.baseAsset
        }))

      await redisClient.set(CACHE_KEY, JSON.stringify(result), 'EX', CACHE_TTL)
      return result
    } catch (error: any) {
      logger.error(`[BinanceService] getUsdtSymbols error: ${String(error)}`)
      // Redis errors or others treated as internal errors
      throw new AppError('Failed to get USDT symbols from Binance')
    }
  }
}
