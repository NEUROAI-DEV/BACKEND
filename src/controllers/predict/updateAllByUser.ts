import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { PredictService } from '../../services/predict/PredictService'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'

export const updateAllPredictByUser = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const userId = req.jwtPayload?.userId

  try {
    if (!userId) {
      const response = ResponseData.error({ message: 'Missing Authorization.' })
      return res.status(StatusCodes.UNAUTHORIZED).json(response)
    }

    await PredictService.updateAllByUserId(userId)
    const response = ResponseData.success({
      message: 'All predictions updated successfully'
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
