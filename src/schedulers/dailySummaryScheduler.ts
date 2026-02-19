import cron from 'node-cron'
import logger from '../../logs'
import { DailySummaryStoreService } from '../services/summary/DailySummaryStoreService'

const DailySummaryScheduler = () => {
  cron.schedule(
    '*/1 * * * *',
    async () => {
      logger.info('[DailySummaryScheduler] Running daily summary job')

      try {
        await DailySummaryStoreService.getOrCreate(new Date())

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
