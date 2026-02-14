import { Router } from 'express'
import { StatsController } from '../controllers/stats'

const StatsRouter = Router()

StatsRouter.get('/', StatsController.getStats)

export default StatsRouter
