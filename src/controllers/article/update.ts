import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { ArticleService } from '../../services/ArticleService'
import { IUpdateArticle } from '../../schemas/ArticleSchema'

export const updateArticle = async (req: Request, res: Response): Promise<Response> => {
  try {
    const params = req.body as IUpdateArticle
    await ArticleService.update(params)
    return res
      .status(StatusCodes.OK)
      .json(ResponseData.success({ message: 'Article updated successfully' }))
  } catch (error) {
    return handleError(res, error)
  }
}
