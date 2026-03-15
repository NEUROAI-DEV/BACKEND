import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { TransactionService } from '../../services/TransactionService'
import type { IRemoveTransaction } from '../../schemas/TransactionSchema'

export const removeTransaction = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const body = req.body as IRemoveTransaction
    await TransactionService.remove(body.transactionId)

    const response = ResponseData.success({
      data: null,
      message: 'Transaction deleted successfully.'
    })

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
