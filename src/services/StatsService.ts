import { UserModel } from '../models/userModel'
import { ArticleModel } from '../models/articleModel'
import { IndexingModel } from '../models/indexingModel'

export interface StatsCounts {
  totalUsers: number
  totalSubscribedUsers: number
  totalArticles: number
  totalIndexedDocuments: number
}

/**
 * Hitung total user, user subscribe (status active), article, dan dokumen ter-index.
 */
export async function getStatsCounts(): Promise<StatsCounts> {
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
