import { Router } from 'express'
import { ScreenerController } from '../controllers/screener'
import { MiddleWares } from '../middlewares'

const ScreenerRouter = Router()

ScreenerRouter.use(MiddleWares.useAuthorization)
ScreenerRouter.post('/', ScreenerController.createScreener)
ScreenerRouter.get('/', ScreenerController.findAllScreener)

export default ScreenerRouter
