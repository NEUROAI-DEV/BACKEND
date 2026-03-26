import { WhereOptions } from 'sequelize'
import { Op } from 'sequelize'
import { AppError } from '../../utilities/errorHandler'
import { Pagination } from '../../utilities/pagination'
import logger from '../../utilities/logger'
import { StatusCodes } from 'http-status-codes'
import { fetchPredictionBySymbol, mapTypeToInterval } from './helper'
import { IPredictAttributes, PredictModel } from '../../models/predictModel'
import { IFindAllPredict } from '../../schemas/PredictSchema'
import { predictModelFillFromForecastTool } from '../llm/tools/PredictTools'

export class PredictService {
  static async findAll(params: IFindAllPredict & { userId: number }) {
    try {
      const {
        page = 0,
        size = 10,
        pagination,
        userId,
        predictSymbol,
        predictType
      } = params
      const paginationInfo = new Pagination(page, size)

      const where: WhereOptions<IPredictAttributes> = {
        deleted: 0,
        predictUserId: userId
      }

      if (predictSymbol && String(predictSymbol).trim()) {
        Object.assign(where, {
          predictSymbol: { [Op.like]: `%${String(predictSymbol).trim()}%` }
        })
      }

      if (predictType) {
        Object.assign(where, { predictType })
      }

      const result = await PredictModel.findAndCountAll({
        where,
        order: [['predictId', 'desc']],
        ...(pagination === true && {
          limit: paginationInfo.limit,
          offset: paginationInfo.offset
        })
      })

      const formattedResult = paginationInfo.formatData(result)
      return formattedResult
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[PredictService] findAll failed: ${String(error)}`)
      throw new AppError('Failed to find all predicts', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  static async runPredictions({
    type,
    userId,
    symbol,
    icon
  }: {
    type: 'SCALPING' | 'SWING' | 'INVESTING'
    userId: number
    symbol: string
    icon: string
  }): Promise<void> {
    try {
      const interval = mapTypeToInterval(type)

      const results = await fetchPredictionBySymbol({ symbolParam: symbol, interval })
      const forecast = Array.isArray(results) ? results[0] : results

      if (!forecast) return

      const computed = await predictModelFillFromForecastTool.invoke({
        symbol: forecast.symbol,
        interval: forecast.interval,
        last_price: forecast.last_price ?? 0,
        change_percent: forecast.change_percent ?? 0,
        predictions: forecast.predictions ?? []
      })

      const existing = await PredictModel.findOne({
        where: {
          predictUserId: userId,
          predictSymbol: symbol,
          predictType: type,
          deleted: 0
        }
      })

      if (existing) {
        await existing.update({
          predictPrice: computed.predictPrice,
          predictTakeProfit: computed.predictTakeProfit,
          predictStopLoss: computed.predictStopLoss,
          predictEntryPrice: computed.predictEntryPrice,
          predictReason: computed.predictReason,
          predictPotentialGain: computed.predictPotentialGain,
          predictPotentialLoss: computed.predictPotentialLoss,
          predictionDirection: computed.predictionDirection,
          predictionLastUpdated: new Date(),
          predictCoinIcon: icon
        })
        await existing.reload()
      } else {
        await PredictModel.create({
          predictUserId: userId,
          predictSymbol: symbol,
          predictCoinIcon: icon,
          predictType: type,
          predictPrice: computed.predictPrice,
          predictTakeProfit: computed.predictTakeProfit,
          predictStopLoss: computed.predictStopLoss,
          predictEntryPrice: computed.predictEntryPrice,
          predictReason: computed.predictReason,
          predictPotentialGain: computed.predictPotentialGain,
          predictPotentialLoss: computed.predictPotentialLoss,
          predictionDirection: computed.predictionDirection,
          predictionLastUpdated: new Date()
        })
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[PredictService] runPredictions failed: ${String(error)}`)
      throw new AppError('Failed to run predictions', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Update/refresh all predictions for a given userId.
   * This re-runs prediction computation for every existing predict row of the user.
   */
  static async updateAllByUserId(userId: number): Promise<void> {
    try {
      const rows = await PredictModel.findAll({
        where: { predictUserId: userId, deleted: 0 }
      })

      if (rows.length === 0) return

      for (const row of rows) {
        const plain = row.get({ plain: true }) as IPredictAttributes
        const type = (plain.predictType ?? 'SCALPING') as
          | 'SCALPING'
          | 'SWING'
          | 'INVESTING'

        try {
          await this.runPredictions({
            userId,
            type,
            symbol: plain.predictSymbol,
            icon: plain.predictCoinIcon
          })
        } catch (err) {
          logger.warn(
            `[PredictService] updateAllByUserId skipped symbol=${plain.predictSymbol}: ${String(err)}`
          )
        }
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[PredictService] updateAllByUserId failed: ${String(error)}`)
      throw new AppError(
        'Failed to update all predictions for user',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async remove(predictId: number, userId: number): Promise<void> {
    try {
      const row = await PredictModel.findOne({
        where: { predictId: predictId, predictUserId: userId, deleted: 0 }
      })

      if (row == null) {
        throw AppError.notFound('Predict tidak ditemukan')
      }

      await row.update({ deleted: true })
      await row.destroy()
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[PredictService] remove failed: ${String(error)}`)
      throw new AppError('Failed to remove predict', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}
