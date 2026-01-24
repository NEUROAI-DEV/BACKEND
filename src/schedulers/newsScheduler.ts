import cron from 'node-cron'
import logger from '../logs'
import { NewsModel } from '../models/newsMode'
import { CryptoPanicService } from '../services/external/CryptopanicService'

cron.schedule(
  '*/5 * * * *',
  async () => {
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
  },
  { timezone: 'Asia/Jakarta' }
)
