import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ValidationError } from 'joi'
import {
  validateRequest,
  handleValidationError,
  handleServerError
} from '../../utilities/requestHandler'
import { ResponseData } from '../../utilities/response'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { addTokenSchema } from '../../schemas/tokenScreenerSchema'
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
    console.log(err)
    return handleServerError(res, err)
  }
}
