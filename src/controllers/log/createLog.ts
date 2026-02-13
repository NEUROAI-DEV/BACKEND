import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { LogService } from '../../services/log/LogService'
import { createLogSchema } from '../../schemas/logSchema'

export const createLog = async (req: Request, res: Response): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    createLogSchema,
    req.body
  )

  if (validationError) return handleValidationError(res, validationError)

  const { logLevel, logMessage, logSource, logMeta } = validatedData

  try {
    const record = await LogService.create({
      logLevel,
      logMessage,
      logSource: logSource || null,
      logMeta: logMeta || null
    })

    const response = ResponseData.success({
      data: record,
      message: 'Log created successfully'
    })
    return res.status(StatusCodes.CREATED).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
