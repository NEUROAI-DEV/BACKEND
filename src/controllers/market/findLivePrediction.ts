import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { LivePricePredictionService } from '../../services/llm/LivePricePredictionService'
import { findLivePredictionSchema } from '../../schemas/livePredictionSchema'

export const findLivePrediction = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findLivePredictionSchema,
    req.query
  )

  if (validationError) return handleValidationError(res, validationError)

  const { symbol, profile } = validatedData

  try {
    const result = await LivePricePredictionService.predict(symbol, profile)

    const response = ResponseData.success({ data: result })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
