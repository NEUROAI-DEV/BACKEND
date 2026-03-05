import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import logger from '../../../logs'
import { appConfigs } from '../../configs'
import { AppError } from '../../utilities/errorHandler'

export interface ICoinGeckoMarketData {
  name: string
  symbol: string
  priceUsd: number
  priceChange24h: number
  marketCapUsd: number
  liquidityUsd?: number
}

export interface ICoinGeckoMarketItem {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number | null
  market_cap: number | null
  market_cap_rank: number | null
  price_change_percentage_24h: number | null
  total_volume: number | null
  high_24h: number | null
  low_24h: number | null
}

export interface ICoinGeckoMarketsParams {
  vs_currency?: string
  order?:
    | 'market_cap_desc'
    | 'market_cap_asc'
    | 'volume_desc'
    | 'volume_asc'
    | 'id_asc'
    | 'id_desc'
    | 'gecko_desc'
    | 'gecko_asc'
    | 'price_change_percentage_24h_desc'
    | 'price_change_percentage_24h_asc'
  size?: number
  page?: number
  search?: string
  price_change_percentage?: string
}

export interface ICoinGeckoMarketsResult {
  items: ICoinGeckoMarketItem[]
  total: number
}

export class CoinGeckoService {
  static async getTokenPriceUsd(contractAddress: string): Promise<number> {
    try {
      const response = await axios.get(
        `${appConfigs.coingecko.baseUrl}/simple/token_price/ethereum`,
        {
          params: {
            contract_addresses: contractAddress,
            vs_currencies: 'usd'
          }
        }
      )

      return response.data[contractAddress.toLowerCase()]?.usd || 0
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        logger.error(
          `[CoinGeckoService] getTokenPriceUsd failed: ${error.response?.status} - ${error.message}`
        )
        throw new AppError(
          'Failed to fetch token price from CoinGecko',
          StatusCodes.BAD_GATEWAY
        )
      }

      logger.error(
        `[CoinGeckoService] getTokenPriceUsd unexpected error: ${String(error)}`
      )
      throw new AppError('Failed to fetch token price from CoinGecko')
    }
  }

  static async getMarketData(contractAddress: string): Promise<ICoinGeckoMarketData> {
    try {
      const response = await axios.get(
        `${appConfigs.coingecko.baseUrl}/coins/ethereum/contract/${contractAddress}`
      )

      const data = response.data

      return {
        name: data?.name || 'Unknown Token',
        symbol: data?.symbol?.toUpperCase() || 'UNKNOWN',
        priceUsd: data?.market_data?.current_price?.usd || 0,
        priceChange24h: data?.market_data?.price_change_percentage_24h || 0,
        marketCapUsd: data?.market_data?.market_cap?.usd || 0,
        liquidityUsd: data?.market_data?.total_volume?.usd || 0
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status

        if (status === StatusCodes.NOT_FOUND || status === StatusCodes.BAD_REQUEST) {
          logger.warn(
            `[CoinGeckoService] getMarketData invalid contract ${contractAddress}: ${status}`
          )
          throw AppError.badRequest('Invalid contract address')
        }

        logger.error(
          `[CoinGeckoService] getMarketData failed: ${status} - ${error.message}`
        )
        throw new AppError(
          'Failed to fetch market data from CoinGecko',
          StatusCodes.BAD_GATEWAY
        )
      }

      logger.error(`[CoinGeckoService] getMarketData unexpected error: ${String(error)}`)
      throw new AppError('Failed to fetch market data from CoinGecko')
    }
  }

  /**
   * Get list of coins from /coins/markets with optional search.
   * When search is provided, fetches up to 250 items and filters by name/symbol.
   */
  static async getCoinMarkets(
    params: ICoinGeckoMarketsParams = {}
  ): Promise<ICoinGeckoMarketsResult> {
    const {
      vs_currency = 'usd',
      order = 'market_cap_desc',
      size = 20,
      page = 1,
      search
    } = params

    const fetchPerPage = search ? 50 : Math.min(size, 50)
    const fetchPage = search ? 1 : page

    const requestParams: Record<string, string | number> = {
      vs_currency,
      order,
      per_page: fetchPerPage,
      page: fetchPage
    }
    if (params.price_change_percentage) {
      requestParams.price_change_percentage = params.price_change_percentage
    }

    try {
      const response = await axios.get<ICoinGeckoMarketItem[]>(
        `${appConfigs.coingecko.baseUrl}/coins/markets`,
        { params: requestParams }
      )

      let items = Array.isArray(response.data) ? response.data : []

      if (search && String(search).trim()) {
        const term = String(search).trim().toLowerCase()
        items = items.filter(
          (coin) =>
            coin.name?.toLowerCase().includes(term) ||
            coin.symbol?.toLowerCase().includes(term) ||
            coin.id?.toLowerCase().includes(term)
        )
        const total = items.length
        const start = (page - 1) * size
        items = items.slice(start, start + size)
        return { items, total }
      }

      return { items, total: items.length }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        logger.error(
          `[CoinGeckoService] getCoinMarkets failed: ${error.response?.status} - ${error.message}`
        )
        throw new AppError(
          'Failed to fetch coin markets from CoinGecko',
          StatusCodes.BAD_GATEWAY
        )
      }

      logger.error(`[CoinGeckoService] getCoinMarkets unexpected error: ${String(error)}`)
      throw new AppError('Failed to fetch coin markets from CoinGecko')
    }
  }

  /**
   * Get top signal (top gainers by 24h price change %) from /coins/markets.
   * Uses order=price_change_percentage_24h_desc and price_change_percentage=24h.
   */
  static async getTopSignalMarkets(
    size: number = 10,
    page: number = 1
  ): Promise<ICoinGeckoMarketsResult> {
    return this.getCoinMarkets({
      vs_currency: 'usd',
      order: 'price_change_percentage_24h_desc',
      size,
      page,
      price_change_percentage: '24h'
    })
  }
}
