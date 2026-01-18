import axios from 'axios'
import { appConfigs } from '../../configs'

export class CoinGeckoService {
  static async getTokenPriceUsd(contractAddress: string): Promise<number> {
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
  }

  static async getMarketData(contractAddress: string): Promise<{
    priceUsd: number
    priceChange24h: number
    marketCapUsd: number
  }> {
    const response = await axios.get(
      `${appConfigs.coingecko.baseUrl}/coins/ethereum/contract/${contractAddress}`
    )

    return {
      priceUsd: response.data?.market_data?.current_price?.usd || 0,
      priceChange24h: response.data?.market_data?.price_change_percentage_24h || 0,
      marketCapUsd: response.data?.market_data?.market_cap?.usd || 0
    }
  }
}
