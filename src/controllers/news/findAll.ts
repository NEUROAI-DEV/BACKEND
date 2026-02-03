import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Op } from 'sequelize'
import { ResponseData } from '../../utilities/response'
import { Pagination } from '../../utilities/pagination'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { findAllNewsSchema } from '../../schemas/newsSchema'
import { NewsModel } from '../../models/newsMode'
import redisClient from '../../configs/redis'

export const findAllNews = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findAllNewsSchema,
    req.query
  )

  if (validationError) return handleValidationError(res, validationError)

  try {
    const { page: queryPage, size: querySize, pagination, search } = validatedData

    const page = new Pagination(Number(queryPage) || 0, Number(querySize) || 10)

    const cacheKey = `news:list:${page.page}:${page.limit}:${pagination}:${search || ''}`

    const cached = await redisClient.get(cacheKey)
    if (cached) {
      return res.status(StatusCodes.OK).json(ResponseData.success(JSON.parse(cached)))
    }

    const whereClause: any = {
      deleted: 0
    }

    if (search) {
      whereClause.title = {
        [Op.like]: `%${search}%`
      }
    }

    const result = await NewsModel.findAndCountAll({
      where: whereClause,
      order: [['newsId', 'DESC']],
      ...(pagination === true && {
        limit: page.limit,
        offset: page.offset
      })
    })

    const response = ResponseData.success({
      data: page.formatData(result)
    })

    const redisExpiredInMinutes = 60 * 5

    await redisClient.setex(cacheKey, redisExpiredInMinutes, JSON.stringify(response))

    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
