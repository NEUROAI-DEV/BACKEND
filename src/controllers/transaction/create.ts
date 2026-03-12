import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { TransactionService } from '../../services/TransactionService'
import type { ICreateTransaction } from '../../schemas/TransactionSchema'

export const createTransaction = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const body = req.body as ICreateTransaction
    const trx = await TransactionService.create(body)

    const response = ResponseData.success({
      data: trx,
      message: 'Transaction created successfully.'
    })

    return res.status(StatusCodes.CREATED).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
