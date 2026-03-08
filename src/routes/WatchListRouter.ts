import { Router } from 'express'
import { WatchListController } from '../controllers/watchlist'
import { MiddleWares } from '../middlewares'
import {
  GetWatchListQuerySchema,
  CreateWatchListSchema,
  DeleteWatchListSchema
} from '../schemas/WatchListSchema'

const WatchListRouter = Router()

WatchListRouter.get(
  '/',
  MiddleWares.validate({ query: GetWatchListQuerySchema }),
  WatchListController.getWatchList
)
WatchListRouter.post(
  '/',
  MiddleWares.useAuthorization,
  MiddleWares.validate({ body: CreateWatchListSchema }),
  WatchListController.createWatchList
)
WatchListRouter.delete(
  '/:watchListId',
  MiddleWares.validate({ params: DeleteWatchListSchema }),
  WatchListController.deleteWatchList
)

export default WatchListRouter
