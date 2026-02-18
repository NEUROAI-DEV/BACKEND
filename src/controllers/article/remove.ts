import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleServerError } from '../../utilities/requestHandler'
import logger from '../../../logs'
import { ArticleModel } from '../../models/articleModel'
import type { RemoveArticleInput } from '../../schemas/articleSchema'

export const removeArticle = async (
  req: Request<{}, {}, RemoveArticleInput>,
  res: Response
): Promise<Response> => {
  const { articleId } = req.body

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

    result.deleted = true
    await result.save()

    const response = ResponseData.success({ message: 'Article deleted successfully' })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
