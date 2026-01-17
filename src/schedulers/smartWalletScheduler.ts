import cron from 'node-cron'
import logger from '../logs'
import { SmartWalletBatchService } from '../services/wallet/SmartWalletBatchService'

// export const smartWalletScheduler = () => {
//   // jalan tiap 6 jam
//   cron.schedule('0 */6 * * *', async () => {
//     logger.info('Smart wallet scheduler started')

//     await syncAllSmartWallets()

//     logger.info('Smart wallet scheduler finished')
//   })
// }

cron.schedule(
  '* * * * *',
  async () => {
    logger.info('[Scheduler]: Smart wallet scheduler started')
    await SmartWalletBatchService.syncAll()
  },
  {
    timezone: 'Asia/Jakarta'
  }
)
