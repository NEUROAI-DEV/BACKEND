import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { CoinService } from '../../services/CoinService'
import type { IUpdateCoin } from '../../schemas/CoinSchema'

export const updateCoin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body = req.body as IUpdateCoin
    const payload: { coinName?: string; coinSymbol?: string; coinImage?: string } = {}
    if (body.coinName != null) payload.coinName = body.coinName
    if (body.coinSymbol != null) payload.coinSymbol = body.coinSymbol
    if (body.coinImage !== undefined) payload.coinImage = body.coinImage

    const coin = await CoinService.update(body.coinId, payload)

    const response = ResponseData.success({
      data: coin,
      message: 'Coin updated successfully.'
    })

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
