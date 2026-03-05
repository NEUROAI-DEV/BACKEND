import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleServerError } from '../../utilities/errorHandler'
import { AiSignalService } from '../../services/llm/AiSignalService'

export const findAiSignal = async (req: Request, res: Response): Promise<Response> => {
  try {
    const result = await AiSignalService.generateSignals()

    const response = ResponseData.success({ data: result })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
