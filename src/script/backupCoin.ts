/**
 * Script: backup top coins from CoinGecko into the coins table.
 * - Fetches top coins by market cap from CoinGecko API.
 * - Inserts or updates by coinSymbol (uppercase) so no duplicates.
 *
 * Run: npx tsx src/script/backupCoin.ts
 *
 * Requires: COINGECKO_BASE_URL (or default), DB_* in .env for database.
 */
import dotenv from 'dotenv'
dotenv.config()

import { sequelizeInit } from '../configs/database'
import { CoinModel } from '../models/coinModel'
import { CoinGeckoService } from '../services/external/CoinGeckoService'
import type { ICoinGeckoMarketItem } from '../services/external/CoinGeckoService'

const TOP_COINS_PER_PAGE = 100

function normalizeSymbol(symbol: string | undefined, id: string): string {
  const raw = (symbol || id || '').trim().toUpperCase()
  return raw || 'UNKNOWN'
}

async function run(): Promise<void> {
  await sequelizeInit.authenticate()

  const data = await CoinGeckoService.getMarkets({
    vs_currency: 'usd',
    per_page: TOP_COINS_PER_PAGE,
    page: 1
  })

  const items = Array.isArray(data) ? (data as ICoinGeckoMarketItem[]) : []
  if (items.length === 0) {
    console.log('[backupCoin] No coins returned from CoinGecko.')
    return
  }

  let created = 0
  let updated = 0

  for (const row of items) {
    const coinSymbol = normalizeSymbol(row.symbol, row.id)
    const coinName = (row.name || row.id || '').trim() || coinSymbol
    const coinImage = typeof row.image === 'string' ? row.image.trim() : ''

    const existing = await CoinModel.findOne({
      where: { coinSymbol }
    })

    if (existing) {
      await existing.update({
        coinName,
        coinImage: coinImage || existing.coinImage
      })
      updated += 1
    } else {
      await CoinModel.create({
        coinName,
        coinSymbol,
        coinImage: coinImage || ''
      })
      created += 1
    }
  }

  console.log(
    `[backupCoin] Done. Created: ${created}, Updated: ${updated}, Total processed: ${items.length}`
  )
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[backupCoin] Error:', err)
    process.exit(1)
  })
  .finally(() => {
    sequelizeInit.close().catch(() => {})
  })
