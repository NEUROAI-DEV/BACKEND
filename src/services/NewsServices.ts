import { Op } from 'sequelize'
import redisClient from '../configs/redis'
import { NewsModel } from '../models/newsMode'
import { Pagination } from '../utilities/pagination'
import { AppError } from '../utilities/errorHandler'
import { IFindAllNews } from '../schemas/NewsSchema'
import logger from '../utilities/logger'
import { StatusCodes } from 'http-status-codes'

export class NewsServices {
  static async findAll(params: IFindAllNews) {
    try {
      const { page = 1, size = 10, pagination, search, category } = params

      const paginationInfo = new Pagination(page, size)

      const cacheKey = `news:list:${paginationInfo.page}:${paginationInfo.limit}:${pagination ?? false}:${search ?? ''}:${category ?? ''}`

      const cached = await redisClient.get(cacheKey)

      if (cached) {
        return JSON.parse(cached) as ReturnType<typeof paginationInfo.formatData>
      }

      const whereClause: any = {
        deleted: 0
      }

      if (search && String(search).trim()) {
        whereClause.newsTitle = {
          [Op.like]: `%${String(search).trim()}%`
        }
      }

      if (category && ['TRENDING', 'NORMAL'].includes(category)) {
        whereClause.newsSentimentCategory = category
      }

      const result = await NewsModel.findAndCountAll({
        where: whereClause,
        order: [['newsId', 'DESC']],
        ...(pagination === true && {
          limit: paginationInfo.limit,
          offset: paginationInfo.offset
        })
      })

      const formatted = paginationInfo.formatData(result)

      const redisExpiredInSeconds = 60 * 2 // 5 minutes
      await redisClient.setex(cacheKey, redisExpiredInSeconds, JSON.stringify(formatted))

      return formatted
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[NewsServices] findAll failed: ${String(error)}`)
      throw new AppError('Failed to find all news', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  static async findDetail(newsId: number) {
    try {
      const record = await NewsModel.findOne({
        where: {
          newsId,
          deleted: 0
        }
      })

      if (record == null) {
        throw AppError.notFound(`News not found with ID: ${newsId}`)
      }

      return record
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[NewsServices] findDetail failed: ${String(error)}`)
      throw new AppError('Failed to find news detail', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}
