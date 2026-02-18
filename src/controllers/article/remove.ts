import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import type { RemoveArticleInput } from '../../schemas/articleSchema'
import { ArticleService } from '../../services/article'

export const removeArticle = async (
  req: Request<{}, {}, RemoveArticleInput>,
  res: Response
): Promise<Response> => {
  try {
    const { articleId } = req.body
    await ArticleService.remove(articleId)
    return res
      .status(StatusCodes.OK)
      .json(ResponseData.success({ message: 'Article deleted successfully' }))
  } catch (err) {
    return handleError(res, err)
  }
}
