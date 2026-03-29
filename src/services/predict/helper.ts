import axios from 'axios'
import { appConfigs } from '../../configs'
import type { IPredictApiResponse, IPredictApiResultRow, IPredictionResult } from './type'
import {
  PREDICT_API_DEFAULT_INTERVAL,
  PREDICT_API_DEFAULT_LIMIT,
  PREDICT_API_DEFAULT_PREDICTION_LENGTH
} from './constant'

export function normalizeSymbolUsdt(symbol: string): string {
  const upper = symbol.toUpperCase()
  return upper.endsWith('USDT') ? upper : `${upper}USDT`
}

export function uniqueNormalizedSymbols(symbols: string[]): string[] {
  return Array.from(new Set(symbols.filter(Boolean).map(normalizeSymbolUsdt)))
}

export function mapTypeToInterval(type: 'SCALPING' | 'SWING' | 'INVESTING'): string {
  if (type === 'SCALPING') {
    return '1m'
  } else if (type === 'SWING') {
    return '1h'
  } else if (type === 'INVESTING') {
    return '1d'
  }
  return '1m'
}

interface IFetchPredictionsParams {
  symbolParam: string
  interval?: string
}

export async function fetchPredictions({
  symbolParam,
  interval = PREDICT_API_DEFAULT_INTERVAL
}: IFetchPredictionsParams): Promise<IPredictApiResultRow[]> {
  if (!symbolParam) return []
  const baseUrl = appConfigs.predictApi?.baseUrl ?? 'http://localhost:8001'
  const url = `${baseUrl}/predicts`
  const params = {
    symbol: symbolParam,
    interval: interval,
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

export async function fetchPredictionBySymbol({
  symbolParam,
  interval = PREDICT_API_DEFAULT_INTERVAL
}: IFetchPredictionsParams): Promise<IPredictionResult | any> {
  if (!symbolParam) return null

  const baseUrl = appConfigs.predictApi?.baseUrl ?? 'http://localhost:8001'
  const url = `${baseUrl}/predict`
  const params = {
    symbol: symbolParam,
    interval: interval,
    limit: PREDICT_API_DEFAULT_LIMIT,
    prediction_length: PREDICT_API_DEFAULT_PREDICTION_LENGTH
  }

  try {
    const { data } = await axios.get<IPredictApiResponse>(url, { params, timeout: 30000 })
    return data ?? null
  } catch {
    return null
  }
}
