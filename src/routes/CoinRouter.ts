import { Router } from 'express'
import { CoinController } from '../controllers/coin'
import { MiddleWares } from '../middlewares'
import {
  CreateCoinSchema,
  FindAllCoinSchema,
  FindDetailCoinSchema,
  RemoveCoinSchema,
  UpdateCoinSchema
} from '../schemas/CoinSchema'

const CoinRouter = Router()

CoinRouter.get(
  '/',
  MiddleWares.validate({ query: FindAllCoinSchema }),
  CoinController.findAll
)

CoinRouter.get(
  '/detail/:coinId',
  MiddleWares.validate({ params: FindDetailCoinSchema }),
  CoinController.findDetail
)

CoinRouter.post(
  '/',
  MiddleWares.useAuthorization,
  MiddleWares.validate({ body: CreateCoinSchema }),
  CoinController.create
)

CoinRouter.patch(
  '/',
  MiddleWares.useAuthorization,
  MiddleWares.validate({ body: UpdateCoinSchema }),
  CoinController.update
)

CoinRouter.delete(
  '/:coinId',
  MiddleWares.useAuthorization,
  MiddleWares.validate({ params: RemoveCoinSchema }),
  CoinController.remove
)

export default CoinRouter
