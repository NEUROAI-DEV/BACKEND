import { StatusCodes } from 'http-status-codes'
import { Response } from 'express'
import { ResponseData } from './response'
import logger from './logger'
import { LogService } from '../services/LogService'

export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(
    message: string,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    isOperational = true
  ) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    Object.setPrototypeOf(this, AppError.prototype)
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  static notFound(message: string): AppError {
    return new AppError(message, StatusCodes.NOT_FOUND)
  }

  static badRequest(message: string): AppError {
    return new AppError(message, StatusCodes.BAD_REQUEST)
  }

  static conflict(message: string): AppError {
    return new AppError(message, StatusCodes.CONFLICT)
  }
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
