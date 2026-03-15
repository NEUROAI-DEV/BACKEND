import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { CoinService } from '../../services/CoinService'
import type { IFindAllCoin } from '../../schemas/CoinSchema'

export const findAllCoin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = req.query as unknown as IFindAllCoin
    const result = await CoinService.findAll({
      page: query.page,
      size: query.size,
      search: query.search
    })
    const response = ResponseData.success({
      data: {
        items: result.items,
        totalItems: result.totalItems,
        page: result.page,
        size: result.size,
        totalPages: result.totalPages
      }
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
