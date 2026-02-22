import { Router } from 'express'
import { ScreenerController } from '../controllers/screener'
import { MiddleWares } from '../middlewares'
import {
  createScreenerSchema,
  findAllScreenerSchema,
  removeScreenerSchema
} from '../schemas/ScreenerSchema'

const ScreenerRouter = Router()

ScreenerRouter.use(MiddleWares.useAuthorization)
ScreenerRouter.post(
  '/',
  MiddleWares.validate({ body: createScreenerSchema }),
  ScreenerController.createScreener
)
ScreenerRouter.get(
  '/',
  MiddleWares.validate({ query: findAllScreenerSchema }),
  ScreenerController.findAllScreener
)
ScreenerRouter.delete(
  '/:screenerId',
  MiddleWares.validate({ params: removeScreenerSchema }),
  ScreenerController.removeScreener
)

export default ScreenerRouter
