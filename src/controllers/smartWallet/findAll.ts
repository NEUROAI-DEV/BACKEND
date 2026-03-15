import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { SmartWalletService } from '../../services/SmartWalletService'
import type { IFindAllSmartWallet } from '../../schemas/SmartWalletSchema'

export const findAllSmartWallet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const query = req.query as unknown as IFindAllSmartWallet
    const result = await SmartWalletService.findAll({
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
