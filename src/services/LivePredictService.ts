import axios from 'axios'
import { Op } from 'sequelize'
import { appConfigs } from '../configs'
import redisClient from '../configs/redis'
import { CoinModel } from '../models/coinModel'
import {
  LivePredictModel,
  type ILivePredictAttributes,
  type ILivePredictCreationAttributes
} from '../models/livePredictModel'
import { AppError } from '../utilities/errorHandler'

const PREDICT_API_DEFAULT_INTERVAL = '1h'
const LIVEPREDICT_CACHE_PREFIX = 'livepredict'
const LIVEPREDICT_CACHE_TTL_SECONDS = 60
const PREDICT_API_DEFAULT_LIMIT = 50
const PREDICT_API_DEFAULT_PREDICTION_LENGTH = 7

/** Single prediction point (from predict API, may include change_amount/change_percent). */
export interface IPredictionItem {
  timestamp: number
  datetime: string
  predicted_price: number
  change_amount?: number
  change_percent?: number
}

/** One symbol's result in live-predicts response (API fields + icon from coins table). */
export interface IPredictionResult {
  symbol: string
  icon: string
  interval: string
  last_price?: number
  change_percent?: number
  predictions: IPredictionItem[]
}

/** Raw result row from predict API (no icon). */
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

/** Normalize raw input to unique symbol list (uppercase, USDT suffix). */
function normalizeSymbolList(symbols: unknown): string[] {
  let list: string[] = []
  if (typeof symbols === 'string') {
    list = symbols
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  } else if (Array.isArray(symbols)) {
    list = symbols.map((s) => String(s).trim()).filter(Boolean)
  }
  const normalized = list.map((s) => {
    const upper = s.toUpperCase()
    return upper.endsWith('USDT') ? upper : `${upper}USDT`
  })
  return [...new Set(normalized)]
}

/** Normalize livePredictSymbols from DB (string or array) to API symbol param e.g. "BTCUSDT,ETHUSDT". */
function symbolsToPredictParam(symbols: unknown): string {
  return normalizeSymbolList(symbols).join(',')
}

/** Fetch predictions from external predict API (returns raw results without icon). */
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

/** Item shape returned by findAll (only predictions with icon, no DB fields). */
export type ILivePredictFindAllItem = {
  predictions: IPredictionResult[]
}

