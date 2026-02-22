import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import {
  handleError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { CoinGeckoService } from '../../services/external/CoinGeckoService'
import { findAllCoinSchema } from '../../schemas/MarketSymbolsSchema'
import redisClient from '../../configs/redis'

const CACHE_PREFIX = 'markets:coins:gecko'
const CACHE_TTL_SECONDS = 5 * 60 // 5 minutes

export const findAllCoin = async (req: Request, res: Response): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findAllCoinSchema,
    req.query
  )

  if (validationError) return handleValidationError(res, validationError)

  const { vs_currency, order, limit: per_page, page, search } = validatedData

  const cacheKey = `${CACHE_PREFIX}:${vs_currency ?? 'usd'}:${order ?? 'market_cap_desc'}:${per_page}:${page}:${search ?? ''}`

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
      per_page,
      page,
      search
    })

    const response = ResponseData.success({
      data: {
        items: result.items,
        totalItems: result.total,
        currentPage: page,
        totalPages: Math.ceil(result.total / per_page) || 1
      }
    })

    await redisClient.set(cacheKey, JSON.stringify(response), 'EX', CACHE_TTL_SECONDS)

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
