import cron from 'node-cron'
import logger from '../logs'
import { DailySummaryStoreService } from '../services/summary/DailySummaryStoreService'

const DailySummaryScheduler = () => {
  cron.schedule(
    '*/1 * * * *', // setiap hari jam 00:05
    async () => {
      logger.info('[DailySummaryScheduler] Running daily summary job')

      try {
        const result = await DailySummaryStoreService.getOrCreate(new Date())

        logger.info(`[DailySummaryScheduler] Summary generated`)
      } catch (error: any) {
        logger.error(`[DailySummaryScheduler] Failed: ${error.message}`)
      }
    },
    {
      timezone: 'Asia/Jakarta'
    }
  )
}

export default DailySummaryScheduler
