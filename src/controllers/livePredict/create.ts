import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { LivePredictService } from '../../services/LivePredictService'
import type { ICreateLivePredict } from '../../schemas/LivePredictSchema'
import type { IAuthenticatedRequest } from '../../interfaces/shared/request.interface'

export const createLivePredict = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const payload = req.body as ICreateLivePredict
    const row = await LivePredictService.create(payload)

    const response = ResponseData.success({
      data: row,
      message: 'Live predict created successfully.'
    })

    return res.status(StatusCodes.CREATED).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
