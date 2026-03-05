import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { NewsServices } from '../../services/NewsServices'
import { IFindAllNews } from '../../schemas/NewsSchema'

export const findAllNews = async (req: Request, res: Response): Promise<Response> => {
  try {
    const params = req.query as unknown as IFindAllNews
    const data = await NewsServices.findAll(params)
    return res.status(StatusCodes.OK).json(ResponseData.success({ data }))
  } catch (error) {
    return handleError(res, error)
  }
}
