import { UserModel } from '../models/userModel'
import { ArticleModel } from '../models/articleModel'
import { IndexingModel } from '../models/indexingModel'
import { SubscriptionModel } from '../models/subscriptionModel'
import { TransactionModel } from '../models/transactionModel'
import { AppError } from '../utilities/errorHandler'
import logger from '../../logs'
import { StatusCodes } from 'http-status-codes'

export interface StatsCounts {
  totalUsers: number
  totalSubscribedUsers: number
  totalArticles: number
  totalIndexedDocuments: number
  totalTransactions: number
}

export class StatService {
  static async getStatsCounts(): Promise<StatsCounts> {
    try {
      const [
        totalUsers,
        totalSubscribedUsers,
        totalArticles,
        totalIndexedDocuments,
        totalTransactions
      ] = await Promise.all([
        UserModel.count(),
        SubscriptionModel.count({
          where: { subscriptionStatus: 'ACTIVE' }
        }),
        ArticleModel.count(),
        IndexingModel.count(),
        TransactionModel.count()
      ])

      return {
        totalUsers,
        totalSubscribedUsers,
        totalArticles,
        totalIndexedDocuments,
        totalTransactions
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[StatService] getStatsCounts failed: ${String(error)}`)
      throw new AppError('Failed to get stats counts', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}
