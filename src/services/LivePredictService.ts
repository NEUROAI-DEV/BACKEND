import axios from 'axios'
import { Op, WhereOptions } from 'sequelize'
import { appConfigs } from '../configs'
import redisClient from '../configs/redis'
import {
  LivePredictModel,
  type ILivePredictAttributes,
  type ILivePredictCreationAttributes
} from '../models/livePredictModel'
import { AppError } from '../utilities/errorHandler'
import { Pagination } from '../utilities/pagination'
import { IFindAllLivePredict } from '../schemas/LivePredictSchema'
import logger from '../../logs'
import { StatusCodes } from 'http-status-codes'

const PREDICT_API_DEFAULT_INTERVAL = '1m'
const LIVEPREDICT_CACHE_PREFIX = 'livepredict'
const PREDICT_API_DEFAULT_LIMIT = 50
const PREDICT_API_DEFAULT_PREDICTION_LENGTH = 7

export interface IPredictionItem {
  timestamp: number
  datetime: string
  predicted_price: number
  change_amount?: number
  change_percent?: number
}

export interface IPredictionResult {
  symbol: string
  icon: string
  interval: string
  last_price?: number
  change_percent?: number
  predictions: IPredictionItem[]
}

interface IPredictApiResultRow {
  symbol: string
  interval: string
  last_price?: number
  change_percent?: number
  predictions: IPredictionItem[]
}

export interface IPredictApiResponse {
  results: IPredictApiResultRow[]
}

async function fetchPredictions(symbolParam: string): Promise<IPredictApiResultRow[]> {
  if (!symbolParam) return []
  const baseUrl = appConfigs.predictApi?.baseUrl ?? 'http://localhost:8001'
  const url = `${baseUrl}/predicts`
  const params = {
    symbol: symbolParam,
    interval: PREDICT_API_DEFAULT_INTERVAL,
    limit: PREDICT_API_DEFAULT_LIMIT,
    prediction_length: PREDICT_API_DEFAULT_PREDICTION_LENGTH
  }
  try {
    const { data } = await axios.get<IPredictApiResponse>(url, { params, timeout: 30000 })
    return data?.results ?? []
  } catch {
    return []
  }
}

export class LivePredictService {
  private static livePredictCacheKey(
    livePredictUserId: number | undefined,
    page: number,
    size: number
  ): string {
    const userPart = livePredictUserId != null ? String(livePredictUserId) : 'all'
    return `${LIVEPREDICT_CACHE_PREFIX}:${userPart}:${page}:${size}`
  }

  private static async invalidateCacheForUser(livePredictUserId: number): Promise<void> {
    const pattern = `${LIVEPREDICT_CACHE_PREFIX}:${livePredictUserId}:*`
    const keys = await redisClient.keys(pattern)
    if (keys.length > 0) {
      await redisClient.del(...keys)
    }
    const allPattern = `${LIVEPREDICT_CACHE_PREFIX}:all:*`
    const allKeys = await redisClient.keys(allPattern)
    if (allKeys.length > 0) {
      await redisClient.del(...allKeys)
    }
  }