export type LivePredictFindAllResult = {
  items: IPredictionResult[]
  totalItems: number
  page: number
  size: number
  totalPages: number
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

  /**
   * Create or update live predict for user.
   * - Normalizes symbols (uppercase + USDT).
   * - If user already has a record: merge new symbols, skip symbols already stored (no duplicate).
   * - Only symbols that exist in coins table are added (so icon is available).
   */
  static async create(
    payload: ILivePredictCreationAttributes
  ): Promise<ILivePredictAttributes> {
    const inputSymbols = normalizeSymbolList(payload.livePredictSymbols)
    if (inputSymbols.length === 0) {
      throw AppError.badRequest(
        'livePredictSymbols minimal satu symbol (e.g. BTCUSDT,ETHUSDT)'
      )
    }

    const existingCoins = await CoinModel.findAll({
      where: { coinSymbol: { [Op.in]: inputSymbols } },
      attributes: ['coinSymbol']
    })
    const validSymbolsSet = new Set(
      existingCoins.map(
        (r) => (r.get({ plain: true }) as { coinSymbol: string }).coinSymbol
      )
    )
    const newSymbols = inputSymbols.filter((s) => validSymbolsSet.has(s))

    const existing = await LivePredictModel.findOne({
      where: { livePredictUserId: payload.livePredictUserId, deleted: 0 }
    })

    const existingSymbols = existing
      ? normalizeSymbolList(
          (existing.get({ plain: true }) as ILivePredictAttributes).livePredictSymbols
        )
      : []
    const mergedSet = new Set([...existingSymbols, ...newSymbols])
    const mergedSymbols = [...mergedSet]
    const storedValue = mergedSymbols.join(',')

    if (existing) {
      await existing.update({ livePredictSymbols: storedValue })
      await existing.reload()
      await LivePredictService.invalidateCacheForUser(payload.livePredictUserId)
      return existing.get({ plain: true }) as ILivePredictAttributes
    }

    const created = await LivePredictModel.create({
      livePredictUserId: payload.livePredictUserId,
      livePredictSymbols: storedValue
    })
    await LivePredictService.invalidateCacheForUser(payload.livePredictUserId)
    return created.get({ plain: true }) as ILivePredictAttributes
  }

  static async findAll(params: {
    page?: number
    size?: number
    livePredictUserId?: number
  }): Promise<LivePredictFindAllResult> {
    const page = params.page && params.page > 0 ? params.page : 1
    const size = params.size && params.size > 0 ? params.size : 10
    const offset = (page - 1) * size

    const cacheKey = LivePredictService.livePredictCacheKey(
      params.livePredictUserId,
      page,
      size
    )
    const cached = await redisClient.get(cacheKey)
    if (cached != null) {
      try {
        return JSON.parse(cached) as LivePredictFindAllResult
      } catch {
        await redisClient.del(cacheKey)
      }
    }

    const where: { deleted: { [Op.eq]: number }; livePredictUserId?: number } = {
      deleted: { [Op.eq]: 0 }
    }

    if (params.livePredictUserId != null) {
      where.livePredictUserId = params.livePredictUserId
    }

    const { rows, count } = await LivePredictModel.findAndCountAll({
      where,
      order: [['livePredictId', 'DESC']],
      limit: size,
      offset
    })

    const items = rows.map((row) => row.get({ plain: true }) as ILivePredictAttributes)

    const itemSymbolLists = items.map((item) =>
      symbolsToPredictParam(item.livePredictSymbols).split(',').filter(Boolean)
    )
    const allSymbolsSet = new Set<string>(itemSymbolLists.flat())
    const symbolParam = [...allSymbolsSet].join(',')

    const [results, coinRows] = await Promise.all([
      fetchPredictions(symbolParam),
      allSymbolsSet.size > 0
        ? CoinModel.findAll({
            where: { coinSymbol: { [Op.in]: [...allSymbolsSet] } },
            attributes: ['coinSymbol', 'coinImage']
          })
        : Promise.resolve([])
    ])

    const symbolToImage = new Map<string, string | null>()
    for (const row of coinRows) {
      const plain = row.get({ plain: true }) as {
        coinSymbol: string
        coinImage: string | null
      }
      symbolToImage.set(plain.coinSymbol, plain.coinImage ?? null)
    }

    const itemsWithPredictions: IPredictionResult[][] = items.map((_item, i) => {
      const symbols = itemSymbolLists[i]
      const filtered = results.filter((r) => symbols.includes(r.symbol))
      return filtered.map((r) => ({
        ...r,
        icon: symbolToImage.get(r.symbol) ?? ''
      }))
    })

    const result: LivePredictFindAllResult = {
      items: itemsWithPredictions.flat(),
      totalItems: count,
      page,
      size,
      totalPages: Math.ceil(count / size)
    }
    await redisClient.set(
      cacheKey,
      JSON.stringify(result),
      'EX',
      LIVEPREDICT_CACHE_TTL_SECONDS
    )
    return result
  }

  static async findDetail(livePredictId: number): Promise<ILivePredictAttributes> {
    const row = await LivePredictModel.findOne({
      where: { livePredictId, deleted: 0 }
    })

    if (row == null) {
      throw AppError.notFound('Live predict tidak ditemukan')
    }

    return row.get({ plain: true }) as ILivePredictAttributes
  }

  static async update(
    livePredictId: number,
    payload: Partial<Pick<ILivePredictCreationAttributes, 'livePredictSymbols'>>
  ): Promise<ILivePredictAttributes> {
    const row = await LivePredictModel.findOne({
      where: { livePredictId, deleted: 0 }
    })

    if (row == null) {
      throw AppError.notFound('Live predict tidak ditemukan')
    }

    await row.update(payload)
    return row.get({ plain: true }) as ILivePredictAttributes
  }

  static async remove(livePredictId: number): Promise<void> {
    const row = await LivePredictModel.findOne({
      where: { livePredictId, deleted: 0 }
    })

    if (row == null) {
      throw AppError.notFound('Live predict tidak ditemukan')
    }

    const userId = (row.get({ plain: true }) as ILivePredictAttributes).livePredictUserId
    await row.destroy()
    await LivePredictService.invalidateCacheForUser(userId)
  }
}
