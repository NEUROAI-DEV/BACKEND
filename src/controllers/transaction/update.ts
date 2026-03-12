import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { TransactionService } from '../../services/TransactionService'
import type { IUpdateTransaction } from '../../schemas/TransactionSchema'

export const updateTransaction = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const body = req.body as IUpdateTransaction
    const trx = await TransactionService.update(body.transactionId, body)

    const response = ResponseData.success({
      data: trx,
      message: 'Transaction updated successfully.'
    })

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
