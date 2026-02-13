import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { LogService } from '../../services/log/LogService'
import { findAllLogsSchema } from '../../schemas/logSchema'

export const findAllLogs = async (req: Request, res: Response): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findAllLogsSchema,
    req.query
  )

  if (validationError) return handleValidationError(res, validationError)

  const { page, size, level, search } = validatedData

  try {
    const result = await LogService.findAll({
      page,
      limit: size,
      level: level || undefined,
      search
    })

    const response = ResponseData.success({
      data: {
        items: result.items,
        totalItems: result.pagination.total,
        currentPage: result.pagination.page,
        totalPages: result.pagination.totalPages
      }
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
