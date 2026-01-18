import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ValidationError } from 'joi'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { Pagination } from '../../utilities/pagination'
import logger from '../../logs'
import { ResponseData } from '../../utilities/response'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { findAllSmartWalletSchema } from '../../schemas/smartMoneySchema'
import { SmartWalletModel } from '../../models/smartWalletModel'
import { ISmartWalletFindAllRequest } from '../../interfaces/smartWallet/smartWallet.request'

export const findAllSmartWallet = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findAllSmartWalletSchema,
    req.query
  ) as {
    error: ValidationError
    value: ISmartWalletFindAllRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  const { page: queryPage, size: querySize, search, pagination } = validatedData

  try {
    const page = new Pagination(Number(queryPage) || 0, Number(querySize) || 10)

    const result = await SmartWalletModel.findAndCountAll({
      where: {
        deleted: 0
      },

      order: [['smartWalletId', 'desc']],
      ...(pagination === true && {
        limit: page.limit,
        offset: page.offset
      })
    })

    const response = ResponseData.success({ data: result })
    response.data = page.formatData(result)

    logger.info('Fetched all employee successfully')
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
