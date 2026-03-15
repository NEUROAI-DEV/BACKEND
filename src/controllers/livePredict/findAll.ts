import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { LivePredictService } from '../../services/LivePredictService'
import type { IFindAllLivePredict } from '../../schemas/LivePredictSchema'
import type { IAuthenticatedRequest } from '../../interfaces/shared/request.interface'

export const findAllLivePredict = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req?.jwtPayload?.userId
    if (userId == null) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(ResponseData.error({ message: 'Unauthorized' }))
    }

    const query = req.query as unknown as IFindAllLivePredict
    const result = await LivePredictService.findAll({
      page: query.page,
      size: query.size,
      livePredictUserId: userId
    })

    const response = ResponseData.success({
      data: {
        items: result.items,
        totalItems: result.totalItems,
        page: result.page,
        size: result.size,
        totalPages: result.totalPages
      }
    })

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
