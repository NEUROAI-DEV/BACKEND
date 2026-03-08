import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { WatchListService } from '../../services/WatchListService'
import type { IDeleteWatchList } from '../../schemas/WatchListSchema'

export const deleteWatchList = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { watchListId } = req.params as unknown as IDeleteWatchList
    await WatchListService.removeWatchList(Number(watchListId))
    const response = ResponseData.success({
      data: null,
      message: 'Watchlist deleted successfully.'
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
