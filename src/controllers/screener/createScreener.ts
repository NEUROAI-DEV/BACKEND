import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { createScreenerSchema } from '../../schemas/screenerSchema'
import { ScreenerService } from '../../services/screener/ScreenerService'
import { invalidateScreenerCacheForUser } from '../../utilities/screenerCache'

export const createScreener = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    createScreenerSchema,
    req.body
  )

  if (validationError) return handleValidationError(res, validationError)

  const userId = req.jwtPayload?.userId
  if (userId == null) {
    const response = ResponseData.error({ message: 'Unauthorized' })
    return res.status(StatusCodes.UNAUTHORIZED).json(response)
  }

  const { screenerCoinSymbol, screenerProfile } = validatedData

  try {
    const record = await ScreenerService.create({
      screenerUserId: userId,
      screenerCoinSymbol,
      screenerProfile
    })

    await invalidateScreenerCacheForUser(userId)

    const response = ResponseData.success({
      data: record,
      message: 'Screener created successfully'
    })
    return res.status(StatusCodes.CREATED).json(response)
  } catch (serverError) {
    if (serverError instanceof Error && (serverError as any).statusCode === 400) {
      const response = ResponseData.error({ message: serverError.message })
      return res.status(StatusCodes.BAD_REQUEST).json(response)
    }
    return handleServerError(res, serverError)
  }
}
