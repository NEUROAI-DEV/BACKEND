import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { AppError } from '../../utilities/errorHandler'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { WatchListService } from '../../services/WatchListService'
import type { IGetWatchListQuery } from '../../schemas/WatchListSchema'

export const getWatchList = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.jwtPayload?.userId
    if (userId == null) {
      throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED)
    }

    const query = req.query as unknown as IGetWatchListQuery
    const { vs_currency } = query
    const items = await WatchListService.getWatchList({
      watchListUserId: userId,
      vs_currency
    })
    const response = ResponseData.success({
      data: { items },
      message: 'Watchlist retrieved successfully.'
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
