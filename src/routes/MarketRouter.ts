import { Router } from 'express'
import { MarketController } from '../controllers/market'

const MarketRouter = Router()

MarketRouter.get('/top-signals', MarketController.findTopSignal)
MarketRouter.get('/daily-summary', MarketController.findDailySummary)
MarketRouter.get('/ai-signals', MarketController.findAiSignal)
MarketRouter.get('/predictions/live', MarketController.findLivePrediction)
MarketRouter.get('/coins', MarketController.findUsdtSymbols)
MarketRouter.get('/coins/gecko', MarketController.findAllCoin)

export default MarketRouter
