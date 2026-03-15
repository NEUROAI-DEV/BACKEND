import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { CoinService } from '../../services/CoinService'
import type { ICreateCoin } from '../../schemas/CoinSchema'

export const createCoin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body = req.body as ICreateCoin
    const coin = await CoinService.create({
      coinName: body.coinName,
      coinSymbol: body.coinSymbol,
      coinImage: body.coinImage ?? ''
    })

    const response = ResponseData.success({
      data: coin,
      message: 'Coin created successfully.'
    })

    return res.status(StatusCodes.CREATED).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
