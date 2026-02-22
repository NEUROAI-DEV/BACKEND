import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { type RemoveScreenerInput } from '../../schemas/ScreenerSchema'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { ScreenerService } from '../../services/ScreenerService'
import { invalidateScreenerCacheForUser } from '../../utilities/screenerCache'
import { AppError } from '../../utilities/AppError'

export const removeScreener = async (
  req: Request & IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.jwtPayload?.userId
    if (userId == null) {
      throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED)
    }

    const { screenerId } = req.params as unknown as RemoveScreenerInput

    await ScreenerService.remove(screenerId, userId)

    await invalidateScreenerCacheForUser(userId)

    return res
      .status(StatusCodes.OK)
      .json(ResponseData.success({ message: 'Screener deleted successfully' }))
  } catch (error) {
    return handleError(res, error)
  }
}
