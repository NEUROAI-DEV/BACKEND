import axios from 'axios'
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
    const { data } = await axios.get<BinanceTicker24h[]>(
      `${this.baseUrl}/api/v3/ticker/24hr`
    )

    return data
  }

  /**
   * Get 24h ticker by symbol
   * Used for: prediction / AI signals
   */
  static async getTickerBySymbol(symbol: string) {
    const { data } = await axios.get<BinanceTicker24h>(
      `${this.baseUrl}/api/v3/ticker/24hr`,
      { params: { symbol } }
    )

    return {
      lastPrice: Number(data.lastPrice),
      highPrice: Number(data.highPrice),
      lowPrice: Number(data.lowPrice),
      priceChangePercent: Number(data.priceChangePercent)
    }
  }

  /**
   * Get all trading symbols from Binance
   * Used for: dropdown, training, validation
   */
  static async getAllSymbols(): Promise<BinanceExchangeSymbol[]> {
    const { data } = await axios.get<BinanceExchangeInfoResponse>(
      `${this.baseUrl}/api/v3/exchangeInfo`
    )

    return data.symbols
  }

  /**
   * Get all USDT trading pairs (recommended)
   * Cached in Redis for 24 hours.
   */
  static async getUsdtSymbols(): Promise<{ symbol: string; baseAsset: string }[]> {
    const CACHE_KEY = 'binance:usdt-symbols'
    const CACHE_TTL = 86400 // 24 hours in seconds

    const cached = await redisClient.get(CACHE_KEY)
    if (cached) {
      return JSON.parse(cached)
    }

    const symbols = await this.getAllSymbols()
    const result = symbols
      .filter((s) => s.quoteAsset === 'USDT' && s.status === 'TRADING')
      .map((s) => ({
        symbol: s.symbol,
        baseAsset: s.baseAsset
      }))

    await redisClient.set(CACHE_KEY, JSON.stringify(result), 'EX', CACHE_TTL)
    return result
  }
}
