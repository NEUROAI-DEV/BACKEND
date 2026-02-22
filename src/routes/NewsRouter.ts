import { Router } from 'express'
import { NewsController } from '../controllers/news'
import { MiddleWares } from '../middlewares'
import { findAllNewsSchema, findDetailNewsSchema } from '../schemas/NewsSchema'

const NewsRoute = Router()

NewsRoute.get(
  '/',
  MiddleWares.validate({ query: findAllNewsSchema }),
  NewsController.findAll
)
NewsRoute.get(
  '/detail/:newsId',
  MiddleWares.validate({ params: findDetailNewsSchema }),
  NewsController.findDetail
)

export default NewsRoute
