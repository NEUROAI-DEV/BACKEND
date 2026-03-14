import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { TransactionService } from '../../services/TransactionService'
import type { ICreateTransaction } from '../../schemas/TransactionSchema'
import type { IAuthenticatedRequest } from '../../interfaces/shared/request.interface'

export const createTransaction = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req?.jwtPayload?.userId
    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(ResponseData.error({ message: 'Unauthorized' }))
    }

    const body = req.body as ICreateTransaction

    const trx = await TransactionService.create({
      transactionSubscriptionPlanId: body.transactionSubscriptionPlanId!,
      transactionUserId: userId
    })

    const response = ResponseData.success({
      data: trx,
      message: 'Transaction created successfully.'
    })

    return res.status(StatusCodes.CREATED).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
