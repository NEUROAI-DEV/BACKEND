import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { LogService } from '../../services/LogService'
import { IFindAllLog } from '../../schemas/LogSchema'

export const findAllLogs = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = req.query as unknown as IFindAllLog
    const { page = 1, size = 10, level, search, pagination } = query

    const result = await LogService.findAll({
      page,
      size,
      level: level ?? undefined,
      search: search ?? undefined,
      pagination: pagination ?? true
    })

    return res.status(StatusCodes.OK).json(ResponseData.success({ data: result }))
  } catch (error) {
    return handleError(res, error)
  }
}
