import { UserModel } from '../models/userModel'
import { ArticleModel } from '../models/articleModel'
import { IndexingModel } from '../models/indexingModel'

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
        UserModel.count({
          where: { userSubscriptionStatus: 'active' }
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
