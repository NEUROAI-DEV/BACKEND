import { Router } from 'express'
import { PredictController } from '../controllers/predict'
import { MiddleWares } from '../middlewares'
import {
  FindAllPredictSchema,
  RemovePredictSchema,
  RunPredictSchema
} from '../schemas/PredictSchema'

const PredictRouter = Router()

PredictRouter.get(
  '/',
  MiddleWares.useAuthorization,
  MiddleWares.validate({ query: FindAllPredictSchema }),
  PredictController.findAll
)

PredictRouter.post(
  '/run',
  MiddleWares.useAuthorization,
  MiddleWares.validate({ body: RunPredictSchema }),
  PredictController.runPredictions
)

PredictRouter.delete(
  '/:predictId',
  MiddleWares.useAuthorization,
  MiddleWares.validate({ params: RemovePredictSchema }),
  PredictController.remove
)

export default PredictRouter
