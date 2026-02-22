import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { ChatService } from '../../services/llm/ChatService'
import { chatRequestSchema } from '../../schemas/ChatSchema'

export const createChatCompletion = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    chatRequestSchema,
    req.body
  )

  if (validationError) return handleValidationError(res, validationError)

  const { message, context } = validatedData

  try {
    const result = await ChatService.chat(message, context)

    const response = ResponseData.success({ data: result })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
