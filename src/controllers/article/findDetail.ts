import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { ArticleService } from '../../services/ArticleService'
import { IFindDetailArticle } from '../../schemas/ArticleSchema'

export const findDetailArticle = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const params = req.params as unknown as IFindDetailArticle
    const result = await ArticleService.findDetail(params)
    return res.status(StatusCodes.OK).json(ResponseData.success({ data: result }))
  } catch (error) {
    return handleError(res, error)
  }
}
