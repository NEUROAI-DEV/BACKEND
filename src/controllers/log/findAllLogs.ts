import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { type FindAllLogsInput } from '../../schemas/LogSchema'
import { LogService } from '../../services/log/LogService'

export const findAllLogs = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = req.query as unknown as FindAllLogsInput
    const { page = 1, size = 20, level, search, pagination } = query

    const { formatted } = await LogService.findAll({
      page,
      size,
      level: level ?? undefined,
      search: search ?? undefined,
      pagination: pagination ? 'true' : 'false'
    })

    return res.status(StatusCodes.OK).json(ResponseData.success({ data: formatted }))
  } catch (error) {
    return handleError(res, error)
  }
}
