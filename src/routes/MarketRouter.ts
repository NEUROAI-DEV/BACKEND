import { Router } from 'express'
import { MarketController } from '../controllers/market'
import { FindAllCoinSchema, FindUsdtSymbolsSchema } from '../schemas/CoinMarketSchema'
import { FindLivePredictionSchema } from '../schemas/LivePredictionSchema'
import { MiddleWares } from '../middlewares'

const MarketRouter = Router()

MarketRouter.get('/top-signals', MarketController.findTopSignal)
MarketRouter.get('/daily-summary', MarketController.findDailySummary)
MarketRouter.get('/ai-signals', MarketController.findAiSignal)
MarketRouter.get(
  '/predictions/live',
  MiddleWares.validate({ query: FindLivePredictionSchema }),
  MarketController.findLivePrediction
)
MarketRouter.get(
  '/coins',
  MiddleWares.validate({ query: FindUsdtSymbolsSchema }),
  MarketController.findUsdtSymbols
)
MarketRouter.get(
  '/coins/gecko',
  MiddleWares.validate({ query: FindAllCoinSchema }),
  MarketController.findAllCoin
)

export default MarketRouter
