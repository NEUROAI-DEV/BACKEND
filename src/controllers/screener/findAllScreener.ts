import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { ScreenerService } from '../../services/ScreenerService'
import type { IFindAllScreener } from '../../schemas/ScreenerSchema'

export const findAllScreener = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = req.query as unknown as IFindAllScreener
    const {
      category,
      page = 1,
      size = 10,
      search,
      minVolume,
      minLiquidity,
      vs_currency,
      order
    } = query

    const result = await ScreenerService.getByCategory({
      category,
      page,
      size,
      search,
      minVolume,
      minLiquidity,
      vs_currency,
      order
    })

    const response = ResponseData.success({
      data: {
        items: result.items,
        totalItems: result.totalItems,
        currentPage: page,
        totalPages: Math.ceil(result.totalItems / size)
      }
    })

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
