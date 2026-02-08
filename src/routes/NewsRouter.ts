import { Router } from 'express'
import { NewsController } from '../controllers/news'

const NewsRoute = Router()

NewsRoute.get('/', NewsController.findAll)
NewsRoute.get('/detail/:newsId', NewsController.findDetail)

export default NewsRoute
