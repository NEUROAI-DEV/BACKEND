import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { LivePredictService } from '../../services/LivePredictService'
import type { IUpdateLivePredict } from '../../schemas/LivePredictSchema'

export const updateLivePredict = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const body = req.body as IUpdateLivePredict
    const payload: { livePredictSymbols?: string } = {}
    if (body.livePredictSymbols != null) {
      payload.livePredictSymbols = body.livePredictSymbols.trim()
    }
    const row = await LivePredictService.update(body.livePredictId, payload)

    const response = ResponseData.success({
      data: row,
      message: 'Live predict updated successfully.'
    })

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
