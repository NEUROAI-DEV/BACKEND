import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleServerError } from '../../utilities/requestHandler'
import logger from '../../../logs'
import type { UpdateArticleInput } from '../../schemas/articleSchema'
import { ArticleModel } from '../../models/articleModel'

export const updateArticle = async (
  req: Request<{}, {}, UpdateArticleInput>,
  res: Response
): Promise<Response> => {
  const { articleId, jwtPayload, ...updateData } = req.body

  try {
    const existingArtilce = await ArticleModel.findOne({
      where: {
        deleted: 0,
        articleId
      }
    })

    if (existingArtilce === null) {
      const message = `Article not found with ID: ${articleId}`
      logger.warn(message)
      return res.status(StatusCodes.NOT_FOUND).json(ResponseData.error({ message }))
    }

    await ArticleModel.update(updateData, {
      where: { deleted: 0, articleId }
    })

    const response = ResponseData.success({
      message: 'Article updated successfully'
    })

    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
