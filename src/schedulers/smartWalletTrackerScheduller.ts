import cron from 'node-cron'
import logger from '../../logs'
import { SmartWalletTrackerService } from '../services/SmartWalletTrackerService'

// Every 1 minute (second minute hour day month weekday)
const CRON_EVERY_1_MINUTE = '0 * * * * *'

export async function runSmartWalletTrackerJob(): Promise<void> {
  await SmartWalletTrackerService.getSmartWalletFlows()
}

export class SmartWalletTrackerScheduller {
  static start(): void {
    cron.schedule(
      CRON_EVERY_1_MINUTE,
      async () => {
        try {
          await runSmartWalletTrackerJob()
        } catch (error) {
          logger.error('[SmartWalletTrackerScheduller] Scheduler error', error)
        }
      },
      { timezone: 'Asia/Jakarta' }
    )
  }
}
