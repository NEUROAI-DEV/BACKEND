import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { AppError, handleError } from '../../utilities/errorHandler'
import { WatchListService } from '../../services/WatchListService'
import type { IDeleteWatchList } from '../../schemas/WatchListSchema'
import type { IAuthenticatedRequest } from '../../interfaces/shared/request.interface'

export const deleteWatchList = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const { watchListCoinId } = req.params as unknown as IDeleteWatchList

    if (req.jwtPayload?.userId == null) {
      throw AppError.badRequest('User not found')
    }

    await WatchListService.removeWatchList(req.jwtPayload.userId, watchListCoinId)
    return res
      .status(StatusCodes.OK)
      .json(
        ResponseData.success({ data: null, message: 'Watchlist deleted successfully.' })
      )
  } catch (error) {
    return handleError(res, error)
  }
}
