import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { TransactionService } from '../../services/TransactionService'
import type { IFindAllTransaction } from '../../schemas/TransactionSchema'

export const findAllTransaction = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const query = req.query as unknown as IFindAllTransaction
    const result = await TransactionService.findAll({
      page: query.page,
      size: query.size,
      transactionUserId: query.transactionUserId,
      transactionStatus: query.transactionStatus
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
