import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { type FindDetailArticleInput } from '../../schemas/articleSchema'
import { ArticleService } from '../../services/article'

export const findDetailArticle = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { articleId } = req.params as unknown as FindDetailArticleInput
    const result = await ArticleService.findDetail(articleId)
    return res.status(StatusCodes.OK).json(ResponseData.success({ data: result }))
  } catch (err) {
    return handleError(res, err)
  }
}
