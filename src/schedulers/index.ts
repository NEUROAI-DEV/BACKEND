import { Op } from 'sequelize'
import logger from '../../logs'
import DailySummaryScheduler from './dailySummaryScheduler'
import NewsScheduler from './newsScheduler'
import { runNewsJob } from './newsScheduler'
import { runDailySummaryJob } from './dailySummaryScheduler'
import { NewsModel } from '../models/newsMode'
import { DailySummaryStoreService } from '../services/DailySummaryStoreService'
import { ScreenerScheduler } from './screenerScheduler'
import { CoinMarketScheduler } from './coinMarketScheduler'
import { SmartWalletTrackerScheduller } from './smartWalletTrackerScheduller'
import { LivePredictResultScheduler } from './livePredictResultScheduler'

function getTodayBoundsJakarta(): { start: Date; end: Date } {
  const todayStr = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Jakarta'
  })
  const start = new Date(`${todayStr}T00:00:00+07:00`)
  const end = new Date(`${todayStr}T23:59:59.999+07:00`)
  return { start, end }
}

/**
 * Saat aplikasi pertama kali dijalankan: jika belum ada data news atau daily summary
 * untuk hari ini (Asia/Jakarta), jalankan job news dulu lalu daily summary sekali.
 */
export async function runStartupCheck(): Promise<void> {
  try {
    const { start, end } = getTodayBoundsJakarta()

    const hasNewsToday = await NewsModel.findOne({
      where: { createdAt: { [Op.between]: [start, end] } }
    })

    const dailySummaryToday = await DailySummaryStoreService.get(new Date())
    const hasDailySummaryToday = dailySummaryToday != null

    if (hasNewsToday != null && hasDailySummaryToday) {
      logger.info('[Scheduler] Startup check: data untuk hari ini sudah ada, skip run.')
      return
    }

    logger.info(
      '[Scheduler] Startup check: belum ada data untuk hari ini, jalankan news lalu daily summary.'
    )

    if (hasNewsToday == null) {
      await runNewsJob()
    }

    await runNewsJob()

    await runDailySummaryJob()
    logger.info('[Scheduler] Startup check selesai.')
  } catch (error: any) {
    logger.error(`[Scheduler] Startup check gagal: ${error?.message}`)
  }
}

export const Scheduler = {
  NewsScheduler,
  DailySummaryScheduler,
  runStartupCheck,
  ScreenerScheduler,
  CoinMarketScheduler,
  SmartWalletTrackerScheduller,
  LivePredictResultScheduler
}
