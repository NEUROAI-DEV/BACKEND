import { Router } from 'express'
import { MarketController } from '../controllers/market'

const MarketRouter = Router()

MarketRouter.get('/top-signals', MarketController.findTopSignal)
MarketRouter.get('/daily-summary', MarketController.findDailySummary)
MarketRouter.get('/ai-signals', MarketController.findAiSignal)
MarketRouter.get('/predictions/live', MarketController.findLivePrediction)

export default MarketRouter
