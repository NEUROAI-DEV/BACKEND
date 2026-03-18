import { ArticleModel } from '../models/articleModel'
import { AppError } from '../utilities/errorHandler'
import { Pagination } from '../utilities/pagination'
import type { IArticleCreationAttributes } from '../models/articleModel'
import {
  type ICreateArticle,
  type IFindAllArticle,
  type IFindDetailArticle,
  type IUpdateArticle,
  type IRemoveArticle
} from '../schemas/ArticleSchema'
import { Op } from 'sequelize'

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
    const { page = 0, size = 10, pagination, search } = params
    const paginationInfo = new Pagination(page, size)

    const where: any = { deleted: 0 }

    if (search != null && String(search).trim() !== '') {
      const term = `%${String(search).trim()}%`
      where[Op.or] = [
        { articleTitle: { [Op.like]: term } },
        { articleDescription: { [Op.like]: term } }
      ]
    }

    const result = await ArticleModel.findAndCountAll({
      where,
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
