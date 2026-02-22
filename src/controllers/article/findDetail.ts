import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import {
  IFindDetailArticle,
  type findDetailArticleSchema
} from '../../schemas/ArticleSchema'
import { ArticleService } from '../../services/ArticleService'

export const findDetailArticle = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { articleId } = req.params as unknown as IFindDetailArticle
    const result = await ArticleService.findDetail(articleId)
    return res.status(StatusCodes.OK).json(ResponseData.success({ data: result }))
  } catch (err) {
    return handleError(res, err)
  }
}
