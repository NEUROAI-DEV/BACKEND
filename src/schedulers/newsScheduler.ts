import cron from 'node-cron'
import logger from '../logs'
import { NewsModel } from '../models/newsMode'
import { CryptoPanicService } from '../services/external/CryptopanicService'

const NewsScheduler = () => {
  cron.schedule(
    '*/5 * * * *',
    async () => {
      logger.info('[NewsScheduler] - run news scheduler')

      const news = await CryptoPanicService.fetchNews()

      for (const item of news) {
        await NewsModel.findOrCreate({
          where: { newsExternalId: item.id },
          defaults: {
            newsExternalId: item?.id,
            newsTitle: item?.title,
            newsSlug: item?.slug,
            newsDescription: item?.description,
            newsPublishedAt: item?.published_at,
            newsCreatedAt: item?.created_at,
            kind: item?.kind
          }
        })
      }

      logger.info('[NewsScheduler] - news scheduler run sucessfully')
    },
    { timezone: 'Asia/Jakarta' }
  )
}

export default NewsScheduler
