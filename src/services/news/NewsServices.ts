import logger from '../../logs'
import { NewsModel } from '../../models/newsMode'

export class NewsServices {
  static async findAll(limit?: number, offset?: number) {
    try {
      return NewsModel.findAndCountAll({
        where: {
          deleted: 0
        },
        order: [['newsId', 'desc']],
        ...(limit !== undefined && { limit }),
        ...(offset !== undefined && { offset })
      })
    } catch (error) {
      logger.error(`[NewsServices] - ${error}`)
      throw error
    }
  }

  static async findDetail(newsId: number) {
    try {
      return NewsModel.findOne({
        where: {
          newsId,
          deleted: 0
        }
      })
    } catch (error) {
      logger.error(`[NewsServices] - findDetail: ${error}`)
      throw error
    }
  }
}
