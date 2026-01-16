import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { Pagination } from '../../utilities/pagination'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { ValidationError } from 'joi'
import { findAllTransactionSchema } from '../../schemas/transactionSchema'
import { ITransactionFindAllRequest } from '../../interfaces/transaction/transacrtion.request'
import { TransactionModel } from '../../models/transactionModel'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'

export const findAllTransaction = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findAllTransactionSchema,
    req.query
  ) as {
    error: ValidationError
    value: ITransactionFindAllRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  try {
    const { page: queryPage, size: querySize, pagination, search } = validatedData

    const page = new Pagination(Number(queryPage) || 0, Number(querySize) || 10)

    const result = await TransactionModel.findAndCountAll({
      where: {
        deleted: 0,
        transactionCompanyId: req?.membershipPayload?.membershipCompanyId
      },

      order: [['transactionId', 'desc']],
      ...(pagination === true && {
        limit: page.limit,
        offset: page.offset
      })
    })

    const response = ResponseData.success({ data: result })
    response.data = page.formatData(result)

    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
