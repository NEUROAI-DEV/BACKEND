import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { TrendingCoinService } from '../../services/TrendingCoinService'
import type { IGetTrendingCoinsQuery } from '../../schemas/TrendingCoinSchema'

export const getTrendingCoins = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { limit } = req.query as unknown as IGetTrendingCoinsQuery
    const data = await TrendingCoinService.getTrendingCoins()
    const items = limit != null ? data.slice(0, limit) : data
    const response = ResponseData.success({
      data: { items },
      message: 'Trending coins retrieved successfully.'
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
