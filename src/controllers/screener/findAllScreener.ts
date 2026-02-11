import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { findAllScreenerSchema } from '../../schemas/screenerSchema'
import { ScreenerService } from '../../services/screener/ScreenerService'
import { LivePricePredictionService } from '../../services/llm/LivePricePredictionService'
import type { ScreenerInstance } from '../../models/screenerModel'
import redisClient from '../../configs/redis'
import { SCREENER_LIST_CACHE_PREFIX } from '../../utilities/screenerCache'

const CACHE_TTL_SECONDS = 10 * 60 // 10 minutes

export const findAllScreener = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findAllScreenerSchema,
    req.query
  )

  if (validationError) return handleValidationError(res, validationError)

  const userId = req.jwtPayload?.userId
  if (userId == null) {
    const response = ResponseData.error({ message: 'Unauthorized' })
    return res.status(StatusCodes.UNAUTHORIZED).json(response)
  }

  const { page, size, search } = validatedData

  const cacheKey = `${SCREENER_LIST_CACHE_PREFIX}:${userId}:${page}:${size}:${search ?? ''}`

  try {
    const cached = await redisClient.get(cacheKey)
    if (cached) {
      return res
        .status(StatusCodes.OK)
        .json(JSON.parse(cached) as ReturnType<typeof ResponseData.success>)
    }

    const result = await ScreenerService.findAll({
      screenerUserId: userId,
      page,
      limit: size,
      search
    })

    const itemsWithAnalysis = await Promise.all(
      result.items.map(async (item: ScreenerInstance) => {
        let analysis = null

        try {
          analysis = await LivePricePredictionService.predict(
            item.screenerCoinSymbol,
            item.screenerProfile
          )
        } catch {
          analysis = null
        }
        const { dataValues } = item
        return {
          ...dataValues,
          analysis
        }
      })
    )

    const response = ResponseData.success({
      data: {
        items: itemsWithAnalysis,
        totalItems: result.pagination.total,
        totalPages: result.pagination.totalPages,
        currentPage: result.pagination.page
      }
    })

    await redisClient.set(cacheKey, JSON.stringify(response), 'EX', CACHE_TTL_SECONDS)

    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
