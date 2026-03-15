import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { LivePredictService } from '../../services/LivePredictService'
import type { IFindDetailLivePredict } from '../../schemas/LivePredictSchema'

export const findDetailLivePredict = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const params = req.params as unknown as IFindDetailLivePredict
    const row = await LivePredictService.findDetail(params.livePredictId)

    const response = ResponseData.success({
      data: row
    })

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
