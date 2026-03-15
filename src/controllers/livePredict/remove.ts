import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { LivePredictService } from '../../services/LivePredictService'
import type { IRemoveLivePredict } from '../../schemas/LivePredictSchema'

export const removeLivePredict = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const body = req.params as unknown as IRemoveLivePredict
    await LivePredictService.remove(body.livePredictId)

    const response = ResponseData.success({
      data: null,
      message: 'Live predict deleted successfully.'
    })

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
