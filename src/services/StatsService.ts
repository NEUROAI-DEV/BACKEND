import { UserModel } from '../models/userModel'
import { ArticleModel } from '../models/articleModel'
import { IndexingModel } from '../models/indexingModel'
import { SubscriptionModel } from '../models/subscriptionModel'

export interface StatsCounts {
  totalUsers: number
  totalSubscribedUsers: number
  totalArticles: number
  totalIndexedDocuments: number
}

export class StatService {
  static async getStatsCounts(): Promise<StatsCounts> {
    const [totalUsers, totalSubscribedUsers, totalArticles, totalIndexedDocuments] =
      await Promise.all([
        UserModel.count(),
        SubscriptionModel.count({
          where: { subscriptionStatus: 'ACTIVE' }
        }),
        ArticleModel.count(),
        IndexingModel.count()
      ])

    return {
      totalUsers,
      totalSubscribedUsers,
      totalArticles,
      totalIndexedDocuments
    }
  }
}
