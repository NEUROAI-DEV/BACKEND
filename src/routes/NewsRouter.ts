import { Router } from 'express'
import { NewsController } from '../controllers/news'
import { MiddleWares } from '../middlewares'
import { FindAllNewsSchema, FindDetailNewsSchema } from '../schemas/NewsSchema'

const NewsRoute = Router()

NewsRoute.get(
  '/',
  MiddleWares.validate({ query: FindAllNewsSchema }),
  NewsController.findAll
)
NewsRoute.get(
  '/detail/:newsId',
  MiddleWares.validate({ params: FindDetailNewsSchema }),
  NewsController.findDetail
)

export default NewsRoute
