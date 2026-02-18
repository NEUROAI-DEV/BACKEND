import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleServerError } from '../../utilities/requestHandler'
import logger from '../../../logs'
import { FindDetailArticleInput } from '../../schemas/articleSchema'
import { ArticleModel } from '../../models/articleModel'

export const findDetailArticle = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { articleId } = req.params as unknown as FindDetailArticleInput

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
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
