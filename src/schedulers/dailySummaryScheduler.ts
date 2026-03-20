import cron from 'node-cron'
import logger from '../utilities/logger'
import { DailySummaryStoreService } from '../services/DailySummaryStoreService'

const CRON_MIDNIGHT = '0 0 * * *'

export async function runDailySummaryJob(): Promise<void> {
  logger.info('[DailySummaryScheduler] Running daily summary job')

  try {
    await DailySummaryStoreService.getOrCreate(new Date())
    logger.info('[DailySummaryScheduler] Summary generated')
  } catch (error: any) {
    logger.error(`[DailySummaryScheduler] Failed: ${error.message}`)
    throw error
  }
}

const DailySummaryScheduler = () => {
  cron.schedule(
    CRON_MIDNIGHT,
    async () => {
      try {
        await runDailySummaryJob()
      } catch {
        // already logged in runDailySummaryJob
      }
    },
    { timezone: 'Asia/Jakarta' }
  )
}

export default DailySummaryScheduler
