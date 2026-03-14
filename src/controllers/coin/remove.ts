import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { CoinService } from '../../services/CoinService'
import type { IRemoveCoin } from '../../schemas/CoinSchema'

export const removeCoin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const params = req.params as unknown as IRemoveCoin
    await CoinService.remove(params.coinId)

    const response = ResponseData.success({
      data: null,
      message: 'Coin deleted successfully.'
    })

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
