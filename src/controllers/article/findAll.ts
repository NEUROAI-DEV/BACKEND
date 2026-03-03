import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { ArticleService } from '../../services/ArticleService'
import { IFindAllArticle } from '../../schemas/ArticleSchema'

export const findAllArticle = async (req: Request, res: Response): Promise<Response> => {
  try {
    const params = req.query as unknown as IFindAllArticle

    const result = await ArticleService.findAll(params)

    return res.status(StatusCodes.OK).json(ResponseData.success({ data: result }))
  } catch (err) {
    return handleError(res, err)
  }
}
