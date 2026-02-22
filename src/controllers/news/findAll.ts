import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { type FindAllNewsInput } from '../../schemas/NewsSchema'
import { NewsServices } from '../../services/news/NewsServices'

export const findAllNews = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { page, size, pagination, search, startDate, endDate } =
      req.query as unknown as FindAllNewsInput

    const data = await NewsServices.findAll({
      page,
      size,
      pagination,
      search,
      startDate,
      endDate
    })

    return res.status(StatusCodes.OK).json(ResponseData.success({ data }))
  } catch (error) {
    return handleError(res, error)
  }
}
