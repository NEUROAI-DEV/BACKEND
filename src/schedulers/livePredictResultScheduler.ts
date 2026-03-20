import cron from 'node-cron'
import logger from '../utilities/logger'
import { LivePredictService } from '../services/LivePredictService'

const CRON_EVERY_1_MINUTE = '0 * * * * *'

export async function runLivePredictResultJob(): Promise<void> {
  await LivePredictService.runResultScheduler()
}

export class LivePredictResultScheduler {
  static start(): void {
    cron.schedule(
      CRON_EVERY_1_MINUTE,
      async () => {
        try {
          await runLivePredictResultJob()
        } catch (error) {
          logger.error('[LivePredictResultScheduler] Scheduler error', error)
        }
      },
      { timezone: 'Asia/Jakarta' }
    )
  }
}
