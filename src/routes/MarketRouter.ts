import { Router } from 'express'
import { MarketController } from '../controllers/market'

const MarketRouter = Router()

MarketRouter.get('/top-signals', MarketController.findTopSignal)

export default MarketRouter
