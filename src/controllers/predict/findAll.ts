import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { PredictService } from '../../services/predict/PredictService'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { type IFindAllPredict } from '../../schemas/PredictSchema'

export const findAllPredict = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const userId = req.jwtPayload?.userId
  const query = req.query as unknown as IFindAllPredict

  try {
    if (!userId) {
      const response = ResponseData.error({ message: 'Missing Authorization.' })
      return res.status(StatusCodes.UNAUTHORIZED).json(response)
    }

    const result = await PredictService.findAll({ ...query, userId })
    const response = ResponseData.success({ data: result })
    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
