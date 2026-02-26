import { Router } from 'express'
import { ScreenerController } from '../controllers/screener'
import { MiddleWares } from '../middlewares'
import {
  CreateScreenerSchema,
  FindAllScreenerSchema,
  RemoveScreenerSchema
} from '../schemas/ScreenerSchema'

const ScreenerRouter = Router()

ScreenerRouter.use(MiddleWares.useAuthorization)
ScreenerRouter.use(MiddleWares.requireActiveSubscription)

ScreenerRouter.post(
  '/',
  MiddleWares.validate({ body: CreateScreenerSchema }),
  ScreenerController.createScreener
)
ScreenerRouter.get(
  '/',
  MiddleWares.validate({ query: FindAllScreenerSchema }),
  ScreenerController.findAllScreener
)
ScreenerRouter.delete(
  '/:screenerId',
  MiddleWares.validate({ params: RemoveScreenerSchema }),
  ScreenerController.removeScreener
)

export default ScreenerRouter
