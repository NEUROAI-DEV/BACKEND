import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { PredictService } from '../../services/predict/PredictService'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'

export const removePredict = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const userId = req.jwtPayload?.userId
  const predictId = Number(req.params.predictId)

  try {
    if (!userId) {
      const response = ResponseData.error({ message: 'Missing Authorization.' })
      return res.status(StatusCodes.UNAUTHORIZED).json(response)
    }

    if (!Number.isFinite(predictId) || predictId <= 0) {
      const response = ResponseData.error({ message: 'Invalid predictId' })
      return res.status(StatusCodes.BAD_REQUEST).json(response)
    }

    await PredictService.remove(predictId, userId)
    const response = ResponseData.success({ message: 'Predict removed successfully' })
    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
