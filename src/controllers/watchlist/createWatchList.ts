import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { AppError } from '../../utilities/errorHandler'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { WatchListService } from '../../services/WatchListService'
import type { ICreateWatchList } from '../../schemas/WatchListSchema'

export const createWatchList = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.jwtPayload?.userId
    if (userId == null) {
      throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED)
    }

    const body = req.body as ICreateWatchList
    const { watchListCoinIds } = body
    const watchList = await WatchListService.createWatchList({
      watchListUserId: userId,
      watchListCoinIds
    })
    const response = ResponseData.success({
      data: {
        watchListId: watchList.watchListId,
        watchListUserId: watchList.watchListUserId,
        watchListCoinIds: watchList.watchListCoinIds
      },
      message: 'Watchlist created successfully.'
    })
    return res.status(StatusCodes.CREATED).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
