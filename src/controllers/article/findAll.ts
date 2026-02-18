import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { type FindAllArticleInput } from '../../schemas/articleSchema'
import { ArticleService } from '../../services/article'

export const findAllArticle = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { page, size, pagination, search } = req.query as unknown as FindAllArticleInput
    const { formatted } = await ArticleService.findAll({
      page,
      size,
      pagination,
      search
    })
    return res.status(StatusCodes.OK).json(ResponseData.success({ data: formatted }))
  } catch (err) {
    return handleError(res, err)
  }
}
