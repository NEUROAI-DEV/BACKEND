import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleServerError } from '../../utilities/errorHandler'
import { DailySummaryStoreService } from '../../services/DailySummaryStoreService'

export const findDailySummary = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const result = await DailySummaryStoreService.get(new Date())

    const response = ResponseData.success({ data: result })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
