import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { CoinGeckoService } from '../../services/external/CoinGeckoService'
import redisClient from '../../configs/redis'
import { IFindAllCoin } from '../../schemas/CoinMarketSchema'

const CACHE_PREFIX = 'markets:coins:gecko'
const CACHE_TTL_SECONDS = 5 * 60 // 5 minutes

export const findAllCoin = async (req: Request, res: Response): Promise<Response> => {
  const { vs_currency, order, size, page, search } = req.query as unknown as IFindAllCoin

  const cacheKey = `${CACHE_PREFIX}:${vs_currency ?? 'usd'}:${order ?? 'market_cap_desc'}:${size}:${page}:${search ?? ''}`

  try {
    const cached = await redisClient.get(cacheKey)
    if (cached) {
      return res
        .status(StatusCodes.OK)
        .json(JSON.parse(cached) as ReturnType<typeof ResponseData.success>)
    }

    const result = await CoinGeckoService.getCoinMarkets({
      vs_currency: vs_currency || 'usd',
      order: order as any,
      size,
      page,
      search
    })

    const response = ResponseData.success({
      data: {
        items: result.items,
        totalItems: result.total,
        currentPage: page,
        totalPages: result.total
      }
    })

    await redisClient.set(cacheKey, JSON.stringify(response), 'EX', CACHE_TTL_SECONDS)

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
