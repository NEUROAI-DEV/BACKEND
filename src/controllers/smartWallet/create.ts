import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { SmartWalletService } from '../../services/SmartWalletService'
import type { ICreateSmartWallet } from '../../schemas/SmartWalletSchema'

export const createSmartWallet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const body = req.body as ICreateSmartWallet
    const smartWallet = await SmartWalletService.create({
      smartWalletAddress: body.smartWalletAddress,
      smartWalletName: body.smartWalletName
    })

    const response = ResponseData.success({
      data: smartWallet,
      message: 'Smart wallet created successfully.'
    })

    return res.status(StatusCodes.CREATED).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
