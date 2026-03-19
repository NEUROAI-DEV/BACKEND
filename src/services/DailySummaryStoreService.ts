import logger from '../../logs'
import { DailySummaryModel } from '../models/dailySummaryModel'
import { AppError } from '../utilities/errorHandler'
import { StatusCodes } from 'http-status-codes'

export class DailySummaryStoreService {
  static async getOrCreate(date: Date) {
    try {
      const dateOnly = date.toLocaleDateString('en-CA', {
        timeZone: 'Asia/Jakarta'
      })

      const existing = await DailySummaryModel.findOne({
        where: {
          dailySummaryDate: dateOnly
        }
      })

      if (existing) {
        return existing
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[DailySummaryStoreService] getOrCreate failed: ${String(error)}`)
      throw new AppError(
        'Failed to get or create daily summary',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async get(date: Date) {
    try {
      const dateOnly = date.toLocaleDateString('en-CA', {
        timeZone: 'Asia/Jakarta'
      })

      const existing = await DailySummaryModel.findOne({
        where: {
          dailySummaryDate: dateOnly
        }
      })

      return existing
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[DailySummaryStoreService] get failed: ${String(error)}`)
      throw new AppError('Failed to get daily summary', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}
