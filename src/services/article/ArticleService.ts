import { ArticleModel } from '../../models/articleModel'
import { AppError } from '../../errors/AppError'
import { Pagination } from '../../utilities/pagination'
import type { IArticleCreationAttributes } from '../../models/articleModel'

export interface CreateArticleParams {
  articleTitle: string
  articleDescription: string
  articleImage?: string
}

export interface FindAllArticleParams {
  page?: number
  size?: number
  pagination?: string
  search?: string
}

export interface UpdateArticleParams {
  articleId: number
  articleTitle?: string
  articleDescription?: string
  articleImage?: string
}

export class ArticleService {
  static async create(params: CreateArticleParams) {
    const payload: IArticleCreationAttributes = {
      articleTitle: params.articleTitle,
      articleDescription: params.articleDescription,
      articleImage: params.articleImage ?? ''
    }
    const record = await ArticleModel.create(payload)
    return record
  }

  static async findAll(params: FindAllArticleParams) {
    const { page = 0, size = 10, pagination } = params
    const paginationInfo = new Pagination(page, size)

    const result = await ArticleModel.findAndCountAll({
      where: { deleted: 0 },
      order: [['articleId', 'desc']],
      ...(pagination === 'true' && {
        limit: paginationInfo.limit,
        offset: paginationInfo.offset
      })
    })

    const formatted = paginationInfo.formatData(result)
    return { data: result, formatted }
  }

  static async findDetail(articleId: number) {
    const result = await ArticleModel.findOne({
      where: { deleted: 0, articleId }
    })

    if (result == null) {
      throw AppError.notFound(`Article not found with ID: ${articleId}`)
    }

    return result
  }

  static async update(params: UpdateArticleParams) {
    const { articleId, ...updateData } = params

    const existing = await ArticleModel.findOne({
      where: { deleted: 0, articleId }
    })

    if (existing == null) {
      throw AppError.notFound(`Article not found with ID: ${articleId}`)
    }

    await ArticleModel.update(updateData, {
      where: { deleted: 0, articleId }
    })
  }

  static async remove(articleId: number) {
    const result = await ArticleModel.findOne({
      where: { deleted: 0, articleId }
    })

    if (result == null) {
      throw AppError.notFound(`Article not found with ID: ${articleId}`)
    }

    result.deleted = true
    await result.save()
  }
}
