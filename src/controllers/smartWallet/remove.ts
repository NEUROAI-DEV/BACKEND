import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { SmartWalletService } from '../../services/SmartWalletService'
import type { IRemoveSmartWallet } from '../../schemas/SmartWalletSchema'

export const removeSmartWallet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const params = req.params as unknown as IRemoveSmartWallet
    await SmartWalletService.remove(params.smartWalletId)

    const response = ResponseData.success({
      data: null,
      message: 'Smart wallet deleted successfully.'
    })

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
