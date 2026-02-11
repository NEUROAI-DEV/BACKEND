import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import logger from '../../logs'
import { ValidationError } from 'joi'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { removeScreenerSchema } from '../../schemas/screenerSchema'
import { IScreenerRemoveRequest } from '../../interfaces/screener.request'
import { ScreenerModel } from '../../models/screenerModel'
import { invalidateScreenerCacheForUser } from '../../utilities/screenerCache'

export const removeScreener = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    removeScreenerSchema,
    req.params
  ) as {
    error: ValidationError
    value: IScreenerRemoveRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  const userId = req.jwtPayload?.userId
  if (userId == null) {
    const response = ResponseData.error({ message: 'Unauthorized' })
    return res.status(StatusCodes.UNAUTHORIZED).json(response)
  }

  const { screenerId } = validatedData

  try {
    const result = await ScreenerModel.findOne({
      where: {
        screenerId,
        screenerUserId: userId
      }
    })

    if (result == null) {
      const message = `Screener not found with ID: ${screenerId}`
      logger.warn(message)
      return res.status(StatusCodes.NOT_FOUND).json(ResponseData.error({ message }))
    }

    await result.destroy()

    await invalidateScreenerCacheForUser(userId)

    const response = ResponseData.success({
      message: 'Screener deleted successfully'
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
