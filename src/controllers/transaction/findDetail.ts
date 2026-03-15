import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { TransactionService } from '../../services/TransactionService'
import type { IFindDetailTransaction } from '../../schemas/TransactionSchema'

export const findDetailTransaction = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const params = req.params as unknown as IFindDetailTransaction
    const trx = await TransactionService.findDetail(params.transactionId)

    const response = ResponseData.success({
      data: trx
    })

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
