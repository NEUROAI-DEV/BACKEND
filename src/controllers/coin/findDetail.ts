import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { CoinService } from '../../services/CoinService'
import type { IFindDetailCoin } from '../../schemas/CoinSchema'

export const findDetailCoin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const params = req.params as unknown as IFindDetailCoin
    const coin = await CoinService.findDetail(params.coinId)
    const response = ResponseData.success({ data: coin })
    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
