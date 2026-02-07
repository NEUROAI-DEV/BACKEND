import { findAiSignal } from './findAiSignal'
import { findDailySummary } from './findDailySummary'
import { findLivePrediction } from './findLivePrediction'
import { findTopSignal } from './findTopSignal'
import { findUsdtSymbols } from './findUsdtSymbols'

export const MarketController = {
  findTopSignal,
  findDailySummary,
  findAiSignal,
  findLivePrediction,
  findUsdtSymbols
}
