import logger from '../../logs'
import { CoinMarketCacheService } from '../services/CoinMarketCacheService'
import cron from 'node-cron'

/** Every 15 seconds (6-field: second minute hour day month weekday) */
const CRON_EVERY_30_SECONDS = '*/30 * * * * *'

export async function runCoinMarketJob(): Promise<void> {
  await CoinMarketCacheService.runScheduler()
}

export class CoinMarketScheduler {
  static start() {
    cron.schedule(
      CRON_EVERY_30_SECONDS,
      async () => {
        try {
          await runCoinMarketJob()
        } catch (error) {
          logger.error('[CoinMarketScheduler] Scheduler error', error)
        }
      },
      { timezone: 'Asia/Jakarta' }
    )
  }
}
