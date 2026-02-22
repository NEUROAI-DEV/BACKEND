import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { type ICreateArticle } from '../../schemas/ArticleSchema'
import { IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { ArticleService } from '../../services/ArticleService'

export const createArticle = async (
  req: Request<{}, {}, ICreateArticle> & IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const { jwtPayload: _jwt, ...payload } = req.body
    await ArticleService.create({
      articleTitle: payload.articleTitle,
      articleDescription: payload.articleDescription,
      articleImage: payload.articleImage
    })
    return res.status(StatusCodes.CREATED).json(ResponseData.success({}))
  } catch (err) {
    return handleError(res, err)
  }
}