  static async create(
    payload: ILivePredictCreationAttributes
  ): Promise<ILivePredictAttributes> {
    try {
      const existing = await LivePredictModel.findOne({
        where: { livePredictSymbol: payload.livePredictSymbol, deleted: 0 }
      })

      if (existing) {
        await existing.update({
          livePredictIcon: payload.livePredictIcon,
          livePredictInterval: payload.livePredictInterval,
          livePredictLastPrice: payload.livePredictLastPrice,
          livePredictResults: payload.livePredictResults
        })
        await existing.reload()
        return existing.get({ plain: true }) as ILivePredictAttributes
      }

      const created = await LivePredictModel.create(payload)
      return created.get({ plain: true }) as ILivePredictAttributes
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[LivePredictService] create failed: ${String(error)}`)
      throw new AppError(
        'Failed to create live predict',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async findAll(params: IFindAllLivePredict) {
    try {
      const { page = 0, size = 10, pagination } = params
      const paginationInfo = new Pagination(page, size)

      const where: WhereOptions<ILivePredictAttributes> = {
        deleted: 0
      }

      const result = await LivePredictModel.findAndCountAll({
        where,
        order: [['livePredictId', 'desc']],
        ...(pagination === true && {
          limit: paginationInfo.limit,
          offset: paginationInfo.offset
        })
      })

      const formattedResult = paginationInfo.formatData(result)
      return formattedResult
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[LivePredictService] findAll failed: ${String(error)}`)
      throw new AppError(
        'Failed to find all live predicts',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async runResultScheduler(): Promise<void> {
    try {
      const configs = await LivePredictModel.findAll({
        where: { deleted: 0 }
      })

      if (configs.length === 0) return

      const symbols = configs
        .map((row) => {
          const plain = row.get({ plain: true }) as ILivePredictAttributes
          return plain.livePredictSymbol
        })
        .filter(Boolean)

      const normalizedSymbols = Array.from(
        new Set(
          symbols.map((s) => {
            const upper = s.toUpperCase()
            return upper.endsWith('USDT') ? upper : `${upper}USDT`
          })
        )
      )

      if (normalizedSymbols.length === 0) return

      const symbolParam = normalizedSymbols.join(',')
      const results = await fetchPredictions(symbolParam)

      if (results.length === 0) return

      const resultMap = new Map<string, IPredictApiResultRow>()
      for (const r of results) {
        resultMap.set(r.symbol, r)
      }

      await LivePredictModel.sequelize!.transaction(async (t) => {
        for (const row of configs) {
          const plain = row.get({ plain: true }) as ILivePredictAttributes
          const symbolUpper = plain.livePredictSymbol.toUpperCase()
          const symbolKey = symbolUpper.endsWith('USDT')
            ? symbolUpper
            : `${symbolUpper}USDT`

          const match = resultMap.get(symbolKey)
          if (!match) continue

          const lastPrice = match.last_price ?? 0
          const predictions = (match.predictions ?? []).map((p) => ({
            timestamp: p.timestamp,
            datetime: p.datetime,
            predicted_price: p.predicted_price,
            change_amount: p.change_amount ?? 0,
            change_percent: p.change_percent ?? 0
          }))

          await row.update(
            {
              livePredictInterval: match.interval,
              livePredictLastPrice: lastPrice,
              livePredictResults: predictions
            },
            { transaction: t }
          )
        }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[LivePredictService] runResultScheduler failed: ${String(error)}`)
      throw new AppError(
        'Failed to run result scheduler',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async findDetail(livePredictId: number): Promise<ILivePredictAttributes> {
    try {
      const row = await LivePredictModel.findOne({
        where: { livePredictId, deleted: 0 }
      })

      if (row == null) {
        throw AppError.notFound('Live predict tidak ditemukan')
      }

      return row.get({ plain: true }) as ILivePredictAttributes
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[LivePredictService] findDetail failed: ${String(error)}`)
      throw new AppError(
        'Failed to find live predict detail',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async update(
    livePredictId: number,
    payload: Partial<ILivePredictCreationAttributes>
  ): Promise<ILivePredictAttributes> {
    try {
      const row = await LivePredictModel.findOne({
        where: { livePredictId, deleted: 0 }
      })

      if (row == null) {
        throw AppError.notFound('Live predict tidak ditemukan')
      }

      await row.update(payload)
      return row.get({ plain: true }) as ILivePredictAttributes
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[LivePredictService] update failed: ${String(error)}`)
      throw new AppError(
        'Failed to update live predict',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async remove(livePredictId: number): Promise<void> {
    try {
      const row = await LivePredictModel.findOne({
        where: { livePredictId, deleted: 0 }
      })

      if (row == null) {
        throw AppError.notFound('Live predict tidak ditemukan')
      }

      await row.destroy()
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[LivePredictService] remove failed: ${String(error)}`)
      throw new AppError(
        'Failed to remove live predict',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }
}
