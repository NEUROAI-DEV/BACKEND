import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { NewsServices } from '../../services/NewsServices'
import { IFindDetailNews } from '../../schemas/NewsSchema'

export const findDetailNews = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { newsId } = req.params as unknown as IFindDetailNews
    const result = await NewsServices.findDetail(newsId)
    return res.status(StatusCodes.OK).json(ResponseData.success({ data: result }))
  } catch (error) {
    return handleError(res, error)
  }
}
