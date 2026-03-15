import { Router } from 'express'
import { ScreenerController } from '../controllers/screener'
import { MiddleWares } from '../middlewares'
import { FindAllScreenerSchema } from '../schemas/ScreenerSchema'

const ScreenerRouter = Router()

// ScreenerRouter.use(MiddleWares.useAuthorization)
// ScreenerRouter.use(MiddleWares.requireActiveSubscription)

ScreenerRouter.get(
  '/',
  MiddleWares.validate({ query: FindAllScreenerSchema }),
  ScreenerController.findAllScreener
)

export default ScreenerRouter
