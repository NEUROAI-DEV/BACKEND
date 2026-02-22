import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import type { UpdateArticleInput } from '../../schemas/ArticleSchema'
import { ArticleService } from '../../services/ArticleService'

export const updateArticle = async (
  req: Request<{}, {}, UpdateArticleInput>,
  res: Response
): Promise<Response> => {
  try {
    const { articleId, jwtPayload: _jwt, ...updateData } = req.body
    await ArticleService.update({ articleId, ...updateData })
    return res
      .status(StatusCodes.OK)
      .json(ResponseData.success({ message: 'Article updated successfully' }))
  } catch (err) {
    return handleError(res, err)
  }
}
