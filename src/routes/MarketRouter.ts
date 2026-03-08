import { Router } from 'express'
import { MarketController } from '../controllers/market'

const MarketRouter = Router()

MarketRouter.get('/daily-summary', MarketController.findDailySummary)

export default MarketRouter
