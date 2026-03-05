import { findAiSignal } from './findAiSignal'
import { findDailySummary } from './findDailySummary'
import { findTopSignal } from './findTopSignal'
import { findAllCoin } from './findAllCoin'
import { getTrendingCoins } from './getTrendingCoins'

export const MarketController = {
  findTopSignal,
  findDailySummary,
  findAiSignal,
  findAllCoin,
  getTrendingCoins
}
