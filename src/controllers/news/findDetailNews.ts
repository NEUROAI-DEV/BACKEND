import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import logger from '../../logs'
import { ValidationError } from 'joi'
import { findDetailNewsSchema } from '../../schemas/newsSchema'
import { INewsDetailRequest } from '../../interfaces/news.request'
import { NewsServices } from '../../services/news/NewsServices'

export const findDetailNews = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findDetailNewsSchema,
    req.params
  ) as {
    error: ValidationError
    value: INewsDetailRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  const { newsId } = validatedData

  try {
    const result = await NewsServices.findDetail(newsId)

    if (result == null) {
      const message = `News not found with ID: ${newsId}`
      logger.warn(message)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(ResponseData.error({ message }))
    }

    const response = ResponseData.success({ data: result })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
