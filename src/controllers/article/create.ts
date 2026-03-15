import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { ArticleService } from '../../services/ArticleService'

export const createArticle = async (req: Request, res: Response): Promise<Response> => {
  try {
    const payload = req.body
    const article = await ArticleService.create(payload)
    return res.status(StatusCodes.CREATED).json(ResponseData.success({ data: article }))
  } catch (error) {
    return handleError(res, error)
  }
}
