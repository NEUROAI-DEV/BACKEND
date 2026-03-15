import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { LogService } from '../../services/LogService'
import { ICreateLog } from '../../schemas/LogSchema'

export const createLog = async (req: Request, res: Response): Promise<Response> => {
  try {
    const params = req.body as ICreateLog
    const { logLevel, logMessage, logSource, logMeta } = params

    await LogService.create({
      logLevel,
      logMessage,
      logSource: logSource ?? null,
      logMeta: logMeta ?? null
    })

    return res
      .status(StatusCodes.CREATED)
      .json(ResponseData.success({ message: 'Log created successfully' }))
  } catch (error) {
    return handleError(res, error)
  }
}
