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
import logger from '../utilities/logger'
import { StatusCodes } from 'http-status-codes'

export class ArticleService {
  static async create(params: ICreateArticle) {
    try {
      const payload: IArticleCreationAttributes = {
        articleTitle: params.articleTitle,
        articleDescription: params.articleDescription ?? '',
        articleImage: params.articleImage ?? ''
      }
      const record = await ArticleModel.create(payload)
      return record
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[ArticleService] create failed: ${String(error)}`)
      throw new AppError('Failed to create article', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  static async findAll(params: IFindAllArticle) {
    try {
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
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[ArticleService] findAll failed: ${String(error)}`)
      throw new AppError('Failed to find articles', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  static async findDetail(params: IFindDetailArticle) {
    try {
      const { articleId } = params
      const result = await ArticleModel.findOne({
        where: { deleted: 0, articleId }
      })

      if (result == null) {
        throw AppError.notFound(`Article not found with ID: ${articleId}`)
      }

      return result
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[ArticleService] findDetail failed: ${String(error)}`)
      throw new AppError(
        'Failed to find article detail',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async update(params: IUpdateArticle) {
    try {
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
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[ArticleService] update failed: ${String(error)}`)
      throw new AppError('Failed to update article', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  static async remove(params: IRemoveArticle) {
    try {
      const { articleId } = params
      const result = await ArticleModel.findOne({
        where: { deleted: 0, articleId }
      })

      if (result == null) {
        throw AppError.notFound(`Article not found with ID: ${articleId}`)
      }

      result.deleted = true
      await result.save()
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[ArticleService] remove failed: ${String(error)}`)
      throw new AppError('Failed to remove article', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}
