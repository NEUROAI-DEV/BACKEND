import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleServerError } from '../../utilities/requestHandler'
import { StatService } from '../../services/StatsService'

export const getStats = async (req: Request, res: Response): Promise<Response> => {
  try {
    const data = await StatService.getStatsCounts()
    const response = ResponseData.success({ data })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
