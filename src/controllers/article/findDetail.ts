import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import logger from '../../../logs'
import { ValidationError } from 'joi'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { findDetailArticleSchema } from '../../schemas/articleSchema'
import { IArticleFindDetailRequest } from '../../interfaces/article.request'
import { ArticleModel } from '../../models/articleModel'

export const findDetailArticle = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findDetailArticleSchema,
    req.params
  ) as {
    error: ValidationError
    value: IArticleFindDetailRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  const { articleId } = validatedData

  try {
    const result = await ArticleModel.findOne({
      where: {
        deleted: 0,
        articleId
      }
    })

    if (result == null) {
      const message = `Article not found with ID: ${articleId}`
      logger.warn(message)
      return res.status(StatusCodes.NOT_FOUND).json(ResponseData.error({ message }))
    }

    const response = ResponseData.success({ data: result })
    logger.info('Article detail retrieved successfully')
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
