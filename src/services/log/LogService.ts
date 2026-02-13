import { Op } from 'sequelize'
import { LogModel } from '../../models/logModel'
import type { LogLevel } from '../../models/logModel'

export interface CreateLogParams {
  logLevel: LogLevel
  logMessage: string
  logSource?: string | null
  logMeta?: string | null
}

export interface FindAllLogsParams {
  page: number
  limit: number
  level?: LogLevel | null
  search?: string | null
}

export class LogService {
  static async create(params: CreateLogParams) {
    return LogModel.create({
      logLevel: params.logLevel,
      logMessage: params.logMessage,
      logSource: params.logSource ?? null,
      logMeta: params.logMeta ?? null
    })
  }

  static async findAll(params: FindAllLogsParams) {
    const { page, limit, level, search } = params

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

    const { count, rows } = await LogModel.findAndCountAll({
      where,
      order: [['logId', 'DESC']],
      limit,
      offset: (page - 1) * limit
    })

    const totalPages = Math.ceil(count / limit) || 1

    return {
      items: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages
      }
    }
  }
}
