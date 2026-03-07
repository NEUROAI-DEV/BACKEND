import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { GainerLoserCoinService } from '../../services/GainerLoserCoinService'
import type { IGetTopAveragesQuery } from '../../schemas/GainerLoserSchema'

export const getTopAverages = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = req.query as unknown as IGetTopAveragesQuery
    const result = await GainerLoserCoinService.getTopAverages(query)
    const response = ResponseData.success({
      data: {
        items: result.items,
        total: result.total,
        page: query.page,
        size: query.size
      },
      message: 'Top averages (gainers/losers) retrieved successfully.'
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
