import { Op } from 'sequelize'
import { StatusCodes } from 'http-status-codes'
import logger from '../../logs'
import { LogModel } from '../models/logModel'
import type { LogLevel } from '../models/logModel'
import { AppError } from '../errors/AppError'
import { Pagination } from '../utilities/pagination'

export interface CreateLogParams {
  logLevel: LogLevel
  logMessage: string
  logSource?: string | null
  logMeta?: string | null
}

export interface FindAllLogsParams {
  page: number
  size: number
  level?: LogLevel | null
  search?: string | null
  pagination?: string | null
}

export class LogService {
  static async create(params: CreateLogParams) {
    try {
      return await LogModel.create({
        logLevel: params.logLevel,
        logMessage: params.logMessage,
        logSource: params.logSource ?? null,
        logMeta: params.logMeta ?? null
      })
    } catch (error) {
      logger.error(`[LogService] create failed: ${String(error)}`)
      throw new AppError('Failed to create log', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  static async findAll(params: FindAllLogsParams) {
    try {
      const { page, size, level, search, pagination } = params

      const paginationInfo = new Pagination(page, size)

      const where: any = {}

      if (level && ['error', 'warn', 'info'].includes(level)) {
        where.logLevel = level
      }

      if (search && String(search).trim()) {
        const term = `%${String(search).trim()}%`
        where[Op.or] = [
          { logMessage: { [Op.like]: term } },
          { logSource: { [Op.like]: term } }
        ]
      }

      const result = await LogModel.findAndCountAll({
        where,
        order: [['logId', 'DESC']],
        ...(pagination === 'true' && {
          limit: paginationInfo.limit,
          offset: paginationInfo.offset
        })
      })

      const formatted = paginationInfo.formatData(result)

      return { data: result, formatted }
    } catch (error) {
      logger.error(`[LogService] findAll failed: ${String(error)}`)
      throw new AppError('Failed to fetch logs', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}
