import { ObjectSchema, ValidationResult } from 'joi'
import { StatusCodes } from 'http-status-codes'
import { Response } from 'express'
import { ResponseData } from './response'
import logger from '../../logs'
import { ValidationError } from 'joi'
import { LogService } from '../services/log/LogService'
import { AppError } from '../errors/AppError'

export const validateRequest = (
  schema: ObjectSchema,
  requestData: Record<string, any>
): ValidationResult => {
  return schema.validate(requestData, { abortEarly: false })
}

export function handleValidationError(res: Response, error: ValidationError) {
  const message = `Invalid request! ${error.details.map((x) => x.message).join(', ')}`
  logger.warn(message)
  LogService.create({
    logLevel: 'warn',
    logMessage: message,
    logSource: 'handleValidationError',
    logMeta: null
  }).catch(() => {})
  const response = ResponseData.error({ message })
  return res.status(StatusCodes.BAD_REQUEST).json(response)
}

export function handleServerError(res: Response, err: unknown) {
  if (err instanceof Error) {
    const message = `Unable to process request!: ${err.message}`
    logger.error(message, { stack: err.stack })
    LogService.create({
      logLevel: 'error',
      logMessage: message,
      logSource: 'handleServerError',
      logMeta: err.stack ?? null
    }).catch(() => {})
    const response = ResponseData.error({
      message: 'Unable to process request! Error code 1T33'
    })
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
  }

  const message = 'Unable to process request! Unknown error'
  logger.error(message)
  LogService.create({
    logLevel: 'error',
    logMessage: message,
    logSource: 'handleServerError',
    logMeta: null
  }).catch(() => {})
  const response = ResponseData.error({ message: 'Unable to process request!' })
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
}

/**
 * Handles errors and returns appropriate HTTP status.
 * Use for controllers: AppError -> its statusCode, other errors -> 500.
 */
export function handleError(res: Response, err: unknown): Response {
  if (err instanceof AppError) {
    logger.warn(`[AppError] ${err.statusCode}: ${err.message}`)
    return res.status(err.statusCode).json(ResponseData.error({ message: err.message }))
  }
  return handleServerError(res, err)
}
