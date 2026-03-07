import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { ScreenerService } from '../../services/ScreenerService'
import { invalidateScreenerCacheForUser } from '../../utilities/screenerCache'
import { AppError } from '../../utilities/errorHandler'
import { IRemoveScreener } from '../../schemas/ScreenerSchema'

export const removeScreener = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.jwtPayload?.userId
    if (userId == null) {
      throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED)
    }

    const { screenerId } = req.params as unknown as IRemoveScreener

    await ScreenerService.remove(screenerId, userId)

    await invalidateScreenerCacheForUser(userId)

    return res
      .status(StatusCodes.OK)
      .json(ResponseData.success({ message: 'Screener deleted successfully' }))
  } catch (error) {
    return handleError(res, error)
  }
}
