import axios from 'axios'
import { Op } from 'sequelize'
import { appConfigs } from '../configs'
import {
  LivePredictModel,
  type ILivePredictAttributes,
  type ILivePredictCreationAttributes
} from '../models/livePredictModel'
import { AppError } from '../utilities/errorHandler'

const PREDICT_API_DEFAULT_INTERVAL = '1h'
const PREDICT_API_DEFAULT_LIMIT = 50
const PREDICT_API_DEFAULT_PREDICTION_LENGTH = 7

export interface IPredictionItem {
  timestamp: number
  datetime: string
  predicted_price: number
}

export interface IPredictionResult {
  symbol: string
  interval: string
  predictions: IPredictionItem[]
}

export interface IPredictApiResponse {
  results: IPredictionResult[]
}

/** Normalize livePredictSymbols from DB (string or array) to API symbol param e.g. "BTCUSDT,ETHUSDT". */
function symbolsToPredictParam(symbols: unknown): string {
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
  return [...new Set(normalized)].join(',')
}

/** Fetch predictions from external predict API. */
async function fetchPredictions(symbolParam: string): Promise<IPredictionResult[]> {
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

export type ILivePredictItemWithPredictions = ILivePredictAttributes & {
  predictions?: IPredictionResult[]
}

export class LivePredictService {
  static async create(
    payload: ILivePredictCreationAttributes
  ): Promise<ILivePredictAttributes> {
    const created = await LivePredictModel.create(payload)
    return created.get({ plain: true }) as ILivePredictAttributes
  }

  static async findAll(params: {
    page?: number
    size?: number
    livePredictUserId?: number
  }): Promise<{
    items: ILivePredictItemWithPredictions[]
    totalItems: number
    page: number
    size: number
    totalPages: number
  }> {
    const page = params.page && params.page > 0 ? params.page : 1
    const size = params.size && params.size > 0 ? params.size : 10
    const offset = (page - 1) * size

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

    const results = await fetchPredictions(symbolParam)

    const itemsWithPredictions: ILivePredictItemWithPredictions[] = items.map(
      (item, i) => ({
        ...item,
        predictions: results.filter((r) => itemSymbolLists[i].includes(r.symbol))
      })
    )

    return {
      items: itemsWithPredictions,
      totalItems: count,
      page,
      size,
      totalPages: Math.ceil(count / size)
    }
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

    await row.destroy()
  }
}
