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
import { addTokenSchema, findAllTokenSchema } from '../../schemas/tokenScreenerSchema'
import { TokenScreenerService } from '../../services/token/TokenScreenerService'

export const createToken = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error, value } = validateRequest(addTokenSchema, req.body) as {
    error: ValidationError
    value: { contractAddress: string }
  }

  if (error) return handleValidationError(res, error)

  try {
    await TokenScreenerService.addToken(value.contractAddress)
    return res.status(StatusCodes.CREATED).json(ResponseData.success({}))
  } catch (err) {
    return handleServerError(res, err)
  }
}

export const findAll = async (
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
