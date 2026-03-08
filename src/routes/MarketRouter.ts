import { Router } from 'express'
import { MarketController } from '../controllers/market'
import { FindAllCoinSchema } from '../schemas/CoinMarketSchema'
import { MiddleWares } from '../middlewares'

const MarketRouter = Router()

MarketRouter.get('/daily-summary', MarketController.findDailySummary)
MarketRouter.get('/ai-signals', MarketController.findAiSignal)
MarketRouter.get(
  '/coins/gecko',
  MiddleWares.validate({ query: FindAllCoinSchema }),
  MarketController.findAllCoin
)

export default MarketRouter
