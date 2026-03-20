import cron from 'node-cron'
import logger from '../utilities/logger'
import redisClient from '../configs/redis'
import { CoinMarketCacheService } from '../services/CoinMarketCacheService'

const CRON_EVERY_15_SECONDS = '*/15 * * * * *'

export class ScreenerScheduler {
  static start() {
    /**
     * Run every 15 seconds
     */
    cron.schedule(CRON_EVERY_15_SECONDS, async () => {
      try {
        logger.info('[ScreenerScheduler] Fetching top movers...')

        const items = await CoinMarketCacheService.getCachedMarkets()
        /**
         * Sort gainers
         */
        const gainers = [...items]
          .sort(
            (a, b) =>
              (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0)
          )
          .slice(0, 50)

        /**
         * Sort losers
         */
        const losers = [...items]
          .sort(
            (a, b) =>
              (a.price_change_percentage_24h ?? 0) - (b.price_change_percentage_24h ?? 0)
          )
          .slice(0, 50)

        await redisClient.set('coins:gainers', JSON.stringify(gainers))
        await redisClient.set('coins:losers', JSON.stringify(losers))

        logger.info('[ScreenerScheduler] Top movers updated')
      } catch (error) {
        logger.error('[ScreenerScheduler] Scheduler error', error)
      }
    })
  }
}
