import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { findAllScreenerSchema } from '../../schemas/screenerSchema'
import { ScreenerService } from '../../services/screener/ScreenerService'

export const findAllScreener = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findAllScreenerSchema,
    req.query
  )

  if (validationError) return handleValidationError(res, validationError)

  const userId = req.jwtPayload?.userId
  if (userId == null) {
    const response = ResponseData.error({ message: 'Unauthorized' })
    return res.status(StatusCodes.UNAUTHORIZED).json(response)
  }

  const { page, limit, search } = validatedData

  try {
    const result = await ScreenerService.findAll({
      screenerUserId: userId,
      page,
      limit,
      search
    })

    const response = ResponseData.success({ data: result })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
