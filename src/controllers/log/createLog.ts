import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { type CreateLogInput } from '../../schemas/logSchema'
import { LogService } from '../../services/log/LogService'

export const createLog = async (
  req: Request<{}, {}, CreateLogInput>,
  res: Response
): Promise<Response> => {
  try {
    const { logLevel, logMessage, logSource, logMeta } = req.body

    const record = await LogService.create({
      logLevel,
      logMessage,
      logSource: logSource ?? null,
      logMeta: logMeta ?? null
    })

    return res.status(StatusCodes.CREATED).json(
      ResponseData.success({
        data: record,
        message: 'Log created successfully'
      })
    )
  } catch (error) {
    return handleError(res, error)
  }
}
