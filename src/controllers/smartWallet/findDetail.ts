import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { SmartWalletService } from '../../services/SmartWalletService'
import type { IFindDetailSmartWallet } from '../../schemas/SmartWalletSchema'

export const findDetailSmartWallet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const params = req.params as unknown as IFindDetailSmartWallet
    const smartWallet = await SmartWalletService.findDetail(params.smartWalletId)

    const response = ResponseData.success({ data: smartWallet })
    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
