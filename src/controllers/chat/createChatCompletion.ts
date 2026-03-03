import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { ChatParams, ChatService } from '../../services/llm/ChatService'

export const createChatCompletion = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const params = req.body as ChatParams
  try {
    const result = await ChatService.chat(params)
    const response = ResponseData.success({ data: result })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleError(res, serverError)
  }
}
