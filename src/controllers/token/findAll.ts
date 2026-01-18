import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ValidationError } from 'joi'
import {
  validateRequest,
  handleValidationError,
  handleServerError
} from '../../utilities/requestHandler'
import { Pagination } from '../../utilities/pagination'
import { ResponseData } from '../../utilities/response'
import logger from '../../logs'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { findAllTokenSchema } from '../../schemas/tokenScreenerSchema'
import { TokenScreenerService } from '../../services/token/TokenScreenerService'

export const findAllToken = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error, value } = validateRequest(findAllTokenSchema, req.query) as {
    error: ValidationError
    value: any
  }

  if (error) return handleValidationError(res, error)

  try {
    const page = new Pagination(Number(value.page) || 0, Number(value.size) || 10)

    const result = await TokenScreenerService.findAll(
      value.pagination ? page.limit : undefined,
      value.pagination ? page.offset : undefined
    )

    const response = ResponseData.success({ data: result })
    response.data = page.formatData(result)

    logger.info('Fetched token screener')
    return res.status(StatusCodes.OK).json(response)
  } catch (err) {
    return handleServerError(res, err)
  }
}
