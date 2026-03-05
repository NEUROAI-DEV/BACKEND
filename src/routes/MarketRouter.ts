import { Router } from 'express'
import { MarketController } from '../controllers/market'
import { FindAllCoinSchema } from '../schemas/CoinMarketSchema'
import { GetTrendingCoinsQuerySchema } from '../schemas/TrendingCoinSchema'
import { MiddleWares } from '../middlewares'

const MarketRouter = Router()

MarketRouter.get('/top-signals', MarketController.findTopSignal)
MarketRouter.get('/daily-summary', MarketController.findDailySummary)
MarketRouter.get('/ai-signals', MarketController.findAiSignal)
MarketRouter.get(
  '/trending-coins',
  MiddleWares.validate({ query: GetTrendingCoinsQuerySchema }),
  MarketController.getTrendingCoins
)
MarketRouter.get(
  '/coins/gecko',
  MiddleWares.validate({ query: FindAllCoinSchema }),
  MarketController.findAllCoin
)

export default MarketRouter
