import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { Pagination } from '../../utilities/pagination'
import { handleServerError } from '../../utilities/requestHandler'
import { ArticleModel } from '../../models/articleModel'
import { type FindAllArticleInput } from '../../schemas/articleSchema'

export const findAllArticle = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { page, size, pagination, search } = req.query as unknown as FindAllArticleInput

    const paginationInfo = new Pagination(page ?? 0, size ?? 10)

    const result = await ArticleModel.findAndCountAll({
      where: {
        deleted: 0
      },
      order: [['articleId', 'desc']],
      ...(pagination === 'true' && {
        limit: paginationInfo.limit,
        offset: paginationInfo.offset
      })
    })

    const response = ResponseData.success({ data: result })
    response.data = paginationInfo.formatData(result)

    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
