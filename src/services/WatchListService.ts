import {
  IWatchListAttributes,
  IWatchListCreationAttributes,
  WatchListModel
} from '../models/watchListModel'
import { AppError } from '../utilities/errorHandler'
import { CoinGeckoService } from './external/CoinGeckoService'
import type { ICoinGeckoMarketItem } from './external/CoinGeckoService'

export type GetWatchListParams = {
  ids: string[]
  vs_currency?: string
}

export class WatchListService {
  static async getWatchList(params: GetWatchListParams): Promise<ICoinGeckoMarketItem[]> {
    const { ids, vs_currency = 'usd' } = params
    const result = await CoinGeckoService.getCoinsByIds(ids, vs_currency)
    return result
  }

  /**
   * Parse watchListCoinIds string to array, then return unique values as comma-separated string.
   * Accepts JSON array string (e.g. '["bitcoin","ethereum"]') or comma-separated (e.g. 'bitcoin,ethereum').
   * Output is always comma-separated (e.g. 'bitcoin,ethereum,solana,pepe'). No duplicate coin id.
   */
  static normalizeUniqueCoinIds(watchListCoinIds: string): string {
    let ids: string[]
    const trimmed = String(watchListCoinIds ?? '').trim()
    if (!trimmed) return ''
    try {
      const parsed = JSON.parse(trimmed)
      ids = Array.isArray(parsed)
        ? parsed.map((id: unknown) => String(id).trim()).filter(Boolean)
        : [trimmed]
    } catch {
      ids = trimmed
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
    }
    const unique = [...new Set(ids)]
    return unique.join(',')
  }

  static async createWatchList(
    params: IWatchListCreationAttributes
  ): Promise<IWatchListAttributes> {
    const { watchListUserId, watchListCoinIds } = params
    const uniqueCoinIds = WatchListService.normalizeUniqueCoinIds(watchListCoinIds)
    const newWatchList = await WatchListModel.create({
      watchListUserId,
      watchListCoinIds: uniqueCoinIds
    })
    return newWatchList
  }

  static async removeWatchList(watchListId: number): Promise<void> {
    const row = await WatchListModel.findByPk(watchListId)
    if (row == null) {
      throw AppError.notFound(`Watchlist not found with ID: ${watchListId}`)
    }
    await row.destroy()
  }

  /**
   * Ensures all stored watchListCoinIds in the database are unique (no duplicate coin id per row).
   * Updates rows where the stored value differs from the normalized unique value.
   * Call once to fix existing data or run periodically.
   */
  static async ensureStoredCoinIdsUnique(): Promise<{ updated: number }> {
    const rows = await WatchListModel.findAll({
      attributes: ['watchListId', 'watchListCoinIds']
    })
    let updated = 0
    for (const row of rows) {
      const normalized = WatchListService.normalizeUniqueCoinIds(row.watchListCoinIds)
      if (normalized !== row.watchListCoinIds) {
        await WatchListModel.update(
          { watchListCoinIds: normalized },
          { where: { watchListId: row.watchListId } }
        )
        updated += 1
      }
    }
    return { updated }
  }
}
