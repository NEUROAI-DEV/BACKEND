import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { ArticleService } from '../../services/ArticleService'
import { IRemoveArticle } from '../../schemas/ArticleSchema'

export const removeArticle = async (req: Request, res: Response): Promise<Response> => {
  try {
    const params = req.params as unknown as IRemoveArticle
    await ArticleService.remove(params)
    return res
      .status(StatusCodes.OK)
      .json(ResponseData.success({ message: 'Article deleted successfully' }))
  } catch (err) {
    return handleError(res, err)
  }
}
