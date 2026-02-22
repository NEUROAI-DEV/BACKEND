import { ArticleModel } from '../models/articleModel'
import { AppError } from '../utilities/AppError'
import { Pagination } from '../utilities/pagination'
import type { IArticleCreationAttributes } from '../models/articleModel'
import {
  type ICreateArticle,
  type IFindAllArticle,
  type IFindDetailArticle,
  type IUpdateArticle,
  type IRemoveArticle
} from '../schemas/ArticleSchema'

export class ArticleService {
  static async create(params: ICreateArticle) {
    const payload: IArticleCreationAttributes = {
      articleTitle: params.articleTitle,
      articleDescription: params.articleDescription ?? '',
      articleImage: params.articleImage ?? ''
    }
    const record = await ArticleModel.create(payload)
    return record
  }

  static async findAll(params: IFindAllArticle) {
    const { page = 0, size = 10, pagination } = params
    const paginationInfo = new Pagination(page, size)

    const result = await ArticleModel.findAndCountAll({
      where: { deleted: 0 },
      order: [['articleId', 'desc']],
      ...(pagination === true && {
        limit: paginationInfo.limit,
        offset: paginationInfo.offset
      })
    })

    const formattedResult = paginationInfo.formatData(result)
    return formattedResult
  }

  static async findDetail(params: IFindDetailArticle) {
    const { articleId } = params
    const result = await ArticleModel.findOne({
      where: { deleted: 0, articleId }
    })

    if (result == null) {
      throw AppError.notFound(`Article not found with ID: ${articleId}`)
    }

    return result
  }

  static async update(params: IUpdateArticle) {
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

  static async remove(params: IRemoveArticle) {
    const { articleId } = params
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
