import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { PredictService } from '../../services/predict/PredictService'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { type IRunPredict } from '../../schemas/PredictSchema'

export const runPredictions = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const userId = req.jwtPayload?.userId
  const payload = req.body as IRunPredict

  try {
    if (!userId) {
      const response = ResponseData.error({ message: 'Missing Authorization.' })
      return res.status(StatusCodes.UNAUTHORIZED).json(response)
    }

    await PredictService.runPredictions({
      userId,
      type: payload.type,
      symbol: payload.symbol
    })

    const response = ResponseData.success({
      message: 'Prediction generated successfully'
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
