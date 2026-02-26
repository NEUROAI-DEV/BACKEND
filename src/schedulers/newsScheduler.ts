import cron from 'node-cron'
import logger from '../../logs'
import { NewsModel } from '../models/newsMode'
import { CryptoPanicService } from '../services/external/CryptoPanicService'
import { SentimentService } from '../services/llm/SentimentAnalysis'

const CRON_EVERY_HOUR = '0 * * * *'

export async function runNewsJob(): Promise<void> {
  logger.info('[NewsScheduler] - run news scheduler')

  const news = await CryptoPanicService.fetchNews()

  for (const item of news) {
    const checkExistingNews = await NewsModel.findOne({
      where: {
        newsTitle: item.title
      }
    })

    if (checkExistingNews) {
      continue
    }

    const sentiment = await SentimentService.analyze(
      `title: ${item?.title}. description: ${item?.description}`
    )

    await NewsModel.create({
      newsExternalId: item?.id,
      newsTitle: item?.title,
      newsSlug: item?.slug,
      newsDescription: item?.description,
      newsPublishedAt: item?.published_at,
      newsCreatedAt: item?.created_at,
      newsKind: item?.kind,
      newsSentiment: sentiment?.sentiment,
      newsSentimentConfidence: sentiment?.confidence,
      newsSentimentReason: sentiment?.reason
    })
  }

  logger.info('[NewsScheduler] - news scheduler run successfully')
}

const NewsScheduler = () => {
  cron.schedule(
    CRON_EVERY_HOUR,
    async () => {
      try {
        await runNewsJob()
      } catch (error: any) {
        logger.error(`[NewsScheduler] Failed: ${error?.message}`)
      }
    },
    { timezone: 'Asia/Jakarta' }
  )
}

export default NewsScheduler
