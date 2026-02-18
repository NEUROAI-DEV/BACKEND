import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleServerError } from '../../utilities/requestHandler'
import { IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { type CreateArticleInput } from '../../schemas/articleSchema'
import { ArticleModel } from '../../models/articleModel'

export const createArticle = async (
  req: Request<{}, {}, CreateArticleInput> & IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const { jwtPayload, ...payload } = req.body

    await ArticleModel.create(payload)
    const response = ResponseData.success({})

    return res.status(StatusCodes.CREATED).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
