import { Router } from 'express'
import { LivePredictController } from '../controllers/livePredict'
import { MiddleWares } from '../middlewares'
import {
  CreateLivePredictSchema,
  FindAllLivePredictSchema,
  FindDetailLivePredictSchema,
  RemoveLivePredictSchema,
  UpdateLivePredictSchema
} from '../schemas/LivePredictSchema'

const LivePredictRouter = Router()

LivePredictRouter.get(
  '/',
  MiddleWares.validate({ query: FindAllLivePredictSchema }),
  LivePredictController.findAll
)

LivePredictRouter.get(
  '/detail/:livePredictId',
  MiddleWares.validate({ params: FindDetailLivePredictSchema }),
  LivePredictController.findDetail
)

LivePredictRouter.post(
  '/',
  MiddleWares.useAuthorization,
  MiddleWares.validate({ body: CreateLivePredictSchema }),
  LivePredictController.create
)

LivePredictRouter.patch(
  '/',
  MiddleWares.useAuthorization,
  MiddleWares.validate({ body: UpdateLivePredictSchema }),
  LivePredictController.update
)

LivePredictRouter.delete(
  '/:livePredictId',
  MiddleWares.useAuthorization,
  MiddleWares.validate({ params: RemoveLivePredictSchema }),
  LivePredictController.remove
)

export default LivePredictRouter
