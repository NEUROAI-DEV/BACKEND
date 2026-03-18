import { UserModel } from '../models/userModel'
import { ArticleModel } from '../models/articleModel'
import { IndexingModel } from '../models/indexingModel'
import { SubscriptionModel } from '../models/subscriptionModel'
import { TransactionModel } from '../models/transactionModel'

export interface StatsCounts {
  totalUsers: number
  totalSubscribedUsers: number
  totalArticles: number
  totalIndexedDocuments: number
  totalTransactions: number
}

export class StatService {
  static async getStatsCounts(): Promise<StatsCounts> {
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
  }
}
