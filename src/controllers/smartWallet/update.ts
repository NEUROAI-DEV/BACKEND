import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { SmartWalletService } from '../../services/SmartWalletService'
import type { IUpdateSmartWallet } from '../../schemas/SmartWalletSchema'

export const updateSmartWallet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const body = req.body as IUpdateSmartWallet
    const payload: {
      smartWalletAddress?: string
      smartWalletName?: string
    } = {}

    if (body.smartWalletAddress != null)
      payload.smartWalletAddress = body.smartWalletAddress
    if (body.smartWalletName != null) payload.smartWalletName = body.smartWalletName

    const smartWallet = await SmartWalletService.update(body.smartWalletId, payload)

    const response = ResponseData.success({
      data: smartWallet,
      message: 'Smart wallet updated successfully.'
    })

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
