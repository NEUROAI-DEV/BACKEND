import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { WatchListService } from '../../services/WatchListService'
import type { IGetWatchListQuery } from '../../schemas/WatchListSchema'

export const getWatchList = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = req.query as unknown as IGetWatchListQuery
    const { ids, vs_currency } = query
    const items = await WatchListService.getWatchList({ ids, vs_currency })
    const response = ResponseData.success({
      data: { items },
      message: 'Watchlist retrieved successfully.'
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
