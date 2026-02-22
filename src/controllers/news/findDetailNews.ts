import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { type FindDetailNewsInput } from '../../schemas/NewsSchema'
import { NewsServices } from '../../services/news/NewsServices'

export const findDetailNews = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { newsId } = req.params as unknown as FindDetailNewsInput

    const result = await NewsServices.findDetail(newsId)

    return res.status(StatusCodes.OK).json(ResponseData.success({ data: result }))
  } catch (error) {
    return handleError(res, error)
  }
}
