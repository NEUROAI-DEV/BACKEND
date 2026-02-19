import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import logger from '../../../logs'
import { appConfigs } from '../../configs'
import { AppError } from '../../errors/AppError'

export class CryptoPanicService {
  static async fetchNews(params?: {
    currencies?: string
    page?: number
  }): Promise<any[]> {
    try {
      const response = await axios.get(appConfigs?.cryptopanic?.baseUrl!, {
        params: {
          auth_token: appConfigs?.cryptopanic?.apiKey,
          kind: 'news',
          public: true,
          // currencies: params?.currencies || 'BTC,ETH',
          page: params?.page || 1
        }
      })

      return response.data?.results || []
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        logger.error(
          `[CryptoPanicService] fetchNews failed: ${error.response?.status} - ${error.message}`
        )
        throw new AppError(
          'Failed to fetch news from CryptoPanic',
          StatusCodes.BAD_GATEWAY
        )
      }

      logger.error(`[CryptoPanicService] fetchNews unexpected error: ${String(error)}`)
      throw new AppError('Failed to fetch news from CryptoPanic')
    }
  }
}
