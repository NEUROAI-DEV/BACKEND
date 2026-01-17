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
}
