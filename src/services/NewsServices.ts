import { Op } from 'sequelize'
import redisClient from '../configs/redis'
import { NewsModel } from '../models/newsMode'
import { Pagination } from '../utilities/pagination'
import { AppError } from '../utilities/AppError'
import { IFindAllNews } from '../schemas/NewsSchema'

export class NewsServices {
  static async findAll(params: IFindAllNews) {
    const { page = 0, size = 10, pagination, search } = params

    const paginationInfo = new Pagination(page, size)

    const cacheKey = `news:list:${paginationInfo.page}:${paginationInfo.limit}:${pagination ?? false}:${search ?? ''}`

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

    const result = await NewsModel.findAndCountAll({
      where: whereClause,
      order: [['newsId', 'DESC']],
      ...(pagination === true && {
        limit: paginationInfo.limit,
        offset: paginationInfo.offset
      })
    })

    const formatted = paginationInfo.formatData(result)

    const redisExpiredInSeconds = 60 * 5 // 5 minutes
    await redisClient.setex(cacheKey, redisExpiredInSeconds, JSON.stringify(formatted))

    return formatted
  }

  static async findDetail(newsId: number) {
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
  }
}
